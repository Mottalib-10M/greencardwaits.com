/**
 * Séries mensuelles par case et rétro-test du modèle de prévision.
 *
 *   node scripts/build-forecast.ts
 *
 * Entrée : src/data/visa-bulletin.json (scripts/build-bulletins.ts).
 * Sorties (versionnées) :
 *  - src/data/series.json   : pour chaque case (catégorie × pays) et chaque tableau, la date limite de chaque mois
 *                             de décembre 2001 au dernier bulletin (jours depuis 1970 ; -1 = « C » ; null = « U » ou mois
 *                             sans bulletin). Un pays sans colonne suit la colonne « reste du monde », comme le dit le bulletin.
 *  - src/data/backtest.json : pour chaque case et chaque retard (6, 12, 24, 48 mois), l'erreur médiane du délai prédit,
 *                             celle du modèle naïf, la couverture de la fourchette P20 – P80 et le verdict de fiabilité ;
 *                             plus la part des bulletins depuis octobre 2015 où le pays a sa propre date (règle des pages).
 * Mois de départ testés : octobre 2012 à octobre 2025, avec les seules données connues ce mois-là.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURRENT, isoToDays, monthStart, MONTH_DAYS, forecastAt, naiveAt, actualWait, isReliable, BACKTEST_GAPS, resolve, type Val, type BacktestCell } from '../src/lib/engine/forecast.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const vb = JSON.parse(readFileSync(join(ROOT, 'src/data/visa-bulletin.json'), 'utf8'));
const CATS = ['F1', 'F2A', 'F2B', 'F3', 'F4', 'EB1', 'EB2', 'EB3', 'EW', 'EB4', 'EB5'];
const COUNTRIES = ['ROW', 'CN', 'IN', 'MX', 'PH'];

const byMonth = new Map<string, any>(vb.bulletins.map((b: any) => [b.month, b]));
const months: string[] = [];
for (let y = 2001, m = 12; `${y}-${String(m).padStart(2, '0')}` <= vb.latest; m === 12 ? (y++, (m = 1)) : m++) months.push(`${y}-${String(m).padStart(2, '0')}`);

const enc = (cell: string | undefined): Val => (cell === undefined || cell === 'U' ? null : cell === 'C' ? CURRENT : isoToDays(cell));
const series: Record<'FAD' | 'DFF', Record<string, Val[]>> = { FAD: {}, DFF: {} };
for (const chart of ['FAD', 'DFF'] as const) {
  for (const c of CATS) for (const k of COUNTRIES) {
    series[chart][`${c}-${k}`] = months.map((m) => {
      const t = byMonth.get(m)?.[chart]?.[c];
      if (!t) return null;
      return enc(t[k] ?? t.ROW);
    });
  }
}

const idx = (ym: string) => months.indexOf(ym);
const t0 = idx('2012-10'), t1 = idx('2025-10');
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN; };
const r1 = (x: number) => (Number.isFinite(x) ? Math.round(x * 10) / 10 : x);

const backtest: Record<string, { distinct: number; cells: BacktestCell[] }> = {};
for (const key of Object.keys(series.FAD)) {
  const s = series.FAD[key];
  const cells: BacktestCell[] = [];
  for (const g of BACKTEST_GAPS) {
    const errs: number[] = [], nerrs: number[] = [], actuals: number[] = [];
    let observed = 0, pending = 0, inside = 0, judged = 0;
    for (let t = t0; t <= t1; t++) {
      if (s[t] === null || s[t] === CURRENT) continue;
      const cut = resolve(s, months, t)!;
      const pd = cut + g * MONTH_DAYS;
      // Une date de priorité réelle ne peut pas être postérieure au mois du bulletin.
      if (pd > monthStart(months[t])) continue;
      const f = forecastAt(s, months, t, pd);
      if (f.status !== 'waiting') continue;
      const nv = naiveAt(s, months, t, pd);
      const a = actualWait(s, months, t, pd);
      const hmax = months.length - 1 - t;
      const cap = (x: number) => Math.min(x, 600);
      if (a !== null) {
        observed++; actuals.push(a);
        errs.push(Math.abs(cap(f.p50) - a)); nerrs.push(Math.abs(cap(nv) - a));
        judged++; if (f.p20 <= a && a <= f.p80) inside++;
      } else {
        pending++;
        // Issue inconnue : si la prévision médiane tombait avant le dernier bulletin, l'erreur vaut au moins l'écart.
        if (f.p50 < hmax) errs.push(hmax - f.p50);
        if (nv < hmax) nerrs.push(hmax - nv);
        if (f.p80 < hmax) judged++;
      }
    }
    const cell = { gapMonths: g, observed, pending, medianError: r1(median(errs)), naiveError: r1(median(nerrs)), coverage: judged ? Math.round((inside / judged) * 100) / 100 : NaN, medianActual: r1(median(actuals)), reliable: false };
    cell.reliable = isReliable(cell);
    cells.push(cell);
  }
  // Règle des pages catégorie × pays : le pays a sa propre date dans au moins 25 % des bulletins depuis octobre 2015.
  const [c] = key.split('-');
  const row = series.FAD[`${c}-ROW`];
  let diff = 0, n = 0;
  for (let t = idx('2015-10'); t < months.length; t++) { if (s[t] === undefined || row[t] === undefined || (s[t] === null && row[t] === null)) continue; n++; if (s[t] !== row[t]) diff++; }
  backtest[key] = { distinct: n ? Math.round((diff / n) * 1000) / 1000 : 0, cells };
}

writeFileSync(join(ROOT, 'src/data/series.json'), JSON.stringify({ latest: vb.latest, months, ...series }));
writeFileSync(join(ROOT, 'src/data/backtest.json'), JSON.stringify({ from: '2012-10', to: '2025-10', latest: vb.latest, cases: backtest }, null, 1));
const rel = Object.values(backtest).flatMap((b) => b.cells).filter((c) => c.reliable).length;
console.log(`${Object.keys(backtest).length} cases, ${rel} cellules fiables sur ${Object.keys(backtest).length * BACKTEST_GAPS.length}`);
