// Type de carte : 'notion' par défaut (compatibilité avec les anciens decks).
export const kindOf = (card) => card.kind ?? 'notion';

// Seules les cartes « notion » servent de distracteurs aux QCM / associations.
export const notionCards = (deck) => deck.cards.filter((c) => kindOf(c) === 'notion');