/** Outils partagés des mini-simulateurs. */
import { CAT_LABEL, COUNTRY_LABEL, COUNTRIES, QUEUE_CATS, type Cat, type Country } from '../engine/cases';
import { formatMoney, formatNumber, formatPercent, displayDate } from '../format';
import { LANG_TAGS } from '../../data/site-config';
export type Lang = 'en' | 'es';
export const tx = <A,>(l: Lang, en: A, es: A) => (l === 'es' ? es : en);
export const catOpts = (l: Lang, cats: Exclude<Cat, 'IR'>[] = QUEUE_CATS) => cats.map((c) => ({ value: c, label: CAT_LABEL[l][c] }));
export const countryOpts = (l: Lang, cs: Country[] = COUNTRIES) => cs.map((c) => ({ value: c, label: COUNTRY_LABEL[l][c] }));
export const f = (l: Lang) => ({
  usd: (x: number) => formatMoney(x, 0, l), num: (x: number, d = 0) => formatNumber(x, d, l), pct: (x: number, d = 0) => formatPercent(x, d, l),
  date: (iso: string) => displayDate(iso, LANG_TAGS[l]),
  month: (ym: string) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString(LANG_TAGS[l], { month: 'long', year: 'numeric', timeZone: 'UTC' }),
  cell: (c: string) => (c === 'C' ? tx(l, 'Current', 'Al día') : c === 'U' ? tx(l, 'Unavailable', 'No disponible') : displayDate(c, LANG_TAGS[l])),
});
export const iso = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
export const months = (l: Lang, m: number) => (Number.isFinite(m) ? tx(l, `${formatNumber(Math.round(m), 0, l)} months`, `${formatNumber(Math.round(m), 0, l)} meses`) : tx(l, 'beyond the history', 'más allá de la historia'));
