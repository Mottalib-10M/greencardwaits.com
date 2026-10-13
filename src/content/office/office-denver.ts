import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('DEN');
const slc = officeFacts('SLC');
const abq = officeFacts('ABQ');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-denver', group: 'office', order: 566, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "DEN"},
  data: {"office": "DEN"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/denver',
    nav: `Denver field office`, card: `USCIS Denver: both queues longer than in 2022, with Salt Lake City and Albuquerque for comparison.`,
    title: `USCIS Denver Processing Times 2026: N-400 and I-485`,
    description: `USCIS Denver field office: N-400 and family I-485 times, how both have lengthened since 2022, Salt Lake City and Albuquerque compared, and inquiry dates.`,
    h1: `Denver field office: Mountain West times compared`,
    intro: `Denver serves Colorado and Wyoming addresses; its published times have grown on both main forms since the series began in 2022.`,
    resume: `USCIS publishes ${o.n400Range} for Form N-400 at the Denver field office, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}. Both are longer than in our first record, from ${o.firstDate}, when the office published ${o.n400FirstRange} for naturalization and ${o.i485FirstRange} for family adjustment: the upper bounds have moved by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months. Other Mountain West offices publish shorter family green card ranges at the moment: Salt Lake City ${slc.i485Range} and Albuquerque ${abq.i485Range}. For naturalization, Salt Lake City shows ${slc.n400Range} and Albuquerque ${abq.n400Range}. USCIS accepts Denver case inquiries for N-400 receipts on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}, according to its publication of ${pub}.`,
    faqs: [
      { q: `How long does the N-400 take at USCIS Denver?`, a: `USCIS publishes ${o.n400Range} for naturalization at Denver, from receipt to decision. In early 2022 the same office published ${o.n400FirstRange}. Denver now ranks ${o.n400Rank} of ${OFFICE_COUNT} field offices. If the case has been transferred, the receiving office’s range is the one to use from then on.` },
      { q: `Is Salt Lake City faster than Denver for a family green card?`, a: `On the latest figures, yes: Salt Lake City publishes ${slc.i485Range} for family-based Form I-485 and Denver ${o.i485Range}. Each serves its own area; USCIS assigns the office from the applicant’s address. The checker on this page applies these same figures to the receipt date on your own notice.` },
      { q: `How much longer is the Denver family green card queue than in 2022?`, a: `At the upper bound, ${sgn(o.i485Change)} months: from ${o.i485FirstRange} in our first record to ${o.i485Range} today. The table on this page shows the last USCIS publication of each year. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
    ],
    body: (h) => `<h2>Both queues longer</h2>
<p>Denver is one of the offices where the 80% mark has grown for citizenship and for family adjustment alike. The family green card queue is now ${fm(o.gap)} months longer than the naturalization queue at the upper bound.</p>
<h2>The neighbors</h2>
<p>Salt Lake City ranks ${slc.i485Rank} and Albuquerque ${abq.i485Rank} for family adjustment, both well ahead of Denver at ${o.i485Rank}. For naturalization the three are closer, between ranks ${Math.min(o.n400Rank, slc.n400Rank, abq.n400Rank)} and ${Math.max(o.n400Rank, slc.n400Rank, abq.n400Rank)}.</p>
<h2>What to check</h2>
<p>Enter your receipt date above to see how long your case has been pending and whether USCIS would take an inquiry. If your family case is in a preference category, the Visa Bulletin also decides when approval is possible.</p>
<h2>Colorado and Wyoming</h2>
<p>The Denver office serves a large area, from the Front Range to rural counties hours away. Its family green card range has grown more than its naturalization range since 2022, and it now sits in the slowest fifth of the country for family adjustment. Salt Lake City, by contrast, has seen its family upper bound fall over the same period, from ${slc.i485FirstRange} to ${slc.i485Range}.</p>`,
  },
});
