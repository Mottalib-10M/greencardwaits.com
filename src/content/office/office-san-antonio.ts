import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('SNA');
const hlg = officeFacts('HLG');
const elp = officeFacts('ELP');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-san-antonio', group: 'office', order: 562, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "SNA"},
  data: {"office": "SNA"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/san-antonio',
    nav: `San Antonio field office`, card: `USCIS San Antonio: fast for citizenship and family green cards, and how it compares with Harlingen and El Paso.`,
    title: `N-400 Processing Time San Antonio 2026: USCIS Office`,
    description: `USCIS San Antonio field office: N-400 and family I-485 processing times, Harlingen and El Paso compared, rank among 90 offices and inquiry cut-off dates.`,
    h1: `San Antonio field office: one of Texas’s quicker queues`,
    intro: `South and West Texas are served by San Antonio, Harlingen and El Paso; all three publish family green card times in the faster part of the country.`,
    resume: `San Antonio is quick on both counts. USCIS publishes ${o.n400Range} for Form N-400 at the San Antonio field office, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}. The two border offices that serve the Rio Grande Valley and far West Texas are also in the faster half for the family green card: Harlingen publishes ${hlg.i485Range} and El Paso ${elp.i485Range}. For naturalization, Harlingen shows ${hlg.n400Range} and El Paso ${elp.n400Range}. In our first 2022 record San Antonio published ${o.n400FirstRange} for citizenship and ${o.i485FirstRange} for family adjustment, so the upper bounds have moved by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months. USCIS accepts San Antonio inquiries for N-400 receipts on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}, per its publication of ${pub}.`,
    faqs: [
      { q: `How long does the N-400 take at USCIS San Antonio?`, a: `USCIS publishes ${o.n400Range} for naturalization at San Antonio, counted from the receipt date. That makes it one of the faster offices in the country, rank ${o.n400Rank} of ${OFFICE_COUNT}. The oath ceremony comes after approval and is not included. If the case has been transferred, the receiving office’s range is the one to use from then on.` },
      { q: `Which South Texas office is fastest for a family green card?`, a: `On the latest figures for family-based Form I-485, Harlingen publishes ${hlg.i485Range}, El Paso ${elp.i485Range} and San Antonio ${o.i485Range}. All three rank in the faster quarter or close to it. Your address decides which office holds the file. The checker on this page applies these same figures to the receipt date on your own notice.` },
      { q: `Do Mexican-born family applicants wait longer at San Antonio?`, a: `Not at the office itself: the San Antonio range applies to every family-based adjustment case it completes. The long waits for many Mexican-born applicants come earlier, from the Visa Bulletin, where Mexico has its own and much older cutoff dates in several family categories. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
    ],
    body: (h) => `<h2>Fast, with a short spread</h2>
<p>San Antonio’s naturalization range spans only ${fm((o.n400.max ?? 0) - (o.n400.min ?? 0))} months between median and 80% mark. Its family adjustment range is wider, ${fm((o.i485.max ?? 0) - (o.i485.min ?? 0))} months, partly because family cases can be held for a visa number.</p>
<h2>The Visa Bulletin is the longer wait</h2>
<p>For families with relatives born in Mexico, the office queue is often the short part of the journey. F3 and F4 Mexico cutoffs in the Visa Bulletin are more than two decades old; ${h.a('visa-bulletin', 'the Visa Bulletin page')} shows where each family category stands this month.</p>
<h2>Check your case</h2>
<p>Enter your receipt date in the checker above to see how many months have passed and whether USCIS would accept an inquiry today.</p>
<h2>Austin and the Hill Country</h2>
<p>San Antonio’s figures are worth reading against the size of Texas: several large field offices share the state, and San Antonio is among the quickest of them. For naturalization, its rank of ${o.n400Rank} makes it one of the fastest large offices in the country, ahead of Houston and Dallas. Harlingen and El Paso, which handle border counties, are quicker than San Antonio for the family green card but slower for citizenship.</p>`,
  },
});
