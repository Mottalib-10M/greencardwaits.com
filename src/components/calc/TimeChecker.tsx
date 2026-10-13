/**
 * Vérificateur de délai USCIS : formulaire, bureau ou centre, date de réception (avis I-797) → mois écoulés,
 * position dans la fourchette publiée, et date à partir de laquelle USCIS accepte une demande de renseignement.
 * Premier rendu : date du build (__BUILD_DAY__), remplacée par la date du jour après le montage (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { Rows, Head, Steps, Actions, Disclaimer, DateField, box, frame, layout, tx, fm, isIso, type L, type Row } from './kit';
import { KINDS, kindById, OFFICES, centerRows, band, PUBLISHED, NATIONAL, NATIONAL_MONTH } from '../../lib/engine/ptimes';
import { checkTime } from '../../lib/engine/rules';

declare const __BUILD_DAY__: string;
const FIELD = Object.entries(OFFICES).sort((a, b) => a[1].name.localeCompare(b[1].name));
const NAT_KEY: Record<string, string> = { n400: 'N-400', i485fam: 'I-485 family', i485emp: 'I-485 employment', i130ir: 'I-130', i130f2a: 'I-130', i130f1: 'I-130', i130f2b: 'I-130', i130f3: 'I-130', i130f4: 'I-130', i765c9: 'I-765', i751: 'I-751' };

export default function TimeChecker({ lang = 'en', kind: k0 = 'n400', office: o0 = 'HOU', receipt: r0 = '2025-10-01', methodHref }: { lang?: L; kind?: string; office?: string; receipt?: string; methodHref?: string }) {
  const f = fm(lang);
  const [kind, setKind] = useState(k0);
  const [office, setOffice] = useState(o0);
  const [receipt, setReceipt] = useState(r0);
  const [today, setToday] = useState(__BUILD_DAY__);
  useEffect(() => { setToday(new Date().toISOString().slice(0, 10)); }, []);
  const k = kindById(kind) ?? KINDS[0];
  const centers = k.field ? [] : centerRows(k);
  const where = k.field ? (OFFICES[office] ? office : 'HOU') : (centers.find((c) => c.office === office)?.office ?? centers[0]?.office ?? '');
  const b = band(k, where);
  const ok = isIso(receipt) && receipt <= today;
  const c = useMemo(() => (ok && b ? checkTime(receipt, today, b.min, b.max, b.inquiry) : null), [ok, b, receipt, today]);
  const placeName = k.field ? OFFICES[where]?.name : centers.find((x) => x.office === where)?.name;
  const nat = NATIONAL[NAT_KEY[kind] ?? ''];
  const rows: Row[] = [];
  if (b) rows.push({ label: tx(lang, `Published range, ${placeName}`, `Rango publicado, ${placeName}`), value: b.max === null ? tx(lang, 'not published', 'no publicado') : tx(lang, `${b.min === null ? '–' : f.num(b.min, 1)} to ${f.num(b.max, 1)} months`, `${b.min === null ? '–' : f.num(b.min, 1)} a ${f.num(b.max, 1)} meses`) });
  if (c) rows.push({ label: tx(lang, 'Time since your receipt date', 'Tiempo desde su fecha de recibo'), value: tx(lang, `${f.num(c.elapsedMonths, 1)} months`, `${f.num(c.elapsedMonths, 1)} meses`), strong: true });
  if (b?.inquiry) rows.push({ label: tx(lang, 'USCIS takes inquiries for receipts on or before', 'USCIS acepta consultas para recibos hasta el'), value: f.date(b.inquiry) });
  if (nat) rows.push({ label: tx(lang, `National average to a decision (${NATIONAL_MONTH})`, `Promedio nacional hasta la decisión (${NATIONAL_MONTH})`), value: tx(lang, `${f.num(nat, 1)} months`, `${f.num(nat, 1)} meses`), muted: true });
  const value = !c ? tx(lang, 'Enter your receipt date', 'Escriba su fecha de recibo') : c.state === 'unknown' ? tx(lang, 'No published range', 'Sin rango publicado') : c.state === 'outside' ? tx(lang, 'Outside normal time', 'Fuera del tiempo normal') : tx(lang, 'Within normal time', 'Dentro del tiempo normal');
  const sub = c ? (c.canInquire ? tx(lang, 'You can submit a case inquiry to USCIS now.', 'Ya puede enviar una consulta de caso a USCIS.') : b?.inquiry ? tx(lang, 'Too early for a case inquiry.', 'Aún es pronto para una consulta de caso.') : '') : '';
  const steps = [
    tx(lang, `USCIS published these ranges on ${f.date(PUBLISHED)}. The upper figure is the time within which USCIS completed 80% of cases; the lower one is the median.`, `USCIS publicó estos rangos el ${f.date(PUBLISHED)}. La cifra alta es el plazo en que USCIS terminó el 80 % de los casos; la baja, la mediana.`),
    tx(lang, 'The national average is a different measure: all cases completed in the month, from receipt to decision, as reported to Congress.', 'El promedio nacional es otra medida: todos los casos terminados en el mes, del recibo a la decisión, según el informe al Congreso.'),
  ];
  return (
    <div className={frame} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={layout}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <SelectField id="pt-kind" label={tx(lang, 'Form and category', 'Formulario y categoría')} value={kind} onChange={setKind} options={KINDS.map((x) => ({ value: x.id, label: x.label[lang] }))} />
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            {k.field
              ? <SelectField id="pt-office" label={tx(lang, 'USCIS field office', 'Oficina de USCIS')} value={where} onChange={setOffice} options={FIELD.map(([code, o]) => ({ value: code, label: o.name }))} />
              : <SelectField id="pt-center" label={tx(lang, 'Office handling the form', 'Oficina que tramita')} value={where} onChange={setOffice} options={centers.length ? centers.map((x) => ({ value: x.office, label: x.name })) : [{ value: '', label: '–' }]} />}
            <DateField id="pt-receipt" label={tx(lang, 'Receipt date (Form I-797C)', 'Fecha de recibo (I-797C)')} value={receipt} onChange={setReceipt} min="2015-01-01" />
          </div>
        </form>
        <div aria-live="polite" data-resultat className={box}>
          <Head label={k.label[lang]} value={value} sub={sub} />
          <Rows rows={rows} />
          <Steps lang={lang} steps={steps} />
          <Actions lang={lang} text={() => `${k.label[lang]}, ${placeName}: ${value}`} />
          <p className="mt-3 text-xs text-navy-600">{tx(lang, 'Processing-time data: ImmigrationTimes.org (CC BY 4.0), from USCIS; selected and reformatted. Check your own case on egov.uscis.gov.', 'Datos de tiempos: ImmigrationTimes.org (CC BY 4.0), a partir de USCIS; seleccionados y reformateados. Verifique su caso en egov.uscis.gov.')}</p>
          <Disclaimer lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
