import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calculator, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Percent, Target, Shield, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';

const TRADING_GUIDES = [
  {
    id: 1,
    icon: '💡',
    title: 'Position Sizing Basics',
    content: `Never risk more than 1-2% of your portfolio on a single trade. This protects you from devastating losses and keeps you in the game long-term. Even professionals rarely risk more than 5%.`,
    keyPoint: 'Small losses are recoverable. Large losses are not.'
  },
  {
    id: 2,
    icon: '🎯',
    title: 'Setting Stop Loss',
    content: `Your stop loss should be based on technical levels, not random numbers. Place it below support (for long) or above resistance (for short).`,
    bullets: ['Below recent swing low', 'Below key moving average', '1-2 ATR from entry', 'Below pattern breakout level'],
    dosDonts: { dont: "Set stop based on how much you want to lose", do: "Let price action determine your stop" }
  },
  {
    id: 3,
    icon: '⚖️',
    title: 'Risk-Reward Ratio',
    content: `Aim for at least 1:2 risk-reward ratio. If you risk $100, target $200+ profit. With this ratio, you only need to win 40% of trades to be profitable.`,
    examples: [
      { ratio: '1:1', winRate: 'Need 50% win rate to breakeven' },
      { ratio: '1:2', winRate: 'Need 33% win rate to profit' },
      { ratio: '1:3', winRate: 'Need 25% win rate to profit' }
    ],
    keyPoint: 'Better ratios = More room for mistakes'
  },
  {
    id: 4,
    icon: '🔄',
    title: 'Portfolio Diversification',
    content: `Don't put all eggs in one basket—even if you're confident.`,
    bullets: ['3-5 positions = Good diversification', 'Max 20-30% in single trade', 'Spread across different sectors', 'Mix timeframes (swing + position)'],
    keyPoint: 'One bad trade shouldn\'t hurt your entire portfolio.'
  },
  {
    id: 5,
    icon: '⚡',
    title: 'Understanding Leverage',
    content: `Leverage amplifies both gains AND losses. Use with extreme caution.`,
    leverageExamples: [
      { leverage: '1x', impact: 'No leverage (safest)' },
      { leverage: '5x', impact: '5% move = 25% gain/loss' },
      { leverage: '10x', impact: '5% move = 50% gain/loss' },
      { leverage: '20x', impact: '5% move = 100% (liquidation!)' }
    ],
    warnings: ['High leverage = High risk of total loss', 'Start with low/no leverage until consistently profitable']
  }
];

interface CalculatorInputs {
  portfolioValue: number;
  maxLossType: 'amount' | 'percent';
  maxLossValue: number;
  entryPrice: number;
  stopLoss: number;
}

interface CalculatorResults {
  shares: number;
  positionValue: number;
  maxLossAmount: number;
  portfolioUsagePercent: number;
  direction: 'LONG' | 'SHORT';
}

interface WarningState {
  type: 'warning' | 'error' | null;
  message: string;
}

const PositionSizeCalculator: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [activeGuideIndex, setActiveGuideIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToGuide = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }
    setActiveGuideIndex(index);
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      const scrollLeft = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== activeGuideIndex && newIndex >= 0 && newIndex < TRADING_GUIDES.length) {
        setActiveGuideIndex(newIndex);
      }
    }
  };

  const [inputs, setInputs] = useState<CalculatorInputs>({
    portfolioValue: 10000,
    maxLossType: 'percent',
    maxLossValue: 2,
    entryPrice: 100,
    stopLoss: 95
  });

  const updateInput = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const results = useMemo((): CalculatorResults | null => {
    const { portfolioValue, maxLossType, maxLossValue, entryPrice, stopLoss } = inputs;

    // Validation
    if (portfolioValue <= 0 || entryPrice <= 0 || stopLoss <= 0) {
      return null;
    }

    // Calculate direction
    const direction: 'LONG' | 'SHORT' = stopLoss < entryPrice ? 'LONG' : 'SHORT';

    // Calculate max loss amount
    const maxLossAmount = maxLossType === 'percent'
      ? (maxLossValue / 100) * portfolioValue
      : maxLossValue;

    // Calculate risk per share
    const riskPerShare = Math.abs(entryPrice - stopLoss);

    if (riskPerShare === 0) return null;

    // Calculate shares
    const shares = maxLossAmount / riskPerShare;

    // Position value
    const positionValue = shares * entryPrice;

    // Portfolio usage
    const portfolioUsagePercent = (positionValue / portfolioValue) * 100;

    return {
      shares,
      positionValue,
      maxLossAmount,
      portfolioUsagePercent,
      direction
    };
  }, [inputs]);

  const warning = useMemo((): WarningState => {
    if (!results) return { type: null, message: '' };

    if (results.portfolioUsagePercent > 100) {
      return {
        type: 'error',
        message: 'Insufficient capital! Position requires more than available funds.'
      };
    }

    if (results.portfolioUsagePercent > 50) {
      return {
        type: 'warning',
        message: 'High position size! Consider reducing to manage risk.'
      };
    }

    return { type: null, message: '' };
  }, [results]);

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <Calculator size={28} />
        <div className="calculator-title-section">
          <h2>Position Calculator</h2>
          <p className="calculator-subtitle">Calculate optimal position size</p>
        </div>
        <button className="info-btn" onClick={() => setShowInfo(true)}>
          <Info size={24} />
        </button>
      </div>

      <div className="calculator-content">
        {/* Input Section */}
        <div className="input-section">
          <div className="input-group">
            <label>
              <DollarSign size={16} />
              Portfolio Value
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="number"
                value={inputs.portfolioValue}
                onChange={(e) => updateInput('portfolioValue', parseFloat(e.target.value) || 0)}
                min={0}
              />
            </div>
          </div>

          <div className="input-group">
            <label>
              <Shield size={16} />
              Max Loss
            </label>
            <div className="input-row">
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${inputs.maxLossType === 'percent' ? 'active' : ''}`}
                  onClick={() => updateInput('maxLossType', 'percent')}
                >
                  <Percent size={14} />
                </button>
                <button
                  className={`toggle-btn ${inputs.maxLossType === 'amount' ? 'active' : ''}`}
                  onClick={() => updateInput('maxLossType', 'amount')}
                >
                  <DollarSign size={14} />
                </button>
              </div>
              <div className="input-wrapper flex-1">
                <span className="input-prefix">
                  {inputs.maxLossType === 'percent' ? '%' : '$'}
                </span>
                <input
                  type="number"
                  value={inputs.maxLossValue}
                  onChange={(e) => updateInput('maxLossValue', parseFloat(e.target.value) || 0)}
                  min={0}
                  step={inputs.maxLossType === 'percent' ? 0.5 : 100}
                />
              </div>
            </div>
          </div>

          <div className="input-row-double">
            <div className="input-group">
              <label>
                <Target size={16} />
                Entry Price
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  value={inputs.entryPrice}
                  onChange={(e) => updateInput('entryPrice', parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            <div className="input-group">
              <label>
                <AlertTriangle size={16} />
                Stop Loss
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  value={inputs.stopLoss}
                  onChange={(e) => updateInput('stopLoss', parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        {warning.type && (
          <div className={`warning-box ${warning.type}`}>
            <AlertTriangle size={18} />
            <span>{warning.message}</span>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="results-section">
            <div className="direction-badge-wrapper">
              <span className={`direction-badge ${results.direction.toLowerCase()}`}>
                {results.direction === 'LONG' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {results.direction}
              </span>
            </div>

            <div className="result-grid">
              <div className="result-card primary">
                <span className="result-label">Shares to Buy</span>
                <span className="result-value">{results.shares.toFixed(4)}</span>
              </div>

              <div className="result-card">
                <span className="result-label">Position Value</span>
                <span className="result-value">${results.positionValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>

              <div className="result-card">
                <span className="result-label">Max Loss</span>
                <span className="result-value loss">${results.maxLossAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>

              <div className="result-card full-width">
                <span className="result-label">Portfolio Usage</span>
                <span className={`result-value ${results.portfolioUsagePercent > 50 ? 'warning' : ''}`}>
                  {results.portfolioUsagePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Educational Guides Carousel */}
        <div className="guides-section">
          <div className="guides-header">
            <span className="guides-icon">📖</span>
            <h3>Quick Guides</h3>
          </div>

          <div className="carousel-container">
            <button
              className="carousel-arrow left"
              onClick={() => scrollToGuide(Math.max(0, activeGuideIndex - 1))}
              disabled={activeGuideIndex === 0}
            >
              <ChevronLeft size={20} />
            </button>

            <div
              className="carousel-track"
              ref={carouselRef}
              onScroll={handleScroll}
            >
              {TRADING_GUIDES.map((guide) => (
                <div key={guide.id} className="guide-card">
                  <span className="guide-icon">{guide.icon}</span>
                  <h4 className="guide-title">{guide.title}</h4>
                  <p className="guide-content">{guide.content}</p>

                  {guide.bullets && (
                    <ul className="guide-bullets">
                      {guide.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {guide.dosDonts && (
                    <div className="guide-dos-donts">
                      <p className="dont">❌ Never: {guide.dosDonts.dont}</p>
                      <p className="do">✓ Always: {guide.dosDonts.do}</p>
                    </div>
                  )}

                  {guide.examples && (
                    <div className="guide-examples">
                      {guide.examples.map((ex, i) => (
                        <div key={i} className="example-row">
                          <span className="ratio">{ex.ratio}</span>
                          <span className="desc">{ex.winRate}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {guide.leverageExamples && (
                    <div className="guide-leverage">
                      {guide.leverageExamples.map((ex, i) => (
                        <div key={i} className="leverage-row">
                          <span className="lev">{ex.leverage}</span>
                          <span className="impact">{ex.impact}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {guide.warnings && (
                    <div className="guide-warnings">
                      {guide.warnings.map((w, i) => (
                        <p key={i}>{i === 0 ? '⚠️' : '💡'} {w}</p>
                      ))}
                    </div>
                  )}

                  {guide.keyPoint && (
                    <div className="guide-keypoint">
                      <strong>Key Rule:</strong> {guide.keyPoint}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              className="carousel-arrow right"
              onClick={() => scrollToGuide(Math.min(TRADING_GUIDES.length - 1, activeGuideIndex + 1))}
              disabled={activeGuideIndex === TRADING_GUIDES.length - 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="carousel-dots">
            {TRADING_GUIDES.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeGuideIndex ? 'active' : ''}`}
                onClick={() => scrollToGuide(index)}
              />
            ))}
          </div>
          <p className="swipe-hint">Swipe for more tips</p>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="info-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-header">
              <h3>How to Use</h3>
              <button className="close-btn" onClick={() => setShowInfo(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="info-modal-content">
              <div className="info-intro">
                <p>This calculator is designed for <strong>real-world trading</strong>. Use it to determine the optimal position size for your actual trades, ensuring proper risk management every time.</p>
              </div>

              <div className="info-step">
                <span className="step-number">1</span>
                <div>
                  <strong>Portfolio Value</strong>
                  <p>Enter your total trading capital (the amount you have available to trade).</p>
                </div>
              </div>

              <div className="info-step">
                <span className="step-number">2</span>
                <div>
                  <strong>Max Loss</strong>
                  <p>Set the maximum amount you're willing to lose on this trade. Use % for a percentage of your portfolio (recommended: 1-2%) or $ for a fixed amount.</p>
                </div>
              </div>

              <div className="info-step">
                <span className="step-number">3</span>
                <div>
                  <strong>Entry Price</strong>
                  <p>The price at which you plan to buy the stock.</p>
                </div>
              </div>

              <div className="info-step">
                <span className="step-number">4</span>
                <div>
                  <strong>Stop Loss</strong>
                  <p>The price at which you'll exit if the trade goes against you. Set below entry for LONG, above for SHORT.</p>
                </div>
              </div>

              <div className="info-tip">
                <strong>Pro Tip</strong>
                <p>Never risk more than 1-2% of your portfolio on a single trade. This calculator helps you determine exactly how many shares to buy to maintain proper risk management.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .calculator-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          overflow: hidden;
        }

        .calculator-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4%;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--color-border);
        }

        .calculator-title-section {
          flex: 1;
        }

        .calculator-header h2 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0;
        }

        .calculator-subtitle {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .info-btn {
          background: transparent;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: var(--color-text);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-btn:active {
          background: var(--bg-tertiary);
        }

        .calculator-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 4%;
          padding-bottom: calc(var(--controls-height) + var(--safe-area-bottom) + 1rem);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .input-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 16px;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
          width: 100%;
        }

        .input-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 0 12px;
          height: 48px;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .input-wrapper.flex-1 {
          flex: 1;
        }

        .input-prefix {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          margin-right: 6px;
        }

        .input-wrapper input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text);
          text-align: right;
          font-family: inherit;
          min-width: 0;
          width: 100%;
        }

        .input-wrapper input:focus {
          outline: none;
        }

        .input-wrapper input::-webkit-outer-spin-button,
        .input-wrapper input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .input-wrapper input[type=number] {
          -moz-appearance: textfield;
        }

        .input-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .input-row-double {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        .input-row-double .input-group {
          min-width: 0;
        }

        .input-row-double .input-wrapper {
          min-width: 0;
        }

        .input-row-double .input-wrapper input {
          width: 100%;
          min-width: 0;
        }

        .toggle-group {
          display: flex;
          background: var(--bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          overflow: hidden;
        }

        .toggle-btn {
          width: 44px;
          height: 48px;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .toggle-btn.active {
          background: var(--color-text);
          color: white;
        }

        .warning-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 16px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .warning-box.warning {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .warning-box.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .results-section {
          background: var(--bg-primary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 16px;
        }

        .direction-badge-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }

        .direction-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .direction-badge.long {
          background: rgba(34, 197, 94, 0.15);
          color: var(--color-green);
        }

        .direction-badge.short {
          background: rgba(239, 68, 68, 0.15);
          color: var(--color-red);
        }

        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .result-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .result-card.primary {
          grid-column: 1 / -1;
          text-align: center;
          padding: 16px;
        }

        .result-card.full-width {
          grid-column: 1 / -1;
          text-align: center;
        }

        .result-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .result-value {
          font-size: 1rem;
          font-weight: 800;
          color: var(--color-text);
        }

        .result-card.primary .result-value {
          font-size: 1.5rem;
        }

        .result-value.loss {
          color: var(--color-red);
        }

        .result-value.warning {
          color: #f59e0b;
        }

        /* Educational Guides Carousel */
        .guides-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--color-border);
        }

        .guides-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .guides-header .guides-icon {
          font-size: 1.25rem;
        }

        .guides-header h3 {
          font-size: 1rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0;
        }

        .carousel-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-primary);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.15s;
        }

        .carousel-arrow.left {
          left: -8px;
        }

        .carousel-arrow.right {
          right: -8px;
        }

        .carousel-arrow:hover {
          background: var(--bg-tertiary);
        }

        .carousel-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .carousel-track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          gap: 0;
          width: 100%;
        }

        .carousel-track::-webkit-scrollbar {
          display: none;
        }

        .guide-card {
          flex: 0 0 100%;
          min-width: 100%;
          scroll-snap-align: start;
          background: var(--bg-primary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 20px;
          box-sizing: border-box;
        }

        .guide-card .guide-icon {
          display: block;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 12px;
        }

        .guide-card .guide-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--color-text);
          text-align: center;
          margin: 0 0 12px 0;
        }

        .guide-card .guide-content {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .guide-bullets {
          margin: 0 0 12px 0;
          padding-left: 20px;
        }

        .guide-bullets li {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: 4px;
        }

        .guide-dos-donts {
          background: var(--bg-tertiary);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }

        .guide-dos-donts p {
          font-size: 0.75rem;
          margin: 0;
          line-height: 1.5;
        }

        .guide-dos-donts .dont {
          color: var(--color-red);
          margin-bottom: 6px;
        }

        .guide-dos-donts .do {
          color: var(--color-green);
        }

        .guide-examples, .guide-leverage {
          background: var(--bg-tertiary);
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 12px;
        }

        .example-row, .leverage-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--color-border);
        }

        .example-row:last-child, .leverage-row:last-child {
          border-bottom: none;
        }

        .example-row .ratio, .leverage-row .lev {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .example-row .desc, .leverage-row .impact {
          font-size: 0.7rem;
          color: var(--color-text-secondary);
        }

        .guide-warnings {
          margin-bottom: 12px;
        }

        .guide-warnings p {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          margin: 0 0 4px 0;
          line-height: 1.4;
        }

        .guide-keypoint {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          padding: 12px;
          font-size: 0.8rem;
          color: var(--color-text);
          line-height: 1.4;
        }

        .guide-keypoint strong {
          color: var(--color-green);
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }

        .carousel-dots .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-border);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s;
        }

        .carousel-dots .dot.active {
          background: var(--color-text);
          transform: scale(1.25);
        }

        .swipe-hint {
          text-align: center;
          font-size: 0.7rem;
          color: var(--color-text-tertiary);
          margin: 8px 0 0 0;
        }

        /* Info Modal */
        .info-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1100;
        }

        .info-modal {
          background: var(--bg-primary);
          border-radius: 16px;
          width: 100%;
          max-width: 360px;
          max-height: 80vh;
          overflow-y: auto;
          border: 1px solid var(--color-border);
        }

        .info-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          background: var(--bg-primary);
        }

        .info-modal-header h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: var(--color-text-secondary);
          border-radius: 50%;
        }

        .close-btn:active {
          background: var(--bg-tertiary);
        }

        .info-modal-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-intro {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 8px;
        }

        .info-intro p {
          font-size: 0.85rem;
          color: var(--color-text);
          line-height: 1.5;
          margin: 0;
          text-align: center;
        }

        .info-intro strong {
          color: var(--color-green);
        }

        .info-step {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .step-number {
          width: 28px;
          height: 28px;
          background: var(--color-text);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .info-step strong {
          display: block;
          font-size: 0.9rem;
          color: var(--color-text);
          margin-bottom: 4px;
        }

        .info-step p {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
          margin: 0;
        }

        .info-tip {
          background: var(--bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 16px;
          margin-top: 8px;
        }

        .info-tip strong {
          display: block;
          font-size: 0.85rem;
          color: var(--color-green);
          margin-bottom: 8px;
        }

        .info-tip p {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default PositionSizeCalculator;
