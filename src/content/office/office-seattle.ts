import { definePage } from '../../lib/guide-types';
import { officeFacts, fm, OFFICE_COUNT, PUBLISHED_ON } from '../../lib/engine/office-facts';
import { displayDate } from '../../lib/format';

const o = officeFacts('SEA');
const poo = officeFacts('POO');
const spo = officeFacts('SPO');
const pub = displayDate(PUBLISHED_ON, 'en-US');
const sgn = (x: number) => (x > 0 ? `+${fm(x)}` : fm(x));
const minr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.min(...a.map((x) => x.i485.max ?? 0)));
const maxr = (a: Array<ReturnType<typeof officeFacts>>) => fm(Math.max(...a.map((x) => x.i485.max ?? 0)));
void sgn; void minr; void maxr;

export default definePage({
  id: 'office-seattle', group: 'office', order: 559, parent: 'processing-times',
  tool: {"kind": "ptime", "form": "n400", "office": "SEA"},
  data: {"office": "SEA"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "ar11"],
  en: {
    path: 'processing-times/office/seattle',
    nav: `Seattle field office`, card: `USCIS Seattle: an average citizenship queue and one of the very longest family green card queues.`,
    title: `USCIS Seattle Processing Times 2026: N-400 and I-485`,
    description: `USCIS Seattle field office: N-400 and family I-485 times, one of the longest family green card queues, compared with Portland and Spokane, plus inquiry dates.`,
    h1: `Seattle field office: a family green card queue near the top`,
    intro: `Seattle’s naturalization line is ordinary; its family green card line is one of the longest published for any field office.`,
    resume: `The Seattle field office shows the widest gap of any large office between its two main queues. USCIS publishes ${o.n400Range} for Form N-400 there, rank ${o.n400Rank} of ${OFFICE_COUNT}, close to the national middle. For family-based Form I-485 it publishes ${o.i485Range}, rank ${o.i485Rank}, among the longest in the country. In early 2022 the family range was ${o.i485FirstRange}, so the upper bound has moved by ${sgn(o.i485Change)} months; naturalization went the other way, from ${o.n400FirstRange} to the current figure. The receipt date that opens a case inquiry for family adjustment at Seattle is ${o.i485Inquiry}, years earlier than for most offices; for the N-400 it is ${o.n400Inquiry}. Elsewhere in the Northwest, Portland publishes ${poo.i485Range} for the family I-485 and Spokane ${spo.i485Range}. Source: USCIS publication of ${pub}.`,
    faqs: [
      { q: `Why is the family I-485 so slow at USCIS Seattle?`, a: `USCIS does not publish reasons office by office. What it publishes is the range: ${o.i485Range} for family-based adjustment at Seattle, against ${o.n400Range} for naturalization at the same office. A family case also needs a visa number when the applicant is in a preference category, which can hold the file regardless of staffing.` },
      { q: `How long does citizenship take at the Seattle field office?`, a: `USCIS publishes ${o.n400Range} for Form N-400 at Seattle. That is shorter than the ${o.n400FirstRange} published in our first 2022 record, a change of ${sgn(o.n400Change)} months at the upper bound. If the case has been transferred, the receiving office’s range is the one to use from then on.` },
      { q: `Is Portland faster than Seattle for a family green card?`, a: `On the latest figures, Portland, Oregon, publishes ${poo.i485Range} for family-based Form I-485 and Seattle ${o.i485Range}. USCIS assigns the office by address, and Washington residents in the east of the state are generally served from Spokane, which shows ${spo.i485Range}. The checker on this page applies these same figures to the receipt date on your own notice.` },
    ],
    body: (h) => `<h2>The widest gap among large offices</h2>
<p>At Seattle the family green card upper bound is ${fm(o.gap)} months longer than the naturalization one. Few offices come close. For a couple where one spouse is a green card holder and the other is waiting for adjustment, the two figures describe very different experiences of the same building.</p>
<h2>Four years of figures</h2>
<p>The table below lists the last USCIS publication of each year since 2022. The naturalization line has shortened at the upper bound, while family adjustment has lengthened.</p>
<h2>Your next step</h2>
<p>If your family I-485 receipt date is on or before ${o.i485Inquiry}, USCIS will accept a case inquiry for it. Enter your own date in the checker above to see where you stand.</p>
<h2>Washington State’s two offices</h2>
<p>Washington residents are split between Seattle, Spokane and Yakima. Spokane publishes ${spo.n400Range} for naturalization and ${spo.i485Range} for the family green card. Seattle’s family queue is the outlier: its inquiry cut-off date for the family I-485 is the oldest among the twenty largest offices on this site, a sign that some files have been waiting for years. If yours is among them, the inquiry route is already open.</p>`,
  },
});
