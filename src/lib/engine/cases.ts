/**
 * Les cases du Visa Bulletin (catégorie × pays de rattachement) et les faits qu'on en tire : date limite du mois,
 * avance ou recul, tableau à utiliser pour déposer l'I-485, ligne de rétro-test. Fonctions pures, partagées par
 * les pages (au build) et les simulateurs (dans le navigateur). Aucune valeur tapée à la main : tout vient de
 * src/data/series.json, backtest.json et params-2026.json.
 */
import SERIES from '../../data/series.json';
import BACKTEST from '../../data/backtest.json';
import PARAMS from '../../data/params-2026.json';
import { CURRENT, resolve, forecastAt, naiveAt, bucketFor, MONTH_DAYS, isoToDays, daysToIso, addMonths, type Val, type BacktestCell, type Forecast } from './forecast';

export type Cat = 'IR' | 'F1' | 'F2A' | 'F2B' | 'F3' | 'F4' | 'EB1' | 'EB2' | 'EB3' | 'EW' | 'EB4' | 'EB5';
export type Country = 'ROW' | 'CN' | 'IN' | 'MX' | 'PH';
export type Chart = 'FAD' | 'DFF';
export type Lang = 'en' | 'es';

export const QUEUE_CATS: Exclude<Cat, 'IR'>[] = ['F1', 'F2A', 'F2B', 'F3', 'F4', 'EB1', 'EB2', 'EB3', 'EW', 'EB4', 'EB5'];
export const FAMILY: Cat[] = ['IR', 'F1', 'F2A', 'F2B', 'F3', 'F4'];
export const COUNTRIES: Country[] = ['ROW', 'CN', 'IN', 'MX', 'PH'];
export const isFamily = (c: Cat) => FAMILY.includes(c);

export const CAT_LABEL: Record<Lang, Record<Cat, string>> = {
  en: {
    IR: 'Spouse, parent or minor child of a U.S. citizen',
    F1: 'F1: unmarried son or daughter (21+) of a U.S. citizen',
    F2A: 'F2A: spouse or minor child of a green card holder',
    F2B: 'F2B: unmarried son or daughter (21+) of a green card holder',
    F3: 'F3: married son or daughter of a U.S. citizen',
    F4: 'F4: brother or sister of an adult U.S. citizen',
    EB1: 'EB-1: priority worker',
    EB2: 'EB-2: advanced degree or exceptional ability',
    EB3: 'EB-3: skilled worker or professional',
    EW: 'EB-3 Other Workers',
    EB4: 'EB-4: certain special immigrants',
    EB5: 'EB-5: investor (unreserved)',
  },
  es: {
    IR: 'Cónyuge, padre o hijo menor de un ciudadano',
    F1: 'F1: hijo soltero (21+) de un ciudadano',
    F2A: 'F2A: cónyuge o hijo menor de un residente',
    F2B: 'F2B: hijo soltero (21+) de un residente',
    F3: 'F3: hijo casado de un ciudadano',
    F4: 'F4: hermano de un ciudadano mayor de edad',
    EB1: 'EB-1: trabajador prioritario',
    EB2: 'EB-2: título avanzado o habilidad excepcional',
    EB3: 'EB-3: trabajador calificado o profesional',
    EW: 'EB-3 otros trabajadores',
    EB4: 'EB-4: inmigrantes especiales',
    EB5: 'EB-5: inversionista (no reservado)',
  },
};
export const CAT_SHORT: Record<Cat, string> = { IR: 'Immediate relative', F1: 'F1', F2A: 'F2A', F2B: 'F2B', F3: 'F3', F4: 'F4', EB1: 'EB-1', EB2: 'EB-2', EB3: 'EB-3', EW: 'EB-3 Other Workers', EB4: 'EB-4', EB5: 'EB-5' };
export const COUNTRY_LABEL: Record<Lang, Record<Country, string>> = {
  en: { ROW: 'All other countries', CN: 'China (mainland born)', IN: 'India', MX: 'Mexico', PH: 'Philippines' },
  es: { ROW: 'Resto del mundo', CN: 'China (continental)', IN: 'India', MX: 'México', PH: 'Filipinas' },
};

const S = SERIES as unknown as { latest: string; months: string[]; FAD: Record<string, Val[]>; DFF: Record<string, Val[]> };
const B = BACKTEST as unknown as { from: string; to: string; cases: Record<string, { distinct: number; cells: BacktestCell[] }> };
export const MONTHS = S.months;
export const LATEST = S.latest;
export const LATEST_INDEX = S.months.length - 1;
export const BACKTEST_FROM = B.from;
export const BACKTEST_TO = B.to;

export const key = (cat: Exclude<Cat, 'IR'>, country: Country) => `${cat}-${country}`;
export const series = (cat: Exclude<Cat, 'IR'>, country: Country, chart: Chart = 'FAD'): Val[] => S[chart][key(cat, country)];

/** Valeur brute d'un mois : 'C', 'U' ou date ISO. */
export function cellAt(cat: Exclude<Cat, 'IR'>, country: Country, chart: Chart, i = LATEST_INDEX): 'C' | 'U' | string {
  const v = series(cat, country, chart)?.[i];
  if (v === undefined || v === null) return 'U';
  return v === CURRENT ? 'C' : daysToIso(v);
}

/** Tableau qu'USCIS impose ce mois pour déposer l'I-485 (lu sur uscis.gov, params-2026.json > aosChart). */
export function filingChart(cat: Cat): Chart {
  return (isFamily(cat) ? PARAMS.aosChart.family : PARAMS.aosChart.employment) as Chart;
}

/** Avance (en jours, positive) ou recul de la date limite depuis le bulletin précédent publié (null si l'un est « U »). */
export function moveDays(cat: Exclude<Cat, 'IR'>, country: Country, chart: Chart = 'FAD', i = LATEST_INDEX): number | null {
  const s = series(cat, country, chart);
  let j = i - 1;
  // Mois sans bulletin dans l'archive (mars, septembre à novembre 2009, octobre 2012) : on remonte au précédent.
  while (j > 0 && s[j] === null && i - j < 4) j--;
  const a = resolve(s, MONTHS, j), b = resolve(s, MONTHS, i);
  if (a === null || b === null) return null;
  return b - a;
}

/** Ligne de rétro-test d'une case pour un retard donné (6, 12, 24 ou 48 mois). */
export function backtestCell(cat: Exclude<Cat, 'IR'>, country: Country, gapMonths: number): BacktestCell | undefined {
  return B.cases[key(cat, country)]?.cells.find((c) => c.gapMonths === gapMonths);
}
export const backtestCells = (cat: Exclude<Cat, 'IR'>, country: Country) => B.cases[key(cat, country)]?.cells ?? [];
/** Part des bulletins depuis octobre 2015 où le pays a sa propre date (règle des pages catégorie × pays : ≥ 25 %). */
export const distinctShare = (cat: Exclude<Cat, 'IR'>, country: Country) => B.cases[key(cat, country)]?.distinct ?? 0;

export interface CaseResult {
  cat: Cat;
  country: Country;
  /** 'noqueue' : immediate relative, pas de file d'attente. */
  status: 'noqueue' | 'current' | 'waiting' | 'unavailable';
  /** Le dossier peut-il être déposé ce mois (I-485, tableau imposé par USCIS) ? */
  canFile: boolean;
  filingChart: Chart;
  fad: 'C' | 'U' | string;
  dff: 'C' | 'U' | string;
  /** Retard sur la date limite Final Action, en mois (≤ 0 : courante). */
  behindMonths: number;
  forecast?: Forecast;
  /** Mois AAAA-MM estimés (P20, P50, P80) ; null = au-delà de l'historique. */
  range?: [string | null, string | null, string | null];
  /** Ligne de rétro-test utilisée et verdict. */
  backtest?: BacktestCell;
  reliable: boolean;
  /** Méthode retenue : temps de passage (« model »), ou rythme des 12 derniers mois avec sa bande d'erreur (« pace »)
   *  quand seul celui-ci a passé le rétro-test pour cette case et cette distance. */
  method?: 'model' | 'pace';
}

/** Le calcul principal : où en est cette date de priorité, et quand deviendra-t-elle courante ? */
export function evaluate(cat: Cat, country: Country, priorityDate: string, i = LATEST_INDEX): CaseResult {
  if (cat === 'IR') return { cat, country, status: 'noqueue', canFile: true, filingChart: 'FAD', fad: 'C', dff: 'C', behindMonths: 0, reliable: true };
  const pd = isoToDays(priorityDate);
  const fad = cellAt(cat, country, 'FAD', i), dff = cellAt(cat, country, 'DFF', i);
  const chart = filingChart(cat);
  const filingCell = chart === 'DFF' ? dff : fad;
  // Si la date Final Action est postérieure à celle du tableau imposé, USCIS accepte le tableau Final Action.
  const best = [filingCell, fad].map((c) => (c === 'C' ? Infinity : c === 'U' ? -Infinity : isoToDays(c)));
  const canFile = Math.max(...best) > pd;
  const f = forecastAt(series(cat, country, 'FAD'), MONTHS, i, pd);
  const behindMonths = Number.isFinite(f.gap) ? f.gap / MONTH_DAYS : NaN;
  if (f.status !== 'waiting') return { cat, country, status: f.status, canFile, filingChart: chart, fad, dff, behindMonths, forecast: f, reliable: f.status === 'current' };
  const g = bucketFor(behindMonths);
  const bt = g === null ? undefined : backtestCell(cat, country, g);
  const at = (m: number) => (Number.isFinite(m) ? addMonths(MONTHS[i], m) : null);
  if (bt && !bt.reliable && bt.naiveReliable) {
    const nv = naiveAt(series(cat, country, 'FAD'), MONTHS, i, pd);
    if (Number.isFinite(nv)) {
      const e = bt.naiveError;
      return { cat, country, status: 'waiting', canFile, filingChart: chart, fad, dff, behindMonths, forecast: f, range: [at(Math.max(1, nv - e)), at(nv), at(nv + e)], backtest: bt, reliable: true, method: 'pace' };
    }
  }
  return { cat, country, status: 'waiting', canFile, filingChart: chart, fad, dff, behindMonths, forecast: f, range: [at(f.p20), at(f.p50), at(f.p80)], backtest: bt, reliable: !!bt?.reliable && Number.isFinite(f.p50), method: 'model' };
}
