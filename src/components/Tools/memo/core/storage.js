// Persistance locale (localStorage). Isolée ici pour pouvoir la remplacer
// plus tard (API, fichier, base de données…).

const progressKey = (deckId) => `memo:progress:${deckId}`;
const DECKS_KEY = 'memo:customDecks';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage plein ou indisponible : on ignore */
  }
}

export const loadProgress = (deckId) => read(progressKey(deckId), { levels: {} });
export const saveProgress = (deckId, progress) => write(progressKey(deckId), progress);
export const resetProgress = (deckId) => localStorage.removeItem(progressKey(deckId));

export const loadCustomDecks = () => read(DECKS_KEY, []);
export const saveCustomDecks = (decks) => write(DECKS_KEY, decks);
