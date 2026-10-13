import { definePage } from '../../lib/guide-types';
import { cellAt, backtestCell, filingChart, MONTHS, LATEST } from '../../lib/engine/cases';
import { PUBLISHED } from '../../lib/engine/ptimes';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import PT from '../../data/ptimes-latest.json';

// Chiffres lus dans les données (jamais tapés).
const at = (c: 'ROW' | 'IN' | 'CN', ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB2', c, ch, MONTHS.indexOf(ym));
const fad = cellAt('EB2', 'ROW', 'FAD'), dff = cellAt('EB2', 'ROW', 'DFF');
const fadIN = cellAt('EB2', 'IN', 'FAD'), fadCN = cellAt('EB2', 'CN', 'FAD');
const oct26 = at('ROW', '2026-10'), oct26dff = at('ROW', '2026-10', 'DFF');
const octs = ['2023-10', '2024-10', '2025-10'].map((m) => at('ROW', m));
const retro = retrogressions('EB2', 'ROW');
const worstBefore = at('ROW', MONTHS[MONTHS.indexOf(retro.worstAt) - 1]), worstCell = at('ROW', retro.worstAt), worstAfter = at('ROW', MONTHS[MONTHS.indexOf(retro.worstAt) + 1]);
const bt12 = backtestCell('EB2', 'ROW', 12)!;
const i140 = (PT as any).forms['i-140'].rows as Array<{ office: string; subtype: string; min: number; max: number }>;
const row = (sub: string) => i140.find((r) => r.office === 'SCD' && r.subtype === sub)!;
const e21 = row('136A-E21'), niw = row('136A-NIW');
const dffChart = filingChart('EB2') === 'DFF';
const en = (c: string) => cellText(c, 'en');
const m1 = (h: { num: (n: number, d?: number) => string }, x: number) => h.num(x, Number.isInteger(x) ? 0 : 1);

export default definePage({
  id: "eb-2", group: "employment", order: 201,
  tool: {"kind": "greencard", "cat": "EB2", "country": "ROW"},
  data: {"cat": "EB2", "country": "ROW"},
  related: ["eb-2-india", "eb-2-china", "i-140-processing-time", "guide-eb2-to-eb3", "guide-portability"],
  sources: ["vbIndex", "vbMirror", "vbOct2026", "aosCharts", "visaPriority", "i140Form", "itData"],
  en: {
    path: "employment/eb-2",
    nav: 'EB-2 advanced degree', card: 'Second preference: the rest-of-world cutoff after the October 2026 reset, NIW timing and the India and China lines.',
    title: 'EB-2 Visa Bulletin 2026: Advanced Degree Cutoff and Wait',
    description: 'EB-2 for the rest of the world: Final Action and filing dates, the October 2026 return of a cutoff, NIW and PERM petition times, and its moves since 2001.',
    h1: 'EB-2 advanced degree and exceptional ability: the worldwide queue',
    intro: 'Enter the priority date from your EB-2 Form I-140, PERM-based or National Interest Waiver, to see whether you can file or be approved this month.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, EB-2 for applicants born outside India and mainland China has a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}; Mexico and the Philippines share that column. The line had been Current from April through September 2026, and the first bulletin of fiscal year 2027 put a cutoff back on it, a move the State Department explained as necessary to keep issuances within the quarterly and annual limits. A priority date later than the Final Action Date cannot be approved yet, even if Form I-485 was filed during the Current months. India (${en(fadIN)}) and China (${en(fadCN)}) queue on separate, much older dates under the 7% per-country cap. How long the petition itself takes depends on its type: the latest USCIS range is ${e21.min} to ${e21.max} months for a standard EB-2 I-140 and ${niw.min} to ${niw.max} months for one requesting a National Interest Waiver.`,
    faqs: [
      { q: 'Why did EB-2 for the rest of the world get a cutoff in October 2026?', a: 'The October 2026 bulletin says that some employment categories for rest-of-world applicants retrogressed so that visa issuances stay within the fiscal year 2027 quarterly and annual limits. EB-2 had been listed as Current for six bulletins in a row. The State Department does not publish the demand figures behind the decision, and it says it will keep monitoring the situation.' },
      { q: 'Does an EB-2 National Interest Waiver petition get a different cutoff?', a: 'No. A National Interest Waiver changes how the I-140 is filed, without a PERM labor certification from an employer, but the approved petition still sits in the EB-2 row of the Visa Bulletin under the country of birth. What differs is the USCIS processing time, which has been much longer for NIW petitions than for standard EB-2 petitions.' },
      { q: 'Are EB-2 Mexico and EB-2 Philippines separate from the worldwide EB-2 date?', a: 'Not at present. The bulletin prints a Mexico and a Philippines column, but in EB-2 they have carried the same date as the rest of the world. People born in either country therefore use the cutoff on this page. Only India and mainland China have had their own EB-2 date in recent years.' },
      { q: 'Can a pending EB-2 I-485 survive a retrogression?', a: 'A Form I-485 that USCIS has accepted stays pending when the cutoff moves back; it is not denied for that reason. It simply cannot be approved until the Final Action Date passes the priority date again. Renewals of the work permit and travel document tied to that pending case stay available at the reduced fees listed in the G-1055.' },
    ],
    body: (h) => `
<h2>Who files in the second preference</h2>
<p>EB-2 covers members of the professions holding an advanced degree and people of exceptional ability. Its share is 28.6% of the worldwide employment level plus whatever EB-1 does not need, as the ${h.src('vbOct2026', 'October 2026 bulletin')} recalls. Unless a National Interest Waiver is requested, the petition rests on a PERM labor certification that the employer obtains first, which is the usual route for someone already working in the United States on an H-1B or L-1. With a waiver, Form I-140 is filed without one. Both kinds of approved petition end up in the same row of the bulletin.</p>
<h2>October 2026: the end of a Current spring</h2>
<p>For the rest of the world, the Final Action Date was listed as Current in every bulletin from April to September 2026. The October bulletin reset it to ${h.cell(oct26)}, with the Date for Filing at ${h.cell(oct26dff)}. That pattern is not new. EB-2 was Current every October from 2013 to 2022, then a cutoff appeared: ${h.cell(octs[0])} in October 2023, ${h.cell(octs[1])} in 2024 and ${h.cell(octs[2])} in 2025. The deepest single drop in the archive came in ${h.month(retro.worstAt)}, when the box went from ${h.cell(worstBefore)} to ${h.cell(worstCell)} for one month and returned to ${h.cell(worstAfter)} the next. In all, the line has stepped backwards ${h.num(retro.n)} times since 2001.</p>
<h2>Two I-140 clocks under one row</h2>
<p>The petition stage can matter more than the bulletin for this column. In the ${h.src('itData', `${h.month(PUBLISHED.slice(0, 7))} USCIS release`)}, a standard EB-2 Form I-140 (E21) took ${m1(h, e21.min)} to ${m1(h, e21.max)} months, while one requesting a National Interest Waiver took ${m1(h, niw.min)} to ${m1(h, niw.max)} months. The priority date is the PERM filing date for labor-certified cases and the I-140 receipt date for waiver cases, so a long NIW review does not cost queue position; it delays the moment the approved petition can be used.</p>
<h2>India, China and everyone else</h2>
<p>Applicants born in India stand at ${h.cell(fadIN)} and those born in mainland China at ${h.cell(fadCN)}, both far behind the worldwide line. Each has its own page: ${h.a('eb-2-india', 'EB-2 India')} and ${h.a('eb-2-china', 'EB-2 China')}. ${dffChart ? 'This month USCIS accepts the Dates for Filing chart for employment-based I-485 applications.' : 'This month USCIS requires the Final Action chart for employment-based I-485 applications.'} Applicants weighing a second petition in the third preference can compare the two rows with the ${h.a('guide-eb2-to-eb3', 'EB-2 to EB-3 calculator')}.</p>
<h2>What the back-test says about this column</h2>
<p>Forecasts for a rest-of-world date a year behind the cutoff missed by a median of ${h.num(bt12.medianError)} months between October 2012 and October 2025, and the range caught the real outcome ${h.pct(bt12.coverage)} of the time. That is below our bar, so the calculator gives the cutoff, the distance and the filing status, without a forecast. Questions about a particular petition belong with a licensed immigration attorney or a DOJ-accredited representative.</p>`,
  },
});
