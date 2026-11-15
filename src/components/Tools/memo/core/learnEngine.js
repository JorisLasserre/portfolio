import { shuffle, sample } from './random.js';
import { getPhases, randomDirection } from './deck.js';

// Moteur du mode "Apprendre" : fonctions pures, sans React ni stockage.
//
// Niveau d'une carte : 0 = nouvelle, 1 = découverte (QCM réussi), 2 = apprise (réponse écrite réussie).
// Une phase = 2 parties :
//   - "discover"    : intro de chaque nouveau mot puis QCM
//   - "consolidate" : réponse écrite (mots de la phase + quelques mots déjà appris)
// Toute erreur remet la carte quelques positions plus loin dans la pile.

const INTRO_GAP = 2;
const REINSERT_GAP = 3;
const REVIEW_COUNT = 4;

export const lv = (levels, card) => levels[card.id] || 0;

export function isPhaseDone(phase, levels) {
  return phase.cards.every((c) => lv(levels, c) >= 2);
}

export function phaseProgress(phase, levels) {
  if (!phase.cards.length) return 0;
  return phase.cards.reduce((s, c) => s + lv(levels, c), 0) / (phase.cards.length * 2);
}
// L'ordre des cartes est mélangé tant que le deck n'a pas été commencé.
// Une fois commencé, on garde l'ordre de la progression sauvegardée.
export function orderedCards(deck, levels, rng = Math.random) {
  const started = Object.keys(levels).length > 0;
  return started ? deck.cards : shuffle(deck.cards, rng);
}

export function deckProgress(deck, levels) {
  const total = deck.cards.length;
  if (!total) return { ratio: 0, mastered: 0, total };
  const sum = deck.cards.reduce((s, c) => s + lv(levels, c), 0);
  const mastered = deck.cards.filter((c) => lv(levels, c) >= 2).length;
  return { ratio: sum / (total * 2), mastered, total };
}

export function firstIncompletePhase(deck, levels) {
  const i = getPhases(deck).findIndex((p) => !isPhaseDone(p, levels));
  return i === -1 ? 0 : i;
}

export function startPhase(deck, phaseIndex, levels, rng = Math.random) {
  return enterPart(deck, { phaseIndex, levels: { ...levels }, part: 'discover', queue: [] }, rng);
}

function enterPart(deck, state, rng) {
  const phases = getPhases(deck);
  const phase = phases[state.phaseIndex];
  const { levels } = state;

  const fresh = phase.cards.filter((c) => lv(levels, c) === 0);
  if (fresh.length) {
    return {
      ...state,
      part: 'discover',
      queue: shuffle(fresh, rng).map((c) => ({
        cardId: c.id,
        step: 'intro',
        direction: randomDirection(deck, rng),
      })),
    };
  }

  const targets = phase.cards.filter((c) => lv(levels, c) === 1);
  if (targets.length) {
    const known = phases
      .slice(0, state.phaseIndex + 1)
      .flatMap((p) => p.cards)
      .filter((c) => lv(levels, c) >= 2);
    const reviews = sample(known, Math.min(REVIEW_COUNT, known.length), rng);
    const items = [
      ...targets.map((c) => ({ cardId: c.id, step: 'question', kind: 'target' })),
      ...reviews.map((c) => ({ cardId: c.id, step: 'question', kind: 'review' })),
    ].map((it) => ({ ...it, direction: randomDirection(deck, rng) }));
    return { ...state, part: 'consolidate', queue: shuffle(items, rng) };
  }

  return { ...state, part: 'complete', queue: [] };
}

// L'utilisateur a lu la fiche d'un nouveau mot : le QCM arrive un peu plus tard.
export function acknowledgeIntro(state) {
  const [head, ...rest] = state.queue;
  const at = Math.min(INTRO_GAP, rest.length);
  const queue = [...rest.slice(0, at), { ...head, step: 'question' }, ...rest.slice(at)];
  return { ...state, queue };
}

export function submitAnswer(deck, state, correct, rng = Math.random) {
  const [head, ...rest] = state.queue;
  let levels = state.levels;
  let queue;

  if (correct) {
    if (state.part === 'discover') {
      levels = { ...levels, [head.cardId]: Math.max(1, levels[head.cardId] || 0) };
    } else if (head.kind === 'target') {
      levels = { ...levels, [head.cardId]: 2 };
    }
    queue = rest;
  } else {
    const at = Math.min(REINSERT_GAP, rest.length);
    queue = [
      ...rest.slice(0, at),
      { ...head, step: 'question', direction: randomDirection(deck, rng) },
      ...rest.slice(at),
    ];
  }

  const next = { ...state, levels, queue };
  return queue.length ? next : enterPart(deck, next, rng);
}
