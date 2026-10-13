import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, distinctShare, evaluate, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import { isoToDays, daysToIso } from '../../lib/engine/forecast';

// Chiffres lus dans les données (jamais tapés).
const at = (ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB2', 'CN', ch, MONTHS.indexOf(ym));
const fad = cellAt('EB2', 'CN', 'FAD'), dff = cellAt('EB2', 'CN', 'DFF');
const eb3 = cellAt('EB3', 'CN', 'FAD');
const dmove = moveDays('EB2', 'CN', 'DFF') ?? 0;
const retro = retrogressions('EB2', 'CN');
const before = at(MONTHS[MONTHS.indexOf(retro.worstAt) - 1]), worst = at(retro.worstAt), after = at(MONTHS[MONTHS.indexOf(retro.worstAt) + 1]);
const oct16 = at('2016-10'), oct21 = at('2021-10'), oct26 = at('2026-10');
const jan26 = at('2026-01');
const lastC = [...MONTHS].reverse().find((m) => at(m) === 'C');
const isDate = (c: string) => c !== 'C' && c !== 'U';
const bt = [6, 12, 24, 48].map((g) => backtestCell('EB2', 'CN', g)!);
// Exemple : une date de priorité un an après la date limite du mois.
const pd = isDate(fad) ? daysToIso(isoToDays(fad) + 365) : '';
const ex = pd ? evaluate('EB2', 'CN', pd) : undefined;
const yrs = (a: string, b: string) => (isoToDays(a) - isoToDays(b)) / 365.25;
const en = (c: string) => cellText(c, 'en');

export default definePage({
  id: "eb-2-china", group: "employment", order: 208, parent: "eb-2",
  tool: {"kind": "greencard", "cat": "EB2", "country": "CN"},
  data: {"cat": "EB2", "country": "CN"},
  related: ["eb-2", "country-china", "eb-3-china", "guide-eb2-to-eb3", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-2/china",
    nav: 'EB-2 China', card: 'Advanced-degree workers born in mainland China: a slow but regular queue, and one where our forecast passes its test.',
    title: 'EB-2 China Priority Date 2026: Cutoff and Tested Forecast',
    description: 'EB-2 China in the Visa Bulletin: the Final Action Date, the one-year jump in the filing date, a decade of Octobers, and a wait forecast that held up in testing.',
    h1: 'EB-2 China: a queue slow enough to forecast',
    intro: 'Enter the priority date from your EB-2 I-140 or PERM to see where a person born in mainland China stands and what the tested range says.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, EB-2 for people born in mainland China has a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}${dmove ? `, the filing date having moved ${Math.abs(Math.round(dmove))} days ${dmove > 0 ? 'forward' : 'back'} from the previous bulletin` : ''}. The Chinese column has carried its own EB-2 date in ${Math.round(distinctShare('EB2', 'CN') * 100)}% of bulletins since October 2015${lastC ? ` and has not been Current since ${monthName(lastC, 'en')}` : ''}. What sets this queue apart is regularity: tested on every month from October 2012 to October 2025, our forecast for dates a year behind the cutoff missed by a median of ${bt[1].medianError} months and held the real outcome ${Math.round(bt[1].coverage * 100)}% of the time${bt[1].reliable ? ', which passes our rule' : ', which falls short of our rule'}. ${ex?.reliable && ex.range ? `For a priority date of ${en(pd)}, one year behind the cutoff, the calculator gives a range from ${monthName(ex.range[0]!, 'en')} to ${monthName(ex.range[2]!, 'en')}.` : ''} EB-3 China reads ${en(eb3)} this month, so the two Chinese rows are worth comparing.`,
    faqs: [
      { q: 'Why does the calculator give a date range for EB-2 China but not for EB-2 India?', a: 'Each case and distance is tested separately on thirteen years of past bulletins. The Chinese EB-2 line has advanced in regular steps, so forecasts made with past data landed close to what happened at several distances. The Indian line has had larger jumps and drops, and its forecasts failed the same test. A range is shown only where it passed.' },
      { q: 'Is EB-3 China sometimes ahead of EB-2 China?', a: 'Often. Since 2015 the two Chinese rows have swapped the lead more than a dozen times, and EB-3 has been ahead in many recent bulletins. An employer can file a second Form I-140 in EB-3 for the same worker, and an earlier priority date can generally be kept. The EB-2 to EB-3 guide compares the two dates.' },
      { q: 'What did EB-2 China look like in September 2015?', a: 'It went from December 15, 2013 in August 2015 to January 1, 2006 in September 2015, the deepest single drop in the history of the Chinese EB-2 line, and came back to January 1, 2012 in October 2015, when the new fiscal year began. The episode shows how the final month of a fiscal year can differ from the rest.' },
    ],
    body: (h) => `
<h2>A decade of Octobers</h2>
<p>October readings show the pace better than any single month. The Chinese EB-2 Final Action Date was ${h.cell(oct16)} in October 2016, ${h.cell(oct21)} in October 2021 and ${h.cell(oct26)} in October 2026. ${isDate(oct16) && isDate(oct26) ? `Over those ten years, the cutoff covered about ${h.num(yrs(oct26, oct16), 1)} years of priority dates, close to one year of dates per calendar year, so the distance between the cutoff and today has barely shrunk.` : ''} During fiscal year 2026 the date sat at ${h.cell(jan26)} from January through September before the October bulletin moved it.</p>
<h2>The September 2015 drop</h2>
<p>The archive holds ${h.num(retro.n)} retrogressions for this line. The deepest came in ${h.month(retro.worstAt)}, from ${h.cell(before)} to ${h.cell(worst)}, about ${h.num(Math.round(retro.worstMonths))} months; the next bulletin restored ${h.cell(after)}. A September bulletin closes the fiscal year, and this one shows how far the last month can depart from the trend.</p>
<h2>A forecast that passed</h2>
<p>Our model was rebuilt every month from October 2012 to October 2025 using only bulletins known at the time. For Chinese EB-2 dates six months behind, the median error was ${h.num(bt[0].medianError)} months with ${h.pct(bt[0].coverage)} coverage; a year behind, ${h.num(bt[1].medianError)} months and ${h.pct(bt[1].coverage)}; two years behind, ${h.num(bt[2].medianError, 1)} months and ${h.pct(bt[2].coverage)}, which ${bt[2].reliable ? 'also passes' : 'is not good enough to publish, because the error is too large for that distance'}. ${ex?.reliable && ex.range ? `Today, a priority date of ${h.cell(pd)} gets a 20% to 80% range of ${h.month(ex.range[0]!)} to ${h.month(ex.range[2]!)}, with a middle estimate of ${h.month(ex.range[1]!)}. It is a range from past behavior, not a promise.` : 'At this distance the calculator currently shows no reliable forecast.'}</p>
<h2>Filing while the cutoff catches up</h2>
<p>The Date for Filing, ${h.cell(dff)}, sits ${isDate(dff) && isDate(fad) ? `about ${h.num(yrs(dff, fad), 1)} years` : ''} ahead of the Final Action Date. In a month when USCIS designates that chart, a Chinese EB-2 applicant in the United States with a priority date before it can file Form I-485. Comparing with ${h.a('eb-3-china', 'EB-3 China')} (${h.cell(eb3)}) is the usual next step, with the ${h.a('guide-eb2-to-eb3', 'EB-2 to EB-3 calculator')}.</p>`,
  },
});
