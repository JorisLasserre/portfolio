import { shuffle, pick } from './random.js';
import { randomDirection } from './deck.js';
import { getType, typeForCard } from '../questions/index.js';

/**
 * Construit un test : `count` questions. Pour chaque question, un type choisi
 * parmi ceux demandés est tiré, puis une carte compatible avec ce type.
 */
export function buildTest(deck, { count, typeIds }, rng = Math.random) {
  const pools = {};
  for (const id of typeIds) {
    const type = getType(id);
    if (!type || !type.isAvailable(deck)) continue;
    const cards = deck.cards.filter((c) => typeForCard(c, id) === type);
    if (cards.length) pools[id] = { type, cards: shuffle(cards, rng), idx: 0 };
  }

  const ids = Object.keys(pools);
  if (!ids.length) return [];

  // Parcourt chaque pool en boucle, mélangé, pour limiter les doublons.
  const nextCard = (pool) => {
    if (pool.idx >= pool.cards.length) {
      pool.cards = shuffle(pool.cards, rng);
      pool.idx = 0;
    }
    return pool.cards[pool.idx++];
  };

  return Array.from({ length: count }, () => {
    const pool = pools[pick(ids, rng)];
    const card = nextCard(pool);
    return pool.type.create({ deck, card, direction: randomDirection(deck, rng), rng });
  });
}

// Note sur 20, arrondie au demi-point.
export function toGrade20(ratio) {
  return Math.round(ratio * 40) / 2;
}