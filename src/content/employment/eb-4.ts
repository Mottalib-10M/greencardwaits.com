import { definePage } from '../../lib/guide-types';
import { cellAt, backtestCell, distinctShare, filingChart, MONTHS, LATEST } from '../../lib/engine/cases';
import { NATIONAL, NATIONAL_MONTH } from '../../lib/engine/ptimes';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import VB from '../../data/visa-bulletin.json';

// Chiffres lus dans les données (jamais tapés).
const at = (c: 'ROW' | 'MX', ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB4', c, ch, MONTHS.indexOf(ym));
const fad = cellAt('EB4', 'ROW', 'FAD'), dff = cellAt('EB4', 'ROW', 'DFF'), fadMX = cellAt('EB4', 'MX', 'FAD');
const retro = retrogressions('EB4', 'ROW');
const before = at('ROW', MONTHS[MONTHS.indexOf(retro.worstAt) - 1]), worst = at('ROW', retro.worstAt);
const oct22 = at('ROW', '2022-10'), oct23 = at('ROW', '2023-10'), oct25 = at('ROW', '2025-10'), oct26 = at('ROW', '2026-10');
const unav25 = MONTHS.filter((m, i) => m >= '2025-01' && m <= '2025-12' && cellAt('EB4', 'ROW', 'FAD', i) === 'U');
const mxDrop = retrogressions('EB4', 'MX');
const mxBefore = at('MX', MONTHS[MONTHS.indexOf(mxDrop.worstAt) - 1]), mxWorst = at('MX', mxDrop.worstAt);
type B = { month: string; FAD: Record<string, Record<string, string>> };
const bulletins = (VB as unknown as { bulletins: B[] }).bulletins;
const srGap = bulletins.filter((b) => b.month >= '2025-10' && b.FAD.SR?.ROW === 'U' && b.FAD.EB4?.ROW !== 'U').map((b) => b.month);
const bt12 = backtestCell('EB4', 'ROW', 12)!;
const dffChart = filingChart('EB4') === 'DFF';
const en = (c: string) => cellText(c, 'en');
const list = (h: { month: (m: string) => string }, ms: string[]) => ms.map((m) => h.month(m)).join(', ').replace(/, ([^,]*)$/, ' and $1');

export default definePage({
  id: "eb-4", group: "employment", order: 203,
  tool: {"kind": "greencard", "cat": "EB4", "country": "ROW"},
  data: {"cat": "EB4", "country": "ROW"},
  related: ["employment-green-card-cost", "i-485-employment-processing-time", "guide-retrogression", "guide-final-action-vs-dates-for-filing"],
  sources: ["vbIndex", "vbMirror", "vbOct2026", "aosCharts", "visaPriority", "uscisReport", "ina203"],
  en: {
    path: "employment/eb-4",
    nav: 'EB-4 special immigrants', card: 'Fourth preference: special immigrants and religious workers, a cutoff that only appeared in 2023, and the 2025 freeze.',
    title: 'EB-4 Visa Bulletin 2026: Special Immigrant Cutoff and Wait',
    description: 'EB-4 special immigrants and religious workers: this month’s cutoff and filing date, the 2025 months listed unavailable, and the Form I-360 time from USCIS.',
    h1: 'EB-4 special immigrants: a small category with a new queue',
    intro: 'Enter the priority date from your approved Form I-360 to see whether an EB-4 visa number is available this month and how the line has moved.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, EB-4, the class the law calls certain special immigrants, has a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)} for applicants born outside Mexico, and the Mexican column reads ${en(fadMX)}. The class receives 7.1% of the worldwide employment-based level. Its religious-worker row follows the same dates, and the October 2026 bulletin reports that H.R. 6500, signed on September 2, 2026, extends that program through December 11, 2026. For two decades EB-4 needed no queue at all: every October bulletin in the archive from 2002 to 2022 listed it as Current. A cutoff appeared in 2023, and every EB-4 bulletin from April to September 2025 listed the class as unavailable. Petitions in this class are filed on Form I-360, which the USCIS report to Congress for ${NATIONAL_MONTH} puts at an average of ${NATIONAL['I-360']} months.`,
    faqs: [
      { q: 'Who is covered by the EB-4 special immigrant category?', a: 'EB-4 groups the special immigrants defined in the Immigration and Nationality Act. The Visa Bulletin names one group separately, certain religious workers, and its notes cover special immigrant visas for some current and former U.S. government employees abroad. The petition form, Form I-360, is titled for Amerasians, widows or widowers and special immigrants. Eligibility for each group is set by law and is a question for an immigration attorney.' },
      { q: 'What happens to EB-4 religious workers if the program is not extended?', a: 'The religious-worker part of EB-4 runs only for the period Congress sets. The October 2026 bulletin says H.R. 6500 extends it through December 11, 2026, with the same dates as the rest of EB-4. In past bulletins the religious-worker row has been listed as unavailable in months when the other EB-4 groups still had a date.' },
      { q: 'Why was EB-4 unavailable for most of 2025?', a: 'The bulletin uses U to mean that numbers are not authorized for issuance, so no EB-4 green card could be approved in those months, whatever the priority date. Every bulletin from April to September 2025 showed the category that way, and dates returned with the new fiscal year in October 2025. Pending applications were not cancelled; they waited.' },
      { q: 'Does EB-4 Mexico have a different date from the rest of the world?', a: 'At times. Since 2015, the Mexican EB-4 column has differed from the worldwide one in a majority of bulletins, after a sharp drop in July 2016. Since April 2023 the two columns have carried the same date. The tool on this page uses the worldwide column; choose Mexico as the country to check the Mexican line.' },
    ],
    body: (h) => `
<h2>A preference built from many small groups</h2>
<p>The fourth preference shares the smallest allotment in the employment table with EB-5: 7.1% of the worldwide level, according to paragraph 5 of the ${h.src('vbOct2026', 'October 2026 bulletin')}, without the spill-over that EB-1 to EB-3 can receive. It gathers the special immigrants of the ${h.src('ina203', 'Immigration and Nationality Act')}. The bulletin prints one of them on its own row, certain religious workers, and the same issue carries a note on special immigrant visas for some current and former U.S. government employees abroad under section 101(a)(27)(D). Religious workers and other special immigrants petition on Form I-360, and the USCIS ${h.src('uscisReport', `report to Congress for ${NATIONAL_MONTH}`)} puts its average processing time at ${h.num(NATIONAL['I-360'], 1)} months.</p>
<h2>From Current to a cutoff</h2>
<p>For most of the archive, the EB-4 priority date did not matter. The worldwide column read ${h.cell(oct22)} in October 2022, as in every October bulletin in our archive since 2002. Then the line broke. In ${h.month(retro.worstAt)} it went from ${h.cell(before)} to ${h.cell(worst)}, about ${h.num(Math.round(retro.worstMonths))} months in a single bulletin, and October 2023 opened the fiscal year at ${h.cell(oct23)}. In 2025 the category was listed as unavailable in ${h.num(unav25.length)} bulletins, ${list(h, unav25)}. It came back at ${h.cell(oct25)} in October 2025 and stood at ${h.cell(oct26)} in October 2026.</p>
<h2>The religious-worker row</h2>
<p>Certain religious workers have the same Final Action Date and Date for Filing as the rest of EB-4, but their row depends on Congress renewing the program. H.R. 6500, signed on September 2, 2026, extends it through December 11, 2026. ${srGap.length ? `Since October 2025, the row was listed as unavailable in ${list(h, srGap)}, months in which the other EB-4 groups had a date.` : 'The row has kept the EB-4 dates in recent bulletins.'} Around a renewal deadline, this row can change from one bulletin to the next.</p>
<h2>Mexico and filing this month</h2>
<p>Since October 2015, the Mexican EB-4 column has had its own date in ${h.pct(distinctShare('EB4', 'MX'))} of bulletins; its largest drop came in ${h.month(mxDrop.worstAt)}, from ${h.cell(mxBefore)} to ${h.cell(mxWorst)}. ${fadMX === fad ? 'This month it carries the worldwide date.' : `This month it reads ${h.cell(fadMX)}.`} ${dffChart ? `USCIS currently lets employment-based applicants file Form I-485 under the Dates for Filing chart, ${h.cell(dff)} for EB-4.` : 'USCIS currently requires the Final Action chart for employment-based I-485 filings.'}</p>
<p>A forecast is out of reach here: tested from October 2012 to October 2025, ranges for a date a year behind the cutoff held the real outcome only ${h.pct(bt12.coverage)} of the time, because the line spent most of that period Current and then moved in jumps. For the rules of a given special immigrant group, see a licensed immigration attorney or a DOJ-accredited representative.</p>`,
  },
});
