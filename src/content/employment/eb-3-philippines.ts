import { definePage } from '../../lib/guide-types';
import { cellAt, backtestCell, distinctShare, MONTHS, LATEST } from '../../lib/engine/cases';
import { PUBLISHED } from '../../lib/engine/ptimes';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';
import { isoToDays } from '../../lib/engine/forecast';
import PT from '../../data/ptimes-latest.json';

// Chiffres lus dans les données (jamais tapés).
const at = (ym: string, c: 'PH' | 'ROW' = 'PH', ch: 'FAD' | 'DFF' = 'FAD') => cellAt('EB3', c, ch, MONTHS.indexOf(ym));
const fad = cellAt('EB3', 'PH', 'FAD'), dff = cellAt('EB3', 'PH', 'DFF');
const row = cellAt('EB3', 'ROW', 'FAD'), rowDff = cellAt('EB3', 'ROW', 'DFF');
const ewPH = cellAt('EW', 'PH', 'FAD'), ewROW = cellAt('EW', 'ROW', 'FAD');
const retro = retrogressions('EB3', 'PH');
const mostEB3 = (['ROW', 'IN', 'CN'] as const).every((c) => retrogressions('EB3', c).n < retro.n);
const before = at(MONTHS[MONTHS.indexOf(retro.worstAt) - 1]), worst = at(retro.worstAt), next = at(MONTHS[MONTHS.indexOf(retro.worstAt) + 1]);
const may23 = at('2023-05'), aug23 = at('2023-08'), oct25 = at('2025-10'), mar26 = at('2026-03'), oct26 = at('2026-10');
const bt6 = backtestCell('EB3', 'PH', 6)!, bt12 = backtestCell('EB3', 'PH', 12)!;
const nur = ((PT as any).forms['i-140'].rows as Array<{ office: string; subtype: string; min: number; max: number }>).find((r) => r.subtype === '136A-NUR')!;
const isDate = (c: string) => c !== 'C' && c !== 'U';
const behind = isDate(fad) && isDate(row) ? Math.round((isoToDays(row) - isoToDays(fad)) / 30.4375) : NaN;
const en = (c: string) => cellText(c, 'en');
const m1 = (h: { num: (n: number, d?: number) => string }, x: number) => h.num(x, Number.isInteger(x) ? 0 : 1);

export default definePage({
  id: "eb-3-philippines", group: "employment", order: 211, parent: "eb-3",
  tool: {"kind": "greencard", "cat": "EB3", "country": "PH"},
  data: {"cat": "EB3", "country": "PH"},
  related: ["eb-3", "country-philippines", "eb-3-other-workers", "i-140-processing-time", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form", "itData", "eb3Page", "cfr656_5", "cfr204_5"],
  en: {
    path: "employment/eb-3/philippines",
    nav: 'EB-3 Philippines', card: 'Filipino skilled workers and nurses: a column that splits from the worldwide date about half the time, and its many reversals.',
    title: 'EB-3 Philippines Priority Date 2026: Cutoff and Reversals',
    description: 'EB-3 Philippines in the Visa Bulletin: the Filipino cutoff against the worldwide date, the 2023 split, reversals since 2001 and the Schedule A nurse I-140 time.',
    h1: 'EB-3 Philippines: a column that comes and goes',
    intro: 'Enter the priority date from your PERM or Schedule A petition to check an EB-3 case for a person born in the Philippines against this month’s bulletin.',
    resume: `In the ${monthName(LATEST, 'en')} Visa Bulletin, EB-3 for people born in the Philippines has a Final Action Date of ${en(fad)} and a Date for Filing of ${en(dff)}. ${Number.isFinite(behind) && behind !== 0 ? `That is about ${Math.abs(behind)} months ${behind > 0 ? 'behind' : 'ahead of'} the worldwide EB-3 date, ${en(row)}.` : `The worldwide EB-3 date is ${en(row)}.`} Unlike India and China, the Philippine column only splits from the worldwide one part of the time: in ${Math.round(distinctShare('EB3', 'PH') * 100)}% of bulletins since October 2015. It was Current from October 2020 to April 2023, then took its own date in May 2023. The line has retrogressed ${retro.n} times since 2001, and its deepest single fall, in ${monthName(retro.worstAt, 'en')}, cost about ${Math.round(retro.worstMonths)} months. For nurses sponsored under Schedule A, the latest USCIS range for the I-140 petition is ${nur.min} to ${nur.max} months. ${bt6.reliable ? 'Our back-test passes for dates about six months behind the cutoff.' : ''}`,
    faqs: [
      { q: 'Why does EB-3 Philippines sometimes have the worldwide date and sometimes not?', a: 'The Philippine column gets its own date only when demand from people born in the Philippines would exceed the 7% per-country share in that row. When it does not, the bulletin prints the worldwide date in the Philippine column. Since 2015 that has happened in roughly half of bulletins, which is why the column can rejoin and leave the worldwide line.' },
      { q: 'What is a Schedule A nurse petition in EB-3 Philippines cases?', a: 'Schedule A is the Department of Labor list of occupations with too few U.S. workers, which includes professional nurses, so the employer files Form I-140 directly with USCIS without a DOL-approved PERM labor certification. USCIS publishes a separate processing range for these petitions. The visa queue is the same EB-3 row as other Filipino skilled workers.' },
      { q: 'Does EB-3 Other Workers Philippines follow the same date as EB-3 Philippines?', a: 'Not necessarily. Other Workers is its own row with a worldwide ceiling of 10,000 numbers a year, and its Philippine column can carry a different date from the skilled-worker row. Read the row that matches the classification on the approved I-140. The Other Workers page tracks the worldwide line, which Philippine applicants share when their column has no separate date.' },
    ],
    body: (h) => `
<h2>Current until spring 2023</h2>
<p>For two and a half years the Filipino EB-3 column needed no priority date at all: it read Current from October 2020 to April 2023. In May 2023 it took a date of ${h.cell(may23)} and by August 2023 had fallen to ${h.cell(aug23)}. It opened fiscal 2026 at ${h.cell(oct25)}, reached ${h.cell(mar26)} in March 2026 and stood at ${h.cell(oct26)} in October 2026. Meanwhile the worldwide row is at ${h.cell(row)}, with a filing date of ${h.cell(rowDff)} against ${h.cell(dff)} for the Philippines.</p>
<h2>A record of reversals</h2>
<p>With ${h.num(retro.n)} retrogressions since 2001, ${mostEB3 ? 'this column has stepped back more often than any other EB-3 column tracked here' : 'this column has stepped back often'}. The worst came in ${h.month(retro.worstAt)}, when the cutoff went from ${h.cell(before)} to ${h.cell(worst)}, and the next bulletin cut it again to ${h.cell(next)}. Any range for this column has to carry that history; ${h.a('guide-retrogression', 'the retrogression guide')} explains how drops like these happen.</p>
<h2>Nurses and the petition stage</h2>
<p>Registered nurses can be sponsored under Schedule A, which skips the PERM step. In the ${h.src('itData', `${h.month(PUBLISHED.slice(0, 7))} USCIS release`)}, Schedule A nurse petitions on Form I-140 took ${m1(h, nur.min)} to ${m1(h, nur.max)} months. Their priority date is the I-140 filing date. ${ewPH === ewROW ? `For lower-skilled jobs, the Philippine Other Workers column currently matches the worldwide one at ${h.cell(ewPH)}; see ${h.a('eb-3-other-workers', 'EB-3 Other Workers')}.` : `For lower-skilled jobs, the Philippine Other Workers column reads ${h.cell(ewPH)}; see ${h.a('eb-3-other-workers', 'EB-3 Other Workers')}.`}</p>
<h2>What the forecast can carry</h2>
<p>Tested from October 2012 to October 2025, forecasts for Filipino EB-3 dates six months behind missed by a median of ${h.num(bt6.medianError)} months, with ${h.pct(bt6.coverage)} coverage${bt6.reliable ? ', enough to show a range' : ''}. A year behind, the error was ${h.num(bt12.medianError)} months against a real wait of about ${h.num(bt12.medianActual)}, ${bt12.reliable ? 'which also passes' : 'which does not pass'}.</p>`,
  },
});
