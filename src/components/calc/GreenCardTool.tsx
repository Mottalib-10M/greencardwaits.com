/**
 * Simulateur principal « When will my green card come? » : catégorie, pays de rattachement, date de priorité,
 * procédure et bureau USCIS → statut du mois, retard, fourchette de prévision avec son erreur passée (ou « no reliable
 * forecast »), possibilité de déposer l'I-485 selon le tableau imposé par USCIS, délai du bureau et frais G-1055.
 * Premier rendu = valeurs par défaut du build (RECETTE §17.5) ; aucune saisie ne quitte le navigateur, aucune n'est
 * écrite dans l'adresse de la page.
 */
import { useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Rows, Head, Steps, Actions, Disclaimer, DateField, box, frame, layout, tx, fm, span, isIso, type L, type Row } from './kit';
import { evaluate, CAT_LABEL, COUNTRY_LABEL, COUNTRIES, MONTHS, LATEST, LATEST_INDEX, series, isFamily, BACKTEST_FROM, BACKTEST_TO, type Cat, type Country } from '../../lib/engine/cases';
import { feeTotal, DEFAULT_FEES, type Path } from '../../lib/engine/fees';
import { isoToDays, addMonths } from '../../lib/engine/forecast';
import { chartSvg } from '../../lib/chart';
import PT from '../../data/ptimes-latest.json';

const CATS: Cat[] = ['IR', 'F1', 'F2A', 'F2B', 'F3', 'F4', 'EB1', 'EB2', 'EB3', 'EW', 'EB4', 'EB5'];
type Office = { name: string; n400: any; i485fam: { min: number | null; max: number | null } | null };
const OFFICES = PT.offices as unknown as Record<string, Office>;
const OFFICE_OPTS = Object.entries(OFFICES).sort((a, b) => a[1].name.localeCompare(b[1].name));

export interface GreenCardProps { lang?: L; cat?: Cat; country?: Country; pd?: string; methodHref?: string; feesHref?: string; compact?: boolean }

export default function GreenCardTool({ lang = 'en', cat: c0 = 'F2B', country: k0 = 'MX', pd: pd0, methodHref, feesHref, compact = false }: GreenCardProps) {
  const f = fm(lang);
  const [cat, setCat] = useState<Cat>(c0);
  const [country, setCountry] = useState<Country>(k0);
  const [pd, setPd] = useState(pd0 ?? '2012-06-15');
  const [where, setWhere] = useState<'us' | 'abroad'>('us');
  const [office, setOffice] = useState('');
  const ok = isIso(pd);
  const r = useMemo(() => (ok ? evaluate(cat, country, pd) : null), [cat, country, pd, ok]);
  const fam = isFamily(cat);
  const path: Path = where === 'abroad' ? (fam ? 'family-consular' : 'employment-consular') : fam ? 'marriage' : 'employment';
  const fees = feeTotal({ ...DEFAULT_FEES, path, ead: where === 'us', advanceParole: where === 'us' });
  const o = office ? OFFICES[office] : null;
  const natKey = fam ? 'I-485 family' : 'I-485 employment';
  const nat = (PT.national as Record<string, number>)[natKey];

  let label = '', value = '', sub = '';
  const rows: Row[] = [];
  const steps: string[] = [];
  if (!r) { label = tx(lang, 'Priority date', 'Fecha de prioridad'); value = tx(lang, 'Enter a date', 'Escriba una fecha'); }
  else if (r.status === 'noqueue') {
    label = tx(lang, 'Visa Bulletin wait', 'Espera del boletín'); value = tx(lang, 'No queue', 'Sin fila');
    sub = tx(lang, 'Immediate relatives are not subject to the yearly limits: only USCIS or the consulate sets the pace.', 'Los familiares inmediatos no están sujetos a los límites anuales: el ritmo lo marcan USCIS o el consulado.');
  } else if (r.status === 'current') {
    label = tx(lang, `${f.month(LATEST)} bulletin`, `Boletín de ${f.month(LATEST)}`); value = tx(lang, 'Current', 'Al día');
    sub = tx(lang, 'Your date is before the Final Action cutoff: a green card can be approved this month.', 'Su fecha es anterior a la fecha de acción final: la green card puede aprobarse este mes.');
  } else if (r.status === 'unavailable') {
    label = tx(lang, `${f.month(LATEST)} bulletin`, `Boletín de ${f.month(LATEST)}`); value = tx(lang, 'Unavailable', 'No disponible');
    sub = tx(lang, 'The category shows “U” this month: no visas can be issued until it reopens.', 'La categoría marca “U” este mes: no se emiten visas hasta que se reabra.');
  } else if (r.reliable && r.range) {
    label = tx(lang, 'Likely current', 'Probablemente al día');
    value = r.range[2] ? `${f.month(r.range[0]!)} – ${f.month(r.range[2])}` : tx(lang, `after ${f.month(r.range[0]!)}`, `después de ${f.month(r.range[0]!)}`);
    sub = tx(lang, `Middle estimate ${r.range[1] ? f.month(r.range[1]) : '—'} · ${span(lang, r.behindMonths)} behind the cutoff`, `Estimación central ${r.range[1] ? f.month(r.range[1]) : '—'} · ${span(lang, r.behindMonths)} detrás de la fecha límite`);
  } else {
    label = tx(lang, 'Forecast', 'Pronóstico'); value = tx(lang, 'No reliable forecast', 'Sin pronóstico fiable');
    sub = tx(lang, `${span(lang, r.behindMonths)} behind the cutoff. Past forecasts for this case missed too often to publish a date.`, `${span(lang, r.behindMonths)} detrás de la fecha límite. Los pronósticos pasados de este caso fallaron demasiado para publicar una fecha.`);
  }

  if (r && r.status !== 'noqueue') {
    rows.push({ label: tx(lang, 'Final Action Date', 'Fecha de acción final'), value: r.fad === 'C' ? tx(lang, 'Current', 'Al día') : r.fad === 'U' ? 'U' : f.date(r.fad) });
    rows.push({ label: tx(lang, 'Date for Filing', 'Fecha de presentación'), value: r.dff === 'C' ? tx(lang, 'Current', 'Al día') : r.dff === 'U' ? 'U' : f.date(r.dff) });
    if (where === 'us') rows.push({ label: tx(lang, `I-485 this month (USCIS uses ${r.filingChart === 'DFF' ? 'Dates for Filing' : 'Final Action'})`, `I-485 este mes (USCIS usa ${r.filingChart === 'DFF' ? 'fechas de presentación' : 'acción final'})`), value: r.canFile ? tx(lang, 'You can file', 'Puede presentarlo') : tx(lang, 'Not yet', 'Todavía no'), strong: true });
    if (r.status === 'waiting' && r.backtest) {
      const b = r.backtest;
      rows.push({ label: tx(lang, `Our past error at ${b.gapMonths} months behind`, `Nuestro error pasado a ${b.gapMonths} meses`), value: tx(lang, `±${f.num(b.medianError)} mo., range held ${f.pct(b.coverage)}`, `±${f.num(b.medianError)} meses, acierto ${f.pct(b.coverage)}`), muted: true });
    }
  }
  if (where === 'us') {
    if (fam && o?.i485fam?.max != null) rows.push({ label: tx(lang, `I-485 at ${o.name} (80% of cases)`, `I-485 en ${o.name} (80 % de los casos)`), value: tx(lang, `${f.num(o.i485fam.min ?? 0, 1)} to ${f.num(o.i485fam.max, 1)} months`, `${f.num(o.i485fam.min ?? 0, 1)} a ${f.num(o.i485fam.max, 1)} meses`) });
    else if (nat) rows.push({ label: tx(lang, `I-485 ${fam ? 'family' : 'employment'}, national average (${PT.nationalMonth})`, `I-485 ${fam ? 'familiar' : 'de empleo'}, promedio nacional (${PT.nationalMonth})`), value: tx(lang, `${f.num(nat, 1)} months`, `${f.num(nat, 1)} meses`) });
  } else rows.push({ label: tx(lang, 'Consulate interview wait', 'Espera de la entrevista consular'), value: tx(lang, 'not published', 'no publicada'), muted: true });
  rows.push({ label: tx(lang, `Government fees (${where === 'us' ? 'paper filing, with work permit and travel permit' : 'consular, one applicant'})`, `Tarifas del gobierno (${where === 'us' ? 'en papel, con permiso de trabajo y de viaje' : 'consular, un solicitante'})`), value: f.usd(fees.total), strong: true, sep: true });

  if (r && r.status === 'waiting' && r.forecast) {
    const fc = r.forecast;
    steps.push(tx(lang, `The ${f.month(LATEST)} Final Action Date for ${CAT_LABEL.en[cat].split(':')[0]}, ${COUNTRY_LABEL.en[country]}, is ${r.fad === 'C' ? 'current' : f.date(r.fad)}; your priority date is ${f.date(pd)}, ${span(lang, r.behindMonths)} later.`, `La fecha de acción final de ${f.month(LATEST)} para ${CAT_LABEL.es[cat].split(':')[0]}, ${COUNTRY_LABEL.es[country]}, es ${r.fad === 'C' ? 'al día' : f.date(r.fad)}; su fecha de prioridad es el ${f.date(pd)}, ${span(lang, r.behindMonths)} después.`));
    steps.push(tx(lang, `For each of the ${fc.samples} months of the last 10 years, we measured how long this cutoff took to move forward by that same distance. Half the cases took ${Number.isFinite(fc.p50) ? span(lang, fc.p50) : 'longer than the history shows'}; 20% took ${span(lang, fc.p20)} or less; 80% took ${Number.isFinite(fc.p80) ? span(lang, fc.p80) : 'more than the history shows'} or less.`, `En cada uno de los ${fc.samples} meses de los últimos 10 años medimos cuánto tardó esta fecha límite en avanzar esa misma distancia. La mitad tardó ${Number.isFinite(fc.p50) ? span(lang, fc.p50) : 'más de lo que muestra la historia'}; el 20 % tardó ${span(lang, fc.p20)} o menos; el 80 % tardó ${Number.isFinite(fc.p80) ? span(lang, fc.p80) : 'más de lo que muestra la historia'} o menos.`));
    if (r.backtest) steps.push(tx(lang, `Back-test from ${f.month(BACKTEST_FROM)} to ${f.month(BACKTEST_TO)}: for people ${r.backtest.gapMonths} months behind, the middle estimate was off by a median of ${f.num(r.backtest.medianError)} months (a naive “last 12 months” rule: ${Number.isFinite(r.backtest.naiveError) ? f.num(r.backtest.naiveError) : '—'}), and the range held the real date ${f.pct(r.backtest.coverage)} of the time. ${r.reliable ? 'That passes our publication rule.' : 'That fails our publication rule, so no date is shown.'}`, `Prueba retrospectiva de ${f.month(BACKTEST_FROM)} a ${f.month(BACKTEST_TO)}: para personas a ${r.backtest.gapMonths} meses, la estimación central falló por una mediana de ${f.num(r.backtest.medianError)} meses (regla ingenua de los últimos 12 meses: ${Number.isFinite(r.backtest.naiveError) ? f.num(r.backtest.naiveError) : '—'}) y el rango acertó el ${f.pct(r.backtest.coverage)} de las veces. ${r.reliable ? 'Eso cumple nuestra regla de publicación.' : 'Eso no cumple nuestra regla de publicación, así que no mostramos fecha.'}`));
    else steps.push(tx(lang, 'Your date is more than six years behind the cutoff, beyond the distances our back-test covers: no date is published.', 'Su fecha está más de seis años detrás de la fecha límite, fuera de lo que cubre nuestra prueba: no publicamos fecha.'));
  }
  steps.push(tx(lang, `Fees: ${fees.lines.filter((l) => l.amount > 0).map((l) => `${l.form} ${f.usd(l.amount)}${l.count > 1 ? ` × ${l.count}` : ''}`).join(' + ')} (USCIS Form G-1055, edition 10/07/26, and State Department visa fees).`, `Tarifas: ${fees.lines.filter((l) => l.amount > 0).map((l) => `${l.form} ${f.usd(l.amount)}${l.count > 1 ? ` × ${l.count}` : ''}`).join(' + ')} (formulario G-1055 de USCIS, edición del 10/07/26, y tarifas de visa del Departamento de Estado).`));

  const svg = useMemo(() => {
    if (!r || cat === 'IR' || compact) return '';
    const fc = r.forecast;
    return chartSvg({ months: MONTHS, fad: series(cat, country, 'FAD'), dff: series(cat, country, 'DFF'), from: '2012-01', pd: ok ? isoToDays(pd) : undefined, cone: r.status === 'waiting' && r.reliable && fc ? { t: LATEST_INDEX, p20: fc.p20, p80: fc.p80 } : undefined, title: tx(lang, 'Final Action cutoff since 2012 (solid), Dates for Filing (dashed), your priority date (red)', 'Fecha de acción final desde 2012 (continua), fecha de presentación (discontinua), su fecha de prioridad (rojo)') });
  }, [r, cat, country, pd, ok, compact, lang]);

  const next = addMonths(LATEST, 1);
  const ics = () => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Green Card Waits//EN\r\nBEGIN:VEVENT\r\nUID:vb-${next}@greencardwaits\r\nDTSTAMP:${LATEST.replace('-', '')}01T000000Z\r\nDTSTART;VALUE=DATE:${addMonths(LATEST, 0).replace('-', '')}15\r\nSUMMARY:${tx(lang, `Visa Bulletin for ${f.month(next)} usually out around now`, `El Visa Bulletin de ${f.month(next)} suele salir por estas fechas`)}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;

  return (
    <div className={frame} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={layout}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <SelectField id="gc-cat" label={tx(lang, 'Your category', 'Su categoría')} value={cat} onChange={(v) => setCat(v as Cat)} options={CATS.map((c) => ({ value: c, label: CAT_LABEL[lang][c] }))} />
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="gc-country" label={tx(lang, 'Country of chargeability (birth)', 'País de cargo (nacimiento)')} value={country} onChange={(v) => setCountry(v as Country)} options={COUNTRIES.map((c) => ({ value: c, label: COUNTRY_LABEL[lang][c] }))} />
            <DateField id="gc-pd" label={tx(lang, 'Priority date (on Form I-797)', 'Fecha de prioridad (en el I-797)')} value={pd} onChange={setPd} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <Toggle id="gc-where" label={tx(lang, 'Where will you apply?', '¿Dónde hará el trámite?')} value={where} onChange={(v) => setWhere(v as 'us' | 'abroad')} options={[{ value: 'us', label: tx(lang, 'In the U.S.', 'En EE. UU.') }, { value: 'abroad', label: tx(lang, 'Consulate', 'Consulado') }]} />
            <SelectField id="gc-office" label={tx(lang, 'USCIS field office (optional)', 'Oficina de USCIS (opcional)')} value={office} onChange={setOffice} options={[{ value: '', label: tx(lang, 'National average', 'Promedio nacional') }, ...OFFICE_OPTS.map(([code, x]) => ({ value: code, label: x.name }))]} />
          </div>
          {svg && <figure className="hidden lg:block"><div dangerouslySetInnerHTML={{ __html: svg }} /><figcaption className="mt-1 text-xs text-navy-600">{tx(lang, 'Final Action cutoff since 2012 (solid line), Dates for Filing (dashed), your priority date (red). Shaded: the forecast range.', 'Fecha de acción final desde 2012 (línea continua), fecha de presentación (discontinua), su fecha de prioridad (rojo). Sombreado: el rango del pronóstico.')}</figcaption></figure>}
        </form>
        <div aria-live="polite" data-resultat className={box}>
          <Head label={label} value={value} sub={sub} />
          <Rows rows={rows} />
          <Steps lang={lang} steps={steps} />
          <Actions lang={lang} ics={ics} text={() => `${label}: ${value}. ${sub}`} />
          {feesHref && <p className="mt-3 text-sm"><a className="font-medium text-accent-700 underline" href={feesHref}>{tx(lang, 'Fee details, line by line', 'Detalle de las tarifas')}</a></p>}
          <Disclaimer lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
