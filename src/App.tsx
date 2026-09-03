import { useState, useEffect, useRef, useCallback } from 'react';
import {
  HelpCircle,
  ShoppingBag,
  Clock,
  Menu,
  X,
  Droplet,
  Sprout,
  Volume2,
  VolumeX,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import BrandLogo from './components/BrandLogo';
import LiveAuraCard from './components/LiveAuraCard';
import CameraCard from './components/CameraCard';
import AuraTimelineCard from './components/AuraTimelineCard';
import AuraShiftOverlay from './components/AuraShiftOverlay';
import ResetModal from './components/ResetModal';
import HowItWorksModal from './components/HowItWorksModal';
import AuraStoreView from './components/AuraStoreView';
import AuraBloomView from './components/AuraBloomView';
import AuraBloomCard from './components/AuraBloomCard';
import AuraBuddy from './components/AuraBuddy';
import AuraJourney from './components/AuraJourney';
import DemoTourModal from './components/DemoTourModal';
import SessionSummaryModal from './components/SessionSummaryModal';
import {
  AuraState,
  CameraStatus,
  FaceCueStatus,
  AuraSnapshot,
  StoreItem,
  SessionRecord,
  TodayVsYouComparison,
  PlantedTree,
  AuraBuddyProfile,
  Achievement,
} from './types';
import {
  getAuraStateFromScore,
  getStateDescription,
  getBloomStage,
} from './data/storeCatalog';
import { soundEngine } from './utils/audio';
import {
  loadAuraPoints,
  saveAuraPoints,
  loadBuddyProfile,
  saveBuddyProfile,
  addBuddyXp,
  loadPlantedTrees,
  savePlantedTrees,
  addTreeGrowthMinutes,
  loadSessionHistory,
  saveSessionRecord,
  loadAchievements,
  saveAchievements,
  updateAchievements,
  computeJourneyStats,
  calculateSessionRewards,
  generateTodayVsYou,
} from './utils/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'session' | 'bloom' | 'journey' | 'store'>('session');
  const [sessionActive, setSessionActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [cueStatus, setCueStatus] = useState<FaceCueStatus>('loading');
  const [cameraErrorMessage, setCameraErrorMessage] = useState<string | undefined>();
  const [studyScore, setStudyScore] = useState(20);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [resetsInSessionCount, setResetsInSessionCount] = useState(0);

  // Persistent user state
  const [auraPoints, setAuraPoints] = useState<number>(() => loadAuraPoints());
  const [buddy, setBuddy] = useState<AuraBuddyProfile>(() => loadBuddyProfile());
  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>(() => loadPlantedTrees());
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadSessionHistory());
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievements());
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>([
    'moonfern',
    'sunspool',
    'stone-arch',
    'bonsai-pine',
    'silk-scarf',
    'wooden-stick',
  ]);

  // Session score history for calculating true average
  const sessionScoresRef = useRef<number[]>([]);

  // Modals
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isAuraShiftOpen, setIsAuraShiftOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Post-session summary modal state
  const [completedSessionRecord, setCompletedSessionRecord] = useState<SessionRecord | null>(null);
  const [todayVsYouData, setTodayVsYouData] = useState<TodayVsYouComparison | null>(null);

  // Timeline Snapshots
  const [snapshots, setSnapshots] = useState<AuraSnapshot[]>([]);

  // High load monitoring for auto Aura Shift intervention
  const highLoadStartTime = useRef<number | null>(null);
  const auraShiftTriggeredThisSpike = useRef(false);

  const currentAuraState = getAuraStateFromScore(studyScore);

  // Sync state to local persistence
  const updateAndSavePoints = useCallback((updater: (prev: number) => number) => {
    setAuraPoints((prev) => {
      const next = Math.max(0, updater(prev));
      saveAuraPoints(next);
      return next;
    });
  }, []);

  const updateAndSaveBuddy = useCallback((newBuddy: AuraBuddyProfile) => {
    setBuddy(newBuddy);
    saveBuddyProfile(newBuddy);
  }, []);

  // Add timeline snapshot
  const recordSnapshot = useCallback(
    (score: number, detail: string, trigger?: string) => {
      const state = getAuraStateFromScore(score);
      const newSnap: AuraSnapshot = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
        state,
        score,
        detail,
        trigger,
      };
      setSnapshots((prev) => [newSnap, ...prev].slice(0, 15));
    },
    []
  );

  // Session timer & passive tree nurture
  useEffect(() => {
    if (!sessionActive) return;

    const timer = setInterval(() => {
      setElapsedSeconds((sec) => {
        const next = sec + 1;
        // Collect score samples
        sessionScoresRef.current.push(studyScore);

        // Every 60 seconds of mindful study, reward 1 Aura Point & channel growth into planted trees
        if (next % 60 === 0) {
          updateAndSavePoints((p) => p + 1);
          soundEngine.playDewEarnedTone();
          setPlantedTrees((trees) => {
            const updated = addTreeGrowthMinutes(trees, 1);
            savePlantedTrees(updated);
            return updated;
          });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionActive, studyScore, updateAndSavePoints]);

  // Periodic subtle presence / simulation update if camera is off or idle
  useEffect(() => {
    if (!sessionActive || cameraStatus === 'live') return;

    const interval = setInterval(() => {
      setStudyScore((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        const newScore = Math.min(85, Math.max(12, prev + delta));
        return newScore;
      });
      recordSnapshot(studyScore, 'Camera-free check-in · steady study rhythm');
    }, 12000);

    return () => clearInterval(interval);
  }, [sessionActive, cameraStatus, studyScore, recordSnapshot]);

  // High load detection (intervenes when score >= 70 for 18 seconds)
  useEffect(() => {
    if (!sessionActive || studyScore < 70) {
      highLoadStartTime.current = null;
      auraShiftTriggeredThisSpike.current = false;
      return;
    }

    if (highLoadStartTime.current === null) {
      highLoadStartTime.current = Date.now();
    }

    const checkInterval = setInterval(() => {
      if (
        highLoadStartTime.current !== null &&
        !auraShiftTriggeredThisSpike.current &&
        Date.now() - highLoadStartTime.current >= 18000
      ) {
        auraShiftTriggeredThisSpike.current = true;
        recordSnapshot(studyScore, '20-second breathing intervention started', 'AURA SHIFT');
        setIsAuraShiftOpen(true);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [sessionActive, studyScore, recordSnapshot]);

  // Handle start session
  const handleStartSession = (withCamera: boolean) => {
    setSessionActive(true);
    setElapsedSeconds(0);
    setStudyScore(22);
    setResetsInSessionCount(0);
    sessionScoresRef.current = [22];

    if (withCamera) {
      setCameraStatus('requesting');
      navigator.mediaDevices
        ?.getUserMedia({ video: true })
        .then(() => {
          setCameraStatus('live');
          setCueStatus('ready');
          recordSnapshot(22, 'Session started with on-device camera presence');
        })
        .catch(() => {
          setCameraStatus('denied');
          setCueStatus('error');
          setCameraErrorMessage('Camera access was not granted. Session running camera-free.');
          recordSnapshot(22, 'Session started camera-free (access not granted)');
        });
    } else {
      setCameraStatus('skipped');
      setCueStatus('no-face');
      recordSnapshot(22, 'Camera-free session started');
    }
  };

  // Handle End Session & Calculate Post-Session Rewards
  const handleEndSession = () => {
    setSessionActive(false);
    if (cameraStatus === 'live') {
      setCameraStatus('stopped');
    }
    recordSnapshot(studyScore, 'Session completed peacefully');

    // Compute session metrics
    const scores = sessionScoresRef.current.length > 0 ? sessionScoresRef.current : [studyScore];
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const effectiveSeconds = Math.max(elapsedSeconds, 45); // ensure minimum demo feedback

    const { pointsEarned, xpEarned, breakdown } = calculateSessionRewards(
      effectiveSeconds,
      resetsInSessionCount,
      avgScore
    );

    const newRecord: SessionRecord = {
      id: `sess-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      durationSeconds: effectiveSeconds,
      avgScore,
      resetsCount: resetsInSessionCount,
      pointsEarned,
      xpEarned,
      breakdown,
      withCamera: cameraStatus === 'live',
    };

    // Save session
    const updatedSessions = saveSessionRecord(newRecord);
    setSessions(updatedSessions);

    // Award Points
    updateAndSavePoints((p) => p + pointsEarned);

    // Award Companion XP & Level
    const { updatedBuddy } = addBuddyXp(buddy, xpEarned);
    updateAndSaveBuddy(updatedBuddy);

    // Update Achievements
    const updatedAchievements = updateAchievements(achievements, updatedSessions, updatedBuddy, plantedTrees);
    setAchievements(updatedAchievements);
    saveAchievements(updatedAchievements);

    // Generate Today vs You comparison
    const comparison = generateTodayVsYou(newRecord, updatedSessions);
    setCompletedSessionRecord(newRecord);
    setTodayVsYouData(comparison);

    soundEngine.playDewEarnedTone();
  };

  // Demo Trigger for Session Complete (lets judges test the modal directly)
  const handleTriggerDemoSessionComplete = () => {
    const demoRecord: SessionRecord = {
      id: `demo-${Date.now()}`,
      date: 'Today',
      timestamp: Date.now(),
      durationSeconds: 1500, // 25 min
      avgScore: 28,
      resetsCount: 2,
      pointsEarned: 35,
      xpEarned: 60,
      breakdown: [
        { label: 'Deep Focus Duration (25m)', points: 25 },
        { label: 'Mindful Resets (2 completed)', points: 6 },
        { label: 'Calm Rhythm Bonus', points: 4 },
      ],
      withCamera: true,
    };

    const comp = generateTodayVsYou(demoRecord, sessions);
    setCompletedSessionRecord(demoRecord);
    setTodayVsYouData(comp);
  };

  // Enable Camera during session
  const handleEnableCamera = () => {
    setCameraStatus('requesting');
    setCameraErrorMessage(undefined);
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .then(() => {
        setCameraStatus('live');
        setCueStatus('ready');
        recordSnapshot(studyScore, 'Camera cues enabled');
      })
      .catch(() => {
        setCameraStatus('denied');
        setCueStatus('error');
        setCameraErrorMessage('Camera permission was not granted. Continuing camera-free.');
      });
  };

  const handleStopCamera = () => {
    setCameraStatus('stopped');
    recordSnapshot(studyScore, 'Camera stopped · session cues are camera-free');
  };

  const handleSkipCamera = () => {
    setCameraStatus('skipped');
  };

  // Handle local presence updates from video frame differences
  const handlePresenceUpdate = useCallback(
    (presence: { stillness: number; movement: number; detail: string }) => {
      setStudyScore((prev) => {
        let target = prev;
        if (presence.movement > 35) {
          target = Math.min(88, prev + 3);
        } else if (presence.stillness > 70) {
          target = Math.max(14, prev - 2);
        }
        return target;
      });

      if (Math.random() > 0.75) {
        recordSnapshot(studyScore, presence.detail);
      }
    },
    [studyScore, recordSnapshot]
  );

  // Intervention handlers
  const handleAuraShiftComplete = () => {
    setIsAuraShiftOpen(false);
    setStudyScore(24);
    updateAndSavePoints((p) => p + 5);
    setResetsInSessionCount((c) => c + 1);
    recordSnapshot(24, 'Aura Shift reset completed · baseline restored', 'RESET COMPLETE');
  };

  const handleAuraShiftSkip = () => {
    setIsAuraShiftOpen(false);
    highLoadStartTime.current = null;
  };

  const handleResetComplete = (pointsBonus: number) => {
    setStudyScore((s) => Math.max(18, s - 25));
    updateAndSavePoints((p) => p + pointsBonus);
    setResetsInSessionCount((c) => c + 1);
    recordSnapshot(studyScore, 'Manual guided breathing break completed', '+POINTS EARNED');
  };

  const handleNourishBloom = (cost: number) => {
    if (auraPoints >= cost) {
      updateAndSavePoints((p) => p - cost);
      recordSnapshot(studyScore, `Nourished AuraBloom with ${cost} Points`, '+BLOOM VITALITY');
    }
  };

  const handleToggleSound = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsSoundMuted(nextMuted);
  };

  // Purchase Store item (handles trees, buddy accessories, garden decor)
  const handlePurchaseItem = (item: StoreItem) => {
    if (auraPoints >= item.cost && !unlockedItemIds.includes(item.id)) {
      updateAndSavePoints((p) => p - item.cost);
      setUnlockedItemIds((prev) => [...prev, item.id]);

      // If item is a tree, plant it!
      if (item.category === 'Trees') {
        const newTree: PlantedTree = {
          id: `tree-${Date.now()}`,
          treeItemId: item.id,
          name: item.name,
          species: item.name.includes('Bonsai') ? 'Bonsai Pine' : item.name.includes('Cherry') ? 'Sakura' : 'Oak',
          plantedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          growthMinutes: 0,
          stage: 'Seed',
        };
        const updated = [...plantedTrees, newTree];
        setPlantedTrees(updated);
        savePlantedTrees(updated);
      }

      // If item is accessory or toy, equip it!
      if (item.category === 'Accessories') {
        updateAndSaveBuddy({ ...buddy, equippedAccessory: item.id });
      } else if (item.category === 'Toys') {
        updateAndSaveBuddy({ ...buddy, equippedToy: item.id });
      }
    }
  };

  const handleEquipAccessory = (id: string) => {
    const next = buddy.equippedAccessory === id ? undefined : id;
    updateAndSaveBuddy({ ...buddy, equippedAccessory: next });
  };

  const handleEquipToy = (id: string) => {
    const next = buddy.equippedToy === id ? undefined : id;
    updateAndSaveBuddy({ ...buddy, equippedToy: next });
  };

  const bloomFocusMinutes = Math.floor(elapsedSeconds / 60);
  const { currentStage: bloomCurrentStage } = getBloomStage(bloomFocusMinutes);
  const journeyStats = computeJourneyStats(sessions, plantedTrees, auraPoints);

  return (
    <div className="paper-grain min-h-screen bg-[#f8f5ec] text-[#202840] font-sans antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-[#dedace] bg-[#f8f5ec]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand */}
          <div
            onClick={() => setCurrentTab('session')}
            className="cursor-pointer"
          >
            <BrandLogo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={() => setCurrentTab('session')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                currentTab === 'session'
                  ? 'bg-[#e7f2ee] text-[#356a64]'
                  : 'text-[#627075] hover:text-[#202840]'
              }`}
              data-testid="link-live-session"
            >
              Live Session
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('bloom')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                currentTab === 'bloom'
                  ? 'bg-[#e7f2ee] text-[#356a64]'
                  : 'text-[#627075] hover:text-[#202840]'
              }`}
              data-testid="link-aurabloom"
            >
              <Sprout className="h-3.5 w-3.5 text-[#3a8c83]" />
              <span>AuraBloom</span>
              <span className="rounded-full bg-[#dedace] px-1.5 py-0.2 font-mono text-[9px] text-[#4d5b60]">
                Lvl {bloomCurrentStage.level}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('journey')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                currentTab === 'journey'
                  ? 'bg-[#e7f2ee] text-[#356a64]'
                  : 'text-[#627075] hover:text-[#202840]'
              }`}
              data-testid="link-aura-journey"
            >
              <TrendingUp className="h-3.5 w-3.5 text-[#3a8c83]" />
              <span>Aura Journey</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('store')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                currentTab === 'store'
                  ? 'bg-[#e7f2ee] text-[#356a64]'
                  : 'text-[#627075] hover:text-[#202840]'
              }`}
              data-testid="link-aura-store"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Store & Garden</span>
              <span className="flex items-center gap-1 rounded-full bg-[#dedace] px-2 py-0.5 font-mono text-[10px] text-[#4d5b60]">
                <Sparkles className="h-2.5 w-2.5 text-[#d08b32] fill-current" />
                {auraPoints}
              </span>
            </button>
          </nav>

          {/* Right Status & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Hackathon Demo Tour Mode Button */}
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#f6c986] bg-[#fdf3e2] px-3 py-1.5 font-mono text-[11px] font-bold text-[#8b591b] shadow-xs hover:bg-[#fae7c8] transition-all"
              data-testid="button-open-demo-mode"
              title="Step through the full experience in Demo Mode"
            >
              <Zap className="h-3.5 w-3.5 fill-[#d08b32] text-[#d08b32]" />
              <span>Demo Tour</span>
            </button>

            {/* Audio Mute/Unmute toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#dedace] bg-[#fbf8ef] text-[#637276] transition-colors hover:bg-[#eae5d8]"
              title={isSoundMuted ? 'Unmute audio chimes' : 'Mute audio chimes'}
              data-testid="button-toggle-sound"
            >
              {isSoundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Help / How it works */}
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#dedace] bg-[#fbf8ef] text-[#637276] transition-colors hover:bg-[#eae5d8]"
              aria-label="Learn how AuraLens works"
              data-testid="button-help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[#dedace] bg-[#fbf8ef] text-[#637276] sm:hidden"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[#dedace] bg-[#fbf8ef] px-4 py-3 sm:hidden space-y-2">
            <button
              type="button"
              onClick={() => {
                setCurrentTab('session');
                setMobileMenuOpen(false);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-bold ${
                currentTab === 'session' ? 'bg-[#e7f2ee] text-[#356a64]' : 'text-[#627075]'
              }`}
              data-testid="link-mobile-live-session"
            >
              Live Session
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTab('bloom');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold ${
                currentTab === 'bloom' ? 'bg-[#e7f2ee] text-[#356a64]' : 'text-[#627075]'
              }`}
              data-testid="link-mobile-aurabloom"
            >
              <span>AuraBloom Sanctuary</span>
              <span className="rounded-full bg-[#dedace] px-2 py-0.5 font-mono text-[10px]">
                Lvl {bloomCurrentStage.level}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTab('journey');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold ${
                currentTab === 'journey' ? 'bg-[#e7f2ee] text-[#356a64]' : 'text-[#627075]'
              }`}
              data-testid="link-mobile-journey"
            >
              <span>Aura Journey</span>
              <span className="rounded-full bg-[#dedace] px-2 py-0.5 font-mono text-[10px]">
                {sessions.length} sessions
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTab('store');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold ${
                currentTab === 'store' ? 'bg-[#e7f2ee] text-[#356a64]' : 'text-[#627075]'
              }`}
              data-testid="link-mobile-store"
            >
              <span>Aura Store & Garden</span>
              <span className="rounded-full bg-[#dedace] px-2 py-0.5 font-mono text-[10px]">
                {auraPoints} Points
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsHowItWorksOpen(true);
                setMobileMenuOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#627075]"
              data-testid="button-mobile-how"
            >
              How AuraLens Works
            </button>
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {currentTab === 'session' ? (
          <div>
            {/* Session Hero Banner */}
            <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#869599]">
                  Mindful Study Ecosystem
                </p>
                <h2 className="mt-1 font-serif text-[28px] font-bold leading-tight tracking-[-0.04em] text-[#202840] sm:text-[34px]">
                  Notice your rhythm,{' '}
                  <span className="text-[#3a8c83]">not judge it.</span>
                </h2>
              </div>

              {sessionActive && (
                <div className="flex items-center gap-2 rounded-xl border border-[#dedace] bg-[#fbf8ef] px-3 py-2 text-xs text-[#526065]">
                  <Clock className="h-3.5 w-3.5 text-[#3a8c83]" />
                  <span>
                    Status: <strong>{getStateDescription(currentAuraState)}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Layout Grid */}
            <div className="grid gap-6 lg:grid-cols-[minmax(420px,1.25fr)_minmax(300px,380px)]">
              {/* Left Column: Live Aura, AuraBloom, AuraBuddy */}
              <div className="space-y-6">
                <LiveAuraCard
                  sessionActive={sessionActive}
                  state={currentAuraState}
                  score={studyScore}
                  elapsedSeconds={elapsedSeconds}
                  cameraAvailable={cameraStatus === 'live'}
                  onStartSession={handleStartSession}
                  onEndSession={handleEndSession}
                  onOpenReset={() => setIsResetOpen(true)}
                />

                {/* Living Botanical Focus Companion Card */}
                <AuraBloomCard
                  elapsedSeconds={elapsedSeconds}
                  dewBalance={auraPoints}
                  currentAuraState={currentAuraState}
                  onNourish={handleNourishBloom}
                  onOpenFullBloom={() => setCurrentTab('bloom')}
                />

                {/* Gemini-Powered Mindful AI Study Companion */}
                <AuraBuddy
                  currentAuraState={currentAuraState}
                  studyScore={studyScore}
                  buddy={buddy}
                  onUpdateBuddy={updateAndSaveBuddy}
                />
              </div>

              {/* Right Column: Camera Presence & Cognitive Timeline */}
              <div className="space-y-6">
                <CameraCard
                  cameraStatus={cameraStatus}
                  cueStatus={cueStatus}
                  errorMessage={cameraErrorMessage}
                  onEnableCamera={handleEnableCamera}
                  onStopCamera={handleStopCamera}
                  onSkipCamera={handleSkipCamera}
                  onPresenceUpdate={handlePresenceUpdate}
                />

                <AuraTimelineCard snapshots={snapshots} />
              </div>
            </div>
          </div>
        ) : currentTab === 'bloom' ? (
          /* AuraBloom Living Botanical Sanctuary View */
          <AuraBloomView
            elapsedSeconds={elapsedSeconds}
            dewBalance={auraPoints}
            currentAuraState={currentAuraState}
            trees={plantedTrees}
            onNourish={handleNourishBloom}
            onReturnToSession={() => setCurrentTab('session')}
            onGoToStore={() => setCurrentTab('store')}
          />
        ) : currentTab === 'journey' ? (
          /* Aura Journey Progress & Milestones View */
          <AuraJourney
            stats={journeyStats}
            buddy={buddy}
            trees={plantedTrees}
            sessions={sessions}
            achievements={achievements}
            auraPoints={auraPoints}
            onReturnToSession={() => setCurrentTab('session')}
            onGoToStore={() => setCurrentTab('store')}
            onGoToBloom={() => setCurrentTab('bloom')}
          />
        ) : (
          /* Store & Garden View */
          <AuraStoreView
            auraPoints={auraPoints}
            unlockedItemIds={unlockedItemIds}
            buddy={buddy}
            onReturnToSession={() => setCurrentTab('session')}
            onPurchaseItem={handlePurchaseItem}
            onEquipAccessory={handleEquipAccessory}
            onEquipToy={handleEquipToy}
          />
        )}
      </main>

      {/* Signature AURA SHIFT Intervention Overlay */}
      <AuraShiftOverlay
        isOpen={isAuraShiftOpen}
        onComplete={handleAuraShiftComplete}
        onSkip={handleAuraShiftSkip}
      />

      {/* Guided Manual Reset Modal */}
      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onComplete={handleResetComplete}
      />

      {/* Post-Session Summary & "Today vs You" Modal */}
      <SessionSummaryModal
        isOpen={completedSessionRecord !== null}
        session={completedSessionRecord}
        comparison={todayVsYouData}
        buddy={buddy}
        onClose={() => {
          setCompletedSessionRecord(null);
          setTodayVsYouData(null);
        }}
        onGoToStore={() => {
          setCompletedSessionRecord(null);
          setTodayVsYouData(null);
          setCurrentTab('store');
        }}
        onGoToBloom={() => {
          setCompletedSessionRecord(null);
          setTodayVsYouData(null);
          setCurrentTab('bloom');
        }}
        onGoToJourney={() => {
          setCompletedSessionRecord(null);
          setTodayVsYouData(null);
          setCurrentTab('journey');
        }}
      />

      {/* Interactive Hackathon Demo Tour Modal */}
      <DemoTourModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onTriggerState={(state, score) => {
          setStudyScore(score);
          recordSnapshot(score, `Demo simulation: switched to ${state}`);
        }}
        onTriggerAuraShift={() => setIsAuraShiftOpen(true)}
        onTriggerReset={() => setIsResetOpen(true)}
        onTriggerSessionComplete={handleTriggerDemoSessionComplete}
        onGoToStore={() => setCurrentTab('store')}
        onGoToBloom={() => setCurrentTab('bloom')}
      />

      {/* How it Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
