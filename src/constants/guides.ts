// Risk Management Guides

export const POSITION_SIZING_GUIDES = [
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

export const SCALE_IN_OUT_GUIDES = [
  {
    id: 1,
    icon: '📈',
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
    icon: '🎯',
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
    icon: '🎢',
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
    icon: '⚠️',
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
