import { StoreItem, AuraState, StateConfig, BloomStage } from '../types';

export const BLOOM_STAGES: BloomStage[] = [
  {
    level: 1,
    name: 'Tender Sprout',
    minMinutes: 0,
    description: 'A quiet green seedling rooting itself into your focused hours.',
    petalCount: 2,
    bloomColor: '#8ab5a7',
    perk: '+1 Dew per 60 seconds',
  },
  {
    level: 2,
    name: 'Sunlit Shoot',
    minMinutes: 5,
    description: 'Two sturdy leaves unfurl, absorbing your continuous calm rhythm.',
    petalCount: 4,
    bloomColor: '#72a89b',
    perk: 'Increased study stamina aura',
  },
  {
    level: 3,
    name: 'Velvet Bud',
    minMinutes: 15,
    description: 'A graceful floral bud swelling with focus dew and momentum.',
    petalCount: 6,
    bloomColor: '#3a8c83',
    perk: 'Aura Shift buffer extended',
  },
  {
    level: 4,
    name: 'Full Blossom',
    minMinutes: 30,
    description: 'Full petals opened in harmony with your settled cognitive state.',
    petalCount: 8,
    bloomColor: '#e0984a',
    perk: 'Double Dew on mindful resets',
  },
  {
    level: 5,
    name: 'Luminescent AuraBloom',
    minMinutes: 60,
    description: 'A glowing celestial botanical with bioluminescent dew dust.',
    petalCount: 12,
    bloomColor: '#d66853',
    perk: 'Master of calm focus achieved',
  },
];

export function getBloomStage(focusMinutes: number): { currentStage: BloomStage; nextStage: BloomStage | null; progress: number } {
  let stageIdx = 0;
  for (let i = BLOOM_STAGES.length - 1; i >= 0; i--) {
    if (focusMinutes >= BLOOM_STAGES[i].minMinutes) {
      stageIdx = i;
      break;
    }
  }

  const currentStage = BLOOM_STAGES[stageIdx];
  const nextStage = stageIdx < BLOOM_STAGES.length - 1 ? BLOOM_STAGES[stageIdx + 1] : null;

  let progress = 100;
  if (nextStage) {
    const range = nextStage.minMinutes - currentStage.minMinutes;
    const currentProgress = focusMinutes - currentStage.minMinutes;
    progress = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
  }

  return { currentStage, nextStage, progress };
}

export const AURA_STATES: Record<AuraState, StateConfig> = {
  Stable: {
    eyebrow: 'A steady signal',
    message: 'Your study rhythm looks settled.',
    color: '#3a8c83',
    soft: '#d7eeea',
  },
  Rising: {
    eyebrow: 'A gentle shift',
    message: 'Your load may be starting to climb.',
    color: '#d08b32',
    soft: '#f6e3bf',
  },
  Elevated: {
    eyebrow: 'Worth noticing',
    message: 'Your signal is asking for a little space.',
    color: '#c96758',
    soft: '#f3d4ce',
  },
};

export function getAuraStateFromScore(score: number): AuraState {
  if (score < 40) return 'Stable';
  if (score < 70) return 'Rising';
  return 'Elevated';
}

export function getStateDescription(state: AuraState): string {
  if (state === 'Stable') return 'Steady check-in';
  if (state === 'Rising') return 'Load is shifting';
  return 'Pause is welcome';
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export function formatClockTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export const STORE_CATALOG: StoreItem[] = [
  // --- TREES (Virtual Sanctuary Planting) ---
  {
    id: 'bonsai-pine',
    name: 'Bonsai Pine',
    category: 'Trees',
    type: 'tree',
    treeSpecies: 'Pine',
    description: 'An ancient miniature pine that grows sturdier with every study hour.',
    cost: 35,
    iconName: 'TreePine',
    accent: '#3a8c83',
    soft: '#d7eeea',
    tag: 'sanctuary tree',
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    category: 'Trees',
    type: 'tree',
    treeSpecies: 'Sakura',
    description: 'Soft pink sakura boughs that open delicate petals as focus deepens.',
    cost: 45,
    iconName: 'Cherry',
    accent: '#d97d91',
    soft: '#fbe9ed',
    tag: 'spring bloom',
  },
  {
    id: 'sunlit-oak',
    name: 'Sunlit Oak',
    category: 'Trees',
    type: 'tree',
    treeSpecies: 'Oak',
    description: 'A deep-rooted deciduous tree that shades your virtual garden bench.',
    cost: 55,
    iconName: 'Trees',
    accent: '#8a9e4d',
    soft: '#edf3db',
    tag: 'deep roots',
  },
  {
    id: 'silver-birch',
    name: 'Silver Birch',
    category: 'Trees',
    type: 'tree',
    treeSpecies: 'Birch',
    description: 'Slender, pale bark swaying gracefully in the study breeze.',
    cost: 50,
    iconName: 'TreeDeciduous',
    accent: '#758a99',
    soft: '#e4ebf0',
    tag: 'graceful',
  },
  {
    id: 'ancient-redwood',
    name: 'Ancient Redwood',
    category: 'Trees',
    type: 'tree',
    treeSpecies: 'Redwood',
    description: 'A towering guardian of patient study, reaching for the stars.',
    cost: 85,
    iconName: 'TreePine',
    accent: '#b85d43',
    soft: '#fae6e0',
    tag: 'legendary',
  },

  // --- PLANTS & SUCCULENTS ---
  {
    id: 'moonfern',
    name: 'Moonfern',
    category: 'Plants',
    type: 'garden',
    description: 'A soft frond for late-night chapters.',
    cost: 24,
    iconName: 'Sprout',
    accent: '#8ab5a7',
    soft: '#dcebe0',
    tag: 'quiet grower',
  },
  {
    id: 'mosslight',
    name: 'Mosslight',
    category: 'Plants',
    type: 'garden',
    description: 'A low glow that rewards patient focus.',
    cost: 34,
    iconName: 'Sparkles',
    accent: '#c6a65a',
    soft: '#f3e9c9',
    tag: 'bioluminescent',
  },
  {
    id: 'velvet-succulent',
    name: 'Velvet Succulent',
    category: 'Plants',
    type: 'garden',
    description: 'Resilient rosettes that thrive in quiet perseverance.',
    cost: 22,
    iconName: 'Flower',
    accent: '#599382',
    soft: '#ddf0ea',
    tag: 'desk buddy',
  },

  // --- FLOWERS ---
  {
    id: 'sunspool',
    name: 'Sunspool',
    category: 'Flowers',
    type: 'garden',
    description: 'Small, bright blooms for a clear desk.',
    cost: 18,
    iconName: 'Flower2',
    accent: '#d18b68',
    soft: '#f5dfd0',
    tag: 'in season',
  },
  {
    id: 'quiet-cosmos',
    name: 'Quiet Cosmos',
    category: 'Flowers',
    type: 'garden',
    description: 'A midnight flower that opens between sessions.',
    cost: 42,
    iconName: 'Moon',
    accent: '#9c92bd',
    soft: '#e7e1f1',
    tag: 'slow bloom',
  },
  {
    id: 'golden-lotus',
    name: 'Golden Lotus',
    category: 'Flowers',
    type: 'garden',
    description: 'Floating golden bloom symbolizing clarity after high cognitive load.',
    cost: 48,
    iconName: 'Sun',
    accent: '#d49b38',
    soft: '#fbeece',
    tag: 'sacred calm',
  },

  // --- GARDEN DECORATIONS ---
  {
    id: 'stone-arch',
    name: 'Stone Arch',
    category: 'Decor',
    type: 'garden',
    description: 'A grounding threshold for your little world.',
    cost: 28,
    iconName: 'Landmark',
    accent: '#9b8e80',
    soft: '#e9e1d7',
    tag: 'foundation',
  },
  {
    id: 'reading-lamp',
    name: 'Reading Lamp',
    category: 'Decor',
    type: 'garden',
    description: 'A warm point of light for one more page.',
    cost: 36,
    iconName: 'Lamp',
    accent: '#d19a4a',
    soft: '#f5e7c8',
    tag: 'desk favorite',
  },
  {
    id: 'zen-basin',
    name: 'Stone Water Basin',
    category: 'Decor',
    type: 'garden',
    description: 'Still mountain water reflecting ambient daylight.',
    cost: 32,
    iconName: 'Waves',
    accent: '#5e8590',
    soft: '#deebed',
    tag: 'peaceful',
  },
  {
    id: 'solitary-bench',
    name: 'Garden Bench',
    category: 'Decor',
    type: 'garden',
    description: 'A wooden resting bench where your AuraBuddy sits and naps.',
    cost: 40,
    iconName: 'Armchair',
    accent: '#8b6f52',
    soft: '#efe8df',
    tag: 'companion spot',
  },

  // --- BUDDY ACCESSORIES ---
  {
    id: 'silk-scarf',
    name: 'Emerald Silk Scarf',
    category: 'Accessories',
    type: 'accessory',
    description: 'A gentle neck scarf in soft sage green for your AuraBuddy.',
    cost: 20,
    iconName: 'Ribbon',
    accent: '#3a8c83',
    soft: '#d7eeea',
    tag: 'cozy wrap',
  },
  {
    id: 'little-beret',
    name: 'Scholar Beret',
    category: 'Accessories',
    type: 'accessory',
    description: 'A dapper miniature woolen beret for scholarly focus sessions.',
    cost: 30,
    iconName: 'GraduationCap',
    accent: '#645480',
    soft: '#ebe6f5',
    tag: 'academic',
  },
  {
    id: 'star-bell',
    name: 'Gold Star Charm',
    category: 'Accessories',
    type: 'accessory',
    description: 'A tiny chime that jingles softly when you complete study intervals.',
    cost: 25,
    iconName: 'Bell',
    accent: '#c99534',
    soft: '#f8edd6',
    tag: 'jingle chime',
  },
  {
    id: 'flower-crown',
    name: 'Wildflower Crown',
    category: 'Accessories',
    type: 'accessory',
    description: 'Woven clover and forget-me-nots resting on your companion’s head.',
    cost: 38,
    iconName: 'Crown',
    accent: '#bd6377',
    soft: '#fae3e8',
    tag: 'handcrafted',
  },

  // --- BUDDY TOYS ---
  {
    id: 'wooden-stick',
    name: 'Polished Oak Stick',
    category: 'Toys',
    type: 'toy',
    description: 'A smooth, sturdy stick your companion proudly holds during study breaks.',
    cost: 15,
    iconName: 'Wand2',
    accent: '#8f6745',
    soft: '#f0e6dc',
    tag: 'beloved toy',
  },
  {
    id: 'yarn-ball',
    name: 'Cozy Wool Yarn',
    category: 'Toys',
    type: 'toy',
    description: 'A soft spun ball of yarn to gently bat around while you read.',
    cost: 20,
    iconName: 'CircleDot',
    accent: '#bd576a',
    soft: '#fae1e6',
    tag: 'playful',
  },
  {
    id: 'squeaky-acorn',
    name: 'Felt Acorn',
    category: 'Toys',
    type: 'toy',
    description: 'A quiet felt acorn that brings good forest luck to challenging chapters.',
    cost: 22,
    iconName: 'Nut',
    accent: '#9a703a',
    soft: '#f4ebd8',
    tag: 'forest treasure',
  },
  {
    id: 'butterfly-wand',
    name: 'Dewdrop Wand',
    category: 'Toys',
    type: 'toy',
    description: 'A whimsical wand tipped with an iridescent shimmering butterfly.',
    cost: 32,
    iconName: 'Sparkle',
    accent: '#478ba6',
    soft: '#d9edf7',
    tag: 'whimsical',
  },

  // --- THEMES ---
  {
    id: 'tidepool',
    name: 'Tidepool',
    category: 'Themes',
    type: 'theme',
    description: 'Cool blue hush, with a little room to think.',
    cost: 48,
    iconName: 'Waves',
    accent: '#5f9e9f',
    soft: '#d7ecec',
    tag: 'palette',
  },
  {
    id: 'amber-dusk',
    name: 'Amber Dusk',
    category: 'Themes',
    type: 'theme',
    description: 'A honeyed evening tint for deep work.',
    cost: 60,
    iconName: 'Sunset',
    accent: '#c9864c',
    soft: '#f3dfc8',
    tag: 'palette',
  },
  {
    id: 'midnight-moss',
    name: 'Midnight Moss',
    category: 'Themes',
    type: 'theme',
    description: 'Deep forest shadows illuminated by tiny fireflies.',
    cost: 65,
    iconName: 'Trees',
    accent: '#417260',
    soft: '#d3ebe2',
    tag: 'palette',
  },
];
