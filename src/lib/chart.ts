/**
 * Graphique SVG de la date limite d'une case, en chaîne de caractères : le même code sert au build (pages) et dans le
 * navigateur (simulateur), donc le HTML servi est identique au premier rendu (RECETTE §17.5). Axe horizontal : mois
 * du bulletin ; axe vertical : date limite. « C » est tracé à la date du bulletin, « U » interrompt la courbe.
 * Options : ligne horizontale de la date de priorité, cône de la fourchette P20 – P80.
 */
import { monthStart, CURRENT, type Val } from './engine/forecast';

export interface ChartOpts {
  months: string[];
  fad: Val[];
  dff?: Val[];
  from?: string;
  pd?: number;
  /** Cône : mois de départ (index) et délais P20 / P80 (mois, Infinity accepté). */
  cone?: { t: number; p20: number; p80: number };
  title: string;
  width?: number;
  height?: number;
}

export function chartSvg(o: ChartOpts): string {
  const W = o.width ?? 720, H = o.height ?? 280, padL = 48, padR = 12, padT = 12, padB = 26;
  const i0 = Math.max(0, o.from ? o.months.indexOf(o.from) : 0);
  const iEnd = o.months.length - 1;
  const extra = o.cone ? Math.min(Number.isFinite(o.cone.p80) ? o.cone.p80 : 120, 120) : 0;
  const nMonths = iEnd - i0 + extra;
  const val = (s: Val[], i: number) => { const v = s[i]; return v === null || v === undefined ? null : v === CURRENT ? monthStart(o.months[i]) : v; };
  const pts = (s: Val[]) => Array.from({ length: iEnd - i0 + 1 }, (_, k) => val(s, i0 + k));
  const a = pts(o.fad), b = o.dff ? pts(o.dff) : [];
  const ys = [...a, ...b].filter((v): v is number => v !== null);
  if (o.pd) ys.push(o.pd);
  const yMin = Math.min(...ys), yMax = Math.max(...ys, o.cone ? (o.pd ?? 0) : 0);
  const span = Math.max(1, yMax - yMin);
  const x = (k: number) => padL + (k / Math.max(1, nMonths)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - yMin) / span) * (H - padT - padB);
  const path = (arr: Array<number | null>) => {
    let d = '', pen = false;
    arr.forEach((v, k) => { if (v === null) { pen = false; return; } d += `${pen ? 'L' : 'M'}${x(k).toFixed(1)},${y(v).toFixed(1)}`; pen = true; });
    return d;
  };
  const year = (ms: number) => new Date(ms * 86_400_000).getUTCFullYear();
  // Graduations : années de date limite (axe vertical) et années de bulletin (axe horizontal).
  const yTicks: string[] = [];
  const y0 = year(yMin), y1 = year(yMax), stepY = Math.max(1, Math.ceil((y1 - y0) / 6));
  for (let yy = y0 + 1; yy <= y1; yy += stepY) { const v = Date.UTC(yy, 0, 1) / 86_400_000; yTicks.push(`<line x1="${padL}" x2="${W - padR}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text x="${padL - 6}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${yy}</text>`); }
  const xTicks: string[] = [];
  const firstYear = Number(o.months[i0].slice(0, 4)), lastYear = Number(o.months[iEnd].slice(0, 4)) + Math.ceil(extra / 12);
  const stepX = Math.max(1, Math.ceil((lastYear - firstYear) / 8));
  for (let yy = firstYear + 1; yy <= lastYear; yy += stepX) { const k = (yy - firstYear) * 12 - (Number(o.months[i0].slice(5, 7)) - 1); if (k > nMonths) break; xTicks.push(`<text x="${x(k).toFixed(1)}" y="${H - 8}" text-anchor="middle">${yy}</text>`); }
  let cone = '';
  if (o.cone && o.pd) {
    const k0 = o.cone.t - i0, cut = val(o.fad, o.cone.t);
    if (cut !== null) {
      const k20 = k0 + Math.min(o.cone.p20, extra), k80 = k0 + (Number.isFinite(o.cone.p80) ? Math.min(o.cone.p80, extra) : extra);
      cone = `<polygon class="cone" points="${x(k0).toFixed(1)},${y(cut).toFixed(1)} ${x(k20).toFixed(1)},${y(o.pd).toFixed(1)} ${x(k80).toFixed(1)},${y(o.pd).toFixed(1)}"/>`;
    }
  }
  const pdLine = o.pd ? `<line class="pd" x1="${padL}" x2="${W - padR}" y1="${y(o.pd).toFixed(1)}" y2="${y(o.pd).toFixed(1)}"/>` : '';
  return `<svg class="vb-chart w-full h-auto" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.title.replace(/"/g, '&quot;')}"><title>${o.title.replace(/</g, '&lt;')}</title><g class="grid axis">${yTicks.join('')}</g><g class="axis">${xTicks.join('')}</g>${cone}${b.length ? `<path class="line-dff" d="${path(b)}"/>` : ''}<path class="line" d="${path(a)}"/>${pdLine}</svg>`;
}
