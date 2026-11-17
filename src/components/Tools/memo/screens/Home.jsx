import { useRef, useState } from 'react';
import promptUrl from '../Prompt.md?url';
import { validateDeck, getPhases } from '../core/deck.js';
import { deckProgress } from '../core/learnEngine.js';
import { loadProgress, resetProgress } from '../core/storage.js';
import ProgressBar from '../components/ProgressBar.jsx';
import { actions, feedback, linkBtn, muted, panel, primary, screen, secondary } from '../ui.js';

function ImportPanel({ onImport }) {
  const inputRef = useRef(null);
  const [message, setMessage] = useState(null); // { ok: boolean, text: string }

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    let raw;
    try {
      raw = JSON.parse(await file.text());
    } catch {
      setMessage({ ok: false, text: 'Fichier illisible : ce n\'est pas du JSON valide.' });
      return;
    }
    const res = validateDeck(raw);
    if (res.error) {
      setMessage({ ok: false, text: res.error });
      return;
    }
    onImport(res.deck);
    setMessage({ ok: true, text: `Deck « ${res.deck.title} » importé (${res.deck.cards.length} cartes).` });
  };

  return (
    <section className={panel}>
      <h3 className="text-lg font-semibold">Importer un deck</h3>
      <p className={muted}>
        Fichier <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em]">.json</code> généré avec le prompt fourni (voir{' '}
        <a href={promptUrl} download="Prompt.md" className="font-medium text-indigo-600 underline hover:text-indigo-800">
          Prompt.md
        </a>).
      </p>
      <input ref={inputRef} type="file" accept=".json,application/json" onChange={handleFile} hidden />
      <div className={actions}>
        <button className={primary} onClick={() => inputRef.current?.click()}>📁 Choisir un fichier JSON</button>
      </div>
      {message && <div className={message.ok ? feedback.ok : feedback.ko}>{message.text}</div>}
    </section>
  );
}

export default function Home({ decks, onLearn, onTest, onImport, onDelete }) {
  const [, force] = useState(0);

  const reset = (deck) => {
    if (window.confirm(`Réinitialiser la progression de « ${deck.title} » ?`)) {
      resetProgress(deck.id);
      force((n) => n + 1);
    }
  };

  return (
    <div className={screen}>
      <header className="mb-2 text-center">
        <h1 className="text-4xl font-bold">Mémo</h1>
        <p className="mt-2 text-slate-600">Apprends et révise tes listes, phase par phase.</p>
      </header>

      {decks.map((deck) => {
        const p = deckProgress(deck, loadProgress(deck.id).levels);
        return (
          <section key={deck.id} className={panel}>
            <h3 className="text-lg font-semibold">{deck.title}</h3>
            <p className={muted}>{deck.cards.length} cartes · {getPhases(deck).length} phases</p>
            <ProgressBar label="Progression" value={p.ratio} detail={`${p.mastered} / ${p.total} appris`} tone="accent" />
            <div className={actions}>
              <button className={primary} onClick={() => onLearn(deck)}>📖 Apprendre</button>
              <button className={secondary} onClick={() => onTest(deck)}>📝 Tester</button>
              <button className={linkBtn} onClick={() => reset(deck)}>↺ Réinitialiser</button>
              {deck.custom && <button className={`${linkBtn} text-red-600`} onClick={() => onDelete(deck.id)}>🗑 Supprimer</button>}
            </div>
          </section>
        );
      })}

      <ImportPanel onImport={onImport} />
    </div>
  );
}
