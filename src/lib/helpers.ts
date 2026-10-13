/** Outils d'écriture (`Helpers`) passés au corps de chaque page. */
import { route, ROUTES, type Locale } from '../i18n/routes';
import { P, type SourceKey } from './params';
import type { Helpers } from './guide-types';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';
import { LANG_TAGS } from '../data/site-config';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');

export function monthName(ym: string, lang: Locale): string {
  const d = new Date(`${ym}-01T00:00:00Z`);
  return d.toLocaleDateString(LANG_TAGS[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
export function cellText(v: string, lang: Locale): string {
  if (v === 'C') return lang === 'es' ? 'Al día (C)' : 'Current (C)';
  if (v === 'U') return lang === 'es' ? 'No disponible (U)' : 'Unavailable (U)';
  return displayDate(v, LANG_TAGS[lang]);
}

export function helpers(lang: Locale): Helpers {
  return {
    lang, P,
    a: (id, text) => (ROUTES.some((r) => r.id === id && r.paths[lang]) ? `<a href="${route(id, lang)}">${text}</a>` : ROUTES.some((r) => r.id === id) ? `<a href="${route(id, 'en')}">${text}</a>` : text),
    usd: (n) => formatMoney(n, 0, lang),
    num: (n, d = 0) => formatNumber(n, d, lang),
    pct: (x, d = 0) => formatPercent(x, d, lang),
    date: (iso) => displayDate(iso, LANG_TAGS[lang]),
    month: (ym) => monthName(ym, lang),
    cell: (v) => cellText(v, lang),
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label[lang]}</a>`; },
    mini: (kind) => `<!--mini:${kind}-->`,
    table: (headers, rows, caption, align = []) => {
      const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
      return `<div class="not-prose my-6 overflow-x-auto"><table class="w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="border-b border-navy-300 bg-navy-50 px-3 py-2 font-semibold text-navy-900 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, ri) => `<tr class="${ri % 2 ? 'bg-navy-50/40' : ''}">${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0, lang)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    },
  };
}
