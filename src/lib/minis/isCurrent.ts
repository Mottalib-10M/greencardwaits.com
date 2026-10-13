/** Guide « priority date » : ma date est-elle courante ce mois-ci ? */
import { evaluate, LATEST, type Cat, type Country } from '../engine/cases';
import type { MiniSpec } from '../mini-types';
import { tx, catOpts, countryOpts, f, iso, months, type Lang } from './_kit';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'Is my priority date current this month?', '¿Mi fecha de prioridad está al día este mes?'),
  cta: tx(l, 'Full forecast with fees and office time', 'Pronóstico completo con tarifas y oficina'),
  inputs: [
    { id: 'cat', label: tx(l, 'Category', 'Categoría'), type: 'select', def: 'F2B', options: catOpts(l) },
    { id: 'country', label: tx(l, 'Country of chargeability', 'País de cargo'), type: 'select', def: 'ROW', options: countryOpts(l) },
    { id: 'pd', label: tx(l, 'Priority date', 'Fecha de prioridad'), type: 'date', def: '2019-03-01' },
  ],
  run: (v) => {
    const F = f(l);
    if (!iso(v.pd)) return { head: [tx(l, 'Priority date', 'Fecha de prioridad'), '—'], rows: [] };
    const r = evaluate(v.cat as Cat, v.country as Country, v.pd);
    return {
      head: [tx(l, `${F.month(LATEST)} Final Action chart`, `Tabla de acción final de ${F.month(LATEST)}`), r.status === 'current' ? tx(l, 'Current', 'Al día') : r.status === 'unavailable' ? tx(l, 'Unavailable', 'No disponible') : tx(l, 'Not current', 'No al día')],
      rows: [[tx(l, 'Cutoff', 'Fecha límite'), F.cell(r.fad)], [tx(l, 'Distance', 'Distancia'), r.behindMonths > 0 ? tx(l, `${months(l, r.behindMonths)} behind`, `${months(l, r.behindMonths)} detrás`) : tx(l, 'none', 'ninguna')], [tx(l, 'I-485 this month', 'I-485 este mes'), r.canFile ? tx(l, 'can be filed', 'se puede presentar') : tx(l, 'not yet', 'todavía no')]],
    };
  },
});
