import React, { useState, useEffect, Component, useCallback, useRef } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("App Crash:", error, errorInfo); }
  render() {
    if (this.state.hasError) return <div style={appStyles.errorFallback}>Something went wrong. Please refresh.</div>;
    return this.props.children;
  }
}

import { appStyles, Colors, GLOBAL_STYLES, LOADING_STYLES, UI_STYLES, MODAL_STYLES } from './styles/appStyles';
import { ACADEMY_PATTERNS, CHART_PATTERNS } from './constants/patterns';
import { Chart } from './components/Chart';
import PositionSizeCalculator from './components/PositionSizeCalculator';
import { fetchRandomStockData } from './utils/data';
import type { StockData } from './utils/data';
import { useTradingSession, resetSavedBalance } from './hooks/useTradingSession';
import { useOrientation } from './hooks/useOrientation';
import { SkipForward, Square, TrendingUp, TrendingDown, Loader2, Info, X, Trash2, Volume2, VolumeX, ZoomIn, ZoomOut, BarChart3, BookOpen, Clock, User, Plus, Minus, Calculator, ChevronDown, ChevronUp, Sun, Moon, Leaf } from 'lucide-react';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { soundService, playSound } from './services/soundService';
import { format } from 'date-fns';

interface TradeRecord {
  id: string;
  date: string;
  title: string;
  returnPercentage: number;
  tradeCount: number;
}







const getTradingTitle = (pnl: number, trades: number) => {
  if (trades === 0) return "The Spectator";
  if (pnl > 50) return "Market Oracle";
  if (pnl > 30) return "Alpha Predator";
  if (pnl > 20) return "Candle Whisperer";
  if (pnl > 10) return "Trend Lord";
  if (pnl > 5) return "Wealth Alchemist";
  if (pnl > 2) return "Smart Money";
  if (pnl >= -2) return trades < 5 ? "Market Monk" : "The Bull Rider";
  if (pnl > -10) return "Exit Rookie";
  if (pnl > -20) return "Hedge Hog";
  if (pnl > -30) return "Bull Fighter";
  if (pnl > -50) return "Chaos Rider";
  return "Bag Holder";
};

const AppContent: React.FC = () => {
  const { mode, setMode, resolvedTheme } = useTheme();
  const orientation = useOrientation();
  const [stock, setStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [history, setHistory] = useState<TradeRecord[]>([]);
  const [zoom, setZoom] = useState(1);
  const [positionsCollapsed, setPositionsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'trade' | 'calculator' | 'academy' | 'history' | 'profile'>('trade');
  const [soundEnabled, setSoundEnabled] = useState(soundService.isEnabled());
  const [tradeAmount, setTradeAmount] = useState(1000);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [academySection, setAcademySection] = useState<'candle' | 'chart'>('candle');

  // Check if in landscape mode and on trade screen
  const isLandscapeTrading = orientation.isLandscape && activeTab === 'trade';


  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('candle_master_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (record: TradeRecord) => {
    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem('candle_master_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('candle_master_history');
  };

  const resetGameData = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setShowResetConfirm(false);
    // Reset balance to $10,000
    resetSavedBalance();
    // Clear trade history (so equity curve shows true performance)
    clearHistory();
    // Reload with new stock to apply the reset
    loadNewStock();
  };

  const toggleSoundEffect = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundService.setEnabled(newState);
    if (newState) {
      playSound('click'); // Play test sound
    }
  };

  const loadNewStock = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchRandomStockData();
    setStock(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadNewStock();
  }, [loadNewStock]);

  const {
    stockName,
    stockSymbol,
    startDate,
    visibleData,
    currentCandle,
    balance,
    displayBalance,
    positions,
    maxPositions,
    totalReturn,
    isGameOver,
    totalCommissions,
    unrealizedPL,
    getPositionPL,
    tradeCount,
    winCount,
    long: originalLong,
    short: originalShort,
    closePosition: originalClosePosition,
    closeAllPositions: originalCloseAllPositions,
    skipDay: originalSkipDay,
    stop: originalStop
  } = useTradingSession(stock);

  // Screen Orientation Lock/Unlock based on active tab
  useEffect(() => {
    const handleOrientation = async () => {
      try {
        if (activeTab === 'trade' && !isLoading && !isGameOver) {
          // Unlock orientation for trade screen (allow rotation)
          await ScreenOrientation.unlock();
        } else {
          // Lock to portrait for other screens (Loading, Calc, Academy, etc.)
          await ScreenOrientation.lock({ orientation: 'portrait' });
        }
      } catch (error) {
        // Silently fail on web/unsupported platforms
        console.log('Screen orientation not supported:', error);
      }
    };

    handleOrientation();
  }, [activeTab, isLoading, isGameOver]);

  // Reset tradeAmount when new game starts
  useEffect(() => {
    if (stock) {
      setTradeAmount(1000);
    }
  }, [stock]);

  // Wrap trading actions with sound effects
  const long = () => {
    playSound('trade-open');
    originalLong(tradeAmount);
  };

  const short = () => {
    playSound('trade-open');
    originalShort(tradeAmount);
  };

  const adjustTradeAmount = (delta: number) => {
    setTradeAmount(prev => {
      const newAmount = prev + delta;
      if (newAmount < 0) return 0;
      if (newAmount > balance) return Math.floor(balance);
      return newAmount;
    });
  };

  const handleTradeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) {
      setTradeAmount(0);
    } else if (value > balance) {
      setTradeAmount(Math.floor(balance));
    } else {
      setTradeAmount(value);
    }
  };

  const closePosition = (positionId: string) => {
    const pos = positions.find(p => p.id === positionId);
    if (pos) {
      const pnl = getPositionPL(pos);

      // Play profit or loss sound
      if (pnl > 0) {
        playSound('profit');
      } else {
        playSound('loss');
      }
    }
    originalClosePosition(positionId);
  };

  const closeAllPositions = () => {
    if (positions.length > 0) {
      const totalPnl = positions.reduce((sum, pos) => sum + getPositionPL(pos), 0);
      if (totalPnl > 0) {
        playSound('profit');
      } else {
        playSound('loss');
      }
    }
    originalCloseAllPositions();
  };

  const skipDay = () => {
    playSound('click');
    originalSkipDay();
  };

  const stop = () => {
    playSound('click');
    originalStop();
  };

  const winRate = tradeCount > 0 ? (winCount / tradeCount) * 100 : 0;
  const title = getTradingTitle(totalReturn, tradeCount);

  // Track if current session has been saved to prevent dupes
  const hasSavedSession = useRef(false);

  // Reset save flag on new game
  useEffect(() => {
    hasSavedSession.current = false;
  }, [stockSymbol]);

  // Save when game ends
  useEffect(() => {
    if (isGameOver && !hasSavedSession.current) {
      hasSavedSession.current = true;
      saveHistory({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title,
        returnPercentage: totalReturn,
        tradeCount
      });

      // Play win or lose sound
      if (totalReturn > 0) {
        playSound('game-win');
      } else if (totalReturn < 0) {
        playSound('game-lose');
      }
    }
  }, [isGameOver, title, totalReturn, tradeCount]);

  if (isLoading || !stock || !currentCandle) {
    return (
      <div className="loading-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="loading-content"
        >
          <Loader2 className="spinner" size={48} />
          <h2>Fetching Market Data...</h2>
          <p>Finding a mystery stock and random time window</p>
        </motion.div>
        <style>{LOADING_STYLES}</style>
      </div>
    );
  }

  return (
    <div className={`mobile-shell ${isLandscapeTrading ? 'landscape-mode' : ''}`}>
      <div className="app-container">
        {activeTab !== 'calculator' && !isLandscapeTrading && (
          <header className="header compact">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total</span>
                <span className="stat-value">${displayBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Available</span>
                <span className="stat-value">${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className={`stat-card ${totalReturn >= 0 ? 'positive' : 'negative'}`}>
                <span className="stat-label">Return</span>
                <span className="stat-value">{totalReturn.toFixed(1)}%</span>
              </div>
            </div>
            <div className="header-meta">
              <span>Price: ${currentCandle.close.toFixed(2)}</span>
              <span>Fee: 0.15%</span>
              <span>Comm: ${totalCommissions.toFixed(2)}</span>
            </div>
          </header>
        )}

        <main className={`main-content ${activeTab === 'calculator' ? 'fullscreen-mode' : ''}`}>
          {activeTab === 'trade' && (
            <>
              {/* Trade Amount Input */}
              {!isLandscapeTrading && positions.length < maxPositions && !isGameOver && (
                <div className="trade-amount-section">
                  <span className="trade-amount-label">Trade Amount</span>
                  <div className="trade-amount-controls">
                    <button
                      className="amount-btn"
                      onClick={() => adjustTradeAmount(-1000)}
                      disabled={tradeAmount <= 0}
                    >
                      <Minus size={18} />
                    </button>
                    <div className="amount-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        className="amount-input"
                        value={tradeAmount}
                        onChange={handleTradeAmountChange}
                        min={0}
                        max={balance}
                      />
                    </div>
                    <button
                      className="amount-btn"
                      onClick={() => adjustTradeAmount(1000)}
                      disabled={tradeAmount >= balance}
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      className="amount-btn-max"
                      onClick={() => setTradeAmount(Math.floor(balance))}
                      disabled={tradeAmount >= balance}
                    >
                      MAX
                    </button>
                  </div>
                </div>
              )}

              <div className="chart-wrapper">
                <AnimatePresence>
                  {!isLandscapeTrading && positions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="positions-container"
                    >
                      {/* Positions Header - Always visible */}
                      <div
                        className="positions-header"
                        onClick={() => setPositionsCollapsed(!positionsCollapsed)}
                      >
                        <div className="positions-summary">
                          <span className="positions-count">{positions.length} Position{positions.length > 1 ? 's' : ''}</span>
                          <div className="positions-total-pl-group">
                            <span className={`positions-total-pl ${unrealizedPL >= 0 ? 'text-success' : 'text-danger'}`}>
                              {unrealizedPL >= 0 ? '+' : ''}${unrealizedPL.toFixed(2)}
                            </span>
                            {positions.length > 0 && (() => {
                              const totalValue = positions.reduce((sum, pos) => sum + (pos.entryPrice * pos.amount), 0);
                              const totalPLPercent = (unrealizedPL / totalValue) * 100;
                              return (
                                <span className={`positions-total-pl-percent ${unrealizedPL >= 0 ? 'text-success' : 'text-danger'}`}>
                                  ({totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                        <button className="positions-toggle">
                          {positionsCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </button>
                      </div>

                      {/* Positions List - Collapsible */}
                      {!positionsCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="positions-list"
                        >
                          {positions.map((pos) => {
                            const positionPL = getPositionPL(pos);
                            const positionValue = pos.entryPrice * pos.amount;
                            const positionPLPercent = (positionPL / positionValue) * 100;
                            return (
                              <div
                                key={pos.id}
                                className={`position-bar ${pos.type === 'LONG' ? 'long' : 'short'}`}
                              >
                                <div className="pos-info">
                                  <span className="pos-badge">{pos.type}</span>
                                  <div className="pos-details">
                                    <span className="pos-entry">@${pos.entryPrice.toFixed(2)}</span>
                                    <span className="pos-amount">{pos.amount.toFixed(4)} units</span>
                                  </div>
                                </div>
                                <div className="pos-right">
                                  <div className="pos-pl-container">
                                    <span className={positionPL >= 0 ? 'text-success' : 'text-danger'}>
                                      {positionPL >= 0 ? '+' : ''}${positionPL.toFixed(2)}
                                    </span>
                                    <span className={`pos-pl-percent ${positionPL >= 0 ? 'text-success' : 'text-danger'}`}>
                                      ({positionPLPercent >= 0 ? '+' : ''}{positionPLPercent.toFixed(2)}%)
                                    </span>
                                  </div>
                                  <button
                                    className="pos-close-btn"
                                    onClick={() => closePosition(pos.id)}
                                    disabled={isGameOver}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="scroll-chart-container">
                  <div className="zoom-controls-floating">
                    <button
                      className="zoom-btn-mini"
                      onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
                      disabled={zoom >= 3}
                      title="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <button
                      className="zoom-btn-mini"
                      onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                      disabled={zoom <= 0.5}
                      title="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>
                  </div>
                  <div className="info-btn-floating">
                    <button
                      className="zoom-btn-mini"
                      onClick={() => setShowInfo(true)}
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <ErrorBoundary>
                    {visibleData.length > 0 ? <Chart data={visibleData} zoom={zoom} /> : <div className="loading-placeholder">Initializing chart...</div>}
                  </ErrorBoundary>
                </div>
              </div>

              {!isLandscapeTrading && (
                <section className="controls">
                  <div className="action-buttons-single-row">
                    <button
                      className="btn btn-buy"
                      onClick={long}
                      disabled={isGameOver || positions.length >= maxPositions || tradeAmount <= 0 || tradeAmount > balance}
                    >
                      <TrendingUp size={20} />
                      <span>LONG</span>
                    </button>
                    <button
                      className="btn btn-sell"
                      onClick={short}
                      disabled={isGameOver || positions.length >= maxPositions || tradeAmount <= 0 || tradeAmount > balance}
                    >
                      <TrendingDown size={20} />
                      <span>SHORT</span>
                    </button>
                    {positions.length > 0 && (
                      <button className="btn btn-close-all" onClick={closeAllPositions} disabled={isGameOver}>
                        <X size={18} />
                        <span>CLOSE ALL</span>
                      </button>
                    )}
                    <button className="btn btn-skip" onClick={skipDay} disabled={isGameOver}>
                      <SkipForward size={18} />
                      <span>SKIP</span>
                    </button>
                    <button className="btn btn-stop" onClick={stop} disabled={isGameOver}>
                      <Square size={18} />
                      <span>STOP</span>
                    </button>
                  </div>
                </section>
              )}
            </>
          )}

          {activeTab === 'calculator' && (
            <PositionSizeCalculator />
          )}

          {activeTab === 'academy' && (
            <div className="tab-content-wrapper">
              <div className="tab-header">
                <BookOpen size={28} />
                <h2>Pattern Academy</h2>
                <p className="tab-subtitle">Master trading patterns</p>
              </div>

              {/* Academy Section Tabs */}
              <div className="academy-tabs">
                <button
                  className={`academy-tab ${academySection === 'candle' ? 'active' : ''}`}
                  onClick={() => setAcademySection('candle')}
                >
                  Candlestick
                </button>
                <button
                  className={`academy-tab ${academySection === 'chart' ? 'active' : ''}`}
                  onClick={() => setAcademySection('chart')}
                >
                  Chart Patterns
                </button>
              </div>

              {/* Candle Patterns */}
              {academySection === 'candle' && (
                <div className="academy-grid">
                  {ACADEMY_PATTERNS.map((pattern) => (
                    <div key={pattern.id} className="academy-card">
                      <div className="academy-svg-wrapper">
                        {pattern.render()}
                      </div>
                      <div className="academy-info">
                        <h3>{pattern.name}</h3>
                        <p>{pattern.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Chart Patterns */}
              {academySection === 'chart' && (
                <div className="academy-grid">
                  {CHART_PATTERNS.map((pattern) => {
                    const suffix = resolvedTheme === 'sandstone' ? 'l' : 'd';
                    const imgSrc = `/patterns/${pattern.imageKey}-${suffix}.webp`;
                    return (
                      <div key={pattern.id} className="academy-card">
                        <div className="academy-img-wrapper">
                          <img
                            src={imgSrc}
                            alt={pattern.name}
                            loading="lazy"
                            onError={(e) => {
                              // Fallback: show placeholder if image not found
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="academy-info">
                          <h3>{pattern.name}</h3>
                          <p>{pattern.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="tab-content-wrapper">
              <div className="tab-header">
                <Clock size={28} />
                <h2>Trade History</h2>
                <p className="tab-subtitle">Your past performance</p>
              </div>

              {history.length > 0 && (() => {
                const INITIAL_BALANCE = 10000;
                const equityCurve = [INITIAL_BALANCE];
                let runningBalance = INITIAL_BALANCE;

                history.forEach(record => {
                  runningBalance = runningBalance * (1 + record.returnPercentage / 100);
                  equityCurve.push(runningBalance);
                });

                const finalBalance = equityCurve[equityCurve.length - 1];
                const totalReturn = finalBalance - INITIAL_BALANCE;
                const totalReturnPct = ((finalBalance / INITIAL_BALANCE - 1) * 100);
                const maxBalance = Math.max(...equityCurve);
                const minBalance = Math.min(...equityCurve);
                const range = maxBalance - minBalance || 1;

                const chartWidth = 300;
                const chartHeight = 100;
                const padding = { top: 10, bottom: 20, left: 15, right: 15 };

                const chartDrawWidth = chartWidth - padding.left - padding.right;

                const points = equityCurve.map((balance, i) => {
                  const x = padding.left + (i / (equityCurve.length - 1)) * chartDrawWidth;
                  const y = chartHeight - padding.bottom - ((balance - minBalance) / range) * (chartHeight - padding.top - padding.bottom);
                  return `${x},${y}`;
                }).join(' ');

                // Calculate Y position for the initial balance line (10,000)
                const initialBalanceY = chartHeight - padding.bottom - ((INITIAL_BALANCE - minBalance) / range) * (chartHeight - padding.top - padding.bottom);

                return (
                  <div className="equity-chart-card">
                    <div className="equity-stats">
                      <div className="equity-stat">
                        <span className="equity-label">Total Return</span>
                        <span className={`equity-value ${totalReturn >= 0 ? 'pos' : 'neg'}`}>
                          {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(0)}
                        </span>
                      </div>
                      <div className="equity-stat">
                        <span className="equity-label">Return %</span>
                        <span className={`equity-value ${totalReturnPct >= 0 ? 'pos' : 'neg'}`}>
                          {totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <svg width={chartWidth} height={chartHeight} style={appStyles.equityChart}>
                      {/* Baseline - initial balance reference line */}
                      <line
                        x1="0"
                        y1={initialBalanceY}
                        x2={chartWidth}
                        y2={initialBalanceY}
                        stroke="var(--color-text-secondary)"
                        strokeWidth="1.5"
                        strokeDasharray="5 3"
                        opacity="0.7"
                      />
                      {/* Equity curve */}
                      <polyline
                        points={points}
                        fill="none"
                        stroke={totalReturn >= 0 ? '#22c55e' : '#ef4444'}
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      {/* Data points */}
                      {equityCurve.map((balance, i) => {
                        const x = padding.left + (i / (equityCurve.length - 1)) * chartDrawWidth;
                        const y = chartHeight - padding.bottom - ((balance - minBalance) / range) * (chartHeight - padding.top - padding.bottom);
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill={totalReturn >= 0 ? '#22c55e' : '#ef4444'}
                            opacity="0.8"
                          />
                        );
                      })}
                    </svg>
                  </div>
                );

              })()}

              <div className="history-list-inline">
                {history.length === 0 ? (
                  <div className="empty-history">
                    <p>No trades recorded yet.</p>
                    <span>Complete a session to see your history.</span>
                  </div>
                ) : (
                  <>
                    {history.map((record) => (
                      <div key={record.id} className="history-item">
                        <div className="history-left">
                          <span className="history-title">{record.title}</span>
                          <span className="history-date">
                            {new Date(record.date).toLocaleDateString()} • {record.tradeCount} Trades
                          </span>
                        </div>
                        <div className="history-right">
                          <span className={`history-return ${record.returnPercentage >= 0 ? 'pos' : 'neg'}`}>
                            {record.returnPercentage > 0 ? '+' : ''}{record.returnPercentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-content-wrapper">
              <div className="profile-header-inline">
                <div className="profile-avatar-large">
                  <User size={48} color="#666" />
                </div>
                <h2>Player</h2>
                <p className="member-since">Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>

              <div className="profile-balance-card">
                <span className="balance-label">Total Portfolio Value</span>
                <span className="balance-amount">${displayBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span className="balance-return" style={{ color: totalReturn >= 0 ? Colors.Green : Colors.Red }}>
                  {totalReturn > 0 ? '+' : ''}{totalReturn.toFixed(2)}% Total Return
                </span>
                <div className="balance-detail">
                  <span>Available Cash: ${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  {positions.length > 0 && <span>In Position: ${(displayBalance - balance).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>}
                </div>
              </div>

              <div className="profile-actions">
                <button className="profile-action-btn" onClick={() => setShowInfo(true)}>
                  <Info size={20} />
                  <span>How to Play</span>
                </button>
                <button className="profile-action-btn" onClick={resetGameData}>
                  <Trash2 size={20} />
                  <span>Reset Game Data</span>
                </button>
                <button className="profile-action-btn" onClick={toggleSoundEffect}>
                  {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  <span>Sound Effects</span>
                  <div className={`toggle-switch ${soundEnabled ? 'active' : ''}`}>
                    <div className="toggle-knob"></div>
                  </div>
                </button>

                <div className="theme-selector">
                  <div className="theme-selector-header">
                    {resolvedTheme !== 'sandstone' ? <Moon size={20} /> : <Sun size={20} />}
                    <span>Theme</span>
                  </div>
                  <div className="theme-options">
                    <button
                      className={`theme-option ${mode === 'sandstone' ? 'active' : ''}`}
                      onClick={() => setMode('sandstone')}
                      style={mode === 'sandstone' ? appStyles.themeButtonSandstone : undefined}
                    >
                      <Sun size={16} />
                      <span>Sandstone</span>
                    </button>
                    <button
                      className={`theme-option ${mode === 'midnight' ? 'active' : ''}`}
                      onClick={() => setMode('midnight')}
                      style={mode === 'midnight' ? appStyles.themeButtonMidnight : undefined}
                    >
                      <Moon size={16} />
                      <span>Midnight</span>
                    </button>
                    <button
                      className={`theme-option ${mode === 'solarized' ? 'active' : ''}`}
                      onClick={() => setMode('solarized')}
                      style={mode === 'solarized' ? appStyles.themeButtonSolarized : undefined}
                    >
                      <Leaf size={16} />
                      <span>Solarized</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          {!isLandscapeTrading && (
            <nav className="bottom-nav">
              <button
                className={`nav-item ${activeTab === 'trade' ? 'active' : ''}`}
                onClick={() => setActiveTab('trade')}
              >
                <BarChart3 size={24} />
                <span>Trade</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'calculator' ? 'active' : ''}`}
                onClick={() => setActiveTab('calculator')}
              >
                <Calculator size={24} />
                <span>Calc</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'academy' ? 'active' : ''}`}
                onClick={() => setActiveTab('academy')}
              >
                <BookOpen size={24} />
                <span>Learn</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <Clock size={24} />
                <span>History</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={24} />
                <span>Profile</span>
              </button>
            </nav>
          )}
        </main>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              style={appStyles.infoModalOverlay}
              onClick={() => setShowInfo(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="info-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="info-header">
                  <h2>How to Play</h2>
                  <button className="btn-icon" onClick={() => setShowInfo(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="info-content">
                  <div className="info-item intro">
                    <h3>🌍 Welcome to Real Market Trading</h3>
                    <p>Candle Master is a stock trading simulator using <strong>real historical market data</strong> from around the world (1990-2024). You never know which period you'll face - just price, candlesticks, and daily timeframes.</p>
                  </div>
                  <div className="info-item">
                    <h3>🎯 Your Mission</h3>
                    <p><strong>Starting Capital:</strong> $10,000 virtual money</p>
                    <ul>
                      <li>Open up to <strong>3 positions</strong> simultaneously</li>
                      <li>Set your own position size per trade</li>
                      <li>All trades execute at <strong>candle close price</strong> only</li>
                    </ul>
                  </div>
                  <div className="info-item warning">
                    <h3>⚠️ Reality Check</h3>
                    <ul>
                      <li><strong>0.15%</strong> commission fee per trade</li>
                      <li>You need <strong>{'>'}0.3% profit</strong> per round-trip just to break even</li>
                      <li>Real market conditions = Real challenges</li>
                    </ul>
                  </div>
                  <div className="info-item">
                    <h3>🎮 Controls</h3>
                    <ul>
                      <li><strong>SKIP</strong> → Move to next day's candle</li>
                      <li><strong>STOP</strong> → End current session & lock in results</li>
                    </ul>
                  </div>
                  <div className="info-item challenge">
                    <h3>🏆 The Challenge</h3>
                    <p>Can you survive the markets and grow your account? If you're truly skilled, you'll become the next <strong>Candle Master</strong>.</p>
                    <p className="good-luck">Good luck, trader. 🍀</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Reset Confirmation Modal */}
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              style={appStyles.resetConfirmOverlay}
              onClick={() => setShowResetConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="reset-confirm-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="reset-modal-icon">⚠️</div>
                <h2 className="reset-modal-title">Reset Game Data?</h2>
                <div className="reset-modal-content">
                  <div className="reset-info-item">
                    <span className="reset-icon">✅</span>
                    <span>Balance will reset to <strong>$10,000</strong></span>
                  </div>
                  <div className="reset-info-item">
                    <span className="reset-icon">✅</span>
                    <span>Current game will restart</span>
                  </div>
                  <div className="reset-info-item highlight">
                    <span className="reset-icon">📊</span>
                    <span>Your trading history will <strong>NOT</strong> be deleted</span>
                  </div>
                </div>
                <div className="reset-modal-actions">
                  <button
                    className="btn-reset-cancel"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-reset-confirm"
                    onClick={confirmReset}
                  >
                    Reset Balance
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="modal-overlay"
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="game-over-modal cream-theme"
              >
                <div className="modal-pill"></div>
                <div className="title-section">
                  <p className="summary-label">TRADING RESULT</p>
                  <h1 className="trading-title">{title}</h1>
                </div>

                <div className="stats-row">
                  <div className="mini-stat">
                    <span className="label">RETURN</span>
                    <span className={`value ${totalReturn >= 0 ? 'pos' : 'neg'}`}>
                      {totalReturn > 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mini-divider"></div>
                  <div className="mini-stat">
                    <span className="label">WIN RATE</span>
                    <span className="value">{winRate.toFixed(0)}%</span>
                  </div>
                  <div className="mini-divider"></div>
                  <div className="mini-stat">
                    <span className="label">TRADES</span>
                    <span className="value">{tradeCount}</span>
                  </div>
                </div>

                <div className="reveal-section-compact">
                  <p className="stock-reveal">{stockSymbol}</p>
                  <p className="stock-name-reveal">{stockName}</p>
                  {startDate && (
                    <p className="date-reveal">
                      Trading Period: {format(new Date(startDate), 'dd MMM yyyy')} - {format(new Date(visibleData[visibleData.length - 1]?.time || startDate), 'dd MMM yyyy')}
                    </p>
                  )}
                </div>

                <button className="btn btn-primary" onClick={loadNewStock}>START NEW GAME</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{GLOBAL_STYLES}</style>
      <style>{UI_STYLES}</style>
      <style>{MODAL_STYLES}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
