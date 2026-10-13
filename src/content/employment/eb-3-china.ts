import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, distinctShare, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import { isoToDays } from '../../lib/engine/forecast';

// Chiffres lus dans les données (jamais tapés).
const at = (ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB3', 'CN', ch, MONTHS.indexOf(ym));
const fad = cellAt('EB3', 'CN', 'FAD'), dff = cellAt('EB3', 'CN', 'DFF');
const eb2 = cellAt('EB2', 'CN', 'FAD'), ew = cellAt('EW', 'CN', 'FAD');
const move = moveDays('EB3', 'CN') ?? 0, dmove = moveDays('EB3', 'CN', 'DFF') ?? 0;
const retro = retrogressions('EB3', 'CN');
const before = at(MONTHS[MONTHS.indexOf(retro.worstAt) - 1]), worst = at(retro.worstAt), after = at(MONTHS[MONTHS.indexOf(retro.worstAt) + 1]);
const oct16 = at('2016-10'), oct25 = at('2025-10'), jun26 = at('2026-06'), jul26 = at('2026-07'), oct26 = at('2026-10');
const bt = [6, 12, 24].map((g) => backtestCell('EB3', 'CN', g)!);
const isDate = (c: string) => c !== 'C' && c !== 'U';
const months = (a: string, b: string) => Math.round((isoToDays(a) - isoToDays(b)) / 30.4375);
const gap = isDate(fad) && isDate(eb2) ? months(fad, eb2) : NaN;
const en = (c: string) => cellText(c, 'en');

export default definePage({
  id: "eb-3-china", group: "employment", order: 210, parent: "eb-3",
  tool: {"kind": "greencard", "cat": "EB3", "country": "CN"},
  data: {"cat": "EB3", "country": "CN"},
  related: ["eb-3", "country-china", "eb-2-china", "guide-eb2-to-eb3", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-3/china",
    nav: 'EB-3 China', card: 'Skilled workers born in mainland China: a filing date that leapt in October 2026 and a row that often outruns EB-2 China.',
    title: 'EB-3 China Priority Date 2026: Cutoff and Filing Leap',
    description: 'EB-3 China in the Visa Bulletin: the Final Action Date, the October 2026 leap in the filing date, the 2015 fall and how this row compares with EB-2 China.',
    h1: 'EB-3 China: the Chinese row that keeps passing EB-2',
    intro: 'Enter the priority date of your PERM labor certification to see where an EB-3 case for a person born in mainland China stands this month.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, EB-3 for people born in mainland China has a Final Action Date of ${en(fad)}${move ? `, ${Math.abs(Math.round(move))} days ${move > 0 ? 'later' : 'earlier'} than the month before` : ''}, and a Date for Filing of ${en(dff)}${dmove ? `, which moved ${Math.abs(Math.round(dmove))} days ${dmove > 0 ? 'forward' : 'back'} in one bulletin` : ''}. ${Number.isFinite(gap) ? `The Chinese EB-2 date is ${en(eb2)}, so EB-3 is ${gap === 0 ? 'level with it' : `about ${Math.abs(gap)} months ${gap > 0 ? 'ahead' : 'behind'}`}.` : ''} The Chinese column has had its own EB-3 date in ${Math.round(distinctShare('EB3', 'CN') * 100)}% of bulletins since October 2015, and a separate Other Workers row for China reads ${en(ew)}. ${bt[0].reliable ? `Our back-test passed for dates six months behind the cutoff, with a median error of ${bt[0].medianError} months, ` : ''}${bt[2].reliable ? `and for dates two years behind, with ${bt[2].medianError} months` : ''}${bt[1].reliable ? '' : `, but not at one year, where the error was ${bt[1].medianError} months against a real wait of about ${bt[1].medianActual}`}. Where it passes, the calculator shows a range; elsewhere it shows the distance only.`,
    faqs: [
      { q: 'Why did the EB-3 China filing date jump in October 2026?', a: 'The October 2026 bulletin opened fiscal year 2027 and, in its own words, advanced dates across various categories; it does not explain individual moves. A jump in the Date for Filing allows earlier filing of Form I-485 in months when USCIS designates that chart for employment cases. It is not an approval date, which still follows the Final Action Date.' },
      { q: 'How does EB-3 Other Workers China differ from EB-3 China?', a: 'The two Chinese rows are counted separately. Other Workers covers jobs USCIS classes as unskilled (EW3) and shares a worldwide ceiling of 10,000 numbers a year, so it can carry an older date than the skilled-worker row. The I-140 approval notice shows which classification applies, and that decides the row to read.' },
      { q: 'Did EB-3 China fall in the summer of 2015?', a: 'Yes. In August 2015 the Chinese EB-3 cutoff dropped from September 1, 2011 to June 1, 2004, about 87 months in a single bulletin, the deepest fall this row has recorded. September 2015 moved it only to December 22, 2004, and October 2015, the first bulletin of the next fiscal year, put it back at October 15, 2011. A single month can therefore depart sharply from the trend.' },
    ],
    body: (h) => `
<h2>Ahead of EB-2 China, again</h2>
<p>${Number.isFinite(gap) ? `This month the Chinese EB-3 Final Action Date is ${gap === 0 ? 'level with' : `about ${h.num(Math.abs(gap))} months ${gap > 0 ? 'ahead of' : 'behind'}`} EB-2 China, ${h.cell(eb2)}.` : `EB-2 China reads ${h.cell(eb2)} this month.`} The lead has changed hands many times since 2015, and the most recent swap came in July 2026, when EB-3 China moved from ${h.cell(jun26)} to ${h.cell(jul26)} in one bulletin while the EB-2 row stood still. For a worker holding an approved EB-2 petition, a second Form I-140 in EB-3 can generally keep the earlier priority date; ${h.a('eb-2-china', 'EB-2 China')} and the ${h.a('guide-eb2-to-eb3', 'downgrade calculator')} show both lines.</p>
<h2>Fiscal 2026 and the October leap</h2>
<p>The Final Action Date opened fiscal 2026 at ${h.cell(oct25)} and reached ${h.cell(oct26)} by October 2026. The Date for Filing did more: ${h.cell(dff)} in the October bulletin, against ${h.cell(at('2026-09', 'DFF'))} a month earlier. An applicant in the United States whose priority date falls between the two charts can file Form I-485 in months when USCIS designates the filing chart, then wait for the Final Action Date.</p>
<h2>The 2015 fall and ten years of Octobers</h2>
<p>The row has retrogressed ${h.num(retro.n)} times since 2001. The deepest drop came in ${h.month(retro.worstAt)}: ${h.cell(before)} to ${h.cell(worst)}, then ${h.cell(after)} the month after. Measured from October 2016 (${h.cell(oct16)}) to October 2026, the cutoff advanced about ${h.num(months(oct26, oct16))} months of priority dates in 120 calendar months.</p>
<h2>The forecast, distance by distance</h2>
<p>For dates six months behind, the tested median error was ${h.num(bt[0].medianError)} months with ${h.pct(bt[0].coverage)} coverage; one year behind, ${h.num(bt[1].medianError)} months; two years behind, ${h.num(bt[2].medianError)} months with ${h.pct(bt[2].coverage)} coverage. Each distance is judged on its own, so a range can appear for one priority date and not for another.</p>`,
  },
});
