/** Guide « résidence continue et présence physique » : jours présents pour un total de jours à l'étranger. */
import type { MiniSpec } from '../mini-types';
import { tx, f, type Lang } from './_kit';
import P from '../../data/params-2026.json';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'Enough days in the U.S. for the N-400?', '¿Suficientes días en EE. UU. para el N-400?'),
  cta: tx(l, 'Check your exact filing date', 'Calcular su fecha exacta'),
  inputs: [
    { id: 'path', label: tx(l, 'Rule', 'Regla'), type: 'select', def: '5', options: [{ value: '5', label: tx(l, '5 years', '5 años') }, { value: '3', label: tx(l, '3 years (married to a citizen)', '3 años (casado con ciudadano)') }] },
    { id: 'away', label: tx(l, 'Total days outside the U.S. in the period', 'Días totales fuera de EE. UU.'), type: 'number', def: '400', max: 2000, unit: tx(l, 'days', 'días') },
    { id: 'longest', label: tx(l, 'Longest single trip', 'Viaje más largo'), type: 'number', def: '90', max: 2000, unit: tx(l, 'days', 'días') },
  ],
  run: (v) => {
    const F = f(l);
    const N = P.naturalization;
    const five = v.path === '5';
    const total = five ? 1826 : 1096;
    const need = five ? N.physicalPresenceDays5 : N.physicalPresenceDays3;
    const present = total - (Number(v.away) || 0);
    const lg = Number(v.longest) || 0;
    const res = lg >= 365 ? tx(l, 'broken (a year or more)', 'interrumpida (un año o más)') : lg > 182 ? tx(l, 'presumed broken (over 6 months)', 'se presume interrumpida (más de 6 meses)') : tx(l, 'not affected', 'no afectada');
    return { head: [tx(l, 'Physical presence', 'Presencia física'), present >= need ? tx(l, 'Enough', 'Suficiente') : tx(l, 'Short', 'Insuficiente')], rows: [[tx(l, 'Days present / required', 'Días presente / requeridos'), `${F.num(present)} / ${F.num(need)}`], [tx(l, 'Continuous residence', 'Residencia continua'), res]] };
  },
});
