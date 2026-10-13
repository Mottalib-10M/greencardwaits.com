import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, filingChart, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import { isoToDays } from '../../lib/engine/forecast';

// Chiffres lus dans les données (jamais tapés).
const at = (ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB1', 'IN', ch, MONTHS.indexOf(ym));
const fad = cellAt('EB1', 'IN', 'FAD'), dff = cellAt('EB1', 'IN', 'DFF');
const dffCN = cellAt('EB1', 'CN', 'DFF'), eb2 = cellAt('EB2', 'IN', 'FAD');
const move = moveDays('EB1', 'IN') ?? 0;
const retro = retrogressions('EB1', 'IN');
const before = at(MONTHS[MONTHS.indexOf(retro.worstAt) - 1]), worst = at(retro.worstAt);
const jan23 = at('2023-01'), oct23 = at('2023-10');
const fy26 = { jan: at('2026-01'), apr: at('2026-04'), jun: at('2026-06'), sep: at('2026-09'), oct: at('2026-10') };
const bt6 = backtestCell('EB1', 'IN', 6)!, bt12 = backtestCell('EB1', 'IN', 12)!;
const isDate = (c: string) => c !== 'C' && c !== 'U';
const gapYears = isDate(fad) && isDate(eb2) ? (isoToDays(fad) - isoToDays(eb2)) / 365.25 : NaN;
const en = (c: string) => cellText(c, 'en');

export default definePage({
  id: "eb-1-india", group: "employment", order: 205, parent: "eb-1",
  tool: {"kind": "greencard", "cat": "EB1", "country": "IN"},
  data: {"cat": "EB1", "country": "IN"},
  related: ["eb-1", "country-india", "eb-2-india", "guide-portability", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-1/india",
    nav: 'EB-1 India', card: 'Indian priority workers: a line that was Current until 2022, its record drop in 2023 and the 2026 seesaw.',
    title: 'EB-1 India Priority Date 2026: Cutoff, History and Odds',
    description: 'EB-1 India in the Visa Bulletin: Final Action Date and Date for Filing, the record August 2023 drop, the 2026 seesaw and how far our forecast can be trusted.',
    h1: 'EB-1 India: the first preference with an Indian queue',
    intro: 'Enter the priority date of your EB-1 Form I-140 to check whether a person born in India can file or be approved under this month’s bulletin.',
    resume: `The ${monthName(LATEST, 'en')} Visa Bulletin gives EB-1 India a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}. ${move === 0 ? 'The Final Action Date did not move from the previous bulletin.' : `The Final Action Date moved ${Math.abs(Math.round(move))} days ${move > 0 ? 'forward' : 'back'} from the previous bulletin.`} Applicants born elsewhere, apart from mainland China, face no EB-1 cutoff at all. The Indian column read Current as recently as December 2022; it then took a date in January 2023 and, in ${monthName(retro.worstAt, 'en')}, lost about ${Math.round(retro.worstMonths)} months in one bulletin, the deepest single drop in the archive for this line. ${isDate(eb2) ? `Even so, it sits roughly ${Math.round(gapYears)} years ahead of EB-2 India (${en(eb2)}), which is why Indian professionals who may qualify for both preferences compare them.` : ''} ${filingChart('EB1') === 'DFF' ? 'USCIS currently accepts the Dates for Filing chart for employment-based I-485 applications.' : 'USCIS currently requires the Final Action chart for employment-based I-485 applications.'}`,
    faqs: [
      { q: 'Did EB-1 India go backwards during fiscal year 2026?', a: 'Yes. The Final Action Date reached April 1, 2023 in the April and May 2026 bulletins, fell to December 15, 2022 in June, and then to October 15, 2022 from July to September. The October 2026 bulletin, the first of fiscal year 2027, moved it forward again. Applications already filed stayed pending through the dip.' },
      { q: 'Why is there an EB-1 India cutoff when most of EB-1 is Current?', a: 'The per-country cap limits any one country to 7% of the preference numbers available in a year. Indian demand in the first preference, from extraordinary ability, outstanding researcher and multinational manager petitions together, is above that share, so since January 2023 the Indian column has carried its own date while most other countries have none.' },
      { q: 'How far ahead of EB-2 India is the EB-1 India cutoff?', a: 'Many years in recent bulletins, because the Indian EB-2 queue is far older. The gap changes every month, so this page computes it from the two current Final Action Dates rather than quoting a figure. Moving from EB-2 to EB-1 requires a new Form I-140 that meets the EB-1 standard; the portability guide explains when an earlier priority date can be kept.' },
    ],
    body: (h) => `
<h2>Current until the end of 2022</h2>
<p>The Indian EB-1 column has spent long stretches at Current, the most recent from April 2021 through December 2022. It then took a date of ${h.cell(jan23)} in January 2023. The real break came in ${h.month(retro.worstAt)}: the cutoff went from ${h.cell(before)} to ${h.cell(worst)}, about ${h.num(Math.round(retro.worstMonths))} months in one bulletin. October 2023 reopened the line at ${h.cell(oct23)}. Counting every step back since 2001, the column has retrogressed ${h.num(retro.n)} times.</p>
<h2>Fiscal 2026: up, down and back</h2>
<p>The last twelve months show how a first-preference queue can wobble. The Final Action Date stood at ${h.cell(fy26.jan)} in January 2026 and ${h.cell(fy26.apr)} in April, slid to ${h.cell(fy26.jun)} in June and was ${h.cell(fy26.sep)} in September. The October 2026 bulletin put it at ${h.cell(fy26.oct)}. The Date for Filing is ${h.cell(dff)}${dff === dffCN ? ', the same as for mainland China' : ''}, so an Indian EB-1 applicant whose priority date falls between the two charts can, in a month when USCIS accepts the filing chart, hold a pending Form I-485 while the Final Action Date catches up. ${h.a('guide-final-action-vs-dates-for-filing', 'How the two charts differ')}.</p>
<h2>Next to EB-2 India</h2>
<p>${isDate(eb2) ? `The Indian EB-2 Final Action Date is ${h.cell(eb2)}, about ${h.num(Math.round(gapYears))} years behind this one.` : `The Indian EB-2 box reads ${h.cell(eb2)} this month.`} A worker who already holds an approved EB-2 petition and later qualifies for EB-1, for example as a multinational manager, needs a new Form I-140 in the first preference. ${h.a('eb-2-india', 'EB-2 India')} and the ${h.a('guide-portability', 'portability guide')} cover the second queue and the rules for keeping an older date.</p>
<h2>How much the forecast is worth</h2>
<p>Tested on every month from October 2012 to October 2025, our forecast for Indian EB-1 dates six months behind the cutoff missed by a median of ${h.num(bt6.medianError)} months and held the real outcome ${h.pct(bt6.coverage)} of the time; ${bt6.reliable ? 'that passes our rule, so the calculator shows a range at that distance' : 'that fails our rule'}. A year behind, the error was ${h.num(bt12.medianError)} months with ${h.pct(bt12.coverage)} coverage, ${bt12.reliable ? 'also enough to publish' : 'not enough to publish a date'}.</p>`,
  },
});
