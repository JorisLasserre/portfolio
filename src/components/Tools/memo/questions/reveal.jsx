import { useState } from 'react';
import { feedback, primary, qLabel, qPrompt, question as questionBox, secondary } from '../ui.js';

export default {
    id: 'reveal',
    label: 'Question rédactionnelle',
    isAvailable: (deck) => deck.cards.some((c) => c.kind === 'redaction'),

    create({ card }) {
        return { type: 'reveal', cardId: card.id, prompt: card.front, expected: card.back };
    },

    // answer : true = « je savais », false = « je ne savais pas »
    grade(q, answer) {
        return { score: answer ? 1 : 0, correct: answer === true };
    },

    summarize(q, answer) {
        return { prompt: q.prompt, given: answer ? 'Je savais' : 'Je ne savais pas', expected: q.expected };
    },

    Component({ question, onSubmit, result }) {
        const [revealed, setRevealed] = useState(false);
        const showAnswer = revealed || !!result;

        return (
            <div className={questionBox}>
                <div className={qLabel}>Rédige ta réponse de mémoire, puis compare</div>
                <div className={qPrompt}>{question.prompt}</div>

                {!showAnswer && (
                    <button className={`${primary} self-start`} onClick={() => setRevealed(true)}>
                        Voir la correction
                    </button>
                )}

                {showAnswer && (
                    <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed">
                        <div className="mb-1 font-semibold">Correction attendue</div>
                        {question.expected}
                    </div>
                )}

                {revealed && !result && (
                    <div className="grid grid-cols-2 gap-2">
                        <button className={secondary} onClick={() => onSubmit(false)}>Je ne savais pas</button>
                        <button className={primary} onClick={() => onSubmit(true)}>Je savais</button>
                    </div>
                )}

                {result && (
                    <div className={result.correct ? feedback.ok : feedback.ko}>
                        {result.correct ? 'Noté : tu savais.' : 'Noté : à revoir.'}
                    </div>
                )}
            </div>
        );
    },
};