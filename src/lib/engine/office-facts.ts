/**
 * Faits d'un bureau de terrain USCIS pour les pages de bureau : fourchettes N-400 et I-485 famille du dernier relevé,
 * rang sur 90, premier relevé de la série (mars 2022), date limite des demandes de renseignement. Lu dans ptimes.json.
 */
import PT from '../../data/ptimes.json';
import { formatNumber, displayDate } from '../format';

type Band = { date: string; min: number | null; max: number | null; inquiry: string | null } | null;
interface Office { name: string; n400: Band; i485fam: Band; n400Rank: number; i485famRank: number; hist: Record<string, Array<[string, number | null, number | null]>> }
const O = (PT as unknown as { offices: Record<string, Office> }).offices;
export const OFFICE_COUNT = Object.keys(O).length;
export const PUBLISHED_ON = (PT as unknown as { published: string }).published;

const m = (x: number | null | undefined) => (x === null || x === undefined ? '—' : formatNumber(x, x % 1 ? 1 : 0, 'en'));
export function officeFacts(code: string) {
  const o = O[code];
  if (!o) throw new Error(`Bureau inconnu : ${code}`);
  const first = (k: 'n400' | 'i485fam') => o.hist[k]?.[0] ?? null;
  return {
    code, name: o.name, city: o.name.replace(/, [A-Z]{2}$/, ''),
    n400: o.n400!, i485: o.i485fam!, n400Rank: o.n400Rank, i485Rank: o.i485famRank,
    n400First: first('n400'), i485First: first('i485fam'),
    /** « 12 to 14 months » */
    n400Range: `${m(o.n400?.min)} to ${m(o.n400?.max)} months`,
    i485Range: `${m(o.i485fam?.min)} to ${m(o.i485fam?.max)} months`,
    n400FirstRange: first('n400') ? `${m(first('n400')![1])} to ${m(first('n400')![2])} months` : '—',
    i485FirstRange: first('i485fam') ? `${m(first('i485fam')![1])} to ${m(first('i485fam')![2])} months` : '—',
    n400Inquiry: o.n400?.inquiry ? displayDate(o.n400.inquiry, 'en-US') : '—',
    i485Inquiry: o.i485fam?.inquiry ? displayDate(o.i485fam.inquiry, 'en-US') : '—',
    firstDate: first('n400') ? displayDate(first('n400')![0], 'en-US') : '—',
    /** Écart en mois entre la borne haute de l'I-485 famille et celle du N-400. */
    gap: (o.i485fam?.max ?? 0) - (o.n400?.max ?? 0),
    /** Variation de la borne haute depuis le premier relevé (positif = plus lent). */
    n400Change: (o.n400?.max ?? 0) - (first('n400')?.[2] ?? 0),
    i485Change: (o.i485fam?.max ?? 0) - (first('i485fam')?.[2] ?? 0),
  };
}
export const fm = m;
