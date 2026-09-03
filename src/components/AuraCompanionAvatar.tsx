import { motion } from 'motion/react';
import { BuddySpecies, BuddyReaction } from '../types';

interface AuraCompanionAvatarProps {
  species: BuddySpecies;
  reaction?: BuddyReaction;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  equippedAccessory?: string;
  equippedToy?: string;
  className?: string;
}

export default function AuraCompanionAvatar({
  species,
  reaction = 'calm',
  size = 'md',
  equippedAccessory,
  equippedToy,
  className = '',
}: AuraCompanionAvatarProps) {
  // Dimensions & scale mapping
  const sizeMap = {
    sm: { container: 'h-10 w-10 text-xl', badge: 'text-[9px]' },
    md: { container: 'h-20 w-20 text-4xl', badge: 'text-xs' },
    lg: { container: 'h-32 w-32 text-6xl', badge: 'text-sm' },
    xl: { container: 'h-44 w-44 text-8xl', badge: 'text-base' },
  };

  const speciesInfo = {
    puppy: {
      emoji: '🐶',
      name: 'Puppy',
      bg: '#f8e9d2',
      border: '#d7b486',
      shadow: '#c49e6f40',
      greeting: 'Woof! Ready to focus together.',
    },
    cat: {
      emoji: '🐱',
      name: 'Cat',
      bg: '#e8ecf4',
      border: '#b1bed5',
      shadow: '#9eaec740',
      greeting: 'Purr... gentle pacing today.',
    },
    bunny: {
      emoji: '🐰',
      name: 'Bunny',
      bg: '#fae8ee',
      border: '#dca6b8',
      shadow: '#c98e9f40',
      greeting: 'Hop into flow at your own pace.',
    },
    fox: {
      emoji: '🦊',
      name: 'Fox',
      bg: '#fde8db',
      border: '#e4a57c',
      shadow: '#cf8a5b40',
      greeting: 'Clever steps and cozy chapters.',
    },
  };

  const info = speciesInfo[species] || speciesInfo.puppy;

  // Animation variants according to reaction
  const getMotionAnimation = () => {
    switch (reaction) {
      case 'ready':
        return {
          scale: [1, 1.06, 1],
          rotate: [0, -3, 3, 0],
          transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'calm':
        return {
          scale: [0.98, 1.02, 0.98],
          y: [0, -2, 0],
          transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'attentive':
        return {
          scale: 1.03,
          y: -4,
          rotate: [0, 2, -2, 0],
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'supportive':
        return {
          scale: [1, 1.04, 1],
          y: [0, -3, 0],
          transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'noticing':
        return {
          rotate: [-4, 4, -4],
          scale: 1.02,
          transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'breathing':
        return {
          scale: [0.94, 1.1, 0.94],
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'celebrating':
        return {
          y: [0, -10, 0],
          rotate: [0, -6, 6, 0],
          scale: [1, 1.12, 1],
          transition: { duration: 0.8, repeat: Infinity, ease: 'easeOut' },
        };
      default:
        return { scale: 1 };
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Halo glow based on reaction */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: info.bg,
          boxShadow: `0 8px 24px ${info.shadow}`,
        }}
        animate={
          reaction === 'celebrating'
            ? { scale: [1, 1.18, 1], opacity: [0.6, 0.9, 0.6] }
            : { scale: 1, opacity: 0.8 }
        }
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Main Avatar Container */}
      <motion.div
        className={`relative grid place-items-center rounded-full border-2 ${sizeMap[size].container}`}
        style={{
          backgroundColor: info.bg,
          borderColor: info.border,
        }}
        animate={getMotionAnimation()}
      >
        <span className="select-none leading-none" role="img" aria-label={info.name}>
          {info.emoji}
        </span>

        {/* Equipped Accessory Icon/Badge */}
        {equippedAccessory && (
          <span
            className="absolute -top-1.5 -right-1.5 rounded-full border border-[#dedace] bg-[#fbf8ef] p-0.5 shadow-sm"
            title={`Equipped: ${equippedAccessory}`}
          >
            {equippedAccessory.includes('scarf')
              ? '🧣'
              : equippedAccessory.includes('beret')
              ? '🎓'
              : equippedAccessory.includes('bell')
              ? '🔔'
              : equippedAccessory.includes('crown')
              ? '👑'
              : '✨'}
          </span>
        )}

        {/* Equipped Toy Badge */}
        {equippedToy && (
          <span
            className="absolute -bottom-1 -left-1 rounded-full border border-[#dedace] bg-[#fbf8ef] p-0.5 shadow-sm"
            title={`Holding: ${equippedToy}`}
          >
            {equippedToy.includes('stick')
              ? '🪄'
              : equippedToy.includes('yarn')
              ? '🧶'
              : equippedToy.includes('acorn')
              ? '🌰'
              : '🌟'}
          </span>
        )}
      </motion.div>
    </div>
  );
}
