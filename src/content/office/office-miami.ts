import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('MIA');
const hia = officeFacts('HIA');
const knd = officeFacts('KND');
const okl = officeFacts('OKL');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-miami', group: 'office', order: 554, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "MIA"},
  data: {"office": "MIA"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/miami',
    nav: `Miami field office`, card: `USCIS Miami and the other South Florida offices: Hialeah, Kendall and Oakland Park side by side.`,
    title: `N-400 Processing Time Miami 2026: USCIS Field Office`,
    description: `USCIS Miami field office: N-400 and family I-485 times, the Hialeah, Kendall and Oakland Park offices compared, inquiry dates and the trend since 2022.`,
    h1: `Miami and South Florida: four USCIS offices, four clocks`,
    intro: `South Florida has four USCIS field offices within a short drive of each other, and their published times are far from identical.`,
    resume: `Miami-Dade and Broward residents are spread over four USCIS field offices: Miami, Hialeah, Kendall and Oakland Park. Their naturalization times are fairly close, but family green cards are not. Miami itself publishes ${o.n400Range} for Form N-400, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}. Hialeah shows ${hia.n400Range} for citizenship and ${hia.i485Range} for the family green card; Kendall ${knd.n400Range} and ${knd.i485Range}; Oakland Park ${okl.n400Range} and ${okl.i485Range}. Hialeah is currently one of the fastest offices in the country for naturalization. USCIS accepts case inquiries at Miami for N-400 receipts dated on or before ${o.n400Inquiry} and for family I-485 receipts on or before ${o.i485Inquiry}. Every figure on this page is from the USCIS publication of ${pub}.`,
    faqs: [
      { q: `How long does the N-400 take at USCIS Miami?`, a: `USCIS publishes ${o.n400Range} for naturalization at the Miami field office. Hialeah and Kendall, which also serve Miami-Dade addresses, publish ${hia.n400Range} and ${knd.n400Range}. The office on your notice depends on your address, not on where the form was mailed. The checker on this page applies these same figures to the receipt date on your own notice.` },
      { q: `Which South Florida office is slowest for a family green card?`, a: `On the latest figures for family-based Form I-485, Miami publishes ${o.i485Range}, Hialeah ${hia.i485Range}, Kendall ${knd.i485Range} and Oakland Park ${okl.i485Range}. Compare the upper bounds: they are the 80% marks. The ranking can change from one monthly update to the next.` },
      { q: `Does a Cuban Adjustment Act case follow the Miami family I-485 time?`, a: `Not necessarily. USCIS reports Cuban adjustment cases as a separate line in its national statistics, with its own average processing time, and the field office ranges on this page are for family-based adjustment. Check the category printed on your receipt notice before comparing. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
    ],
    body: (h) => `<h2>The Miami series since 2022</h2>
<p>Our first record, from ${o.firstDate}, shows ${o.n400FirstRange} for naturalization at Miami and ${o.i485FirstRange} for family adjustment. Today the upper bounds are ${fm(o.n400.max)} and ${fm(o.i485.max)} months, a change of ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months. The family queue is where Miami has lost the most ground, and it now ranks ${o.i485Rank} of ${OFFICE_COUNT} for it.</p>
<h2>Why four nearby offices differ</h2>
<p>Each field office has its own staff, interview rooms and mix of cases. A family-based case can also be held while a visa number is not available, and that weighs more where many applicants are in preference categories. The published ranges reflect all of this without explaining it, so the safest comparison is always the office that actually holds your file.</p>
<h2>What to do with the number</h2>
<p>Enter the receipt date from your notice in the checker above. If you are past the upper figure and on or before the inquiry date, USCIS will accept a case inquiry. If your green card depends on a priority date, check its status in the Visa Bulletin too: an interview cannot end in approval before the date is current.</p>
`,
  },
});
