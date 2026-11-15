import { normalize, splitAlternatives } from './text.js';

// Un deck est un simple objet JSON, indépendant du type de contenu :
// {
//   id, title, frontLabel, backLabel,
//   phaseSize?: 10, bidirectional?: true,
//   cards: [{ id, front, back, ...champs futurs (image, explication, tags) }]
// }

export const FTB = 'ftb'; // front -> back
export const BTF = 'btf'; // back -> front

export function sides(deck, card, direction) {
  return direction === BTF
    ? { prompt: card.back, answer: card.front, promptLabel: deck.backLabel, answerLabel: deck.frontLabel }
    : { prompt: card.front, answer: card.back, promptLabel: deck.frontLabel, answerLabel: deck.backLabel };
}

export function randomDirection(deck, rng = Math.random) {
  if (deck.bidirectional === false) return FTB;
  return rng() < 0.5 ? FTB : BTF;
}

// --- Cartes "confondables" -------------------------------------------------
// Dans une liste réelle, deux cartes peuvent partager un sens ("look over" et
// "look into" = "examiner"). Sans précaution, une question aurait alors deux
// bonnes réponses. Ces helpers permettent d'éviter les pièges.

const altSet = (text) => new Set(splitAlternatives(text).map(normalize));
const intersects = (a, b) => [...a].some((x) => b.has(x));

// Les deux cartes posent-elles la même question (au moins une variante commune) ?
export function promptsOverlap(deck, a, b, direction) {
  return intersects(altSet(sides(deck, a, direction).prompt), altSet(sides(deck, b, direction).prompt));
}

// Une carte b serait-elle une réponse valable (ou ambiguë) pour la question de a ?
export function isConfusable(deck, a, b, direction) {
  if (a.id === b.id) return false;
  if (promptsOverlap(deck, a, b, direction)) return true;
  return intersects(altSet(sides(deck, a, direction).answer), altSet(sides(deck, b, direction).answer));
}

// Réponse attendue pour une question, en incluant celles des cartes qui posent la même question.
export function acceptedAnswer(deck, card, direction) {
  const answers = deck.cards
    .filter((c) => c.id === card.id || promptsOverlap(deck, card, c, direction))
    .map((c) => sides(deck, c, direction).answer);
  return [...new Set(answers)].join(' ; ');
}

export function getPhases(deck) {
  const size = deck.phaseSize || 10;
  const phases = [];
  for (let i = 0; i < deck.cards.length; i += size) {
    phases.push({
      index: phases.length,
      title: `Phase ${phases.length + 1}`,
      cards: deck.cards.slice(i, i + size),
    });
  }
  return phases;
}

/**
 * Valide et normalise un deck importé depuis un fichier JSON.
 * @returns {{deck: object} | {error: string}}
 */
export function validateDeck(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: 'Le fichier doit contenir un objet JSON (un deck).' };
  }
  if (!Array.isArray(raw.cards) || raw.cards.length < 2) {
    return { error: 'Le deck doit contenir au moins 2 cartes dans "cards".' };
  }

  const seen = new Set();
  const cards = [];
  for (let i = 0; i < raw.cards.length; i++) {
    const c = raw.cards[i];
    const front = typeof c?.front === 'string' ? c.front.trim() : '';
    const back = typeof c?.back === 'string' ? c.back.trim() : '';
    if (!front || !back) {
      return { error: `Carte n°${i + 1} invalide : "front" et "back" doivent être des textes non vides.` };
    }
    let id = c.id != null ? String(c.id) : String(i + 1);
    while (seen.has(id)) id += `-${i + 1}`;
    seen.add(id);
    cards.push({ ...c, id, front, back });
  }

  const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : 'Ma liste';
  const size = Number.parseInt(raw.phaseSize, 10);

  return {
    deck: {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title,
      frontLabel: typeof raw.frontLabel === 'string' && raw.frontLabel.trim() ? raw.frontLabel.trim() : 'Recto',
      backLabel: typeof raw.backLabel === 'string' && raw.backLabel.trim() ? raw.backLabel.trim() : 'Verso',
      phaseSize: Number.isFinite(size) && size >= 2 ? size : 10,
      bidirectional: raw.bidirectional !== false,
      custom: true,
      cards,
    },
  };
}
