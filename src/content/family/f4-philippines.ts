import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés).
const fad = cellAt('F4', 'PH', 'FAD');
const dff = cellAt('F4', 'PH', 'DFF');
const row = cellAt('F4', 'ROW', 'FAD');
const india = cellAt('F4', 'IN', 'FAD');
const oct2016 = cellAt('F4', 'PH', 'FAD', MONTHS.indexOf('2016-10'));
const oct2019 = cellAt('F4', 'PH', 'FAD', MONTHS.indexOf('2019-10'));
const oct2025 = cellAt('F4', 'PH', 'FAD', MONTHS.indexOf('2025-10'));
const move = moveDays('F4', 'PH') ?? 0;
const bt6 = backtestCell('F4', 'PH', 6)!;
const bt12 = backtestCell('F4', 'PH', 12)!;
const bt48 = backtestCell('F4', 'PH', 48)!;
const retro = retrogressions('F4', 'PH');
const en = (c: string) => cellText(c, 'en');
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const now = `${LATEST}-01`;
const gained = years(oct2016, fad);
const lastYear = years(oct2025, fad);
const aheadOfIndia = india !== 'C' && india !== 'U' && fad > india;

export default definePage({
  id: "f4-philippines", group: "family", order: 113, parent: "f4",
  tool: {"kind": "greencard", "cat": "F4", "country": "PH"},
  data: {"cat": "F4", "country": "PH"},
  related: ["f4", "country-philippines", "f4-india", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f4/philippines",
    nav: 'F4 Philippines', card: 'Brothers and sisters of U.S. citizens born in the Philippines: a line that has gained years on the calendar.',
    title: 'F4 Philippines Priority Date 2026: Sibling Visa Cutoff',
    description: 'F4 Philippines: the cutoff for brothers and sisters of U.S. citizens, how the line gained ground since 2016, and the most accurate family forecast we test.',
    h1: 'F4 Philippines: the sibling line that has been catching up',
    intro: 'Enter the priority date from the I-130 your U.S. citizen brother or sister filed to check the cutoff and see the tested range for when it may be reached.',
    resume: `F4 is the preference for brothers and sisters of U.S. citizens who are at least 21, and applicants born in the Philippines have their own cutoff because of the 7% per-country cap. In the ${LATEST.slice(0, 4)} bulletins the Philippine Final Action Date is ${en(fad)}, against ${en(row)} for the rest of the world and ${en(india)} for India. The Dates for Filing chart, accepted by USCIS for family cases this month, is ${en(dff)}. The striking fact about this line is speed: since October 2016 the cutoff has advanced about ${Math.round(gained)} years, while ten years passed on the calendar, so the wait in front of a new petition has been shrinking. Retrogression is rare here, with ${retro.n} backward moves since 2001. That steady record makes it one of the family cases where our back-test does best: for people a year behind the cutoff, the median miss was ${bt12.medianError} months.`,
    faqs: [
      { q: 'Why has the F4 Philippines cutoff moved faster than time?', a: 'A cutoff advances faster than the calendar when the State Department sees fewer applicants than expected ready to use the numbers available in a fiscal year. It then moves the date to reach people further down the list, sometimes by many months in one bulletin. The Philippine F4 date has done this for most of the last decade.' },
      { q: 'Can the spouse and children of an F4 Philippines beneficiary come too?', a: 'Yes, a sibling’s spouse and unmarried children under 21 can usually immigrate as derivatives on the same F4 petition with the same priority date. Children must still qualify as children when the visa is issued, under the Child Status Protection Act formula, and on a wait of many years some do not.' },
      { q: 'Is the F4 Philippines forecast on this page reliable?', a: 'It is the strongest of the family cases we test. From October 2012 to October 2025 the forecast passed our threshold at six, twelve, twenty-four and forty-eight months behind the cutoff, with some of the smallest median errors of any family line. It is still a likely window built from past movement, and a policy change or a surge in demand can break it.' },
    ],
    body: (h) => `
<h2>Ten years, more than ten years of progress</h2>
<p>October 2016 printed ${h.cell(oct2016)} for Philippine siblings. October 2019 printed ${h.cell(oct2019)}. Today the cutoff is ${h.cell(fad)}, about ${h.num(gained, 1)} years further on, and ${h.num(lastYear, 1)} of those years came in the last twelve months alone. The latest bulletin moved it ${h.num(Math.abs(Math.round(move)))} days ${move >= 0 ? 'forward' : 'backward'}. The gap to the worldwide F4 date, ${h.cell(row)}, is now about ${h.num(years(fad, row), 1)} years. Measured against the bulletin month, the queue is now about ${h.num(years(fad, now), 1)} years long, down from more than twenty in 2016.</p>
<h2>Philippines and India on the sibling line</h2>
<p>Three countries carry their own F4 date in recent bulletins: Mexico, India and the Philippines. Between the last two, the Philippine date was the further behind for years. ${aheadOfIndia ? `It is now ahead, at ${h.cell(fad)} against ${h.cell(india)} for India, a reversal driven by the Philippine line's pace.` : `It is still behind India's ${h.cell(india)}.`} ${h.a('f4-india', 'Read the F4 India page')} for the other side.</p>
<h2>What the back-test says</h2>
<p>Six months behind the cutoff, our forecast missed the real date by a median of ${h.num(bt6.medianError)} months; four years behind, by ${h.num(bt48.medianError)}, and the range held the outcome ${h.pct(bt48.coverage)} of the time. Those are among the smallest errors of any family case on this site. Only ${h.num(retro.n)} retrogressions since 2001, the largest about ${h.num(Math.round(retro.worstMonths))} months in ${h.month(retro.worstAt)}, help explain why.</p>
<h2>Where the case ends</h2>
<p>A sibling living in the Philippines finishes through the immigrant visa process after the National Visa Center stage, and the cutoff that counts there is the Final Action Date. One already in the United States in a status that allows adjustment can use the filing chart USCIS designates. ${h.a('consular-processing-cost', 'The consular cost page')} lists the government fees for the visa route, and ${h.src('consular', 'the State Department process page')} explains the steps.</p>`,
  },
});
