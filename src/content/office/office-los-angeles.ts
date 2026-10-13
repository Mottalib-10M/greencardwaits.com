import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('LOS');
const lac = officeFacts('LAC');
const saa = officeFacts('SAA');
const sfv = officeFacts('SFV');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-los-angeles', group: 'office', order: 551, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "LOS"},
  data: {"office": "LOS"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/los-angeles',
    nav: `Los Angeles field office`, card: `USCIS Los Angeles beside Los Angeles County, Santa Ana and San Fernando Valley: N-400 and family I-485.`,
    title: `N-400 Processing Time Los Angeles 2026: USCIS Data`,
    description: `USCIS Los Angeles field office: N-400 and family I-485 processing times compared with LA County, Santa Ana and San Fernando Valley, plus the inquiry dates.`,
    h1: `USCIS Los Angeles: citizenship and family green card timelines`,
    intro: `Southern California is split between several USCIS field offices; this page is about the Los Angeles office and the three neighbors people most often confuse with it.`,
    resume: `Los Angeles residents are not all sent to the same USCIS building. The Los Angeles field office publishes ${o.n400Range} for naturalization, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based adjustment of status, rank ${o.i485Rank}. Its neighbors publish different figures: Los Angeles County ${lac.n400Range} and ${lac.i485Range}, Santa Ana ${saa.n400Range} and ${saa.i485Range}, San Fernando Valley ${sfv.n400Range} and ${sfv.i485Range}, in the same order. Naturalization is broadly similar across the four; family green cards are where the gaps open, with Santa Ana among the slowest offices in the country. The upper figure in each range is the time within which USCIS completes 80% of cases. At Los Angeles, a case inquiry is accepted for N-400 receipts dated on or before ${o.n400Inquiry} and for family I-485 receipts on or before ${o.i485Inquiry}, according to the USCIS publication of ${pub}.`,
    faqs: [
      { q: `What is the current N-400 processing time in Los Angeles?`, a: `USCIS publishes ${o.n400Range} for the Los Angeles field office. The clock starts on the receipt date of Form I-797C. Most applicants get a biometrics appointment first, then an interview with the English and civics tests, and a decision on the day or soon after. USCIS updates the figures roughly once a month, so check the date of the publication before relying on them.` },
      { q: `Is the Los Angeles County office the same as the Los Angeles office?`, a: `No. USCIS lists Los Angeles and Los Angeles County as two field offices with separate published times: naturalization at ${o.n400Range} and ${lac.n400Range}, family green card at ${o.i485Range} and ${lac.i485Range}. Your interview notice names the office that has your file. The interview notice, not the city you live in, tells you which office’s figures apply to you.` },
      { q: `Why is the family green card slower than citizenship at USCIS Los Angeles?`, a: `At Los Angeles the family I-485 range is ${o.i485Range}, against ${o.n400Range} for the N-400. Family cases involve the petitioner, the affidavit of support and sometimes an interview with both spouses, and they can wait on visa availability; a naturalization case is a single applicant.` },
    ],
    body: (h) => `<h2>How the Los Angeles numbers have moved</h2>
<p>When our series begins, on ${o.firstDate}, the Los Angeles office published ${o.n400FirstRange} for naturalization and ${o.i485FirstRange} for family adjustment. Today’s figures are ${o.n400Range} and ${o.i485Range}. The upper bound has moved by ${sgn(o.n400Change)} months for citizenship and by ${sgn(o.i485Change)} months for the family green card.</p>
<h2>Santa Ana and the Valley</h2>
<p>Santa Ana, which serves Orange County, ranks ${saa.i485Rank} of ${OFFICE_COUNT} for family adjustment, one of the longest queues in the system. San Fernando Valley ranks ${sfv.i485Rank}. For naturalization the four offices are much closer together. This matters when friends compare timelines: the same form, filed the same week, can be on very different clocks across Southern California.</p>
<h2>Before calling USCIS</h2>
<p>Check that your case is older than the upper figure, and that your receipt date is on or before the inquiry date USCIS publishes for the office. The checker above does both with your date. If your family case depends on the Visa Bulletin, look at your priority date too: an interview can happen while the green card itself still waits for a visa number.</p>
`,
  },
});
