/**
 * Vérificateur d'un bulletin donné : catégorie, pays, date de priorité → la date était-elle courante ce mois-là
 * (Final Action et Dates for Filing), et quand l'est-elle devenue ensuite. Tout vient de l'archive des bulletins.
 */
import { useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { Rows, Head, Disclaimer, DateField, box, frame, layout, tx, fm, span, isIso, type L, type Row } from './kit';
import { CAT_LABEL, COUNTRY_LABEL, COUNTRIES, QUEUE_CATS, MONTHS, series, type Cat, type Country } from '../../lib/engine/cases';
import { resolve, isoToDays, actualWait, CURRENT, daysToIso } from '../../lib/engine/forecast';

export default function BulletinCheck({ lang = 'en', month: m0, pick = false, cat: c0 = 'F2B', country: k0 = 'MX', pd: p0 = '2010-01-01', methodHref }: { lang?: L; month: string; pick?: boolean; cat?: Exclude<Cat, 'IR'>; country?: Country; pd?: string; methodHref?: string }) {
  const f = fm(lang);
  const [month, setMonth] = useState(m0);
  const [cat, setCat] = useState<Exclude<Cat, 'IR'>>(c0);
  const [country, setCountry] = useState<Country>(k0);
  const [pd, setPd] = useState(p0);
  const i = MONTHS.indexOf(month);
  const ok = isIso(pd) && i >= 0;
  const out = useMemo(() => {
    if (!ok) return null;
    const p = isoToDays(pd);
    const at = (chart: 'FAD' | 'DFF') => { const s = series(cat, country, chart); const raw = s?.[i]; if (raw === undefined || raw === null) return { cell: 'U', cur: false }; const v = resolve(s, MONTHS, i)!; return { cell: raw === CURRENT ? 'C' : daysToIso(v), cur: raw === CURRENT || p < v }; };
    const fad = at('FAD'), dff = month >= '2015-10' ? at('DFF') : null;
    const later = fad.cur ? null : actualWait(series(cat, country, 'FAD'), MONTHS, i, p);
    return { fad, dff, later };
  }, [ok, pd, cat, country, i, month]);
  const show = (c: string) => (c === 'C' ? tx(lang, 'Current', 'Al día') : c === 'U' ? tx(lang, 'Unavailable', 'No disponible') : f.date(c));
  const rows: Row[] = [];
  if (out) {
    rows.push({ label: tx(lang, 'Final Action Date', 'Fecha de acción final'), value: show(out.fad.cell) });
    if (out.dff) rows.push({ label: tx(lang, 'Date for Filing', 'Fecha de presentación'), value: `${show(out.dff.cell)} · ${out.dff.cur ? tx(lang, 'yours qualified', 'la suya calificaba') : tx(lang, 'yours did not', 'la suya no')}` });
    if (!out.fad.cur) rows.push({ label: tx(lang, 'Became current later', 'Se puso al día después'), value: out.later ? tx(lang, `${f.month(MONTHS[i + out.later])}, ${span(lang, out.later)} later`, `${f.month(MONTHS[i + out.later])}, ${span(lang, out.later)} después`) : tx(lang, 'not yet', 'todavía no'), strong: true });
  }
  return (
    <div className={frame} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={layout}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <SelectField id="bc-cat" label={tx(lang, 'Category', 'Categoría')} value={cat} onChange={(v) => setCat(v as Exclude<Cat, 'IR'>)} options={QUEUE_CATS.map((c) => ({ value: c, label: CAT_LABEL[lang][c] }))} />
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="bc-country" label={tx(lang, 'Country of chargeability', 'País de cargo')} value={country} onChange={(v) => setCountry(v as Country)} options={COUNTRIES.map((c) => ({ value: c, label: COUNTRY_LABEL[lang][c] }))} />
            <DateField id="bc-pd" label={tx(lang, 'Priority date', 'Fecha de prioridad')} value={pd} onChange={setPd} />
          </div>
          {pick && <SelectField id="bc-month" label={tx(lang, 'Bulletin month', 'Mes del boletín')} value={month} onChange={setMonth} options={MONTHS.filter((m) => series('F1', 'ROW', 'FAD')[MONTHS.indexOf(m)] !== null).slice().reverse().map((m) => ({ value: m, label: f.month(m) }))} />}
        </form>
        <div aria-live="polite" data-resultat className={box}>
          <Head label={tx(lang, `In the ${f.month(month)} bulletin`, `En el boletín de ${f.month(month)}`)} value={!out ? '—' : out.fad.cur ? tx(lang, 'Current', 'Al día') : tx(lang, 'Not current', 'No al día')} sub={CAT_LABEL[lang][cat]} />
          <Rows rows={rows} />
          <Disclaimer lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
