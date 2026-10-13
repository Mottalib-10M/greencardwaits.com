import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS, LATEST, LATEST_INDEX } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés).
const fad = cellAt('F1', 'PH', 'FAD');
const dff = cellAt('F1', 'PH', 'DFF');
const row = cellAt('F1', 'ROW', 'FAD');
const f2b = cellAt('F2B', 'PH', 'FAD');
const prevF1 = cellAt('F1', 'PH', 'FAD', LATEST_INDEX - 1);
const prevF2b = cellAt('F2B', 'PH', 'FAD', LATEST_INDEX - 1);
const oct2014 = cellAt('F1', 'PH', 'FAD', MONTHS.indexOf('2014-10'));
const oct2015 = cellAt('F1', 'PH', 'FAD', MONTHS.indexOf('2015-10'));
const oct2016 = cellAt('F1', 'PH', 'FAD', MONTHS.indexOf('2016-10'));
const move = moveDays('F1', 'PH') ?? 0;
const bt12 = backtestCell('F1', 'PH', 12)!;
const bt6 = backtestCell('F1', 'PH', 6)!;
const retro = retrogressions('F1', 'PH');
const en = (c: string) => cellText(c, 'en');
const isDate = (c: string) => c !== 'C' && c !== 'U';
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
// F1 plus lente que F2B quand sa date limite est antérieure : compté sur tous les bulletins depuis 2001.
let compared = 0, f1Behind = 0;
for (let i = 0; i < MONTHS.length; i++) {
  const a = cellAt('F1', 'PH', 'FAD', i), b = cellAt('F2B', 'PH', 'FAD', i);
  if (!isDate(a) || !isDate(b)) continue;
  compared++;
  if (a < b) f1Behind++;
}
const f1SlowerNow = isDate(fad) && isDate(f2b) && fad < f2b;
const f1SlowerBefore = isDate(prevF1) && isDate(prevF2b) && prevF1 < prevF2b;
const gapF2b = isDate(fad) && isDate(f2b) ? Math.abs(years(fad, f2b)) * 12 : 0;

export default definePage({
  id: "f1-philippines", group: "family", order: 110, parent: "f1",
  tool: {"kind": "greencard", "cat": "F1", "country": "PH"},
  data: {"cat": "F1", "country": "PH"},
  related: ["f1", "country-philippines", "f2b-philippines", "guide-f2b-to-f1", "guide-chargeability"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f1/philippines",
    nav: 'F1 Philippines', card: 'Adult unmarried children of U.S. citizens born in the Philippines: cutoff, F2B comparison and history.',
    title: 'F1 Philippines Visa Bulletin 2026: Cutoff vs F2B Queue',
    description: 'F1 Philippines in the Visa Bulletin: this month’s cutoff for adult sons and daughters of U.S. citizens, how it compares with F2B, and every October since 2002.',
    h1: 'F1 Philippines: the queue for adult children of U.S. citizens',
    intro: 'Enter the priority date from your parent’s I-130 receipt to see if you can file this month and how the Philippine F1 line has moved since 2001.',
    resume: `F1 is the preference for unmarried sons and daughters, 21 or older, of U.S. citizens, and applicants born in the Philippines wait on their own line. In the ${LATEST.slice(0, 4)} bulletins the Philippine Final Action Date is ${en(fad)}, against ${en(row)} for the rest of the world, a gap of about ${Math.round(years(fad, row))} years caused by the 7% per-country cap. The Dates for Filing chart, which USCIS currently accepts for family cases, reads ${en(dff)}. A common belief is that F1 is always faster than F2B, the line for adult children of green card holders. For the Philippines that is not reliable: the F1 cutoff was the earlier, slower one of the two in ${f1Behind} of ${compared} bulletins since 2001, and this month the F1 date is ${f1SlowerNow ? 'behind' : 'ahead of'} the Philippine F2B date of ${en(f2b)}. Our back-test for people one year behind the cutoff missed by a median of ${bt12.medianError} months, so we show ranges only where the test passed.`,
    faqs: [
      { q: 'Is F1 Philippines slower than F2B Philippines?', a: 'It depends on the month. Across the archive since 2001, the Philippine F1 cutoff sat behind the F2B cutoff in most bulletins, which surprises families who expect a citizen parent to mean a shorter wait. In recent years the two dates have run within a few months of each other and have swapped places more than once, so compare both lines in the current bulletin.' },
      { q: 'What happens to an F2B Philippines case when the parent becomes a U.S. citizen?', a: 'When a green card holder parent naturalizes, an unmarried son or daughter over 21 moves from F2B to F1 and keeps the original priority date. For applicants born in the Philippines this is not automatically an improvement, because the two Philippine dates have often been close or reversed. Our F2B to F1 guide explains the comparison, and an accredited representative can review a specific file.' },
      { q: 'Does marriage end an F1 Philippines petition?', a: 'F1 covers unmarried sons and daughters of U.S. citizens. If the beneficiary marries, the case falls into F3, the married sons and daughters line, and the Philippine F3 queue is far longer than F1. The priority date carries over, but the wait changes. Check the F3 Philippines page and talk to a licensed immigration attorney before any change in civil status.' },
      { q: 'Why does the F1 Philippines cutoff sometimes jump by months?', a: 'The State Department moves each cutoff according to the numbers left for the fiscal year and the demand already documented. When demand from the Philippines in F1 is lower than expected, the date can advance several months in one bulletin; when it is higher, the date stalls or retrogresses. The 2015 drop on this page shows how sharp a correction can be.' },
    ],
    body: (h) => `
<h2>Two Philippine lines that keep trading places</h2>
<p>A question Filipino families often bring to this page is whether a citizen parent beats a green card holder parent. On paper it should: F1 gets its own yearly allotment and F2B shares the F2 share with spouses and minor children. In practice the Philippine F1 cutoff was earlier than the Philippine F2B cutoff in ${h.num(f1Behind)} of the ${h.num(compared)} bulletins we hold, ${h.pct(f1Behind / compared)} of the time. This month F1 reads ${h.cell(fad)} and F2B reads ${h.cell(f2b)}, so F1 is ${f1SlowerNow ? 'behind' : 'ahead'} by about ${h.num(Math.round(gapF2b))} month${Math.round(gapF2b) === 1 ? '' : 's'}${f1SlowerBefore !== f1SlowerNow ? ', after being on the other side last month' : ''}. ${h.a('f2b-philippines', 'See the F2B Philippines page')} for the other half of the comparison.</p>
<h2>The 2015 correction</h2>
<p>In October 2014 the cutoff stood at ${h.cell(oct2014)}. A year later it was back to ${h.cell(oct2015)}. Since 2001 the Philippine F1 date has moved backwards ${h.num(retro.n)} times, and the largest drop, about ${h.num(Math.round(retro.worstMonths))} months, came in ${h.month(retro.worstAt)}. Since that reset the line has recovered steadily: ${h.cell(oct2016)} in October 2016, ${h.cell(fad)} now. The latest bulletin moved it ${h.num(Math.abs(Math.round(move)))} days ${move >= 0 ? 'forward' : 'backward'}.</p>
<h2>Filing now, waiting here or in Manila</h2>
<p>With USCIS accepting the Dates for Filing chart for family cases this month, a beneficiary already in the United States whose priority date is earlier than ${h.cell(dff)} may file Form I-485, if otherwise eligible. A beneficiary living in the Philippines finishes through the immigrant visa process instead, after the National Visa Center collects documents. The cutoff that matters for the visa itself remains the Final Action Date. ${h.src('aosCharts', 'USCIS filing-chart page')}.</p>
<h2>What our forecast can say</h2>
<p>We replayed the forecast each month from October 2012 to October 2025 with only the bulletins known at the time. Six months behind the cutoff, the middle estimate missed by a median of ${h.num(bt6.medianError)} months; a year behind, by ${h.num(bt12.medianError)}. ${bt12.reliable ? 'That passed our threshold, so the calculator shows a range.' : 'That did not pass our threshold, so for most dates the calculator shows your distance from the cutoff and says there is no reliable forecast.'}</p>`,
  },
});
