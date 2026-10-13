/** Guide « plafond de 7 % par pays » : plafond par pays et par territoire dépendant pour des limites annuelles données. */
import type { MiniSpec } from '../mini-types';
import { tx, f, type Lang } from './_kit';
import P from '../../data/params-2026.json';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'Per-country cap for a given year', 'Tope por país para un año dado'),
  cta: tx(l, 'See which countries hit the cap this month', 'Ver qué países llegan al tope este mes'),
  inputs: [
    { id: 'fam', label: tx(l, 'Family preference limit', 'Límite familiar'), type: 'number', def: String(P.limits.family), max: 1_000_000 },
    { id: 'emp', label: tx(l, 'Employment limit', 'Límite de empleo'), type: 'number', def: String(P.limits.employment), max: 1_000_000 },
  ],
  run: (v) => {
    const F = f(l);
    const tot = (Number(v.fam) || 0) + (Number(v.emp) || 0);
    return {
      head: [tx(l, 'Per-country cap (7%)', 'Tope por país (7 %)'), F.num(Math.round(tot * P.limits.perCountryShare))],
      rows: [[tx(l, 'Combined preference limit', 'Límite combinado'), F.num(tot)], [tx(l, 'Dependent area cap (2%)', 'Tope de territorio dependiente (2 %)'), F.num(Math.round(tot * P.limits.dependentShare))]],
      note: tx(l, `With the minimums of ${F.num(P.limits.family)} and ${F.num(P.limits.employment)}, the cap is ${F.num(P.limits.perCountry)}, the figure printed in the Visa Bulletin.`, `Con los mínimos de ${F.num(P.limits.family)} y ${F.num(P.limits.employment)}, el tope es ${F.num(P.limits.perCountry)}, la cifra del Visa Bulletin.`),
    };
  },
});
