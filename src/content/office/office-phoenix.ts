import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('PHO');
const tuc = officeFacts('TUC');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-phoenix', group: 'office', order: 560, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "PHO"},
  data: {"office": "PHO"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/phoenix',
    nav: `Phoenix field office`, card: `USCIS Phoenix: one of the quickest citizenship lines in the country, with Tucson next door even faster for green cards.`,
    title: `N-400 Processing Time Phoenix 2026: USCIS Field Office`,
    description: `USCIS Phoenix field office: N-400 and family I-485 processing times, rank among 90 offices, the Tucson comparison, and the dates that open a case inquiry.`,
    h1: `Phoenix field office: a fast office by national standards`,
    intro: `Arizona has two USCIS field offices, Phoenix and Tucson, and both sit high in the national ranking for at least one queue.`,
    resume: `Phoenix is one of the faster USCIS field offices in the country for naturalization: USCIS publishes ${o.n400Range} for Form N-400 there, rank ${o.n400Rank} of ${OFFICE_COUNT}, and the range is unusually narrow, which means cases finish at similar speeds. For family-based Form I-485 it publishes ${o.i485Range}, rank ${o.i485Rank}, also in the faster quarter. Tucson, which serves southern Arizona, publishes ${tuc.n400Range} for the N-400 and only ${tuc.i485Range} for the family I-485, rank ${tuc.i485Rank} nationally. In our first 2022 record Phoenix published ${o.n400FirstRange} for naturalization and ${o.i485FirstRange} for family adjustment. USCIS accepts Phoenix inquiries for N-400 receipts dated on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}, according to its publication of ${pub}. The upper figure in each range is the 80% mark.`,
    faqs: [
      { q: `How long does naturalization take at USCIS Phoenix?`, a: `USCIS publishes ${o.n400Range} for Form N-400 at the Phoenix field office. The gap between the two figures is small, a sign that most cases finish close to the median. Phoenix ranks ${o.n400Rank} of ${OFFICE_COUNT} offices, counted from the fastest. The checker on this page applies these same figures to the receipt date on your own notice.` },
      { q: `Is Tucson faster than Phoenix for a family green card?`, a: `Yes on current figures: Tucson publishes ${tuc.i485Range} for family-based Form I-485, rank ${tuc.i485Rank}, and Phoenix ${o.i485Range}. The office is assigned by address; Tucson covers southern Arizona counties. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
      { q: `When can I ask USCIS Phoenix about a delayed N-400?`, a: `USCIS accepts case inquiries at Phoenix for naturalization receipts dated on or before ${o.n400Inquiry}. If your receipt date is later, the case is still within what USCIS calls normal processing time, and an inquiry would normally be answered with that statement. These are office-wide figures; your own case can finish earlier or later than both numbers.` },
    ],
    body: (h) => `<h2>A narrow range</h2>
<p>Most offices publish a wide spread between their median and their 80% mark. Phoenix’s naturalization spread is about ${fm((o.n400.max ?? 0) - (o.n400.min ?? 0))} month, so the published range is close to a real estimate for a typical file. The family green card spread is wider, at ${fm((o.i485.max ?? 0) - (o.i485.min ?? 0))} months.</p>
<h2>Since 2022</h2>
<p>The two Phoenix queues moved in opposite directions. At the upper bound, naturalization has changed by ${sgn(o.n400Change)} months since our first record, while family adjustment has changed by ${sgn(o.i485Change)} months: citizenship got quicker, the family green card slower.</p>
<h2>Checking your date</h2>
<p>Enter the receipt date from your I-797C notice in the checker above. If you belong to a family preference category, look at your priority date as well: USCIS cannot approve the green card before the Visa Bulletin shows your date as current, however quick the office is.</p>
<h2>Arizona’s second office</h2>
<p>Tucson is not only quick for families: at rank ${tuc.i485Rank}, it is among the very fastest offices in the country for family-based adjustment, and its naturalization range of ${tuc.n400Range} is close to Phoenix. USCIS assigns Arizona addresses to one of the two offices; the interview or biometrics notice names the one that holds your file, and that is the range to compare against.</p>`,
  },
});
