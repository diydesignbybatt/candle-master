import { useState, useCallback, useEffect } from 'react';
import type { StockData } from '../utils/data';

export interface Trade {
    type: 'LONG' | 'SHORT' | 'EXIT';
    price: number;
    date: string;
    commission: number;
}

export interface Position {
    id: string;
    type: 'LONG' | 'SHORT';
    amount: number;
    entryPrice: number;
    investedAmount: number;
    openedAt: string;
}

const INITIAL_BALANCE = 10000;
const BALANCE_STORAGE_KEY = 'candle_master_balance';
const MAX_POSITIONS = 3;

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

// Generate unique ID for positions
const generatePositionId = (): string => {
    return `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useTradingSession = (stock: StockData | null) => {
    const [currentIndex, setCurrentIndex] = useState(99);
    const [balance, setBalance] = useState(() => getSavedBalance());
    const [positions, setPositions] = useState<Position[]>([]);
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
            setPositions([]);
            setIsGameOver(false);
            setTotalCommissions(0);
            setTradeCount(0);
            setWinCount(0);
        }
    }, [stock]);

    const allData = stock?.data || [];
    const currentCandle = allData[currentIndex];

    const enterPosition = useCallback((type: 'LONG' | 'SHORT', tradeAmount?: number) => {
        if (isGameOver || !currentCandle) return;
        if (positions.length >= MAX_POSITIONS) return;

        // Use provided tradeAmount or full balance
        const investAmount = tradeAmount && tradeAmount > 0 && tradeAmount <= balance ? tradeAmount : balance;

        if (investAmount <= 0) return;

        const price = currentCandle.close;
        const commission = investAmount * COMMISSION_RATE;
        const netInvestment = investAmount - commission;
        const amount = netInvestment / price;

        const newPosition: Position = {
            id: generatePositionId(),
            type,
            amount,
            entryPrice: price,
            investedAmount: investAmount,
            openedAt: currentCandle.time
        };

        setBalance(prev => prev - investAmount);
        setTotalCommissions((prev: number) => prev + commission);
        setPositions(prev => [...prev, newPosition]);
    }, [currentCandle, balance, isGameOver, positions.length]);

    const closePosition = useCallback((positionId: string) => {
        if (!currentCandle || isGameOver) return;

        const positionToClose = positions.find(p => p.id === positionId);
        if (!positionToClose) return;

        const price = currentCandle.close;
        let pnl = 0;

        if (positionToClose.type === 'LONG') {
            pnl = (price - positionToClose.entryPrice) * positionToClose.amount;
        } else {
            pnl = (positionToClose.entryPrice - price) * positionToClose.amount;
        }

        const initialInvestment = positionToClose.entryPrice * positionToClose.amount;
        const grossValue = initialInvestment + pnl;
        const commission = grossValue * COMMISSION_RATE;
        const returnedAmount = grossValue - commission;

        // Add the returned amount back to balance
        setBalance(prev => prev + returnedAmount);
        setTotalCommissions((prev: number) => prev + commission);

        // Update stats
        setTradeCount(prev => prev + 1);
        if (returnedAmount > positionToClose.investedAmount) {
            setWinCount(prev => prev + 1);
        }

        setPositions(prev => prev.filter(p => p.id !== positionId));
    }, [currentCandle, positions, isGameOver]);

    const closeAllPositions = useCallback(() => {
        if (!currentCandle || isGameOver || positions.length === 0) return;

        const price = currentCandle.close;
        let totalReturned = 0;
        let totalNewCommission = 0;
        let newTradeCount = 0;
        let newWinCount = 0;

        positions.forEach(pos => {
            let pnl = 0;
            if (pos.type === 'LONG') {
                pnl = (price - pos.entryPrice) * pos.amount;
            } else {
                pnl = (pos.entryPrice - price) * pos.amount;
            }

            const initialInvestment = pos.entryPrice * pos.amount;
            const grossValue = initialInvestment + pnl;
            const commission = grossValue * COMMISSION_RATE;
            const returnedAmount = grossValue - commission;

            totalReturned += returnedAmount;
            totalNewCommission += commission;
            newTradeCount += 1;
            if (returnedAmount > pos.investedAmount) {
                newWinCount += 1;
            }
        });

        setBalance(prev => prev + totalReturned);
        setTotalCommissions(prev => prev + totalNewCommission);
        setTradeCount(prev => prev + newTradeCount);
        setWinCount(prev => prev + newWinCount);
        setPositions([]);
    }, [currentCandle, positions, isGameOver]);

    const startIndex = 99;
    const maxMoves = 100;

    const skipDay = useCallback(() => {
        if (currentIndex >= startIndex + maxMoves || currentIndex >= allData.length - 1 || isGameOver) {
            setIsGameOver(true);
            if (positions.length > 0) closeAllPositions();
            return;
        }
        setCurrentIndex(prev => prev + 1);
    }, [currentIndex, allData.length, isGameOver, positions.length, closeAllPositions, startIndex]);

    const stop = useCallback(() => {
        if (positions.length > 0) closeAllPositions();
        setIsGameOver(true);
    }, [positions.length, closeAllPositions]);

    // Calculate unrealized P&L for each position
    const getPositionPL = useCallback((pos: Position): number => {
        if (!currentCandle) return 0;
        if (pos.type === 'LONG') {
            return (currentCandle.close - pos.entryPrice) * pos.amount;
        } else {
            return (pos.entryPrice - currentCandle.close) * pos.amount;
        }
    }, [currentCandle]);

    // Total unrealized P&L across all positions
    const unrealizedPL = positions.reduce((total, pos) => total + getPositionPL(pos), 0);

    // Calculate total position value including unrealized P&L
    const positionValue = positions.reduce((total, pos) => {
        const initialValue = pos.entryPrice * pos.amount;
        const pnl = getPositionPL(pos);
        return total + initialValue + pnl;
    }, 0);

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
        balance,
        displayBalance,
        startingBalance,
        positions,
        maxPositions: MAX_POSITIONS,
        totalReturn,
        isGameOver,
        totalCommissions,
        unrealizedPL,
        getPositionPL,
        tradeCount,
        winCount,
        long: (tradeAmount?: number) => enterPosition('LONG', tradeAmount),
        short: (tradeAmount?: number) => enterPosition('SHORT', tradeAmount),
        closePosition,
        closeAllPositions,
        skipDay,
        stop
    };
};
