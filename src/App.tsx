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
    if (this.state.hasError) return <div style={{ padding: 40, textAlign: 'center' }}>Something went wrong. Please refresh.</div>;
    return this.props.children;
  }
}

import { Chart } from './components/Chart';
import PositionSizeCalculator from './components/PositionSizeCalculator';
import { fetchRandomStockData } from './utils/data';
import type { StockData } from './utils/data';
import { useTradingSession, resetSavedBalance } from './hooks/useTradingSession';
import { SkipForward, Square, TrendingUp, TrendingDown, Loader2, Info, X, Trash2, Volume2, VolumeX, ZoomIn, ZoomOut, BarChart3, BookOpen, Clock, User, Plus, Minus, Calculator, ChevronDown, ChevronUp, Sun, Moon, Monitor } from 'lucide-react';
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

interface AcademyPattern {
  id: number;
  name: string;
  desc: string;
  render: () => React.ReactNode;
}

const Green = "#22c55e";
const Red = "#ef4444";
const Black = "#000000";
const Gray = "#9CA3AF";

const ACADEMY_PATTERNS: AcademyPattern[] = [
  // Row 1: Hammer vs Hanging Man
  {
    id: 1, name: "Hammer", desc: "Bullish reversal at bottom. Long lower shadow.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="10" y1="8" x2="10" y2="22" stroke={Gray} strokeWidth="2" /> <rect x="7" y="8" width="6" height="12" fill={Gray} />
        <line x1="30" y1="12" x2="30" y2="30" stroke={Gray} strokeWidth="2" /> <rect x="27" y="14" width="6" height="14" fill={Gray} />
        <line x1="50" y1="20" x2="50" y2="42" stroke={Gray} strokeWidth="2" /> <rect x="47" y="22" width="6" height="16" fill={Gray} />
        <line x1="70" y1="28" x2="70" y2="52" stroke={Gray} strokeWidth="2" /> <rect x="67" y="30" width="6" height="18" fill={Gray} />
        <line x1="90" y1="18" x2="90" y2="55" stroke={Green} strokeWidth="2" /> <rect x="86" y="18" width="8" height="10" fill={Green} />
      </svg>
    )
  },
  {
    id: 2, name: "Hanging Man", desc: "Bearish reversal at top. Long lower shadow.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="10" y1="42" x2="10" y2="52" stroke={Gray} strokeWidth="2" /> <rect x="7" y="42" width="6" height="8" fill={Gray} />
        <line x1="30" y1="32" x2="30" y2="46" stroke={Gray} strokeWidth="2" /> <rect x="27" y="32" width="6" height="12" fill={Gray} />
        <line x1="50" y1="22" x2="50" y2="36" stroke={Gray} strokeWidth="2" /> <rect x="47" y="22" width="6" height="12" fill={Gray} />
        <line x1="70" y1="12" x2="70" y2="26" stroke={Gray} strokeWidth="2" /> <rect x="67" y="12" width="6" height="12" fill={Gray} />
        <line x1="90" y1="5" x2="90" y2="55" stroke={Red} strokeWidth="2" /> <rect x="86" y="5" width="8" height="10" fill={Red} />
      </svg>
    )
  },
  // Row 2: Inverted Hammer vs Shooting Star
  {
    id: 3, name: "Inverted Hammer", desc: "Bullish reversal. Long upper shadow.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="10" y1="8" x2="10" y2="18" stroke={Gray} strokeWidth="2" /> <rect x="7" y="8" width="6" height="8" fill={Gray} />
        <line x1="30" y1="12" x2="30" y2="24" stroke={Gray} strokeWidth="2" /> <rect x="27" y="14" width="6" height="8" fill={Gray} />
        <line x1="50" y1="18" x2="50" y2="32" stroke={Gray} strokeWidth="2" /> <rect x="47" y="20" width="6" height="10" fill={Gray} />
        <line x1="70" y1="25" x2="70" y2="42" stroke={Gray} strokeWidth="2" /> <rect x="67" y="32" width="6" height="8" fill={Gray} />
        <line x1="90" y1="5" x2="90" y2="55" stroke={Green} strokeWidth="2" /> <rect x="86" y="45" width="8" height="10" fill={Green} />
      </svg>
    )
  },
  {
    id: 4, name: "Shooting Star", desc: "Bearish reversal. Long upper shadow.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="10" y1="38" x2="10" y2="52" stroke={Gray} strokeWidth="2" /> <rect x="7" y="40" width="6" height="10" fill={Gray} />
        <line x1="30" y1="28" x2="30" y2="42" stroke={Gray} strokeWidth="2" /> <rect x="27" y="28" width="6" height="12" fill={Gray} />
        <line x1="50" y1="18" x2="50" y2="32" stroke={Gray} strokeWidth="2" /> <rect x="47" y="18" width="6" height="12" fill={Gray} />
        <line x1="70" y1="8" x2="70" y2="22" stroke={Gray} strokeWidth="2" /> <rect x="67" y="10" width="6" height="10" fill={Gray} />
        <line x1="90" y1="5" x2="90" y2="42" stroke={Red} strokeWidth="2" /> <rect x="86" y="32" width="8" height="10" fill={Red} />
      </svg>
    )
  },
  // Row 3: Bullish Engulfing vs Bearish Engulfing
  {
    id: 5, name: "Bullish Engulfing", desc: "Strong reversal. Green eats Red.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="15" y1="8" x2="15" y2="20" stroke={Gray} strokeWidth="2" /> <rect x="12" y="10" width="6" height="8" fill={Gray} />
        <line x1="35" y1="15" x2="35" y2="28" stroke={Gray} strokeWidth="2" /> <rect x="32" y="17" width="6" height="9" fill={Gray} />
        <line x1="55" y1="22" x2="55" y2="38" stroke={Gray} strokeWidth="2" /> <rect x="52" y="24" width="6" height="12" fill={Gray} />
        <line x1="75" y1="30" x2="75" y2="48" stroke={Red} strokeWidth="2" /> <rect x="71" y="32" width="8" height="14" fill={Red} />
        <line x1="95" y1="22" x2="95" y2="55" stroke={Green} strokeWidth="2" /> <rect x="90" y="24" width="10" height="28" fill={Green} />
      </svg>
    )
  },
  {
    id: 6, name: "Bearish Engulfing", desc: "Strong reversal. Red eats Green.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="15" y1="42" x2="15" y2="54" stroke={Gray} strokeWidth="2" /> <rect x="12" y="44" width="6" height="8" fill={Gray} />
        <line x1="35" y1="32" x2="35" y2="46" stroke={Gray} strokeWidth="2" /> <rect x="32" y="34" width="6" height="10" fill={Gray} />
        <line x1="55" y1="22" x2="55" y2="36" stroke={Gray} strokeWidth="2" /> <rect x="52" y="24" width="6" height="10" fill={Gray} />
        <line x1="75" y1="12" x2="75" y2="28" stroke={Green} strokeWidth="2" /> <rect x="71" y="14" width="8" height="12" fill={Green} />
        <line x1="95" y1="5" x2="95" y2="38" stroke={Red} strokeWidth="2" /> <rect x="90" y="8" width="10" height="28" fill={Red} />
      </svg>
    )
  },
  // Row 4: Piercing Pattern vs Dark Cloud Cover
  {
    id: 7, name: "Piercing Pattern", desc: "Bullish reversal. Green closes above midpoint.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="12" x2="20" y2="22" stroke={Gray} strokeWidth="2" /> <rect x="17" y="14" width="6" height="6" fill={Gray} />
        <line x1="40" y1="18" x2="40" y2="28" stroke={Gray} strokeWidth="2" /> <rect x="37" y="20" width="6" height="6" fill={Gray} />
        <line x1="60" y1="5" x2="60" y2="45" stroke={Red} strokeWidth="2" /> <rect x="55" y="8" width="10" height="35" fill={Red} />
        <line x1="80" y1="18" x2="80" y2="55" stroke={Green} strokeWidth="2" /> <rect x="75" y="20" width="10" height="32" fill={Green} />
      </svg>
    )
  },
  {
    id: 8, name: "Dark Cloud Cover", desc: "Bearish reversal. Red closes below midpoint.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="38" x2="20" y2="48" stroke={Gray} strokeWidth="2" /> <rect x="17" y="40" width="6" height="6" fill={Gray} />
        <line x1="40" y1="32" x2="40" y2="42" stroke={Gray} strokeWidth="2" /> <rect x="37" y="34" width="6" height="6" fill={Gray} />
        <line x1="60" y1="15" x2="60" y2="55" stroke={Green} strokeWidth="2" /> <rect x="55" y="18" width="10" height="35" fill={Green} />
        <line x1="80" y1="5" x2="80" y2="42" stroke={Red} strokeWidth="2" /> <rect x="75" y="8" width="10" height="32" fill={Red} />
      </svg>
    )
  },
  // Row 5: Morning Star vs Evening Star
  {
    id: 9, name: "Morning Star", desc: "3-candle bullish reversal.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="8" x2="20" y2="18" stroke={Gray} strokeWidth="2" /> <rect x="17" y="10" width="6" height="6" fill={Gray} />
        <line x1="40" y1="5" x2="40" y2="38" stroke={Red} strokeWidth="2" /> <rect x="36" y="8" width="8" height="28" fill={Red} />
        <line x1="60" y1="38" x2="60" y2="52" stroke={Black} strokeWidth="2" /> <line x1="54" y1="45" x2="66" y2="45" stroke={Black} strokeWidth="4" />
        <line x1="80" y1="15" x2="80" y2="48" stroke={Green} strokeWidth="2" /> <rect x="76" y="18" width="8" height="28" fill={Green} />
      </svg>
    )
  },
  {
    id: 10, name: "Evening Star", desc: "3-candle bearish reversal.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="42" x2="20" y2="52" stroke={Gray} strokeWidth="2" /> <rect x="17" y="44" width="6" height="6" fill={Gray} />
        <line x1="40" y1="22" x2="40" y2="55" stroke={Green} strokeWidth="2" /> <rect x="36" y="24" width="8" height="28" fill={Green} />
        <line x1="60" y1="8" x2="60" y2="22" stroke={Black} strokeWidth="2" /> <line x1="54" y1="15" x2="66" y2="15" stroke={Black} strokeWidth="4" />
        <line x1="80" y1="12" x2="80" y2="45" stroke={Red} strokeWidth="2" /> <rect x="76" y="14" width="8" height="28" fill={Red} />
      </svg>
    )
  },
  // Row 6: Three White Soldiers vs Three Black Crows
  {
    id: 11, name: "Three White Soldiers", desc: "Strong bullish trend. 3 green candles.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="15" y1="42" x2="15" y2="52" stroke={Gray} strokeWidth="2" /> <rect x="12" y="44" width="6" height="6" fill={Gray} />
        <line x1="35" y1="32" x2="35" y2="55" stroke={Green} strokeWidth="2" /> <rect x="31" y="35" width="8" height="18" fill={Green} />
        <line x1="55" y1="18" x2="55" y2="42" stroke={Green} strokeWidth="2" /> <rect x="51" y="22" width="8" height="18" fill={Green} />
        <line x1="75" y1="5" x2="75" y2="28" stroke={Green} strokeWidth="2" /> <rect x="71" y="8" width="8" height="18" fill={Green} />
      </svg>
    )
  },
  {
    id: 12, name: "Three Black Crows", desc: "Strong bearish trend. 3 red candles.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="15" y1="8" x2="15" y2="18" stroke={Gray} strokeWidth="2" /> <rect x="12" y="10" width="6" height="6" fill={Gray} />
        <line x1="35" y1="5" x2="35" y2="28" stroke={Red} strokeWidth="2" /> <rect x="31" y="8" width="8" height="18" fill={Red} />
        <line x1="55" y1="18" x2="55" y2="42" stroke={Red} strokeWidth="2" /> <rect x="51" y="22" width="8" height="18" fill={Red} />
        <line x1="75" y1="32" x2="75" y2="55" stroke={Red} strokeWidth="2" /> <rect x="71" y="35" width="8" height="18" fill={Red} />
      </svg>
    )
  },
  // Row 7: Bullish Harami vs Bearish Harami
  {
    id: 13, name: "Bullish Harami", desc: "Reversal. Small green inside big red.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="8" x2="20" y2="18" stroke={Gray} strokeWidth="2" /> <rect x="17" y="10" width="6" height="6" fill={Gray} />
        <line x1="40" y1="12" x2="40" y2="24" stroke={Gray} strokeWidth="2" /> <rect x="37" y="14" width="6" height="8" fill={Gray} />
        <line x1="60" y1="5" x2="60" y2="55" stroke={Red} strokeWidth="2" /> <rect x="54" y="8" width="12" height="44" fill={Red} />
        <line x1="80" y1="22" x2="80" y2="38" stroke={Green} strokeWidth="2" /> <rect x="76" y="24" width="8" height="12" fill={Green} />
      </svg>
    )
  },
  {
    id: 14, name: "Bearish Harami", desc: "Reversal. Small red inside big green.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="42" x2="20" y2="52" stroke={Gray} strokeWidth="2" /> <rect x="17" y="44" width="6" height="6" fill={Gray} />
        <line x1="40" y1="36" x2="40" y2="48" stroke={Gray} strokeWidth="2" /> <rect x="37" y="38" width="6" height="8" fill={Gray} />
        <line x1="60" y1="5" x2="60" y2="55" stroke={Green} strokeWidth="2" /> <rect x="54" y="8" width="12" height="44" fill={Green} />
        <line x1="80" y1="22" x2="80" y2="38" stroke={Red} strokeWidth="2" /> <rect x="76" y="24" width="8" height="12" fill={Red} />
      </svg>
    )
  },
  // Row 8: Tweezer Bottom vs Tweezer Top
  {
    id: 15, name: "Tweezer Bottom", desc: "Bullish reversal. Same lows.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="12" x2="20" y2="28" stroke={Gray} strokeWidth="2" /> <rect x="17" y="15" width="6" height="10" fill={Gray} />
        <line x1="40" y1="22" x2="40" y2="38" stroke={Gray} strokeWidth="2" /> <rect x="37" y="25" width="6" height="10" fill={Gray} />
        <line x1="60" y1="15" x2="60" y2="52" stroke={Red} strokeWidth="2" /> <rect x="55" y="18" width="10" height="32" fill={Red} />
        <line x1="80" y1="22" x2="80" y2="52" stroke={Green} strokeWidth="2" /> <rect x="75" y="25" width="10" height="25" fill={Green} />
        <line x1="50" y1="52" x2="90" y2="52" stroke="#666" strokeWidth="1" strokeDasharray="3,3" />
      </svg>
    )
  },
  {
    id: 16, name: "Tweezer Top", desc: "Bearish reversal. Same highs.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="32" x2="20" y2="48" stroke={Gray} strokeWidth="2" /> <rect x="17" y="35" width="6" height="10" fill={Gray} />
        <line x1="40" y1="22" x2="40" y2="38" stroke={Gray} strokeWidth="2" /> <rect x="37" y="25" width="6" height="10" fill={Gray} />
        <line x1="60" y1="8" x2="60" y2="45" stroke={Green} strokeWidth="2" /> <rect x="55" y="10" width="10" height="32" fill={Green} />
        <line x1="80" y1="8" x2="80" y2="38" stroke={Red} strokeWidth="2" /> <rect x="75" y="10" width="10" height="25" fill={Red} />
        <line x1="50" y1="8" x2="90" y2="8" stroke="#666" strokeWidth="1" strokeDasharray="3,3" />
      </svg>
    )
  },
  // Row 9: Dragonfly Doji vs Gravestone Doji
  {
    id: 17, name: "Dragonfly Doji", desc: "Bullish reversal. Long lower shadow.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="8" x2="20" y2="18" stroke={Gray} strokeWidth="2" /> <rect x="17" y="10" width="6" height="6" fill={Gray} />
        <line x1="40" y1="12" x2="40" y2="24" stroke={Gray} strokeWidth="2" /> <rect x="37" y="14" width="6" height="8" fill={Gray} />
        <line x1="60" y1="18" x2="60" y2="32" stroke={Gray} strokeWidth="2" /> <rect x="57" y="20" width="6" height="10" fill={Gray} />
        <line x1="80" y1="12" x2="80" y2="55" stroke={Green} strokeWidth="2" /> <line x1="72" y1="12" x2="88" y2="12" stroke={Green} strokeWidth="4" />
      </svg>
    )
  },
  {
    id: 18, name: "Gravestone Doji", desc: "Bearish reversal. Long upper shadow.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="20" y1="42" x2="20" y2="52" stroke={Gray} strokeWidth="2" /> <rect x="17" y="44" width="6" height="6" fill={Gray} />
        <line x1="40" y1="36" x2="40" y2="48" stroke={Gray} strokeWidth="2" /> <rect x="37" y="38" width="6" height="8" fill={Gray} />
        <line x1="60" y1="28" x2="60" y2="42" stroke={Gray} strokeWidth="2" /> <rect x="57" y="30" width="6" height="10" fill={Gray} />
        <line x1="80" y1="5" x2="80" y2="48" stroke={Red} strokeWidth="2" /> <line x1="72" y1="48" x2="88" y2="48" stroke={Red} strokeWidth="4" />
      </svg>
    )
  },
  // Row 10: Three Inside Up vs Three Inside Down
  {
    id: 19, name: "Three Inside Up", desc: "Bullish reversal. Harami + confirmation.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="25" y1="5" x2="25" y2="55" stroke={Red} strokeWidth="2" /> <rect x="19" y="8" width="12" height="44" fill={Red} />
        <line x1="50" y1="22" x2="50" y2="38" stroke={Green} strokeWidth="2" /> <rect x="45" y="24" width="10" height="12" fill={Green} />
        <line x1="75" y1="8" x2="75" y2="32" stroke={Green} strokeWidth="2" /> <rect x="69" y="10" width="12" height="20" fill={Green} />
      </svg>
    )
  },
  {
    id: 20, name: "Three Inside Down", desc: "Bearish reversal. Harami + confirmation.",
    render: () => (
      <svg viewBox="0 0 100 60" className="academy-svg">
        <line x1="25" y1="5" x2="25" y2="55" stroke={Green} strokeWidth="2" /> <rect x="19" y="8" width="12" height="44" fill={Green} />
        <line x1="50" y1="22" x2="50" y2="38" stroke={Red} strokeWidth="2" /> <rect x="45" y="24" width="10" height="12" fill={Red} />
        <line x1="75" y1="28" x2="75" y2="52" stroke={Red} strokeWidth="2" /> <rect x="69" y="30" width="12" height="20" fill={Red} />
      </svg>
    )
  },
];

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
  const [stock, setStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [history, setHistory] = useState<TradeRecord[]>([]);
  const [zoom, setZoom] = useState(1);
  const [positionsCollapsed, setPositionsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'trade' | 'calculator' | 'academy' | 'history' | 'profile'>('trade');
  const [soundEnabled, setSoundEnabled] = useState(soundService.isEnabled());
  const [tradeAmount, setTradeAmount] = useState(1000);

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
    // Clear history
    setHistory([]);
    localStorage.removeItem('candle_master_history');
    // Reset balance to $10,000
    resetSavedBalance();
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

  const MIN_TRADE_AMOUNT = 1000;

  const adjustTradeAmount = (delta: number) => {
    setTradeAmount(prev => {
      const newAmount = prev + delta;
      if (newAmount < MIN_TRADE_AMOUNT) return MIN_TRADE_AMOUNT;
      if (newAmount > balance) return Math.floor(balance);
      return newAmount;
    });
  };

  const handleTradeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (value > balance) {
      setTradeAmount(Math.floor(balance));
    } else if (value < MIN_TRADE_AMOUNT) {
      setTradeAmount(MIN_TRADE_AMOUNT);
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
        <style>{`
          .loading-screen {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
            text-align: center;
          }
          .spinner {
            color: var(--color-text);
            animation: spin 1s linear infinite;
            margin-bottom: 24px;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          h2 { font-weight: 700; margin-bottom: 8px; color: var(--color-text); }
          p { color: var(--color-text-secondary); font-size: 0.875rem; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="mobile-shell">
      <div className="app-container">
        {activeTab !== 'calculator' && (
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
          {/* Broke Card - When balance is too low */}
          {!isGameOver && balance < MIN_TRADE_AMOUNT && positions.length === 0 && (
            <div className="broke-card">
              <div className="broke-emoji">🍔</div>
              <h3 className="broke-title">Oops! You're Broke!</h3>
              <p className="broke-balance">
                Current Balance: <span>${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </p>
              <p className="broke-message">
                Come back when you have more than $1,000.
                <br />
                Maybe grab a cheeseburger first to heal your soul.
              </p>
              <button className="btn btn-primary broke-btn" onClick={resetGameData}>
                Start Fresh ($10,000)
              </button>
            </div>
          )}

          {/* Trade Amount Input */}
          {positions.length < maxPositions && !isGameOver && balance >= MIN_TRADE_AMOUNT && (
            <div className="trade-amount-section">
              <span className="trade-amount-label">Trade Amount</span>
              <div className="trade-amount-controls">
                <button
                  className="amount-btn"
                  onClick={() => adjustTradeAmount(-1000)}
                  disabled={tradeAmount <= MIN_TRADE_AMOUNT}
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
                    min={MIN_TRADE_AMOUNT}
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
              {positions.length > 0 && (
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
                      <span className={`positions-total-pl ${unrealizedPL >= 0 ? 'text-success' : 'text-danger'}`}>
                        {unrealizedPL >= 0 ? '+' : ''}${unrealizedPL.toFixed(2)}
                      </span>
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
                              <span className={positionPL >= 0 ? 'text-success' : 'text-danger'}>
                                {positionPL >= 0 ? '+' : ''}${positionPL.toFixed(2)}
                              </span>
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
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  className="zoom-btn-mini"
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                  disabled={zoom <= 0.5}
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

          <section className="controls">
            <div className="action-buttons-single-row">
              <button
                className="btn btn-buy"
                onClick={long}
                disabled={isGameOver || positions.length >= maxPositions || balance < MIN_TRADE_AMOUNT}
              >
                <TrendingUp size={20} />
                <span>LONG</span>
              </button>
              <button
                className="btn btn-sell"
                onClick={short}
                disabled={isGameOver || positions.length >= maxPositions || balance < MIN_TRADE_AMOUNT}
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
          </>
          )}

          {activeTab === 'calculator' && (
            <PositionSizeCalculator />
          )}

          {activeTab === 'academy' && (
            <div className="tab-content-wrapper">
              <div className="tab-header">
                <BookOpen size={28} />
                <h2>Candle Academy</h2>
                <p className="tab-subtitle">Master candlestick patterns</p>
              </div>
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
            </div>
          )}

          {activeTab === 'history' && (
            <div className="tab-content-wrapper">
              <div className="tab-header">
                <Clock size={28} />
                <h2>Trade History</h2>
                <p className="tab-subtitle">Your past performance</p>
              </div>
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
                    <button className="btn-clear" onClick={clearHistory}>
                      <Trash2 size={16} />
                      <span>Clear History</span>
                    </button>
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
                <span className="balance-return" style={{ color: totalReturn >= 0 ? '#22c55e' : '#ef4444' }}>
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
                    {resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    <span>Theme</span>
                  </div>
                  <div className="theme-options">
                    <button
                      className={`theme-option ${mode === 'light' ? 'active' : ''}`}
                      onClick={() => setMode('light')}
                    >
                      <Sun size={16} />
                      <span>Light</span>
                    </button>
                    <button
                      className={`theme-option ${mode === 'dark' ? 'active' : ''}`}
                      onClick={() => setMode('dark')}
                    >
                      <Moon size={16} />
                      <span>Dark</span>
                    </button>
                    <button
                      className={`theme-option ${mode === 'system' ? 'active' : ''}`}
                      onClick={() => setMode('system')}
                    >
                      <Monitor size={16} />
                      <span>System</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
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
        </main>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              style={{ alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1100 }}
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

      <style>{`
        :root {
          --bg-primary: #FFFFFF;
          --bg-secondary: #FAFAFA;
          --bg-tertiary: #F5F5F5;
          --color-text: #000000;
          --color-text-secondary: #666666;
          --color-text-tertiary: #999999;
          --color-border: #E5E5E5;
          --color-green: #0E7C7B;
          --color-red: #D62246;
          --safe-area-top: env(safe-area-inset-top, 0);
          --safe-area-bottom: env(safe-area-inset-bottom, 0);

          /* Responsive spacing */
          --spacing-xs: 0.25rem;
          --spacing-sm: 0.5rem;
          --spacing-md: 1rem;
          --spacing-lg: 1.5rem;
          --spacing-xl: 2rem;

          /* Dynamic sizes */
          --header-height: clamp(8rem, 20vh, 12rem);
          --controls-height: 4rem;
        }

        /* Dark mode overrides */
        [data-theme="dark"] {
          --bg-primary: #1A1A1A;
          --bg-secondary: #121212;
          --bg-tertiary: #252525;
          --color-text: #FFFFFF;
          --color-text-secondary: #A0A0A0;
          --color-text-tertiary: #707070;
          --color-border: #333333;
          --color-green: #22c55e;
          --color-red: #ef4444;
        }

        * {
          box-sizing: border-box;
        }

        .mobile-shell {
          width: 100vw;
          height: 100vh;
          background: #F5F5F5;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: fixed;
          top: 0;
          left: 0;
        }

        .app-container {
          width: 100%;
          max-width: min(430px, 100vw);
          height: 100vh;
          max-height: 100vh;
          background: var(--bg-secondary);
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 40px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .header {
          padding: calc(var(--safe-area-top) + var(--spacing-md)) 5% var(--spacing-md);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--color-border);
          flex-shrink: 0;
          z-index: 10;
          min-height: fit-content;
        }

        .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .header-left-section { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
        .app-title { font-size: clamp(1.1rem, 4vw, 1.4rem); font-weight: 700; letter-spacing: -0.02em; color: var(--color-text); font-family: 'Cormorant Garamond', serif; margin: 0; line-height: 1.2; }
        .app-subtitle { font-size: clamp(0.65rem, 2.5vw, 0.75rem); color: var(--color-text-secondary); font-weight: 600; margin: 0; }
        .btn-profile { background: var(--bg-tertiary); border: none; padding: 0.3125rem; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .btn-profile:active { background: var(--color-border); }
        .header-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
        .btn-icon { background: transparent; border: none; padding: 0.5rem; margin: -0.5rem -0.25rem 0 0; cursor: pointer; border-radius: 50%; flex-shrink: 0; }
        .btn-icon:active { background: var(--bg-tertiary); }
        
        .stats-grid { display: grid; grid-template-columns: 1.2fr 1fr 0.8fr; gap: 2%; margin-top: var(--spacing-md); }
        .stat-card { padding: 3%; background: var(--bg-tertiary); border-radius: 0.75rem; border: 1px solid var(--color-border); }
        .stat-label { font-size: clamp(0.6rem, 2vw, 0.65rem); font-weight: 700; color: var(--color-text-tertiary); display: block; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 800; color: var(--color-text); }
        .header-meta { margin-top: var(--spacing-sm); display: flex; justify-content: space-between; align-items: center; font-size: clamp(0.65rem, 2.5vw, 0.75rem); font-weight: 600; color: var(--color-text-secondary); }
        .header.compact { padding: calc(var(--safe-area-top) + var(--spacing-sm)) 4% var(--spacing-sm); }
        .header.compact .stats-grid { margin-top: 0; }
        .main-content { flex: 1; display: flex; flex-direction: column; padding: 0; min-height: 0; overflow: hidden; }
        .main-content.fullscreen-mode { padding-top: var(--safe-area-top); }

        /* Broke Card */
        .broke-card {
          margin: 16px;
          padding: 32px 24px;
          background: var(--bg-primary);
          border: 2px dashed var(--color-border);
          border-radius: 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .broke-emoji {
          font-size: 4rem;
          line-height: 1;
          margin-bottom: 8px;
          animation: bounce 1s ease infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .broke-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-red);
          margin: 0;
        }

        .broke-balance {
          font-size: 1rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .broke-balance span {
          font-weight: 800;
          color: var(--color-text);
        }

        .broke-message {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 8px 0 16px 0;
        }

        .broke-btn {
          height: 52px !important;
          margin-top: 8px !important;
          font-size: 0.95rem !important;
        }

        /* Trade Amount Section */
        .trade-amount-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--color-border);
          flex-shrink: 0;
        }

        .trade-amount-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .trade-amount-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .amount-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: var(--bg-tertiary);
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }

        .amount-btn:active {
          background: var(--color-border);
          transform: scale(0.95);
        }

        .amount-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .amount-btn-max {
          height: 36px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: var(--bg-tertiary);
          color: var(--color-text);
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }

        .amount-btn-max:active {
          background: var(--color-border);
          transform: scale(0.95);
        }

        .amount-btn-max:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .amount-input-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 0 10px;
          height: 36px;
        }

        .currency-symbol {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          margin-right: 4px;
        }

        .amount-input {
          width: 80px;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-text);
          text-align: right;
          font-family: inherit;
        }

        .amount-input:focus {
          outline: none;
        }

        .amount-input::-webkit-outer-spin-button,
        .amount-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .amount-input[type=number] {
          -moz-appearance: textfield;
        }

        .chart-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          overflow: hidden;
          position: relative;
          min-height: 0;
          padding-bottom: calc(var(--controls-height) * 2 + var(--safe-area-bottom) + 2rem);
        }
        .scroll-chart-container { flex: 1; padding: 0 4%; min-height: 0; overflow: hidden; position: relative; }
        .positions-container { display: flex; flex-direction: column; margin: 0 4%; flex-shrink: 0; background: var(--bg-primary); border: 1px solid var(--color-border); border-radius: 0.75rem; overflow: hidden; }
        .positions-header { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; cursor: pointer; background: var(--bg-tertiary); }
        .positions-header:active { background: var(--color-border); }
        .positions-summary { display: flex; align-items: center; gap: 0.75rem; }
        .positions-count { font-size: 0.75rem; font-weight: 700; color: var(--color-text); }
        .positions-total-pl { font-size: 0.8rem; font-weight: 800; }
        .positions-toggle { background: none; border: none; padding: 4px; cursor: pointer; color: var(--color-text-secondary); display: flex; align-items: center; justify-content: center; }
        .positions-list { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.5rem; }
        .position-bar { background: var(--bg-primary); padding: 0.5rem 0.75rem; border-radius: 0.75rem; display: flex; justify-content: space-between; align-items: center; border: 2px solid var(--color-border); flex-shrink: 0; }
        .position-bar.long { border-color: var(--color-green); }
        .position-bar.short { border-color: var(--color-red); }
        .pos-info { display: flex; align-items: center; gap: 0.5rem; }
        .pos-details { display: flex; flex-direction: column; gap: 0.1rem; }
        .pos-entry { font-size: clamp(0.7rem, 2vw, 0.75rem); font-weight: 600; color: var(--text-primary); }
        .pos-amount { font-size: clamp(0.6rem, 1.8vw, 0.65rem); color: var(--text-secondary); }
        .pos-badge { padding: 0.2rem 0.4rem; border-radius: 0.4rem; font-size: clamp(0.55rem, 1.8vw, 0.6rem); font-weight: 800; color: #FFF; }
        .long .pos-badge { background: var(--color-green); }
        .short .pos-badge { background: var(--color-red); }
        .pos-right { display: flex; align-items: center; gap: 0.5rem; }
        .pos-close-btn { background: var(--bg-secondary); border: 1px solid var(--color-border); border-radius: 0.4rem; padding: 0.3rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: all 0.2s; }
        .pos-close-btn:hover { background: var(--color-red); color: #FFF; border-color: var(--color-red); }
        .pos-close-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .controls {
          position: fixed;
          bottom: calc(var(--controls-height) + var(--safe-area-bottom));
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: min(430px, 100vw);
          padding: 10px 16px;
          background: var(--bg-primary);
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 50;
          height: var(--controls-height);
          box-sizing: border-box;
        }

        .action-buttons-single-row {
          display: flex;
          gap: 8px;
          width: 100%;
          align-items: center;
        }

        .btn {
          flex: 1;
          height: 44px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.65rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .btn svg { width: 14px; height: 14px; }

        .btn:active {
          transform: scale(0.96);
        }

        .btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .btn-buy {
          background: var(--color-green);
          color: white;
        }

        .btn-buy:active {
          background: #1a9d4a;
        }

        .btn-sell {
          background: var(--color-red);
          color: white;
        }

        .btn-sell:active {
          background: #d93939;
        }

        .btn-close-pos {
          flex: 2;
          background: var(--color-text);
          color: white;
        }

        .btn-close-pos:active {
          background: #333;
        }

        .btn-close-all {
          background: #000000;
          color: white;
        }

        .btn-close-all:active {
          background: #333333;
        }

        .btn-skip {
          background: var(--bg-tertiary);
          color: var(--color-text-secondary);
        }

        .btn-skip:active {
          background: var(--color-border);
        }

        .btn-stop {
          background: var(--bg-tertiary);
          color: var(--color-text-secondary);
        }

        .btn-stop:active {
          background: var(--color-border);
        }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(8px); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
        .game-over-modal { background: var(--bg-primary); width: 100%; max-width: 100%; border-radius: 24px 24px 0 0; padding: 32px 24px calc(var(--safe-area-bottom) + 24px); max-height: 85vh; overflow-y: auto; }
        .info-modal { background: var(--bg-primary); width: 100%; max-width: 360px; border-radius: 0.75rem; padding: 0; border: 1px solid var(--color-border); max-height: calc(100vh - 80px); display: flex; flex-direction: column; overflow: hidden; }
        .info-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 24px 16px; border-bottom: 1px solid var(--color-border); flex-shrink: 0; position: sticky; top: 0; background: var(--bg-primary); z-index: 10; }
        .info-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-text); }
        .info-content { display: flex; flex-direction: column; gap: 20px; padding: 24px; overflow-y: auto; flex: 1; }
        .info-item h3 { font-size: 1rem; font-weight: 700; color: var(--color-text); margin-bottom: 6px; }
        .info-item p, .info-item ul { font-size: 0.9rem; color: var(--color-text-secondary); margin: 0; line-height: 1.5; }
        .info-item ul { padding-left: 20px; margin-top: 4px; }
        .info-item.intro { background: linear-gradient(135deg, rgba(14, 124, 123, 0.1) 0%, rgba(14, 124, 123, 0.05) 100%); padding: 16px; border-radius: 0.75rem; border: 1px solid rgba(14, 124, 123, 0.3); }
        .info-item.intro h3 { color: var(--color-green); font-size: 1rem; }
        .info-item.warning { background: rgba(214, 34, 70, 0.08); padding: 12px 16px; border-radius: 0.75rem; border: 1px solid rgba(214, 34, 70, 0.3); }
        .info-item.warning h3 { color: var(--color-red); }
        .info-item.warning p, .info-item.warning li { color: var(--color-text-secondary); }
        .info-item.challenge { background: var(--bg-tertiary); padding: 16px; border-radius: 0.75rem; border: 1px solid var(--color-border); text-align: center; }
        .info-item.challenge h3 { color: var(--color-text); }
        .info-item .good-luck { font-weight: 700; color: var(--color-green); margin-top: 8px; font-style: italic; }
        .modal-pill { width: 48px; height: 6px; background: var(--color-border); border-radius: 3px; position: absolute; top: 16px; left: 50%; transform: translateX(-50%); }
        .text-success { color: var(--color-green); }
        .text-danger { color: var(--color-red); }

        /* History Styles */

        .history-item {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 16px;
           background: var(--bg-tertiary);
           border-radius: 0.75rem;
           border: 1px solid var(--color-border);
        }

        .history-title {
           font-size: 1rem;
           font-weight: 700;
           color: var(--color-text);
           display: block;
           margin-bottom: 4px;
           font-family: 'Cormorant Garamond', serif;
        }

        .history-date {
           font-size: 0.75rem;
           color: var(--color-text-secondary);
           font-weight: 500;
        }

        .history-return {
           font-size: 1.1rem;
           font-weight: 800;
        }

        .empty-history {
           text-align: center;
           padding: 40px;
           color: var(--color-text-secondary);
        }

        .btn-clear {
           margin-top: 10px;
           background: var(--bg-tertiary);
           color: var(--color-text);
           border: 1px solid var(--color-border);
           padding: 16px;
           border-radius: 0.75rem;
           font-weight: 700;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 8px;
        }

        /* Academy Styles */
        .academy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .academy-card {
          background: var(--bg-tertiary);
          border-radius: 0.75rem;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border: 1px solid var(--color-border);
        }

        /* Profile Page Styles */

        .profile-avatar-large {
          width: 80px;
          height: 80px;
          background: var(--bg-tertiary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .profile-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0 0 4px 0;
        }

        .member-since {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .profile-balance-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          padding: 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .balance-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 2rem;
          font-weight: 900;
          color: var(--color-text);
          margin-bottom: 4px;
        }

        .balance-return {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .balance-detail {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--color-border);
          width: 100%;
        }

        .balance-detail span {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          font-weight: 600;
        }

        .profile-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .profile-action-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.15s;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .profile-action-btn:active {
          background: var(--color-border);
          transform: scale(0.98);
        }

        .profile-action-btn span {
          flex: 1;
        }

        .toggle-switch {
          width: 44px;
          height: 24px;
          background: var(--color-border);
          border-radius: 12px;
          position: relative;
          transition: background 0.3s;
        }

        .toggle-switch.active {
          background: var(--color-green);
        }

        .toggle-knob {
          width: 20px;
          height: 20px;
          background: #FFF;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: left 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .toggle-switch.active .toggle-knob {
          left: 22px;
        }

        .academy-svg-wrapper {
          width: 120px;
          height: 75px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .academy-svg {
          width: 100%;
          height: 100%;
        }

        .academy-info h3 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 4px;
        }

        .academy-info p {
          font-size: 0.7rem;
          color: var(--color-text-secondary);
          line-height: 1.3;
        }

        /* Summary Modal Additions */
        .game-over-modal.cream-theme { background: var(--bg-primary); color: var(--color-text); text-align: center; padding-top: 32px; border: 1px solid var(--color-border); border-bottom: none; }
        .title-section { margin-bottom: 30px; }
        .summary-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6; margin-bottom: 8px; font-weight: 600; }
        .trading-title { font-size: 2.2rem; line-height: 1.1; font-family: 'Cormorant Garamond', serif; font-weight: 700; color: var(--color-text); margin: 0; }
        .stats-row { display: flex; justify-content: center; align-items: center; gap: 16px; margin-bottom: 30px; padding: 16px; background: var(--bg-tertiary); border-radius: 0.75rem; border: 1px solid var(--color-border); }
        .mini-stat { display: flex; flex-direction: column; align-items: center; }
        .mini-stat .label { font-size: 0.6rem; font-weight: 700; color: var(--color-text-tertiary); letter-spacing: 0.5px; margin-bottom: 2px; text-transform: uppercase; }
        .mini-stat .value { font-size: 1.1rem; font-weight: 800; }
        .pos { color: var(--color-green); }
        .neg { color: var(--color-red); }
        .mini-divider { width: 1px; height: 24px; background: var(--color-border); }
        .reveal-section-compact {
          margin-bottom: 24px;
          padding: 16px;
          background: rgba(0,0,0,0.02);
          border-radius: 0.75rem;
        }
        .stock-reveal {
          font-size: 1.4rem;
          font-weight: 900;
          margin: 0 0 4px 0;
          color: var(--color-text);
        }
        .stock-name-reveal {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin: 0 0 8px 0;
        }
        .date-reveal {
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
          margin: 0;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary {
          background: var(--color-text);
          color: var(--bg-primary);
          height: 72px;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 0.75rem;
          margin-top: 10px;
          width: 100%;
          border: none;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-primary:active {
          background: var(--color-text-secondary);
        }

        [data-theme="dark"] .btn-primary {
          background: #FFFFFF;
          color: #000000;
        }

        [data-theme="dark"] .btn-primary:active {
          background: #E0E0E0;
        }

        /* Zoom Controls - Floating */
        .zoom-controls-floating {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 100;
        }

        /* Info Button - Floating */
        .info-btn-floating {
          position: absolute;
          bottom: 8px;
          left: 8px;
          z-index: 100;
        }

        .zoom-btn-mini {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          color: var(--color-text);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        [data-theme="dark"] .zoom-btn-mini {
          background: rgba(60, 60, 60, 0.95);
          border: 1px solid rgba(100, 100, 100, 0.5);
          color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .zoom-btn-mini:active {
          background: var(--bg-tertiary);
          transform: scale(0.95);
        }

        [data-theme="dark"] .zoom-btn-mini:active {
          background: rgba(80, 80, 80, 0.95);
        }

        .zoom-btn-mini:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .zoom-btn:active {
          transform: scale(0.95);
          background: var(--color-border);
        }

        .zoom-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .zoom-btn:disabled:active {
          transform: none;
        }

        .zoom-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          min-width: 50px;
          text-align: center;
        }

        /* Bottom Navigation */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: min(430px, 100vw);
          height: calc(var(--controls-height) + var(--safe-area-bottom));
          background: var(--bg-primary);
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
          padding: 8px 2% 0;
          padding-bottom: var(--safe-area-bottom);
          z-index: 1000;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          background: transparent;
          border: none;
          padding: 6px 2px;
          cursor: pointer;
          color: var(--color-text-tertiary);
          transition: all 0.15s;
          min-width: 0;
        }

        .nav-item svg {
          flex-shrink: 0;
        }

        .nav-item span {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .nav-item.active {
          color: var(--color-text);
        }

        .nav-item:active {
          transform: scale(0.95);
        }

        /* Tab Content Wrapper */
        .tab-content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 4%;
          overflow-y: auto;
          padding-bottom: calc(var(--controls-height) + var(--safe-area-bottom) + 1rem);
        }

        .tab-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .tab-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0.5rem 0 0.25rem 0;
        }

        .tab-subtitle {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .profile-header-inline {
          text-align: center;
          padding: 20px 0;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .profile-header-inline h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0.75rem 0 0.25rem 0;
        }

        .history-list-inline {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Chat Container */
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          overflow: hidden;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4%;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--color-border);
        }

        .chat-header h2 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0;
        }

        .chat-subtitle {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 4%;
          padding-bottom: calc(var(--controls-height) * 2 + var(--safe-area-bottom) + 1rem);
        }

        .welcome-message {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .ai-avatar {
          width: 40px;
          height: 40px;
          background: var(--bg-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          border: 1px solid var(--color-border);
        }

        .message-bubble {
          background: var(--bg-primary);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          padding: 16px;
          flex: 1;
        }

        .message-bubble p {
          margin: 0 0 12px 0;
          color: var(--color-text);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .message-bubble p:last-child {
          margin-bottom: 0;
        }

        .message-bubble ul {
          margin: 8px 0;
          padding-left: 20px;
          color: var(--color-text-secondary);
          font-size: 0.85rem;
        }

        .message-bubble li {
          margin: 6px 0;
        }

        .coming-soon {
          margin-top: 16px !important;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 0.5rem;
          font-weight: 700;
          color: var(--color-text-secondary) !important;
          font-size: 0.8rem !important;
          text-align: center;
        }

        .chat-input-area {
          position: fixed;
          bottom: var(--controls-height);
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: min(430px, 100vw);
          display: flex;
          gap: 8px;
          padding: 12px 4%;
          background: var(--bg-primary);
          border-top: 1px solid var(--color-border);
          z-index: 900;
        }

        .chat-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          background: var(--bg-tertiary);
          color: var(--color-text);
          font-family: inherit;
          font-size: 0.9rem;
        }

        .chat-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-input::placeholder {
          color: var(--color-text-tertiary);
        }

        .chat-send-btn {
          padding: 12px 24px;
          background: var(--color-text);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Theme Selector Styles */
        .theme-selector {
          background: var(--bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .theme-selector-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .theme-options {
          display: flex;
          gap: 8px;
        }

        .theme-option {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 8px;
          background: var(--bg-primary);
          border: 2px solid var(--color-border);
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--color-text-secondary);
        }

        .theme-option span {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .theme-option:hover {
          border-color: var(--color-text-tertiary);
        }

        .theme-option.active {
          border-color: var(--color-green);
          background: rgba(14, 124, 123, 0.1);
          color: var(--color-green);
        }

        [data-theme="dark"] .theme-option.active {
          background: rgba(34, 197, 94, 0.15);
        }

        .theme-option:active {
          transform: scale(0.95);
        }

        /* Smooth theme transitions */
        .mobile-shell,
        .app-container,
        .header,
        .main-content,
        .bottom-nav,
        .controls,
        .modal-overlay,
        .game-over-modal,
        .info-modal,
        .stat-card,
        .position-bar,
        .positions-container,
        .academy-card,
        .history-item,
        .profile-balance-card,
        .profile-action-btn,
        .theme-selector,
        .theme-option,
        .btn,
        .zoom-btn-mini {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
      `}</style>
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
