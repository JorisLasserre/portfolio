// Comparaison de réponses tolérante : accents, articles, petites fautes de frappe.

const LEADING = /^(?:(?:to|the|a|an|le|la|les|un|une|des|du|se)\s+|l'|s')/;

export function normalize(str) {
  return String(str ?? '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[.,!?;:"«»()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
}

// Forme "cœur" : sans accents, sans article / "to" / "se" en tête.
function core(str) {
  return stripAccents(normalize(str)).replace(LEADING, '').trim();
}

// Une réponse attendue peut contenir plusieurs variantes : "grand ; gros".
export function splitAlternatives(expected) {
  return String(expected)
    .split(/\s*[;/]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return prev[b.length];
}

/**
 * @returns {{status: 'correct'|'close'|'wrong'}}
 *  - correct : identique (casse/ponctuation ignorées)
 *  - close   : même chose à un détail près (accent, article, 1-2 lettres)
 */
export function compareAnswer(input, expected) {
  const alts = splitAlternatives(expected);
  const a = normalize(input);
  if (!a) return { status: 'wrong' };
  if (alts.some((alt) => normalize(alt) === a)) return { status: 'correct' };

  const b = core(input);
  for (const alt of alts) {
    const c = core(alt);
    const max = c.length >= 9 ? 2 : c.length >= 4 ? 1 : 0;
    if (levenshtein(b, c) <= max) return { status: 'close' };
  }
  return { status: 'wrong' };
}
