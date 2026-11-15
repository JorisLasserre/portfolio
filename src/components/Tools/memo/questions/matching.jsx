import { useState } from 'react';
import { sides, isConfusable } from '../core/deck.js';
import { shuffle } from '../core/random.js';
import { primary, qLabel, question as questionBox, tile, tileKo, tileOk, tileSelected } from '../ui.js';

const HUES = [210, 25, 140, 280, 350];
const bg = (i) => `hsl(${HUES[i % HUES.length]} 85% 90%)`;
const border = (i) => `hsl(${HUES[i % HUES.length]} 60% 50%)`;

export default {
  id: 'matching',
  label: 'Association de paires',
  isAvailable: (deck) => deck.cards.length >= 3,

  create({ deck, card, direction, rng }) {
    // 5 paires max, sans cartes ambiguës entre elles
    const chosen = [card];
    for (const c of shuffle(deck.cards.filter((x) => x.id !== card.id), rng)) {
      if (chosen.length >= 5) break;
      if (chosen.every((x) => !isConfusable(deck, x, c, direction))) chosen.push(c);
    }
    const pairs = shuffle(chosen, rng).map((c) => {
      const s = sides(deck, c, direction);
      return { id: c.id, left: s.prompt, right: s.answer };
    });
    const s0 = sides(deck, card, direction);
    return {
      type: 'matching',
      pairs,
      rightOrder: shuffle(pairs.map((p) => p.id), rng),
      leftLabel: s0.promptLabel,
      rightLabel: s0.answerLabel,
    };
  },

  // answer : { [leftId]: rightId }
  grade(q, answer) {
    const good = q.pairs.filter((p) => answer[p.id] === p.id).length;
    return { score: good / q.pairs.length, correct: good === q.pairs.length };
  },

  summarize(q, answer) {
    const textOf = (id) => q.pairs.find((p) => p.id === id)?.right ?? '—';
    return {
      prompt: 'Associer les paires',
      given: q.pairs.map((p) => `${p.left} → ${textOf(answer[p.id])}`).join('\n'),
      expected: q.pairs.map((p) => `${p.left} → ${p.right}`).join('\n'),
    };
  },

  Component({ question, onSubmit, result }) {
    const [selected, setSelected] = useState(null);
    const [mapping, setMapping] = useState({});

    const rightText = Object.fromEntries(question.pairs.map((p) => [p.id, p.right]));
    const leftIndex = Object.fromEntries(question.pairs.map((p, i) => [p.id, i]));
    const leftOfRight = (rid) => Object.keys(mapping).find((l) => mapping[l] === rid);
    const allPaired = Object.keys(mapping).length === question.pairs.length;

    const clickLeft = (id) => {
      if (result) return;
      if (mapping[id]) {
        setMapping((m) => {
          const { [id]: _removed, ...rest } = m;
          return rest;
        });
        return;
      }
      setSelected(selected === id ? null : id);
    };

    const clickRight = (rid) => {
      if (result) return;
      const owner = leftOfRight(rid);
      if (owner) {
        setMapping((m) => {
          const { [owner]: _removed, ...rest } = m;
          return rest;
        });
        return;
      }
      if (!selected) return;
      setMapping((m) => ({ ...m, [selected]: rid }));
      setSelected(null);
    };

    return (
      <div className={questionBox}>
        <div className={qLabel}>Associe chaque carte à sa correspondance</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-slate-500">{question.leftLabel}</div>
            {question.pairs.map((p) => {
              const paired = !!mapping[p.id];
              const style = paired
                ? { background: bg(leftIndex[p.id]), borderColor: border(leftIndex[p.id]) }
                : undefined;
              let cls = tile;
              if (selected === p.id) cls += ` ${tileSelected}`;
              if (result) cls += mapping[p.id] === p.id ? ` ${tileOk}` : ` ${tileKo}`;
              return (
                <button key={p.id} className={cls} style={result ? undefined : style} onClick={() => clickLeft(p.id)}>
                  {p.left}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-slate-500">{question.rightLabel}</div>
            {question.rightOrder.map((rid) => {
              const owner = leftOfRight(rid);
              const style =
                owner !== undefined
                  ? { background: bg(leftIndex[owner]), borderColor: border(leftIndex[owner]) }
                  : undefined;
              let cls = tile;
              if (result && owner !== undefined) cls += owner === rid ? ` ${tileOk}` : ` ${tileKo}`;
              return (
                <button key={rid} className={cls} style={result ? undefined : style} onClick={() => clickRight(rid)}>
                  {rightText[rid]}
                </button>
              );
            })}
          </div>
        </div>
        {!result && (
          <button className={`${primary} self-start`} disabled={!allPaired} onClick={() => onSubmit(mapping)}>
            Valider
          </button>
        )}
      </div>
    );
  },
};
