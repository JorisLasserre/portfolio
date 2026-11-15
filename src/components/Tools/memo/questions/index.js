// Registre des types de questions.
//
// Pour ajouter un type (ex. "schéma à légender", "texte à trous") :
//   1. créer src/questions/monType.jsx qui exporte
//      { id, label, isAvailable(deck), create(ctx), grade(q, answer), summarize(q, answer), Component }
//   2. l'ajouter ci-dessous. Le mode Test le proposera automatiquement.

import multipleChoice from './multipleChoice.jsx';
import trueFalse from './trueFalse.jsx';
import written from './written.jsx';
import matching from './matching.jsx';

export const questionTypes = { multipleChoice, trueFalse, written, matching };
export const getType = (id) => questionTypes[id];
