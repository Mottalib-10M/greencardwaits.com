import { definePage } from '../../lib/guide-types';
import { cellAt, backtestCell, distinctShare, filingChart, MONTHS, LATEST } from '../../lib/engine/cases';
import { NATIONAL, NATIONAL_MONTH, PUBLISHED } from '../../lib/engine/ptimes';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import PT from '../../data/ptimes-latest.json';

// Chiffres lus dans les données (jamais tapés).
const at = (c: 'ROW' | 'IN' | 'CN', ym: string, ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB1', c, ch, MONTHS.indexOf(ym));
const fad = cellAt('EB1', 'ROW', 'FAD');
const fadIN = cellAt('EB1', 'IN', 'FAD'), dffIN = cellAt('EB1', 'IN', 'DFF');
const fadCN = cellAt('EB1', 'CN', 'FAD'), dffCN = cellAt('EB1', 'CN', 'DFF');
const retro = retrogressions('EB1', 'ROW');
const drop = at('ROW', retro.worstAt);
const oct18 = at('ROW', '2018-10'), oct19 = at('ROW', '2019-10'), oct20 = at('ROW', '2020-10');
const vals = MONTHS.map((_, i) => cellAt('EB1', 'ROW', 'FAD', i)).filter((v) => v !== 'U');
const nCurrent = vals.filter((v) => v === 'C').length;
const bt6 = backtestCell('EB1', 'ROW', 6)!;
const i140 = (PT as any).forms['i-140'].rows as Array<{ office: string; subtype: string; min: number; max: number }>;
const i485 = (PT as any).forms['i-485'].rows as Array<{ office: string; subtype: string; min: number; max: number }>;
const row = (rows: typeof i140, office: string, sub: string) => rows.find((r) => r.office === office && r.subtype === sub)!;
const e11 = row(i140, 'SCD', '136A-E11'), e12 = row(i140, 'SCD', '136A-E12'), e13 = row(i140, 'SCD', '136A-E13');
const fod = row(i485, 'FOD', '131A');
const dffChart = filingChart('EB1') === 'DFF';
const en = (c: string) => cellText(c, 'en');
const m1 = (h: { num: (n: number, d?: number) => string }, x: number) => h.num(x, Number.isInteger(x) ? 0 : 1);

export default definePage({
  id: "eb-1", group: "employment", order: 200,
  tool: {"kind": "greencard", "cat": "EB1", "country": "ROW"},
  data: {"cat": "EB1", "country": "ROW"},
  related: ["eb-1-india", "eb-1-china", "i-140-processing-time", "employment-green-card-cost", "guide-portability"],
  sources: ["vbIndex", "vbMirror", "vbOct2026", "aosCharts", "visaPriority", "i140Form", "itData", "uscisReport", "g1055"],
  en: {
    path: "employment/eb-1",
    nav: 'EB-1 priority workers', card: 'First preference: the rest-of-world cutoff, the India and China lines, and where EB-1 time is really spent.',
    title: 'EB-1 Visa Bulletin 2026: Priority Worker Cutoff and Wait',
    description: 'EB-1 in the Visa Bulletin: the rest-of-world cutoff, the separate India and China dates, rare retrogressions since 2001 and USCIS time for each I-140 type.',
    h1: 'EB-1 priority workers: the cutoff, the exceptions and the real clock',
    intro: 'Pick your country of birth and enter the priority date from your EB-1 Form I-140 to see whether a visa number is available this month.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, EB-1 for people born outside India and mainland China reads ${en(fad)} on the Final Action chart, and Mexico and the Philippines share that column. A Current cutoff means no visa queue at all: once USCIS approves the Form I-140 and the Form I-485, the green card can be issued whatever the priority date. India and China are the exceptions, with Final Action Dates of ${en(fadIN)} and ${en(fadCN)}, because the 7% per-country cap applies in the first preference too. For most EB-1 applicants the waiting is therefore done at USCIS: the latest published range for an extraordinary ability petition (E11) is ${e11.min} to ${e11.max} months, against ${e12.min} to ${e12.max} months for outstanding professors and researchers (E12) and ${e13.min} to ${e13.max} months for multinational executives and managers (E13). None of these figures is a promise for an individual file.`,
    faqs: [
      { q: 'Does an EB-1 priority date matter when the rest-of-world column is Current?', a: 'Not for the visa number. A Current box means every qualified applicant charged to that column can be approved, whatever the date on the I-140 receipt. The priority date still matters later: if the column retrogresses, as it did in 2018, only dates earlier than the new cutoff can be approved, and a pending case simply waits.' },
      { q: 'Why do EB-1 India and EB-1 China have a cutoff when EB-1 is Current elsewhere?', a: 'The Immigration and Nationality Act caps each country at 7% of the family and employment preference numbers in a year. Demand from people born in India and in mainland China exceeds that share in EB-1, so the State Department gives both columns their own Final Action Date, while applicants born in other countries stay on the open line.' },
      { q: 'How long does USCIS take to decide an EB-1 Form I-140?', a: 'USCIS publishes a separate range for each EB-1 subtype: extraordinary ability (E11), outstanding professor or researcher (E12) and multinational executive or manager (E13). The ranges change with each release and can differ by more than a year between subtypes, so this page reads them from the latest data instead of quoting a fixed figure. The upper bound is the time within which USCIS says it completes 80% of cases.' },
      { q: 'Can unused EB-1 visa numbers go to EB-2 applicants?', a: 'Yes. The Visa Bulletin explains that the second preference receives 28.6% of the worldwide employment-based level plus any numbers not required by the first preference. A year in which EB-1 demand stays below its allotment can therefore help the EB-2 queues, which is why the EB-1 line matters to people waiting in EB-2.' },
    ],
    body: (h) => `
<h2>Three petitions under one preference</h2>
<p>EB-1 is the first employment preference, and USCIS times three kinds of Form I-140 inside it: extraordinary ability (E11), outstanding professors and researchers (E12), and multinational executives or managers (E13). By statute the group receives 28.6% of the yearly employment-based level, plus any numbers the fourth and fifth preferences leave unused, as paragraph 5 of the ${h.src('vbOct2026', 'October 2026 bulletin')} restates. Whatever EB-1 does not use then falls to EB-2, so a quiet first preference is good news for the queues below it.</p>
<h2>A cutoff that is usually Current</h2>
<p>For applicants charged to the rest of the world, the Final Action Date was Current in ${h.num(nCurrent)} of the ${h.num(vals.length)} published readings since December 2001, and it reads ${h.cell(fad)} this month. The exceptions are worth knowing. The column has gone backwards ${h.num(retro.n)} times. In ${h.month(retro.worstAt)} it fell to ${h.cell(drop)} in a single bulletin, a step of about ${h.num(Math.round(retro.worstMonths))} months; it still stood at ${h.cell(oct18)} in October 2018 and ${h.cell(oct19)} in October 2019, and read ${h.cell(oct20)} again in October 2020. A priority worker born outside India and China should not assume the box stays open in every September, when the fiscal year runs out of numbers.</p>
<h2>India and China queue separately</h2>
<p>The 7% per-country cap bites even here. Since October 2015, the Indian column has carried its own date in ${h.pct(distinctShare('EB1', 'IN'))} of bulletins and the Chinese one in ${h.pct(distinctShare('EB1', 'CN'))}. Today the Final Action Dates are ${h.cell(fadIN)} for India and ${h.cell(fadCN)} for China, ${dffIN === dffCN ? `with the same Date for Filing, ${h.cell(dffIN)}, on both lines.` : `with Dates for Filing at ${h.cell(dffIN)} and ${h.cell(dffCN)}.`} ${dffChart ? 'USCIS currently accepts the Dates for Filing chart for employment cases, so an applicant born in either country whose priority date is earlier than that date may submit Form I-485 now and wait for approval.' : 'USCIS currently requires the Final Action chart for employment cases, so Form I-485 can only be filed once the priority date is earlier than that cutoff.'} Each line has its own page: ${h.a('eb-1-india', 'EB-1 India')} and ${h.a('eb-1-china', 'EB-1 China')}.</p>
<h2>Where an EB-1 case really spends its time</h2>
<p>With the main column open, the wait is mostly USCIS processing. The ${h.src('itData', `${h.month(PUBLISHED.slice(0, 7))} release`)} gives ${m1(h, e11.min)} to ${m1(h, e11.max)} months for an E11 petition, ${m1(h, e12.min)} to ${m1(h, e12.max)} for E12 and ${m1(h, e13.min)} to ${m1(h, e13.max)} for E13, all at Service Center Operations. An employment-based I-485 then runs ${m1(h, fod.min)} to ${m1(h, fod.max)} months at the Field Office Directorate, and the national average in the ${h.src('uscisReport', `report to Congress for ${NATIONAL_MONTH}`)} was ${h.num(NATIONAL['I-485 employment'], 1)} months. The I-140 fee is ${h.usd(h.P.fees.i140.paper)} on paper or ${h.usd(h.P.fees.i140.online)} online under the G-1055 edition of ${h.P.g1055_edition}, before the Asylum Program Fee.</p>
<p>Our back-test has little to grade on this line: from October 2012 to October 2025 there were only ${h.num(bt6.observed)} months in which a date six months behind the cutoff could be followed to the end. The calculator therefore reports Current or the distance to the cutoff, and no forecast. Whether a career fits E11, E12 or E13 is a legal question for a licensed immigration attorney or a DOJ-accredited representative.</p>`,
  },
});
