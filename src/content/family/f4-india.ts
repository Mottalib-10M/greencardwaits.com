import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS, LATEST, LATEST_INDEX } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés).
const fad = cellAt('F4', 'IN', 'FAD');
const dff = cellAt('F4', 'IN', 'DFF');
const row = cellAt('F4', 'ROW', 'FAD');
const ph = cellAt('F4', 'PH', 'FAD');
const oct2016 = cellAt('F4', 'IN', 'FAD', MONTHS.indexOf('2016-10'));
const oct2021 = cellAt('F4', 'IN', 'FAD', MONTHS.indexOf('2021-10'));
const move = moveDays('F4', 'IN') ?? 0;
const bt6 = backtestCell('F4', 'IN', 6)!;
const bt12 = backtestCell('F4', 'IN', 12)!;
const bt24 = backtestCell('F4', 'IN', 24)!;
const retro = retrogressions('F4', 'IN');
const en = (c: string) => cellText(c, 'en');
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const now = `${LATEST}-01`;
// Premier bulletin depuis 2010 où l'Inde a eu sa propre date F4, et part des bulletins séparés depuis.
const from2010 = MONTHS.indexOf('2010-01');
let split = -1, apart = 0;
for (let i = from2010; i <= LATEST_INDEX; i++) {
  const a = cellAt('F4', 'IN', 'FAD', i), r = cellAt('F4', 'ROW', 'FAD', i);
  if (a === 'U' || r === 'U') continue;
  if (a !== r) { if (split < 0) split = i; apart++; }
}
const splitMonth = MONTHS[split];
const sinceSplit = LATEST_INDEX - split + 1;
const atSplit = cellAt('F4', 'IN', 'FAD', split);
const gained = years(oct2016, fad);

export default definePage({
  id: "f4-india", group: "family", order: 114, parent: "f4",
  tool: {"kind": "greencard", "cat": "F4", "country": "IN"},
  data: {"cat": "F4", "country": "IN"},
  related: ["f4", "country-india", "f4-philippines", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f4/india",
    nav: 'F4 India', card: 'Brothers and sisters of U.S. citizens born in India: a line split from the world in 2016 and still slow.',
    title: 'F4 India Visa Bulletin 2026: Sibling Cutoff and Forecast',
    description: 'F4 India: the cutoff for siblings of U.S. citizens born in India, the 2016 split from the worldwide date, the filing chart and a tested range for the wait.',
    h1: 'F4 India: the sibling queue that left the worldwide line',
    intro: 'Enter the priority date from the I-130 filed by your U.S. citizen brother or sister to see the Indian F4 cutoff, the filing status and the tested range.',
    resume: `F4 is the preference for brothers and sisters of adult U.S. citizens. For most of the archive, siblings born in India shared the worldwide F4 date; since ${splitMonth.slice(0, 4)} they have had their own, because Indian demand in this category passes the 7% per-country cap. In the ${LATEST.slice(0, 4)} bulletins the Indian Final Action Date is ${en(fad)}, while the rest of the world is at ${en(row)}, roughly ${Math.round(years(fad, row))} years ahead. The Dates for Filing chart, accepted by USCIS for family cases this month, reads ${en(dff)}. The Indian line has been slow: since October 2016 it gained only about ${Math.round(gained)} years while ten passed on the calendar, so the queue in front of a new petition has grown. Our back-test passes for people six months and a year behind the cutoff, with median misses of ${bt6.medianError} and ${bt12.medianError} months, and fails further out.`,
    faqs: [
      { q: 'When did F4 India get its own Visa Bulletin date?', a: 'In the archive we hold, the Indian F4 date matched the worldwide date from 2002 and separated again in June 2016, with a large step backwards. Since then India has had its own sibling cutoff in nearly every bulletin. The separation follows demand: once Indian F4 applicants would use more than 7% of the year’s numbers, they queue apart.' },
      { q: 'Can my spouse’s birthplace change the F4 India queue?', a: 'Possibly. Under cross-chargeability, a beneficiary born in India may be charged to the spouse’s country of birth when the spouses immigrate together, which for a spouse born in a worldwide country means the much earlier F4 date. The rule has conditions, so have a licensed immigration attorney or DOJ-accredited representative look at the file.' },
      { q: 'Why does the F4 India forecast stop working two years out?', a: 'Because the Indian line has its own short history. Since the 2016 split there are few full cycles to learn from, and the pace has changed more than once. In the back-test, the range held the real date too rarely for people two years or more behind the cutoff, so the calculator shows only the cutoff and your distance from it.' },
    ],
    body: (h) => `
<h2>The ${h.month(splitMonth)} split</h2>
<p>From 2002 until ${h.month(splitMonth)}, an Indian brother or sister of a U.S. citizen waited on the same date as a sibling from Kenya or Peru. That month the Indian F4 column broke away at ${h.cell(atSplit)}, and it has stayed apart in ${h.num(apart)} of the ${h.num(sinceSplit)} bulletins since. The largest single drop in this line's history, about ${h.num(Math.round(retro.worstMonths))} months, came in ${h.month(retro.worstAt)}. ${h.a('guide-per-country', 'How the per-country cap creates separate lines')}.</p>
<h2>A line that loses ground</h2>
<p>In October 2016 the Indian cutoff was ${h.cell(oct2016)}; in October 2021, ${h.cell(oct2021)}; today ${h.cell(fad)}. Measured against the bulletin month, the queue is about ${h.num(years(fad, now), 1)} years long and has lengthened over the decade, because the date advanced about ${h.num(gained, 1)} years in ten. The latest bulletin moved it ${h.num(Math.abs(Math.round(move)))} days ${move >= 0 ? 'forward' : 'backward'}. The Philippine sibling line, at ${h.cell(ph)}, did the opposite over the same years. ${h.a('f4-philippines', 'Compare with F4 Philippines')}.</p>
<h2>Filing chart and the visa route</h2>
<p>With USCIS accepting the Dates for Filing chart for family cases this month, a beneficiary already in the United States and eligible to adjust could file Form I-485 with a priority date earlier than ${h.cell(dff)}. A sibling in India completes the case through the immigrant visa process, and there only the Final Action Date counts. ${h.src('aosCharts', 'USCIS filing charts')}.</p>
<h2>How far the forecast reaches</h2>
<p>We tested the model from October 2012 to October 2025, each month blind to later bulletins. A year behind the cutoff, it missed by a median of ${h.num(bt12.medianError)} months and the range held the real date ${h.pct(bt12.coverage)} of the time, ${bt12.reliable ? 'which passed our threshold' : 'which did not pass our threshold'}. Two years behind, the median miss was ${h.num(bt24.medianError)} months and the range was right only ${h.pct(bt24.coverage)} of the time, so ${bt24.reliable ? 'the calculator still shows a wide range' : 'the calculator says no reliable forecast'}.</p>`,
  },
});
