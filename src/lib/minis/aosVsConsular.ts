/** Guide « ajustement ou procédure consulaire » : écart de frais entre les deux voies. */
import { feeTotal, DEFAULT_FEES } from '../engine/fees';
import type { MiniSpec } from '../mini-types';
import { tx, f, type Lang } from './_kit';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'Fees: adjusting in the U.S. or going through a consulate', 'Tarifas: ajuste en EE. UU. o por consulado'),
  cta: tx(l, 'Detailed fee calculator', 'Calculadora de tarifas detallada'),
  inputs: [
    { id: 'kind', label: tx(l, 'Basis', 'Base'), type: 'select', def: 'family', options: [{ value: 'family', label: tx(l, 'Family petition', 'Petición familiar') }, { value: 'employment', label: tx(l, 'Employment petition', 'Petición de empleo') }] },
    { id: 'n', label: tx(l, 'People immigrating', 'Personas que inmigran'), type: 'number', def: '1', max: 9 },
  ],
  run: (v) => {
    const F = f(l);
    const n = Math.max(1, Math.round(Number(v.n) || 1));
    const fam = v.kind === 'family';
    const aos = feeTotal({ ...DEFAULT_FEES, path: fam ? 'marriage' : 'employment', extraAdults: n - 1 });
    const con = feeTotal({ ...DEFAULT_FEES, path: fam ? 'family-consular' : 'employment-consular', consularApplicants: n });
    return {
      head: [tx(l, 'Consular route saves', 'La vía consular ahorra'), F.usd(aos.total - con.total)],
      rows: [[tx(l, 'Adjustment of status (with work and travel permits)', 'Ajuste de estatus (con permisos)'), F.usd(aos.total)], [tx(l, 'Consular processing', 'Proceso consular'), F.usd(con.total)]],
      note: tx(l, 'Travel, the medical exam and time away from work are not counted.', 'No se cuentan el viaje, el examen médico ni el tiempo sin trabajar.'),
    };
  },
});
