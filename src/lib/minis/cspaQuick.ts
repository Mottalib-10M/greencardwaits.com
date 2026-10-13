/** Guide « l'enfant qui a 21 ans » : âge CSPA en trois dates. */
import { cspa } from '../engine/rules';
import type { MiniSpec } from '../mini-types';
import { tx, f, iso, type Lang } from './_kit';
export default (l: Lang): MiniSpec => ({
  title: tx(l, 'Quick CSPA age check', 'Cálculo rápido de la edad CSPA'),
  cta: tx(l, 'Open the full CSPA calculator', 'Abrir la calculadora CSPA completa'),
  inputs: [
    { id: 'birth', label: tx(l, 'Date of birth', 'Fecha de nacimiento'), type: 'date', def: '2004-08-01' },
    { id: 'pending', label: tx(l, 'Months the petition was pending', 'Meses que la petición estuvo pendiente'), type: 'number', def: '14', max: 240, unit: tx(l, 'mo.', 'meses') },
    { id: 'avail', label: tx(l, 'Date became current', 'Fecha en que se puso al día'), type: 'date', def: '2026-01-01' },
  ],
  run: (v) => {
    const F = f(l);
    if (!iso(v.birth) || !iso(v.avail)) return { head: ['', '—'], rows: [] };
    const pm = Math.max(0, Number(v.pending) || 0);
    const filed = '2000-01-01';
    const approved = new Date(Date.UTC(2000, Math.round(pm), 1)).toISOString().slice(0, 10);
    const r = cspa({ birth: v.birth, petitionFiled: filed, petitionApproved: approved, visaAvailable: v.avail });
    return {
      head: [tx(l, 'CSPA age', 'Edad CSPA'), tx(l, `${F.num(r.cspaYears, 2)} years`, `${F.num(r.cspaYears, 2)} años`)],
      rows: [[tx(l, 'Age on that date', 'Edad en esa fecha'), F.num(r.ageDays / 365.25, 2)], [tx(l, 'Result', 'Resultado'), r.protected ? tx(l, 'Protected (under 21)', 'Protegido (menos de 21)') : tx(l, 'Ages out', 'Pierde la edad')]],
    };
  },
});
