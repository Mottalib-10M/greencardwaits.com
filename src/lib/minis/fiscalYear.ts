/** Guide « exercice fiscal et sortie du bulletin » : à quel exercice appartient un mois, quand sort le bulletin. */
import type { MiniSpec } from '../mini-types';
import { tx, f, iso, type Lang } from './_kit';
import { addMonths } from '../engine/forecast';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'Which fiscal year, and when is the next bulletin due?', '¿Qué año fiscal y cuándo sale el próximo boletín?'),
  cta: tx(l, 'Open this month’s bulletin', 'Abrir el boletín del mes'),
  inputs: [{ id: 'd', label: tx(l, 'A date', 'Una fecha'), type: 'date', def: '2026-10-13' }],
  run: (v) => {
    const F = f(l);
    if (!iso(v.d)) return { head: ['', '—'], rows: [] };
    const y = Number(v.d.slice(0, 4)), m = Number(v.d.slice(5, 7));
    const fy = m >= 10 ? y + 1 : y;
    const next = addMonths(v.d.slice(0, 7), 1);
    return {
      head: [tx(l, 'Federal fiscal year', 'Año fiscal federal'), `FY ${fy}`],
      rows: [[tx(l, 'Fiscal year runs', 'El año fiscal va'), `${F.date(`${fy - 1}-10-01`)} – ${F.date(`${fy}-09-30`)}`], [tx(l, 'Next bulletin covers', 'El próximo boletín cubre'), F.month(next)], [tx(l, 'Usually published', 'Suele publicarse'), tx(l, `mid-${F.month(v.d.slice(0, 7))}`, `a mediados de ${F.month(v.d.slice(0, 7))}`)], [tx(l, 'New yearly numbers', 'Nuevos números anuales'), m >= 10 && m <= 12 ? tx(l, 'just reset (October)', 'recién renovados (octubre)') : tx(l, `October ${m >= 10 ? y + 1 : y}`, `octubre de ${m >= 10 ? y + 1 : y}`)]],
    };
  },
});
