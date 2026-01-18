import { useState, useCallback, useEffect } from 'react';
import type { StockData } from '../utils/data';

export interface Trade {
    type: 'LONG' | 'SHORT' | 'EXIT';
    price: number;
    date: string;
    commission: number;
}

const INITIAL_BALANCE = 10000;
const BALANCE_STORAGE_KEY = 'candle_master_balance';

// Helper to get saved balance
const getSavedBalance = (): number => {
    const saved = localStorage.getItem(BALANCE_STORAGE_KEY);
    if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) {
            return parsed;
        }
    }
    return INITIAL_BALANCE;
};

// Helper to save balance
const saveBalance = (balance: number) => {
    localStorage.setItem(BALANCE_STORAGE_KEY, balance.toString());
};

// Helper to reset balance
export const resetSavedBalance = () => {
    localStorage.setItem(BALANCE_STORAGE_KEY, INITIAL_BALANCE.toString());
};

export const useTradingSession = (stock: StockData | null) => {
    const [currentIndex, setCurrentIndex] = useState(99);
    const [balance, setBalance] = useState(() => getSavedBalance());
    const [position, setPosition] = useState<{ type: 'LONG' | 'SHORT'; amount: number; entryPrice: number; investedAmount: number } | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [totalCommissions, setTotalCommissions] = useState(0);
    const [tradeCount, setTradeCount] = useState(0);
    const [winCount, setWinCount] = useState(0);
    const [startingBalance, setStartingBalance] = useState(() => getSavedBalance());

    const COMMISSION_RATE = 0.0015; // 0.15%

    // Reset internal game state when the stock changes (New Session)
    useEffect(() => {
        if (stock) {
            const savedBalance = getSavedBalance();
            setCurrentIndex(99);
            setBalance(savedBalance);
            setStartingBalance(savedBalance);
            setPosition(null);
            setIsGameOver(false);
            setTotalCommissions(0);
            setTradeCount(0);
            setWinCount(0);
        }
    }, [stock]);

    const allData = stock?.data || [];
    const currentCandle = allData[currentIndex];

    const enterPosition = useCallback((type: 'LONG' | 'SHORT', tradeAmount?: number) => {
        if (isGameOver || position || !currentCandle) return;

        // Use provided tradeAmount or full balance
        const investAmount = tradeAmount && tradeAmount > 0 && tradeAmount <= balance ? tradeAmount : balance;

        const price = currentCandle.close;
        const commission = investAmount * COMMISSION_RATE;
        const netInvestment = investAmount - commission;
        const amount = netInvestment / price;

        setBalance(prev => prev - investAmount);
        setTotalCommissions((prev: number) => prev + commission);
        setPosition({ type, amount, entryPrice: price, investedAmount: investAmount });
    }, [currentCandle, balance, isGameOver, position]);

    const closePosition = useCallback(() => {
        if (!position || !currentCandle || isGameOver) return;

        const price = currentCandle.close;
        let pnl = 0;

        if (position.type === 'LONG') {
            pnl = (price - position.entryPrice) * position.amount;
        } else {
            pnl = (position.entryPrice - price) * position.amount;
        }

        const initialInvestment = position.entryPrice * position.amount;
        const grossValue = initialInvestment + pnl;
        const commission = grossValue * COMMISSION_RATE;
        const returnedAmount = grossValue - commission;

        // Add the returned amount back to balance
        setBalance(prev => prev + returnedAmount);
        setTotalCommissions((prev: number) => prev + commission);

        // Update stats
        setTradeCount(prev => prev + 1);
        if (returnedAmount > position.investedAmount) { // Check if we made profit
            setWinCount(prev => prev + 1);
        }

        setPosition(null);
    }, [currentCandle, position, isGameOver]);

    const startIndex = 99;
    const maxMoves = 100;

    const skipDay = useCallback(() => {
        if (currentIndex >= startIndex + maxMoves || currentIndex >= allData.length - 1 || isGameOver) {
            setIsGameOver(true);
            if (position) closePosition();
            return;
        }
        setCurrentIndex(prev => prev + 1);
    }, [currentIndex, allData.length, isGameOver, position, closePosition, startIndex]);

    const stop = useCallback(() => {
        if (position) closePosition();
        setIsGameOver(true);
    }, [position, closePosition]);

    const unrealizedPL = position && currentCandle
        ? (position.type === 'LONG'
            ? (currentCandle.close - position.entryPrice) * position.amount
            : (position.entryPrice - currentCandle.close) * position.amount)
        : 0;

    // Calculate position value including unrealized P&L
    const positionValue = position
        ? (position.entryPrice * position.amount) + unrealizedPL
        : 0;

    // Display balance = cash balance + current position value
    const displayBalance = balance + positionValue;

    // Calculate return based on starting balance of this session
    const totalReturn = startingBalance > 0
        ? ((displayBalance - startingBalance) / startingBalance) * 100
        : 0;

    // Save balance when game ends
    useEffect(() => {
        if (isGameOver && displayBalance > 0) {
            saveBalance(displayBalance);
        }
    }, [isGameOver, displayBalance]);

    return {
        stockName: stock?.name || '',
        stockSymbol: stock?.symbol || '',
        startDate: allData[startIndex]?.time || '',
        visibleData: allData.slice(0, currentIndex + 1),
        currentCandle,
        balance, // Available cash for trading
        displayBalance, // Total portfolio value
        startingBalance, // Balance at start of this session
        position,
        totalReturn,
        isGameOver,
        totalCommissions,
        unrealizedPL,
        tradeCount,
        winCount,
        long: (tradeAmount?: number) => enterPosition('LONG', tradeAmount),
        short: (tradeAmount?: number) => enterPosition('SHORT', tradeAmount),
        closePosition,
        skipDay,
        stop
    };
};
