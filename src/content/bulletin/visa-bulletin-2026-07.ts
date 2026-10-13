import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, MONTHS, type Cat, type Country } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';

// Bulletin de juillet 2026 (premier mois du dernier trimestre de l'exercice), comparé à juin.
type Q = Exclude<Cat, 'IR'>;
const JUL = MONTHS.indexOf('2026-07');
const JUN = JUL - 1;
const cut = (c: Q, k: Country, i = JUL, ch: 'FAD' | 'DFF' = 'FAD') => cellAt(c, k, ch, i);
const step = (c: Q, k: Country) => Math.round(moveDays(c, k, 'FAD', JUL) ?? 0);
const abs = (n: number) => Math.abs(n);
const s = (x: string) => cellText(x, 'en');
const eb1InMay = cut('EB1', 'IN', MONTHS.indexOf('2026-05'));
const reopened = cut('EB2', 'IN', MONTHS.indexOf('2026-10'));

export default definePage({
  id: "visa-bulletin-2026-07", group: "bulletin", order: 23, parent: "visa-bulletin",
  tool: {"kind": "bulletin", "month": "2026-07", "cat": "EB2", "country": "IN"},
  data: {"month": "2026-07"},
  related: ["visa-bulletin", "visa-bulletin-history", "visa-bulletin-predictions", "eb-3-china", "visa-bulletin-2026-08"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "visa-bulletin/2026-07",
    nav: 'July 2026', card: 'EB-2 and EB-5 India marked unavailable, EB-3 China up almost five months, F1 worldwide forward.',
    title: 'July 2026 Visa Bulletin: EB-2 India Unavailable, F1 Advances',
    description: 'July 2026 Visa Bulletin: EB-2 and EB-5 India listed as unavailable, EB-1 India down again, EB-3 China and F1 worldwide forward. Every box against June.',
    h1: 'July 2026 Visa Bulletin: India closes, China and F1 move up',
    intro: 'Choose a category and country to read the July 2026 cutoffs on both charts and compare each box with the June 2026 bulletin.',
    resume: `July opens the last quarter of the federal fiscal year, and the July 2026 Visa Bulletin looked like it. Two Indian employment boxes closed: EB-2 India, at ${s(cut('EB2', 'IN', JUN))} in June, and EB-5 India, at ${s(cut('EB5', 'IN', JUN))}, were both listed as ${s(cut('EB2', 'IN'))}, meaning no visa number could be issued in them that month whatever the priority date. EB-1 India took a second step back, ${abs(step('EB1', 'IN'))} days to ${s(cut('EB1', 'IN'))}. China went the other way: EB-3 China gained ${step('EB3', 'CN')} days to ${s(cut('EB3', 'CN'))}, EB-1 China ${step('EB1', 'CN')} and EB-5 China ${step('EB5', 'CN')}. Families of most countries saw F1 advance ${step('F1', 'ROW')} days to ${s(cut('F1', 'ROW'))}, while F2A did not move. The Indian boxes stayed closed through September; EB-2 India came back in October at ${s(reopened)}.`,
    faqs: [
      { q: 'What did “unavailable” mean for EB-2 India in the July 2026 Visa Bulletin?', a: 'It meant that no EB-2 visa number could be issued that month to anyone charged to India, so no Indian EB-2 green card could be approved in July, however old the priority date. Applications already filed simply stayed pending. The box remained unavailable in August and September and returned with a date in the October 2026 bulletin.' },
      { q: 'Why did EB-3 China advance in the July 2026 Visa Bulletin?', a: 'The bulletin gives no reason line by line, so we can only report the dates: EB-3 China moved almost five months on the Final Action chart while EB-2 China stood still. Chinese EB-3 has often moved on its own rhythm, sometimes ahead of EB-2 China, which is why both pages compare the two lines.' },
      { q: 'Did F2A move in the July 2026 Visa Bulletin?', a: 'No. The F2A Final Action Date stayed where June had left it, for most countries and for Mexico alike, while the F2A filing column remained current. The large F2A advance of the year came a month later, in the August 2026 bulletin, when the cutoff jumped well over a year.' },
    ],
    body: (h) => `
<h2>The quarter when numbers run short</h2>
<p>The fiscal year runs from October to September, and each country may receive at most ${h.pct(h.P.limits.perCountryShare)} of the preference numbers in it. By July, a line with heavy demand may have used its share. That is what the two closed boxes suggest. EB-2 India went from ${h.cell(cut('EB2', 'IN', JUN))} to ${h.cell(cut('EB2', 'IN'))}; EB-5 India, which had been at ${h.cell(cut('EB5', 'IN', JUN))}, closed the same way. EB-1 India lost another ${h.num(abs(step('EB1', 'IN')))} days, to ${h.cell(cut('EB1', 'IN'))}, after starting May at ${h.cell(eb1InMay)}. The Dates for Filing column for EB-2 India still read ${h.cell(cut('EB2', 'IN', JUL, 'DFF'))}: a closed Final Action box stops approvals, not the printing of the second chart.</p>
<h2>China moved the other way</h2>
<p>Chinese applicants had one of their better months. EB-3 China rose ${h.num(step('EB3', 'CN'))} days to ${h.cell(cut('EB3', 'CN'))}, the largest employment advance of the bulletin. EB-1 China gained ${h.num(step('EB1', 'CN'))} days to ${h.cell(cut('EB1', 'CN'))}, EB-5 China ${h.num(step('EB5', 'CN'))} days to ${h.cell(cut('EB5', 'CN'))}. EB-2 China, at ${h.cell(cut('EB2', 'CN'))}, did not move. For the rest of the world, EB-3 advanced ${h.num(step('EB3', 'ROW'))} days to ${h.cell(cut('EB3', 'ROW'))} and EB-4 ${h.num(step('EB4', 'ROW'))} days.</p>
<h2>Families: F1 out in front</h2>
<p>F1 for most countries gained ${h.num(step('F1', 'ROW'))} days, to ${h.cell(cut('F1', 'ROW'))}. F3 Philippines moved ${h.num(step('F3', 'PH'))} days and F3 worldwide ${h.num(step('F3', 'ROW'))}. F2B worldwide added ${h.num(step('F2B', 'ROW'))} days. Brothers and sisters advanced as well: F4 worldwide by ${h.num(step('F4', 'ROW'))} days and F4 Philippines by ${h.num(step('F4', 'PH'))}. Mexico saw only F3 move, by ${h.num(step('F3', 'MX'))} days to ${h.cell(cut('F3', 'MX'))}. F2A held at ${h.cell(cut('F2A', 'ROW'))}.</p>
<h2>Reading July for an Indian EB-2 case</h2>
<p>An unavailable box is not a retrogression in the usual sense: nobody's place in line changed, the line simply stopped. A pending Form I-485 remained pending, and a priority date earlier than the old cutoff kept its place. Investors charged to India were in the same position under EB-5. What the calculator could not do that month was give a date, and the ${h.a('visa-bulletin-predictions', 'predictions table')} skips unavailable boxes for the same reason. The ${h.a('eb-3-china', 'EB-3 China page')} has the full Chinese record. Previous month: ${h.a('visa-bulletin-2026-06', 'June 2026')}. Next: ${h.a('visa-bulletin-2026-08', 'August 2026')}.</p>`,
  },
});
