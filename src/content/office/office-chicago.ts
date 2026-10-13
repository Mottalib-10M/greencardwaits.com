import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('CHI');
const mil = officeFacts('MIL');
const inp = officeFacts('INP');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-chicago', group: 'office', order: 553, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "CHI"},
  data: {"office": "CHI"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/chicago',
    nav: `Chicago field office`, card: `USCIS Chicago: one of the slower offices for both citizenship and family green cards, and how the series changed.`,
    title: `USCIS Chicago Processing Times 2026: N-400 and I-485`,
    description: `USCIS Chicago field office: N-400 and family I-485 processing times, rank among 90 offices, inquiry dates, and how both queues have lengthened since early 2022.`,
    h1: `Chicago field office: a slower year for both queues`,
    intro: `Chicago serves most of northern Illinois; its published times are now in the slowest fifth of the country for naturalization and for family green cards alike.`,
    resume: `Chicago is a case where both main queues have lengthened. USCIS now publishes ${o.n400Range} for Form N-400 at the Chicago field office, which ranks ${o.n400Rank} out of ${OFFICE_COUNT} from fastest to slowest, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}. When our series begins in early 2022, the same office published ${o.n400FirstRange} for naturalization and ${o.i485FirstRange} for family adjustment, so the upper bounds have grown by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months. Nearby offices in the Midwest publish shorter ranges: Milwaukee shows ${mil.n400Range} for the N-400 and Indianapolis ${inp.n400Range}, but USCIS assigns the office by address, not by preference. Case inquiries are accepted at Chicago for N-400 receipts on or before ${o.n400Inquiry} and for family I-485 receipts on or before ${o.i485Inquiry}, per the USCIS publication of ${pub}.`,
    faqs: [
      { q: `How long does naturalization take at USCIS Chicago right now?`, a: `USCIS publishes ${o.n400Range} for Form N-400 at Chicago. That is measured from the receipt date to a decision, and the upper figure is the time within which 80% of cases finish. Chicago currently sits in the slower part of the national ranking. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
      { q: `Has the Chicago family green card queue really doubled since 2022?`, a: `Compare the figures yourself: in our first record USCIS published ${o.i485FirstRange} for family-based I-485 at Chicago, and the latest publication shows ${o.i485Range}. The change in the upper bound is ${sgn(o.i485Change)} months. The table on this page lists the last publication of each year.` },
      { q: `Can I move my case from Chicago to a faster USCIS office?`, a: `No request lets you pick an office. USCIS sends the file to the office covering your home address. A real move to another area can transfer the case, but transfers take time of their own, and you must report the new address with Form AR-11 within 10 days.` },
    ],
    body: (h) => `<h2>A slower office on both counts</h2>
<p>Many offices are quick at one thing and slow at another. Chicago is currently slow at both: rank ${o.n400Rank} for citizenship and rank ${o.i485Rank} for family adjustment. The family green card range is ${fm(o.gap)} months longer than the naturalization range at the upper bound.</p>
<h2>What the published range means</h2>
<p>USCIS gives two numbers. The first is the median: half of recent cases were completed in that time or less. The second is the 80% mark. A Chicago naturalization filed today would, on current figures, be decided within ${fm(o.n400.max)} months in four cases out of five. Nobody can promise where a given file falls in that range.</p>
<h2>Checking your case</h2>
<p>Use the receipt date from your Form I-797C in the checker above. If the date is on or before the inquiry date USCIS publishes for Chicago, you can submit an outside-normal-processing-time request online. Before that point, USCIS will usually answer that the case is within normal time.</p>
<h2>Illinois and its neighbors</h2>
<p>Chicago is the only USCIS field office in Illinois, so there is no nearby alternative within the state. Applicants who live across a state line belong to another office: Milwaukee, at rank ${mil.n400Rank} for naturalization, or Indianapolis, at rank ${inp.n400Rank}. If you moved after filing, your file may have been transferred; the office named on your most recent notice is the one whose range applies, and transfers can add weeks while the file travels.</p>`,
  },
});
