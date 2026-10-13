import { definePage } from '../../lib/guide-types';
import PR from '../../data/params-2026.json';
import { kindById, centerRows, PUBLISHED } from '../../lib/engine/ptimes';
import { cellAt, COUNTRY_LABEL } from '../../lib/engine/cases';
import { formatNumber, formatMoney, displayDate } from '../../lib/format';
import { cellText } from '../../lib/text';

// Chiffres lus dans les données : I-526E à l'Immigrant Investor Program Office, et case EB-5 (non réservée) du bulletin.
const n = (x: number | null | undefined) => (x == null ? '–' : formatNumber(x, x % 1 ? 1 : 0, 'en'));
const r = centerRows(kindById('i526e')!)[0];
const eb5 = (['ROW', 'CN', 'IN'] as const).map((c) => ({ c, fad: cellAt('EB5', c, 'FAD'), dff: cellAt('EB5', c, 'DFF') }));
const row = eb5[0], cn = eb5[1], ind = eb5[2];
const F = PR.fees.i526e;
const pub = displayDate(PUBLISHED, 'en-US');
const years = (m: number) => formatNumber(m / 12, 1, 'en');

export default definePage({
  id: "i-526e-processing-time", group: "times", order: 511, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i526e", "office": "HOU"},
  data: {"form": "i-526e"},
  related: ["processing-times", "eb-5", "eb-5-china", "eb-5-india", "fees"],
  sources: ["uscisTimes", "itData", "uscisData", "i526eForm", "g1055", "vbIndex"],
  en: {
    path: "processing-times/i-526e",
    nav: 'I-526E investor time', card: 'How long the regional center investor petition takes at USCIS, next to the EB-5 cutoffs for China and India.',
    title: 'I-526E Processing Time 2026: EB-5 Regional Center Petition',
    description: 'I-526E processing time in 2026: the USCIS range for EB-5 regional center investor petitions, the inquiry date, the filing fee and EB-5 Visa Bulletin cutoffs.',
    h1: 'I-526E processing time for EB-5 regional center investors',
    intro: 'Enter the receipt date of your I-526E to see how the petition compares with the range the Immigrant Investor Program Office publishes.',
    resume: `Form I-526E is the immigrant petition filed by an investor through an EB-5 regional center. It is decided by the USCIS Immigrant Investor Program Office, which publishes a single line for it. In the edition of ${pub}, the range is ${n(r.min)} to ${n(r.max)} months, or roughly ${years(r.min!)} to ${years(r.max!)} years: half of the petitions were decided within the first figure and 80% within the second. USCIS accepts case inquiries for receipts dated on or before ${displayDate(r.inquiry!, 'en-US')}. The monthly report to Congress does not list the I-526E, so this range is the only official measure of the wait. The filing fee under the G-1055 schedule is ${formatMoney(F.amount, 0, 'en')}. The petition is only one of two clocks for investors born in China or India: in the Visa Bulletin, the unreserved EB-5 Final Action Date for mainland China is ${cellText(cn.fad, 'en')} and for India ${cellText(ind.fad, 'en')}, against ${cellText(row.fad, 'en')} for all other countries. USCIS does not explain the length of the I-526E range on its tool.`,
    faqs: [
      { q: 'How long does an EB-5 regional center petition take at USCIS?', a: 'USCIS publishes one range for Form I-526E at the Immigrant Investor Program Office, shown at the top of this page with its inquiry date. The range counts from the receipt date to a decision on the petition. It does not include the green card stage that follows, which is a Form I-485 inside the United States or an immigrant visa abroad.' },
      { q: 'Does an approved I-526E give an EB-5 investor a green card right away?', a: 'Only if a visa number is available. The EB-5 category has its own Visa Bulletin cutoffs, published by country, and for investors born in mainland China, and in many recent bulletins India, the unreserved cutoff has been behind the rest of the world. The table on this page shows this month’s Final Action Date and Date for Filing for each.' },
      { q: 'What is the USCIS filing fee for Form I-526E in 2026?', a: 'The G-1055 fee schedule in force in 2026 lists one fee for Form I-526E, shown on this page and on our fee overview. It is paid once per petition and it does not change with the processing time. Legal and regional center charges are separate and are not set by USCIS, so we do not show them.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '–' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>A wait measured in years</h2>
<p>The range reads ${m(r.min)} to ${m(r.max)} months, about ${h.num(r.min! / 12, 1)} to ${h.num(r.max! / 12, 1)} years. Only ${m(r.max! - r.min!)} months separate the median petition from the 80% mark, so the petitions decided between those two points are bunched closely together. The inquiry date of ${h.date(r.inquiry!)} shows how far back that 80% mark reaches: an investor whose receipt date is later than it is still within what USCIS calls normal processing time, even after two or more years.</p>
<p>Put the receipt date from the I-797C notice in the checker above. It returns the months elapsed and tells you whether a case inquiry is already possible. Keep in mind that, by construction, one petition in five takes longer than the upper figure, so passing it is not by itself a sign that something went wrong.</p>
<h2>The second clock: the EB-5 cutoffs</h2>
${h.table(['Country of birth', 'Final Action Date', 'Date for Filing'], eb5.map((x) => [COUNTRY_LABEL.en[x.c], h.cell(x.fad), h.cell(x.dff)]), 'EB-5 unreserved numbers, latest Visa Bulletin.', ['l', 'l', 'l'])}
<p>For an investor born in mainland China or India, the petition and the cutoff run in parallel. Approval of the I-526E does not bring the visa number closer, and a current priority date does not speed up the petition. The ${h.a('eb-5-china', 'EB-5 China')} and ${h.a('eb-5-india', 'EB-5 India')} pages show how those cutoffs moved since 2001.</p>
<h2>What this page does not cover</h2>
<p>Regional center fees, project risk and the investment amount are outside the scope of a processing-time page, and none of them is published by USCIS in a form we could check. The ${h.src('i526eForm', 'Form I-526E page')} lists the current edition and filing rules. An immigration attorney is the right contact for questions about a specific project.</p>`;
    },
  },
});
