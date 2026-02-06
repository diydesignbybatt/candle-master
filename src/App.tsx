import React, { useState, useEffect, Component, useCallback, useRef, Suspense, lazy } from 'react';
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

import { appStyles, Colors, GLOBAL_STYLES, LOADING_STYLES, UI_STYLES, MODAL_STYLES, TABLET_STYLES } from './styles/appStyles';
import { ACADEMY_PATTERNS, CHART_PATTERNS } from './constants/patterns';
import type { ChartPattern } from './constants/patterns';
import { POSITION_SIZING_GUIDES, SCALE_IN_OUT_GUIDES } from './constants/guides';
import { getCharacterResult } from './constants/characters';
import { Chart } from './components/Chart';
import { fetchRandomStockData } from './utils/data';
import type { StockData } from './utils/data';
import { useTradingSession, resetSavedBalance, getSavedSession, clearSession } from './hooks/useTradingSession';
import { useOrientation } from './hooks/useOrientation';
import { SkipForward, Square, TrendingUp, TrendingDown, Loader2, Info, X, Trash2, Volume2, VolumeX, ZoomIn, ZoomOut, BarChart3, BookOpen, Clock, User, Plus, Minus, Calculator, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowLeft, Sun, Moon, Leaf, Star } from 'lucide-react';
import { useSubscription } from './hooks/useSubscription';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy load components that are not needed immediately
const WelcomeScreen = lazy(() => import('./components/WelcomeScreen').then(m => ({ default: m.WelcomeScreen })));
const OnboardingTutorial = lazy(() => import('./components/OnboardingTutorial').then(m => ({ default: m.OnboardingTutorial })));
const PositionSizeCalculator = lazy(() => import('./components/PositionSizeCalculator'));
import { motion, AnimatePresence } from 'framer-motion';
import { soundService, playSound } from './services/soundService';
import { format } from 'date-fns';
import { LogOut, Link } from 'lucide-react';

interface TradeRecord {
  id: string;
  date: string;
  stockSymbol: string;
  stockName: string;
  returnPercentage: number;
  tradeCount: number;
  winRate: number;
}








const AppContent: React.FC = () => {
  // All hooks must be called before any conditional returns (React Rules of Hooks)
  const { mode, setMode, resolvedTheme } = useTheme();
  const { user, isAuthenticated, isGuest, signOut, linkAccount } = useAuth();
  const orientation = useOrientation();
  const { isPro, upgradeToPro, resetToFree } = useSubscription();

  // Onboarding state - check if user has completed the tutorial
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('candle_master_onboarding_complete') === 'true';
  });

  const completeOnboarding = () => {
    localStorage.setItem('candle_master_onboarding_complete', 'true');
    setHasCompletedOnboarding(true);
  };

  const [stock, setStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [history, setHistory] = useState<TradeRecord[]>([]);
  const [zoom, setZoom] = useState(1);
  const [positionsCollapsed, setPositionsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'trade' | 'calculator' | 'academy' | 'history' | 'profile'>('trade');
  const [soundEnabled, setSoundEnabled] = useState(soundService.isEnabled());
  const [tradeAmount, setTradeAmount] = useState(20000);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [academySection, setAcademySection] = useState<'candle' | 'chart' | 'risk'>('candle');
  const [selectedChartPattern, setSelectedChartPattern] = useState<ChartPattern | null>(null);
  const [riskCategory, setRiskCategory] = useState<'sizing' | 'scaling' | null>(null);
  const [riskGuideIndex, setRiskGuideIndex] = useState(0);
  const riskCarouselRef = useRef<HTMLDivElement>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState<'calc' | 'learn' | 'general' | null>(null);

  // Check if in landscape mode and on trade screen
  const isLandscapeTrading = orientation.isLandscape && activeTab === 'trade';
  // Check if tablet in landscape mode (special layout)
  const isTabletLandscape = orientation.isTablet && orientation.isLandscape;
  // Track active tab separately for tablet (avoid TypeScript narrowing)
  const tabletActiveTab = activeTab;



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
    // Reset balance to $100,000
    resetSavedBalance();
    // Clear trade history (so equity curve shows true performance)
    clearHistory();
    // Reload with new stock to apply the reset (force fetch ใหม่)
    loadNewStock(true);
  };

  const toggleSoundEffect = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundService.setEnabled(newState);
    if (newState) {
      playSound('click'); // Play test sound
    }
  };

  // ฟังก์ชัน load stock (ใช้ saved session ถ้ามี หรือ fetch ใหม่)
  const loadNewStock = useCallback(async (forceNew: boolean = false) => {
    setIsLoading(true);

    // ถ้าไม่ force fetch ใหม่ → ลอง restore จาก saved session ก่อน
    if (!forceNew) {
      const savedSession = getSavedSession();
      if (savedSession) {
        setStock(savedSession.stock);
        setIsLoading(false);
        return;
      }
    }

    // ถ้า force หรือไม่มี saved session → fetch ใหม่
    clearSession(); // Clear old session เมื่อ fetch ใหม่
    const data = await fetchRandomStockData();
    setStock(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadNewStock(false); // ครั้งแรกลอง restore session ก่อน
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
  } = useTradingSession(stock, isPro);

  // Screen Orientation Lock/Unlock based on device type and active tab
  useEffect(() => {
    const handleOrientation = async () => {
      try {
        if (orientation.isTablet) {
          // Tablet: Always lock to landscape
          await ScreenOrientation.lock({ orientation: 'landscape' });
        } else if (activeTab === 'trade' && !isLoading && !isGameOver) {
          // Phone on trade screen: Allow rotation
          await ScreenOrientation.unlock();
        } else {
          // Phone on other screens: Lock to portrait
          await ScreenOrientation.lock({ orientation: 'portrait' });
        }
      } catch (error) {
        // Silently fail on web/unsupported platforms
        console.log('Screen orientation not supported:', error);
      }
    };

    handleOrientation();
  }, [activeTab, isLoading, isGameOver, orientation.isTablet]);

  // Reset tradeAmount when new game starts
  useEffect(() => {
    if (stock) {
      setTradeAmount(20000);
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
  const character = getCharacterResult(totalReturn, tradeCount);

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
        stockSymbol,
        stockName,
        returnPercentage: totalReturn,
        tradeCount,
        winRate
      });

      // Play win or lose sound
      if (totalReturn > 0) {
        playSound('game-win');
      } else if (totalReturn < 0) {
        playSound('game-lose');
      }
    }
  }, [isGameOver, totalReturn, tradeCount]);

  // Suspense fallback for lazy-loaded components
  const LazyFallback = (
    <div className="loading-screen">
      <div className="loading-content">
        <Loader2 className="spinner" size={48} />
      </div>
      <style>{LOADING_STYLES}</style>
    </div>
  );

  // Show welcome screen if not authenticated (after all hooks)
  if (!isAuthenticated) {
    return (
      <Suspense fallback={LazyFallback}>
        <WelcomeScreen />
      </Suspense>
    );
  }

  // Show onboarding tutorial for first-time users
  if (!hasCompletedOnboarding) {
    return (
      <Suspense fallback={LazyFallback}>
        <OnboardingTutorial
          onComplete={completeOnboarding}
          onSkip={completeOnboarding}
        />
      </Suspense>
    );
  }

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

  // Tablet Landscape Layout (only on trade tab)
  if (isTabletLandscape && tabletActiveTab === 'trade' && !isGameOver) {
    return (
      <div className="tablet-layout">
        {/* Tablet Header - Stats + Trade Amount + Action Buttons */}
        <div className="tablet-header">
          <div className="tablet-header-left">
            <div className="tablet-stat">
              <span className="tablet-stat-label">Total</span>
              <span className="tablet-stat-value">${displayBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="tablet-stat">
              <span className="tablet-stat-label">Available</span>
              <span className="tablet-stat-value">${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className={`tablet-stat ${totalReturn >= 0 ? 'positive' : 'negative'}`}>
              <span className="tablet-stat-label">Return</span>
              <span className="tablet-stat-value">{totalReturn.toFixed(1)}%</span>
            </div>
            <div className="tablet-meta">
              <span>Price: ${currentCandle.close.toFixed(2)}</span>
              <span>Fee: 0.15% | Comm: ${totalCommissions.toFixed(2)}</span>
            </div>
          </div>

          <div className="tablet-header-right">
            {/* Trade Amount */}
            {positions.length < maxPositions && (
              <div className="tablet-trade-amount">
                <span className="tablet-trade-amount-label">Amount</span>
                <button
                  className="tablet-amount-btn"
                  onClick={() => adjustTradeAmount(-1000)}
                  disabled={tradeAmount <= 0}
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  className="tablet-amount-input"
                  value={tradeAmount}
                  onChange={handleTradeAmountChange}
                  min={0}
                  max={balance}
                />
                <button
                  className="tablet-amount-btn"
                  onClick={() => adjustTradeAmount(1000)}
                  disabled={tradeAmount >= balance}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="tablet-actions">
              <button
                className="tablet-btn tablet-btn-long"
                onClick={long}
                disabled={positions.length >= maxPositions || tradeAmount <= 0 || tradeAmount > balance}
              >
                <TrendingUp size={16} />
                LONG
              </button>
              <button
                className="tablet-btn tablet-btn-short"
                onClick={short}
                disabled={positions.length >= maxPositions || tradeAmount <= 0 || tradeAmount > balance}
              >
                <TrendingDown size={16} />
                SHORT
              </button>
              <button className="tablet-btn tablet-btn-skip" onClick={skipDay}>
                <SkipForward size={16} />
                SKIP
              </button>
              <button className="tablet-btn tablet-btn-stop" onClick={stop}>
                <Square size={16} />
                STOP
              </button>
            </div>
          </div>
        </div>

        {/* Positions Row - Only show when positions exist */}
        {positions.length > 0 && (
          <div className="tablet-positions-row">
            <span className="tablet-positions-label">{positions.length} Position{positions.length > 1 ? 's' : ''}</span>
            <div className="tablet-positions-grid">
              {[0, 1, 2].map((index) => {
                const pos = positions[index];
                if (pos) {
                  const positionPL = getPositionPL(pos);
                  return (
                    <div key={pos.id} className={`tablet-position-card ${pos.type.toLowerCase()}`}>
                      <div className="tablet-pos-info">
                        <span className={`tablet-pos-type ${pos.type.toLowerCase()}`}>{pos.type}</span>
                        <span className="tablet-pos-entry">@${pos.entryPrice.toFixed(2)} • {pos.amount.toFixed(2)} units</span>
                      </div>
                      <span className={`tablet-pos-pl ${positionPL >= 0 ? 'text-success' : 'text-danger'}`}>
                        {positionPL >= 0 ? '+' : ''}${positionPL.toFixed(2)}
                      </span>
                      <button
                        className="tablet-pos-close"
                        onClick={() => closePosition(pos.id)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                }
                return (
                  <div key={index} className="tablet-position-card empty">
                    Empty
                  </div>
                );
              })}
            </div>
            <button className="tablet-close-all-btn" onClick={closeAllPositions}>
              CLOSE ALL
            </button>
          </div>
        )}

        {/* Main Chart Area */}
        <div className="tablet-main">
          <div className="tablet-chart-area">
            {/* Floating Controls - Left */}
            <div className="tablet-floating-left">
              <button
                className="tablet-floating-btn"
                onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
                disabled={zoom >= 3}
              >
                <ZoomIn size={18} />
              </button>
              <button
                className="tablet-floating-btn"
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                disabled={zoom <= 0.5}
              >
                <ZoomOut size={18} />
              </button>
              <button
                className="tablet-floating-btn"
                onClick={() => setShowInfo(true)}
              >
                <Info size={18} />
              </button>
            </div>

            {/* Chart */}
            <div className="tablet-chart-container">
              <ErrorBoundary>
                {visibleData.length > 0 ? <Chart data={visibleData} zoom={zoom} /> : <div>Loading chart...</div>}
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="tablet-bottom">
          {/* Promo Banner */}
          {!isPro && (
            <div className="tablet-promo-banner" onClick={() => setShowUpgradeModal('general')}>
              <div className="promo-marquee">
                <span className="promo-text">
                  <span className="promo-highlight">UPGRADE PRO</span> to unlock Academy and 300+ famous stocks
                </span>
              </div>
            </div>
          )}

          {/* Bottom Nav - Trade is always active in tablet landscape mode */}
          <div className="tablet-bottom-nav">
            <button
              className="tablet-nav-item active"
              onClick={() => setActiveTab('trade')}
            >
              <BarChart3 size={22} />
              <span>TRADE</span>
            </button>
            <button
              className="tablet-nav-item"
              onClick={() => isPro ? setActiveTab('calculator') : setShowUpgradeModal('calc')}
            >
              <div className="tablet-nav-icon-wrapper">
                <Calculator size={22} />
                {!isPro && <Star size={10} className="tablet-pro-badge" fill="currentColor" />}
              </div>
              <span>CALC</span>
            </button>
            <button
              className="tablet-nav-item"
              onClick={() => isPro ? setActiveTab('academy') : setShowUpgradeModal('learn')}
            >
              <div className="tablet-nav-icon-wrapper">
                <BookOpen size={22} />
                {!isPro && <Star size={10} className="tablet-pro-badge" fill="currentColor" />}
              </div>
              <span>LEARN</span>
            </button>
            <button
              className="tablet-nav-item"
              onClick={() => setActiveTab('history')}
            >
              <Clock size={22} />
              <span>HISTORY</span>
            </button>
            <button
              className="tablet-nav-item"
              onClick={() => setActiveTab('profile')}
            >
              <User size={22} />
              <span>PROFILE</span>
            </button>
          </div>
        </div>

        {/* Info Modal */}
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
                  <p>Trade on real historical data. Open up to 3 positions with 0.15% commission per trade.</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Upgrade Modal */}
          {showUpgradeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setShowUpgradeModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="upgrade-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="upgrade-modal-close" onClick={() => setShowUpgradeModal(null)}>
                  <X size={20} />
                </button>
                <div className="upgrade-modal-icon">
                  <Star size={48} fill="currentColor" />
                </div>
                <h2 className="upgrade-modal-title">
                  {showUpgradeModal === 'calc' && 'Position Sizing Calculator'}
                  {showUpgradeModal === 'learn' && 'Candle Academy'}
                  {showUpgradeModal === 'general' && 'Upgrade to PRO'}
                </h2>
                <p className="upgrade-modal-subtitle">
                  {showUpgradeModal === 'general' ? 'Unlock Everything' : 'PRO Feature'}
                </p>
                {showUpgradeModal === 'calc' && (
                  <p className="upgrade-modal-desc">Use it for your real trading every day. Calculate precise entry positions safely with proper Risk Management principles.</p>
                )}
                {showUpgradeModal === 'learn' && (
                  <p className="upgrade-modal-desc">Master candlestick patterns, chart patterns, and risk management strategies. Learn from comprehensive guides to become a better trader.</p>
                )}
                {showUpgradeModal === 'general' && (
                  <ul className="upgrade-benefits-list">
                    <li><span className="benefit-icon">📈</span>200 Trading Days per game</li>
                    <li><span className="benefit-icon">🎓</span>Full Academy Access</li>
                    <li><span className="benefit-icon">🧮</span>Position Size Calculator</li>
                    <li><span className="benefit-icon">🌍</span>300+ Global Stocks & ETFs</li>
                    <li><span className="benefit-icon">🔄</span>Reset Game Data anytime</li>
                  </ul>
                )}
                <button
                  className="upgrade-modal-btn"
                  onClick={() => {
                    setShowUpgradeModal(null);
                    setActiveTab('profile');
                  }}
                >
                  <Star size={18} fill="currentColor" />
                  <span>Upgrade to PRO</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{GLOBAL_STYLES}</style>
        <style>{UI_STYLES}</style>
        <style>{MODAL_STYLES}</style>
        <style>{TABLET_STYLES}</style>
      </div>
    );
  }

  return (
    <div className={`mobile-shell ${isLandscapeTrading ? 'landscape-mode' : ''}`}>
      <div className="app-container">
        {activeTab !== 'calculator' && activeTab !== 'academy' && !isLandscapeTrading && (
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
                  <div className="chart-footer">
                    <span>CANDLE MASTER</span>
                    <span className="separator">•</span>
                    <span>Historical Data Trading Simulator</span>
                  </div>
                </div>
              </div>

              {/* PRO Promotion Banner / PRO Status Badge */}
              {!isLandscapeTrading && !isGameOver && (
                isPro ? (
                  <div className="pro-status-badge">
                    <Star size={14} fill="currentColor" />
                    <span>PRO Member</span>
                  </div>
                ) : (
                  <div className="promo-banner" onClick={() => setShowUpgradeModal('general')}>
                    <div className="promo-marquee">
                      <span className="promo-text">
                        <span className="promo-highlight">UPGRADE PRO</span> to unlock Academy and 300+ famous stocks and ETF from all over the globe
                      </span>
                      <span className="promo-text">
                        <span className="promo-highlight">UPGRADE PRO</span> to unlock Academy and 300+ famous stocks and ETF from all over the globe
                      </span>
                    </div>
                  </div>
                )
              )}

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
            <Suspense fallback={LazyFallback}>
              <PositionSizeCalculator />
            </Suspense>
          )}

          {activeTab === 'academy' && (
            <div className="tab-content-wrapper academy-mode">
              <div className="tab-header">
                <BookOpen size={28} />
                <h2>Candle Academy</h2>
                <p className="tab-subtitle">Learn to become next Candle Master</p>
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
                <button
                  className={`academy-tab ${academySection === 'risk' ? 'active' : ''}`}
                  onClick={() => { setAcademySection('risk'); setRiskCategory(null); }}
                >
                  Risk Mgmt
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
                      <div
                        key={pattern.id}
                        className={`academy-card ${pattern.details ? 'clickable' : ''}`}
                        onClick={() => pattern.details && setSelectedChartPattern(pattern)}
                      >
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
                        {pattern.details && (
                          <div className="pattern-tap-hint">Tap for details</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Risk Management */}
              {academySection === 'risk' && (
                <div className="risk-section">
                  {riskCategory === null ? (
                    <div className="risk-category-selection">
                      <button
                        className="risk-category-card"
                        onClick={() => { setRiskCategory('sizing'); setRiskGuideIndex(0); }}
                      >
                        <span className="risk-category-icon">📊</span>
                        <div className="risk-category-info">
                          <h4>Position Sizing</h4>
                          <p>Learn proper position sizing</p>
                        </div>
                        <span className="risk-category-count">{POSITION_SIZING_GUIDES.length} tips</span>
                      </button>
                      <button
                        className="risk-category-card"
                        onClick={() => { setRiskCategory('scaling'); setRiskGuideIndex(0); }}
                      >
                        <span className="risk-category-icon">📈</span>
                        <div className="risk-category-info">
                          <h4>Scale In/Out</h4>
                          <p>Build & exit positions smartly</p>
                        </div>
                        <span className="risk-category-count">{SCALE_IN_OUT_GUIDES.length} tips</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="risk-carousel-header">
                        <button className="risk-back-btn" onClick={() => setRiskCategory(null)}>
                          <ArrowLeft size={18} />
                          <span>Back</span>
                        </button>
                        <span className="risk-carousel-title">
                          {riskCategory === 'sizing' ? 'Position Sizing' : 'Scale In/Out'}
                        </span>
                      </div>

                      <div className="risk-carousel-container">
                        <button
                          className="risk-carousel-arrow left"
                          onClick={() => {
                            const newIndex = Math.max(0, riskGuideIndex - 1);
                            setRiskGuideIndex(newIndex);
                            if (riskCarouselRef.current) {
                              riskCarouselRef.current.scrollTo({ left: riskCarouselRef.current.offsetWidth * newIndex, behavior: 'smooth' });
                            }
                          }}
                          disabled={riskGuideIndex === 0}
                        >
                          <ChevronLeft size={20} />
                        </button>

                        <div
                          className="risk-carousel-track"
                          ref={riskCarouselRef}
                          onScroll={() => {
                            if (riskCarouselRef.current) {
                              const cardWidth = riskCarouselRef.current.offsetWidth;
                              const newIndex = Math.round(riskCarouselRef.current.scrollLeft / cardWidth);
                              const guides = riskCategory === 'sizing' ? POSITION_SIZING_GUIDES : SCALE_IN_OUT_GUIDES;
                              if (newIndex !== riskGuideIndex && newIndex >= 0 && newIndex < guides.length) {
                                setRiskGuideIndex(newIndex);
                              }
                            }
                          }}
                        >
                          {(riskCategory === 'sizing' ? POSITION_SIZING_GUIDES : SCALE_IN_OUT_GUIDES).map((guide: any) => (
                            <div key={guide.id} className="risk-guide-card">
                              <span className="risk-guide-icon">{guide.icon}</span>
                              <h4 className="risk-guide-title">{guide.title}</h4>
                              {guide.subtitle && <p className="risk-guide-subtitle">{guide.subtitle}</p>}
                              {guide.content && <p className="risk-guide-content">{guide.content}</p>}

                              {guide.bullets && (
                                <ul className="risk-guide-bullets">
                                  {guide.bullets.map((bullet: string, i: number) => (
                                    <li key={i}>{bullet}</li>
                                  ))}
                                </ul>
                              )}

                              {guide.dosDonts && (
                                <div className="risk-dos-donts">
                                  <p className="dont">❌ Never: {guide.dosDonts.dont}</p>
                                  <p className="do">✓ Always: {guide.dosDonts.do}</p>
                                </div>
                              )}

                              {guide.examples && (
                                <div className="risk-examples">
                                  {guide.examples.map((ex: any, i: number) => (
                                    <div key={i} className="risk-example-row">
                                      <span className="ratio">{ex.ratio}</span>
                                      <span className="desc">{ex.winRate}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {guide.leverageExamples && (
                                <div className="risk-leverage">
                                  {guide.leverageExamples.map((ex: any, i: number) => (
                                    <div key={i} className="risk-leverage-row">
                                      <span className="lev">{ex.leverage}</span>
                                      <span className="impact">{ex.impact}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {guide.warnings && (
                                <div className="risk-warnings">
                                  {guide.warnings.map((w: string, i: number) => (
                                    <p key={i}>{i === 0 ? '⚠️' : '💡'} {w}</p>
                                  ))}
                                </div>
                              )}

                              {guide.scaleExplanation && (
                                <div className="risk-scale-explanation">
                                  <div className="scale-item scale-in">
                                    <span className="scale-label">{guide.scaleExplanation.scaleIn.label}</span>
                                    <span className="scale-desc">{guide.scaleExplanation.scaleIn.desc}</span>
                                    <span className="scale-visual">{guide.scaleExplanation.scaleIn.visual}</span>
                                  </div>
                                  <div className="scale-item scale-out">
                                    <span className="scale-label">{guide.scaleExplanation.scaleOut.label}</span>
                                    <span className="scale-desc">{guide.scaleExplanation.scaleOut.desc}</span>
                                    <span className="scale-visual">{guide.scaleExplanation.scaleOut.visual}</span>
                                  </div>
                                </div>
                              )}

                              {guide.benefits && (
                                <div className="risk-benefits">
                                  <p className="benefits-title">Why it works:</p>
                                  {guide.benefits.map((b: string, i: number) => (
                                    <p key={i} className="benefit-item">✓ {b}</p>
                                  ))}
                                </div>
                              )}

                              {guide.scaleExample && (
                                <div className="risk-scale-example">
                                  <p className="example-title">{guide.scaleExample.title}</p>
                                  <div className="example-steps">
                                    {guide.scaleExample.steps.map((step: any, i: number) => (
                                      <div key={i} className="step-row">
                                        <span className="step-action">{step.action}</span>
                                        <span className="step-percent">{step.percent}</span>
                                        <span className="step-price">{step.price}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="example-result">{guide.scaleExample.result}</p>
                                </div>
                              )}

                              {guide.pullbackInfo && (
                                <div className="risk-pullback-info">
                                  <p className="pullback-intro">{guide.pullbackInfo.intro}</p>
                                  <div className="pullback-reasons">
                                    {guide.pullbackInfo.reasons.map((r: string, i: number) => (
                                      <p key={i} className="pullback-reason">→ {r}</p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {guide.qualityChecklist && (
                                <div className="risk-quality-checklist">
                                  <p className="checklist-title">Quality pullback checklist:</p>
                                  {guide.qualityChecklist.map((item: string, i: number) => (
                                    <p key={i} className="checklist-item good">✓ {item}</p>
                                  ))}
                                </div>
                              )}

                              {guide.redFlags && (
                                <div className="risk-red-flags">
                                  <p className="flags-title">Red flags - DON'T add:</p>
                                  {guide.redFlags.map((item: string, i: number) => (
                                    <p key={i} className="flag-item">✗ {item}</p>
                                  ))}
                                </div>
                              )}

                              {guide.rules && (
                                <div className="risk-rules">
                                  <div className="rules-never">
                                    <p className="rules-label">❌ NEVER:</p>
                                    {guide.rules.never.map((r: string, i: number) => (
                                      <p key={i} className="rule-item">{r}</p>
                                    ))}
                                  </div>
                                  <div className="rules-always">
                                    <p className="rules-label">✓ ALWAYS:</p>
                                    {guide.rules.always.map((r: string, i: number) => (
                                      <p key={i} className="rule-item">{r}</p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {guide.keyPoint && (
                                <div className="risk-keypoint">
                                  <strong>Key Rule:</strong> {guide.keyPoint}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <button
                          className="risk-carousel-arrow right"
                          onClick={() => {
                            const guides = riskCategory === 'sizing' ? POSITION_SIZING_GUIDES : SCALE_IN_OUT_GUIDES;
                            const newIndex = Math.min(guides.length - 1, riskGuideIndex + 1);
                            setRiskGuideIndex(newIndex);
                            if (riskCarouselRef.current) {
                              riskCarouselRef.current.scrollTo({ left: riskCarouselRef.current.offsetWidth * newIndex, behavior: 'smooth' });
                            }
                          }}
                          disabled={riskGuideIndex === (riskCategory === 'sizing' ? POSITION_SIZING_GUIDES : SCALE_IN_OUT_GUIDES).length - 1}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>

                      <div className="risk-carousel-dots">
                        {(riskCategory === 'sizing' ? POSITION_SIZING_GUIDES : SCALE_IN_OUT_GUIDES).map((_: any, index: number) => (
                          <button
                            key={index}
                            className={`dot ${index === riskGuideIndex ? 'active' : ''}`}
                            onClick={() => {
                              setRiskGuideIndex(index);
                              if (riskCarouselRef.current) {
                                riskCarouselRef.current.scrollTo({ left: riskCarouselRef.current.offsetWidth * index, behavior: 'smooth' });
                              }
                            }}
                          />
                        ))}
                      </div>
                      <p className="risk-swipe-hint">Swipe for more tips</p>
                    </>
                  )}
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
                const INITIAL_BALANCE = 100000;
                const equityCurve = [INITIAL_BALANCE];
                let runningBalance = INITIAL_BALANCE;

                // Reverse history to show oldest first (chronological order for equity curve)
                const chronologicalHistory = [...history].reverse();
                chronologicalHistory.forEach(record => {
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

                // Calculate Y position for the initial balance line (100,000)
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
                          <span className="history-title">{record.stockSymbol || record.stockName || 'Unknown'}</span>
                          <span className="history-date">
                            {new Date(record.date).toLocaleDateString()} • {record.tradeCount} Trades • WR {record.winRate?.toFixed(0) ?? 0}%
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
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt="Profile" className="profile-photo" />
                  ) : (
                    <User size={48} color="#666" />
                  )}
                </div>
                <h2>{user?.displayName || 'Player'}</h2>
                <p className="member-since">
                  {isGuest ? (
                    <span className="guest-badge">Guest Mode</span>
                  ) : (
                    <>Signed in with {user?.provider === 'google' ? 'Google' : 'Apple'}</>
                  )}
                </p>
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
                <button className="profile-action-btn" onClick={() => setHasCompletedOnboarding(false)}>
                  <BookOpen size={20} />
                  <span>View Tutorial</span>
                </button>
                <button className="profile-action-btn" onClick={() => setShowInfo(true)}>
                  <Info size={20} />
                  <span>How to Play</span>
                </button>
                <button
                  className="profile-action-btn"
                  onClick={() => isPro ? resetGameData() : setShowUpgradeModal('general')}
                >
                  <Trash2 size={20} />
                  <span>Reset Game Data</span>
                  {!isPro && <span className="pro-only-badge">PRO</span>}
                </button>
                <button className="profile-action-btn" onClick={toggleSoundEffect}>
                  {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  <span>Sound Effects</span>
                  <div className={`toggle-switch ${soundEnabled ? 'active' : ''}`}>
                    <div className="toggle-knob"></div>
                  </div>
                </button>

                {/* PRO Subscription Toggle (Testing) */}
                <button
                  className={`profile-action-btn pro-toggle ${isPro ? 'is-pro' : ''}`}
                  onClick={() => isPro ? resetToFree() : upgradeToPro()}
                >
                  <Star size={20} fill={isPro ? 'currentColor' : 'none'} />
                  <span>{isPro ? 'PRO Member' : 'Upgrade to PRO'}</span>
                  <div className={`toggle-switch ${isPro ? 'active pro' : ''}`}>
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

                {/* Account Actions */}
                {isGuest ? (
                  <button
                    className="profile-action-btn link-account-btn"
                    onClick={() => linkAccount('google')}
                  >
                    <Link size={20} />
                    <span>Link Google Account</span>
                    <span className="link-benefit">Sync PRO across devices</span>
                  </button>
                ) : (
                  <button
                    className="profile-action-btn sign-out-btn"
                    onClick={signOut}
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                )}
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
                onClick={() => isPro ? setActiveTab('calculator') : setShowUpgradeModal('calc')}
              >
                <div className="nav-icon-wrapper">
                  <Calculator size={24} />
                  {!isPro && <Star size={10} className="pro-badge-icon" fill="currentColor" />}
                </div>
                <span>Calc</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'academy' ? 'active' : ''}`}
                onClick={() => isPro ? setActiveTab('academy') : setShowUpgradeModal('learn')}
              >
                <div className="nav-icon-wrapper">
                  <BookOpen size={24} />
                  {!isPro && <Star size={10} className="pro-badge-icon" fill="currentColor" />}
                </div>
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
                    <p><strong>Starting Capital:</strong> $100,000 virtual money</p>
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
                    <span className="reset-icon">💰</span>
                    <span>Balance will reset to <strong>$100,000</strong></span>
                  </div>
                  <div className="reset-info-item">
                    <span className="reset-icon">🎮</span>
                    <span>Current game will restart</span>
                  </div>
                  <div className="reset-info-item warning">
                    <span className="reset-icon">⚠️</span>
                    <span>Trading history will be <strong>DELETED</strong></span>
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

          {/* Chart Pattern Detail Modal */}
          {selectedChartPattern && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setSelectedChartPattern(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="pattern-detail-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="pattern-modal-close" onClick={() => setSelectedChartPattern(null)}>
                  <X size={24} />
                </button>
                <div className="pattern-modal-image">
                  <img
                    src={`/patterns/${selectedChartPattern.imageKey}-${resolvedTheme === 'sandstone' ? 'l' : 'd'}.webp`}
                    alt={selectedChartPattern.name}
                  />
                </div>
                <div className="pattern-modal-content">
                  <h2>{selectedChartPattern.name}</h2>
                  <p className="pattern-modal-desc">{selectedChartPattern.desc}</p>
                  {selectedChartPattern.details && (
                    <div className="pattern-modal-details">
                      {selectedChartPattern.details.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* PRO Upgrade Modal */}
          {showUpgradeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setShowUpgradeModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="upgrade-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="upgrade-modal-close" onClick={() => setShowUpgradeModal(null)}>
                  <X size={20} />
                </button>
                <div className="upgrade-modal-icon">
                  <Star size={48} fill="currentColor" />
                </div>
                <h2 className="upgrade-modal-title">
                  {showUpgradeModal === 'calc' && 'Position Sizing Calculator'}
                  {showUpgradeModal === 'learn' && 'Candle Academy'}
                  {showUpgradeModal === 'general' && 'Upgrade to PRO'}
                </h2>
                <p className="upgrade-modal-subtitle">
                  {showUpgradeModal === 'general' ? 'Unlock Everything' : 'PRO Feature'}
                </p>
                {showUpgradeModal === 'calc' && (
                  <p className="upgrade-modal-desc">Use it for your real trading every day. Calculate precise entry positions safely with proper Risk Management principles.</p>
                )}
                {showUpgradeModal === 'learn' && (
                  <p className="upgrade-modal-desc">Master candlestick patterns, chart patterns, and risk management strategies. Learn from comprehensive guides to become a better trader.</p>
                )}
                {showUpgradeModal === 'general' && (
                  <ul className="upgrade-benefits-list">
                    <li><span className="benefit-icon">📈</span>200 Trading Days per game</li>
                    <li><span className="benefit-icon">🎓</span>Full Academy Access</li>
                    <li><span className="benefit-icon">🧮</span>Position Size Calculator</li>
                    <li><span className="benefit-icon">🌍</span>300+ Global Stocks & ETFs</li>
                    <li><span className="benefit-icon">🔄</span>Reset Game Data anytime</li>
                  </ul>
                )}
                <button
                  className="upgrade-modal-btn"
                  onClick={() => {
                    setShowUpgradeModal(null);
                    setActiveTab('profile');
                  }}
                >
                  <Star size={18} fill="currentColor" />
                  <span>Upgrade to PRO</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="modal-overlay bottom-sheet"
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="game-over-modal cream-theme"
              >
                <div className="modal-pill"></div>
                <div className="title-section">
                  <motion.div
                    className="character-circle"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                  >
                    <img src={`/characters/${character.image}`} alt={character.key} />
                  </motion.div>
                  <motion.p
                    className="character-quote"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    "{character.quote}"
                  </motion.p>
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

                <button className="btn btn-primary" onClick={() => loadNewStock(true)}>START NEW GAME</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{GLOBAL_STYLES}</style>
      <style>{UI_STYLES}</style>
      <style>{MODAL_STYLES}</style>
      <style>{TABLET_STYLES}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
