export interface CharacterResult {
  key: string;
  image: string;
  quote: string;
}

interface CharacterVariant {
  image: string;
  quote: string;
}

interface CharacterTier {
  key: string;
  variants: CharacterVariant[];
}

const CHARACTERS: CharacterTier[] = [
  // Tier 0: No trades
  {
    key: 'spectator',
    variants: [
      { image: 'spectator-1.webp', quote: 'You just... watched? Incredible strategy.' },
      { image: 'spectator-2.webp', quote: 'The market moved. You didn\'t. Fascinating.' },
    ],
  },
  // Tier 1: > 50%
  {
    key: 'oracle',
    variants: [
      { image: 'oracle-1.webp', quote: 'The gods of trading bow before you!' },
      { image: 'oracle-2.webp', quote: 'Dripping in profits. Absolute legend.' },
      { image: 'oracle-3.webp', quote: 'You didn\'t trade — you performed a masterpiece!' },
    ],
  },
  // Tier 2: > 30%
  {
    key: 'alpha',
    variants: [
      { image: 'alpha-1.webp', quote: 'Nobody saw you coming. Pure alpha.' },
      { image: 'alpha-2.webp', quote: 'Champagne profits. Wall Street wants your number.' },
      { image: 'alpha-3.webp', quote: 'This good? You earned a vacation.' },
    ],
  },
  // Tier 3: > 20%
  {
    key: 'whisperer',
    variants: [
      { image: 'whisperer-1.webp', quote: 'The candles whisper only to you.' },
      { image: 'whisperer-2.webp', quote: 'Disciplined like a samurai. Respect.' },
      { image: 'whisperer-3.webp', quote: 'Silent profit. Nobody even saw you trade.' },
    ],
  },
  // Tier 4: > 10%
  {
    key: 'lord',
    variants: [
      { image: 'lord-1.webp', quote: 'Solid gains! Cheers to that!' },
      { image: 'lord-2.webp', quote: 'Double thumbs up. You owned those trends!' },
    ],
  },
  // Tier 5: > 2%
  {
    key: 'smart',
    variants: [
      { image: 'smart-1.webp', quote: 'Hey, green is green. Take the W.' },
      { image: 'smart-2.webp', quote: 'Sipping coffee with profits. Life is good.' },
      { image: 'smart-3.webp', quote: 'Calculated moves. Smart trader detected.' },
    ],
  },
  // Tier 7: -2% to 2%, < 5 trades (monk)
  {
    key: 'monk',
    variants: [
      { image: 'monk-1.webp', quote: 'Patience is a virtue. Or was it fear?' },
      { image: 'monk-2.webp', quote: 'Doing nothing was your best move?' },
    ],
  },
  // Tier 8: -2% to 2%, >= 5 trades (rider)
  {
    key: 'rider',
    variants: [
      { image: 'rider-1.webp', quote: 'Break even! You survived... barely.' },
      { image: 'rider-2.webp', quote: 'One more good trade and you\'d be green!' },
    ],
  },
  // Tier 9: -2% to -10%
  {
    key: 'rookie',
    variants: [
      { image: 'rookie-1.webp', quote: 'A little rough, but you\'ll bounce back!' },
      { image: 'rookie-2.webp', quote: 'The market bit you. Bite it back next time!' },
    ],
  },
  // Tier 10: -10% to -20%
  {
    key: 'hedgehog',
    variants: [
      { image: 'hedgehog-1.webp', quote: 'Ouch! Time to curl up and rethink.' },
      { image: 'hedgehog-2.webp', quote: 'Cutting losses... and maybe your hair too.' },
    ],
  },
  // Tier 11: -20% to -30%
  {
    key: 'fighter',
    variants: [
      { image: 'fighter-1.webp', quote: 'WHAT JUST HAPPENED IN THERE?!' },
      { image: 'fighter-2.webp', quote: 'The chart is spinning... or is that just you?' },
    ],
  },
  // Tier 12: -30% to -50%
  {
    key: 'chaos',
    variants: [
      { image: 'chaos-1.webp', quote: 'Running away with your teddy bear. Smart move.' },
      { image: 'chaos-2.webp', quote: 'The market sucked you dry. Oops.' },
      { image: 'chaos-3.webp', quote: 'Error 404: Profits not found.' },
    ],
  },
  // Tier 13: < -50%
  {
    key: 'bagholder',
    variants: [
      { image: 'bagholder-1.webp', quote: 'Ramen noodles tonight. Stay strong.' },
      { image: 'bagholder-2.webp', quote: 'Your portfolio didn\'t survive. Neither did you.' },
      { image: 'bagholder-3.webp', quote: 'Lost your shirt. Literally.' },
      { image: 'bagholder-4.webp', quote: 'Stress level: hair falling out.' },
    ],
  },
];

// Boss / Crisis Event characters
export const BOSS_CHARACTERS: CharacterVariant[] = [
  { image: 'boss-1.webp', quote: 'A crisis wizard appears! Can you survive?' },
  { image: 'boss-2.webp', quote: 'Ho ho ho! Here\'s a market crash for you!' },
  { image: 'boss-3.webp', quote: 'The market is undead. And so are your losses.' },
  { image: 'boss-4.webp', quote: 'Wild volatility! Hair-raising stuff!' },
  { image: 'boss-5.webp', quote: 'Yeehaw! Riding this bull... or bear?' },
  { image: 'boss-6.webp', quote: 'Stress eating through the crisis? Relatable.' },
];

/** Pick a random item from an array */
const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getCharacterResult = (pnl: number, trades: number): CharacterResult => {
  let tier: CharacterTier;

  if (trades === 0) tier = CHARACTERS[0];
  else if (pnl > 50) tier = CHARACTERS[1];
  else if (pnl > 30) tier = CHARACTERS[2];
  else if (pnl > 20) tier = CHARACTERS[3];
  else if (pnl > 10) tier = CHARACTERS[4];
  else if (pnl > 2) tier = CHARACTERS[5];
  else if (pnl >= -2) tier = trades < 5 ? CHARACTERS[6] : CHARACTERS[7];
  else if (pnl > -10) tier = CHARACTERS[8];
  else if (pnl > -20) tier = CHARACTERS[9];
  else if (pnl > -30) tier = CHARACTERS[10];
  else if (pnl > -50) tier = CHARACTERS[11];
  else tier = CHARACTERS[12];

  const variant = pickRandom(tier.variants);
  return { key: tier.key, image: variant.image, quote: variant.quote };
};

export const getBossCharacter = (): CharacterResult => {
  const variant = pickRandom(BOSS_CHARACTERS);
  return { key: 'boss', image: variant.image, quote: variant.quote };
};
