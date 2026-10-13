import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('BOS');
const law = officeFacts('LAW');
const pro = officeFacts('PRO');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-boston', group: 'office', order: 563, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "BOS"},
  data: {"office": "BOS"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/boston',
    nav: `Boston field office`, card: `USCIS Boston against Lawrence and Providence: New England offices with very different speeds.`,
    title: `USCIS Boston Processing Times 2026: N-400 and I-485`,
    description: `USCIS Boston field office: N-400 and family I-485 processing times, the Lawrence and Providence offices compared, four years of data and inquiry cut-offs.`,
    h1: `Boston field office: New England’s main USCIS queue`,
    intro: `Massachusetts is served by Boston and Lawrence, and Rhode Island by Providence; the three publish strikingly different times.`,
    resume: `USCIS publishes ${o.n400Range} for Form N-400 at the Boston field office, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}. Within an hour’s drive, the Lawrence office, which covers parts of northeastern Massachusetts, is among the slowest for both queues, at ${law.n400Range} and ${law.i485Range}, while Providence is among the fastest, at ${pro.n400Range} and ${pro.i485Range}. Boston itself is close to the middle for naturalization and in the faster third for family adjustment. Since our first record, from ${o.firstDate}, Boston’s upper bounds have moved by ${sgn(o.n400Change)} months for citizenship and ${sgn(o.i485Change)} months for the family green card. USCIS accepts Boston case inquiries for N-400 receipts on or before ${o.n400Inquiry} and for family I-485 receipts on or before ${o.i485Inquiry}. Source: USCIS publication of ${pub}.`,
    faqs: [
      { q: `How long does citizenship take at the Boston USCIS office?`, a: `Naturalization at Boston is published at ${o.n400Range}, counted from the receipt date to a decision. Boston ranks ${o.n400Rank} of ${OFFICE_COUNT} offices. The upper figure is the time within which 80% of cases are completed. These are office-wide figures; your own case can finish earlier or later than both numbers.` },
      { q: `Why is Lawrence so much slower than Boston?`, a: `USCIS does not publish reasons by office, only the ranges: ${law.n400Range} for the N-400 at Lawrence against ${o.n400Range} at Boston, and ${law.i485Range} for the family I-485 against ${o.i485Range}. Each office has its own staff and caseload, so neighbors can diverge a lot.` },
      { q: `Is Providence the fastest office in New England?`, a: `On current figures it is among the fastest in the country: Providence publishes ${pro.n400Range} for naturalization, rank ${pro.n400Rank}, and ${pro.i485Range} for family adjustment, rank ${pro.i485Rank}. It serves Rhode Island addresses. USCIS updates the figures roughly once a month, so check the date of the publication before relying on them.` },
    ],
    body: (h) => `<h2>Neighbors far apart</h2>
<p>The upper bound for the family green card is ${fm(law.i485.max)} months at Lawrence, ${fm(o.i485.max)} at Boston and ${fm(pro.i485.max)} at Providence. For naturalization the three run from ${fm(pro.n400.max)} to ${fm(law.n400.max)} months. Two applicants in neighboring towns can therefore be on very different clocks.</p>
<h2>Boston since 2022</h2>
<p>Our first record shows ${o.n400FirstRange} for the N-400 and ${o.i485FirstRange} for the family I-485 at Boston. At the 80% mark naturalization is now slightly quicker, while the family green card queue has grown by ${sgn(o.i485Change)} months.</p>
<h2>Your own file</h2>
<p>Enter the receipt date from your notice in the checker above. If you have moved since filing, check which office your latest notice names: a transfer between offices can change both the range and the inquiry date that apply to you.</p>
<h2>Which Massachusetts office is yours</h2>
<p>USCIS assigns Massachusetts addresses to either Boston or Lawrence, and the office on your interview notice is the one that matters. A move between the two areas can transfer the file, and with Lawrence among the slowest offices for both queues, the difference is large. Rhode Island residents file with Providence; New Hampshire, Maine and Vermont have their own offices, which also publish separate figures.</p>`,
  },
});
