// Money Management Academy Guides

// ============================================
// INTERFACES
// ============================================

export interface RiskCategoryConfig {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
}

// ============================================
// CATEGORY REGISTRY
// ============================================

export const RISK_CATEGORIES: RiskCategoryConfig[] = [
  { key: 'sizing', icon: 'PieChart', title: 'Position Sizing', subtitle: 'How much to risk per trade' },
  { key: 'stoploss', icon: 'ShieldAlert', title: 'Stop Loss Strategy', subtitle: 'Protecting your capital' },
  { key: 'riskReward', icon: 'Scale', title: 'Risk-Reward Ratio', subtitle: 'Making math work for you' },
  { key: 'drawdown', icon: 'TrendingDown', title: 'Drawdown Management', subtitle: 'Surviving losing streaks' },
  { key: 'diversification', icon: 'GitFork', title: 'Diversification', subtitle: 'Spreading your risk' },
  { key: 'psychology', icon: 'Brain', title: 'Trading Psychology', subtitle: 'Mastering your emotions' },
  { key: 'preservation', icon: 'Vault', title: 'Capital Preservation', subtitle: 'Survival is priority #1' },
  { key: 'tradingPlan', icon: 'ClipboardList', title: 'Trading Plan', subtitle: 'Your blueprint for success' },
  { key: 'scaling', icon: 'Layers', title: 'Scale In/Out', subtitle: 'Build & exit positions smartly' },
];

// ============================================
// POSITION SIZING (existing)
// ============================================

export const POSITION_SIZING_GUIDES = [
  {
    id: 1,
    icon: 'Lightbulb',
    title: 'Position Sizing Basics',
    content: `Never risk more than 1-2% of your portfolio on a single trade. This protects you from devastating losses and keeps you in the game long-term. Even professionals rarely risk more than 5%.`,
    keyPoint: 'Small losses are recoverable. Large losses are not.'
  },
  {
    id: 2,
    icon: 'Target',
    title: 'Setting Stop Loss',
    content: `Your stop loss should be based on technical levels, not random numbers. Place it below support (for long) or above resistance (for short).`,
    bullets: ['Below recent swing low', 'Below key moving average', '1-2 ATR from entry', 'Below pattern breakout level'],
    dosDonts: { dont: "Set stop based on how much you want to lose", do: "Let price action determine your stop" }
  },
  {
    id: 3,
    icon: 'Scale',
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
    icon: 'GitFork',
    title: 'Portfolio Diversification',
    content: `Don't put all eggs in one basket—even if you're confident.`,
    bullets: ['3-5 positions = Good diversification', 'Max 20-30% in single trade', 'Spread across different sectors', 'Mix timeframes (swing + position)'],
    keyPoint: 'One bad trade shouldn\'t hurt your entire portfolio.'
  },
  {
    id: 5,
    icon: 'Zap',
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

// ============================================
// SCALE IN/OUT (existing)
// ============================================

export const SCALE_IN_OUT_GUIDES = [
  {
    id: 1,
    icon: 'TrendingUp',
    title: 'What & Why',
    subtitle: 'Scale In/Scale Out Explained',
    content: null,
    scaleExplanation: {
      scaleIn: { label: 'Scale In', desc: 'Building positions gradually', visual: 'Buy → Buy → Buy (on the way down)' },
      scaleOut: { label: 'Scale Out', desc: 'Taking profits gradually', visual: 'Sell → Sell → Sell (on the way up)' }
    },
    benefits: [
      'No need to time the perfect entry',
      'Average cost smooths out volatility',
      'Lock profits while staying in trend',
      'Less emotional stress',
      'Better risk management'
    ]
  },
  {
    id: 2,
    icon: 'Target',
    title: 'When to Scale In',
    subtitle: 'Build Your Position Smart',
    content: 'Scale In when you see:',
    bullets: [
      'Strong trend but price is ranging',
      'Approaching key support zone',
      'High conviction, medium confidence',
      'Volatile market conditions'
    ],
    scaleExample: {
      title: 'Target stock at $50',
      steps: [
        { action: '1st buy', percent: '30%', price: '$51' },
        { action: '2nd buy', percent: '40%', price: '$49' },
        { action: '3rd buy', percent: '30%', price: '$47' }
      ],
      result: 'Average entry: $49 ✓'
    }
  },
  {
    id: 3,
    icon: 'Waves',
    title: 'Trend Follower Pro Tips',
    subtitle: 'Scale In on Pullbacks',
    content: null,
    pullbackInfo: {
      intro: "Why pullbacks are opportunities:",
      reasons: [
        "Healthy trends don't go straight up",
        "They move in waves",
        "Pullbacks let you add at better prices"
      ]
    },
    qualityChecklist: [
      'Trend structure still intact',
      'Pullback 30-50% of last move',
      'Volume decreases on pullback',
      'Bullish pattern forms at support',
      'Key support level holds'
    ],
    redFlags: [
      'Trend line broken',
      'Heavy selling volume',
      'No bullish reversal pattern',
      'Breaks below major support'
    ]
  },
  {
    id: 4,
    icon: 'AlertTriangle',
    title: 'Critical Rules',
    subtitle: 'Avoid These Mistakes',
    content: null,
    rules: {
      never: [
        'Scale into a losing position',
        '"Averaging down" on bad trades',
        'Add more when trend breaks'
      ],
      always: [
        'Plan scale points BEFORE entry',
        'Keep total position size in check',
        'Follow your original strategy',
        'Cut losses, not add to them'
      ]
    },
    keyPoint: 'Scale in = Building winners, NOT = Saving losers'
  }
];

// ============================================
// STOP LOSS STRATEGY (new)
// ============================================

export const STOP_LOSS_GUIDES = [
  {
    id: 1,
    icon: 'ShieldAlert',
    title: 'Why Stop Loss Matters',
    content: `A stop loss is your safety net. It automatically exits a trade when price moves against you, preventing small losses from becoming account-destroying disasters.`,
    bullets: [
      'Protects capital from unexpected moves',
      'Removes emotion from exit decisions',
      'Lets you sleep at night',
      'Professional traders ALWAYS use them'
    ],
    keyPoint: 'A trade without a stop loss is just gambling.'
  },
  {
    id: 2,
    icon: 'Ruler',
    title: 'Types of Stop Loss',
    content: `Different market conditions call for different stop types. Choose the one that fits your strategy.`,
    bullets: [
      'Fixed Stop — set at a specific price, never moves',
      'Trailing Stop — follows price as it moves in your favor',
      'Time-based Stop — exit if trade hasn\'t moved after X days',
      'Volatility Stop — based on ATR (adapts to market conditions)'
    ],
    proTips: [
      'Use trailing stops in strong trends to lock profits',
      'Use fixed stops for range-bound markets',
      'Time-based stops prevent capital from sitting idle'
    ]
  },
  {
    id: 3,
    icon: 'MapPin',
    title: 'Where to Place Stops',
    content: `Your stop should be at a level where your trade idea is proven wrong — not just a random number.`,
    bullets: [
      'Below recent swing low (for long trades)',
      'Above recent swing high (for short trades)',
      'Below key support / moving average',
      '1-2 ATR from your entry price'
    ],
    dosDonts: { dont: 'Place stops at round numbers where everyone else does', do: 'Place just beyond key technical levels' },
    keyPoint: 'If the stop is hit, the trade idea was wrong. Accept it and move on.'
  },
  {
    id: 4,
    icon: 'XCircle',
    title: 'Common Mistakes',
    content: `Most beginners lose money not because of bad entries, but because of poor stop loss management.`,
    bullets: [
      'Moving your stop further away to "give it room"',
      'Setting stops too tight (getting stopped out by noise)',
      'Not using a stop loss at all',
      'Removing stops during high volatility'
    ],
    warnings: [
      'Moving your stop = changing your risk without changing your plan',
      'If you keep getting stopped out, your entry or stop placement needs work — not wider stops'
    ]
  }
];

// ============================================
// RISK-REWARD RATIO (new)
// ============================================

export const RISK_REWARD_GUIDES = [
  {
    id: 1,
    icon: 'Scale',
    title: 'Understanding R:R',
    content: `Risk-Reward Ratio compares how much you risk vs. how much you expect to gain. A 1:2 ratio means risking $1 to potentially make $2.`,
    examples: [
      { ratio: '1:1', winRate: 'Need 50% win rate to breakeven' },
      { ratio: '1:2', winRate: 'Need 33% win rate to profit' },
      { ratio: '1:3', winRate: 'Need 25% win rate to profit' }
    ],
    keyPoint: 'With 1:3 ratio, you can be wrong 3 out of 4 times and STILL make money.'
  },
  {
    id: 2,
    icon: 'Search',
    title: 'Finding Good Setups',
    content: `Not every trade deserves your money. Only take trades where the potential reward clearly outweighs the risk.`,
    bullets: [
      'Identify entry point, stop loss, and target BEFORE entering',
      'Calculate R:R before clicking buy/sell',
      'Skip trades with R:R less than 1:2',
      'Look for confluence — multiple reasons to enter'
    ],
    proTips: [
      'The best setups often come after patience, not urgency',
      'A missed trade is better than a bad trade',
      'Quality setups > quantity of trades'
    ]
  },
  {
    id: 3,
    icon: 'BarChart3',
    title: 'R:R in Practice',
    subtitle: 'The Expectancy Formula',
    content: `Expectancy = (Win Rate x Avg Win) - (Loss Rate x Avg Loss). Positive expectancy = profitable system over time.`,
    bullets: [
      '60% win rate + 1:1 R:R = Profitable',
      '40% win rate + 1:2 R:R = Profitable',
      '30% win rate + 1:3 R:R = Profitable',
      '80% win rate + 1:0.5 R:R = Barely breakeven'
    ],
    keyPoint: 'High win rate with small R:R can be worse than low win rate with large R:R.',
    proTips: [
      'Track your actual R:R over 20+ trades',
      'Your real numbers matter more than your plan',
      'Adjust strategy based on data, not feelings'
    ]
  }
];

// ============================================
// DRAWDOWN MANAGEMENT (new)
// ============================================

export const DRAWDOWN_GUIDES = [
  {
    id: 1,
    icon: 'TrendingDown',
    title: 'What is Drawdown',
    content: `Drawdown is the decline from your portfolio's peak to its lowest point. Understanding recovery math is critical for survival.`,
    examples: [
      { ratio: '-10%', winRate: 'Need +11% to recover' },
      { ratio: '-25%', winRate: 'Need +33% to recover' },
      { ratio: '-50%', winRate: 'Need +100% to recover' },
      { ratio: '-75%', winRate: 'Need +300% to recover' }
    ],
    keyPoint: 'The math of recovery is brutal. Prevention is always better than cure.',
    warnings: ['A 50% loss requires a 100% gain just to get back to breakeven']
  },
  {
    id: 2,
    icon: 'Pause',
    title: 'Surviving Losing Streaks',
    content: `Every trader faces losing streaks. What separates winners from losers is how they handle them.`,
    bullets: [
      'Reduce position size by 50% after 3 consecutive losses',
      'Take a 1-2 day break to clear your mind',
      'Review your recent trades objectively',
      'Never increase size to "make it back"'
    ],
    dosDonts: { dont: 'Revenge trade or double down after losses', do: 'Slow down, reduce size, and review your process' },
    proTips: [
      'Losing streaks are normal — even the best have them',
      'Your job during a streak is to survive, not to win',
      'Paper trade for a few days to rebuild confidence'
    ]
  },
  {
    id: 3,
    icon: 'CircleStop',
    title: 'Recovery Rules',
    subtitle: 'Know When to Stop',
    content: `Set hard rules for maximum losses. When you hit them, stop trading — no exceptions.`,
    bullets: [
      'Max daily loss: 2-3% of portfolio',
      'Max weekly loss: 5-6% of portfolio',
      'Max monthly loss: 10% of portfolio',
      'Hit the limit = done for that period'
    ],
    keyPoint: 'Circuit breakers protect you from yourself on your worst days.',
    proTips: [
      'Write these rules down and put them where you can see them',
      'Tell someone your rules so they hold you accountable',
      'After a break, start with half your normal size'
    ]
  }
];

// ============================================
// DIVERSIFICATION (new)
// ============================================

export const DIVERSIFICATION_GUIDES = [
  {
    id: 1,
    icon: 'Shuffle',
    title: 'Why Diversify',
    content: `Diversification reduces the impact of any single trade or sector going wrong. It's your insurance against the unexpected.`,
    bullets: [
      'Spread risk across different stocks/sectors',
      'No single trade should make or break your portfolio',
      'Different sectors react differently to news',
      'Correlation matters — "diversified" isn\'t always diversified'
    ],
    keyPoint: 'Diversification is the only free lunch in investing.',
    proTips: [
      'Tech stocks often move together — owning 5 tech stocks isn\'t true diversification',
      'Mix growth and value, large and small caps',
      'Consider different timeframes too (swing + position)'
    ]
  },
  {
    id: 2,
    icon: 'Gauge',
    title: 'Position Limits',
    subtitle: 'Portfolio Heat Management',
    content: `"Portfolio heat" is the total risk of all your open positions combined. Keep it under control.`,
    bullets: [
      'Max 3-5 open positions at a time',
      'Max 20-30% of capital in a single trade',
      'Total portfolio heat: under 6-10%',
      'Correlated positions count as higher risk'
    ],
    dosDonts: { dont: 'Hold 10 positions in the same sector', do: 'Spread across uncorrelated markets and sectors' },
    keyPoint: 'More positions doesn\'t mean more diversified. Quality of diversification matters.'
  }
];

// ============================================
// TRADING PSYCHOLOGY (new)
// ============================================

export const PSYCHOLOGY_GUIDES = [
  {
    id: 1,
    icon: 'AlertTriangle',
    title: 'Fear and Greed',
    content: `Fear and greed are your biggest enemies. Fear makes you exit too early or skip good trades. Greed makes you hold too long or overtrade.`,
    bullets: [
      'Fear of losing makes you move stops or exit early',
      'Fear of missing out (FOMO) makes you chase trades',
      'Greed makes you ignore exit signals',
      'Greed makes you risk too much per trade'
    ],
    keyPoint: 'The market rewards discipline, not emotion.',
    proTips: [
      'Write down why you entered BEFORE you enter',
      'Set alerts instead of watching every tick',
      'If you feel anxious, your position is too large'
    ]
  },
  {
    id: 2,
    icon: 'Target',
    title: 'Discipline',
    subtitle: 'Sticking to the Plan',
    content: `Discipline is doing what your plan says, even when your emotions scream otherwise. It's the #1 skill that separates profitable traders.`,
    bullets: [
      'Follow your entry and exit rules every time',
      'Don\'t override your system based on "gut feeling"',
      'Accept that some trades will lose — that\'s normal',
      'Consistency beats perfection',
      'You don\'t need to fight every battle to win the war'
    ],
    keyPoint: 'Patient waiting is the most important trait of a smart trader. The best trade is often no trade.',
    proTips: [
      'Use a pre-trade checklist before every entry',
      'Rate your discipline 1-10 after each trade',
      'Reward yourself for following the plan, not for profits',
      'No setup today? That\'s a win — you protected your capital'
    ]
  },
  {
    id: 3,
    icon: 'HeartCrack',
    title: 'Handling Losses',
    content: `Losses are the cost of doing business. Every professional trader loses regularly. The difference is how they respond.`,
    bullets: [
      'Accept losses as part of the business',
      'Never revenge trade after a loss',
      'Don\'t take losses personally',
      'Analyze the loss objectively — was the process right?'
    ],
    dosDonts: { dont: 'Immediately enter another trade to "make it back"', do: 'Walk away, review later with a clear head' },
    keyPoint: 'A good trade can still be a losing trade. Judge your process, not the outcome.'
  },
  {
    id: 4,
    icon: 'Sparkles',
    title: 'Mental Edge',
    subtitle: 'Building Psychological Strength',
    content: `Trading is a mental game. Your edge isn't just in your strategy — it's in your mental preparation and self-awareness. Mindfulness brings your thoughts back to the present moment — a skill that transforms trading decisions.`,
    bullets: [
      'Keep a trading journal to track emotions',
      'Build a consistent daily routine',
      'Know your triggers — what makes you break rules?',
      'Set rules for when NOT to trade',
      'Practice mindfulness — awareness is your greatest tool'
    ],
    keyPoint: 'When mind and awareness become one, clarity follows. Train your mind daily, and your trading will transform.',
    proTips: [
      'Try Box Breathing: inhale 4s → hold 4s → exhale 4s → hold 4s',
      'Start with 5 minutes of breath awareness daily, then gradually increase',
      'Before every trade, take 3 deep breaths to center yourself',
      'Don\'t trade when tired, angry, or after big news',
      'Review your journal weekly — patterns will emerge'
    ]
  }
];

// ============================================
// CAPITAL PRESERVATION (new)
// ============================================

export const PRESERVATION_GUIDES = [
  {
    id: 1,
    icon: 'Landmark',
    title: 'Survival First',
    content: `The #1 rule of trading: don't go broke. You can't compound gains if you blow up your account. Survival always comes before profits.`,
    bullets: [
      'Protecting capital > making profits',
      'You need capital to take advantage of opportunities',
      'Compounding works only if you stay in the game',
      'One reckless trade can wipe out months of work'
    ],
    keyPoint: 'The first rule of trading is: don\'t lose your capital. The second rule is: don\'t forget rule #1.',
    proTips: [
      'Think of each trade as a small business expense',
      'Ask yourself: "Will this trade risk my ability to trade tomorrow?"',
      'The best traders are boring — they survive'
    ]
  },
  {
    id: 2,
    icon: 'ShieldCheck',
    title: 'Practical Rules',
    subtitle: 'Your Safety Circuit Breakers',
    content: `Set hard limits and follow them without exception. These rules protect you from your worst impulses.`,
    bullets: [
      'Risk max 1-2% per trade',
      'Max daily loss limit: 3% of portfolio',
      'Max weekly loss limit: 5% of portfolio',
      'If you hit the limit, walk away — no exceptions'
    ],
    warnings: [
      'Breaking your own rules is the fastest path to ruin',
      'Rules feel unnecessary until the day they save you'
    ],
    proTips: [
      'Automate your stops so emotions can\'t interfere',
      'Tell a friend or mentor your rules for accountability',
      'After hitting a limit, use the break to review and improve'
    ]
  }
];

// ============================================
// TRADING PLAN (new)
// ============================================

export const TRADING_PLAN_GUIDES = [
  {
    id: 1,
    icon: 'ClipboardList',
    title: 'Why You Need a Plan',
    content: `A trading plan removes emotion from your decisions. Without one, you're reacting to the market instead of executing a strategy.`,
    bullets: [
      'Provides consistency in your approach',
      'Prevents impulsive decisions',
      'Makes your results measurable and improvable',
      'Separates you from 90% of losing traders'
    ],
    keyPoint: 'Traders without a plan are just funding the accounts of traders who have one.',
    proTips: [
      'Write your plan down — a plan in your head isn\'t a plan',
      'Start simple — you can refine it over time',
      'Review and update your plan monthly'
    ]
  },
  {
    id: 2,
    icon: 'Puzzle',
    title: 'Key Components',
    subtitle: 'What Your Plan Should Cover',
    content: `Every trading plan should answer these essential questions before you risk real money.`,
    bullets: [
      'Entry Rules — what signals trigger a trade?',
      'Exit Rules — when do you take profit or cut loss?',
      'Position Sizing — how much per trade?',
      'Market Conditions — when to trade and when to sit out?',
      'Timeframe — daily, weekly, or intraday?',
      'Instruments — which stocks/markets to focus on?'
    ],
    proTips: [
      'If you can\'t explain your rules in simple sentences, simplify them',
      'Fewer rules, strictly followed > many rules, sometimes followed',
      'Your plan should tell you what NOT to do, too'
    ]
  },
  {
    id: 3,
    icon: 'RefreshCw',
    title: 'Building Your System',
    subtitle: 'From Plan to Daily Routine',
    content: `A great plan needs a great routine. Systematic trading means making decisions at fixed times with a clear process.`,
    bullets: [
      'Set a fixed time each day to review charts',
      'Use end-of-day data to avoid noise and false signals',
      'Follow: Review → Decide → Execute → Step Away',
      'Track every trade in a journal with entry reason and result'
    ],
    dosDonts: { dont: 'Stare at charts all day reacting to every move', do: 'Check once or twice daily, make decisions, then walk away' },
    keyPoint: 'The best trading systems are boring. Excitement is the enemy of consistency.',
    proTips: [
      'Morning: Review overnight changes + plan today\'s actions',
      'After close: Log trades, review results, prepare tomorrow',
      'Weekly: Analyze performance, adjust if needed',
      'Monthly: Review your overall strategy and plan'
    ]
  }
];

// ============================================
// GUIDE LOOKUP MAP
// ============================================

export const RISK_GUIDE_MAP: Record<string, any[]> = {
  sizing: POSITION_SIZING_GUIDES,
  scaling: SCALE_IN_OUT_GUIDES,
  stoploss: STOP_LOSS_GUIDES,
  riskReward: RISK_REWARD_GUIDES,
  drawdown: DRAWDOWN_GUIDES,
  diversification: DIVERSIFICATION_GUIDES,
  psychology: PSYCHOLOGY_GUIDES,
  preservation: PRESERVATION_GUIDES,
  tradingPlan: TRADING_PLAN_GUIDES,
};
