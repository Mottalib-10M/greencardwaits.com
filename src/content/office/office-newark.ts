import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('NEW');
const mtl = officeFacts('MTL');
const njc = officeFacts('NJC');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-newark', group: 'office', order: 555, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "NEW"},
  data: {"office": "NEW"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/newark',
    nav: `Newark field office`, card: `USCIS Newark against Mount Laurel and Cranbury: three New Jersey offices with very different family green card times.`,
    title: `USCIS Newark Processing Times 2026: N-400 and I-485`,
    description: `USCIS Newark field office: N-400 and family I-485 times as published, the Mount Laurel and Cranbury offices in New Jersey compared, and inquiry cut-off dates.`,
    h1: `Newark field office: New Jersey’s busiest USCIS queue`,
    intro: `New Jersey has three USCIS field offices; Newark covers the northern counties and carries the longest family green card queue of the three.`,
    resume: `USCIS publishes ${o.n400Range} for naturalization at the Newark field office, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based adjustment of status, rank ${o.i485Rank}. New Jersey’s other two offices sit on either side of it. Mount Laurel, in the south, publishes ${mtl.n400Range} for Form N-400 and ${mtl.i485Range} for the family I-485. Cranbury, the newest office in the data, which appears in the published series only from September 2024, shows ${njc.n400Range} for naturalization, among the very fastest in the country, and ${njc.i485Range} for the family green card. The upper figure of each range is the time within which USCIS completes 80% of cases. At Newark, USCIS accepts a case inquiry for N-400 receipts dated on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}. All figures: USCIS publication of ${pub}.`,
    faqs: [
      { q: `How long is the Newark USCIS wait for citizenship?`, a: `Naturalization at Newark is published at ${o.n400Range}, from the receipt date to a decision. Mount Laurel shows ${mtl.n400Range} and Cranbury ${njc.n400Range}. New Jersey addresses are assigned to one of the three by county; the interview notice tells you which. The interview notice, not the city you live in, tells you which office’s figures apply to you.` },
      { q: `Why is the family I-485 at Newark so much slower than the N-400?`, a: `The family green card range at Newark, ${o.i485Range}, is ${fm(o.gap)} months longer at the upper bound than the naturalization range. Family cases involve a sponsor, an affidavit of support and often the wait for a visa number, so the two queues are not comparable.` },
      { q: `When did the Cranbury USCIS office start appearing in processing times?`, a: `The published series we keep shows Cranbury, New Jersey, from September 2024 onward, while the other offices go back to March 2022. That is why its history on comparisons is shorter. Its current figures are ${njc.n400Range} for Form N-400 and ${njc.i485Range} for family-based Form I-485.` },
    ],
    body: (h) => `<h2>Three New Jersey offices compared</h2>
<p>Newark is the largest of the three and, for family adjustment, the slowest: its upper bound of ${fm(o.i485.max)} months compares with ${fm(mtl.i485.max)} at Mount Laurel and ${fm(njc.i485.max)} at Cranbury. For naturalization, the order is the opposite of what size would suggest, with Cranbury near the top of the national ranking.</p>
<h2>Since 2022</h2>
<p>When our records begin, on ${o.firstDate}, Newark published ${o.n400FirstRange} for the N-400 and ${o.i485FirstRange} for the family I-485. The upper bounds have since moved by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months.</p>
<h2>Your receipt date is what matters</h2>
<p>A published range describes the office, not your file. Enter the receipt date from Form I-797C in the checker above to see how far along you are and whether the inquiry window is open. Keep your address current with USCIS: a move between New Jersey counties can send the file to another office.</p>
<h2>What the family figure covers</h2>
<p>The family-based I-485 range at Newark covers spouses, parents and children of U.S. citizens as well as preference relatives whose priority date is current. For a spouse of a citizen, it is close to the whole wait inside the country; for a sibling or adult child, the Visa Bulletin wait comes first and can last many years longer than anything the office publishes. Newark’s naturalization queue, by contrast, depends only on the office itself.</p>`,
  },
});
