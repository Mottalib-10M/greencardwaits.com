import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import { isoToDays } from '../../lib/engine/forecast';

// Chiffres lus dans les données (jamais tapés).
const at = (ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB3', 'IN', ch, MONTHS.indexOf(ym));
const fad = cellAt('EB3', 'IN', 'FAD'), dff = cellAt('EB3', 'IN', 'DFF');
const eb2 = cellAt('EB2', 'IN', 'FAD'), eb2dff = cellAt('EB2', 'IN', 'DFF'), ew = cellAt('EW', 'IN', 'FAD');
const move = moveDays('EB3', 'IN') ?? 0;
const retro = retrogressions('EB3', 'IN');
const octs = ['2016-10', '2020-10', '2021-10', '2022-10', '2023-10', '2024-10', '2025-10', '2026-10'].map((m) => at(m));
const jul07 = at('2007-07');
const bt6 = backtestCell('EB3', 'IN', 6)!, bt24 = backtestCell('EB3', 'IN', 24)!;
// Changements de tête entre EB-2 et EB-3 Inde depuis janvier 2015.
const lead = (i: number) => { const a = cellAt('EB2', 'IN', 'FAD', i), b = cellAt('EB3', 'IN', 'FAD', i); if (a === 'U' || b === 'U' || a === 'C' || b === 'C') return null; return isoToDays(a) > isoToDays(b) ? 2 : isoToDays(a) < isoToDays(b) ? 3 : 0; };
let swaps = 0, last: number | null = null;
MONTHS.forEach((m, i) => { if (m < '2015-01') return; const l = lead(i); if (l === null || l === 0) return; if (last !== null && l !== last) swaps++; last = l; });
const isDate = (c: string) => c !== 'C' && c !== 'U';
const gapM = isDate(fad) && isDate(eb2) ? Math.round((isoToDays(fad) - isoToDays(eb2)) / 30.4375) : NaN;
const en = (c: string) => cellText(c, 'en');

export default definePage({
  id: "eb-3-india", group: "employment", order: 209, parent: "eb-3",
  tool: {"kind": "greencard", "cat": "EB3", "country": "IN"},
  data: {"cat": "EB3", "country": "IN"},
  related: ["eb-3", "country-india", "eb-2-india", "guide-eb2-to-eb3", "guide-portability"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-3/india",
    nav: 'EB-3 India', card: 'Indian skilled workers and professionals: a cutoff that took five years to climb back, and its tug of war with EB-2 India.',
    title: 'EB-3 India Priority Date 2026: Cutoff and Five-Year Loop',
    description: 'EB-3 India in the Visa Bulletin: this month’s cutoff and filing date, the 2022 fall it took until 2026 to undo, and how it trades places with EB-2 India.',
    h1: 'EB-3 India: back where it stood in October 2021',
    intro: 'Enter the priority date of your PERM labor certification to check where an EB-3 case for a person born in India stands this month.',
    resume: `The ${monthName(LATEST, 'en')} Visa Bulletin puts EB-3 India at a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}${move === 0 ? ', with no change in the Final Action Date from the previous bulletin' : ''}. The same Final Action Date reached ${en(octs[2])} in October 2021, then fell to ${en(octs[3])} a year later, so the cutoff spent five fiscal years climbing back to where it had already been. ${Number.isFinite(gapM) ? `Against EB-2 India (${en(eb2)}), the third preference is ${gapM === 0 ? 'level' : `about ${Math.abs(gapM)} months ${gapM > 0 ? 'ahead' : 'behind'}`} this month, and the two Indian rows have swapped the lead ${swaps} times since 2015.` : ''} ${ew === fad ? 'EB-3 Other Workers India carries the identical date.' : ''} Our back-test does not support a forecast for this queue at any distance we tested: a year or more behind, the median error ran from about ${backtestCell('EB3', 'IN', 12)!.medianError} to ${backtestCell('EB3', 'IN', 48)!.medianError} months.`,
    faqs: [
      { q: 'What happened to EB-3 India after October 2021?', a: 'The Indian EB-3 cutoff reached January 1, 2014 in October 2021 and fell to January 15, 2012 in the very next bulletin, November 2021. It then crept forward to April 1, 2012 by October 2022. The bulletin gives no line-by-line reason. It took until mid-2026 for the Final Action Date to return to January 1, 2014.' },
      { q: 'Do EB-3 India and EB-3 Other Workers India share one date?', a: 'They have in every bulletin since February 2012: both Indian rows carry the same Final Action Date and the same Date for Filing. The rows are still counted separately, and Other Workers has a statutory ceiling of 10,000 numbers a year worldwide, so they can diverge again. Check the row that matches the job classification on the I-140.' },
      { q: 'Can an EB-3 India applicant change employers with a pending I-485?', a: 'Under the portability rules known as AC21, an applicant whose Form I-485 has been pending for 180 days or more can generally move to a job in the same or a similar occupational classification without losing the underlying petition. The portability guide sets out the conditions; a licensed immigration attorney can apply them to a specific case.' },
    ],
    body: (h) => `
<h2>A five-year loop</h2>
<p>October readings tell this queue’s story. The Indian EB-3 Final Action Date was ${h.cell(octs[0])} in October 2016 and ${h.cell(octs[1])} in October 2020, then jumped to ${h.cell(octs[2])} in October 2021. A year later it read ${h.cell(octs[3])}. It came back slowly: ${h.cell(octs[4])} in 2023, ${h.cell(octs[5])} in 2024, ${h.cell(octs[6])} in 2025 and ${h.cell(octs[7])} in 2026. A priority date from early 2013 was therefore current in October 2021, behind the cutoff one bulletin later, when November 2021 brought the date back to ${h.cell(at('2021-11'))}, and current again only by October 2025. Applicants whose I-485 was not approved inside that short window kept it pending, renewing the work permit and travel document, and waited about four years for the date to come back.</p>
<h2>EB-3 or EB-2 for India</h2>
<p>${Number.isFinite(gapM) ? `This month the EB-2 India Final Action Date is ${h.cell(eb2)}, so EB-3 is ${gapM === 0 ? 'level with it' : `about ${h.num(Math.abs(gapM))} months ${gapM > 0 ? 'ahead' : 'behind'}`}.` : `This month EB-2 India reads ${h.cell(eb2)}.`} ${dff === eb2dff ? `Both Indian rows share the same Date for Filing, ${h.cell(dff)}.` : ''} Since January 2015 the lead between the two rows has changed hands ${h.num(swaps)} times, which is why employers sometimes file a second Form I-140 in the other preference for the same worker. ${h.a('eb-2-india', 'EB-2 India')} and the ${h.a('guide-eb2-to-eb3', 'EB-2 to EB-3 calculator')} show both queues.</p>
<h2>Older history</h2>
<p>The row has retrogressed ${h.num(retro.n)} times since 2001. Its largest single fall followed the July 2007 bulletin, which listed it as ${h.cell(jul07)}: after two months marked unavailable, ${h.month(retro.worstAt)} reopened it at ${h.cell(at(retro.worstAt))}, about ${h.num(Math.round(retro.worstMonths))} months lower. ${h.a('guide-retrogression', 'More on retrogression')}.</p>
<h2>Why no date is forecast</h2>
<p>Tested month by month from October 2012 to October 2025, forecasts for Indian EB-3 dates six months behind the cutoff missed by a median of ${h.num(bt6.medianError)} months, and two years behind by ${h.num(bt24.medianError)} months, with the range catching ${h.pct(bt24.coverage)} of outcomes. Neither meets our rule. The calculator shows where your date stands and whether you can file.</p>`,
  },
});
