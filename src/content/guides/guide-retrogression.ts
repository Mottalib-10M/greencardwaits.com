import { definePage } from '../../lib/guide-types';
import { series, moveDays, cellAt, MONTHS, LATEST, CAT_SHORT, COUNTRY_LABEL, type Cat, type Country } from '../../lib/engine/cases';
import { resolve, MONTH_DAYS } from '../../lib/engine/forecast';
import { retrogressions } from '../../lib/minis/retro';
import { monthName } from '../../lib/text';

// Reculs de la date Final Action depuis décembre 2001, case par case (même règle que le mini-simulateur).
type Q = Exclude<Cat, 'IR'>;
const CASES: Array<[Q, Country]> = [['F1', 'ROW'], ['F2A', 'ROW'], ['F2B', 'ROW'], ['F3', 'ROW'], ['F4', 'ROW'], ['F1', 'MX'], ['F2A', 'MX'], ['F3', 'MX'], ['F4', 'PH'], ['EB1', 'ROW'], ['EB1', 'IN'], ['EB2', 'ROW'], ['EB2', 'CN'], ['EB2', 'IN'], ['EB3', 'ROW'], ['EB3', 'IN'], ['EB3', 'PH'], ['EW', 'ROW'], ['EB4', 'ROW'], ['EB5', 'CN']];

/** Chaque recul, avec le nombre de bulletins avant que la date retrouve son niveau d'avant (null : pas encore). */
function events(c: Q, k: Country) {
  const s = series(c, k, 'FAD');
  const out: Array<{ m: string; months: number; back: number | null }> = [];
  let prev: number | null = null;
  for (let i = 0; i < s.length; i++) {
    const v = resolve(s, MONTHS, i);
    if (v === null) continue;
    if (prev !== null && v < prev - 0.5) {
      let back: number | null = null;
      for (let j = i + 1; j < s.length; j++) { const w = resolve(s, MONTHS, j); if (w !== null && w >= prev) { back = j - i; break; } }
      out.push({ m: MONTHS[i], months: (prev - v) / MONTH_DAYS, back });
    }
    prev = v;
  }
  return out;
}
const median = (xs: number[]) => { if (!xs.length) return NaN; const a = [...xs].sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
const rows = CASES.map(([c, k]) => {
  const r = retrogressions(c, k), ev = events(c, k);
  const rec = ev.filter((e) => e.back !== null).map((e) => e.back as number);
  return { c, k, r, ev, recMedian: median(rec), open: ev.filter((e) => e.back === null).length };
});
const all = rows.flatMap((x) => x.ev);
const recAll = all.filter((e) => e.back !== null).map((e) => e.back as number);
const within12 = recAll.filter((b) => b <= 12).length;
const never = all.filter((e) => e.back === null).length;
// Mois calendaire des reculs : part de ceux annoncés entre juin et octobre (fin et début d'exercice fiscal).
const lateFy = all.filter((e) => ['06', '07', '08', '09', '10'].includes(e.m.slice(5, 7))).length;
const most = rows.reduce((a, b) => (b.r.n > a.r.n ? b : a));
const fewest = rows.reduce((a, b) => (b.r.n < a.r.n ? b : a));
const deepest = rows.reduce((a, b) => (b.r.worstMonths > a.r.worstMonths ? b : a));
const eb2row = moveDays('EB2', 'ROW') ?? 0;
const eb3row = moveDays('EB3', 'ROW') ?? 0;
const latest = monthName(LATEST, 'en');
const at = (c: Q, k: Country, m: string) => cellAt(c, k, 'FAD', MONTHS.indexOf(m));
const f2aEv = events('F2A', 'ROW').find((e) => e.m === '2023-08');
const lbl = (c: Q, k: Country) => `${CAT_SHORT[c]} ${COUNTRY_LABEL.en[k]}`;

export default definePage({
  id: "guide-retrogression", group: "guides", order: 703,
  mini: "retro",
  related: ["priority-date-calculator", "visa-bulletin-history", "guide-bulletin-release", "guide-final-action-vs-dates-for-filing", "visa-bulletin-predictions"],
  sources: ["visaPriority", "vbOct2026", "vbIndex", "vbMirror"],
  en: {
    path: "guides/retrogression",
    nav: 'Visa retrogression', card: 'Why a Visa Bulletin cutoff moves backwards, how often it has happened in each case since 2001, and how long recovery took.',
    title: 'Visa Retrogression 2026: Why Priority Dates Move Backwards',
    description: 'Visa retrogression explained with every Visa Bulletin since December 2001: how often each cutoff went backwards, the deepest drops, and how long recovery took.',
    h1: 'Visa retrogression: when the cutoff date goes backwards',
    intro: 'A date that was current last month can fall years behind this month; here is why, and what the full archive says about how often and how far it happens.',
    resume: `Visa retrogression is the State Department moving a Visa Bulletin cutoff to an earlier date than the month before, or taking a category that was current and giving it a date again. USCIS describes it plainly: it happens when more people apply in a category than there are visas for that month, generally because the annual limit for the category or the country has been used up or is about to be. Our reading of every bulletin since December 2001 counts ${all.length} retrogressions of the Final Action Date across the ${CASES.length} cases in the table on this page. ${lbl(most.c, most.k)} went backwards most often, ${most.r.n} times; the deepest single drop was ${lbl(deepest.c, deepest.k)} in ${monthName(deepest.r.worstAt, 'en')}, about ${Math.round(deepest.r.worstMonths)} months in one bulletin. Of the drops that were later made up, ${within12} of ${recAll.length} were recovered within 12 bulletins, which matches USCIS’s note that a new fiscal year usually, but not always, brings dates back.`,
    faqs: [
      { q: 'What causes visa retrogression in the Visa Bulletin?', a: 'Demand that outruns the numbers left for the year. Each category has an annual limit and each country a per-country cap; when the State Department sees that approvals at the current cutoff would exceed what remains, it moves the cutoff back to slow issuance. USCIS puts it the same way: retrogression generally occurs when the annual limit for a category or country has been reached or is expected to run out soon.' },
      { q: 'Does visa retrogression take away my priority date?', a: 'No. Your priority date stays the same; only the cutoff it is compared with moves. If the Final Action Date falls behind your date, a pending application cannot be approved until the cutoff passes your date again. The place in line you earned on the day the petition or labor certification was filed does not change.' },
      { q: 'How long does visa retrogression usually last?', a: 'It varies by case more than by year. In our table, most drops that were later made up came back within twelve bulletins, a few took several years, and some have not been made up at all. The table gives the median recovery for each case. Past timing does not promise future timing, which is why the forecast tool shows a range and its past error.' },
      { q: 'Why does visa retrogression often happen near the end of the fiscal year?', a: `Because the yearly supply is fixed from October 1 to September 30. As September approaches, the State Department sees how many numbers remain and may hold or reverse dates to stay within the annual limit. In our count, more than half of all drops came in bulletins for June through October, the months around the change of fiscal year.` },
      { q: 'Can visa retrogression happen at the start of a fiscal year too?', a: `Yes, and the ${latest} bulletin is an example. It says some employment categories for the rest of the world retrogressed to keep issuance within fiscal year 2027 quarterly and annual limits. The worldwide EB-2 and EB-3 Final Action Dates were among the dates that moved, so a new fiscal year is no guarantee of forward movement.` },
      { q: 'Is a category marked unavailable counted as a retrogression here?', a: 'Not in our count. A “U” in the bulletin means no numbers may be issued that month at all, which is different from a date moving back. We skip those months and compare the next published date with the last one before the gap. If that next date is earlier, it counts as a retrogression; if it is the same or later, it does not.' },
      { q: 'Can anyone predict visa retrogression before the bulletin comes out?', a: 'The State Department sometimes warns in the bulletin’s notes that a category may retrogress or become unavailable, and those warnings are worth reading each month. Beyond that, nobody outside the agency sees the demand data. Our forecasts count past retrogressions in their ranges rather than trying to time the next one, and they are graded against what actually happened.' },
    ],
    body: (h) => `
<h2>What the word means</h2>
<p>A Visa Bulletin cutoff usually moves forward or stays put. Retrogression is the other direction: the ${h.src('vbIndex', 'bulletin')} prints an earlier date than the month before, or a category that was “C” gets a date again. The ${h.src('visaPriority', 'USCIS page on visa availability')} gives the reason in two sentences: more people apply in a category than there are visas for that month, generally because the annual limit for the category or country has been reached or is expected to be. It adds that when the new fiscal year starts on October 1, the new supply usually, but not always, returns the cutoffs to where they were.</p>
<p>The bulletin says the same thing from the inside. It sets each Final Action Date at the priority date of the first applicant who could not be reached within the numbers available, and it describes what happens when it becomes necessary during the monthly allocation process to retrogress a date.</p>
<h2>Every retrogression since 2001, case by case</h2>
<p>We counted a retrogression each time the Final Action Date in a bulletin was earlier than the last published date before it, treating “C” as the first day of the bulletin month and skipping months marked unavailable. Recovery is the number of bulletins until the date was back at or past its level before the drop.</p>
${h.table(['Case', 'Retrogressions', 'Largest drop', 'In the bulletin of', 'Median bulletins to recover', 'Not yet recovered'], rows.map((x) => [lbl(x.c, x.k), x.r.n, x.r.n ? `${h.num(x.r.worstMonths, 0)} months` : 'none', x.r.n ? h.month(x.r.worstAt) : 'n/a', Number.isFinite(x.recMedian) ? h.num(x.recMedian) : 'n/a', x.open]), `Final Action Dates, ${h.month(MONTHS[0])} to ${h.month(LATEST)}.`, ['l', 'r', 'r', 'l', 'r', 'r'])}
<p>Three patterns stand out. First, how often a line goes backwards says little about how long it is: ${lbl(fewest.c, fewest.k)} had only ${h.num(fewest.r.n)} ${fewest.r.n === 1 ? 'retrogression' : 'retrogressions'}, while ${lbl(most.c, most.k)} had ${h.num(most.r.n)}. Second, the largest drops are counted in years, not months: ${lbl(deepest.c, deepest.k)} lost about ${h.num(deepest.r.worstMonths, 0)} months in ${h.month(deepest.r.worstAt)}. Third, most drops are temporary. Across the table, ${h.num(within12)} of the ${h.num(recAll.length)} drops that were later made up came back within 12 bulletins, but ${h.num(never)} have not come back at all.</p>
<h2>Three drops, three shapes</h2>
<p>The table hides very different stories. The worldwide EB-2 line was ${h.cell(at('EB2', 'ROW', '2018-08'))} in August 2018, fell to ${h.cell(at('EB2', 'ROW', '2018-09'))} in the September bulletin, and was ${h.cell(at('EB2', 'ROW', '2018-10'))} again in October: a one-month pause at the end of a fiscal year, gone as soon as the new numbers arrived. F2A for the rest of the world is the opposite shape. It was ${h.cell(at('F2A', 'ROW', '2023-03'))} in March 2023, received a date in April, and in August 2023 dropped to ${h.cell(at('F2A', 'ROW', '2023-08'))}; ${f2aEv && f2aEv.back !== null ? `it took ${h.num(f2aEv.back)} bulletins to climb back to its July level` : 'it has not yet climbed back to its July level'}. EB-1 India shows the depth a single bulletin can reach: ${h.cell(at('EB1', 'IN', '2023-07'))} in July 2023, then ${h.cell(at('EB1', 'IN', '2023-08'))} in August, a decade erased, with a partial return to ${h.cell(at('EB1', 'IN', '2023-10'))} in October.</p>
<p>For a family waiting in one of those lines, the shape matters more than the count. A one-month pause costs a month. A drop that takes years to recover keeps the whole family waiting while its children keep getting older, and a teenager can approach 21 before the line moves again; that is the situation the ${h.a('cspa-age-out-calculator', 'CSPA calculator')} was built for.</p>
<h2>Why it clusters around the fiscal year</h2>
<p>The yearly supply of preference visas runs from October 1 to September 30. In the summer the State Department knows how many numbers are left and how many applicants are ready; if approvals at the current cutoff would run past the limit, it holds, retrogresses or makes the category unavailable until October. Of the ${h.num(all.length)} drops in the table, ${h.num(lateFy)} were in bulletins for June through October, five months out of twelve.</p>
${h.mini('fiscalYear')}
<p>The new year is not always a relief. The ${h.src('vbOct2026', `bulletin for ${latest}`)} notes that some employment categories for the rest of the world retrogressed to keep issuance within the fiscal year 2027 quarterly and annual limits. The worldwide EB-2 Final Action Date moved about ${h.num(Math.abs(eb2row) / MONTH_DAYS, 0)} months ${eb2row < 0 ? 'backward' : 'forward'}, to ${h.cell(cellAt('EB2', 'ROW', 'FAD'))}, and the worldwide EB-3 date about ${h.num(Math.abs(eb3row) / MONTH_DAYS, 0)} months ${eb3row < 0 ? 'backward' : 'forward'}. The State Department says it is monitoring the situation and will adjust as needed.</p>
<h2>What it means if it hits your date</h2>
<p>The quick check at the top of this page counts the drops for any category and country you pick, with the largest one and the bulletin it came in, so you can see the history of your own line before reading the forecast. Your priority date does not move. What changes is whether a visa number can be used for it this month. If your date was earlier than the Final Action Date and now is not, an interview or approval that was possible becomes impossible until the cutoff passes your date again. If you filed an I-485 under the Dates for Filing chart, the filing chart and the final chart may move differently; the ${h.a('guide-final-action-vs-dates-for-filing', 'guide to the two charts')} explains which one controls what. What a retrogression means for a pending application, a job change or travel plans is a question for a licensed immigration attorney or a DOJ-accredited representative, who can read your notices.</p>
<h2>Why our forecasts include the drops</h2>
<p>A forecast built only on forward movement would always be too optimistic for cases like ${lbl(most.c, most.k)}. Our method measures how long the cutoff has taken to advance by a given distance over the last ten years, retrogressions included, and reports a range rather than a date. It was tested on the same archive from October 2012 to October 2025, and the ${h.a('priority-date-calculator', 'priority date calculator')} refuses to print a date where that test failed. The ${h.a('visa-bulletin-history', 'archive explorer')} shows every one of these drops month by month.</p>`,
  },
});
