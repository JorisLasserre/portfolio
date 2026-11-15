import { shuffle, pick } from './random.js';
import { randomDirection } from './deck.js';
import { getType } from '../questions/index.js';

/**
 * Construit un test : `count` questions tirées au hasard parmi les types choisis.
 * Les cartes sont parcourues en boucle (mélangées) pour éviter les doublons tant que possible.
 */
export function buildTest(deck, { count, typeIds }, rng = Math.random) {
  const types = typeIds.map(getType).filter((t) => t && t.isAvailable(deck));
  if (!types.length) return [];

  let order = shuffle(deck.cards, rng);
  let idx = 0;
  const nextCard = () => {
    if (idx >= order.length) {
      order = shuffle(deck.cards, rng);
      idx = 0;
    }
    return order[idx++];
  };

  return Array.from({ length: count }, () => {
    const type = pick(types, rng);
    return type.create({ deck, card: nextCard(), direction: randomDirection(deck, rng), rng });
  });
}

// Note sur 20, arrondie au demi-point.
export function toGrade20(ratio) {
  return Math.round(ratio * 40) / 2;
}
