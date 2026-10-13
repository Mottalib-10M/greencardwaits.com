/** Briques communes des simulateurs : lignes de résultat, tête de résultat avec barre collante, étapes, actions. */
import { useEffect, useRef, useState } from 'react';
import { formatMoney, formatNumber, formatPercent, displayDate } from '../../lib/format';
import { LANG_TAGS } from '../../data/site-config';

export type L = 'en' | 'es';
export const tx = <A,>(l: L, en: A, es: A) => (l === 'es' ? es : en);
export const fm = (l: L) => ({
  usd: (x: number) => formatMoney(x, 0, l),
  pct: (x: number, d = 0) => formatPercent(x, d, l),
  num: (x: number, d = 0) => formatNumber(x, d, l),
  date: (iso: string) => displayDate(iso, LANG_TAGS[l]),
  month: (ym: string) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString(LANG_TAGS[l], { month: 'long', year: 'numeric', timeZone: 'UTC' }),
});

/** « 2 years 3 months » / « 2 años y 3 meses » à partir d'un nombre de mois. */
export function span(l: L, months: number): string {
  const m = Math.max(0, Math.round(months));
  const y = Math.floor(m / 12), r = m % 12;
  const Y = (n: number) => tx(l, `${n} year${n > 1 ? 's' : ''}`, `${n} año${n > 1 ? 's' : ''}`);
  const M = (n: number) => tx(l, `${n} month${n > 1 ? 's' : ''}`, `${n} mes${n > 1 ? 'es' : ''}`);
  if (!y) return M(r || 0);
  if (!r) return Y(y);
  return tx(l, `${Y(y)} ${M(r)}`, `${Y(y)} y ${M(r)}`);
}

export interface Row { label: string; value: string; strong?: boolean; muted?: boolean; sep?: boolean }
export function Rows({ rows, caption }: { rows: Row[]; caption?: string }) {
  return (
    <table className="mt-3 w-full text-sm tabular-nums">
      {caption && <caption className="mb-1 text-left text-xs font-semibold uppercase tracking-wide text-navy-600">{caption}</caption>}
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={`${r.sep ? 'border-t-2 border-navy-800' : 'border-t border-navy-200'} ${r.strong ? 'font-semibold text-navy-900' : r.muted ? 'text-navy-600' : 'text-navy-800'}`}>
            <th scope="row" className="py-1.5 pr-3 text-left font-normal">{r.label}</th>
            <td className="py-1.5 pl-2 text-right [overflow-wrap:anywhere]">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Steps({ lang, steps }: { lang: L; steps: string[] }) {
  if (!steps.length) return null;
  return (
    <details className="mt-4 rounded-lg border border-navy-200 bg-white p-3 text-sm">
      <summary className="cursor-pointer font-semibold text-navy-900">{tx(lang, 'How this was calculated', 'Cómo se calculó')}</summary>
      <ol className="calc-steps mt-2 list-decimal pl-5 text-navy-800">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
    </details>
  );
}

export function Actions({ lang, text, ics }: { lang: L; text: () => string; ics?: () => string }) {
  const [done, setDone] = useState(false);
  const copy = () => navigator.clipboard?.writeText(text()).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); });
  const download = () => {
    if (!ics) return;
    const url = URL.createObjectURL(new Blob([ics()], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = url; a.download = 'visa-bulletin.ics'; a.click(); URL.revokeObjectURL(url);
  };
  const b = 'rounded-md border border-navy-300 bg-white px-3 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-50';
  return (
    <div className="no-print mt-4 flex flex-wrap gap-2">
      <button type="button" className={b} onClick={copy}>{done ? tx(lang, 'Copied', 'Copiado') : tx(lang, 'Copy result', 'Copiar resultado')}</button>
      {ics && <button type="button" className={b} onClick={download}>{tx(lang, 'Remind me of the next bulletin', 'Recordarme el próximo boletín')}</button>}
      <button type="button" className={b} onClick={() => window.print()}>{tx(lang, 'Print', 'Imprimir')}</button>
    </div>
  );
}

/**
 * Tête de résultat : un chiffre ou un statut en grand, une ligne dessous. Sur téléphone, tant que l'outil est à
 * l'écran mais que le résultat est encore plus bas, une barre en bas de l'écran montre le chiffre clé (RECETTE §5).
 */
export function Head({ label, value, sub }: { label: string; value: string; sub?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const box = (el.closest('[data-resultat]') as HTMLElement | null) ?? el;
    const tool = (el.closest('.rechner') as HTMLElement | null) ?? box;
    const check = () => { const h = window.innerHeight; setBar(window.innerWidth < 1024 && tool.getBoundingClientRect().top < h * 0.85 && box.getBoundingClientRect().top > h - 24); };
    check();
    window.addEventListener('scroll', check, { passive: true }); window.addEventListener('resize', check);
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);
  return (
    <div ref={ref}>
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">{value}</p>
      {sub && <p className="tabular-nums mt-1 text-sm text-navy-700">{sub}</p>}
      {bar && (
        <button type="button" aria-hidden="true" tabIndex={-1} onClick={() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          className="no-print fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-accent-200 bg-white px-4 py-3 text-left shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden">
          <span className="text-sm font-medium text-navy-700">{label}</span>
          <span className="tabular-nums whitespace-nowrap font-serif text-xl font-bold text-navy-900">{value}</span>
        </button>
      )}
    </div>
  );
}

/** Avertissement court sous chaque simulateur (étude §4). */
export function Disclaimer({ lang, methodHref }: { lang: L; methodHref?: string }) {
  return (
    <p className="mt-3 text-xs text-navy-600">
      {tx(lang, 'Estimate from public data, not legal advice. Your case may differ (cross-chargeability, CSPA, waivers). For advice, see a licensed immigration attorney or a DOJ-accredited representative. Not affiliated with USCIS or the Department of State. ', 'Estimación con datos públicos: no sustituye la asesoría legal. Su caso puede ser distinto (país de cargo del cónyuge, CSPA, perdones). Para su caso, consulte a un abogado de inmigración con licencia o a un representante acreditado por el Departamento de Justicia. Sin relación con USCIS ni con el Departamento de Estado. ')}
      {methodHref && <a className="underline" href={methodHref}>{tx(lang, 'Method and past error', 'Método y error pasado')}</a>}
    </p>
  );
}

/** Champ date natif, 48 px, valeur ISO ; le texte saisi reste la source (RECETTE §17.2). */
export function DateField({ id, label, value, onChange, min = '1975-01-01', max = '2027-12-31', help }: { id: string; label: string; value: string; onChange: (v: string) => void; min?: string; max?: string; help?: string }) {
  return (
    <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="date" value={value} min={min} max={max} onChange={(e) => onChange(e.target.value)} aria-describedby={help ? `${id}-help` : undefined}
        className="tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      {help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-600">{help}</p>}
    </div>
  );
}

export const box = 'mt-6 rounded-xl border border-accent-200 bg-accent-50/50 p-4 sm:p-5 lg:mt-0 lg:sticky lg:top-20';
export const frame = 'rechner not-prose overflow-hidden rounded-xl border border-navy-200 bg-white';
export const layout = 'p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-6';
export const isIso = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
