import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS, LATEST } from '../../lib/engine/cases';
import { PUBLISHED } from '../../lib/engine/ptimes';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import { isoToDays } from '../../lib/engine/forecast';
import PT from '../../data/ptimes-latest.json';

// Chiffres lus dans les données (jamais tapés).
const at = (ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EW', 'ROW', ch, MONTHS.indexOf(ym));
const fad = cellAt('EW', 'ROW', 'FAD'), dff = cellAt('EW', 'ROW', 'DFF');
const eb3 = cellAt('EB3', 'ROW', 'FAD');
const cn = cellAt('EW', 'CN', 'FAD'), ind = cellAt('EW', 'IN', 'FAD'), mx = cellAt('EW', 'MX', 'FAD'), ph = cellAt('EW', 'PH', 'FAD');
const move = moveDays('EW', 'ROW') ?? 0;
const retro = retrogressions('EW', 'ROW');
const before = at(MONTHS[MONTHS.indexOf(retro.worstAt) - 1]), worst = at(retro.worstAt);
const lastC = [...MONTHS].reverse().find((m) => at(m) === 'C')!;
const octs = ['2022-10', '2023-10', '2024-10', '2025-10', '2026-10'].map((m) => at(m));
const sep26 = at('2026-09'), sep26dff = at('2026-09', 'DFF');
const bt6 = backtestCell('EW', 'ROW', 6)!, bt12 = backtestCell('EW', 'ROW', 12)!;
const ew3 = ((PT as any).forms['i-140'].rows as Array<{ subtype: string; min: number; max: number }>).find((r) => r.subtype === '136A-EW3')!;
const e31 = ((PT as any).forms['i-140'].rows as Array<{ subtype: string; min: number; max: number }>).find((r) => r.subtype === '136A-E31')!;
const isDate = (c: string) => c !== 'C' && c !== 'U';
const months = (a: string, b: string) => Math.round((isoToDays(a) - isoToDays(b)) / 30.4375);
const behind = isDate(fad) && isDate(eb3) ? months(eb3, fad) : NaN;
const en = (c: string) => cellText(c, 'en');
const m1 = (h: { num: (n: number, d?: number) => string }, x: number) => h.num(x, Number.isInteger(x) ? 0 : 1);

export default definePage({
  id: "eb-3-other-workers", group: "employment", order: 214, parent: "eb-3",
  tool: {"kind": "greencard", "cat": "EW", "country": "ROW"},
  data: {"cat": "EW", "country": "ROW"},
  related: ["eb-3", "eb-3-philippines", "i-140-processing-time", "employment-green-card-cost"],
  sources: ["vbIndex", "vbMirror", "vbOct2026", "aosCharts", "visaPriority", "i140Form", "itData"],
  en: {
    path: "employment/eb-3/other-workers",
    nav: 'EB-3 Other Workers', card: 'Unskilled EB-3 jobs: a row capped at 10,000 a year, trimmed by NACARA, and running years behind skilled EB-3.',
    title: 'EB-3 Other Workers Visa Bulletin 2026: Cutoff and Wait',
    description: 'EB-3 Other Workers in the Visa Bulletin: the worldwide cutoff for unskilled jobs, its 10,000 ceiling and NACARA offset, the October 2026 step back and history.',
    h1: 'EB-3 Other Workers: the unskilled row and its own slow clock',
    intro: 'Enter the priority date of the PERM labor certification for an unskilled EB-3 job to see where the case stands in this month’s bulletin.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, EB-3 Other Workers for applicants born outside mainland China and India has a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}${move ? `, the Final Action Date having moved ${Math.abs(Math.round(move))} days ${move > 0 ? 'forward' : 'back'} from the previous bulletin` : ''}. ${Number.isFinite(behind) ? `That is about ${behind} months behind the skilled-worker EB-3 date, ${en(eb3)}, for the same rest-of-world column.` : ''} Part of the explanation is a statutory ceiling: no more than 10,000 third-preference numbers a year may go to Other Workers, and under the Nicaraguan and Central American Relief Act (NACARA) that figure has been reduced by up to 5,000 each year since fiscal year 2002; the October 2026 bulletin says the reduction for fiscal year 2027 will be limited to about 150. The row was last Current in ${monthName(lastC, 'en')}. ${bt6.reliable ? `Our back-test passes for dates six months behind the cutoff, with a median error of ${bt6.medianError} months, but not further back.` : 'Our back-test does not support a forecast for this row.'}`,
    faqs: [
      { q: 'Which jobs fall under EB-3 Other Workers?', a: 'Other Workers covers third-preference positions that do not meet the skilled-worker or professional standard, which USCIS processing data labels unskilled workers (EW3). The employer still obtains a PERM labor certification and files Form I-140. The classification on the approved petition decides whether the case waits in this row or in the skilled-worker EB-3 row.' },
      { q: 'How does NACARA reduce EB-3 Other Workers numbers?', a: 'The October 2026 bulletin explains that once the Other Workers cutoff passed November 19, 1997, during fiscal year 2001, the 10,000 annual numbers became subject to a reduction of up to 5,000 a year to offset adjustments under the Nicaraguan and Central American Relief Act. The reduction started in fiscal year 2002 and, for fiscal year 2027, is limited to about 150.' },
      { q: 'Do EB-3 Other Workers from Mexico and the Philippines use the worldwide date?', a: 'In the October 2026 bulletin, yes: the Mexico and Philippines columns of the Other Workers row carried the same date as the rest of the world. The Chinese and Indian columns had their own, older dates. The Philippine column has at times split from the worldwide one, so its date can differ in a given month.' },
    ],
    body: (h) => `
<h2>A row capped twice</h2>
<p>Other Workers share the third preference with skilled workers and professionals but queue on a separate line. Paragraph 5 of the ${h.src('vbOct2026', 'October 2026 bulletin')} caps them at 10,000 numbers a year, and the NACARA offset has trimmed that ceiling every year since fiscal 2002; for fiscal 2027 the bulletin limits the cut to about 150. ${Number.isFinite(behind) ? `This month the row stands at ${h.cell(fad)}, about ${h.num(behind)} months behind the skilled EB-3 date of ${h.cell(eb3)}.` : `This month it reads ${h.cell(fad)}.`}</p>
<h2>October 2026 and the years before</h2>
<p>The new fiscal year moved the row back: ${h.cell(sep26)} in September 2026 became ${h.cell(at('2026-10'))} in October, and the Date for Filing went from ${h.cell(sep26dff)} to ${h.cell(at('2026-10', 'DFF'))}. Since the cutoff returned in mid-2022, October readings have advanced slowly: ${h.cell(octs[0])} in 2022, ${h.cell(octs[1])} in 2023, ${h.cell(octs[2])} in 2024, ${h.cell(octs[3])} in 2025 and ${h.cell(octs[4])} in 2026. Before that, the row was Current from October 2020 to ${h.month(lastC)}. Its largest single fall in the archive came in ${h.month(retro.worstAt)}, from ${h.cell(before)} to ${h.cell(worst)}, one of ${h.num(retro.n)} retrogressions since 2001.</p>
<h2>Columns that share and columns that do not</h2>
<p>${mx === fad && ph === fad ? 'Mexico and the Philippines carry the worldwide Other Workers date this month.' : `Mexico reads ${h.cell(mx)} and the Philippines ${h.cell(ph)} this month.`} Mainland China has its own date, ${h.cell(cn)}, and India’s ${h.cell(ind)} matches the Indian skilled-worker row; see ${h.a('eb-3-philippines', 'EB-3 Philippines')} for that column’s history.</p>
<h2>Petition time and the forecast</h2>
<p>In the ${h.src('itData', `${h.month(PUBLISHED.slice(0, 7))} USCIS release`)}, an Other Workers Form I-140 took ${m1(h, ew3.min)} to ${m1(h, ew3.max)} months, against ${m1(h, e31.min)} to ${m1(h, e31.max)} months for a skilled-worker petition. Tested from October 2012 to October 2025, our forecast for this row missed by a median of ${h.num(bt6.medianError)} months six months out and ${h.num(bt12.medianError)} months a year out, ${bt12.reliable ? 'both within our rule' : 'so only the shorter distance can show a range'}.</p>`,
  },
});
