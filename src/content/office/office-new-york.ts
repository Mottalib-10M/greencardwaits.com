import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('NYC');
const bny = officeFacts('BNY');
const qns = officeFacts('QNS');
const lny = officeFacts('LNY');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-new-york', group: 'office', order: 550, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "NYC"},
  data: {"office": "NYC"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/new-york',
    nav: `New York City field office`, card: `USCIS New York City: N-400 among the fastest, family I-485 much slower, with Brooklyn, Queens and Long Island side by side.`,
    title: `USCIS New York Processing Times 2026: N-400 and I-485`,
    description: `USCIS New York City field office times for the N-400 and family I-485, compared with Brooklyn, Queens and Long Island, with inquiry dates and the 2022 baseline.`,
    h1: `New York City field office: how long USCIS takes now`,
    intro: `Four USCIS field offices serve the New York area, and the one on your notice depends on where you live; this page covers the Manhattan-based New York City office.`,
    resume: `The New York City field office is one of the quicker places in the country to become a citizen and one of the slower ones for a family green card. USCIS publishes ${o.n400Range} for Form N-400 there, rank ${o.n400Rank} of ${OFFICE_COUNT} offices, while family-based Form I-485 sits at ${o.i485Range}, rank ${o.i485Rank}. New York residents are split between four offices: New York City, Brooklyn, Queens and Long Island, each with its own published times. Brooklyn shows ${bny.n400Range} for naturalization and ${bny.i485Range} for family adjustment; Queens ${qns.n400Range} and ${qns.i485Range}; Long Island ${lny.n400Range} and ${lny.i485Range}. USCIS accepts a case inquiry at New York City for N-400 receipts dated on or before ${o.n400Inquiry}, and for family I-485 receipts on or before ${o.i485Inquiry}. Source: USCIS publication of ${pub}.`,
    faqs: [
      { q: `How long is the N-400 wait at the New York City USCIS office?`, a: `USCIS publishes ${o.n400Range} for the New York City field office, counted from the receipt date on Form I-797C. That places it among the ten fastest of ${OFFICE_COUNT} field offices. The range covers the whole case, from biometrics to the decision after the interview; the oath ceremony can come later.` },
      { q: `Which New York office handles my case: Manhattan, Brooklyn, Queens or Long Island?`, a: `USCIS assigns the office from your residential address, by borough or county. The office name appears on your interview notice. If you move, update your address with USCIS within 10 days using Form AR-11 or your online account; a move across boroughs can transfer the file and reset part of the wait.` },
      { q: `Why does the family I-485 take longer than the N-400 in New York City?`, a: `The family green card queue at New York City is published at ${o.i485Range}, compared with ${o.n400Range} for naturalization. Family cases need an interview with the petitioner, review of the affidavit of support and often an available visa number, while naturalization is a single applicant with a test.` },
    ],
    body: (h) => `<h2>Four offices, four queues</h2>
<p>A family in the Bronx and a family in Flushing can file the same forms on the same day and be scheduled months apart, because they belong to different offices. On the latest figures the gap between the quickest and slowest of the four for family adjustment runs from ${minr([o, bny, qns, lny])} to ${maxr([o, bny, qns, lny])} months at the upper bound. For naturalization the spread is narrower.</p>
<h2>A moving target since 2022</h2>
<p>In the first figures of our series, from ${o.firstDate}, USCIS published ${o.n400FirstRange} for naturalization in New York City and ${o.i485FirstRange} for family adjustment. Since then the upper bound has changed by ${sgn(o.n400Change)} months for the N-400 and ${sgn(o.i485Change)} for the I-485.</p>
<h2>Reading your own position</h2>
<p>Enter the receipt date from your notice in the checker above. If more time has passed than the upper figure, USCIS treats the case as outside normal processing time; the inquiry date shown is the cut-off USCIS itself publishes. The checker does not see your file: a request for evidence or a rescheduled interview adds time that no published range includes.</p>
`,
  },
});
