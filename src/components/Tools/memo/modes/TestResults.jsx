import { useState } from 'react';
import { getType } from '../questions/index.js';
import { toGrade20 } from '../core/testBuilder.js';
import { actionsCenter, linkBtn, panel, primary, review, screen, secondary, secondarySmall, topTitle, topbar } from '../ui.js';

export default function TestResults({ records, onRetry, onExit }) {
  const [overrides, setOverrides] = useState(() => new Set());

  const scoreOf = (r, idx) => (overrides.has(idx) ? 1 : r.grade.score);
  const total = records.reduce((s, r, idx) => s + scoreOf(r, idx), 0);
  const ratio = records.length ? total / records.length : 0;
  const note = toGrade20(ratio);
  const message =
    ratio >= 0.9 ? 'Excellent !' : ratio >= 0.7 ? 'Très bien !' : ratio >= 0.5 ? 'Pas mal, continue !' : 'À retravailler, tu vas y arriver !';

  const claim = (idx) => setOverrides((s) => new Set(s).add(idx));

  return (
    <div className={screen}>
      <header className={topbar}>
        <button className={linkBtn} onClick={onExit}>← Accueil</button>
        <h2 className={topTitle}>Résultats</h2>
      </header>

      <section className={`${panel} items-center text-center`}>
        <div className="text-5xl font-bold text-indigo-600">{note} / 20</div>
        <p>{Math.round(ratio * 100)} % de réussite · {message}</p>
        <div className={actionsCenter}>
          <button className={primary} onClick={onRetry}>Refaire un test</button>
          <button className={secondary} onClick={onExit}>Accueil</button>
        </div>
      </section>

      <section className={panel}>
        <h3 className="text-lg font-semibold">Détail</h3>
        {records.map((r, idx) => {
          const type = getType(r.question.type);
          const s = type.summarize(r.question, r.answer);
          const sc = scoreOf(r, idx);
          const cls = sc === 1 ? review.ok : sc > 0 ? review.close : review.ko;
          return (
            <div key={idx} className={cls}>
              <div className="flex justify-between gap-2 text-sm font-medium">
                <span>{idx + 1}. {type.label}</span>
                <span>{Math.round(sc * 100)} %{overrides.has(idx) ? ' (corrigé)' : ''}</span>
              </div>
              <div className="font-semibold">{s.prompt}</div>
              <div className="text-sm"><em>Ta réponse :</em> <span className="whitespace-pre-wrap">{s.given}</span></div>
              {sc < 1 && <div className="text-sm"><em>Attendu :</em> <span className="whitespace-pre-wrap">{s.expected}</span></div>}
              {type.id === 'written' && sc < 1 && (
                <button className={secondarySmall} onClick={() => claim(idx)}>J'avais raison</button>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
