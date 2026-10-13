import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés).
const fad = cellAt('F3', 'PH', 'FAD');
const dff = cellAt('F3', 'PH', 'DFF');
const row = cellAt('F3', 'ROW', 'FAD');
const mx = cellAt('F3', 'MX', 'FAD');
const f1 = cellAt('F1', 'PH', 'FAD');
const oct2016 = cellAt('F3', 'PH', 'FAD', MONTHS.indexOf('2016-10'));
const oct2021 = cellAt('F3', 'PH', 'FAD', MONTHS.indexOf('2021-10'));
const oct2006 = cellAt('F3', 'PH', 'FAD', MONTHS.indexOf('2006-10'));
const move = moveDays('F3', 'PH') ?? 0;
const bt6 = backtestCell('F3', 'PH', 6)!;
const bt12 = backtestCell('F3', 'PH', 12)!;
const bt24 = backtestCell('F3', 'PH', 24)!;
const retro = retrogressions('F3', 'PH');
const en = (c: string) => cellText(c, 'en');
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const now = `${LATEST}-01`;
// Avance de la date limite pendant les dix derniers octobres, comparée aux dix années écoulées.
const advance10 = years(oct2016, fad);

export default definePage({
  id: "f3-philippines", group: "family", order: 112, parent: "f3",
  tool: {"kind": "greencard", "cat": "F3", "country": "PH"},
  data: {"cat": "F3", "country": "PH"},
  related: ["f3", "country-philippines", "f1-philippines", "guide-cspa", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form", "vbOct2026", "famPref"],
  en: {
    path: "family/f3/philippines",
    nav: 'F3 Philippines', card: 'Married sons and daughters of U.S. citizens born in the Philippines: the longest Philippine family wait.',
    title: 'F3 Philippines Visa Bulletin 2026: Married Children Wait',
    description: 'F3 Philippines: the cutoff for married sons and daughters of U.S. citizens, why this queue runs close to two decades, and how fast it has gained ground.',
    h1: 'F3 Philippines: married children of citizens, the longest Philippine line',
    intro: 'Enter the priority date from the I-130 filed by your U.S. citizen parent to see your distance from the cutoff and the history of the Philippine F3 line.',
    resume: `F3 is the preference for married sons and daughters of U.S. citizens, and it is the longest of the family lines for people born in the Philippines. In the ${LATEST.slice(0, 4)} bulletins the Philippine Final Action Date is ${en(fad)}, about ${Math.round(years(fad, now))} years before the bulletin month, while the rest of the world stands at ${en(row)}. Only Mexico is further back, at ${en(mx)}. The Dates for Filing chart, accepted by USCIS for family cases this month, reads ${en(dff)}. The news is not all bad: between October 2016 and today the cutoff advanced about ${Math.round(advance10)} years, faster than the calendar, so the queue has been getting shorter. A married son or daughter's spouse and minor children can usually come on the same petition as derivatives. Our back-test fails for people six months or a year behind, with median misses of ${bt6.medianError} and ${bt12.medianError} months, so no single date is promised.`,
    faqs: [
      { q: 'Why is F3 Philippines so much slower than F3 for other countries?', a: 'Demand from the Philippines in F3 is far above the 7% share any single country may receive, so Filipino applicants queue on a separate date while the worldwide F3 line moves on its own. The country of birth decides the line, not citizenship or residence, and a spouse born elsewhere can sometimes change the chargeability for both.' },
      { q: 'Can a divorce move an F3 Philippines case to F1?', a: 'A married son or daughter of a U.S. citizen who becomes unmarried again generally moves to F1 with the same priority date, because F1 covers unmarried sons and daughters. For the Philippines the F1 date is currently many years ahead of F3. Any change in marital status has legal effects beyond the visa queue, so speak with a licensed immigration attorney first.' },
      { q: 'Do my children age out while we wait in F3 Philippines?', a: 'Children of the married son or daughter come as derivatives only while they count as children, which means unmarried and under 21, adjusted by the Child Status Protection Act formula. On a queue this long, many children pass 21 before the date is reached. The CSPA age-out calculator on this site applies the published formula to your dates.' },
    ],
    body: (h) => `
<h2>Close to two decades, but shrinking</h2>
<p>A married Filipino son or daughter of a U.S. citizen with a priority date at the cutoff today filed about ${h.num(years(fad, now), 1)} years ago. That is the length of this queue, measured against the bulletin. It grew for a decade before it began to shrink: in October 2006 the date stood at ${h.cell(oct2006)}, a queue of about ${h.num(years(oct2006, '2006-10-01'), 1)} years; in October 2016 it was ${h.cell(oct2016)}, about ${h.num(years(oct2016, '2016-10-01'), 1)} years; in October 2021, ${h.cell(oct2021)}. Over the last ten Octobers the cutoff gained about ${h.num(advance10, 1)} years, so each year of waiting has bought more than a year of progress. The latest bulletin moved it ${h.num(Math.abs(Math.round(move)))} days ${move >= 0 ? 'forward' : 'backward'}.</p>
<h2>F3 against F1 in the same family</h2>
<p>A Filipino family can have both kinds of petitions open: one for an unmarried child in F1 and one for a married child in F3. This month the Philippine F1 date is ${h.cell(f1)}, years ahead of F3. That gap is the reason a change in marital status matters so much in these cases, and why ${h.a('f1-philippines', 'the F1 Philippines page')} reads so differently from this one.</p>
<h2>Retrogression and the 2007 drop</h2>
<p>Since 2001 the Philippine F3 date has moved backwards ${h.num(retro.n)} times. The worst single correction, about ${h.num(Math.round(retro.worstMonths))} months, came in ${h.month(retro.worstAt)}. Long lines like this one tend to swing when the State Department finds that documented demand is lower or higher than it planned for.</p>
<h2>What the back-test allows</h2>
<p>For priority dates far behind the cutoff the history is long enough to test: two years behind, the forecast missed by a median of ${h.num(bt24.medianError)} months and ${bt24.reliable ? 'passed our threshold' : 'did not pass our threshold'}. Close to the cutoff it ${bt12.reliable ? 'also passed' : 'failed'}, which is why the calculator may show a range for an early-stage case and refuse one for a case that is almost current. ${h.src('vbIndex', 'Monthly Visa Bulletin')}.</p>`,
  },
});
