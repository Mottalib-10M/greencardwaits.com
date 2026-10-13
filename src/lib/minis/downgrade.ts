/** Guide « passer d'EB-2 à EB-3 » : comparer les deux cases du pays pour la même date de priorité. */
import { evaluate, type Country } from '../engine/cases';
import type { MiniSpec } from '../mini-types';
import { tx, countryOpts, f, iso, months, type Lang } from './_kit';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'EB-2 or EB-3: which is ahead for my date?', 'EB-2 o EB-3: ¿cuál va adelante para mi fecha?'),
  cta: tx(l, 'Forecast both in the full calculator', 'Pronosticar ambas en la calculadora'),
  inputs: [
    { id: 'country', label: tx(l, 'Country of chargeability', 'País de cargo'), type: 'select', def: 'IN', options: countryOpts(l) },
    { id: 'pd', label: tx(l, 'Priority date', 'Fecha de prioridad'), type: 'date', def: '2014-03-01' },
  ],
  run: (v) => {
    const F = f(l);
    if (!iso(v.pd)) return { head: ['', '–'], rows: [] };
    const a = evaluate('EB2', v.country as Country, v.pd), b = evaluate('EB3', v.country as Country, v.pd);
    const ahead = Math.abs(a.behindMonths - b.behindMonths) < 0.5 ? tx(l, 'Tied', 'Empate') : a.behindMonths < b.behindMonths ? 'EB-2' : 'EB-3';
    const w = (r: typeof a) => (r.status === 'current' ? tx(l, 'Current', 'Al día') : tx(l, `${months(l, r.behindMonths)} behind`, `${months(l, r.behindMonths)} detrás`));
    return { head: [tx(l, 'Ahead this month', 'Adelante este mes'), ahead], rows: [['EB-2', `${F.cell(a.fad)} · ${w(a)}`], ['EB-3', `${F.cell(b.fad)} · ${w(b)}`]], note: tx(l, 'Switching needs a new I-140 in EB-3; the priority date carries over once it is approved.', 'Cambiar exige un nuevo I-140 en EB-3; la fecha se conserva al aprobarse.') };
  },
});
