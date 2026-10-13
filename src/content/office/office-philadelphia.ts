import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('PHI');
const pit = officeFacts('PIT');
const mtl = officeFacts('MTL');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-philadelphia', group: 'office', order: 569, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "PHI"},
  data: {"office": "PHI"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/philadelphia',
    nav: `Philadelphia field office`, card: `USCIS Philadelphia: middle of the national list for both queues, with Pittsburgh and Mount Laurel compared.`,
    title: `N-400 Processing Time Philadelphia 2026: USCIS Office`,
    description: `USCIS Philadelphia field office: N-400 and family I-485 processing times, Pittsburgh and Mount Laurel compared, four years of data and inquiry cut-offs.`,
    h1: `Philadelphia field office: Pennsylvania’s eastern queue`,
    intro: `Pennsylvania has two USCIS field offices, Philadelphia and Pittsburgh, and Philadelphia sits close to New Jersey’s Mount Laurel office.`,
    resume: `Philadelphia sits close to the middle of the national ranking for both main forms. USCIS publishes ${o.n400Range} for Form N-400 at the Philadelphia field office, rank ${o.n400Rank} of ${OFFICE_COUNT}, and ${o.i485Range} for family-based Form I-485, rank ${o.i485Rank}. Pittsburgh, which serves western Pennsylvania, publishes ${pit.n400Range} for naturalization and ${pit.i485Range} for the family I-485, both slightly quicker. Across the river, Mount Laurel, New Jersey, shows ${mtl.n400Range} and ${mtl.i485Range}. In our first record, from ${o.firstDate}, Philadelphia published ${o.n400FirstRange} for citizenship and ${o.i485FirstRange} for family adjustment, so the upper bounds have moved by ${sgn(o.n400Change)} and ${sgn(o.i485Change)} months. USCIS accepts Philadelphia case inquiries for N-400 receipts dated on or before ${o.n400Inquiry} and family I-485 receipts on or before ${o.i485Inquiry}, according to its publication of ${pub}.`,
    faqs: [
      { q: `How long does naturalization take at USCIS Philadelphia?`, a: `USCIS publishes ${o.n400Range} for Form N-400 at the Philadelphia field office, counted from the receipt date. It ranks ${o.n400Rank} of ${OFFICE_COUNT}. The upper figure is the 80% mark: four cases in five finish within it. If the case has been transferred, the receiving office’s range is the one to use from then on.` },
      { q: `Is Pittsburgh faster than Philadelphia for a green card?`, a: `Slightly, on the latest figures: Pittsburgh publishes ${pit.i485Range} for family-based Form I-485 and Philadelphia ${o.i485Range}. The office is chosen by USCIS from your county of residence. The checker on this page applies these same figures to the receipt date on your own notice.` },
      { q: `What changed at USCIS Philadelphia since 2022?`, a: `At the upper bound, the naturalization queue has moved by ${sgn(o.n400Change)} months and the family green card queue by ${sgn(o.i485Change)} months since our first record. The yearly table on this page shows the path in between. A request for evidence, a rescheduled appointment or a file transfer adds time that no published range includes.` },
    ],
    body: (h) => `<h2>A middle-of-the-list office</h2>
<p>Ranks of ${o.n400Rank} and ${o.i485Rank} out of ${OFFICE_COUNT} put Philadelphia near the national median for both queues. The difference between its two upper bounds is ${fm(o.gap)} months, close to the typical gap between citizenship and a family green card.</p>
<h2>Pittsburgh and Mount Laurel</h2>
<p>Pittsburgh ranks ${pit.n400Rank} for naturalization and ${pit.i485Rank} for family adjustment; Mount Laurel ${mtl.n400Rank} and ${mtl.i485Rank}. For people on the New Jersey side of the Delaware, Mount Laurel is the relevant office.</p>
<h2>Your next check</h2>
<p>Enter your receipt date in the checker above to see how far your case is into the Philadelphia range, and whether the inquiry window is open.</p>
<h2>Eastern Pennsylvania and Delaware</h2>
<p>Pennsylvania has two field offices, Philadelphia and Pittsburgh, and the published range applies to every family-based adjustment and naturalization case each one completes. Pittsburgh is slightly quicker on both forms. Families comparing timelines across the region should compare the office printed on the notice, not the city they live closest to, since USCIS decides the assignment from the address. Mount Laurel, across the Delaware in New Jersey, is a third reference point, with naturalization at ${mtl.n400Range}.</p>`,
  },
});
