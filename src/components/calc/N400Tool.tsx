/** Naturalisation : date de résidence, 3 ou 5 ans, voyages → premier jour de dépôt, présence physique, absences longues. */
import { useEffect, useState } from 'react';
import Toggle from '../ui/Toggle';
import { Rows, Head, Steps, Actions, Disclaimer, DateField, box, frame, layout, tx, fm, isIso, type L, type Row } from './kit';
import { n400 } from '../../lib/engine/rules';

declare const __BUILD_DAY__: string;

export default function N400Tool({ lang = 'en', methodHref }: { lang?: L; methodHref?: string }) {
  const f = fm(lang);
  const [since, setSince] = useState('2021-11-15');
  const [spouse, setSpouse] = useState('0');
  const [t1o, setT1o] = useState('2024-06-01');
  const [t1b, setT1b] = useState('2024-07-15');
  const [t2o, setT2o] = useState('');
  const [t2b, setT2b] = useState('');
  const [today, setToday] = useState(__BUILD_DAY__);
  useEffect(() => { setToday(new Date().toISOString().slice(0, 10)); }, []);
  const ok = isIso(since);
  const trips = [[t1o, t1b], [t2o, t2b]].filter(([a, b]) => isIso(a) && isIso(b)).map(([out, back]) => ({ out, back }));
  const r = ok ? n400({ residentSince: since, spouseOfCitizen: spouse === '1', trips, today }) : null;
  const rows: Row[] = r ? [
    { label: tx(lang, `${r.years}-year anniversary`, `Aniversario de ${r.years} años`), value: f.date(r.anniversary) },
    { label: tx(lang, 'Earliest filing day (90 days before)', 'Primer día para presentar (90 días antes)'), value: f.date(r.earliestFiling), strong: true },
    { label: tx(lang, 'Days outside the U.S. in the period', 'Días fuera de EE. UU. en el periodo'), value: f.num(r.daysAbroad) },
    { label: tx(lang, 'Days present / required', 'Días presente / requeridos'), value: `${f.num(r.daysPresent)} / ${f.num(r.daysRequired)}` },
    { label: tx(lang, 'Trips over 6 months / of a year or more', 'Viajes de más de 6 meses / de un año o más'), value: `${r.longTrips} / ${r.breakingTrips}` },
  ] : [];
  const verdict = !r ? '–' : r.breakingTrips ? tx(lang, 'Residence broken', 'Residencia interrumpida') : !r.presenceOk ? tx(lang, 'Too few days present', 'Pocos días presente') : r.canFileToday ? tx(lang, 'You can file now', 'Ya puede presentar') : f.date(r.earliestFiling);
  const steps = [
    tx(lang, 'USCIS accepts Form N-400 up to 90 days before the 5-year (or 3-year, married to a U.S. citizen) anniversary of the date on your green card.', 'USCIS acepta el N-400 hasta 90 días antes del aniversario de 5 años (o 3 si está casado con un ciudadano) de la fecha de su green card.'),
    tx(lang, 'Physical presence: at least half the period, 913 days (548). The days you leave and return count as days present.', 'Presencia física: al menos la mitad del periodo, 913 días (548). Los días de salida y regreso cuentan como presentes.'),
    tx(lang, 'An absence of more than 6 months but less than a year raises a presumption that residence was broken; a year or more breaks it.', 'Una ausencia de más de 6 meses y menos de un año hace presumir que se interrumpió la residencia; un año o más la interrumpe.'),
  ];
  return (
    <div className={frame} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={layout}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <DateField id="n4-since" label={tx(lang, '“Resident since” date on your card', 'Fecha “Resident since” de su tarjeta')} value={since} onChange={setSince} min="1990-01-01" />
            <Toggle id="n4-spouse" label={tx(lang, 'Married to a U.S. citizen?', '¿Casado con un ciudadano?')} value={spouse} onChange={setSpouse} options={[{ value: '1', label: tx(lang, 'Yes', 'Sí') }, { value: '0', label: 'No' }]} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <DateField id="n4-t1o" label={tx(lang, 'Longest trip: left on', 'Viaje más largo: salió el')} value={t1o} onChange={setT1o} min="1990-01-01" />
            <DateField id="n4-t1b" label={tx(lang, 'Came back on', 'Regresó el')} value={t1b} onChange={setT1b} min="1990-01-01" />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <DateField id="n4-t2o" label={tx(lang, 'Another trip: left on', 'Otro viaje: salió el')} value={t2o} onChange={setT2o} min="1990-01-01" />
            <DateField id="n4-t2b" label={tx(lang, 'Came back on', 'Regresó el')} value={t2b} onChange={setT2b} min="1990-01-01" />
          </div>
        </form>
        <div aria-live="polite" data-resultat className={box}>
          <Head label={tx(lang, 'Form N-400', 'Formulario N-400')} value={verdict} sub={r ? tx(lang, `Earliest filing day: ${f.date(r.earliestFiling)}`, `Primer día para presentar: ${f.date(r.earliestFiling)}`) : ''} />
          <Rows rows={rows} />
          <Steps lang={lang} steps={steps} />
          <Actions lang={lang} text={() => `N-400: ${verdict}`} />
          <Disclaimer lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
