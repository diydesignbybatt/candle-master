import React from 'react';
import { Colors } from '../styles/appStyles';

export interface AcademyPattern {
    id: number;
    name: string;
    desc: string;
    render: () => React.ReactNode;
}

export const ACADEMY_PATTERNS: AcademyPattern[] = [
    // Row 1: Hammer vs Hanging Man
    {
        id: 1, name: "Hammer", desc: "Bullish reversal at bottom. Long lower shadow.",
        render: () => (
            <svg viewBox= "0 0 100 60" className="academy-svg" >
            <line x1="10" y1 = "8" x2="10" y2="22" stroke={ Colors.Gray } strokeWidth="2" /> <rect x="7" y = "8" width="6" height="12" fill={ Colors.Gray } />
            <line x1="30" y1 = "12" x2="30" y2="30" stroke={ Colors.Gray } strokeWidth="2" /> <rect x="27" y = "14" width="6" height="14" fill={ Colors.Gray } />
            <line x1="50" y1 = "20" x2="50" y2="42" stroke={ Colors.Gray } strokeWidth="2" /> <rect x="47" y = "22" width="6" height="16" fill={ Colors.Gray } />
            <line x1="70" y1 = "28" x2="70" y2="52" stroke={ Colors.Gray } strokeWidth="2" /> <rect x="67" y = "30" width="6" height="18" fill={ Colors.Gray } />
            <line x1="90" y1 = "18" x2="90" y2="55" stroke={ Colors.Green } strokeWidth="2" /> <rect x="86" y = "18" width="8" height="10" fill={ Colors.Green } />
            </svg>
    )
  },
{
    id: 2, name: "Hanging Man", desc: "Bearish reversal at top. Long lower shadow.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="10" y1 = "42" x2 = "10" y2 = "52" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="7" y = "42" width = "6" height = "8" fill = { Colors.Gray } />
                    <line x1="30" y1 = "32" x2 = "30" y2 = "46" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="27" y = "32" width = "6" height = "12" fill = { Colors.Gray } />
                        <line x1="50" y1 = "22" x2 = "50" y2 = "36" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="47" y = "22" width = "6" height = "12" fill = { Colors.Gray } />
                            <line x1="70" y1 = "12" x2 = "70" y2 = "26" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="67" y = "12" width = "6" height = "12" fill = { Colors.Gray } />
                                <line x1="90" y1 = "5" x2 = "90" y2 = "55" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="86" y = "5" width = "8" height = "10" fill = { Colors.Red } />
                                    </svg>
    )
},
// Row 2: Inverted Hammer vs Shooting Star
{
    id: 3, name: "Inverted Hammer", desc: "Bullish reversal. Long upper shadow.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="10" y1 = "8" x2 = "10" y2 = "18" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="7" y = "8" width = "6" height = "8" fill = { Colors.Gray } />
                    <line x1="30" y1 = "12" x2 = "30" y2 = "24" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="27" y = "14" width = "6" height = "8" fill = { Colors.Gray } />
                        <line x1="50" y1 = "18" x2 = "50" y2 = "32" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="47" y = "20" width = "6" height = "10" fill = { Colors.Gray } />
                            <line x1="70" y1 = "25" x2 = "70" y2 = "42" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="67" y = "32" width = "6" height = "8" fill = { Colors.Gray } />
                                <line x1="90" y1 = "5" x2 = "90" y2 = "55" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="86" y = "45" width = "8" height = "10" fill = { Colors.Green } />
                                    </svg>
    )
},
{
    id: 4, name: "Shooting Star", desc: "Bearish reversal. Long upper shadow.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="10" y1 = "38" x2 = "10" y2 = "52" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="7" y = "40" width = "6" height = "10" fill = { Colors.Gray } />
                    <line x1="30" y1 = "28" x2 = "30" y2 = "42" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="27" y = "28" width = "6" height = "12" fill = { Colors.Gray } />
                        <line x1="50" y1 = "18" x2 = "50" y2 = "32" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="47" y = "18" width = "6" height = "12" fill = { Colors.Gray } />
                            <line x1="70" y1 = "8" x2 = "70" y2 = "22" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="67" y = "10" width = "6" height = "10" fill = { Colors.Gray } />
                                <line x1="90" y1 = "5" x2 = "90" y2 = "42" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="86" y = "32" width = "8" height = "10" fill = { Colors.Red } />
                                    </svg>
    )
},
// Row 3: Bullish Engulfing vs Bearish Engulfing
{
    id: 5, name: "Bullish Engulfing", desc: "Strong reversal. Green eats Red.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="15" y1 = "8" x2 = "15" y2 = "20" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="12" y = "10" width = "6" height = "8" fill = { Colors.Gray } />
                    <line x1="35" y1 = "15" x2 = "35" y2 = "28" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="32" y = "17" width = "6" height = "9" fill = { Colors.Gray } />
                        <line x1="55" y1 = "22" x2 = "55" y2 = "38" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="52" y = "24" width = "6" height = "12" fill = { Colors.Gray } />
                            <line x1="75" y1 = "30" x2 = "75" y2 = "48" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="71" y = "32" width = "8" height = "14" fill = { Colors.Red } />
                                <line x1="95" y1 = "22" x2 = "95" y2 = "55" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="90" y = "24" width = "10" height = "28" fill = { Colors.Green } />
                                    </svg>
    )
},
{
    id: 6, name: "Bearish Engulfing", desc: "Strong reversal. Red eats Green.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="15" y1 = "42" x2 = "15" y2 = "54" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="12" y = "44" width = "6" height = "8" fill = { Colors.Gray } />
                    <line x1="35" y1 = "32" x2 = "35" y2 = "46" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="32" y = "34" width = "6" height = "10" fill = { Colors.Gray } />
                        <line x1="55" y1 = "22" x2 = "55" y2 = "36" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="52" y = "24" width = "6" height = "10" fill = { Colors.Gray } />
                            <line x1="75" y1 = "12" x2 = "75" y2 = "28" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="71" y = "14" width = "8" height = "12" fill = { Colors.Green } />
                                <line x1="95" y1 = "5" x2 = "95" y2 = "38" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="90" y = "8" width = "10" height = "28" fill = { Colors.Red } />
                                    </svg>
    )
},
// Row 4: Piercing Pattern vs Dark Cloud Cover
{
    id: 7, name: "Piercing Pattern", desc: "Bullish reversal. Green closes above midpoint.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "12" x2 = "20" y2 = "22" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "14" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="40" y1 = "18" x2 = "40" y2 = "28" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="37" y = "20" width = "6" height = "6" fill = { Colors.Gray } />
                        <line x1="60" y1 = "5" x2 = "60" y2 = "45" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="55" y = "8" width = "10" height = "35" fill = { Colors.Red } />
                            <line x1="80" y1 = "18" x2 = "80" y2 = "55" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="75" y = "20" width = "10" height = "32" fill = { Colors.Green } />
                                </svg>
    )
},
{
    id: 8, name: "Dark Cloud Cover", desc: "Bearish reversal. Red closes below midpoint.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "38" x2 = "20" y2 = "48" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "40" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="40" y1 = "32" x2 = "40" y2 = "42" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="37" y = "34" width = "6" height = "6" fill = { Colors.Gray } />
                        <line x1="60" y1 = "15" x2 = "60" y2 = "55" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="55" y = "18" width = "10" height = "35" fill = { Colors.Green } />
                            <line x1="80" y1 = "5" x2 = "80" y2 = "42" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="75" y = "8" width = "10" height = "32" fill = { Colors.Red } />
                                </svg>
    )
},
// Row 5: Morning Star vs Evening Star
{
    id: 9, name: "Morning Star", desc: "3-candle bullish reversal.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "8" x2 = "20" y2 = "18" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "10" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="40" y1 = "5" x2 = "40" y2 = "38" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="36" y = "8" width = "8" height = "28" fill = { Colors.Red } />
                        <line x1="60" y1 = "38" x2 = "60" y2 = "52" stroke = { Colors.Black } strokeWidth = "2" /> <line x1="54" y1 = "45" x2 = "66" y2 = "45" stroke = { Colors.Black } strokeWidth = "4" />
                            <line x1="80" y1 = "15" x2 = "80" y2 = "48" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="76" y = "18" width = "8" height = "28" fill = { Colors.Green } />
                                </svg>
    )
},
{
    id: 10, name: "Evening Star", desc: "3-candle bearish reversal.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "42" x2 = "20" y2 = "52" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "44" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="40" y1 = "22" x2 = "40" y2 = "55" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="36" y = "24" width = "8" height = "28" fill = { Colors.Green } />
                        <line x1="60" y1 = "8" x2 = "60" y2 = "22" stroke = { Colors.Black } strokeWidth = "2" /> <line x1="54" y1 = "15" x2 = "66" y2 = "15" stroke = { Colors.Black } strokeWidth = "4" />
                            <line x1="80" y1 = "12" x2 = "80" y2 = "45" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="76" y = "14" width = "8" height = "28" fill = { Colors.Red } />
                                </svg>
    )
},
// Row 6: Three White Soldiers vs Three Black Crows
{
    id: 11, name: "Three White Soldiers", desc: "Strong bullish trend. 3 green candles.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="15" y1 = "42" x2 = "15" y2 = "52" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="12" y = "44" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="35" y1 = "32" x2 = "35" y2 = "55" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="31" y = "35" width = "8" height = "18" fill = { Colors.Green } />
                        <line x1="55" y1 = "18" x2 = "55" y2 = "42" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="51" y = "22" width = "8" height = "18" fill = { Colors.Green } />
                            <line x1="75" y1 = "5" x2 = "75" y2 = "28" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="71" y = "8" width = "8" height = "18" fill = { Colors.Green } />
                                </svg>
    )
},
{
    id: 12, name: "Three Black Crows", desc: "Strong bearish trend. 3 red candles.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="15" y1 = "8" x2 = "15" y2 = "18" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="12" y = "10" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="35" y1 = "5" x2 = "35" y2 = "28" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="31" y = "8" width = "8" height = "18" fill = { Colors.Red } />
                        <line x1="55" y1 = "18" x2 = "55" y2 = "42" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="51" y = "22" width = "8" height = "18" fill = { Colors.Red } />
                            <line x1="75" y1 = "32" x2 = "75" y2 = "55" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="71" y = "35" width = "8" height = "18" fill = { Colors.Red } />
                                </svg>
    )
},
// Row 7: Bullish Harami vs Bearish Harami
{
    id: 13, name: "Bullish Harami", desc: "Reversal. Small green inside big red.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "8" x2 = "20" y2 = "18" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "10" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="40" y1 = "12" x2 = "40" y2 = "24" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="37" y = "14" width = "6" height = "8" fill = { Colors.Gray } />
                        <line x1="60" y1 = "5" x2 = "60" y2 = "55" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="54" y = "8" width = "12" height = "44" fill = { Colors.Red } />
                            <line x1="80" y1 = "22" x2 = "80" y2 = "38" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="76" y = "24" width = "8" height = "12" fill = { Colors.Green } />
                                </svg>
    )
},
{
    id: 14, name: "Bearish Harami", desc: "Reversal. Small red inside big green.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "42" x2 = "20" y2 = "52" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "44" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="40" y1 = "36" x2 = "40" y2 = "48" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="37" y = "38" width = "6" height = "8" fill = { Colors.Gray } />
                        <line x1="60" y1 = "5" x2 = "60" y2 = "55" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="54" y = "8" width = "12" height = "44" fill = { Colors.Green } />
                            <line x1="80" y1 = "22" x2 = "80" y2 = "38" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="76" y = "24" width = "8" height = "12" fill = { Colors.Red } />
                                </svg>
    )
},
// Row 8: Tweezer Bottom vs Tweezer Top
{
    id: 15, name: "Tweezer Bottom", desc: "Bullish reversal. Same lows.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "12" x2 = "20" y2 = "28" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "15" width = "6" height = "10" fill = { Colors.Gray } />
                    <line x1="40" y1 = "22" x2 = "40" y2 = "38" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="37" y = "25" width = "6" height = "10" fill = { Colors.Gray } />
                        <line x1="60" y1 = "15" x2 = "60" y2 = "52" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="55" y = "18" width = "10" height = "32" fill = { Colors.Red } />
                            <line x1="80" y1 = "22" x2 = "80" y2 = "52" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="75" y = "25" width = "10" height = "25" fill = { Colors.Green } />
                                <line x1="50" y1 = "52" x2 = "90" y2 = "52" stroke = "#666" strokeWidth = "1" strokeDasharray = "3,3" />
                                    </svg>
    )
},
{
    id: 16, name: "Tweezer Top", desc: "Bearish reversal. Same highs.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "32" x2 = "20" y2 = "48" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "35" width = "6" height = "10" fill = { Colors.Gray } />
                    <line x1="40" y1 = "22" x2 = "40" y2 = "38" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="37" y = "25" width = "6" height = "10" fill = { Colors.Gray } />
                        <line x1="60" y1 = "8" x2 = "60" y2 = "45" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="55" y = "10" width = "10" height = "32" fill = { Colors.Green } />
                            <line x1="80" y1 = "8" x2 = "80" y2 = "38" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="75" y = "10" width = "10" height = "25" fill = { Colors.Red } />
                                <line x1="50" y1 = "8" x2 = "90" y2 = "8" stroke = "#666" strokeWidth = "1" strokeDasharray = "3,3" />
                                    </svg>
    )
},
// Row 9: Dragonfly Doji vs Gravestone Doji
{
    id: 17, name: "Dragonfly Doji", desc: "Bullish reversal. Long lower shadow.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "8" x2 = "20" y2 = "18" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "10" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="40" y1 = "12" x2 = "40" y2 = "24" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="37" y = "14" width = "6" height = "8" fill = { Colors.Gray } />
                        <line x1="60" y1 = "18" x2 = "60" y2 = "32" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="57" y = "20" width = "6" height = "10" fill = { Colors.Gray } />
                            <line x1="80" y1 = "12" x2 = "80" y2 = "55" stroke = { Colors.Green } strokeWidth = "2" /> <line x1="72" y1 = "12" x2 = "88" y2 = "12" stroke = { Colors.Green } strokeWidth = "4" />
                                </svg>
    )
},
{
    id: 18, name: "Gravestone Doji", desc: "Bearish reversal. Long upper shadow.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="20" y1 = "42" x2 = "20" y2 = "52" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="17" y = "44" width = "6" height = "6" fill = { Colors.Gray } />
                    <line x1="40" y1 = "36" x2 = "40" y2 = "48" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="37" y = "38" width = "6" height = "8" fill = { Colors.Gray } />
                        <line x1="60" y1 = "28" x2 = "60" y2 = "42" stroke = { Colors.Gray } strokeWidth = "2" /> <rect x="57" y = "30" width = "6" height = "10" fill = { Colors.Gray } />
                            <line x1="80" y1 = "5" x2 = "80" y2 = "48" stroke = { Colors.Red } strokeWidth = "2" /> <line x1="72" y1 = "48" x2 = "88" y2 = "48" stroke = { Colors.Red } strokeWidth = "4" />
                                </svg>
    )
},
// Row 10: Three Inside Up vs Three Inside Down
{
    id: 19, name: "Three Inside Up", desc: "Bullish reversal. Harami + confirmation.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="25" y1 = "5" x2 = "25" y2 = "55" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="19" y = "8" width = "12" height = "44" fill = { Colors.Red } />
                    <line x1="50" y1 = "22" x2 = "50" y2 = "38" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="45" y = "24" width = "10" height = "12" fill = { Colors.Green } />
                        <line x1="75" y1 = "8" x2 = "75" y2 = "32" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="69" y = "10" width = "12" height = "20" fill = { Colors.Green } />
                            </svg>
    )
},
{
    id: 20, name: "Three Inside Down", desc: "Bearish reversal. Harami + confirmation.",
        render: () => (
            <svg viewBox= "0 0 100 60" className = "academy-svg" >
                <line x1="25" y1 = "5" x2 = "25" y2 = "55" stroke = { Colors.Green } strokeWidth = "2" /> <rect x="19" y = "8" width = "12" height = "44" fill = { Colors.Green } />
                    <line x1="50" y1 = "22" x2 = "50" y2 = "38" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="45" y = "24" width = "10" height = "12" fill = { Colors.Red } />
                        <line x1="75" y1 = "28" x2 = "75" y2 = "52" stroke = { Colors.Red } strokeWidth = "2" /> <rect x="69" y = "30" width = "12" height = "20" fill = { Colors.Red } />
                            </svg>
    )
},
];
