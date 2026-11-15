// Utilitaires aléatoires. Le paramètre `rng` permet d'injecter un générateur
// déterministe dans les tests.

export function shuffle(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick(arr, rng = Math.random) {
  return arr[Math.floor(rng() * arr.length)];
}

export function sample(arr, n, rng = Math.random) {
  return shuffle(arr, rng).slice(0, n);
}
