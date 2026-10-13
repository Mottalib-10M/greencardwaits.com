import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('WAS');
const bal = officeFacts('BAL');
const nor = officeFacts('NOR');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-washington-dc', group: 'office', order: 564, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "WAS"},
  data: {"office": "WAS"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/washington-dc',
    nav: `Washington, DC field office`, card: `USCIS Washington field office: a quick family green card queue compared with Baltimore and Norfolk.`,
    title: `USCIS Washington DC Processing Times 2026: N-400, I-485`,
    description: `USCIS Washington field office: N-400 and family I-485 times, compared with Baltimore and Norfolk, rank among 90 offices, and case inquiry cut-off dates.`,
    h1: `Washington field office: times for the capital region`,
    intro: `USCIS lists a Washington field office that serves much of the capital region; its family green card queue is among the shorter ones in the country.`,
    resume: `The USCIS Washington field office publishes ${o.n400Range} for Form N-400, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}, which puts its family green card queue in the fastest fifth of the country. Its neighbors in the Mid-Atlantic are slower for the family green card: Baltimore publishes ${bal.i485Range} and Norfolk ${nor.i485Range}. For naturalization, Baltimore is among the slowest offices at ${bal.n400Range}, while Norfolk is quick at ${nor.n400Range}. In our first record, from ${o.firstDate}, the Washington office published ${o.n400FirstRange} for the N-400 and ${o.i485FirstRange} for family adjustment; the upper bounds have since moved by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months. USCIS accepts case inquiries for Washington N-400 receipts dated on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}, per its publication of ${pub}.`,
    faqs: [
      { q: `How long is the N-400 at the USCIS Washington field office?`, a: `USCIS publishes ${o.n400Range} for naturalization at the Washington field office, from the receipt date on Form I-797C. It ranks ${o.n400Rank} of ${OFFICE_COUNT}. The decision often comes at the interview; the oath may be the same day or later. The interview notice, not the city you live in, tells you which office’s figures apply to you.` },
      { q: `Is Baltimore or Washington faster for a family green card?`, a: `Washington, on current figures: ${o.i485Range} for family-based Form I-485 against ${bal.i485Range} at Baltimore. Maryland and Virginia addresses are split between offices by county, so check the office named on your notice. If the case has been transferred, the receiving office’s range is the one to use from then on.` },
      { q: `Has the Washington family green card queue shortened since 2022?`, a: `At the upper bound, the change since our first record is ${sgn(o.i485Change)} months: USCIS published ${o.i485FirstRange} then and ${o.i485Range} now. The table on this page shows one figure per year. The checker on this page applies these same figures to the receipt date on your own notice.` },
    ],
    body: (h) => `<h2>A short family queue</h2>
<p>Rank ${o.i485Rank} of ${OFFICE_COUNT} for family adjustment means the Washington office completes 80% of these cases within ${fm(o.i485.max)} months, compared with ${fm(bal.i485.max)} at Baltimore and ${fm(nor.i485.max)} at Norfolk.</p>
<h2>Baltimore and Norfolk</h2>
<p>The three offices do not rank in the same order for the two forms. Norfolk is one of the quicker offices for naturalization and one of the slower ones for family adjustment; Baltimore is slow for naturalization and middling for family cases.</p>
<h2>Checking your date</h2>
<p>Put your receipt date in the checker above. If your green card is in a preference category, the Visa Bulletin also has to show your priority date as current before USCIS can approve.</p>
<h2>Maryland and Virginia addresses</h2>
<p>The capital region is served by several offices, and USCIS assigns each address to one of them. Washington, Baltimore and Norfolk publish very different figures, so neighbors on two sides of a county line can wait for different lengths of time. Naturalization at Norfolk ranks ${nor.n400Rank} of ${OFFICE_COUNT}, while Baltimore ranks ${bal.n400Rank}. Check the office on your notice before comparing with a neighbor’s timeline, and remember that a move across the line can transfer the file.</p>`,
  },
});
