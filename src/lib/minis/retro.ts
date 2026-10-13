/** Guide « rétrogression » : combien de reculs pour une case depuis 2001, et le plus grand. */
import { series, MONTHS, type Cat, type Country } from '../engine/cases';
import { resolve } from '../engine/forecast';
import type { MiniSpec } from '../mini-types';
import { tx, catOpts, countryOpts, f, type Lang } from './_kit';
export function retrogressions(cat: Exclude<Cat, 'IR'>, country: Country) {
  const s = series(cat, country, 'FAD');
  let n = 0, worst = 0, worstAt = '', prev: number | null = null;
  for (let i = 0; i < s.length; i++) {
    const v = resolve(s, MONTHS, i);
    if (v === null) continue;
    if (prev !== null && v < prev - 0.5) { n++; if (prev - v > worst) { worst = prev - v; worstAt = MONTHS[i]; } }
    prev = v;
  }
  return { n, worstMonths: worst / 30.4375, worstAt };
}
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'How often has this date gone backwards?', '¿Cuántas veces ha retrocedido esta fecha?'),
  cta: tx(l, 'See the full history and forecast', 'Ver la historia y el pronóstico'),
  inputs: [
    { id: 'cat', label: tx(l, 'Category', 'Categoría'), type: 'select', def: 'EB2', options: catOpts(l) },
    { id: 'country', label: tx(l, 'Country', 'País'), type: 'select', def: 'IN', options: countryOpts(l) },
  ],
  run: (v) => {
    const F = f(l);
    const r = retrogressions(v.cat as Exclude<Cat, 'IR'>, v.country as Country);
    return {
      head: [tx(l, `Retrogressions, ${F.month(MONTHS[0])} to ${F.month(MONTHS[MONTHS.length - 1])}`, `Retrocesos, ${F.month(MONTHS[0])} a ${F.month(MONTHS[MONTHS.length - 1])}`), F.num(r.n)],
      rows: r.n ? [[tx(l, 'Largest single step back', 'Mayor retroceso de un mes'), tx(l, `${F.num(r.worstMonths, 0)} months`, `${F.num(r.worstMonths, 0)} meses`)], [tx(l, 'In the bulletin of', 'En el boletín de'), F.month(r.worstAt)]] : [],
    };
  },
});
