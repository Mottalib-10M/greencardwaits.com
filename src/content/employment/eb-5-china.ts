import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, distinctShare, MONTHS, LATEST } from '../../lib/engine/cases';
import { PUBLISHED } from '../../lib/engine/ptimes';
import { cellText, monthName } from '../../lib/text';
import { isoToDays } from '../../lib/engine/forecast';
import VB from '../../data/visa-bulletin.json';
import PT from '../../data/ptimes-latest.json';

// Chiffres lus dans les données (jamais tapés).
const at = (ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB5', 'CN', ch, MONTHS.indexOf(ym));
const fad = cellAt('EB5', 'CN', 'FAD'), dff = cellAt('EB5', 'CN', 'DFF');
const dmove = moveDays('EB5', 'CN', 'DFF') ?? 0;
const firstDate = MONTHS.find((m, i) => m >= '2014-01' && cellAt('EB5', 'CN', 'FAD', i) !== 'C' && cellAt('EB5', 'CN', 'FAD', i) !== 'U')!;
const nov21 = at('2021-11'), dec21 = at('2021-12'), may22 = at('2022-05'), jun22 = at('2022-06');
const oct16 = at('2016-10'), oct26 = at('2026-10'), oct24 = at('2024-10'), oct25 = at('2025-10');
type B = { month: string; FAD: Record<string, Record<string, string>> };
const bs = (VB as unknown as { bulletins: B[] }).bulletins;
const rcUnav = bs.filter((b) => b.month >= '2021-07' && b.month <= '2022-04' && b.FAD.EB5RC?.CN === 'U').map((b) => b.month);
const latest = bs.find((b) => b.month === LATEST)!;
const setAllC = ['EB5R', 'EB5H', 'EB5I'].every((k) => latest.FAD[k]?.CN === 'C');
const bt12 = backtestCell('EB5', 'CN', 12)!, bt24 = backtestCell('EB5', 'CN', 24)!;
const i526 = ((PT as any).forms['i-526e'].rows as Array<{ subtype: string; min: number; max: number }>).find((r) => r.subtype === '526IP')!;
const isDate = (c: string) => c !== 'C' && c !== 'U';
const yrs = (a: string, b: string) => (isoToDays(a) - isoToDays(b)) / 365.25;
const en = (c: string) => cellText(c, 'en');
const m1 = (h: { num: (n: number, d?: number) => string }, x: number) => h.num(x, Number.isInteger(x) ? 0 : 1);

export default definePage({
  id: "eb-5-china", group: "employment", order: 213, parent: "eb-5",
  tool: {"kind": "greencard", "cat": "EB5", "country": "CN"},
  data: {"cat": "EB5", "country": "CN"},
  related: ["eb-5", "country-china", "eb-5-india", "i-526e-processing-time", "guide-chargeability"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i526eForm", "itData"],
  en: {
    path: "employment/eb-5/china",
    nav: 'EB-5 China', card: 'Investors born in mainland China: the oldest unreserved investor queue, its widest gap between the two charts, and set-asides.',
    title: 'EB-5 China Priority Date 2026: Unreserved Investor Queue',
    description: 'EB-5 China in the Visa Bulletin: the unreserved Final Action Date and the far later filing date, ten slow Octobers, the 2022 episode and set-aside rows.',
    h1: 'EB-5 China: the long unreserved line for mainland-born investors',
    intro: 'Enter the priority date from your Form I-526E receipt to see how far an investor born in mainland China is from the unreserved EB-5 cutoff.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, the unreserved EB-5 row for investors born in mainland China has a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}${isDate(fad) && isDate(dff) ? `, a gap of about ${yrs(dff, fad).toFixed(1)} years between the two charts` : ''}${dmove ? `, after the filing date moved ${Math.abs(Math.round(dmove))} days ${dmove > 0 ? 'forward' : 'back'} in one bulletin` : ''}. Chinese investors first got their own unreserved date in ${monthName(firstDate, 'en')}, and the column has differed from the worldwide one in ${Math.round(distinctShare('EB5', 'CN') * 100)}% of bulletins since October 2015. The line moves slowly: ${isDate(oct16) && isDate(oct26) ? `from October 2016 to October 2026 the Final Action Date advanced about ${yrs(oct26, oct16).toFixed(1)} years of priority dates in ten calendar years` : 'its October dates have changed little'}. ${setAllC ? 'The rural, high-unemployment and infrastructure set-aside rows are Current for China this month, which is why the project’s classification matters so much for Chinese investors.' : ''} Our back-test does not support a forecast here: a year behind the cutoff, the median error was ${bt12.medianError} months.`,
    faqs: [
      { q: 'Why is the EB-5 China filing date so far ahead of its Final Action Date?', a: 'The two charts serve different purposes. The Final Action Date governs approval; the Date for Filing governs when Form I-485 may be submitted in months when USCIS designates that chart. The State Department sets them separately. For Chinese unreserved investors the gap widened sharply in the October 2026 bulletin, when the filing date moved forward about four years while the Final Action Date stayed where it was.' },
      { q: 'What happened to EB-5 China between December 2021 and June 2022?', a: 'During those months the bulletin listed the regional center line as unavailable while the main EB-5 row read Current for China. In May 2022 the bulletin introduced the rural, high-unemployment and infrastructure set-aside rows, and in June 2022 the Chinese unreserved date returned to November 22, 2015, the level it had shown in late 2021.' },
      { q: 'Can a spouse born outside China change the EB-5 China queue?', a: 'Cross-chargeability lets a principal applicant be charged to the spouse’s country of birth when both immigrate together. An investor born in mainland China whose spouse was born in a country without an EB-5 cutoff may therefore use that country’s column. The chargeability guide explains the rule and its limits.' },
    ],
    body: (h) => `
<h2>Ten slow Octobers</h2>
<p>The Chinese unreserved date read ${h.cell(oct16)} in October 2016 and ${h.cell(oct26)} in October 2026. Twice in that decade it opened a fiscal year lower than the year before: ${h.cell(at('2021-10'))} in October 2021, then ${h.cell(at('2022-10'))} in October 2022; and ${h.cell(oct24)} in October 2024, then ${h.cell(oct25)} in October 2025. An investor joining this row today is behind a line that has advanced much more slowly than the calendar.</p>
<h2>The 2021 to 2022 episode</h2>
<p>For a few months the chart looked very different. The Chinese EB-5 date was ${h.cell(nov21)} in November 2021; in December 2021 the main row turned ${h.cell(dec21)} and stayed so through ${h.cell(may22) === h.cell('C') ? 'May 2022' : 'spring 2022'}, while the regional center line was listed as unavailable in ${h.num(rcUnav.length)} bulletins from July 2021 to April 2022. The set-aside rows first appeared in May 2022, and June 2022 brought the unreserved date back to ${h.cell(jun22)}. The calculator’s history chart shows that step as a drop.</p>
<h2>Two charts, years apart</h2>
<p>The Date for Filing, ${h.cell(dff)}, sits ${isDate(fad) && isDate(dff) ? `about ${h.num(yrs(dff, fad), 1)} years` : 'far'} ahead of the Final Action Date. In a month when USCIS designates the filing chart for employment cases, a Chinese investor already in the United States with an earlier priority date can file Form I-485, though approval still follows the Final Action Date. ${h.a('guide-final-action-vs-dates-for-filing', 'How the two charts work')}.</p>
<h2>Petition, set-asides and the forecast</h2>
<p>A regional center petition on Form I-526E took ${m1(h, i526.min)} to ${m1(h, i526.max)} months in the ${h.src('itData', `${h.month(PUBLISHED.slice(0, 7))} USCIS release`)}. ${setAllC ? 'For Chinese investors in a qualifying rural, high-unemployment or infrastructure project, the set-aside rows read Current this month.' : ''} On the unreserved row, our test from October 2012 to October 2025 found median errors of ${h.num(bt12.medianError)} months a year behind and ${h.num(bt24.medianError)} months two years behind, too wide to publish. ${h.a('eb-5', 'The EB-5 overview')} covers all four rows.</p>`,
  },
});
