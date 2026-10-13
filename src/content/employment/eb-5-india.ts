import { definePage } from '../../lib/guide-types';
import { cellAt, backtestCell, distinctShare, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import VB from '../../data/visa-bulletin.json';

// Chiffres lus dans les données (jamais tapés).
const at = (ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB5', 'IN', ch, MONTHS.indexOf(ym));
const fad = cellAt('EB5', 'IN', 'FAD'), dff = cellAt('EB5', 'IN', 'DFF');
const unav26 = MONTHS.filter((m, i) => m >= '2026-01' && m <= '2026-09' && cellAt('EB5', 'IN', 'FAD', i) === 'U');
const jun26 = at('2026-06'), oct26 = at('2026-10');
const retro = retrogressions('EB5', 'IN');
const before = at(MONTHS[MONTHS.indexOf(retro.worstAt) - 1]), worst = at(retro.worstAt);
const octs = ['2023-10', '2024-10', '2025-10'].map((m) => at(m));
const apr25 = at('2025-04'), may25 = at('2025-05');
type B = { month: string; FAD: Record<string, Record<string, string>> };
const latest = (VB as unknown as { bulletins: B[] }).bulletins.find((b) => b.month === LATEST)!;
const setIN = ['EB5R', 'EB5H', 'EB5I'].map((k) => latest.FAD[k]?.IN ?? 'U');
const setAllC = setIN.every((v) => v === 'C');
const bt6 = backtestCell('EB5', 'IN', 6)!, bt12 = backtestCell('EB5', 'IN', 12)!;
const en = (c: string) => cellText(c, 'en');
const list = (h: { month: (m: string) => string }, ms: string[]) => ms.map((m) => h.month(m)).join(', ').replace(/, ([^,]*)$/, ' and $1');

export default definePage({
  id: "eb-5-india", group: "employment", order: 212, parent: "eb-5",
  tool: {"kind": "greencard", "cat": "EB5", "country": "IN"},
  data: {"cat": "EB5", "country": "IN"},
  related: ["eb-5", "country-india", "eb-5-china", "i-526e-processing-time", "guide-portability"],
  sources: ["vbIndex", "vbMirror", "vbOct2026", "aosCharts", "visaPriority", "i526eForm"],
  en: {
    path: "employment/eb-5/india",
    nav: 'EB-5 India', card: 'Indian investors in the unreserved row: a queue born in 2022, a summer 2026 freeze and set-asides that stay open.',
    title: 'EB-5 India Priority Date 2026: Unreserved Cutoff and Freeze',
    description: 'EB-5 India in the Visa Bulletin: unreserved cutoff and filing date, the 2026 months listed unavailable, the 2022 break and set-aside rows for Indian investors.',
    h1: 'EB-5 India: an investor queue that is only a few years old',
    intro: 'Enter the priority date from your Form I-526E receipt to check the unreserved EB-5 row for an investor born in India.',
    resume: `The ${monthName(LATEST, 'en')} Visa Bulletin gives EB-5 India, in the unreserved row, a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}. ${unav26.length ? `It follows ${unav26.length} bulletins in 2026, ${unav26.map((m) => monthName(m, 'en')).join(', ').replace(/, ([^,]*)$/, ' and $1')}, in which the Indian unreserved row was listed as unavailable, meaning no Indian unreserved EB-5 green card could be approved.` : ''} This queue is recent: the Indian column was Current until September 2022, and the October 2022 bulletin replaced Current with a date, a fall of about ${Math.round(retro.worstMonths)} months. Since October 2015 the column has differed from the worldwide one in ${Math.round(distinctShare('EB5', 'IN') * 100)}% of bulletins. ${setAllC ? 'The rural, high-unemployment and infrastructure set-aside rows are Current for India this month, so the cutoff applies only to investors whose project falls in the unreserved row.' : 'The set-aside rows carry their own dates for India this month.'} No distance passes our back-test here, so the calculator shows no forecast.`,
    faqs: [
      { q: 'Why was EB-5 India unavailable in the summer of 2026?', a: 'The bulletin uses U to mean that numbers are not authorized for issuance, so in those months no Indian unreserved EB-5 green card could be approved, whatever the priority date. The row was listed that way in July, August and September 2026, the last quarter of the fiscal year, and returned with a date when fiscal year 2027 began in October.' },
      { q: 'Does the EB-5 India cutoff apply to rural or infrastructure projects?', a: 'No. The cutoff on this page is for the unreserved row. Investors whose petitions qualify for the rural, high-unemployment or infrastructure set-asides use those rows, which have their own dates for India. In recent bulletins those set-aside rows have been Current for every country, including India.' },
      { q: 'How did EB-5 India move during fiscal year 2025?', a: 'It opened at January 1, 2022 in October 2024, then moved back to November 1, 2019 in April 2025 and to May 1, 2019 in May 2025. October 2025, the start of the next fiscal year, brought it forward to February 1, 2021. The row is young and has swung in both directions.' },
    ],
    body: (h) => `
<h2>How the Indian queue began</h2>
<p>For most of the archive, investors born in India waited behind no cutoff. The column had a date for about a year from mid-2019, was Current again from July 2020 and stayed so until September 2022. Then ${h.month(retro.worstAt)} moved it from ${h.cell(before)} to ${h.cell(worst)}, the deepest single drop this line has recorded. It opened the next three fiscal years at ${h.cell(octs[0])}, ${h.cell(octs[1])} and ${h.cell(octs[2])}, with two steps back inside fiscal 2025: ${h.cell(apr25)} in April and ${h.cell(may25)} in May.</p>
<h2>The 2026 freeze</h2>
<p>The row held at ${h.cell(jun26)} through June 2026${unav26.length ? `, then was listed as unavailable in ${list(h, unav26)}` : ''}. The ${h.src('vbOct2026', 'October 2026 bulletin')} reopened it at ${h.cell(oct26)}, with the Date for Filing at ${h.cell(dff)}. An Indian investor with a pending Form I-485 simply waits through an unavailable month; nothing is cancelled, but nothing can be approved.</p>
<h2>Set-aside rows</h2>
<p>${setAllC ? `This month the rural, high-unemployment and infrastructure rows all read ${h.cell('C')} for India.` : `This month the Indian set-aside rows read ${setIN.map((v) => h.cell(v)).join(', ')}.`} An investor whose project qualifies for one of them is not held to the unreserved date above. The classification is fixed by the petition, not by the investor’s choice; ${h.a('eb-5', 'the EB-5 overview')} explains the four rows.</p>
<h2>No forecast for now</h2>
<p>From October 2012 to October 2025 there were few periods in which this row had a cutoff to follow. Forecasts for Indian dates six months behind missed by a median of ${h.num(bt6.medianError, 1)} months, but the range held the real outcome only ${h.pct(bt6.coverage)} of the time; a year behind, coverage was ${h.pct(bt12.coverage)}. The calculator therefore reports the cutoff and your distance from it.</p>`,
  },
});
