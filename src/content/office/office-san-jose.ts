import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('SNJ');
const sfr = officeFacts('SFR');
const sac = officeFacts('SAC');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-san-jose', group: 'office', order: 565, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "SNJ"},
  data: {"office": "SNJ"},
  related: ["n-400-processing-time", "office-san-francisco", "i-485-employment-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/san-jose',
    nav: `San Jose field office`, card: `USCIS San Jose: the slowest naturalization office in the country on current figures, and one of the slowest for green cards.`,
    title: `N-400 Processing Time San Jose 2026: USCIS Field Office`,
    description: `USCIS San Jose field office: the slowest N-400 queue among 90 offices, family I-485 times, the San Francisco and Sacramento comparison and case inquiry dates.`,
    h1: `San Jose field office: last in the naturalization ranking`,
    intro: `Silicon Valley’s USCIS field office has the longest published naturalization range of any field office in the latest data.`,
    resume: `On the latest USCIS publication, San Jose ranks ${o.n400Rank} of ${OFFICE_COUNT} field offices for naturalization, the slowest in the country. USCIS publishes ${o.n400Range} for Form N-400 there; the gap between the median and the 80% mark is unusually wide, which means some cases are decided far later than others. Family-based Form I-485 is published at ${o.i485Range}, rank ${o.i485Rank}. In our first record, from ${o.firstDate}, San Jose published ${o.n400FirstRange} for citizenship and ${o.i485FirstRange} for family adjustment, so the upper bounds have moved by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months. San Francisco publishes ${sfr.n400Range} for the N-400 and Sacramento ${sac.n400Range}. USCIS accepts San Jose case inquiries for N-400 receipts dated on or before ${o.n400Inquiry}, and family I-485 receipts on or before ${o.i485Inquiry}, according to its publication of ${pub}.`,
    faqs: [
      { q: `Why is the San Jose N-400 range so wide?`, a: `USCIS publishes ${o.n400Range} at San Jose. The lower number is the median and the upper number the 80% mark, so half of recent cases finished within the first figure while one in five took longer than the second. A wide spread usually means a backlog of older files being worked alongside new ones.` },
      { q: `How does San Jose compare with San Francisco for citizenship?`, a: `San Francisco publishes ${sfr.n400Range} for Form N-400, rank ${sfr.n400Rank}, and San Jose ${o.n400Range}, rank ${o.n400Rank}. Both are in the slowest handful of offices in the latest data, so Bay Area applicants generally face long naturalization waits. USCIS updates the figures roughly once a month, so check the date of the publication before relying on them.` },
      { q: `When does USCIS San Jose accept an inquiry about a naturalization case?`, a: `For Form N-400, when the receipt date is on or before ${o.n400Inquiry}, the date USCIS publishes for the office. A case filed after that date is still considered within normal processing time. The interview notice, not the city you live in, tells you which office’s figures apply to you.` },
    ],
    body: (h) => `<h2>The widest naturalization spread</h2>
<p>The difference between San Jose’s median and its 80% mark for the N-400 is ${fm((o.n400.max ?? 0) - (o.n400.min ?? 0))} months, the widest among the twenty largest offices. For comparison, Phoenix’s spread is about one month. A wide spread is a warning that the median may say little about an individual file.</p>
<h2>Family green cards at San Jose</h2>
<p>With an upper bound of ${fm(o.i485.max)} months, San Jose is also in the slowest group for family adjustment. Many applicants in the area are employment-based rather than family-based; their I-485 is handled by USCIS service centers, whose times are on the employment I-485 page.</p>
<h2>Using the checker</h2>
<p>Enter your receipt date above. The result shows the months elapsed and whether the inquiry cut-off for San Jose has been reached.</p>
<h2>Silicon Valley and the employment green card</h2>
<p>Many San Jose residents hold or seek an employment-based green card. USCIS publishes employment-based I-485 times under its service centers rather than by field office; those ranges are on the employment I-485 page of this site, and they also depend on the Visa Bulletin, where India and China wait far longer than other countries in EB-2 and EB-3. The field office figures here concern naturalization and family cases.</p>`,
  },
});
