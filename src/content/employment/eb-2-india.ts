import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : octobre 2026 au moment de l'écriture.
const fad = cellAt('EB2', 'IN', 'FAD');
const dff = cellAt('EB2', 'IN', 'DFF');
const row = cellAt('EB2', 'ROW', 'FAD');
const oct2015 = cellAt('EB2', 'IN', 'FAD', MONTHS.indexOf('2015-10'));
const oct2020 = cellAt('EB2', 'IN', 'FAD', MONTHS.indexOf('2020-10'));
const jul2007 = cellAt('EB2', 'IN', 'FAD', MONTHS.indexOf('2007-07'));
const move = moveDays('EB2', 'IN') ?? 0;
const bt12 = backtestCell('EB2', 'IN', 12)!;
const bt24 = backtestCell('EB2', 'IN', 24)!;
const retro = retrogressions('EB2', 'IN');
const en = (c: string) => cellText(c, 'en');
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);

export default definePage({
  id: 'eb-2-india', group: 'employment', order: 207, parent: 'eb-2',
  tool: { kind: 'greencard', cat: 'EB2', country: 'IN', pd: '2014-06-01' },
  data: { cat: 'EB2', country: 'IN' },
  related: ['eb-2', 'country-india', 'eb-3-india', 'guide-eb2-to-eb3', 'i-485-employment-processing-time'],
  sources: ['vbIndex', 'vbMirror', 'aosCharts', 'visaPriority', 'i140Form'],
  en: {
    path: 'employment/eb-2/india',
    nav: 'EB-2 India', card: 'The longest-running employment backlog: cutoff, filing chart, history since 2001 and our graded forecast.',
    title: 'EB-2 India Priority Date 2026: Cutoff and Wait Forecast',
    description: 'EB-2 India in the Visa Bulletin: this month’s Final Action Date and Date for Filing, every October since 2002, and how our wait forecast has done since 2012.',
    h1: 'EB-2 India: where the cutoff stands and how long the wait runs',
    intro: 'Enter your priority date from the I-140 approval notice to see whether you can file Form I-485 this month and what the history says about the wait.',
    resume: `In the ${LATEST.slice(0, 4)} bulletins, EB-2 India is the employment category with the widest gap between the Indian cutoff and the rest of the world. The Final Action Date is ${en(fad)}, while applicants born anywhere else are at ${en(row)}: the same degree, the same employer and the same petition can mean a wait of more than a decade only because of the country of birth. This is the effect of the 7% per-country cap, which India hits every year in EB-2 and EB-3. For filing, USCIS currently lets applicants use the Dates for Filing chart, where the Indian date is ${en(dff)}, so someone with a priority date between the two can file Form I-485, get a work permit and travel document, and wait inside the United States for the Final Action Date to reach them. Our back-test shows why we do not print a single date: from October 2012 to October 2025, forecasts for people a year behind missed by a median of ${bt12.medianError} months.`,
    faqs: [
      { q: 'Why is the EB-2 India date so far behind the worldwide date?', a: 'Because no country may receive more than 7% of the family and employment preference visas in a year, and demand from India in EB-2 is many times that share. Indian applicants therefore queue on their own line while the rest of the world moves on a separate, much faster cutoff. Being born in India is what counts, not citizenship or where you live today.' },
      { q: 'Can I file my I-485 in EB-2 India before the Final Action Date is reached?', a: 'Yes, when USCIS designates the Dates for Filing chart for employment cases and your priority date is earlier than the Indian date on that chart. You can then file Form I-485 with Forms I-765 and I-131. The green card itself can only be approved once your date is earlier than the Final Action Date, which is often years later.' },
      { q: 'Does my spouse’s country of birth help in EB-2 India?', a: 'It can. Under cross-chargeability, a principal applicant born in India may be charged to the spouse’s country of birth if the spouses immigrate together. If your spouse was born in a country on the worldwide date, both of you can use that much earlier queue. The rule does not apply to a spouse who is not immigrating with you.' },
      { q: 'Is EB-3 India faster than EB-2 India right now?', a: 'The two Indian queues move separately and swap places from year to year, which is why some applicants file a second I-140 in EB-3 and keep their original priority date. Compare both dates in the table on this page or with the EB-2 to EB-3 calculator before deciding, and remember that a new petition means new employer paperwork and fees.' },
    ],
    body: (h) => `
<h2>A queue measured in decades</h2>
<p>Priority dates are not a ticket number: they move with the yearly supply of visas and with demand that was filed years ago. For EB-2 India, the cutoff stood at ${h.cell(oct2015)} in October 2015 and at ${h.cell(oct2020)} in October 2020. Today it reads ${h.cell(fad)}. Measured against the bulletin date itself, the queue is about ${h.num(years(fad, `${LATEST}-01`), 1)} years long, and it has been more than ten years long for most of the last decade. The latest bulletin moved the date by ${h.num(Math.abs(Math.round(move)))} days ${move >= 0 ? 'forward' : 'backward'}.</p>
<h2>Retrogression is part of the history</h2>
<p>Since December 2001 the Indian EB-2 date has gone backwards ${h.num(retro.n)} times. The largest single drop came in ${h.month(retro.worstAt)}, when the cutoff lost about ${h.num(Math.round(retro.worstMonths))} months in one bulletin. The most famous episode is July 2007, when the category was briefly listed as ${h.cell(jul2007)} and hundreds of thousands of people filed at once. Each of these drops came after a period of fast movement, usually near the end of a fiscal year in September, when the State Department sees how many numbers are left. ${h.a('guide-retrogression', 'How retrogression works')}.</p>
<h2>What the two charts mean for you this month</h2>
<p>The Final Action Date decides when a green card can be approved. The Date for Filing, ${h.cell(dff)} this month, decides when you may hand in Form I-485, but only in a month when USCIS says so on its filing-charts page. People with a priority date between the two dates are in a waiting room inside the system: they hold a pending I-485, can change jobs under AC21 portability after 180 days, and renew their work permit at the reduced fee while the cutoff catches up. ${h.a('guide-final-action-vs-dates-for-filing', 'More on the two charts')}.</p>
<h2>Why our calculator may refuse to give a date</h2>
<p>We tested the forecast for this case month by month from October 2012 to October 2025, each time with only the bulletins known that month. For people two years behind the cutoff, the middle estimate was off by a median of ${h.num(bt24.medianError)} months, and the range held the real date ${h.pct(bt24.coverage)} of the time. That is not good enough to promise a month, so for most EB-2 India dates the calculator shows the cutoff, your distance from it and the filing status, then says plainly that there is no reliable forecast. If a date shows up, it is because that distance passed the test.</p>`,
  },
});
