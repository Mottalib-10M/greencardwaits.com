/** Âge CSPA : naissance, dépôt et approbation de la pétition, mois où la date devient courante → protégé ou non. */
import { useState } from 'react';
import { Rows, Head, Steps, Actions, Disclaimer, DateField, box, frame, layout, tx, fm, isIso, type L, type Row } from './kit';
import { cspa } from '../../lib/engine/rules';

export default function CspaTool({ lang = 'en', methodHref }: { lang?: L; methodHref?: string }) {
  const f = fm(lang);
  const [birth, setBirth] = useState('2004-06-01');
  const [filed, setFiled] = useState('2019-03-01');
  const [approved, setApproved] = useState('2020-02-01');
  const [avail, setAvail] = useState('2025-09-01');
  const ok = [birth, filed, approved, avail].every(isIso) && filed <= approved;
  const r = ok ? cspa({ birth, petitionFiled: filed, petitionApproved: approved, visaAvailable: avail }) : null;
  const yrs = (d: number) => f.num(d / 365.25, 2);
  const rows: Row[] = r ? [
    { label: tx(lang, 'Visa available on', 'Visa disponible el'), value: f.date(r.availability) },
    { label: tx(lang, 'Age that day', 'Edad ese día'), value: tx(lang, `${yrs(r.ageDays)} years`, `${yrs(r.ageDays)} años`) },
    { label: tx(lang, 'Petition pending', 'Petición pendiente'), value: tx(lang, `${f.num(r.pendingDays)} days`, `${f.num(r.pendingDays)} días`) },
    { label: tx(lang, 'CSPA age', 'Edad CSPA'), value: tx(lang, `${yrs(r.cspaDays)} years`, `${yrs(r.cspaDays)} años`), strong: true, sep: true },
    { label: tx(lang, 'Seek to acquire by', 'Debe solicitar antes del'), value: f.date(r.soughtBy) },
  ] : [];
  const steps = [
    tx(lang, 'Visa availability is the later of the petition approval and the first day of the bulletin month in which your priority date is current on the Final Action Dates chart (USCIS Policy Manual, Vol. 7, Part A, Ch. 7).', 'La disponibilidad del visa es la más tardía entre la aprobación de la petición y el primer día del mes del boletín en que su fecha está al día en la tabla de acción final (Manual de USCIS, vol. 7, parte A, cap. 7).'),
    tx(lang, 'CSPA age = age on that date minus the days the petition was pending (approval date minus filing date). Under 21: still a child, if unmarried and if you file within one year.', 'Edad CSPA = edad en esa fecha menos los días que la petición estuvo pendiente. Menos de 21: sigue siendo hijo, si sigue soltero y presenta dentro de un año.'),
  ];
  return (
    <div className={frame} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={layout}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <DateField id="cs-birth" label={tx(lang, 'Child’s date of birth', 'Fecha de nacimiento del hijo')} value={birth} onChange={setBirth} min="1980-01-01" />
            <DateField id="cs-avail" label={tx(lang, 'Month the date became current', 'Mes en que la fecha se puso al día')} value={avail} onChange={setAvail} min="2002-08-06" max="2040-12-31" />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <DateField id="cs-filed" label={tx(lang, 'Petition filed (I-130 or I-140)', 'Petición presentada (I-130 o I-140)')} value={filed} onChange={setFiled} min="1990-01-01" />
            <DateField id="cs-approved" label={tx(lang, 'Petition approved', 'Petición aprobada')} value={approved} onChange={setApproved} min="1990-01-01" />
          </div>
        </form>
        <div aria-live="polite" data-resultat className={box}>
          <Head label={tx(lang, 'Child Status Protection Act', 'Ley de Protección del Estatus del Menor')} value={!r ? '—' : r.protected ? tx(lang, 'Protected: under 21', 'Protegido: menos de 21') : tx(lang, 'Ages out', 'Pierde la edad')} sub={r ? tx(lang, `CSPA age ${yrs(r.cspaDays)}`, `Edad CSPA ${yrs(r.cspaDays)}`) : ''} />
          <Rows rows={rows} />
          <Steps lang={lang} steps={steps} />
          <Actions lang={lang} text={() => (r ? `CSPA: ${yrs(r.cspaDays)}` : '')} />
          <Disclaimer lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
