import React, { useState, useEffect, useCallback } from 'react';

interface AmbientEffectProps {
  theme: string;
}

interface EffectItem {
  id: number;
  posX: number;   // random X position (%)
  posY: number;   // random Y position (%)
  duration: number; // animation duration (s)
  delay: number;    // slight random delay (s)
  size: number;     // font size (px)
}

// Keyframes injected once
const KEYFRAMES = `
@keyframes ambient-cloud {
  0%   { transform: translateX(-30px) translateY(0); opacity: 0; }
  10%  { opacity: 0.12; }
  90%  { opacity: 0.12; }
  100% { transform: translateX(calc(100vw + 30px)) translateY(-5px); opacity: 0; }
}
@keyframes ambient-star {
  0%   { opacity: 0; transform: scale(0.3); }
  40%  { opacity: 0.35; transform: scale(1); }
  60%  { opacity: 0.35; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.3); }
}
@keyframes ambient-leaf {
  0%   { transform: translateY(-15px) translateX(0) rotate(0deg); opacity: 0; }
  10%  { opacity: 0.18; }
  25%  { transform: translateY(25%) translateX(12px) rotate(60deg); opacity: 0.18; }
  50%  { transform: translateY(55%) translateX(-8px) rotate(140deg); opacity: 0.15; }
  75%  { transform: translateY(80%) translateX(15px) rotate(220deg); opacity: 0.10; }
  100% { transform: translateY(110%) translateX(3px) rotate(300deg); opacity: 0; }
}
`;

let keyframesInjected = false;

const injectKeyframes = () => {
  if (keyframesInjected) return;
  const style = document.createElement('style');
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
  keyframesInjected = true;
};

// Config per theme
const THEME_CONFIG: Record<string, {
  emoji: string;
  animation: string;
  durationRange: [number, number];
  sizeRange: [number, number];
  posXRange: [number, number];
  posYRange: [number, number];
}> = {
  sandstone: {
    emoji: '☁️',
    animation: 'ambient-cloud',
    durationRange: [10, 16],
    sizeRange: [10, 16],
    posXRange: [0, 0],        // always start from left edge
    posYRange: [8, 35],       // upper portion of chart
  },
  midnight: {
    emoji: '✦',
    animation: 'ambient-star',
    durationRange: [2.5, 4],
    sizeRange: [4, 7],
    posXRange: [5, 90],
    posYRange: [5, 70],
  },
  solarized: {
    emoji: '🍃',
    animation: 'ambient-leaf',
    durationRange: [5, 9],
    sizeRange: [8, 13],
    posXRange: [10, 85],
    posYRange: [0, 0],        // always start from top
  },
};

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

let nextId = 0;

export const AmbientEffect: React.FC<AmbientEffectProps> = ({ theme }) => {
  const [effects, setEffects] = useState<EffectItem[]>([]);

  const spawnEffect = useCallback(() => {
    const config = THEME_CONFIG[theme];
    if (!config) return;

    const newEffect: EffectItem = {
      id: nextId++,
      posX: randomBetween(config.posXRange[0], config.posXRange[1]),
      posY: randomBetween(config.posYRange[0], config.posYRange[1]),
      duration: randomBetween(config.durationRange[0], config.durationRange[1]),
      delay: randomBetween(0, 0.5),
      size: randomBetween(config.sizeRange[0], config.sizeRange[1]),
    };

    setEffects(prev => [...prev, newEffect]);

    // Remove after animation completes
    const totalTime = (newEffect.duration + newEffect.delay) * 1000 + 200;
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== newEffect.id));
    }, totalTime);
  }, [theme]);

  useEffect(() => {
    injectKeyframes();

    // Spawn first effect after a short delay (3-5s)
    const initialDelay = setTimeout(() => {
      spawnEffect();
    }, 3000 + Math.random() * 2000);

    // Then spawn every 12-18 seconds (average ~15s)
    const interval = setInterval(() => {
      spawnEffect();
    }, 12000 + Math.random() * 6000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [spawnEffect]);

  // Clear effects when theme changes
  useEffect(() => {
    setEffects([]);
  }, [theme]);

  const config = THEME_CONFIG[theme];
  if (!config) return null;

  return (
    <div
      className="ambient-effect-container"
      aria-hidden="true"
    >
      {effects.map(effect => (
        <span
          key={effect.id}
          style={{
            position: 'absolute',
            left: `${effect.posX}%`,
            top: `${effect.posY}%`,
            fontSize: `${effect.size}px`,
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
            animation: `${config.animation} ${effect.duration}s ease-in-out ${effect.delay}s forwards`,
            willChange: 'transform, opacity',
            // Star gets special color instead of emoji rendering
            ...(theme === 'midnight' ? {
              color: 'rgba(200, 210, 255, 0.4)',
              textShadow: '0 0 3px rgba(180, 200, 255, 0.3)',
            } : {}),
          }}
        >
          {config.emoji}
        </span>
      ))}
    </div>
  );
};
