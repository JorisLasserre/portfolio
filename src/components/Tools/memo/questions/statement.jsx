import { option, optionKo, optionOk, qLabel, qPrompt, question as questionBox } from '../ui.js';
import { useState } from 'react';
import { normalize } from '../core/text.js';
export default {
    id: 'statement',
    label: 'Vrai / Faux (affirmation)',
    isAvailable: (deck) => deck.cards.some((c) => c.kind === 'vf'),

    create({ card }) {
        return {
            type: 'statement',
            cardId: card.id,
            prompt: card.front,
            expected: normalize(card.back) === 'vrai',
        };
    },

    grade(q, answer) {
        const correct = answer === q.expected;
        return { score: correct ? 1 : 0, correct };
    },

    summarize(q, answer) {
        return { prompt: q.prompt, given: answer ? 'Vrai' : 'Faux', expected: q.expected ? 'Vrai' : 'Faux' };
    },

    Component({ question, onSubmit, result }) {
        const [picked, setPicked] = useState(null);

        const choose = (value) => {
            if (result || picked !== null) return;
            setPicked(value);
            onSubmit(value);
        };

        const cls = (value) => {
            if (result && value === question.expected) return optionOk;
            if (result && value === picked) return optionKo;
            return option;
        };

        return (
            <div className={questionBox}>
                <div className={qLabel}>Vrai ou faux ?</div>
                <div className={qPrompt}>{question.prompt}</div>
                <div className="grid grid-cols-2 gap-2">
                    <button className={cls(true)} onClick={() => choose(true)}>Vrai</button>
                    <button className={cls(false)} onClick={() => choose(false)}>Faux</button>
                </div>
            </div>
        );
    },
};