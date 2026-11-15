import { useState } from 'react';
import { questionTypes, getType } from '../questions/index.js';
import { buildTest } from '../core/testBuilder.js';
import TestResults from './TestResults.jsx';
import { fieldLabel, linkBtn, panel, primary, screen, textInput, topTitle, topbar } from '../ui.js';

export default function TestMode({ deck, onExit }) {
  const available = Object.values(questionTypes).filter((t) => t.isAvailable(deck));
  const [count, setCount] = useState(Math.min(10, Math.max(1, deck.cards.length)));
  const [typeIds, setTypeIds] = useState(available.map((t) => t.id));
  const [stage, setStage] = useState('setup'); // setup | run | done
  const [questions, setQuestions] = useState([]);
  const [records, setRecords] = useState([]);
  const [i, setI] = useState(0);

  const toggleType = (id) =>
    setTypeIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const start = () => {
    setQuestions(buildTest(deck, { count, typeIds }));
    setRecords([]);
    setI(0);
    setStage('run');
  };

  const submit = (answer) => {
    const q = questions[i];
    const type = getType(q.type);
    const next = [...records, { question: q, answer, grade: type.grade(q, answer) }];
    setRecords(next);
    if (i + 1 >= questions.length) setStage('done');
    else setI(i + 1);
  };

  if (stage === 'done') {
    return <TestResults deck={deck} records={records} onRetry={() => setStage('setup')} onExit={onExit} />;
  }

  if (stage === 'run') {
    const q = questions[i];
    const type = getType(q.type);
    return (
      <div className={screen}>
        <header className={topbar}>
          <button className={linkBtn} onClick={onExit}>← Abandonner</button>
          <h2 className={topTitle}>Question {i + 1} / {questions.length}</h2>
        </header>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-indigo-500" style={{ width: `${(i / questions.length) * 100}%` }} />
        </div>
        <section className={panel} key={i}>
          <type.Component question={q} onSubmit={submit} result={null} />
        </section>
      </div>
    );
  }

  return (
    <div className={screen}>
      <header className={topbar}>
        <button className={linkBtn} onClick={onExit}>← Accueil</button>
        <h2 className={topTitle}>Test : {deck.title}</h2>
      </header>
      <section className={panel}>
        <label className={fieldLabel}>
          Nombre de questions
          <input
            className={`${textInput} max-w-xs`}
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
          />
        </label>
        <fieldset className="flex flex-col gap-2 border-0 p-0">
          <legend className="mb-1 text-sm font-semibold">Types de questions</legend>
          {available.map((t) => (
            <label key={t.id} className="flex items-center gap-2 text-sm font-normal">
              <input type="checkbox" className="size-4 accent-indigo-600" checked={typeIds.includes(t.id)} onChange={() => toggleType(t.id)} />
              {t.label}
            </label>
          ))}
        </fieldset>
        <button className={`${primary} self-start`} disabled={!typeIds.length} onClick={start}>Commencer le test</button>
      </section>
    </div>
  );
}
