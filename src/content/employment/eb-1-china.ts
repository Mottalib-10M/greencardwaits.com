import { definePage } from '../../lib/guide-types';
import { cellAt, backtestCell, distinctShare, MONTHS, LATEST, series } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import { resolve, isoToDays } from '../../lib/engine/forecast';

// Chiffres lus dans les données (jamais tapés).
const at = (ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB1', 'CN', ch, MONTHS.indexOf(ym));
const fad = cellAt('EB1', 'CN', 'FAD'), dff = cellAt('EB1', 'CN', 'DFF');
const fadIN = cellAt('EB1', 'IN', 'FAD');
const retro = retrogressions('EB1', 'CN');
const before = at(MONTHS[MONTHS.indexOf(retro.worstAt) - 1]), worst = at(retro.worstAt);
const octs = ['2018-10', '2019-10', '2020-10', '2023-10', '2024-10', '2025-10'].map((m) => at(m));
// Dernier recul de la date (mois AAAA-MM).
const s = series('EB1', 'CN', 'FAD');
let lastBack = '', prev: number | null = null;
for (let i = 0; i < s.length; i++) { const v = resolve(s, MONTHS, i); if (v === null) continue; if (prev !== null && v < prev - 0.5) lastBack = MONTHS[i]; prev = v; }
const bt6 = backtestCell('EB1', 'CN', 6)!, bt12 = backtestCell('EB1', 'CN', 12)!;
const isDate = (c: string) => c !== 'C' && c !== 'U';
const lead = isDate(fad) && isDate(fadIN) ? Math.round((isoToDays(fad) - isoToDays(fadIN)) / 30.4375) : NaN;
const en = (c: string) => cellText(c, 'en');

export default definePage({
  id: "eb-1-china", group: "employment", order: 206, parent: "eb-1",
  tool: {"kind": "greencard", "cat": "EB1", "country": "CN"},
  data: {"cat": "EB1", "country": "CN"},
  related: ["eb-1", "country-china", "eb-1-india", "guide-chargeability", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-1/china",
    nav: 'EB-1 China', card: 'Priority workers born in mainland China: a slow, steady line since 2023, the 2016 break and why no date is forecast.',
    title: 'EB-1 China Priority Date 2026: Cutoff and Steady Climb',
    description: 'EB-1 China in the Visa Bulletin: the mainland-born Final Action Date and Date for Filing, every October since 2018, the 2016 break and our forecast test.',
    h1: 'EB-1 China: a mainland-born queue that moves in small steps',
    intro: 'Enter the priority date of your EB-1 Form I-140 to see where a person born in mainland China stands on this month’s first-preference charts.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, EB-1 for people born in mainland China has a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}. The column header reads “China, mainland born”: place of birth decides the line, not passport or residence. ${isDate(fadIN) && Number.isFinite(lead) ? `The Chinese date is ${lead > 0 ? `about ${Math.abs(lead)} months ahead of` : lead < 0 ? `about ${Math.abs(lead)} months behind` : 'level with'} EB-1 India (${en(fadIN)}), while the rest of the world faces no EB-1 cutoff.` : ''} Since October 2015 the Chinese column has differed from the worldwide one in ${Math.round(distinctShare('EB1', 'CN') * 100)}% of bulletins. ${lastBack ? `It has not gone backwards since ${monthName(lastBack, 'en')}, when it left Current; the movement since then has been slow and forward.` : 'Its movement has been slow and forward.'} That regularity does not make it predictable enough for us: no distance passed our back-test, so the calculator gives the cutoff and your distance from it, not a date.`,
    faqs: [
      { q: 'When can an EB-1 China applicant in the United States submit Form I-485?', a: 'In any month when the priority date is earlier than the Chinese Final Action Date, or, when USCIS designates the Dates for Filing chart for employment cases, earlier than the Chinese filing date. USCIS posts that choice each month on its filing charts page. Approval still waits for the Final Action Date, and work permit and travel document renewals tied to the pending case use the reduced G-1055 fees.' },
      { q: 'Can a spouse’s country of birth move an EB-1 China applicant to another line?', a: 'Cross-chargeability allows a principal applicant to be charged to the spouse’s country of birth when both immigrate together. A person born in mainland China married to someone born in a country without an EB-1 cutoff may therefore use the worldwide line, which has usually been Current. The chargeability guide explains the conditions.' },
      { q: 'Why is there no forecast for EB-1 China even though it moves steadily?', a: 'Because a forecast here has to pass a test on past bulletins: from October 2012 to October 2025 the range for EB-1 China dates held the real outcome far less often than our 40% minimum, at every distance tested. Steady months alternate with long pauses and occasional drops, which is exactly what broke past forecasts.' },
    ],
    body: (h) => `
<h2>The 2016 break</h2>
<p>From October 2007 to July 2016, every bulletin in our archive listed EB-1 China as Current, the same open line as everyone else. Then, in ${h.month(retro.worstAt)}, the bulletin moved the column from ${h.cell(before)} to ${h.cell(worst)}, about ${h.num(Math.round(retro.worstMonths))} months in one step, the largest of the ${h.num(retro.n)} retrogressions this line has recorded since 2001. The column has had its own date in ${h.pct(distinctShare('EB1', 'CN'))} of bulletins since October 2015.</p>
<h2>October by October</h2>
<p>The start of each fiscal year gives a clean reading. The Final Action Date was ${h.cell(octs[0])} in October 2018, ${h.cell(octs[1])} in 2019 and ${h.cell(octs[2])} in 2020, then Current in October 2021 and 2022. Since the cutoff returned, it has opened the fiscal year at ${h.cell(octs[3])} in 2023, ${h.cell(octs[4])} in 2024, ${h.cell(octs[5])} in 2025 and ${h.cell(at('2026-10'))} in 2026. Between October 2023 and October 2026 the cutoff gained about ${h.num(Math.round((isoToDays(at('2026-10')) - isoToDays(octs[3])) / 30.4375))} months of priority dates in three calendar years, so a newly filed Chinese EB-1 case joins a line that advances more slowly than time passes. ${lastBack ? `Every change since ${h.month(lastBack)} has been a step forward.` : ''}</p>
<h2>China and India on the same chart</h2>
<p>${Number.isFinite(lead) ? `This month the Chinese Final Action Date is ${lead === 0 ? 'level with' : `about ${h.num(Math.abs(lead))} months ${lead > 0 ? 'ahead of' : 'behind'}`} the Indian one, ${h.cell(fadIN)}.` : `The Indian box reads ${h.cell(fadIN)} this month.`} ${dff === cellAt('EB1', 'IN', 'DFF') ? `Both countries share the same Date for Filing, ${h.cell(dff)}.` : `The Chinese Date for Filing is ${h.cell(dff)}.`} The two lines behaved differently in fiscal year 2026: India fell back in June 2026 and stayed lower through September, while China kept edging forward. ${h.a('eb-1-india', 'EB-1 India')} has its own history.</p>
<h2>What our test found</h2>
<p>From October 2012 to October 2025, forecasts for Chinese EB-1 dates six months behind the cutoff missed by a median of ${h.num(bt6.medianError, Number.isInteger(bt6.medianError) ? 0 : 1)} months, with only ${h.pct(bt6.coverage)} of outcomes inside the range; a year behind, ${h.num(bt12.medianError)} months and ${h.pct(bt12.coverage)}. Neither passes, which is why the result box shows the cutoff and filing status only.</p>`,
  },
});
