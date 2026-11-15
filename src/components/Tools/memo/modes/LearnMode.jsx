import { useEffect, useMemo, useState } from 'react';
import { getPhases } from '../core/deck.js';
import {
  startPhase,
  firstIncompletePhase,
  acknowledgeIntro,
  submitAnswer,
  phaseProgress,
  deckProgress,
  isPhaseDone,
} from '../core/learnEngine.js';
import { loadProgress, saveProgress } from '../core/storage.js';
import { questionTypes } from '../questions/index.js';
import ProgressBar from '../components/ProgressBar.jsx';
import FlashCard from '../components/FlashCard.jsx';
import { actions, badge, badgeAlt, badgeMuted, linkBtn, panel, primary, screen, secondary, topTitle, topbar } from '../ui.js';

const CONGRATS = [
  'Bravo, phase terminée !',
  'Excellent travail !',
  'Tu progresses à toute vitesse !',
  'Joli ! Ces mots sont dans la poche.',
];

export default function LearnMode({ deck, onExit }) {
  const phases = useMemo(() => getPhases(deck), [deck]);
  const [session, setSession] = useState(() => {
    const levels = loadProgress(deck.id).levels;
    return startPhase(deck, firstIncompletePhase(deck, levels), levels);
  });
  const [turn, setTurn] = useState(0);
  const [verdict, setVerdict] = useState(null);

  useEffect(() => {
    saveProgress(deck.id, { levels: session.levels });
  }, [deck.id, session.levels]);

  const phase = phases[session.phaseIndex];
  const item = session.queue[0];

  const question = useMemo(() => {
    if (!item || item.step !== 'question') return null;
    const type = session.part === 'discover' ? questionTypes.multipleChoice : questionTypes.written;
    const card = deck.cards.find((c) => c.id === item.cardId);
    return { type, data: type.create({ deck, card, direction: item.direction, rng: Math.random }) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, session.part]);

  const congrats = useMemo(
    () => CONGRATS[Math.floor(Math.random() * CONGRATS.length)],
    [session.phaseIndex]
  );

  const handleSubmit = (answer) => {
    const grade = question.type.grade(question.data, answer);
    setVerdict({ ...grade, answer });
  };

  const next = () => {
    const correct = verdict.correct;
    setSession((s) => submitAnswer(deck, s, correct));
    setVerdict(null);
    setTurn((t) => t + 1);
  };

  const acknowledge = () => {
    setSession((s) => acknowledgeIntro(s));
    setTurn((t) => t + 1);
  };

  const claimRight = () => setVerdict((v) => ({ ...v, correct: true, overridden: true }));

  const goToPhase = (index) => {
    setSession((s) => startPhase(deck, index, s.levels));
    setVerdict(null);
    setTurn((t) => t + 1);
  };

  // Entrée = continuer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Enter' || e.repeat) return;
      if (e.target.tagName === 'BUTTON') return;
      if (item?.step === 'intro') {
        e.preventDefault();
        acknowledge();
      } else if (verdict) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const overall = deckProgress(deck, session.levels);
  const allDone = phases.every((p) => isPhaseDone(p, session.levels));
  const partLabel = session.part === 'discover' ? 'Découverte' : session.part === 'consolidate' ? 'Consolidation' : 'Terminée';

  return (
    <div className={screen}>
      <header className={topbar}>
        <button className={linkBtn} onClick={onExit}>← Accueil</button>
        <h2 className={topTitle}>{deck.title}</h2>
      </header>

      <section className={panel}>
        <div className="flex flex-wrap gap-2">
          <span className={badge}>Phase {session.phaseIndex + 1} / {phases.length}</span>
          <span className={badgeAlt}>{partLabel}</span>
          {session.part !== 'complete' && <span className={badgeMuted}>{session.queue.length} carte(s) restante(s)</span>}
        </div>
        <ProgressBar label={`Phase ${session.phaseIndex + 1}`} value={phaseProgress(phase, session.levels)} />
        <ProgressBar
          label="Deck complet"
          value={overall.ratio}
          detail={`${overall.mastered} / ${overall.total} mots appris`}
          tone="accent"
        />
      </section>

      {session.part === 'complete' && (
        <section className={`${panel} items-center text-center`}>
          <div className="text-5xl">🎉</div>
          <h2 className="text-2xl font-semibold">{congrats}</h2>
          <p>Tu as appris les {phase.cards.length} mots de la phase {session.phaseIndex + 1}.</p>
          {allDone ? (
            <p><strong>Tout le deck est appris, félicitations !</strong></p>
          ) : (
            <button className={primary} onClick={() => goToPhase(session.phaseIndex + 1)}>Phase suivante →</button>
          )}
          <button className={secondary} onClick={onExit}>Retour à l'accueil</button>
        </section>
      )}

      {item?.step === 'intro' && (
        <section className={panel}>
          <FlashCard deck={deck} card={deck.cards.find((c) => c.id === item.cardId)} direction={item.direction} />
          <button className={`${primary} self-start`} onClick={acknowledge}>J'ai compris →</button>
        </section>
      )}

      {question && (
        <section className={panel} key={turn}>
          <question.type.Component question={question.data} onSubmit={handleSubmit} result={verdict} />
          {verdict && (
            <div className={actions}>
              {!verdict.correct && question.type.id === 'written' && (
                <button className={secondary} onClick={claimRight}>J'avais raison</button>
              )}
              <button className={primary} onClick={next}>Continuer ↵</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
