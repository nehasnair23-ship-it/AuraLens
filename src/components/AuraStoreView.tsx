import { useState, ComponentType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowLeft,
  Filter,
  Check,
  Lock,
  Sprout,
  Flower2,
  Moon,
  Landmark,
  Lamp,
  Waves,
  Sunset,
  Trees,
  CloudRain,
  TreePine,
  TreeDeciduous,
  Flower,
  Sun,
  Armchair,
  Ribbon,
  GraduationCap,
  Bell,
  Crown,
  Wand2,
  CircleDot,
  Nut,
  Sparkle,
  Info,
  Heart,
} from 'lucide-react';
import { StoreCategory, StoreItem, AuraBuddyProfile } from '../types';
import { STORE_CATALOG } from '../data/storeCatalog';
import { soundEngine } from '../utils/audio';
import AuraCompanionAvatar from './AuraCompanionAvatar';

interface AuraStoreViewProps {
  auraPoints: number;
  unlockedItemIds: string[];
  buddy: AuraBuddyProfile;
  onReturnToSession: () => void;
  onPurchaseItem: (item: StoreItem) => void;
  onEquipAccessory: (id: string) => void;
  onEquipToy: (id: string) => void;
}

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Sprout,
  Sparkles,
  Flower2,
  Moon,
  Landmark,
  Lamp,
  Waves,
  Sunset,
  Trees,
  CloudRain,
  TreePine,
  TreeDeciduous,
  Flower,
  Sun,
  Armchair,
  Ribbon,
  GraduationCap,
  Bell,
  Crown,
  Wand2,
  CircleDot,
  Nut,
  Sparkle,
  Cherry: Sparkles,
};

const CATEGORIES: StoreCategory[] = [
  'All',
  'Trees',
  'Plants',
  'Flowers',
  'Decor',
  'Accessories',
  'Toys',
  'Themes',
];

export default function AuraStoreView({
  auraPoints,
  unlockedItemIds,
  buddy,
  onReturnToSession,
  onPurchaseItem,
  onEquipAccessory,
  onEquipToy,
}: AuraStoreViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory>('All');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const filteredItems = STORE_CATALOG.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleBuy = (item: StoreItem) => {
    if (unlockedItemIds.includes(item.id)) return;
    if (item.locked) {
      setNoticeMessage(item.lockCopy || 'This item is locked for now.');
      setTimeout(() => setNoticeMessage(null), 3500);
      return;
    }
    if (auraPoints < item.cost) {
      setNoticeMessage(
        `Keep studying — you need ${item.cost - auraPoints} more Aura Points!`
      );
      setTimeout(() => setNoticeMessage(null), 3500);
      return;
    }

    onPurchaseItem(item);
    soundEngine.playDewEarnedTone();
    if (item.category === 'Trees') {
      setNoticeMessage(`Planted ${item.name} into your AuraBloom Sanctuary!`);
    } else if (item.category === 'Accessories' || item.category === 'Toys') {
      setNoticeMessage(`Added ${item.name} to ${buddy.name}'s wardrobe!`);
    } else {
      setNoticeMessage(`Unlocked ${item.name} for your garden!`);
    }
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  const hasMoonfern = unlockedItemIds.includes('moonfern');
  const hasSunspool = unlockedItemIds.includes('sunspool');
  const hasStoneArch = unlockedItemIds.includes('stone-arch');
  const hasMosslight = unlockedItemIds.includes('mosslight');
  const hasReadingLamp = unlockedItemIds.includes('reading-lamp');
  const hasQuietCosmos = unlockedItemIds.includes('quiet-cosmos');
  const hasBonsai = unlockedItemIds.includes('bonsai-pine');
  const hasCherry = unlockedItemIds.includes('cherry-blossom');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation Header */}
      <div
        className="mb-8 flex flex-col gap-4 border-b border-[#dedace] pb-6 sm:flex-row sm:items-center sm:justify-between"
        data-testid="link-store-navigation"
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onReturnToSession}
            className="flex items-center gap-2 rounded-xl border border-[#d8d5c9] bg-[#fbf8ef] px-3.5 py-2 text-xs font-semibold text-[#445055] transition-colors hover:bg-[#ede8db]"
            data-testid="link-return-to-session"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Session
          </button>

          <div className="flex items-center gap-2.5" data-testid="brand-auralens-store">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f5c65d] text-[#202840] font-bold shadow-[0_2px_0_#d39d36]">
              A
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-[#202840]">
              Aura Store & Sanctuary
            </span>
          </div>
        </div>

        {/* Aura Points Balance */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2.5 rounded-full border border-[#dedace] bg-[#fbf8ef] px-4 py-2 font-mono text-xs shadow-sm"
            data-testid="status-points-balance"
          >
            <Sparkles className="h-4 w-4 text-[#d08b32] fill-[#f6e3bf]" />
            <span className="text-[#647175]">Balance:</span>
            <strong className="font-bold text-[#202840]">{auraPoints} Aura Points</strong>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#dedace] bg-[#fbf8ef] px-3 py-1.5 font-mono text-[11px] text-[#596669]">
            <span>{buddy.name}</span>
            <AuraCompanionAvatar
              species={buddy.species}
              reaction="calm"
              size="sm"
              equippedAccessory={buddy.equippedAccessory}
              equippedToy={buddy.equippedToy}
            />
          </div>
        </div>
      </div>

      {/* Store Notice banner */}
      <AnimatePresence>
        {noticeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 flex items-center justify-between rounded-xl bg-[#e7f2ee] p-3.5 text-xs font-medium text-[#356a64] shadow-sm"
            data-testid="status-store-notice"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#356a64]" />
              <span>{noticeMessage}</span>
            </div>
            <button
              onClick={() => setNoticeMessage(null)}
              className="font-bold underline ml-2 text-[#244945]"
            >
              dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section: Garden Canvas */}
      <section
        className="relative min-h-[310px] overflow-hidden rounded-[28px] border border-[#34445d] bg-[#223049] p-6 text-[#f7f0df] shadow-lg sm:p-8"
        data-testid="card-aura-garden"
      >
        {/* Night sky twinkling stars */}
        <div className="absolute left-[9%] top-[14%] h-2 w-2 rounded-full bg-[#f5c65d] garden-twinkle" />
        <div className="absolute left-[28%] top-[26%] h-1.5 w-1.5 rounded-full bg-[#93d0c7] garden-twinkle [animation-delay:1.3s]" />
        <div className="absolute right-[22%] top-[18%] h-1.5 w-1.5 rounded-full bg-[#f5c65d] garden-twinkle [animation-delay:2.1s]" />
        <div className="absolute right-[10%] top-[32%] h-2 w-2 rounded-full bg-[#93d0c7] garden-twinkle [animation-delay:0.7s]" />

        <div className="relative z-10 flex flex-col justify-between sm:flex-row sm:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5c65d]">
              Aura Garden & Sanctuary
            </p>
            <h2 className="mt-2 max-w-sm font-serif text-[32px] font-bold leading-none tracking-[-0.04em] sm:text-[42px]">
              A quiet place
              <br />
              <span className="text-[#93d0c7]">to come back to.</span>
            </h2>
            <p className="mt-2 text-xs text-[#cfdad9] max-w-sm">
              Your study time is growing something. Spend points on trees and companion care.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center gap-2 rounded-full border border-[#718195] bg-[#1e2a42b0] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#d1dedc] backdrop-blur-sm">
            <span>{unlockedItemIds.length} botanical items unlocked</span>
          </div>
        </div>

        {/* Rolling Hills & Growing Botanical Garden */}
        <div className="absolute inset-x-0 bottom-0 h-[62%] overflow-hidden">
          {/* Back hill */}
          <div className="absolute -bottom-[32%] -left-[8%] h-[84%] w-[118%] rounded-[50%] border-t border-[#718c7f55] bg-[#31484e]" />
          {/* Foreground hill */}
          <div className="absolute -bottom-[42%] left-[22%] h-[76%] w-[96%] rounded-[50%] bg-[#3d5952]" />

          {/* Planted Items in Garden */}
          {hasBonsai && (
            <div className="absolute bottom-[16%] left-[6%] text-[#93d0c7]">
              <TreePine className="h-16 w-16 stroke-[1.4]" />
              <span className="absolute -bottom-1 left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-[50%] bg-[#1a2d33]" />
            </div>
          )}

          {hasMoonfern && (
            <div className="garden-sway absolute bottom-[13%] left-[19%] text-[#8ab5a7]">
              <Sprout className="h-14 w-14 stroke-[1.2]" />
              <span className="absolute -bottom-1 left-1/2 h-2.5 w-8 -translate-x-1/2 rounded-[50%] bg-[#1a2d33]" />
            </div>
          )}

          {hasSunspool && (
            <div className="garden-sway absolute bottom-[14%] left-[32%] text-[#d18b68] [animation-delay:1.5s]">
              <Flower2 className="h-12 w-12 stroke-[1.2]" />
              <span className="absolute -bottom-1 left-1/2 h-2 w-7 -translate-x-1/2 rounded-[50%] bg-[#1a2d33]" />
            </div>
          )}

          {hasCherry && (
            <div className="garden-sway absolute bottom-[17%] left-[48%] text-[#f2a8b9] [animation-delay:2s]">
              <TreeDeciduous className="h-18 w-18 stroke-[1.4] drop-shadow-[0_0_15px_#f2a8b988]" />
              <span className="absolute -bottom-1 left-1/2 h-3 w-12 -translate-x-1/2 rounded-[50%] bg-[#1a2d33]" />
            </div>
          )}

          {hasStoneArch && (
            <div className="absolute bottom-[16%] right-[32%] text-[#9b8e80]">
              <Landmark className="h-14 w-14 stroke-[1.2]" />
              <span className="absolute -bottom-1 left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-[50%] bg-[#1a2d33]" />
            </div>
          )}

          {hasMosslight && (
            <div className="garden-sway absolute bottom-[13%] right-[20%] text-[#c6a65a] [animation-delay:2.2s]">
              <Sparkles className="h-12 w-12 stroke-[1.2] drop-shadow-[0_0_12px_#f5c65d]" />
              <span className="absolute -bottom-1 left-1/2 h-2 w-6 -translate-x-1/2 rounded-[50%] bg-[#1a2d33]" />
            </div>
          )}

          {hasReadingLamp && (
            <div className="absolute bottom-[17%] right-[8%] text-[#d19a4a]">
              <Lamp className="h-14 w-14 stroke-[1.2]" />
              <span className="absolute -bottom-1 left-1/2 h-2 w-8 -translate-x-1/2 rounded-[50%] bg-[#1a2d33]" />
            </div>
          )}
        </div>
      </section>

      {/* Explicit Responsible AI / Virtual Garden Disclaimer */}
      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#dedace] bg-[#f5f1e4] p-3 text-xs text-[#637276]">
        <Info className="h-4 w-4 shrink-0 text-[#3a8c83]" />
        <span>
          <strong>Virtual Sanctuary Note:</strong> This is a digital focus sanctuary. Purchasing virtual trees or garden decor nurtures your in-app visual haven and does not plant a physical real-world tree.
        </span>
      </div>

      {/* Section: Store Catalog */}
      <section className="mt-10" data-testid="section-store-catalog">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7d8789]">
              The Sanctuary Catalog
            </p>
            <h3 className="mt-1 font-serif text-[32px] font-bold leading-tight tracking-[-0.04em] text-[#202840]">
              Find your next little thing.
            </h3>
          </div>

          {/* Desktop Category Filters */}
          <div
            className="hidden items-center gap-1 rounded-xl border border-[#d8d5c9] bg-[#fbf8ef] p-1 sm:flex"
            data-testid="store-category-filters"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#e7f2ee] text-[#356a64]'
                    : 'text-[#697579] hover:text-[#202840]'
                }`}
                data-testid={`button-filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setFilterMenuOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#d8d5c9] bg-[#fbf8ef] px-3.5 py-2.5 text-xs font-bold text-[#46515a]"
              data-testid="button-open-store-filter"
            >
              <span>Category: {selectedCategory}</span>
              <Filter className="h-4 w-4" />
            </button>

            {filterMenuOpen && (
              <div className="absolute right-0 top-12 z-20 w-full flex-col rounded-xl border border-[#d8d5c9] bg-[#fbf8ef] p-1.5 shadow-lg">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilterMenuOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold ${
                      selectedCategory === cat
                        ? 'bg-[#e7f2ee] text-[#356a64]'
                        : 'text-[#697579]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredItems.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-[#dedace] bg-[#f7f4eb] p-10 text-center text-sm text-[#7d8789]"
            data-testid="empty-store-category"
          >
            No items in this category yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const IconComp = ICONS[item.iconName] || Sprout;
              const isUnlocked = unlockedItemIds.includes(item.id);
              const isAccessory = item.category === 'Accessories';
              const isToy = item.category === 'Toys';
              const isEquippedAccessory = buddy.equippedAccessory === item.id;
              const isEquippedToy = buddy.equippedToy === item.id;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col justify-between rounded-2xl border border-[#dcd8cb] bg-[#fbf8ef] p-5 shadow-sm transition-all hover:shadow-md"
                  data-testid={`card-store-item-${item.id}`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div
                        className="grid h-12 w-12 place-items-center rounded-xl"
                        style={{
                          backgroundColor: item.soft,
                          color: item.accent,
                        }}
                      >
                        <IconComp className="h-6 w-6 stroke-[1.5]" />
                      </div>

                      <span
                        className="rounded-full px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
                        style={{
                          backgroundColor: item.soft,
                          color: item.accent,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <h4 className="mt-4 font-serif text-lg font-bold text-[#202840]">
                      {item.name}
                    </h4>

                    <p className="mt-1 text-xs leading-relaxed text-[#68767b]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#dedace] pt-4">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#34445d]">
                      <Sparkles className="h-3.5 w-3.5 text-[#d08b32] fill-[#f6e3bf]" />
                      <span>{item.cost} Points</span>
                    </div>

                    {isUnlocked ? (
                      isAccessory ? (
                        <button
                          type="button"
                          onClick={() => onEquipAccessory(item.id)}
                          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isEquippedAccessory
                              ? 'bg-[#e7f2ee] text-[#356a64]'
                              : 'border border-[#dedace] bg-[#f5f1e4] text-[#556468] hover:bg-[#eae4d5]'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                          {isEquippedAccessory ? 'Equipped' : 'Equip on Buddy'}
                        </button>
                      ) : isToy ? (
                        <button
                          type="button"
                          onClick={() => onEquipToy(item.id)}
                          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isEquippedToy
                              ? 'bg-[#e7f2ee] text-[#356a64]'
                              : 'border border-[#dedace] bg-[#f5f1e4] text-[#556468] hover:bg-[#eae4d5]'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                          {isEquippedToy ? 'Holding' : 'Give to Buddy'}
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#3a8c83]">
                          <Check className="h-3.5 w-3.5" />
                          {item.category === 'Trees' ? 'Planted' : 'In garden'}
                        </span>
                      )
                    ) : item.locked ? (
                      <button
                        type="button"
                        onClick={() => handleBuy(item)}
                        className="flex items-center gap-1 rounded-lg border border-[#d8d5c9] bg-[#f4f0e4] px-3 py-1.5 text-xs font-semibold text-[#828f93] hover:bg-[#eae5d7]"
                      >
                        <Lock className="h-3 w-3" />
                        Locked
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuy(item)}
                        disabled={auraPoints < item.cost}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                          auraPoints >= item.cost
                            ? 'bg-[#202840] text-[#fbf8ef] hover:bg-[#2c3754]'
                            : 'cursor-not-allowed bg-[#e4ded0] text-[#939e9f]'
                        }`}
                        data-testid={`button-purchase-${item.id}`}
                      >
                        {item.category === 'Trees' ? 'Plant Tree' : 'Buy'} ({item.cost})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
