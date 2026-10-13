import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('TAM');
const orl = officeFacts('ORL');
const ofm = officeFacts('OFM');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-tampa', group: 'office', order: 568, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "TAM"},
  data: {"office": "TAM"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/tampa',
    nav: `Tampa field office`, card: `USCIS Tampa: a quicker family green card queue than most of Florida, and a mid-table citizenship line.`,
    title: `USCIS Tampa Processing Times 2026: N-400 and I-485`,
    description: `USCIS Tampa field office: N-400 and family I-485 processing times, compared with Orlando and Fort Myers, rank among 90 offices, and case inquiry cut-off dates.`,
    h1: `Tampa field office: Florida’s Gulf Coast queue`,
    intro: `Tampa serves the Gulf Coast of Florida from Tampa Bay; its family green card queue is one of the quicker ones in the state.`,
    resume: `USCIS publishes ${o.i485Range} for family-based Form I-485 at the Tampa field office, rank ${o.i485Rank} of ${OFFICE_COUNT}, which makes Tampa one of the quicker Florida offices for a family green card. Naturalization is published at ${o.n400Range}, rank ${o.n400Rank}, around the middle of the national list. Orlando, inland, publishes ${orl.n400Range} for the N-400 and ${orl.i485Range} for the family I-485; Fort Myers, further south on the Gulf Coast, ${ofm.n400Range} and ${ofm.i485Range}. In our first record, from ${o.firstDate}, Tampa published ${o.n400FirstRange} for citizenship and ${o.i485FirstRange} for family adjustment; the upper bounds have moved by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months since. USCIS accepts Tampa case inquiries for N-400 receipts on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}, per its publication of ${pub}.`,
    faqs: [
      { q: `How long is the N-400 wait at USCIS Tampa?`, a: `USCIS publishes ${o.n400Range} for naturalization at Tampa, from the receipt date on your notice to a decision. Tampa ranks ${o.n400Rank} of ${OFFICE_COUNT} field offices. The oath ceremony is scheduled after approval. If the case has been transferred, the receiving office’s range is the one to use from then on.` },
      { q: `Is Tampa faster than Orlando for a family green card?`, a: `Yes on current figures: Tampa publishes ${o.i485Range} for family-based Form I-485 and Orlando ${orl.i485Range}. Spouses of citizens with no Visa Bulletin wait feel this difference directly. The checker on this page applies these same figures to the receipt date on your own notice.` },
      { q: `Does Fort Myers have its own USCIS field office?`, a: `Yes. USCIS lists Fort Myers, Florida, separately, with ${ofm.n400Range} for Form N-400 and ${ofm.i485Range} for family-based Form I-485 on the latest publication. Your address decides whether Tampa or Fort Myers holds the file. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
    ],
    body: (h) => `<h2>Three Gulf and Central Florida offices</h2>
<p>For the family green card, Tampa ranks ${o.i485Rank}, Fort Myers ${ofm.i485Rank} and Orlando ${orl.i485Rank}. For naturalization the order is Tampa first again, then Orlando and Fort Myers, both in the slower fifth of the country.</p>
<h2>Since 2022</h2>
<p>At the 80% mark, Tampa’s naturalization queue has barely moved since our first record (${sgn(o.n400Change)} months), while the family green card queue has grown by ${sgn(o.i485Change)} months. Other Florida offices grew faster, which is why Tampa now looks relatively quick for family cases.</p>
<h2>Checking your date</h2>
<p>Enter your receipt date above. The checker compares it with the Tampa range and the inquiry cut-off USCIS publishes for the office.</p>
<h2>Tampa Bay and the Gulf Coast</h2>
<p>Florida addresses are divided among many field offices, and Fort Myers is a separate office from Tampa even though both are on the Gulf Coast. For a spouse of a U.S. citizen adjusting status inside the country, Tampa’s family range is close to the full wait, since immediate relatives have no Visa Bulletin queue. For a sibling or adult child, the bulletin comes first and can be much longer than anything the office publishes.</p>`,
  },
});
