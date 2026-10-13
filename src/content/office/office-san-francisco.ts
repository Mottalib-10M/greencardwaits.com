import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('SFR');
const snj = officeFacts('SNJ');
const sac = officeFacts('SAC');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-san-francisco', group: 'office', order: 556, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "SFR"},
  data: {"office": "SFR"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/san-francisco',
    nav: `San Francisco field office`, card: `USCIS San Francisco: near the bottom of the national ranking for both citizenship and family green cards.`,
    title: `N-400 Processing Time San Francisco 2026: USCIS Office`,
    description: `USCIS San Francisco field office: N-400 and family I-485 processing times, the Bay Area compared with San Jose and Sacramento, and the case inquiry cut-offs.`,
    h1: `San Francisco field office: among the longest waits in the country`,
    intro: `Bay Area applicants face some of the longest USCIS field office queues in the country, and San Francisco is no exception.`,
    resume: `San Francisco is near the bottom of the national ranking on both counts. USCIS publishes ${o.n400Range} for Form N-400 at the San Francisco field office, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}. Its Northern California neighbors are not faster: San Jose, which ranks last of all offices for naturalization, publishes ${snj.n400Range} for the N-400 and ${snj.i485Range} for the family I-485, and Sacramento ${sac.n400Range} and ${sac.i485Range}. For an applicant, the practical consequence is that the inquiry window opens late. USCIS accepts San Francisco inquiries only for N-400 receipts dated on or before ${o.n400Inquiry}, and for family I-485 receipts on or before ${o.i485Inquiry}. Figures from the USCIS publication of ${pub}; the upper number in each range is the time within which USCIS completes 80% of cases.`,
    faqs: [
      { q: `What is the San Francisco N-400 processing time now?`, a: `USCIS publishes ${o.n400Range} at the San Francisco field office, counted from the receipt date. That places it among the slowest few offices for naturalization. The range does not include the oath ceremony, which is scheduled after approval. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
      { q: `Are San Jose and Sacramento faster than San Francisco for a green card?`, a: `Not on current figures. For family-based Form I-485, San Francisco publishes ${o.i485Range}, San Jose ${snj.i485Range} and Sacramento ${sac.i485Range}. Northern California as a whole sits low in the ranking, so moving within the region is unlikely to shorten a wait. These are office-wide figures; your own case can finish earlier or later than both numbers.` },
      { q: `When can I contact USCIS about a slow San Francisco case?`, a: `When your receipt date is on or before the inquiry date USCIS publishes for the office: ${o.n400Inquiry} for naturalization and ${o.i485Inquiry} for family adjustment at San Francisco. Before that, USCIS considers the case within normal processing time. USCIS updates the figures roughly once a month, so check the date of the publication before relying on them.` },
    ],
    body: (h) => `<h2>Two long queues</h2>
<p>At San Francisco the naturalization upper bound is ${fm(o.n400.max)} months and the family green card upper bound ${fm(o.i485.max)}. In early 2022 the same office published ${o.n400FirstRange} and ${o.i485FirstRange}. Both queues have lengthened since, by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months at the 80% mark.</p>
<h2>The Bay Area picture</h2>
<p>San Jose ranks ${snj.n400Rank} of ${OFFICE_COUNT} for naturalization and ${snj.i485Rank} for family adjustment; Sacramento ranks ${sac.n400Rank} and ${sac.i485Rank}. All three Northern California offices sit in the slowest quarter for at least one queue.</p>
<h2>What you can check</h2>
<p>Enter your receipt date in the checker above to see the months elapsed against the published range. If the green card depends on a priority date, the Visa Bulletin also sets a floor: the case cannot be approved before the date is current, whatever the office speed.</p>
<h2>The interview and the oath</h2>
<p>A naturalization case at San Francisco usually ends with an interview, the English and civics tests, and a decision. If USCIS approves, the oath ceremony is scheduled afterwards and is not part of the published range. In some offices the oath happens on the same day; in others it comes weeks later. The range on this page stops at the decision, so plan for the ceremony on top of it if you need a passport for a fixed date.</p>`,
  },
});
