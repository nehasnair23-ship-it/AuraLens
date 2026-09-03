import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  HelpCircle,
  Zap,
  Layers,
  HeartHandshake,
  Settings,
  Smile,
} from 'lucide-react';
import { AuraState, StudyChatMessage, StudyFlashcard, StudyQuiz, AuraBuddyProfile, BuddySpecies, BuddyReaction } from '../types';
import { AURA_STATES } from '../data/storeCatalog';
import { soundEngine } from '../utils/audio';
import AuraCompanionAvatar from './AuraCompanionAvatar';

interface AuraBuddyProps {
  currentAuraState: AuraState;
  studyScore: number;
  buddy?: AuraBuddyProfile;
  onUpdateBuddy?: (buddy: AuraBuddyProfile) => void;
}

const DEFAULT_PROFILE: AuraBuddyProfile = {
  species: 'puppy',
  name: 'Boba',
  level: 3,
  xp: 180,
  maxXp: 250,
  sessionsTogether: 12,
  equippedAccessory: 'silk-scarf',
  equippedToy: 'wooden-stick',
};

const SPECIES_OPTIONS: { species: BuddySpecies; defaultName: string; emoji: string; desc: string }[] = [
  { species: 'puppy', defaultName: 'Boba', emoji: '🐶', desc: 'Loyal, cheerful encouragement' },
  { species: 'cat', defaultName: 'Mochi', emoji: '🐱', desc: 'Calm, patient quiet study' },
  { species: 'bunny', defaultName: 'Clover', emoji: '🐰', desc: 'Gentle, agile curiosity' },
  { species: 'fox', defaultName: 'Pip', emoji: '🦊', desc: 'Clever, structured insights' },
];

export default function AuraBuddy({
  currentAuraState,
  studyScore,
  buddy = DEFAULT_PROFILE,
  onUpdateBuddy,
}: AuraBuddyProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingBuddy, setIsEditingBuddy] = useState(false);
  const [customName, setCustomName] = useState(buddy.name);
  const [topic, setTopic] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const buddyReaction: BuddyReaction =
    studyScore >= 70 ? 'supportive' : studyScore >= 40 ? 'attentive' : 'calm';

  const handleSelectSpecies = (sp: BuddySpecies, defName: string) => {
    if (!onUpdateBuddy) return;
    onUpdateBuddy({
      ...buddy,
      species: sp,
      name: customName || defName,
    });
  };

  const handleSaveName = () => {
    if (!onUpdateBuddy || !customName.trim()) return;
    onUpdateBuddy({
      ...buddy,
      name: customName.trim(),
    });
    setIsEditingBuddy(false);
  };
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const auraConfig = AURA_STATES[currentAuraState];

  const [messages, setMessages] = useState<StudyChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am AuraBuddy, your mindful AI study companion. Whatever you are studying, I am here to break down tricky concepts, generate quick flashcards, or quiz your intuition gently.",
      timestamp: 'just now',
    },
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleAsk = async (
    mode: 'general' | 'breakdown' | 'recap' | 'flashcards' | 'quiz' = 'general',
    customPrompt?: string
  ) => {
    const q = customPrompt || prompt;
    if (!q.trim() || loading) return;

    const userMsg: StudyChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/study/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          topic: topic || 'Current study focus',
          studyState: currentAuraState,
          mode,
        }),
      });

      if (!res.ok) throw new Error('AuraBuddy unavailable');

      const data = await res.json();
      const newAssistantMsg: StudyChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: data.reply || 'Keep breathing gently. You are making steady progress.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cardType: mode === 'flashcards' ? 'flashcards' : mode === 'quiz' ? 'quiz' : 'text',
        flashcards: data.flashcards,
        quiz: data.quiz,
      };

      setMessages((prev) => [...prev, newAssistantMsg]);
      soundEngine.playDewEarnedTone();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: "Take a soft breath. I momentarily lost connection to the server, but your study rhythm and progress remain intact.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (cardKey: string) => {
    setFlippedCards((prev) => ({ ...prev, [cardKey]: !prev[cardKey] }));
  };

  const handleSelectQuiz = (quizKey: string, optionIdx: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [quizKey]: optionIdx }));
  };

  return (
    <div
      className="relative overflow-hidden rounded-[24px] border border-[#ded9cb] bg-[#fbf8ef] p-6 shadow-sm"
      data-testid="component-aurabuddy"
    >
      {/* Subtle Aura ambient glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-2xl transition-colors duration-1000"
        style={{ backgroundColor: `${auraConfig.color}20` }}
      />

      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex cursor-pointer items-center gap-3.5 flex-1"
        >
          {/* Reactive Avatar */}
          <div className="relative">
            <AuraCompanionAvatar
              species={buddy.species}
              reaction={buddyReaction}
              size="md"
              equippedAccessory={buddy.equippedAccessory}
              equippedToy={buddy.equippedToy}
            />
            <span
              className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#fbf8ef] transition-colors duration-700"
              style={{ backgroundColor: auraConfig.color }}
              title={`Aura state: ${currentAuraState}`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-[#202840]">
                {buddy.name}
              </h3>
              <span className="rounded-full bg-[#f2ede0] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#6b5832]">
                Lvl {buddy.level}
              </span>
              <span className="rounded-full bg-[#e8f2ee] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#356a64]">
                {buddy.species} companion
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#e4ded0]">
                <div
                  className="h-full rounded-full bg-[#3a8c83] transition-all"
                  style={{ width: `${Math.min(100, (buddy.xp / buddy.maxXp) * 100)}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-[#6d7c80]">
                {buddy.xp}/{buddy.maxXp} XP · {buddy.sessionsTogether} sessions
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsEditingBuddy(!isEditingBuddy)}
            className="flex items-center gap-1 rounded-xl border border-[#dedace] bg-[#f5f1e4] px-2.5 py-1.5 text-[11px] font-semibold text-[#506064] hover:bg-[#eae3d4]"
          >
            <Settings className="h-3.5 w-3.5 text-[#3a8c83]" />
            Switch Buddy
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-[#707c80] hover:bg-[#eae5d8]"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Companion Customization Drawer */}
      <AnimatePresence>
        {isEditingBuddy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 rounded-2xl border border-[#dedace] bg-[#f6f2e6] p-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-bold text-[#202840]">
                Choose Your Study Companion
              </h4>
              <span className="font-mono text-[10px] text-[#78888c]">
                Bond strengthens every session
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SPECIES_OPTIONS.map((opt) => (
                <button
                  key={opt.species}
                  type="button"
                  onClick={() => handleSelectSpecies(opt.species, opt.defaultName)}
                  className={`flex flex-col items-center rounded-xl border p-3 text-center transition-all ${
                    buddy.species === opt.species
                      ? 'border-[#3a8c83] bg-[#e7f2ee] shadow-sm'
                      : 'border-[#dedace] bg-[#fbf8ef] hover:bg-[#ece6d7]'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="mt-1 font-serif text-xs font-bold text-[#202840]">
                    {opt.species.charAt(0).toUpperCase() + opt.species.slice(1)}
                  </span>
                  <span className="text-[10px] text-[#69787c] leading-tight mt-0.5">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-xs text-[#5f6f73]">Companion Name:</span>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Name your buddy"
                className="rounded-lg border border-[#dedace] bg-[#fbf8ef] px-2.5 py-1 text-xs text-[#202840] focus:border-[#3a8c83] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="rounded-lg bg-[#202840] px-3 py-1 text-xs font-bold text-[#fbf8ef] hover:bg-[#2c3857]"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 border-t border-[#dedace] pt-4"
          >
            {/* Subject Topic Tag Input */}
            <div className="mb-3 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#79898c]">
                Topic Focus:
              </span>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Organic Chemistry, Neural Nets, Microeconomics…"
                className="flex-1 rounded-lg border border-[#e2decfa8] bg-[#f8f5eb] px-2.5 py-1 text-xs text-[#202840] placeholder:text-[#9ea9ab] focus:border-[#3a8c83] focus:outline-none"
              />
            </div>

            {/* Quick Helper Action Pills */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleAsk(
                    'breakdown',
                    topic
                      ? `Break down "${topic}" into 3 core pillars with a simple memorable analogy.`
                      : 'Break down the core intuition of my current study focus into 3 clear pillars and an analogy.'
                  )
                }
                className="flex items-center gap-1.5 rounded-lg border border-[#dedace] bg-[#f8f5eb] px-2.5 py-1.5 text-[11px] font-semibold text-[#48565b] transition-colors hover:bg-[#eee8db]"
              >
                <Lightbulb className="h-3.5 w-3.5 text-[#d08b32]" />
                3 Core Pillars
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAsk(
                    'recap',
                    topic
                      ? `Give me a 3-bullet calm recap of "${topic}" to lock it into memory.`
                      : 'Provide a 3-bullet calm recap of my current study concept to cement it.'
                  )
                }
                className="flex items-center gap-1.5 rounded-lg border border-[#dedace] bg-[#f8f5eb] px-2.5 py-1.5 text-[11px] font-semibold text-[#48565b] transition-colors hover:bg-[#eee8db]"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-[#3a8c83]" />
                Gentle Recap
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAsk(
                    'flashcards',
                    topic
                      ? `Generate 3 high-yield study flashcards for "${topic}".`
                      : 'Generate 3 high-yield flashcards for my topic.'
                  )
                }
                className="flex items-center gap-1.5 rounded-lg border border-[#dedace] bg-[#f8f5eb] px-2.5 py-1.5 text-[11px] font-semibold text-[#48565b] transition-colors hover:bg-[#eee8db]"
              >
                <Layers className="h-3.5 w-3.5 text-[#5479a8]" />
                3 Flashcards
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAsk(
                    'quiz',
                    topic
                      ? `Give me 1 quick conceptual quiz question on "${topic}" to test my understanding.`
                      : 'Give me 1 quick conceptual quiz question to test my understanding.'
                  )
                }
                className="flex items-center gap-1.5 rounded-lg border border-[#dedace] bg-[#f8f5eb] px-2.5 py-1.5 text-[11px] font-semibold text-[#48565b] transition-colors hover:bg-[#eee8db]"
              >
                <Zap className="h-3.5 w-3.5 text-[#c96758]" />
                Quick Quiz Me
              </button>
            </div>

            {/* Chat Stream History */}
            <div className="max-h-[360px] space-y-3.5 overflow-y-auto pr-1">
              {messages.map((m, mIdx) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-[#202840] text-[#fbf8ef]'
                        : 'border border-[#ded9cb] bg-[#f8f5ec] text-[#2c3948]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {/* Interactive Flashcards if present */}
                    {m.flashcards && m.flashcards.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-[#dedace] pt-2.5">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#687b7f]">
                          ✦ Interactive Flashcards (Click to flip):
                        </span>
                        <div className="grid gap-2 sm:grid-cols-1">
                          {m.flashcards.map((fc, fcIdx) => {
                            const cardKey = `${m.id}-${fcIdx}`;
                            const isFlipped = flippedCards[cardKey];
                            return (
                              <div
                                key={fcIdx}
                                onClick={() => toggleFlip(cardKey)}
                                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                                  isFlipped
                                    ? 'border-[#3a8c83] bg-[#eef7f4]'
                                    : 'border-[#dedace] bg-[#fdfcfa] hover:border-[#b8cfc8]'
                                }`}
                              >
                                <div className="flex items-center justify-between font-mono text-[9px] text-[#718286]">
                                  <span>Card {fcIdx + 1}/3</span>
                                  <span className="flex items-center gap-1">
                                    <RotateCw className="h-2.5 w-2.5" />
                                    {isFlipped ? 'Answer' : 'Question (tap)'}
                                  </span>
                                </div>
                                <p className="mt-1 font-medium text-[#202840]">
                                  {isFlipped ? fc.back : fc.front}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Interactive Quiz if present */}
                    {m.quiz && (
                      <div className="mt-3 space-y-2.5 border-t border-[#dedace] pt-2.5">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#687b7f]">
                          ✦ Check Your Understanding:
                        </span>
                        <p className="font-semibold text-[#202840]">
                          {m.quiz.question}
                        </p>

                        <div className="space-y-1.5">
                          {m.quiz.options.map((opt, optIdx) => {
                            const quizKey = m.id;
                            const isSelected = selectedQuizAnswers[quizKey] === optIdx;
                            const hasAnswered = selectedQuizAnswers[quizKey] !== undefined;
                            const isCorrect = optIdx === m.quiz?.answerIndex;

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={hasAnswered}
                                onClick={() => handleSelectQuiz(quizKey, optIdx)}
                                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition-colors ${
                                  hasAnswered
                                    ? isCorrect
                                      ? 'border-[#3a8c83] bg-[#e7f2ee] font-semibold text-[#295e56]'
                                      : isSelected
                                      ? 'border-[#c96758] bg-[#fdf0ee] text-[#7b3226]'
                                      : 'border-[#dedace] bg-[#fbf8ef] opacity-60'
                                    : 'border-[#dedace] bg-[#fdfcfa] text-[#34445d] hover:bg-[#ede8db]'
                                }`}
                              >
                                <span>{opt}</span>
                                {hasAnswered && isCorrect && (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-[#3a8c83]" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {selectedQuizAnswers[m.id] !== undefined && (
                          <div className="rounded-xl border border-[#d6e7e2] bg-[#f0f7f4] p-2.5 text-[11px] text-[#2e5952]">
                            <strong>Explanation:</strong> {m.quiz.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    <span className="mt-1.5 block text-right font-mono text-[9px] opacity-60">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-[#718185]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3a8c83]" />
                  <span>AuraBuddy is crafting a serene explanation…</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Submission Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk('general');
              }}
              className="mt-4 flex gap-2"
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask AuraBuddy any question or paste lecture notes…"
                className="flex-1 rounded-xl border border-[#dedace] bg-[#f8f5ec] px-4 py-2.5 text-xs text-[#202840] placeholder:text-[#909c9f] focus:border-[#3a8c83] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className="flex items-center justify-center rounded-xl bg-[#202840] px-4 py-2.5 text-white transition-all hover:bg-[#2e3b5a] disabled:opacity-40 shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
