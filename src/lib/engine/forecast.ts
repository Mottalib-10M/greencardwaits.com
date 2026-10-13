/**
 * Prévision « quand ma date de priorité deviendra-t-elle courante ? », en fourchette P20 – P50 – P80.
 *
 * Méthode (page /method/, RECETTE §17.3) : temps de premier passage observé. Pour une personne en retard de G jours
 * sur la date limite du mois t (tableau Final Action Dates de sa case), on regarde chaque mois de départ s des
 * 10 années précédentes et on mesure combien de mois la date limite de la même case a mis, depuis s, pour avancer
 * de G jours (reculs compris : ils retardent le passage). Les départs dont l'issue n'est pas encore connue au mois t
 * sont « censurés » et traités par l'estimateur de Kaplan-Meier, sans les compter comme réussis ni comme échoués.
 * Les quantiles 20, 50 et 80 de cette distribution forment la fourchette ; si moins de 80 % des départs ont passé le
 * cap, P80 vaut Infinity (« au-delà de ce que dix ans d'historique ont montré »).
 * Un premier modèle, qui extrapolait le rythme moyen d'avancée sur 3, 5 et 10 ans, a été écarté au rétro-test :
 * sa fourchette ne contenait la date réelle que dans 23 % des cas (cible 60 %), contre 53 % pour celui-ci.
 * La fonction ne lit que les mois d'indice ≤ t : le rétro-test (scripts/build-forecast.ts) l'appelle tel quel
 * sur le passé, sans jamais voir l'avenir.
 */

export const DAY_MS = 86_400_000;
/** Valeur d'une case dans les séries : jours depuis le 1970-01-01, CURRENT (« C »), ou null (« U », mois absent). */
export const CURRENT = -1;
export type Val = number | null;

/** Jours depuis 1970 du 1er du mois AAAA-MM. */
export const monthStart = (ym: string) => Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1, 1) / DAY_MS;
export const isoToDays = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / DAY_MS;
export const daysToIso = (d: number) => new Date(d * DAY_MS).toISOString().slice(0, 10);
/** Mois AAAA-MM situé `n` mois après `ym` (n peut être fractionnaire : arrondi au mois inférieur). */
export function addMonths(ym: string, n: number): string {
  const y = Number(ym.slice(0, 4)), m = Number(ym.slice(5, 7)) - 1 + Math.floor(n);
  const yy = y + Math.floor(m / 12), mm = ((m % 12) + 12) % 12;
  return `${yy}-${String(mm + 1).padStart(2, '0')}`;
}
export const MONTH_DAYS = 30.4375;

/** Date limite effective du mois `i` : « C » vaut le 1er du mois du bulletin. */
export function resolve(series: Val[], months: string[], i: number): number | null {
  const v = series[i];
  if (v === null || v === undefined) return null;
  return v === CURRENT ? monthStart(months[i]) : v;
}

/** Quantile sur un tableau trié (rang le plus proche par défaut). Infinity reste Infinity. */
export function quantile(sorted: number[], p: number): number {
  if (!sorted.length) return NaN;
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))))];
}

/** Mois de départ examinés : les 10 années qui précèdent le mois t. */
export const LOOKBACK = 120;

/** Temps de premier passage (mois) d'une avancée de `gap` jours, départs pris dans les LOOKBACK mois avant t. */
export function passages(series: Val[], months: string[], t: number, gap: number): Array<{ h: number; done: boolean }> {
  const out: Array<{ h: number; done: boolean }> = [];
  for (let s = Math.max(0, t - LOOKBACK); s < t; s++) {
    const a = resolve(series, months, s);
    if (a === null) continue;
    let h: number | null = null;
    for (let i = s + 1; i <= t; i++) {
      if (series[i] === CURRENT) { h = i - s; break; }
      const b = resolve(series, months, i);
      if (b !== null && b - a >= gap) { h = i - s; break; }
    }
    out.push(h === null ? { h: t - s, done: false } : { h, done: true });
  }
  return out;
}

/** Quantiles de Kaplan-Meier d'une liste de passages (censurés compris). Infinity si la proportion n'est jamais atteinte. */
export function kmQuantiles(ev: Array<{ h: number; done: boolean }>, ps: number[]): number[] {
  const times = [...new Set(ev.filter((e) => e.done).map((e) => e.h))].sort((a, b) => a - b);
  let surv = 1;
  const steps: Array<[number, number]> = [];
  for (const tm of times) {
    const d = ev.filter((e) => e.done && e.h === tm).length;
    const r = ev.filter((e) => e.h >= tm).length;
    if (r > 0) surv *= 1 - d / r;
    steps.push([tm, 1 - surv]);
  }
  return ps.map((p) => steps.find(([, f]) => f >= p - 1e-9)?.[0] ?? Infinity);
}

export interface Forecast {
  /** current : la date est courante ce mois ; waiting : il faut attendre ; unavailable : « U » ce mois ou pas de données. */
  status: 'current' | 'waiting' | 'unavailable';
  /** Date limite du mois t (jours), null si « U ». */
  cutoff: number | null;
  /** Retard en jours (priorité − date limite), ≤ 0 si courante. */
  gap: number;
  /** Délais en mois à partir du mois t : optimiste, médian, prudent. Infinity = au rythme mesuré, jamais. */
  p20: number;
  p50: number;
  p80: number;
  /** Mois de départ examinés. */
  samples: number;
}

/** Prévision pour une date de priorité `pd` (jours) au mois d'indice `t`. */
export function forecastAt(series: Val[], months: string[], t: number, pd: number): Forecast {
  const raw = series[t];
  const cutoff = resolve(series, months, t);
  if (raw === null || raw === undefined || cutoff === null) return { status: 'unavailable', cutoff: null, gap: NaN, p20: NaN, p50: NaN, p80: NaN, samples: 0 };
  // Le bulletin dit : courant si la date de priorité est ANTÉRIEURE à la date limite ; « C » : courant pour tous.
  if (raw === CURRENT || pd < cutoff) return { status: 'current', cutoff, gap: pd - cutoff, p20: 0, p50: 0, p80: 0, samples: 0 };
  const gap = pd - cutoff + 1;
  const ev = passages(series, months, t, gap);
  if (ev.length < 12) return { status: 'unavailable', cutoff, gap, p20: NaN, p50: NaN, p80: NaN, samples: ev.length };
  const [p20, p50, p80] = kmQuantiles(ev, [0.2, 0.5, 0.8]);
  return { status: 'waiting', cutoff, gap, p20, p50, p80, samples: ev.length };
}

/** Modèle naïf de comparaison : la date avance au rythme des 12 derniers mois. */
export function naiveAt(series: Val[], months: string[], t: number, pd: number): number {
  const a = resolve(series, months, t - 12), b = resolve(series, months, t);
  if (a === null || b === null) return NaN;
  const r = (b - a) / 12;
  const gap = pd - b + 1;
  if (gap <= 0) return 0;
  return r > 0 ? gap / r : Infinity;
}

/** Premier mois h ≥ 1 après t où `pd` devient courante, ou null si jamais jusqu'au dernier bulletin. */
export function actualWait(series: Val[], months: string[], t: number, pd: number): number | null {
  for (let i = t + 1; i < series.length; i++) {
    const raw = series[i];
    if (raw === CURRENT) return i - t;
    const c = resolve(series, months, i);
    if (c !== null && pd < c) return i - t;
  }
  return null;
}

/** Écarts de rétro-test publiés pour une case, à un retard donné (6, 12, 24 ou 48 mois). */
export interface BacktestCell {
  gapMonths: number;
  /** Mois de départ testés dont l'issue est connue (date devenue courante avant le dernier bulletin). */
  observed: number;
  /** Mois de départ dont la date n'est toujours pas courante. */
  pending: number;
  /** Erreur absolue médiane du délai médian prédit, en mois. */
  medianError: number;
  /** Même mesure pour le modèle naïf (rythme des 12 derniers mois). */
  naiveError: number;
  /** Part des issues connues tombées dans la fourchette P20 – P80. */
  coverage: number;
  /** Délai réel médian, en mois. */
  medianActual: number;
  reliable: boolean;
  /** Bande du modèle naïf : délai au rythme des 12 derniers mois, plus ou moins son erreur médiane (mesurée sur la même période). */
  naiveCoverage: number;
  naiveReliable: boolean;
}

export const BACKTEST_GAPS = [6, 12, 24, 48] as const;

/** Règle de publication : une prévision ne s'affiche que si, sur le passé, elle a tenu. */
export function isReliable(c: Pick<BacktestCell, 'observed' | 'pending' | 'medianError' | 'coverage' | 'medianActual'>): boolean {
  return c.observed + c.pending >= 24 && c.observed >= 12 && c.coverage >= 0.4 && c.medianError <= Math.max(4, 0.5 * c.medianActual);
}

/** La case de rétro-test à lire pour un retard donné (en mois) ; null au-delà de 72 mois, hors du champ testé. */
export function bucketFor(gapMonths: number): number | null {
  if (gapMonths > 72) return null;
  let best: number = BACKTEST_GAPS[0];
  for (const g of BACKTEST_GAPS) if (Math.abs(Math.log(g / Math.max(gapMonths, 1))) < Math.abs(Math.log(best / Math.max(gapMonths, 1)))) best = g;
  return best;
}
