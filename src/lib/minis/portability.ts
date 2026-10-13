/** Guide « portabilité de la date de priorité » : la date retenue sur une nouvelle I-140, dans la nouvelle catégorie. */
import { evaluate, type Cat, type Country } from '../engine/cases';
import type { MiniSpec } from '../mini-types';
import { tx, catOpts, countryOpts, f, iso, months, type Lang } from './_kit';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'Where does my kept priority date land?', '¿Dónde queda mi fecha de prioridad conservada?'),
  cta: tx(l, 'Run the full forecast', 'Calcular el pronóstico completo'),
  inputs: [
    { id: 'pd', label: tx(l, 'Priority date of the first approved I-140', 'Fecha de prioridad del primer I-140 aprobado'), type: 'date', def: '2015-04-01' },
    { id: 'cat', label: tx(l, 'New petition category', 'Categoría de la nueva petición'), type: 'select', def: 'EB2', options: catOpts(l, ['EB1', 'EB2', 'EB3', 'EW']) },
    { id: 'country', label: tx(l, 'Country of chargeability', 'País de cargo'), type: 'select', def: 'IN', options: countryOpts(l) },
  ],
  run: (v) => {
    const F = f(l);
    if (!iso(v.pd)) return { head: ['', '—'], rows: [] };
    const r = evaluate(v.cat as Cat, v.country as Country, v.pd);
    return {
      head: [tx(l, 'In the new category', 'En la nueva categoría'), r.status === 'current' ? tx(l, 'Current', 'Al día') : tx(l, `${months(l, r.behindMonths)} behind`, `${months(l, r.behindMonths)} detrás`)],
      rows: [[tx(l, 'Final Action Date', 'Acción final'), F.cell(r.fad)], [tx(l, 'I-485 this month', 'I-485 este mes'), r.canFile ? tx(l, 'can be filed', 'se puede presentar') : tx(l, 'not yet', 'todavía no')]],
      note: tx(l, 'The date carries over unless the first I-140 was revoked for fraud, misrepresentation or an error by USCIS.', 'La fecha se conserva salvo que el primer I-140 se haya revocado por fraude, falsedad o error de USCIS.'),
    };
  },
});
