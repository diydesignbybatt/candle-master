export interface CharacterResult {
  key: string;
  image: string;
  quote: string;
}

interface CharacterDef {
  key: string;
  image: string;
  quote: string;
}

const CHARACTERS: CharacterDef[] = [
  // Tier 0: No trades
  { key: 'spectator', image: 'spectator.webp', quote: 'You just... watched? Incredible strategy.' },
  // Tier 1: > 50%
  { key: 'oracle', image: 'oracle.webp', quote: 'Unbelievable! Are you from the future?!' },
  // Tier 2: > 30%
  { key: 'alpha', image: 'alpha.webp', quote: 'Wall Street wants your number!' },
  // Tier 3: > 20%
  { key: 'whisperer', image: 'whisperer.webp', quote: 'The candles whisper only to you.' },
  // Tier 4: > 10%
  { key: 'lord', image: 'lord.webp', quote: 'Solid gains! You owned those trends.' },
  // Tier 5: > 5%
  { key: 'alchemist', image: 'alchemist.webp', quote: 'Turning charts into gold. Not bad!' },
  // Tier 6: > 2%
  { key: 'smart', image: 'smart.webp', quote: 'Hey, green is green. Take the W.' },
  // Tier 7: -2% to 2%, < 5 trades
  { key: 'monk', image: 'monk.webp', quote: 'Doing nothing was your best move?' },
  // Tier 8: -2% to 2%, >= 5 trades
  { key: 'rider', image: 'rider.webp', quote: 'Break even! You survived... barely.' },
  // Tier 9: -2% to -10%
  { key: 'rookie', image: 'rookie.webp', quote: 'A little rough, but you will bounce back!' },
  // Tier 10: -10% to -20%
  { key: 'hedgehog', image: 'hedgehog.webp', quote: 'Ouch! Time to curl up and rethink.' },
  // Tier 11: -20% to -30%
  { key: 'fighter', image: 'fighter.webp', quote: 'What just happened in there?!' },
  // Tier 12: -30% to -50%
  { key: 'chaos', image: 'chaos.webp', quote: 'Maybe take a break... just a thought.' },
  // Tier 13: < -50%
  { key: 'bagholder', image: 'bagholder.webp', quote: 'Ramen noodles tonight. Stay strong.' },
];

export const getCharacterResult = (pnl: number, trades: number): CharacterResult => {
  let char: CharacterDef;

  if (trades === 0) char = CHARACTERS[0];
  else if (pnl > 50) char = CHARACTERS[1];
  else if (pnl > 30) char = CHARACTERS[2];
  else if (pnl > 20) char = CHARACTERS[3];
  else if (pnl > 10) char = CHARACTERS[4];
  else if (pnl > 5) char = CHARACTERS[5];
  else if (pnl > 2) char = CHARACTERS[6];
  else if (pnl >= -2) char = trades < 5 ? CHARACTERS[7] : CHARACTERS[8];
  else if (pnl > -10) char = CHARACTERS[9];
  else if (pnl > -20) char = CHARACTERS[10];
  else if (pnl > -30) char = CHARACTERS[11];
  else if (pnl > -50) char = CHARACTERS[12];
  else char = CHARACTERS[13];

  return { key: char.key, image: char.image, quote: char.quote };
};
