import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('SND');
const imp = officeFacts('IMP');
const saa = officeFacts('SAA');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-san-diego', group: 'office', order: 567, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "SND"},
  data: {"office": "SND"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/san-diego',
    nav: `San Diego field office`, card: `USCIS San Diego: one of the slowest naturalization offices, with a family green card median shorter than the citizenship one.`,
    title: `N-400 Processing Time San Diego 2026: USCIS Field Data`,
    description: `USCIS San Diego field office: N-400 and family I-485 processing times, the Imperial and Santa Ana offices compared, rank among 90 offices, inquiry cut-offs.`,
    h1: `San Diego field office: a slow citizenship line`,
    intro: `San Diego is one of the few large offices where the typical naturalization case now takes longer than the typical family green card case.`,
    resume: `San Diego partly reverses the usual pattern. USCIS publishes ${o.n400Range} for Form N-400 at the San Diego field office, rank ${o.n400Rank} of ${OFFICE_COUNT}, one of the slowest in the country, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}. The median, the first figure of each range, is shorter for the family green card than for naturalization, which is rare; at the 80% mark the family queue is still the longer one. In our first record, from ${o.firstDate}, naturalization stood at ${o.n400FirstRange}, so its upper bound has moved by ${sgn(o.n400Change)} months, against ${sgn(o.i485Change)} for the family queue. Imperial, which serves the Imperial Valley along the border, publishes ${imp.n400Range} for the N-400 and ${imp.i485Range} for the family I-485; Santa Ana, in Orange County, ${saa.n400Range} and ${saa.i485Range}. USCIS accepts San Diego inquiries for N-400 receipts dated on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}. Source: USCIS publication of ${pub}.`,
    faqs: [
      { q: `How long does citizenship take at USCIS San Diego?`, a: `USCIS publishes ${o.n400Range} for naturalization at San Diego, counted from the receipt date. That ranks ${o.n400Rank} of ${OFFICE_COUNT}, among the slowest few. The upper figure is the time within which 80% of cases are completed. The checker on this page applies these same figures to the receipt date on your own notice.` },
      { q: `Is a family green card quicker than the N-400 at San Diego?`, a: `For a typical case, yes: the median for family-based Form I-485, the first figure of ${o.i485Range}, is shorter than the naturalization median in ${o.n400Range}. The slowest family cases still take longer, since the 80% mark is higher for the green card than for citizenship.` },
      { q: `Which office handles Imperial County USCIS cases?`, a: `USCIS lists a separate Imperial, California, field office, which publishes ${imp.n400Range} for Form N-400 and ${imp.i485Range} for family-based Form I-485. Your interview notice names the office that has your file. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
    ],
    body: (h) => `<h2>Median against 80% mark</h2>
<p>The two numbers USCIS publishes answer different questions. The median says how long a typical case takes: ${fm(o.n400.min)} months for naturalization at San Diego and ${fm(o.i485.min)} for the family green card. The 80% mark says how long the slow cases take: ${fm(o.n400.max)} and ${fm(o.i485.max)} months. At San Diego the family queue has the shorter median and the longer tail.</p>
<h2>Southern California beyond Los Angeles</h2>
<p>Imperial ranks ${imp.n400Rank} for naturalization and ${imp.i485Rank} for family adjustment; Santa Ana ranks ${saa.n400Rank} and ${saa.i485Rank}. None of the three southern offices is quick for every form.</p>
<h2>Your case</h2>
<p>Enter your receipt date in the checker above to see the months elapsed and whether the inquiry window has opened.</p>
<h2>A border region office</h2>
<p>San Diego handles many family cases involving relatives from Mexico, and the Visa Bulletin often weighs more than the office for them: F3 and F4 Mexico cutoffs are among the oldest in the bulletin. For citizenship, on the other hand, the office queue is the whole wait, and at rank ${o.n400Rank} of ${OFFICE_COUNT} it is long. Imperial, nearby, is quicker for naturalization but slower for the family green card at the 80% mark.</p>`,
  },
});
