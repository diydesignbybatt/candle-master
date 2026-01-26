import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface OnboardingSlide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    image: '/tutorial/01-welcome.webp',
    title: 'Welcome to Candle Master',
    description: 'Master the art of blind trading with real historical market data.',
  },
  {
    id: 2,
    image: '/tutorial/02-chart.webp',
    title: 'The Mystery Chart',
    description: 'You see real candlesticks from a secret stock. No one knows what it is until the end.',
  },
  {
    id: 3,
    image: '/tutorial/03-trade.webp',
    title: 'Open Your Position',
    description: 'Tap LONG if you think price will go up, SHORT if you think it will go down.',
  },
  {
    id: 4,
    image: '/tutorial/04-positions.webp',
    title: 'Manage Positions',
    description: 'Track your open positions and close them anytime to lock in profit or cut losses.',
  },
  {
    id: 5,
    image: '/tutorial/05-skip.webp',
    title: 'Navigate Through Time',
    description: 'Tap SKIP to move to the next day and see the next candle.',
  },
  {
    id: 6,
    image: '/tutorial/06-goal.webp',
    title: 'Your Goal',
    description: 'Make profit! But remember: 0.15% commission per trade. You need >0.3% profit just to break even.',
  },
  {
    id: 7,
    image: '/tutorial/07-stop.webp',
    title: 'End Your Session',
    description: 'Tap STOP when you want to end the game and see your final results.',
  },
  {
    id: 8,
    image: '/tutorial/08-history.webp',
    title: 'Track Your Progress',
    description: 'View your trade history and see how your skills improve over time.',
  },
  {
    id: 9,
    image: '/tutorial/09-ready.webp',
    title: 'Are You Ready?',
    description: 'Time to prove your trading skills. Can you become the next Candle Master?',
  },
];

interface OnboardingTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slide = ONBOARDING_SLIDES[currentSlide];
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === ONBOARDING_SLIDES.length - 1;

  const goNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (!isFirstSlide) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="onboarding-screen">
      {/* Skip Button */}
      <button className="onboarding-skip" onClick={onSkip}>
        <X size={20} />
      </button>

      {/* Slide Content */}
      <div className="onboarding-content">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="onboarding-slide"
          >
            {/* Image */}
            <div className="onboarding-image-container">
              <img
                src={slide.image}
                alt={slide.title}
                className="onboarding-image"
                onError={(e) => {
                  // Fallback placeholder if image not found
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="400" viewBox="0 0 360 400"><rect fill="%23334155" width="360" height="400"/><text fill="%2394a3b8" font-family="system-ui" font-size="14" x="180" y="200" text-anchor="middle">Image ' + slide.id + '</text></svg>';
                }}
              />
            </div>

            {/* Text */}
            <div className="onboarding-text">
              <h2 className="onboarding-title">{slide.title}</h2>
              <p className="onboarding-description">{slide.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="onboarding-nav">
        {/* Dots */}
        <div className="onboarding-dots">
          {ONBOARDING_SLIDES.map((_, index) => (
            <button
              key={index}
              className={`onboarding-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="onboarding-buttons">
          {!isFirstSlide && (
            <button className="onboarding-btn onboarding-btn-prev" onClick={goPrev}>
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
          )}

          <button className="onboarding-btn onboarding-btn-next" onClick={goNext}>
            <span>{isLastSlide ? "Let's Trade!" : 'Next'}</span>
            {!isLastSlide && <ChevronRight size={20} />}
          </button>
        </div>

        {/* Skip Tutorial Link */}
        <button className="onboarding-skip-text" onClick={onSkip}>
          Skip Tutorial
        </button>
      </div>

      <style>{ONBOARDING_STYLES}</style>
    </div>
  );
};

const ONBOARDING_STYLES = `
  .onboarding-screen {
    position: fixed;
    inset: 0;
    background: var(--bg-primary);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    padding: calc(env(safe-area-inset-top, 0px) + 20px) 16px calc(env(safe-area-inset-bottom, 0px) + 16px);
  }

  .onboarding-skip {
    position: absolute;
    top: calc(env(safe-area-inset-top, 0px) + 16px);
    right: 16px;
    background: var(--bg-tertiary);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-text-secondary);
    z-index: 10;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .onboarding-skip:active {
    background: var(--color-border);
    transform: scale(0.95);
  }

  .onboarding-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-height: 0;
  }

  .onboarding-slide {
    width: 100%;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .onboarding-image-container {
    width: 100%;
    max-width: 320px;
    aspect-ratio: 9 / 16;
    max-height: 50vh;
    border-radius: 16px;
    overflow: hidden;
    background: var(--bg-tertiary);
    margin-bottom: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }

  .onboarding-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .onboarding-text {
    padding: 0 16px;
  }

  .onboarding-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-text);
    margin: 0 0 12px 0;
  }

  .onboarding-description {
    font-size: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  .onboarding-nav {
    flex-shrink: 0;
    padding-top: 24px;
  }

  .onboarding-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  .onboarding-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-border);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s;
  }

  .onboarding-dot.active {
    width: 24px;
    border-radius: 4px;
    background: var(--color-text);
  }

  .onboarding-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .onboarding-btn {
    height: 52px;
    padding: 0 24px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    border: none;
  }

  .onboarding-btn:active {
    transform: scale(0.98);
  }

  .onboarding-btn-prev {
    background: var(--bg-tertiary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .onboarding-btn-next {
    background: var(--color-text);
    color: var(--bg-primary);
    min-width: 140px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .onboarding-btn-next:active {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .onboarding-skip-text {
    background: none;
    border: none;
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: 12px;
    margin-top: 8px;
    transition: color 0.2s;
  }

  .onboarding-skip-text:active {
    color: var(--color-text-secondary);
  }
`;

export default OnboardingTutorial;
