import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, MONTHS, type Cat, type Country } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';

// Bulletin d'août 2026 : le grand saut de F2A, comparé à juillet.
type Q = Exclude<Cat, 'IR'>;
const AUG = MONTHS.indexOf('2026-08');
const box = (c: Q, k: Country, ch: 'FAD' | 'DFF' = 'FAD', i = AUG) => cellAt(c, k, ch, i);
const gain = (c: Q, k: Country, ch: 'FAD' | 'DFF' = 'FAD') => Math.round(moveDays(c, k, ch, AUG) ?? 0);
const txt = (x: string) => cellText(x, 'en');
const daysBefore = (iso: string, ym: string) => Math.round((Date.parse(`${ym}-01`) - Date.parse(iso)) / 86_400_000);
const f2aGapRow = daysBefore(box('F2A', 'ROW'), '2026-08');
const f2aGapMx = daysBefore(box('F2A', 'MX'), '2026-08');
const f2aOct2025 = box('F2A', 'ROW', 'FAD', MONTHS.indexOf('2025-10'));
const f2bMxSince = box('F2B', 'MX', 'FAD', MONTHS.indexOf('2026-02'));

export default definePage({
  id: "visa-bulletin-2026-08", group: "bulletin", order: 22, parent: "visa-bulletin",
  tool: {"kind": "bulletin", "month": "2026-08", "cat": "F2A", "country": "MX"},
  data: {"month": "2026-08"},
  related: ["visa-bulletin", "visa-bulletin-history", "visa-bulletin-predictions", "f2a", "f2a-mexico"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "visa-bulletin/2026-08",
    nav: 'August 2026', card: 'F2A jumped about a year and a half and came within days of current; F1 and F4 worldwide also moved.',
    title: 'August 2026 Visa Bulletin: F2A Jumps Close to Current',
    description: 'August 2026 Visa Bulletin: F2A leapt about eighteen months for most countries and Mexico, F1 and F4 worldwide moved, employment stayed quiet. Every box.',
    h1: 'August 2026 Visa Bulletin: the F2A leap',
    intro: 'Select a category and a country to see the August 2026 cutoffs on both charts and how far each one moved from July 2026.',
    resume: `The August 2026 Visa Bulletin belonged to F2A, the category for spouses and minor children of green card holders. Its Final Action Date for most countries jumped ${gain('F2A', 'ROW')} days, from ${txt(box('F2A', 'ROW', 'FAD', AUG - 1))} to ${txt(box('F2A', 'ROW'))}, which left the cutoff only ${f2aGapRow} days before the bulletin month itself. Mexico, which keeps its own F2A date, moved ${gain('F2A', 'MX')} days to ${txt(box('F2A', 'MX'))}. In October 2025 the worldwide F2A cutoff had read ${txt(f2aOct2025)}. Other family lines advanced too: F1 worldwide by ${gain('F1', 'ROW')} days and F4 worldwide by ${gain('F4', 'ROW')}, while on the filing chart F2B worldwide gained ${gain('F2B', 'ROW', 'DFF')} days. Employment barely moved: EB-2 India and EB-5 India remained unavailable, and the largest employment advance was about a month. F2B Mexico again did not move.`,
    faqs: [
      { q: 'How close to current was F2A in the August 2026 Visa Bulletin?', a: 'Very close for most countries: the Final Action Date landed less than two weeks before the start of the bulletin month, so a visa number was available to nearly every spouse or minor child of a green card holder whose petition was filed before that date. Mexico stayed about a year further back on its own line.' },
      { q: 'Why does F2A Mexico have a different date in the August 2026 Visa Bulletin?', a: 'Because Mexico uses more than its per-country share of family numbers, F2A Mexico is sometimes given its own cutoff. Part of F2A is exempt from the per-country limit by law, which is why the Mexican F2A gap is usually smaller than in F1, F2B, F3 or F4. In August 2026 the two dates stood about a year apart.' },
      { q: 'Did employment dates move in the August 2026 Visa Bulletin?', a: 'Very little. EB-3 and EB-3 Other Workers for most countries, EB-1 China and EB-4 each gained about a month, EB-3 China a few days, and the Indian EB-2 and EB-5 boxes stayed unavailable. August was a family month, with the largest moves in F2A, F1 and F4.' },
    ],
    body: (h) => `
<h2>F2A almost catches the calendar</h2>
<p>A green card holder who married abroad files Form I-130 for the spouse, and the spouse waits in F2A. For most of fiscal year 2026, that wait sat still: the cutoff opened the year at ${h.cell(f2aOct2025)} and did not move at all until May. August changed the scale. The worldwide Final Action Date jumped ${h.num(gain('F2A', 'ROW'))} days, to ${h.cell(box('F2A', 'ROW'))}. That is ${h.num(f2aGapRow)} days before August 1, close enough that a visa number was available to almost anyone holding an approved F2A petition. Mexico's own F2A date moved by about the same distance, to ${h.cell(box('F2A', 'MX'))}, which still left Mexican spouses ${h.num(f2aGapMx)} days behind the bulletin month. The F2A filing column read ${h.cell(box('F2A', 'ROW', 'DFF'))}.</p>
<h2>The rest of the family chart</h2>
<p>F1 worldwide, unmarried sons and daughters of citizens, moved ${h.num(gain('F1', 'ROW'))} days to ${h.cell(box('F1', 'ROW'))}. F4 worldwide, brothers and sisters, gained ${h.num(gain('F4', 'ROW'))} days to ${h.cell(box('F4', 'ROW'))}. F2B and F3 worldwide moved less on approval, ${h.num(gain('F2B', 'ROW'))} and ${h.num(gain('F3', 'ROW'))} days, but much more on the filing chart: ${h.num(gain('F2B', 'ROW', 'DFF'))} and ${h.num(gain('F3', 'ROW', 'DFF'))} days. Mexico's other family lines were nearly still: F1 Mexico ${h.num(gain('F1', 'MX'))} days, F3 Mexico ${h.num(gain('F3', 'MX'))}, and F2B Mexico unchanged at ${h.cell(box('F2B', 'MX'))}${box('F2B', 'MX') === f2bMxSince ? ', the date it had held since the February bulletin' : ''}.</p>
<h2>Employment in a holding pattern</h2>
<p>EB-2 India and EB-5 India stayed ${h.cell(box('EB2', 'IN'))}. Worldwide EB-3 and EB-3 Other Workers each moved about a month, to ${h.cell(box('EB3', 'ROW'))} and ${h.cell(box('EW', 'ROW'))}. EB-4 gained ${h.num(gain('EB4', 'ROW'))} days and EB-1 China ${h.num(gain('EB1', 'CN'))}. EB-1 and EB-2 for the rest of the world stayed ${h.cell(box('EB2', 'ROW'))}, and EB-2 China sat at ${h.cell(box('EB2', 'CN'))} for another month. For an employment applicant, August was a month to wait and watch.</p>
<h2>Why a late jump like this happens</h2>
<p>The family preference system has ${h.num(h.P.limits.family)} numbers a year (${h.src('ina203', 'INA sections 201 to 203')}), and the fiscal year ends on September 30. When a line is not producing enough approvals to use its share, moving the cutoff forward is how more applicants become eligible before the year closes. The sequel is on the ${h.a('visa-bulletin-2026-09', 'September 2026 page')}; the long view of F2A, including its ${h.a('visa-bulletin-history', 'current years from 2019 and the 2023 rollback')}, is on the ${h.a('f2a', 'F2A page')} and the ${h.a('f2a-mexico', 'F2A Mexico page')}.</p>`,
  },
});
