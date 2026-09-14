import React from 'react';
import { Character } from '../types';

interface Props {
  character: Character;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isPulling?: boolean;
  isCelebrating?: boolean;
  isStunned?: boolean;
  className?: string;
  teamSide?: 'left' | 'right';
}

export const CharacterAvatar: React.FC<Props> = ({
  character,
  size = 'md',
  isPulling = false,
  isCelebrating = false,
  isStunned = false,
  className = '',
  teamSide = 'left',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-32 h-32 text-6xl',
  };

  const ringColor = character.accentColor;

  return (
    <div
      className={`relative rounded-2xl flex items-center justify-center select-none shadow-md transition-all duration-300 ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: `${ringColor}20`,
        border: `3px solid ${ringColor}`,
        transform: isPulling
          ? teamSide === 'left'
            ? 'rotate(-14deg) scale(1.08)'
            : 'rotate(14deg) scale(1.08)'
          : isCelebrating
          ? 'scale(1.15) translateY(-6px)'
          : isStunned
          ? 'rotate(8deg) scale(0.95)'
          : 'none',
      }}
    >
      <span
        className={`filter drop-shadow-md transition-transform duration-200 ${
          isCelebrating ? 'animate-bounce' : ''
        }`}
        role="img"
        aria-label={character.name}
      >
        {character.emoji}
      </span>

      {/* Sweat drop on stunned */}
      {isStunned && (
        <span className="absolute -top-1 -right-1 text-base animate-pulse">
          💧
        </span>
      )}

      {/* Sparks / Fire on pulling */}
      {isPulling && (
        <span className="absolute -top-2 -left-2 text-base animate-ping">
          ✨
        </span>
      )}

      {/* Crown on celebrating */}
      {isCelebrating && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">
          👑
        </span>
      )}
    </div>
  );
};
