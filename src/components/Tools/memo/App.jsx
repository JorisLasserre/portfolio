import { useState } from 'react';
import { builtinDecks } from './data/decks/index.js';
import { loadCustomDecks, saveCustomDecks, resetProgress } from './core/storage.js';
import Home from './screens/Home.jsx';
import LearnMode from './modes/LearnMode.jsx';
import TestMode from './modes/TestMode.jsx';
import { shell } from './ui.js';

export default function App() {
  const [customDecks, setCustomDecks] = useState(loadCustomDecks);
  const [view, setView] = useState({ name: 'home' });
  const decks = [...builtinDecks, ...customDecks];

  const addDeck = (deck) => {
    const next = [...customDecks, deck];
    setCustomDecks(next);
    saveCustomDecks(next);
  };

  const deleteDeck = (id) => {
    if (!window.confirm('Supprimer ce deck ?')) return;
    const next = customDecks.filter((d) => d.id !== id);
    setCustomDecks(next);
    saveCustomDecks(next);
    resetProgress(id);
  };

  const home = () => setView({ name: 'home' });

  let content = (
    <Home
      decks={decks}
      onLearn={(deck) => setView({ name: 'learn', deck })}
      onTest={(deck) => setView({ name: 'test', deck })}
      onImport={addDeck}
      onDelete={deleteDeck}
    />
  );
  if (view.name === 'learn') content = <LearnMode key={view.deck.id} deck={view.deck} onExit={home} />;
  if (view.name === 'test') content = <TestMode key={view.deck.id} deck={view.deck} onExit={home} />;

  return <div className={shell}>{content}</div>;
}
