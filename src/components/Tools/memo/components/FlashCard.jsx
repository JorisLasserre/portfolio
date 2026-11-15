import { sides } from '../core/deck.js';

// Fiche de présentation d'un nouveau mot : les deux faces visibles.
export default function FlashCard({ deck, card, direction }) {
  const s = sides(deck, card, direction);
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-5">
      <div className="w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">Nouveau mot</div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.promptLabel}</div>
      <div className="text-2xl font-semibold leading-snug">{s.prompt}</div>
      <hr className="border-indigo-100" />
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.answerLabel}</div>
      <div className="text-2xl font-semibold leading-snug text-indigo-700">{s.answer}</div>
    </div>
  );
}
