import { sumArrayValues } from './support/array';
import { withInput } from './support/io';
import { strToInt } from './support/number';

const demoInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

enum HandType {
  FiveOfKind,
  FourOfKind,
  FullHouse,
  ThreeOfKind,
  TwoPairs,
  Pair,
  HighCard,
}

type HandBid = {
  hand: string;
  bid: number;
  index: number;
};

const computeHand = (hand: string): HandType => {
  const countPerCard: Record<string, number> = {};

  hand.split('').forEach((card) => {
    if (!(card in countPerCard)) {
      countPerCard[card] = 0;
    }

    countPerCard[card] += 1;
  });

  const cardsCount = Object.values(countPerCard);
  const differentCardsCount = cardsCount.length;

  if (differentCardsCount === 1) {
    return HandType.FiveOfKind;
  }

  if (differentCardsCount === 2) {
    return cardsCount.includes(4) ? HandType.FourOfKind : HandType.FullHouse;
  }

  if (differentCardsCount === 3) {
    return cardsCount.includes(3) ? HandType.ThreeOfKind : HandType.TwoPairs;
  }

  return differentCardsCount === 4 ? HandType.Pair : HandType.HighCard;
};

const tranformCardToNumber = (card: string) => {
  switch (card) {
    case 'A':
      return 100;
    case 'K':
      return 90;
    case 'Q':
      return 80;
    case 'J':
      return 70;
    case 'T':
      return 60;
    default:
      return strToInt(card);
  }
};

const compareDrawHands = (a: HandBid['hand'], b: HandBid['hand']) => {
  for (let i = 0; i <= a.length; i += 1) {
    if (a[i] === b[i]) {
      continue;
    }

    return tranformCardToNumber(b[i]) - tranformCardToNumber(a[i]);
  }

  return 0;
};

withInput(async (input) => {
  const hands: HandBid[] = input.split('\n').map((data) => {
    const [hand, bid] = data.trim().split(' ');

    return { hand, bid: strToInt(bid), index: computeHand(hand) };
  });

  hands.sort((a, b) => {
    const indexDiff = a.index - b.index;

    if (indexDiff !== 0) {
      return indexDiff;
    }

    return compareDrawHands(a.hand, b.hand);
  });

  let rank = hands.length;
  const scores = hands.map((hand) => {
    const score = hand.bid * rank;
    rank -= 1;
    return score;
  });

  return sumArrayValues(scores).toString();
}, demoInput);
