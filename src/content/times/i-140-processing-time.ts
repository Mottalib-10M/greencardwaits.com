import { definePage } from '../../lib/guide-types';
import PT from '../../data/ptimes.json';
import PR from '../../data/params-2026.json';
import { PUBLISHED } from '../../lib/engine/ptimes';
import { cellAt, CAT_SHORT, type Cat } from '../../lib/engine/cases';
import { formatNumber, formatMoney, displayDate } from '../../lib/format';

// Chiffres lus dans les données : les huit lignes I-140 publiées par Service Center Operations.
type R = { office: string; subtype: string; info: string; min: number | null; max: number | null; inquiry: string | null };
const ROWS = ((PT as unknown as { forms: Record<string, { rows: R[] }> }).forms['i-140']?.rows ?? []).filter((r) => r.max != null).sort((a, b) => a.max! - b.max!);
const CAT: Record<string, Exclude<Cat, 'IR'> | null> = { '136A-E11': 'EB1', '136A-E12': 'EB1', '136A-E13': 'EB1', '136A-E21': 'EB2', '136A-NIW': 'EB2', '136A-E31': 'EB3', '136A-EW3': 'EW', '136A-NUR': null };
const n = (x: number | null | undefined) => (x == null ? '–' : formatNumber(x, x % 1 ? 1 : 0, 'en'));
const by = (s: string) => ROWS.find((r) => r.subtype === s)!;
const eb2 = by('136A-E21'), eb3 = by('136A-E31'), niw = by('136A-NIW'), eb1a = by('136A-E11');
const selfSlower = Math.min(niw.max!, eb1a.max!) > Math.max(eb2.max!, eb3.max!);
const fast = ROWS[0], slow = ROWS[ROWS.length - 1];
const F = PR.fees.i140;
const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const usd = (x: number) => formatMoney(x, 0, 'en');
const pub = displayDate(PUBLISHED, 'en-US');

export default definePage({
  id: "i-140-processing-time", group: "times", order: 507, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i140eb2", "office": "HOU"},
  data: {"form": "i-140"},
  related: ["processing-times", "i-140-fee", "i-485-employment-processing-time", "eb-2", "eb-1"],
  sources: ["uscisTimes", "itData", "uscisData", "i140Form", "g1055", "vbIndex"],
  en: {
    path: "processing-times/i-140",
    nav: 'I-140 processing time', card: 'Immigrant worker petition times for all eight published I-140 categories, next to each category’s Visa Bulletin cutoff.',
    title: 'I-140 Processing Time 2026: EB-1, EB-2, NIW and EB-3',
    description: 'I-140 processing time in 2026 for every published category, from EB-2 and EB-3 with a labor certification to EB-1A and the NIW, with each Visa Bulletin cutoff.',
    h1: 'I-140 processing time by employment category',
    intro: 'Pick your I-140 category and enter the receipt date to see how the petition compares with the range USCIS publishes for it.',
    resume: `USCIS publishes Form I-140, the immigrant petition for alien workers, in eight separate lines at Service Center Operations, and the spread between them is wider than for almost any other form. In the edition of ${pub}, the advanced degree category (EB-2) shows ${n(eb2.min)} to ${n(eb2.max)} months and the skilled worker category (EB-3) ${n(eb3.min)} to ${n(eb3.max)} months. The national interest waiver, which lets an EB-2 applicant skip the labor certification, shows ${n(niw.min)} to ${n(niw.max)} months, and extraordinary ability (EB-1A) ${n(eb1a.min)} to ${n(eb1a.max)} months. In each pair, the first figure is the median case and the second the point by which 80% were decided. The monthly report to Congress gives no national average for the I-140, so the published ranges are the only official measure. USCIS does not explain the differences between categories on its tool. The petition is only the first clock: for applicants born in India or China, the Visa Bulletin wait that follows is usually far longer than any I-140 range.`,
    faqs: [
      { q: 'Why is the NIW I-140 slower than a regular EB-2 I-140?', a: 'USCIS publishes the national interest waiver as its own line, separate from EB-2 petitions filed with a labor certification, and the published range for the waiver is much longer. USCIS does not give a reason on its processing-times tool. Keep in mind that the regular EB-2 path also includes the labor certification step before the I-140, which this range does not count.' },
      { q: 'How much does Form I-140 cost in 2026, with the Asylum Program Fee?', a: `Under the G-1055 schedule, Form I-140 costs ${usd(F.paper)} on paper or ${usd(F.online)} online. The petitioner also pays the Asylum Program Fee: ${usd(F.asylumProgramRegular)} in general, ${usd(F.asylumProgramSmall)} for a small employer and nothing for a nonprofit. Our I-140 fee page lays out each case, including the total for a typical employer filing on paper.` },
      { q: 'Does an approved I-140 mean I can file for my green card?', a: 'Only when your priority date is current under the chart USCIS designates for filing Form I-485 that month. For many categories and countries it is current or close; for India and China it can be years away. The table on this page shows this month’s Final Action Date for each I-140 category, for applicants born in all other countries.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '–' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Eight lines, from months to years</h2>
<p>Sorted from fastest to slowest, the published I-140 lines run from ${m(fast.max)} months for ${lc(fast.info)} to ${m(slow.max)} months for ${lc(slow.info)}. The last column shows where the matching Visa Bulletin queue stands this month for people born outside India, China, Mexico and the Philippines.</p>
${h.table(['Category as published', 'Published range', 'Inquiries for receipts up to', 'Final Action Date, all other countries'], ROWS.map((r) => [r.info, `${m(r.min)} to ${m(r.max)} months`, r.inquiry ? h.date(r.inquiry) : 'not published', CAT[r.subtype] ? `${CAT_SHORT[CAT[r.subtype]!]}: ${h.cell(cellAt(CAT[r.subtype]!, 'ROW', 'FAD'))}` : 'depends on the petition']), `USCIS publication of ${h.date(PUBLISHED)}; Visa Bulletin, latest month.`, ['l', 'r', 'l', 'l'])}
<h2>Labor certification against self-petition</h2>
<p>The employer petitions that follow an approved labor certification show EB-2 at ${m(eb2.max)} months and EB-3 at ${m(eb3.max)} at the top of their ranges. The categories where the applicant can petition without a job offer, extraordinary ability at ${m(eb1a.max)} and the national interest waiver at ${m(niw.max)}, ${selfSlower ? 'sit at the slower end. That reverses a common assumption: filing without a labor certification saves the time that step takes, but on today’s figures the petition itself is longer.' : 'compare differently this month, so check both lines before assuming one path is quicker.'}</p>
<h2>The petition sets the place in line</h2>
<p>The I-140 approval notice shows the priority date that the green card queue uses. If that queue is current, the next step is Form I-485 and its ${h.a('i-485-employment-processing-time', 'own processing time')}. If it is not, as for most Indian and Chinese applicants in ${h.a('eb-2', 'EB-2')} and EB-3, the wait moves to the Visa Bulletin. Our green card calculator adds both clocks.</p>`;
    },
  },
});
