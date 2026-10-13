/** Guide « Final Action Dates ou Dates for Filing » : quel tableau USCIS impose, et ce qu'il change pour moi. */
import { evaluate, filingChart, LATEST, type Cat, type Country } from '../engine/cases';
import type { MiniSpec } from '../mini-types';
import { tx, catOpts, countryOpts, f, iso, type Lang } from './_kit';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'Which chart lets me file this month?', '¿Qué tabla me deja presentar este mes?'),
  cta: tx(l, 'See the full forecast', 'Ver el pronóstico completo'),
  inputs: [
    { id: 'cat', label: tx(l, 'Category', 'Categoría'), type: 'select', def: 'EB3', options: catOpts(l) },
    { id: 'country', label: tx(l, 'Country of chargeability', 'País de cargo'), type: 'select', def: 'IN', options: countryOpts(l) },
    { id: 'pd', label: tx(l, 'Priority date', 'Fecha de prioridad'), type: 'date', def: '2014-09-01' },
  ],
  run: (v) => {
    const F = f(l);
    if (!iso(v.pd)) return { head: ['', '–'], rows: [] };
    const r = evaluate(v.cat as Cat, v.country as Country, v.pd);
    const chart = filingChart(v.cat as Cat);
    return {
      head: [tx(l, `USCIS chart for ${F.month(LATEST)}`, `Tabla de USCIS en ${F.month(LATEST)}`), chart === 'DFF' ? tx(l, 'Dates for Filing', 'Fechas de presentación') : tx(l, 'Final Action Dates', 'Fechas de acción final')],
      rows: [[tx(l, 'Final Action Date', 'Acción final'), F.cell(r.fad)], [tx(l, 'Date for Filing', 'Presentación'), F.cell(r.dff)], [tx(l, 'File the I-485 now?', '¿Presentar el I-485 ya?'), r.canFile ? tx(l, 'Yes', 'Sí') : 'No'], [tx(l, 'Approval possible now?', '¿Aprobación posible ya?'), r.status === 'current' ? tx(l, 'Yes', 'Sí') : 'No']],
    };
  },
});
