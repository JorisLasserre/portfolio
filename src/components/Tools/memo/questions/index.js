import multipleChoice from './multipleChoice.jsx';
import trueFalse from './trueFalse.jsx';
import written from './written.jsx';
import matching from './matching.jsx';
import reveal from './reveal.jsx';
import statement from './statement.jsx';

export const questionTypes = { multipleChoice, trueFalse, written, matching, reveal, statement };
export const getType = (id) => questionTypes[id];

// Choisit le type adapté à la carte.
// redaction → auto-évaluation ; vf → affirmation ; notion → le type demandé.
export function typeForCard(card, preferredId) {
    const kind = card.kind ?? 'notion';
    if (kind === 'redaction') return questionTypes.reveal;
    if (kind === 'vf') return questionTypes.statement;
    return questionTypes[preferredId] ?? questionTypes.written;
}