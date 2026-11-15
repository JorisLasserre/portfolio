import { useState } from 'react';
import { sides, isConfusable } from '../core/deck.js';
import { shuffle } from '../core/random.js';
import { option, optionKo, optionOk, qLabel, qPrompt, question as questionBox } from '../ui.js';
import { notionCards } from '../core/kind.js';
export default {
  id: 'trueFalse',
  label: 'Vrai / Faux',
  isAvailable: (deck) => notionCards(deck).length >= 2,

  create({ deck, card, direction, rng }) {
    const s = sides(deck, card, direction);
    const isTrue = rng() < 0.5;
    let proposed = s.answer;
    if (!isTrue) {
      const other = shuffle(
        notionCards(deck).filter((c) => c.id !== card.id && !isConfusable(deck, card, c, direction)),
        rng
      )[0];
      if (other) proposed = sides(deck, other, direction).answer;
    }
    return {
      type: 'trueFalse',
      cardId: card.id,
      prompt: s.prompt,
      promptLabel: s.promptLabel,
      answerLabel: s.answerLabel,
      proposed,
      isTrue: proposed === s.answer,
      expected: s.answer,
    };
  },

  grade(q, answer) {
    const correct = answer === q.isTrue;
    return { score: correct ? 1 : 0, correct };
  },

  summarize(q, answer) {
    return {
      prompt: `${q.prompt} = ${q.proposed} ?`,
      given: answer ? 'Vrai' : 'Faux',
      expected: q.isTrue ? 'Vrai' : `Faux (${q.expected})`,
    };
  },

  Component({ question, onSubmit, result }) {
    const [picked, setPicked] = useState(null);

    const choose = (e, value) => {
      if (result || picked !== null) return;
      e.currentTarget.blur();
      setPicked(value);
      onSubmit(value);
    };

    const cls = (value) => {
      if (result && value === question.isTrue) return optionOk;
      if (result && value === picked) return optionKo;
      return option;
    };

    return (
      <div className={questionBox}>
        <div className={qLabel}>Vrai ou faux ?</div>
        <div className={qPrompt}>{question.prompt}</div>
        <div className="text-center text-sm text-slate-400">signifie</div>
        <div className={qPrompt}>{question.proposed}</div>
        <div className="grid grid-cols-2 gap-2">
          <button className={cls(true)} onClick={(e) => choose(e, true)}>Vrai</button>
          <button className={cls(false)} onClick={(e) => choose(e, false)}>Faux</button>
        </div>
      </div>
    );
  },
};
