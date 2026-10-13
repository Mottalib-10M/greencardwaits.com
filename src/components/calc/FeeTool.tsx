/** Calculateur de frais : parcours et options → total ligne par ligne (G-1055, édition 10/07/26, et frais de visa). */
import { useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { Rows, Head, Steps, Actions, Disclaimer, box, frame, layout, tx, fm, type L, type Row } from './kit';
import { feeTotal, DEFAULT_FEES, type Path } from '../../lib/engine/fees';
import P from '../../data/params-2026.json';

const PATHS: Path[] = ['marriage', 'family-consular', 'employment', 'employment-consular', 'k1', 'n400', 'i751', 'i90'];
const PATH_LABEL: Record<L, Record<Path, string>> = {
  en: { marriage: 'Family green card, inside the U.S. (I-130 + I-485)', 'family-consular': 'Family green card through a consulate', employment: 'Employment green card, inside the U.S. (I-140 + I-485)', 'employment-consular': 'Employment green card through a consulate', k1: 'Fiancé(e) visa K-1, then I-485', n400: 'Citizenship (N-400)', i751: 'Remove conditions (I-751)', i90: 'Renew or replace a green card (I-90)' },
  es: { marriage: 'Green card familiar dentro de EE. UU. (I-130 + I-485)', 'family-consular': 'Green card familiar por consulado', employment: 'Green card por empleo dentro de EE. UU. (I-140 + I-485)', 'employment-consular': 'Green card por empleo por consulado', k1: 'Visa de prometido(a) K-1 y luego I-485', n400: 'Ciudadanía (N-400)', i751: 'Retirar condiciones (I-751)', i90: 'Renovar o reemplazar la green card (I-90)' },
};
const yn = (l: L) => [{ value: '1', label: tx(l, 'Yes', 'Sí') }, { value: '0', label: 'No' }];

export default function FeeTool({ lang = 'en', path: p0 = 'marriage', methodHref }: { lang?: L; path?: Path; methodHref?: string }) {
  const f = fm(lang);
  const [path, setPath] = useState<Path>(p0);
  const [online, setOnline] = useState('0');
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [ead, setEad] = useState('1');
  const [ap, setAp] = useState('1');
  const [reduced, setReduced] = useState('0');
  const [small, setSmall] = useState('0');
  const aos = path === 'marriage' || path === 'employment' || path === 'k1';
  const consular = path === 'family-consular' || path === 'employment-consular' || path === 'k1';
  const x = { ...DEFAULT_FEES, path, online: online === '1' && reduced !== '1', extraAdults: adults, kidsUnder14: kids, ead: aos && ead === '1', advanceParole: aos && ap === '1', reducedN400: reduced === '1', smallEmployer: small === '1', consularApplicants: 1 + (consular ? adults + kids : 0) };
  const t = feeTotal(x);
  const rows: Row[] = t.lines.map((l) => ({ label: `${l.form} · ${l.label[lang]}${l.count > 1 ? ` × ${l.count}` : ''}`, value: f.usd(l.amount * l.count), muted: l.amount === 0 }));
  rows.push({ label: tx(lang, 'Paid to USCIS', 'Pagado a USCIS'), value: f.usd(t.uscis), sep: true });
  if (t.dos) rows.push({ label: tx(lang, 'Paid to the State Department', 'Pagado al Departamento de Estado'), value: f.usd(t.dos) });
  rows.push({ label: tx(lang, 'Total government fees', 'Total de tarifas del gobierno'), value: f.usd(t.total), strong: true });
  const steps = [
    tx(lang, `Amounts from USCIS Form G-1055, edition ${P.g1055_edition}, and the State Department fee page, read on ${f.date(P.retrieved_at)}.`, `Montos del formulario G-1055 de USCIS, edición del ${P.g1055_edition}, y de la página de tarifas del Departamento de Estado, leídos el ${f.date(P.retrieved_at)}.`),
    tx(lang, 'Not counted because no agency sets them: the civil surgeon’s medical exam, translations, photos and any lawyer.', 'No se cuentan porque ninguna agencia los fija: el examen del médico autorizado, traducciones, fotos y abogado.'),
  ];
  return (
    <div className={frame} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={layout}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <SelectField id="fe-path" label={tx(lang, 'What are you filing?', '¿Qué va a presentar?')} value={path} onChange={(v) => setPath(v as Path)} options={PATHS.map((p) => ({ value: p, label: PATH_LABEL[lang][p] }))} />
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <Toggle id="fe-online" label={tx(lang, 'File online where possible?', '¿Presentar en línea?')} value={reduced === '1' ? '0' : online} onChange={setOnline} options={yn(lang)} />
            {path === 'n400' ? <Toggle id="fe-reduced" label={tx(lang, 'Income at or under 400% of poverty line?', '¿Ingresos hasta el 400 % de la pobreza?')} value={reduced} onChange={setReduced} options={yn(lang)} />
              : path.startsWith('employment') ? <Toggle id="fe-small" label={tx(lang, 'Employer with 25 staff or fewer?', '¿Empleador con 25 o menos?')} value={small} onChange={setSmall} options={yn(lang)} /> : <div />}
          </div>
          {(aos || consular) && path !== 'n400' && (
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <NumberField id="fe-adults" label={tx(lang, 'Other family members aged 14 or older', 'Otros familiares de 14 años o más')} value={adults} onChange={setAdults} max={9} />
              <NumberField id="fe-kids" label={tx(lang, 'Children under 14 filing with a parent', 'Menores de 14 con un padre')} value={kids} onChange={setKids} max={9} />
            </div>
          )}
          {aos && (
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <Toggle id="fe-ead" label={tx(lang, 'Work permit (I-765)?', '¿Permiso de trabajo (I-765)?')} value={ead} onChange={setEad} options={yn(lang)} />
              <Toggle id="fe-ap" label={tx(lang, 'Travel permit (I-131)?', '¿Permiso de viaje (I-131)?')} value={ap} onChange={setAp} options={yn(lang)} />
            </div>
          )}
        </form>
        <div aria-live="polite" data-resultat className={box}>
          <Head label={PATH_LABEL[lang][path]} value={f.usd(t.total)} sub={tx(lang, `Edition ${P.g1055_edition} of the USCIS fee schedule`, `Edición del ${P.g1055_edition} de la tabla de USCIS`)} />
          <Rows rows={rows} />
          <Steps lang={lang} steps={steps} />
          <Actions lang={lang} text={() => `${PATH_LABEL[lang][path]}: ${f.usd(t.total)}`} />
          <Disclaimer lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
