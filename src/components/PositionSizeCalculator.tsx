import React, { useState, useMemo } from 'react';
import { Calculator, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Percent, Target, Shield, Info, X } from 'lucide-react';

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

  const [inputs, setInputs] = useState<CalculatorInputs>({
    portfolioValue: 100000,
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
          color: var(--bg-primary);
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
