import { definePage } from '../../lib/guide-types';
import PT from '../../data/ptimes.json';
import { kindById, centerRows, NATIONAL_MONTH, PUBLISHED } from '../../lib/engine/ptimes';
import { formatNumber, displayDate } from '../../lib/format';

// Chiffres lus dans les données : I-485 emploi (sous-type 131A) publié par la direction des bureaux et les centres de service.
const NF = (PT as unknown as { national: { forms: Record<string, { months: number; received: number; pending: number }> } }).national.forms;
const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const [mName, mYear] = NATIONAL_MONTH.split(' ');
const natYm = `${mYear}-${String(MN.indexOf(mName) + 1).padStart(2, '0')}`;
const n = (x: number | null | undefined) => (x == null ? '—' : formatNumber(x, x % 1 ? 1 : 0, 'en'));
const rows = centerRows(kindById('i485emp')!);
const fod = rows.find((r) => r.office === 'FOD')!, scd = rows.find((r) => r.office === 'SCD')!;
const nat = NF['I-485 employment'], fam = NF['I-485 family'];
const pub = displayDate(PUBLISHED, 'en-US');
const ratio = (x: { pending: number; received: number }) => Math.round(x.pending / x.received);

export default definePage({
  id: "i-485-employment-processing-time", group: "times", order: 503, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i485emp", "office": "HOU"},
  data: {"form": "i-485-employment"},
  related: ["processing-times", "i-140-processing-time", "guide-portability", "employment-green-card-cost", "eb-2-india"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i485Form", "aosCharts", "visaPriority"],
  en: {
    path: "processing-times/i-485-employment",
    nav: 'I-485 employment-based', card: 'Employment green card adjustment times as USCIS publishes them, field offices against service centers.',
    title: 'I-485 Employment-Based Processing Time 2026 at USCIS',
    description: 'Employment-based I-485 processing time in 2026: the two ranges USCIS publishes, field offices against service centers, the national average and visa numbers.',
    h1: 'Employment-based I-485 processing time',
    intro: 'Choose the unit handling your adjustment of status and enter your receipt date to compare the case with the range USCIS currently publishes.',
    resume: `USCIS publishes the employment-based Form I-485 in two lines rather than office by office. In the edition of ${pub}, cases with the Field Office Directorate show a range of ${n(fod.min)} to ${n(fod.max)} months, while cases with Service Center Operations show ${n(scd.min)} to ${n(scd.max)} months. In each pair the first figure is the median case and the second is the time by which 80% were decided. The report to Congress for ${NATIONAL_MONTH} gives one national average for all employment adjustments, ${n(nat.months)} months, with ${n(nat.received)} applications received that month and ${n(nat.pending)} pending. That average is shorter than the service-center range because it blends every decision of the month, quick and slow. None of these clocks includes the wait for a visa number: an employment I-485 can only be approved once the priority date from the I-140 is earlier than the Final Action Date for the applicant’s category and country of birth.`,
    faqs: [
      { q: 'Why does USCIS publish two different employment-based I-485 processing times?', a: 'Employment adjustment cases are reported under two units, the Field Office Directorate and Service Center Operations, each with its own median and 80% figure. USCIS does not say on the processing-times tool how cases are split between them. If your notices name a service center or a field office, use that line in the checker; otherwise compare your receipt date with both.' },
      { q: 'Can I change jobs while my employment-based I-485 is pending?', a: 'Often, yes. Under the AC21 portability rule, an applicant whose I-485 has been pending 180 days or more may move to a new job in a same or similar occupation and keep the approved I-140 as the basis of the case. The conditions are specific, so read our portability guide and speak to an immigration attorney before resigning.' },
      { q: 'Does an employment-based I-485 get decided faster when my priority date is current?', a: 'USCIS cannot approve the case before the date is current, so a backlog in the Visa Bulletin can keep a file pending long after the published range has passed. Once the Final Action Date reaches your priority date, the processing range is the relevant clock again. Our green card calculator combines both for your category and country.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Two published lines, far apart</h2>
<p>Most forms on this site come with one range, or with one per field office. The employment adjustment is unusual: two lines, published separately, with a gap of ${m(scd.max! - fod.max!)} months at the 80% mark. The Field Office Directorate line reads ${m(fod.min)} to ${m(fod.max)} months and accepts inquiries for receipts up to ${h.date(fod.inquiry!)}. The Service Center Operations line reads ${m(scd.min)} to ${m(scd.max)} months, with inquiries for receipts up to ${h.date(scd.inquiry!)}. USCIS does not explain the split on its tool, and we do not guess at it. What it means in practice is that two people who filed the same month can sit on very different clocks.</p>
<h2>Smaller queue, smaller backlog</h2>
<p>For ${h.month(natYm)}, USCIS received ${h.num(nat.received)} employment adjustments against ${h.num(fam.received)} family ones, and holds ${h.num(nat.pending)} pending against ${h.num(fam.pending)}. Measured in months of intake, the employment backlog equals about ${h.num(ratio(nat))} months of new filings and the family one about ${h.num(ratio(fam))}. The average time to decision is ${m(nat.months)} months for employment and ${m(fam.months)} for family.</p>
<h2>Where the Visa Bulletin takes over</h2>
<p>For applicants born in India or China, the processing range is rarely the binding clock. USCIS lets them file when the Dates for Filing chart allows it, then holds the case until the Final Action Date catches up, as the ${h.a('eb-2-india', 'EB-2 India page')} shows. During that time, the I-485 has value of its own: a work permit, a travel document, and after 180 days the job portability described in our ${h.a('guide-portability', 'portability guide')}. The approved ${h.a('i-140-processing-time', 'I-140')} that comes before it has its own published times, which depend heavily on the category.</p>
<h2>What an inquiry can and cannot do</h2>
<p>Enter the receipt date from your Form I-797C in the checker. If it is on or before the inquiry date of your line, USCIS treats the case as outside normal processing time and accepts a case inquiry. An inquiry asks USCIS to look at a file; it cannot make a visa number available. When the priority date is not yet current, no inquiry changes that.</p>`;
    },
  },
});
