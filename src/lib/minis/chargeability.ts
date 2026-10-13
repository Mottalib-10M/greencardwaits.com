/** Guide « chargeability » : comparer la date du pays de naissance et celle du pays du conjoint. */
import { cellAt, COUNTRY_LABEL, type Cat, type Country } from '../engine/cases';
import { isoToDays } from '../engine/forecast';
import type { MiniSpec } from '../mini-types';
import { tx, catOpts, countryOpts, f, type Lang } from './_kit';
const val = (c: string) => (c === 'C' ? Infinity : c === 'U' ? -Infinity : isoToDays(c));
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'Would your spouse’s country of birth move you up?', '¿El país de nacimiento de su cónyuge lo adelanta?'),
  cta: tx(l, 'Run the forecast with the better country', 'Calcular con el mejor país'),
  inputs: [
    { id: 'cat', label: tx(l, 'Category', 'Categoría'), type: 'select', def: 'EB2', options: catOpts(l, ['F1', 'F2A', 'F2B', 'F3', 'F4', 'EB1', 'EB2', 'EB3', 'EW', 'EB5']) },
    { id: 'mine', label: tx(l, 'Your country of birth', 'Su país de nacimiento'), type: 'select', def: 'IN', options: countryOpts(l) },
    { id: 'spouse', label: tx(l, 'Spouse’s country of birth', 'País de nacimiento del cónyuge'), type: 'select', def: 'ROW', options: countryOpts(l) },
  ],
  run: (v) => {
    const F = f(l);
    const a = cellAt(v.cat as Exclude<Cat, 'IR'>, v.mine as Country, 'FAD'), b = cellAt(v.cat as Exclude<Cat, 'IR'>, v.spouse as Country, 'FAD');
    const better = val(b) > val(a);
    const gain = Number.isFinite(val(a)) && Number.isFinite(val(b)) ? Math.round((val(b) - val(a)) / 30.4375) : NaN;
    return {
      head: [tx(l, 'Better chargeability', 'Mejor país de cargo'), better ? COUNTRY_LABEL[l][v.spouse as Country] : COUNTRY_LABEL[l][v.mine as Country]],
      rows: [[COUNTRY_LABEL[l][v.mine as Country], F.cell(a)], [COUNTRY_LABEL[l][v.spouse as Country], F.cell(b)], [tx(l, 'Months gained', 'Meses ganados'), better ? (Number.isFinite(gain) ? F.num(gain) : tx(l, 'to current', 'hasta al día')) : '0']],
      note: tx(l, 'Cross-chargeability works when the spouses immigrate together (or the spouse follows to join).', 'El cargo cruzado funciona si los cónyuges inmigran juntos (o el cónyuge se une después).'),
    };
  },
});
