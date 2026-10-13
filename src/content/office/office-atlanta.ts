import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('ATL');
const clt = officeFacts('CLT');
const mem = officeFacts('MEM');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-atlanta', group: 'office', order: 557, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "ATL"},
  data: {"office": "ATL"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/atlanta',
    nav: `Atlanta field office`, card: `USCIS Atlanta: a middle-of-the-pack family green card queue and a slower citizenship line.`,
    title: `USCIS Atlanta Processing Times 2026: N-400 and I-485`,
    description: `USCIS Atlanta field office: N-400 and family I-485 processing times, rank among 90 offices, how they changed since 2022, and when USCIS takes a case inquiry.`,
    h1: `Atlanta field office: what USCIS publishes for Georgia`,
    intro: `The Atlanta field office serves most of Georgia; here are its published times, its national rank and the dates that open a case inquiry.`,
    resume: `For Georgia applicants, the Atlanta field office has an unusual profile: the family green card queue is in the faster half of the country while naturalization is in the slower half. USCIS publishes ${o.i485Range} for family-based Form I-485 at Atlanta, rank ${o.i485Rank} of ${OFFICE_COUNT}, and ${o.n400Range} for Form N-400, rank ${o.n400Rank}. In our first record, from ${o.firstDate}, the same office published ${o.i485FirstRange} for the family I-485 and ${o.n400FirstRange} for naturalization: the family upper bound has moved by ${sgn(o.i485Change)} months and the citizenship one by ${sgn(o.n400Change)}. In the wider Southeast, Charlotte publishes ${clt.n400Range} for naturalization and Memphis ${mem.n400Range}. USCIS accepts Atlanta case inquiries for N-400 receipts dated on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}, according to its publication of ${pub}.`,
    faqs: [
      { q: `How long does the N-400 take in Atlanta?`, a: `USCIS publishes ${o.n400Range} for naturalization at the Atlanta field office, counted from the receipt date on Form I-797C. The upper figure is the time within which 80% of cases are completed. Atlanta currently ranks ${o.n400Rank} of ${OFFICE_COUNT} offices. If the case has been transferred, the receiving office’s range is the one to use from then on.` },
      { q: `Is the Atlanta family green card queue getting shorter?`, a: `At the upper bound, yes: USCIS published ${o.i485FirstRange} for family-based Form I-485 at Atlanta in our first 2022 record, and ${o.i485Range} today, a change of ${sgn(o.i485Change)} months. The table on this page shows the last publication of each year so you can see the path.` },
      { q: `What date lets me send a case inquiry to USCIS Atlanta?`, a: `USCIS publishes a receipt date for each office and form. At Atlanta, inquiries are accepted for N-400 receipts on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}. If your receipt is later, USCIS considers the case within normal time. The checker on this page applies these same figures to the receipt date on your own notice.` },
    ],
    body: (h) => `<h2>A queue that shortened</h2>
<p>Many offices are slower now than in 2022. Atlanta is an exception at the 80% mark: its family adjustment queue went from ${fm(o.i485First?.[2] ?? null)} months then to ${fm(o.i485.max)} now, a much larger drop than naturalization, which went from ${fm(o.n400First?.[2] ?? null)} to ${fm(o.n400.max)} months.</p>
<h2>Where Atlanta stands</h2>
<p>Rank ${o.i485Rank} of ${OFFICE_COUNT} for family adjustment puts Atlanta in the faster half; rank ${o.n400Rank} for naturalization puts it in the slower third. The difference between the two upper bounds is ${fm(o.gap)} months.</p>
<h2>Checking your own file</h2>
<p>Use the checker above with your receipt date. For family cases, also check your priority date in the Visa Bulletin: if you are in a preference category, a visa number has to be available before USCIS can approve, and an interview alone does not settle that. Report any move with Form AR-11 within 10 days.</p>
<h2>Georgia’s single office</h2>
<p>Atlanta is the only USCIS field office in Georgia, so a move within the state normally keeps the file in the same place. That makes the Atlanta series a clean picture of one office over time: the same building, staff and rules, with only the volume of cases changing. The yearly table on this page shows its last publication of each year since 2022, for both queues side by side.</p>`,
  },
});
