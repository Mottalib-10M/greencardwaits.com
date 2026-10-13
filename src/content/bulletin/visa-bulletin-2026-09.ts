import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, MONTHS, type Cat, type Country } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';

// Bulletin de septembre 2026 : dernier mois de l'exercice 2026, comparé à août, et exercice entier (oct. 2025 → sept. 2026).
type Q = Exclude<Cat, 'IR'>;
const SEP = MONTHS.indexOf('2026-09');
const OCT25 = MONTHS.indexOf('2025-10');
const OCT26 = MONTHS.indexOf('2026-10');
const at = (c: Q, k: Country, i = SEP, ch: 'FAD' | 'DFF' = 'FAD') => cellAt(c, k, ch, i);
const jump = (c: Q, k: Country, ch: 'FAD' | 'DFF' = 'FAD', i = SEP) => Math.round(moveDays(c, k, ch, i) ?? 0);
const yrs = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const fy = (c: Q, k: Country) => yrs(at(c, k, OCT25), at(c, k));
const OLD = ['F1', 'F2B', 'F3', 'F4'] as const;
const days = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86_400_000;
const bigger = OLD.filter((c) => jump(c, 'ROW') > days(at(c, 'ROW', OCT25), at(c, 'ROW', SEP - 1))).length;
const heldInOct = OLD.every((c) => jump(c, 'ROW', 'FAD', OCT26) === 0);
const en = (x: string) => cellText(x, 'en');
const mxStill = (['F2B', 'F3', 'F4'] as const).filter((c) => jump(c, 'MX') === 0);
const empMoved = (['EB1', 'EB2', 'EB3', 'EW', 'EB4', 'EB5'] as const).flatMap((c) => (['ROW', 'CN', 'IN', 'PH'] as const).map((k) => ({ c, k, d: moveDays(c, k, 'FAD', SEP) })))
  .filter((x) => x.d !== null && Math.abs(x.d) >= 1 && cellAt(x.c, x.k, 'FAD', SEP) !== 'C' && (x.k === 'ROW' || cellAt(x.c, x.k, 'FAD', SEP) !== cellAt(x.c, 'ROW', 'FAD', SEP)));

export default definePage({
  id: "visa-bulletin-2026-09", group: "bulletin", order: 21, parent: "visa-bulletin",
  tool: {"kind": "bulletin", "month": "2026-09", "cat": "F3", "country": "ROW"},
  data: {"month": "2026-09"},
  related: ["visa-bulletin", "visa-bulletin-history", "visa-bulletin-predictions", "f3", "f4"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "visa-bulletin/2026-09",
    nav: 'September 2026', card: 'Fiscal year 2026 ends with the biggest family jumps of the year: F3, F4, F2B and F1 worldwide.',
    title: 'September 2026 Visa Bulletin: Year-End Family Leap Forward',
    description: 'September 2026 Visa Bulletin, last of fiscal year 2026: F3 worldwide up over two years, F4 and F2B well over a year, Mexico and employment nearly frozen.',
    h1: 'September 2026 Visa Bulletin: the fiscal year closes with a family surge',
    intro: 'Pick a category and country to see the September 2026 cutoffs on both charts, the change from August, and how far each box traveled over the fiscal year.',
    resume: `September is the last bulletin of the federal fiscal year, and in 2026 it was the month the worldwide family lines leapt. F3, married sons and daughters of U.S. citizens, moved ${jump('F3', 'ROW')} days to ${en(at('F3', 'ROW'))}. F4, brothers and sisters, gained ${jump('F4', 'ROW')} days to ${en(at('F4', 'ROW'))}. F2B moved ${jump('F2B', 'ROW')} days to ${en(at('F2B', 'ROW'))}, and F1 ${jump('F1', 'ROW')} days to ${en(at('F1', 'ROW'))}. Over the whole fiscal year, from October 2025, F3 worldwide traveled about ${fy('F3', 'ROW').toFixed(1)} years of priority dates. The country columns hardly shared in it: F1 and F2A Mexico moved a month each, and F2B, F3 and F4 Mexico stood still. Employment was almost frozen, with EB-2 India still unavailable. The October 2026 bulletin, first of the new year, then left every one of these worldwide family dates exactly where September put them.`,
    faqs: [
      { q: 'Why did family dates jump in the September 2026 Visa Bulletin?', a: 'September is the final month in which the year’s family numbers can be used, and numbers not used by September 30 cannot be issued under that year’s family limit. Large late-year advances let more applicants qualify before the deadline. The bulletin itself does not explain each move, so this reading comes from the dates and the calendar, not from a published statement.' },
      { q: 'Did Mexico benefit from the September 2026 Visa Bulletin family jump?', a: 'Barely. The jumps were in the worldwide column. F1 Mexico and F2A Mexico moved about a month each, and the Mexican F2B, F3 and F4 dates did not move at all. Mexico is held to its per-country share, so a surge for the rest of the world does not carry over to the Mexican lines.' },
      { q: 'Were the September 2026 Visa Bulletin advances reversed in October?', a: 'No. The October 2026 bulletin, which opened fiscal year 2027, kept the worldwide F1, F2B, F3 and F4 Final Action Dates exactly where September left them. Holding the dates still is different from a retrogression: nobody who became eligible in September lost that status in October.' },
    ],
    body: (h) => `
<h2>The last bulletin of fiscal year 2026</h2>
<p>The federal fiscal year ends on September 30. The family system has ${h.num(h.P.limits.family)} preference numbers for the year (${h.src('ina203', 'INA section 201')}), and September is the last chance to use them. This bulletin shows what that looks like in the worldwide column, where ${h.num(bigger)} of the four older family lines moved further in this one bulletin than in the ten months from October to August combined.</p>
${h.table(['Worldwide line', 'August 2026', 'September 2026', 'Change (days)', 'October 2025'], (['F1', 'F2B', 'F3', 'F4'] as const).map((c) => [c, h.cell(at(c, 'ROW', SEP - 1)), h.cell(at(c, 'ROW')), h.num(jump(c, 'ROW')), h.cell(at(c, 'ROW', OCT25))]), 'Final Action Dates for the rest of the world.', ['l', 'l', 'l', 'r', 'l'])}
<p>The filing chart moved too, by smaller steps: F3 worldwide by ${h.num(jump('F3', 'ROW', 'DFF'))} days and F4 by ${h.num(jump('F4', 'ROW', 'DFF'))}, which left Final Action and filing dates only days apart in every worldwide family line.</p>
<h2>Mexico and the Philippines barely moved</h2>
<p>Each country is held to ${h.pct(h.P.limits.perCountryShare)} of the preference numbers, so a September surge in the worldwide column does not reach the oversubscribed ones. F1 Mexico moved ${h.num(jump('F1', 'MX'))} days to ${h.cell(at('F1', 'MX'))}, F2A Mexico ${h.num(jump('F2A', 'MX'))} days, and ${mxStill.join(', ')} Mexico did not move at all. In the Philippine column, only F4 changed, by ${h.num(jump('F4', 'PH'))} days. A family in Monterrey or Manila could watch the worldwide dates race ahead in this bulletin while its own box barely moved.</p>
<h2>Employment stood still at the finish</h2>
<p>${empMoved.length ? `Among employment boxes with a date of their own, only ${empMoved.map((x) => `${x.c === 'EW' ? 'EB-3 Other Workers' : x.c.replace('EB', 'EB-')}${x.k === 'ROW' ? '' : ` ${x.k}`}`).join(', ')} moved, by ${h.num(Math.round(empMoved[0].d!))} days.` : 'No employment box with a date of its own moved.'} EB-2 India remained ${h.cell(at('EB2', 'IN'))} for a third month, EB-1 and EB-2 worldwide stayed ${h.cell(at('EB2', 'ROW'))}, and EB-3 worldwide held at ${h.cell(at('EB3', 'ROW'))}.</p>
<h2>What September led to</h2>
<p>A late surge can be followed by a step back when the new year starts. ${heldInOct ? 'This time the worldwide family dates held: October left F1, F2B, F3 and F4 exactly where September had put them.' : 'October did move some of these worldwide family dates again, as its own page shows.'} The retrogression came on the employment side instead, as the ${h.a('visa-bulletin-2026-10', 'October 2026 page')} shows. For the long record of each family line, see ${h.a('f3', 'F3')} and ${h.a('f4', 'F4')}; previous month, ${h.a('visa-bulletin-2026-08', 'August 2026')}.</p>`,
  },
});
