import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, MONTHS, type Cat, type Country } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';
import P from '../../data/params-2026.json';

// Bulletin d'octobre 2026, premier de l'exercice 2027, comparé à septembre (et à juin pour les cases indiennes fermées).
type Q = Exclude<Cat, 'IR'>;
const OCT = MONTHS.indexOf('2026-10');
const JUN = MONTHS.indexOf('2026-06');
const c = (cat: Q, k: Country, ch: 'FAD' | 'DFF' = 'FAD', i = OCT) => cellAt(cat, k, ch, i);
const m = (cat: Q, k: Country, ch: 'FAD' | 'DFF' = 'FAD') => Math.round(moveDays(cat, k, ch, OCT) ?? 0);
const w = (x: string) => cellText(x, 'en');
const yearsOf = (days: number) => days / 365.25;
const mexPh = ([['F2B', 'MX'], ['F4', 'PH'], ['F1', 'MX'], ['F2A', 'MX'], ['F1', 'PH'], ['F3', 'PH'], ['F2B', 'PH']] as Array<[Q, Country]>)
  .map(([cat, k]) => ({ cat, k, d: m(cat, k) })).sort((a, b) => b.d - a.d);
const rowFamStill = (['F1', 'F2B', 'F3', 'F4'] as const).every((x) => m(x, 'ROW') === 0);
const chart = (x: string) => (x === 'DFF' ? 'Dates for Filing' : 'Final Action Dates');

export default definePage({
  id: "visa-bulletin-2026-10", group: "bulletin", order: 20, parent: "visa-bulletin",
  tool: {"kind": "bulletin", "month": "2026-10", "cat": "EB2", "country": "IN"},
  data: {"month": "2026-10"},
  related: ["visa-bulletin", "visa-bulletin-history", "visa-bulletin-predictions", "eb-2", "guide-bulletin-release"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "vbOct2026"],
  en: {
    path: "visa-bulletin/2026-10",
    nav: 'October 2026', card: 'Fiscal year 2027 opens: EB-2 worldwide retrogresses, India reopens, Mexico and the Philippines move up.',
    title: 'October 2026 Visa Bulletin: New Fiscal Year, EB-2 Falls Back',
    description: 'October 2026 Visa Bulletin opens fiscal year 2027: EB-2 and EB-3 worldwide retrogress, EB-2 India returns, Mexican and Philippine family dates jump ahead.',
    h1: 'October 2026 Visa Bulletin: fiscal year 2027 resets the chart',
    intro: 'Choose a category and country to read the October 2026 cutoffs on both charts and compare them with September, the last bulletin of fiscal 2026.',
    resume: `The October 2026 Visa Bulletin is the first of fiscal year 2027, and it reset the employment chart. EB-2 for the rest of the world, current since April, received a cutoff of ${w(c('EB2', 'ROW'))}, a retrogression of ${Math.abs(m('EB2', 'ROW'))} days. EB-3 worldwide went back ${Math.abs(m('EB3', 'ROW'))} days to ${w(c('EB3', 'ROW'))} and EB-3 Other Workers ${Math.abs(m('EW', 'ROW'))} days. The Indian boxes closed since July reopened: EB-2 India at ${w(c('EB2', 'IN'))}, EB-5 India at ${w(c('EB5', 'IN'))}. Family dates for most of the world did not move, but the country columns did: F2B Mexico gained ${m('F2B', 'MX')} days, F4 Philippines ${m('F4', 'PH')} and F1 Mexico ${m('F1', 'MX')}. USCIS designated ${P.aosChart.family === P.aosChart.employment ? `the ${chart(P.aosChart.family)} chart for both family and employment cases` : `the ${chart(P.aosChart.family)} chart for family cases and the ${chart(P.aosChart.employment)} chart for employment cases`} filing Form I-485 this month, and several of those filing dates moved years ahead of approval.`,
    faqs: [
      { q: 'Why did EB-2 worldwide retrogress in the October 2026 Visa Bulletin?', a: 'The bulletin replaced the current listing that EB-2 had held since April with a cutoff in January 2025. The State Department does not publish the demand behind each date, but a retrogression at the start of a fiscal year usually means that more applicants with older dates are ready than the new year’s numbers can serve in its first months.' },
      { q: 'Is EB-2 India available again in the October 2026 Visa Bulletin?', a: 'Yes. After three bulletins listed it as unavailable, EB-2 India returned with a Final Action Date a little later than the one it had in June 2026. Its Dates for Filing column did not change. Indian applicants whose priority date is earlier than the new cutoff can be approved again from October.' },
      { q: 'Which chart does USCIS accept in October 2026 for Form I-485?', a: 'For October 2026, USCIS designated the Dates for Filing chart for both family-sponsored and employment-based applicants adjusting status inside the United States. That matters this month because several employment filing dates, for EB-3 China, EB-4 and EB-5 China among them, jumped far ahead of their Final Action Dates.' },
      { q: 'Did family dates move in the October 2026 Visa Bulletin?', a: 'Not in the worldwide column: F1, F2B, F3 and F4 for most countries kept the dates that September had given them. The movement was in the oversubscribed columns. F2B Mexico, F4 Philippines, F1 Mexico, F2A Mexico and the Philippine F1, F3 and F2B lines all advanced by several months.' },
    ],
    body: (h) => `
<h2>Fiscal year 2027 starts with a reset</h2>
<p>October brings a new year of visa numbers, and the first bulletin of a year is where the State Department recalibrates. This one did so mostly on the employment side. EB-2 worldwide, which had read ${h.cell(c('EB2', 'ROW', 'FAD', OCT - 1))} through the summer, now reads ${h.cell(c('EB2', 'ROW'))}, a step back of about ${h.num(yearsOf(Math.abs(m('EB2', 'ROW'))), 1)} years in one bulletin. EB-3 worldwide slipped from ${h.cell(c('EB3', 'ROW', 'FAD', OCT - 1))} to ${h.cell(c('EB3', 'ROW'))}, and EB-3 Other Workers to ${h.cell(c('EW', 'ROW'))}. The EB-3 worldwide filing date fell further, from ${h.cell(c('EB3', 'ROW', 'DFF', OCT - 1))} to ${h.cell(c('EB3', 'ROW', 'DFF'))}.</p>
<h2>India comes back on its own terms</h2>
<p>EB-2 India was unavailable from July to September. It returns at ${h.cell(c('EB2', 'IN'))}, against ${h.cell(c('EB2', 'IN', 'FAD', JUN))} in June, the last month it had a date. EB-5 India reopens at ${h.cell(c('EB5', 'IN'))}, well ahead of its June date of ${h.cell(c('EB5', 'IN', 'FAD', JUN))}. EB-1 India gains ${h.num(m('EB1', 'IN'))} days to ${h.cell(c('EB1', 'IN'))}, recovering part of the ground it lost in June and July. EB-3 India holds at ${h.cell(c('EB3', 'IN'))}.</p>
<h2>Mexico and the Philippines take their turn</h2>
<p>${rowFamStill ? 'The worldwide family column did not move at all, after its large September advance.' : 'The worldwide family column moved only slightly.'} The country columns did the moving:</p>
${h.table(['Line', 'September 2026', 'October 2026', 'Gain (days)'], mexPh.map((x) => [`${x.cat} ${x.k === 'MX' ? 'Mexico' : 'Philippines'}`, h.cell(c(x.cat, x.k, 'FAD', OCT - 1)), h.cell(c(x.cat, x.k)), h.num(x.d)]), 'Final Action Dates, family-sponsored, oversubscribed countries.', ['l', 'l', 'l', 'r'])}
<p>F3 Mexico kept its approval date but its filing date advanced ${h.num(m('F3', 'MX', 'DFF'))} days, to ${h.cell(c('F3', 'MX', 'DFF'))}.</p>
<h2>Filing dates far ahead of approval</h2>
<p>USCIS chose ${h.P.aosChart.family === h.P.aosChart.employment ? `${chart(h.P.aosChart.family)} for family and employment cases alike` : `${chart(h.P.aosChart.family)} for family cases and ${chart(h.P.aosChart.employment)} for employment cases`} this month (${h.src('aosCharts', 'USCIS filing charts')}), and the second chart moved more than the first. EB-5 China's filing date advanced ${h.num(m('EB5', 'CN', 'DFF'))} days, to ${h.cell(c('EB5', 'CN', 'DFF'))}, while its Final Action Date stayed at ${h.cell(c('EB5', 'CN'))}. EB-4 filing gained ${h.num(m('EB4', 'ROW', 'DFF'))} days and EB-3 China filing ${h.num(m('EB3', 'CN', 'DFF'))}. For eligible applicants already in the United States, October opens the door to file Form I-485 years before approval can follow. Source: ${h.src('vbOct2026', 'Visa Bulletin for October 2026')}. Previous month: ${h.a('visa-bulletin-2026-09', 'September 2026')}.</p>`,
  },
});
