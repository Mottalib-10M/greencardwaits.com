import { definePage } from '../../lib/guide-types';
import { cellAt, distinctShare, filingChart, MONTHS, LATEST } from '../../lib/engine/cases';
import { PUBLISHED } from '../../lib/engine/ptimes';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import VB from '../../data/visa-bulletin.json';
import PT from '../../data/ptimes-latest.json';

// Chiffres lus dans les données (jamais tapés).
const fad = cellAt('EB5', 'ROW', 'FAD');
const fadCN = cellAt('EB5', 'CN', 'FAD'), dffCN = cellAt('EB5', 'CN', 'DFF');
const fadIN = cellAt('EB5', 'IN', 'FAD'), dffIN = cellAt('EB5', 'IN', 'DFF');
const vals = MONTHS.map((_, i) => cellAt('EB5', 'ROW', 'FAD', i)).filter((v) => v !== 'U');
const nCurrent = vals.filter((v) => v === 'C').length;
const retro = retrogressions('EB5', 'ROW');
type B = { month: string; FAD: Record<string, Record<string, string>>; DFF?: Record<string, Record<string, string>> | null };
const bulletins = (VB as unknown as { bulletins: B[] }).bulletins;
const SET = ['EB5R', 'EB5H', 'EB5I'];
const withSet = bulletins.filter((b) => SET.some((k) => b.FAD[k]));
const firstSet = withSet[0]?.month ?? LATEST;
const setAlwaysCurrent = withSet.every((b) => SET.every((k) => Object.values(b.FAD[k] ?? {}).every((v) => v === 'C')));
const latestSet = bulletins.find((b) => b.month === LATEST)!;
const setNow = SET.every((k) => Object.values(latestSet.FAD[k] ?? {}).every((v) => v === 'C'));
const i526 = ((PT as any).forms['i-526e'].rows as Array<{ office: string; subtype: string; min: number; max: number }>).find((r) => r.subtype === '526IP')!;
const dffChart = filingChart('EB5') === 'DFF';
const en = (c: string) => cellText(c, 'en');
const m1 = (h: { num: (n: number, d?: number) => string }, x: number) => h.num(x, Number.isInteger(x) ? 0 : 1);

export default definePage({
  id: "eb-5", group: "employment", order: 204,
  tool: {"kind": "greencard", "cat": "EB5", "country": "ROW"},
  data: {"cat": "EB5", "country": "ROW"},
  related: ["eb-5-china", "eb-5-india", "i-526e-processing-time", "employment-green-card-cost", "guide-chargeability"],
  sources: ["vbIndex", "vbMirror", "vbOct2026", "aosCharts", "visaPriority", "i526eForm", "itData", "g1055"],
  en: {
    path: "employment/eb-5",
    nav: 'EB-5 investors', card: 'Fifth preference: the unreserved investor cutoff, the rural, high-unemployment and infrastructure set-asides, and I-526E time.',
    title: 'EB-5 Visa Bulletin 2026: Investor Cutoff and Set-Aside Rows',
    description: 'EB-5 investors in the Visa Bulletin: unreserved and set-aside rows (rural, high unemployment, infrastructure), the China and India dates and Form I-526E time.',
    h1: 'EB-5 investors: unreserved numbers, set-asides and the two long queues',
    intro: 'Enter the priority date from your Form I-526E receipt to check the unreserved EB-5 row for your country of birth this month.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, the unreserved EB-5 row reads ${en(fad)} for investors born outside mainland China and India, while China stands at ${en(fadCN)} and India at ${en(fadIN)} on the Final Action chart. EB-5, which the bulletin calls employment creation, receives 7.1% of the worldwide employment-based level. Of that, 32% is set aside: 20% for investment in a rural area, 10% for a high unemployment area and 2% for infrastructure projects, and the remaining 68% is unreserved. The three set-aside rows ${setNow ? 'are Current for every country this month' : 'carry their own dates this month'}${setAlwaysCurrent ? `, as they have been on the Final Action chart in every bulletin since they first appeared in ${monthName(firstSet, 'en')}` : ''}. Which row applies depends on the project, so a Chinese or Indian investor in a set-aside project is not held to the unreserved cutoff. The latest USCIS range for a regional center petition, Form I-526E, is ${i526.min} to ${i526.max} months.`,
    faqs: [
      { q: 'What do the EB-5 set-aside rows in the Visa Bulletin mean?', a: 'They are the reserved shares of the fifth preference. The bulletin sets aside 20% of EB-5 numbers for investors in rural areas, 10% for high unemployment areas and 2% for infrastructure projects. Each set-aside has its own row and its own cutoff. Investors whose project does not qualify for a set-aside use the unreserved row, which receives the remaining 68%.' },
      { q: 'Can an EB-5 investor pick the unreserved row or a set-aside row?', a: 'Not as a free choice. The set-aside rows are defined by where the money goes: a rural area, a high unemployment area or an infrastructure project. A petition that qualifies for one of them is counted in that row; any other petition uses the unreserved row. Whether a given project qualifies is a matter for the petition and an immigration attorney, not something the bulletin decides.' },
      { q: 'Why is the EB-5 unreserved row Current for most countries but not for China and India?', a: 'Each country is capped at 7% of the yearly preference numbers, and demand from investors born in mainland China, and more recently in India, exceeds that share in the unreserved row. The State Department therefore prints a cutoff for those two columns while investors born elsewhere face no queue in that row.' },
    ],
    body: (h) => `
<h2>Four rows for one preference</h2>
<p>Paragraph 5 of the ${h.src('vbOct2026', 'October 2026 bulletin')} splits the fifth preference. Of its 7.1% of the employment level, 20% is reserved for investors in a rural area, 10% for a high unemployment area and 2% for infrastructure projects; the other 68% is unreserved. Each part gets its own row in both charts. The row labels list the visa classes they cover: the unreserved row includes C5, T5, I5 and R5, the rural row NR and RR, the high-unemployment row NH and RH, and the infrastructure row RI. The calculator above uses the unreserved row, because that is where the cutoffs are.</p>
<h2>${setAlwaysCurrent ? 'The set-asides have not had a queue' : 'The set-aside rows'}</h2>
<p>The three reserved rows first appear in the ${h.month(firstSet)} bulletin. ${setAlwaysCurrent ? `On the Final Action chart they have read Current for every country in every bulletin since, ${h.num(withSet.length)} bulletins in a row.` : 'They have since carried dates in some months, which the table of the month shows.'} For an investor born in mainland China or India, that difference is the whole story: the same priority date can be years behind on the unreserved row and current on a set-aside row.</p>
<h2>The unreserved row</h2>
<p>For investors born outside China and India, the unreserved Final Action Date was Current in ${h.num(nCurrent)} of ${h.num(vals.length)} published readings since December 2001; ${retro.n === 1 ? `the only step back in the archive came in ${h.month(retro.worstAt)}` : `it has stepped back ${h.num(retro.n)} times, most sharply in ${h.month(retro.worstAt)}`}. Mexico and the Philippines share that column. Mainland China has had its own date in ${h.pct(distinctShare('EB5', 'CN'))} of bulletins since October 2015 and now stands at ${h.cell(fadCN)}, with a Date for Filing of ${h.cell(dffCN)}. India, separate in ${h.pct(distinctShare('EB5', 'IN'))} of them, is at ${h.cell(fadIN)}, with a filing date of ${h.cell(dffIN)}. ${dffChart ? 'USCIS accepts the Dates for Filing chart this month for employment-based I-485 applications, which lets an investor already in the United States file once the priority date is earlier than the filing date.' : 'USCIS requires the Final Action chart this month for employment-based I-485 applications.'} The country pages follow each line: ${h.a('eb-5-china', 'EB-5 China')} and ${h.a('eb-5-india', 'EB-5 India')}.</p>
<h2>The petition before the queue</h2>
<p>A regional center investor files Form I-526E with the Immigrant Investor Program Office. The ${h.src('itData', `${h.month(PUBLISHED.slice(0, 7))} USCIS release`)} gives ${m1(h, i526.min)} to ${m1(h, i526.max)} months for that petition, and the ${h.src('g1055', 'G-1055 fee schedule')} sets its filing fee at ${h.usd(h.P.fees.i526e.amount)}. The priority date is the filing date of the petition, so that long review runs alongside the queue rather than adding to it, for investors whose row has one. Investment amounts, project rules and the choice between rows are legal and financial questions for a licensed immigration attorney or a DOJ-accredited representative; this page only reads the bulletin.</p>`,
  },
});
