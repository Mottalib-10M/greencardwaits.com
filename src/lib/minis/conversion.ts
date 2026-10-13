/** Guide « F2B devient F1 à la naturalisation du parent » : comparer les deux dates pour la même priorité. */
import { evaluate, type Country } from '../engine/cases';
import type { MiniSpec } from '../mini-types';
import { tx, countryOpts, f, iso, months, type Lang } from './_kit';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'If my parent naturalizes: F2B or F1?', 'Si mi padre se hace ciudadano: ¿F2B o F1?'),
  cta: tx(l, 'Full forecast for my case', 'Pronóstico completo de mi caso'),
  inputs: [
    { id: 'country', label: tx(l, 'Country of chargeability', 'País de cargo'), type: 'select', def: 'PH', options: countryOpts(l) },
    { id: 'pd', label: tx(l, 'Priority date', 'Fecha de prioridad'), type: 'date', def: '2014-06-01' },
  ],
  run: (v) => {
    const F = f(l);
    if (!iso(v.pd)) return { head: ['', '—'], rows: [] };
    const a = evaluate('F2B', v.country as Country, v.pd), b = evaluate('F1', v.country as Country, v.pd);
    const d = (a.behindMonths || 0) - (b.behindMonths || 0);
    const best = d > 0.5 ? 'F1' : d < -0.5 ? 'F2B' : tx(l, 'about the same', 'casi igual');
    return {
      head: [tx(l, 'Closer to current today', 'Más cerca de estar al día hoy'), best],
      rows: [['F2B', a.status === 'current' ? tx(l, 'Current', 'Al día') : tx(l, `${months(l, a.behindMonths)} behind`, `${months(l, a.behindMonths)} detrás`)], ['F1', b.status === 'current' ? tx(l, 'Current', 'Al día') : tx(l, `${months(l, b.behindMonths)} behind`, `${months(l, b.behindMonths)} detrás`)]],
      note: tx(l, 'If F1 is slower, the beneficiary can ask to stay in F2B (INA 204(k)).', 'Si F1 es más lenta, el beneficiario puede pedir seguir en F2B (INA 204(k)).'),
    };
  },
});
