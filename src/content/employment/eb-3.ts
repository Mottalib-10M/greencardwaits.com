import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS, LATEST } from '../../lib/engine/cases';
import { PUBLISHED } from '../../lib/engine/ptimes';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import { isoToDays } from '../../lib/engine/forecast';
import PT from '../../data/ptimes-latest.json';

// Chiffres lus dans les données (jamais tapés).
const at = (c: 'ROW' | 'IN' | 'CN' | 'PH', ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB3', c, ch, MONTHS.indexOf(ym));
const fad = cellAt('EB3', 'ROW', 'FAD'), dff = cellAt('EB3', 'ROW', 'DFF');
const ew = cellAt('EW', 'ROW', 'FAD'), eb2 = cellAt('EB2', 'ROW', 'FAD');
const sep26 = at('ROW', '2026-09'), sep26dff = at('ROW', '2026-09', 'DFF'), oct26 = at('ROW', '2026-10'), oct26dff = at('ROW', '2026-10', 'DFF');
const octs = ['2023-10', '2024-10', '2025-10'].map((m) => at('ROW', m));
const jul07 = at('ROW', '2007-07'), aug07 = at('ROW', '2007-08'), sep07 = at('ROW', '2007-09');
const retro = retrogressions('EB3', 'ROW');
const backToC = MONTHS.find((m, i) => m > '2007-07' && cellAt('EB3', 'ROW', 'FAD', i) === 'C');
const move = moveDays('EB3', 'ROW') ?? 0;
const bt6 = backtestCell('EB3', 'ROW', 6)!, bt12 = backtestCell('EB3', 'ROW', 12)!;
const i140 = (PT as any).forms['i-140'].rows as Array<{ office: string; subtype: string; min: number; max: number }>;
const row = (sub: string) => i140.find((r) => r.office === 'SCD' && r.subtype === sub)!;
const e31 = row('136A-E31'), ew3 = row('136A-EW3');
const gapMonths = (a: string, b: string) => Math.round((isoToDays(a) - isoToDays(b)) / 30.4375);
const en = (c: string) => cellText(c, 'en');
const m1 = (h: { num: (n: number, d?: number) => string }, x: number) => h.num(x, Number.isInteger(x) ? 0 : 1);
const isDate = (c: string) => c !== 'C' && c !== 'U';

export default definePage({
  id: "eb-3", group: "employment", order: 202,
  tool: {"kind": "greencard", "cat": "EB3", "country": "ROW"},
  data: {"cat": "EB3", "country": "ROW"},
  related: ["eb-3-other-workers", "eb-3-philippines", "eb-3-india", "guide-eb2-to-eb3", "i-140-processing-time"],
  sources: ["vbIndex", "vbMirror", "vbOct2026", "aosCharts", "visaPriority", "i140Form", "itData", "eb3Page", "cfr204_5"],
  en: {
    path: "employment/eb-3",
    nav: 'EB-3 skilled workers', card: 'Third preference: the worldwide cutoff for skilled workers and professionals, its October 2026 step back and the history.',
    title: 'EB-3 Visa Bulletin 2026: Skilled Worker Cutoff and Wait',
    description: 'EB-3 skilled workers and professionals: this month’s Final Action Date and Date for Filing, the October 2026 step back, I-140 times, every October since 2002.',
    h1: 'EB-3 skilled workers and professionals: where the worldwide line stands',
    intro: 'Enter the priority date of your PERM labor certification to check whether your EB-3 case can be filed or approved under this month’s bulletin.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, EB-3 for skilled workers and professionals born outside India, mainland China and the Philippines has a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}, and Mexico shares that column. The October 2026 bulletin moved both back: the Final Action Date from ${en(sep26)} in September, and the filing date from ${en(sep26dff)}. EB-3 receives 28.6% of the worldwide employment-based numbers plus any left by EB-1 and EB-2, of which no more than 10,000 may go to Other Workers, who wait on their own, older line at ${en(ew)}. The Philippines (${en(cellAt('EB3', 'PH', 'FAD'))}), China (${en(cellAt('EB3', 'CN', 'FAD'))}) and India (${en(cellAt('EB3', 'IN', 'FAD'))}) each have a separate date this month. ${backtestCell('EB3', 'ROW', 6)?.reliable ? 'Our back-test grades a range for dates about six months behind the worldwide cutoff' : 'Our back-test does not grade a range even for dates six months behind the worldwide cutoff'}, ${backtestCell('EB3', 'ROW', 12)?.reliable ? 'and also for dates a year back.' : 'but not for dates a year or more back.'}`,
    faqs: [
      { q: 'What is the difference between EB-3 skilled workers and EB-3 Other Workers?', a: 'Both are third-preference petitions on Form I-140 backed by a PERM labor certification, but the Visa Bulletin prints them on separate rows. Skilled workers and professionals use the main EB-3 row. Positions classed as Other Workers, which USCIS labels unskilled (EW3), share a statutory ceiling of 10,000 numbers a year and have carried an older cutoff than the main row in recent bulletins.' },
      { q: 'Why did the EB-3 worldwide date move back in October 2026?', a: 'The State Department wrote in the October 2026 bulletin that some rest-of-world employment categories had to retrogress so that issuances stay within the fiscal year 2027 quarterly and annual limits. It does not publish the demand figures behind the change. EB-3 for the rest of the world and EB-3 Other Workers both stepped back that month.' },
      { q: 'Can someone with an approved EB-2 petition use the EB-3 worldwide date instead?', a: 'Only with a new EB-3 Form I-140 filed by the employer. When the approved petitions are for the same person, the earlier priority date can generally carry over to the new petition. Whether this helps depends on which row is ahead in a given month; for rest-of-world applicants EB-3 led from December 2022 and EB-2 took the lead again in July 2023.' },
    ],
    body: (h) => `
<h2>Who sits in this row</h2>
<p>The main EB-3 row covers skilled workers, whose job needs at least two years of training or experience, and professionals with a bachelor’s degree. Most cases start with a PERM labor certification, then a Form I-140 from the employer; the day the Department of Labor accepted the PERM application becomes the priority date. The ${h.src('vbOct2026', 'October 2026 bulletin')} sets the share at 28.6% of the worldwide employment level, plus numbers unused by EB-1 and EB-2, with a ceiling of 10,000 for the separate ${h.a('eb-3-other-workers', 'Other Workers')} row.</p>
<h2>A step back to open fiscal year 2027</h2>
<p>The new fiscal year began with a retreat. The Final Action Date went from ${h.cell(sep26)} in September 2026 to ${h.cell(oct26)} in October, about ${h.num(Math.abs(gapMonths(oct26, sep26)))} months, and the Date for Filing from ${h.cell(sep26dff)} to ${h.cell(oct26dff)}. ${LATEST === '2026-10' ? '' : `The latest bulletin then moved the Final Action Date ${h.num(Math.abs(Math.round(move)))} days ${move >= 0 ? 'forward' : 'back'}. `}Seen from further away, the line has been creeping up from a low point: ${h.cell(octs[0])} in October 2023, ${h.cell(octs[1])} in October 2024 and ${h.cell(octs[2])} in October 2025, after six Octobers in a row, 2017 to 2022, when EB-3 was Current for the rest of the world.</p>
<h2>The 2007 lesson</h2>
<p>The archive holds ${h.num(retro.n)} retrogressions for this row since 2001. The biggest came after the July 2007 bulletin listed EB-3 as ${h.cell(jul07)}: August read ${h.cell(aug07)}, and September came back at ${h.cell(sep07)}, about ${h.num(Math.round(retro.worstMonths))} months behind the summer position. The row did not read Current again until ${h.month(backToC!)}, ten years later. ${h.a('guide-retrogression', 'Why cutoffs retrogress')}.</p>
<h2>EB-2 or EB-3 for the rest of the world</h2>
<p>${isDate(eb2) && isDate(fad) ? `This month the EB-2 worldwide Final Action Date is ${h.cell(eb2)}, ${isoToDays(eb2) > isoToDays(fad) ? `about ${h.num(gapMonths(eb2, fad))} months ahead of EB-3` : `about ${h.num(gapMonths(fad, eb2))} months behind EB-3`}.` : `This month the EB-2 worldwide Final Action Date reads ${h.cell(eb2)}.`} The order between the two rows is not fixed, which is why some employers file a second petition in the other preference. The ${h.a('guide-eb2-to-eb3', 'EB-2 to EB-3 calculator')} puts both dates side by side.</p>
<h2>Petition times and what the forecast can say</h2>
<p>In the ${h.src('itData', `${h.month(PUBLISHED.slice(0, 7))} USCIS release`)}, an EB-3 Form I-140 for a skilled worker or professional took ${m1(h, e31.min)} to ${m1(h, e31.max)} months, against ${m1(h, ew3.min)} to ${m1(h, ew3.max)} months for an Other Workers petition. For the bulletin wait, our test from October 2012 to October 2025 found a median error of ${h.num(bt6.medianError)} months for dates six months behind the cutoff, with ${h.pct(bt6.coverage)} coverage, ${bt6.reliable ? 'enough to publish' : 'not enough to publish'}; a year behind, the error was ${h.num(bt12.medianError)} months against a real wait of about ${h.num(bt12.medianActual)}, which ${bt12.reliable ? 'passes' : 'fails'} our rule. A licensed immigration attorney or a DOJ-accredited representative can review a specific job classification.</p>`,
  },
});
