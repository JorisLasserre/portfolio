import { useState } from 'react';
import { sides, isConfusable } from '../core/deck.js';
import { shuffle } from '../core/random.js';
import { option, optionKo, optionOk, qLabel, qPrompt, question as questionBox } from '../ui.js';

export default {
  id: 'multipleChoice',
  label: 'Choix multiple',
  isAvailable: (deck) => deck.cards.length >= 2,

  create({ deck, card, direction, rng }) {
    const s = sides(deck, card, direction);
    const others = shuffle(
      deck.cards.filter((c) => c.id !== card.id && !isConfusable(deck, card, c, direction)),
      rng
    ).slice(0, 3);
    const options = shuffle(
      [
        { id: card.id, text: s.answer },
        ...others.map((c) => ({ id: c.id, text: sides(deck, c, direction).answer })),
      ],
      rng
    );
    return {
      type: 'multipleChoice',
      cardId: card.id,
      prompt: s.prompt,
      promptLabel: s.promptLabel,
      answerLabel: s.answerLabel,
      options,
      correctId: card.id,
      expected: s.answer,
    };
  },

  grade(q, answer) {
    const correct = answer === q.correctId;
    return { score: correct ? 1 : 0, correct };
  },

  summarize(q, answer) {
    return {
      prompt: q.prompt,
      given: q.options.find((o) => o.id === answer)?.text ?? '—',
      expected: q.expected,
    };
  },

  Component({ question, onSubmit, result }) {
    const [picked, setPicked] = useState(null);

    const choose = (e, id) => {
      if (result || picked) return;
      e.currentTarget.blur();
      setPicked(id);
      onSubmit(id);
    };

    return (
      <div className={questionBox}>
        <div className={qLabel}>{question.promptLabel} → {question.answerLabel}</div>
        <div className={qPrompt}>{question.prompt}</div>
        <div className="grid gap-2">
          {question.options.map((o) => {
            let cls = option;
            if (result && o.id === question.correctId) cls = optionOk;
            else if (result && o.id === picked) cls = optionKo;
            return (
              <button key={o.id} className={cls} onClick={(e) => choose(e, o.id)}>
                {o.text}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
};
