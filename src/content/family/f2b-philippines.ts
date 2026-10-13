import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés).
const fad = cellAt('F2B', 'PH', 'FAD');
const dff = cellAt('F2B', 'PH', 'DFF');
const row = cellAt('F2B', 'ROW', 'FAD');
const mx = cellAt('F2B', 'MX', 'FAD');
const oct2016 = cellAt('F2B', 'PH', 'FAD', MONTHS.indexOf('2016-10'));
const move = moveDays('F2B', 'PH') ?? 0;
const bt12 = backtestCell('F2B', 'PH', 12)!;
const bt24 = backtestCell('F2B', 'PH', 24)!;
const bt48 = backtestCell('F2B', 'PH', 48)!;
const retro = retrogressions('F2B', 'PH');
const en = (c: string) => cellText(c, 'en');
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
// Plus longue période où la date limite n'a pas bougé (bulletins consécutifs à la même date).
let run = { len: 0, from: '', to: '', value: '' };
for (let i = 0, start = 0; i < MONTHS.length; i++) {
  const v = cellAt('F2B', 'PH', 'FAD', i);
  if (v === 'U') { start = i + 1; continue; }
  if (i > start && v !== cellAt('F2B', 'PH', 'FAD', i - 1)) start = i;
  if (i - start + 1 > run.len) run = { len: i - start + 1, from: MONTHS[start], to: MONTHS[i], value: v };
}

export default definePage({
  id: "f2b-philippines", group: "family", order: 111, parent: "f2b",
  tool: {"kind": "greencard", "cat": "F2B", "country": "PH"},
  data: {"cat": "F2B", "country": "PH"},
  related: ["f2b", "country-philippines", "f1-philippines", "guide-f2b-to-f1", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f2b/philippines",
    nav: 'F2B Philippines', card: 'Adult unmarried children of green card holders, born in the Philippines: the freeze, the thaw and the forecast.',
    title: 'F2B Philippines Priority Date 2026: Freeze and Restart',
    description: 'F2B Philippines: the cutoff for adult unmarried children of green card holders, the long freeze that ended in 2025, and a wait forecast tested since 2012.',
    h1: 'F2B Philippines: from a frozen date to a moving one',
    intro: 'Type the priority date on the I-130 your green card holder parent filed to see if the case can move forward this month and how long the Philippine line has run.',
    resume: `F2B is the preference for unmarried sons and daughters aged 21 or over of lawful permanent residents. Applicants born in the Philippines have a separate cutoff because demand from the country exceeds the 7% per-country cap. In the ${LATEST.slice(0, 4)} bulletins the Philippine Final Action Date is ${en(fad)}, while the rest of the world is at ${en(row)} and Mexico at ${en(mx)}. The Dates for Filing chart, which USCIS currently accepts for family-based adjustment, reads ${en(dff)}. What sets this line apart is the long stop: the date sat at ${en(run.value)} for ${run.len} consecutive bulletins, from ${run.from.slice(0, 4)} to ${run.to.slice(0, 4)}, before moving again. It is also one of the few family lines where our back-test passed at every distance tested, including four years behind the cutoff, where the median miss was ${bt48.medianError} months.`,
    faqs: [
      { q: 'Why did the F2B Philippines date stop moving for years?', a: 'The State Department does not publish a reason for each cutoff, but a date that holds still usually means the documented demand in front of it is enough to use the numbers available for the year. The Philippine F2B date stayed on the same day through several fiscal years before it moved again. Our table of Octobers shows the exact stretch.' },
      { q: 'Can I wait in the United States on an F2B Philippines priority date?', a: 'Only someone already in the United States in a lawful status, or otherwise eligible to adjust, can file Form I-485 when the priority date is earlier than the chart USCIS designates. An F2B priority date alone does not give permission to live or work in the United States. Ask a licensed immigration attorney or DOJ-accredited representative about a specific situation.' },
      { q: 'Does an F2B Philippines beneficiary keep the priority date after the parent naturalizes?', a: 'Yes. When the green card holder parent becomes a citizen, the petition for an unmarried son or daughter over 21 converts to F1 and the priority date stays the same. Whether that shortens the wait depends on how the Philippine F1 and F2B dates compare that month; the two lines have swapped places several times.' },
      { q: 'How reliable is the forecast for F2B Philippines?', a: 'More than for most family cases. In the back-test from October 2012 to October 2025, the forecast passed our threshold at six, twelve, twenty-four and forty-eight months behind the cutoff. The range is still a range: about half the time the real date landed outside it at long distances, so read it as a likely window and never as a promise.' },
    ],
    body: (h) => `
<h2>The longest pause on this line</h2>
<p>For ${h.num(run.len)} bulletins in a row, from ${h.month(run.from)} to ${h.month(run.to)}, the Philippine F2B cutoff read ${h.cell(run.value)}. A son or daughter who turned 21 and was waiting through those years watched the same day printed every month while the worldwide F2B date kept advancing. When the line finally restarted it did so in steps, and the latest bulletin moved it ${h.num(Math.abs(Math.round(move)))} days ${move >= 0 ? 'forward' : 'backward'}, to ${h.cell(fad)}.</p>
<h2>Ten years of distance</h2>
<p>In October 2016 the cutoff was ${h.cell(oct2016)}. Today the queue is about ${h.num(years(fad, `${LATEST}-01`), 1)} years long, counted from the priority date to the bulletin month, against about ${h.num(years(row, `${LATEST}-01`), 1)} years for the same category in the rest of the world. Retrogression has been rare here: ${h.num(retro.n)} backward moves since 2001, the largest about ${h.num(Math.round(retro.worstMonths))} months in ${h.month(retro.worstAt)}. That calm history is part of why the forecast holds up better than on the Mexican F2B line, where our main model fails at every distance tested.</p>
<h2>Why this case can carry a forecast</h2>
<p>Every month from October 2012 to October 2025 we asked the model where the date would go using only the bulletins known at that moment, then compared with what happened. Two years behind the cutoff the median miss was ${h.num(bt24.medianError)} months and the range caught the real date ${h.pct(bt24.coverage)} of the time; one year behind, ${h.num(bt12.medianError)} months and ${h.pct(bt12.coverage)}. The calculator above shows that window when your date sits at a tested distance.</p>
<h2>The F1 question</h2>
<p>If the parent naturalizes, the case becomes F1 with the same priority date. For the Philippines the two dates have run close to each other since 2020, so the switch is not a shortcut by default. ${h.a('f1-philippines', 'Compare with F1 Philippines')} and read ${h.a('guide-f2b-to-f1', 'the F2B to F1 guide')} before counting on it. ${h.src('visaPriority', 'USCIS on visa availability')}.</p>`,
  },
});
