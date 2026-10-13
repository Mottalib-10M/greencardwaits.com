import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('ORL');
const tam = officeFacts('TAM');
const jac = officeFacts('JAC');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-orlando', group: 'office', order: 561, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "ORL"},
  data: {"office": "ORL"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/orlando',
    nav: `Orlando field office`, card: `USCIS Orlando: a slow citizenship line by national standards and a mid-table family green card queue.`,
    title: `USCIS Orlando Processing Times 2026: N-400 and I-485`,
    description: `USCIS Orlando field office: N-400 and family I-485 times, compared with Tampa and Jacksonville, rank among 90 offices and the case inquiry cut-off dates.`,
    h1: `Orlando field office: Central Florida’s USCIS times`,
    intro: `Orlando serves Central Florida; its naturalization queue is now one of the slower ones nationally, which surprises many applicants.`,
    resume: `Central Florida applicants file with the Orlando field office, which USCIS currently lists at ${o.n400Range} for Form N-400, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}. That puts Orlando in the slowest fifth of offices for naturalization but around the middle for family adjustment. The two other offices along the I-4 corridor and the northeast coast are Tampa, at ${tam.n400Range} for the N-400 and ${tam.i485Range} for the family I-485, and Jacksonville, at ${jac.n400Range} and ${jac.i485Range}. In our first record, from ${o.firstDate}, Orlando published ${o.n400FirstRange} for citizenship and ${o.i485FirstRange} for family adjustment. USCIS accepts Orlando inquiries for N-400 receipts on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}, per its publication of ${pub}.`,
    faqs: [
      { q: `How long is the N-400 wait at USCIS Orlando?`, a: `USCIS publishes ${o.n400Range} for naturalization at Orlando, measured from the receipt date to a decision. Orlando ranks ${o.n400Rank} of ${OFFICE_COUNT}, in the slower part of the list. The upper figure is the time within which 80% of cases finish. If the case has been transferred, the receiving office’s range is the one to use from then on.` },
      { q: `Is Tampa faster than Orlando for a marriage green card?`, a: `For family-based Form I-485, Tampa publishes ${tam.i485Range} and Orlando ${o.i485Range}. Spouses of U.S. citizens are immediate relatives, so this office queue is the main wait for them after filing inside the United States. The checker on this page applies these same figures to the receipt date on your own notice.` },
      { q: `Has the Orlando naturalization queue grown since 2022?`, a: `At the upper bound, the change since our first 2022 record is ${sgn(o.n400Change)} months: from ${o.n400FirstRange} to ${o.n400Range}. The table on this page lists the last publication of each year so you can follow the trend. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
    ],
    body: (h) => `<h2>Central Florida in the ranking</h2>
<p>Florida has more USCIS field offices than most states, and they sit all over the ranking. For naturalization Orlando is at rank ${o.n400Rank}, Tampa at ${tam.n400Rank} and Jacksonville at ${jac.n400Rank}. For the family green card the order is Tampa, then Jacksonville and Orlando close together.</p>
<h2>What a range does not show</h2>
<p>The published figures cover completed cases. They do not tell you how many files are waiting, or how long a rescheduled interview adds. A family case can also be held after the interview if the applicant’s preference category is not current in the Visa Bulletin.</p>
<h2>Next step</h2>
<p>Use the checker above with your receipt date and the Orlando office selected. It shows the months elapsed, the published range and whether the inquiry window is open.</p>
<h2>Jacksonville and north Florida</h2>
<p>Jacksonville, which serves the northeast of the state, publishes ${jac.n400Range} for naturalization and ${jac.i485Range} for the family green card, close to Orlando on both counts. Together with Fort Myers, these offices sit in the slower part of the national list for citizenship, while South Florida’s Hialeah and Kendall are among the quicker ones. A move from Orlando to Miami-Dade can therefore change the clock on a naturalization case.</p>`,
  },
});
