/**
 * Mini-simulateur de page (RECETTE §9.3) : deux ou trois champs, le chiffre du sujet de la page en avant, quelques
 * lignes de détail et un lien vers l'outil complet. Calcul fourni par `lib/minis/<kind>.ts` (moteurs du site).
 * Premier rendu = valeurs par défaut (§17.5). `data-chrome` : le widget ne compte pas dans la comparaison des pages.
 */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { DateField } from './kit';
import { getSpec } from '../../lib/mini-specs';

interface Props { kind: string; lang?: string; href?: string; lead?: boolean }

export default function MiniSim({ kind, lang = 'en', href, lead = false }: Props) {
  const spec = getSpec(kind, lang);
  const [v, setV] = useState<Record<string, string>>(() => Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])));
  const out = useMemo(() => spec.run(v), [v, spec]);
  const set = (id: string) => (x: string) => setV((o) => ({ ...o, [id]: x }));
  return (
    <div data-chrome data-mini={kind} data-simulateur-secondaire={lead ? undefined : ''} className={`not-prose rechner-mini ${lead ? 'mb-8 mt-0' : 'my-8'} rounded-xl border border-navy-200 border-l-4 border-l-accent-600 bg-white p-4 sm:p-5`}>
      <p className="text-base font-semibold text-navy-900">{spec.title}</p>
      <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0">
        <form className="grid content-start grid-cols-1 gap-y-3" onSubmit={(e) => e.preventDefault()}>
          {spec.inputs.map((i) => i.type === 'select'
            ? <SelectField key={i.id} id={`m-${kind}-${i.id}`} label={i.label} value={v[i.id]} onChange={set(i.id)} options={i.options ?? []} />
            : i.type === 'date'
              ? <DateField key={i.id} id={`m-${kind}-${i.id}`} label={i.label} value={v[i.id]} onChange={set(i.id)} />
              : <NumberField key={i.id} id={`m-${kind}-${i.id}`} label={i.label} value={Number(v[i.id]) || 0} onChange={(x) => set(i.id)(String(x))} unit={i.unit} max={i.max} />)}
        </form>
        <div aria-live="polite" data-resultat={lead ? '' : undefined} className="rounded-lg bg-accent-50/60 p-4">
          <p className="text-sm font-medium text-navy-700">{out.head[0]}</p>
          <p className="tabular-nums mt-1 text-2xl font-bold text-navy-900 [overflow-wrap:anywhere]">{out.head[1]}</p>
          <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
            {out.rows.map(([l, x]) => <tr key={l}><td className="py-1.5 pr-3 text-navy-700">{l}</td><td className="tabular-nums py-1.5 text-right text-navy-900 [overflow-wrap:anywhere]">{x}</td></tr>)}
          </tbody></table>
          {out.note && <p className="mt-2 text-xs text-navy-600">{out.note}</p>}
        </div>
      </div>
      {href && spec.cta && <a href={href} className="mt-4 inline-block text-sm font-medium text-accent-700 hover:underline">{spec.cta} →</a>}
    </div>
  );
}
