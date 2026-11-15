import { useState } from 'react';
import { sides, acceptedAnswer } from '../core/deck.js';
import { compareAnswer } from '../core/text.js';
import { feedback, primary, qLabel, qPrompt, question as questionBox, textInput } from '../ui.js';

export default {
  id: 'written',
  label: 'Réponse écrite',
  isAvailable: () => true,

  create({ deck, card, direction }) {
    const s = sides(deck, card, direction);
    return {
      type: 'written',
      cardId: card.id,
      prompt: s.prompt,
      promptLabel: s.promptLabel,
      answerLabel: s.answerLabel,
      expected: acceptedAnswer(deck, card, direction),
    };
  },

  grade(q, answer) {
    const { status } = compareAnswer(answer, q.expected);
    return { score: status === 'correct' ? 1 : 0, correct: status === 'correct', close: status === 'close' };
  },

  summarize(q, answer) {
    return { prompt: q.prompt, given: answer || '—', expected: q.expected };
  },

  Component({ question, onSubmit, result }) {
    const [value, setValue] = useState('');

    const submit = (e) => {
      e.preventDefault();
      if (result || !value.trim()) return;
      onSubmit(value);
    };

    let note = null;
    if (result) {
      if (result.overridden) {
        note = { cls: 'ok', text: `Noté comme juste. Réponse attendue : ${question.expected}` };
      } else if (result.correct) {
        note = { cls: 'ok', text: 'Correct !' };
      } else if (result.close) {
        note = { cls: 'close', text: `Très proche ! Réponse attendue : ${question.expected}` };
      } else {
        note = { cls: 'ko', text: `Raté. Réponse attendue : ${question.expected}` };
      }
    }

    return (
      <div className={questionBox}>
        <div className={qLabel}>{question.promptLabel} → {question.answerLabel}</div>
        <div className={qPrompt}>{question.prompt}</div>
        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
          <input
            className={textInput}
            autoFocus
            value={value}
            disabled={!!result}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Écris en ${question.answerLabel?.toLowerCase() ?? 'réponse'}…`}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {!result && <button type="submit" className={primary}>Valider</button>}
        </form>
        {note && (
          <div className={feedback[note.cls]}>
            {note.text}
            {!result.correct && !result.overridden && result.answer ? (
              <div className="mt-1 text-sm opacity-80">Ta réponse : {result.answer}</div>
            ) : null}
          </div>
        )}
      </div>
    );
  },
};
