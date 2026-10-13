import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('HOU');
const dal = officeFacts('DAL');
const sna = officeFacts('SNA');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-houston', group: 'office', order: 552, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "HOU"},
  data: {"office": "HOU"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/houston',
    nav: `Houston field office`, card: `N-400 and family I-485 times at USCIS Houston, its rank among 90 offices and four years of history.`,
    title: `N-400 Processing Time Houston 2026: USCIS Field Office`,
    description: `USCIS Houston field office: N-400 and family I-485 processing times as published, rank among 90 offices, inquiry dates and the trend since March 2022.`,
    h1: `USCIS Houston: naturalization and green card interview times`,
    intro: `Houston handles naturalization and family green card interviews for much of southeast Texas; here is what USCIS publishes for it and how that compares with Dallas and San Antonio.`,
    resume: `Houston is one of the busiest USCIS field offices in the country, and its two main queues tell different stories. Naturalization moves comparatively well: USCIS publishes a range of ${o.n400Range} for Form N-400 at Houston, which ranks it ${o.n400Rank} out of ${OFFICE_COUNT} offices, from fastest to slowest. Family-based adjustment of status is slower: the published range for Form I-485 is ${o.i485Range}, rank ${o.i485Rank}. The upper figure is the time within which USCIS says it completes 80% of cases, so a file older than that is outside normal processing time and USCIS will accept a case inquiry. For Houston, inquiries are accepted for N-400 receipts dated on or before ${o.n400Inquiry} and for family I-485 receipts on or before ${o.i485Inquiry}. These figures come from the USCIS publication of ${pub} and are refreshed when USCIS updates them, usually once a month.`,
    faqs: [
      { q: `How long does the N-400 take at the Houston field office?`, a: `USCIS currently publishes ${o.n400Range} for naturalization at Houston, measured from the receipt date on your I-797C notice to a decision. The lower figure is the median; the upper one is the time within which 80% of cases finish. If your case is older than the upper figure, you can submit a case inquiry to USCIS.` },
      { q: `Is Houston faster than Dallas for a family green card interview?`, a: `For family-based Form I-485, Houston publishes ${o.i485Range} and Dallas ${dal.i485Range}. You do not choose your office: USCIS assigns it from your home address, so moving within Texas only changes the office if your new county belongs to another field office’s area. The comparison is useful mainly to understand whether a delay is local.` },
      { q: `Why do Houston’s N-400 and I-485 times differ so much?`, a: `Both are decided at the same building, but they are different queues with different volumes and different steps. A family green card case often waits on a visa number, background checks and an interview with both spouses, while most naturalization cases need one interview and the civics test. The published ranges reflect those differences rather than one overall speed.` },
    ],
    body: (h) => `<h2>Houston against the rest of Texas</h2>
<p>Texas has several field offices, and USCIS sends each applicant to the one that covers their county. On the latest publication, Houston’s naturalization range is ${o.n400Range}; Dallas shows ${dal.n400Range} and San Antonio ${sna.n400Range}. For the family green card, the order changes: Houston at ${o.i485Range}, Dallas at ${dal.i485Range}, San Antonio at ${sna.i485Range}. In other words, Houston is among the quicker offices for citizenship and in the slower half for family adjustment.</p>
<h2>What changed since 2022</h2>
<p>The series we keep starts on ${o.firstDate}. At that point USCIS published ${o.n400FirstRange} for the N-400 in Houston and ${o.i485FirstRange} for the family I-485. The upper bound for naturalization has moved by ${sgn(o.n400Change)} months since then, and the one for family adjustment by ${sgn(o.i485Change)} months. A positive figure means the office has become slower at the 80% mark.</p>
<h2>Using these numbers on your own case</h2>
<p>Take the receipt date printed on your Form I-797C, not the date you mailed the package. Put it in the checker above with Houston selected: it shows how many months have passed and whether USCIS would already accept an inquiry. If your green card case is family-based and your priority date is not yet current, the interview cannot lead to approval anyway, which is why the Visa Bulletin status matters as much as the office.</p>
`,
  },
});
