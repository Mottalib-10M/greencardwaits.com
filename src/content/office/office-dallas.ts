import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('DAL');
const hou = officeFacts('HOU');
const okc = officeFacts('OKC');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-dallas', group: 'office', order: 558, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "DAL"},
  data: {"office": "DAL"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/dallas',
    nav: `Dallas field office`, card: `USCIS Dallas: a faster family green card queue than Houston, and a middling citizenship line.`,
    title: `N-400 Processing Time Dallas 2026: USCIS Field Office`,
    description: `USCIS Dallas field office: N-400 and family I-485 processing times, the comparison with Houston and Oklahoma City, inquiry cut-offs and four years of data.`,
    h1: `Dallas field office: North Texas times at a glance`,
    intro: `Dallas serves the Dallas–Fort Worth area and much of North Texas; its family green card queue is currently one of the shorter ones in the state.`,
    resume: `USCIS publishes ${o.i485Range} for family-based adjustment of status at the Dallas field office, rank ${o.i485Rank} of ${OFFICE_COUNT}, which makes it noticeably faster for the family green card than Houston at ${hou.i485Range}. For naturalization, Dallas publishes ${o.n400Range}, rank ${o.n400Rank}, slightly behind Houston’s ${hou.n400Range}. North of the Red River, Oklahoma City shows ${okc.n400Range} for the N-400 and ${okc.i485Range} for the family I-485. These are the ranges USCIS itself publishes: the lower number is the median, the upper one the time within which 80% of cases are completed. Dallas accepts case inquiries for N-400 receipts dated on or before ${o.n400Inquiry} and for family I-485 receipts on or before ${o.i485Inquiry}. All of this comes from the USCIS publication of ${pub}, which is updated about once a month.`,
    faqs: [
      { q: `How long is the Dallas USCIS wait for naturalization?`, a: `The Dallas field office publishes ${o.n400Range} for Form N-400, from receipt to decision. That places it ${o.n400Rank} of ${OFFICE_COUNT} offices. Fort Worth addresses are handled by Dallas as well, according to the office assigned on the notice. USCIS updates the figures roughly once a month, so check the date of the publication before relying on them.` },
      { q: `Is Dallas or Houston faster for a marriage green card interview?`, a: `For family-based Form I-485, Dallas publishes ${o.i485Range} and Houston ${hou.i485Range}. Spouses of U.S. citizens are immediate relatives with no Visa Bulletin wait, so the office queue is most of the time they spend waiting inside the United States. The interview notice, not the city you live in, tells you which office’s figures apply to you.` },
      { q: `What did USCIS Dallas publish in 2022?`, a: `In our first record, from ${o.firstDate}, USCIS published ${o.n400FirstRange} for naturalization at Dallas and ${o.i485FirstRange} for family adjustment. The upper bounds have moved by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months since. If the case has been transferred, the receiving office’s range is the one to use from then on.` },
    ],
    body: (h) => `<h2>Dallas and Houston, side by side</h2>
<p>The two largest Texas offices trade places depending on the form. For naturalization Houston is quicker, with an upper bound of ${fm(hou.n400.max)} months against ${fm(o.n400.max)} at Dallas. For family adjustment Dallas leads, at ${fm(o.i485.max)} months against ${fm(hou.i485.max)}. You cannot choose between them; the county of residence decides.</p>
<h2>What the ranks mean</h2>
<p>A rank of ${o.i485Rank} out of ${OFFICE_COUNT} for the family green card means that most offices in the country take longer. It does not mean a given case will be quick: requests for evidence, a second interview or a missing medical exam add months that no range includes.</p>
<h2>Using the checker</h2>
<p>Enter the receipt date printed on your I-797C notice above. The result tells you how long the case has been pending and whether the case inquiry window has opened at Dallas.</p>
<h2>Fort Worth, Arlington and the suburbs</h2>
<p>The Dallas office serves one of the largest metropolitan areas in the country, which makes its caseload heavy. Despite that, its family green card range is shorter than Houston’s. For naturalization, the two offices are close, and both are far quicker than the slowest offices in California, where the upper bound can pass two years.</p>`,
  },
});
