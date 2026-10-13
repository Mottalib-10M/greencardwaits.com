import { definePage } from '../../lib/guide-types';
import { moveDays, MONTHS, LATEST, QUEUE_CATS, COUNTRIES } from '../../lib/engine/cases';
import { addMonths } from '../../lib/engine/forecast';
import VB from '../../data/visa-bulletin.json';

// Tout est lu dans les données : dernier bulletin archivé, mois suivant, mouvements de septembre et d'octobre.
const NEXT = addMonths(LATEST, 1);
const READ_ON = VB.retrieved_at.slice(0, 10);
const NEXT_OUT = MONTHS.includes(NEXT);
const CELLS = QUEUE_CATS.length * COUNTRIES.length;

/** Cases (catégorie × colonne) qui avancent, reculent ou restent dans le bulletin d'un mois donné. */
function moves(ym: string) {
  const i = MONTHS.indexOf(ym);
  if (i < 0) return null;
  let up = 0, down = 0, flat = 0;
  for (const c of QUEUE_CATS) for (const k of COUNTRIES) {
    const d = moveDays(c, k, 'FAD', i);
    if (d === null) continue;
    if (d > 0) up++; else if (d < 0) down++; else flat++;
  }
  return { up, down, flat };
}
const FIRST_FY = 2016;
const LAST_FY = Number(LATEST.slice(0, 4)) + (Number(LATEST.slice(5, 7)) >= 10 ? 0 : -1);
const YEARS = Array.from({ length: LAST_FY - FIRST_FY + 1 }, (_, k) => FIRST_FY + k);
const ROWS = YEARS.map((y) => ({ y, sep: moves(`${y}-09`), oct: moves(`${y}-10`) }));
const worstSep = ROWS.filter((r) => r.sep).reduce((a, r) => (r.sep!.down > a.sep!.down ? r : a), ROWS[0]);
const stillSep = ROWS.filter((r) => r.sep).reduce((a, r) => (r.sep!.flat > a.sep!.flat ? r : a), ROWS[0]);
const octUpAvg = ROWS.filter((r) => r.oct).reduce((a, r) => a + r.oct!.up, 0) / ROWS.filter((r) => r.oct).length;
const sepUpAvg = ROWS.filter((r) => r.sep).reduce((a, r) => a + r.sep!.up, 0) / ROWS.filter((r) => r.sep).length;
const latestOct = ROWS[ROWS.length - 1];
const eb2RowOct = moveDays('EB2', 'ROW') ?? 0;

export default definePage({
  id: "guide-bulletin-release", group: "guides", order: 704,
  mini: "fiscalYear",
  related: ["visa-bulletin", "visa-bulletin-history", "visa-bulletin-predictions", "guide-retrogression", "guide-final-action-vs-dates-for-filing"],
  sources: ["vbIndex", "vbOct2026", "aosCharts", "visaPriority"],
  en: {
    path: "guides/visa-bulletin-release-date",
    nav: 'Bulletin release timing', card: 'When the monthly Visa Bulletin comes out, why the year starts in October, and what September usually brings.',
    title: 'Visa Bulletin Release Date 2026: Monthly and Yearly Cycle',
    description: 'When the State Department posts each Visa Bulletin, how the October to September fiscal year shapes the cutoffs, and how every September and October has moved.',
    h1: 'Visa Bulletin release date and the fiscal year',
    intro: 'Pick a date to see its federal fiscal year and the next bulletin due, then read how the yearly cycle moves the cutoffs.',
    resume: `The Visa Bulletin is a monthly notice from the U.S. Department of State, and each issue is posted during the month before the one it governs, usually somewhere around the middle of that month. The State Department does not publish a fixed release day, so no site can honestly promise the exact morning a new issue will appear. The bulletin follows the federal fiscal year, which runs from October 1 to September 30: a fresh supply of immigrant visa numbers becomes available every October 1, and that is why the October issue is the one where the most cutoffs jump. September sits at the other end of the same cycle, when the annual limits are nearly used up and categories stall, retrogress or become unavailable. Our archive holds every bulletin from December 2001 to ${LATEST.slice(0, 4)}, and over the Octobers since ${FIRST_FY} an average of about ${Math.round(octUpAvg)} of the ${CELLS} cutoffs we track moved forward in the first bulletin of the year.`,
    faqs: [
      { q: 'On what day of the month is the Visa Bulletin released?', a: 'There is no fixed day. The State Department posts the bulletin during the month before the one it covers, usually around the middle of the month, but some issues have arrived earlier and some later. The department does not announce a calendar in advance, so the safest habit is to check its Visa Bulletin page from about the tenth of each month.' },
      { q: 'Why does the Visa Bulletin fiscal year start in October?', a: 'Because immigrant visa numbers are counted on the federal fiscal year, which begins on October 1 and ends on September 30. USCIS explains that a new supply of visa numbers becomes available when the new fiscal year starts. The October bulletin is therefore the first one written with a full year of numbers in hand.' },
      { q: 'Does the October Visa Bulletin always move dates forward?', a: 'Usually, not always. In most years since 2016, nearly every cutoff we track advanced or held in October. The October 2026 issue is a counterexample: it says some rest-of-world employment categories retrogressed to keep issuances within the new year’s quarterly and annual limits. A new year brings new numbers, but it also brings new demand.' },
      { q: 'Why do Visa Bulletin cutoffs often stall or go backwards in September?', a: 'September is the last month of the fiscal year. By then many categories have used most of their annual numbers, and USCIS notes that retrogression generally occurs when a limit has been reached or is expected to run out soon. A category can also be listed as unavailable until October brings the next year’s supply.' },
      { q: 'Can I file my I-485 as soon as the new Visa Bulletin is posted?', a: 'Not automatically. The bulletin month starts on the first of that month, not on the day the bulletin is posted, and USCIS separately announces whether adjustment applicants use the Final Action Dates or the Dates for Filing chart that month. Check both the bulletin and the USCIS filing charts page before counting on a date.' },
      { q: 'Is there an official Visa Bulletin release schedule for fiscal year 2027?', a: 'Not one we have found. The State Department publishes each issue on its Visa Bulletin page without a forward calendar, and the October 2026 bulletin only says the situation is monitored continually and adjusted as needed. We record each new issue when it appears and update the cutoffs, history and forecasts on this site.' },
    ],
    body: (h) => `
<h2>One bulletin, two months</h2>
<p>Every Visa Bulletin carries a month in its title, and that month is the one it governs, not the one in which you read it. The issue titled for a given month is written during the previous month from the demand that consular posts and USCIS have reported, then posted on the ${h.src('vbIndex', 'State Department’s Visa Bulletin page')}. In practice that posting tends to land somewhere around the middle of the earlier month. The department does not commit to a day, and we do not print one: a guessed date would only send people refreshing a page for nothing. The cutoffs in a new issue take effect on the first day of its month.</p>
<p>USCIS then has its own step. Each month it tells adjustment applicants which of the two charts they may use to file Form I-485, on its ${h.src('aosCharts', 'filing charts page')}. A bulletin can show a generous Dates for Filing chart that USCIS does not accept that month, so the posting of the bulletin is only half of the news. ${h.a('guide-final-action-vs-dates-for-filing', 'The two charts explained')}.</p>
<h2>Where the November 2026 bulletin stands</h2>
<p>${NEXT_OUT
  ? `The bulletin for ${h.month(NEXT)} is in our archive; its cutoffs appear on ${h.a('visa-bulletin', 'the current bulletin page')}.`
  : `When we last read the archive, on ${h.date(READ_ON)}, the newest issue was the one for ${h.month(LATEST)}, and the bulletin for ${h.month(NEXT)} had not been posted yet. We do not publish predicted cutoffs for it as if they were real. When it appears, the data on ${h.a('visa-bulletin', 'the current bulletin page')} and in the calculator is refreshed from the official text.`}</p>
<p>People searching for an upcoming issue are often really asking whether their date will move. The honest answer sits in the history of the category, not in a rumor about the next posting. ${h.a('visa-bulletin-predictions', 'Our forecasts')} show a range for each case and publish how far the past forecasts missed.</p>
<h2>The federal fiscal year behind every cutoff</h2>
<p>Immigrant visa numbers are counted on the federal fiscal year, which runs from October 1 to September 30. ${h.src('visaPriority', 'USCIS')} explains that a new supply of numbers becomes available when the new fiscal year begins on October 1. Fiscal year 2027 therefore began on ${h.date('2026-10-01')}, and the bulletin for ${h.month('2026-10')} was the first one of that year.</p>
<p>This calendar shapes the whole year. The State Department has to keep issuances within quarterly as well as annual limits, so a cutoff reflects not only the size of the queue but also how many numbers the current quarter can still absorb. The ${h.src('vbOct2026', 'October 2026 bulletin')} illustrates the cautious side: it says some rest-of-world employment categories retrogressed to stay within the new year’s limits, and EB-2 for the rest of the world moved ${h.num(Math.abs(Math.round(eb2RowOct)))} days ${eb2RowOct >= 0 ? 'forward' : 'backward'} in that single issue.</p>
<h2>Every September and October since ${FIRST_FY}</h2>
<p>The table counts, for each year, how many of the ${CELLS} Final Action cutoffs we follow (eleven preference categories across five chargeability columns) moved forward, moved back or stayed put compared with the previous issue. It is built from the archived bulletins, not from memory.</p>
${h.table(
  ['Fiscal year start', 'September: forward', 'September: back', 'September: unchanged', 'October: forward', 'October: back', 'October: unchanged'],
  ROWS.map((r) => [String(r.y), r.sep ? r.sep.up : '-', r.sep ? r.sep.down : '-', r.sep ? r.sep.flat : '-', r.oct ? r.oct.up : '-', r.oct ? r.oct.down : '-', r.oct ? r.oct.flat : '-']),
  `Final Action Date movements in the September and October bulletins, ${FIRST_FY} to ${LAST_FY}, ${CELLS} cutoffs`,
  ['l', 'r', 'r', 'r', 'r', 'r', 'r'],
)}
<p>Two patterns stand out. October is the month of movement: on average about ${h.num(Math.round(octUpAvg))} cutoffs advanced in the October issue, against about ${h.num(Math.round(sepUpAvg))} in September. September is the month of standstill and sudden drops. The September ${worstSep.y} issue pulled back ${h.num(worstSep.sep!.down)} cutoffs at once, and in September ${stillSep.y}, ${h.num(stillSep.sep!.flat)} of the ${CELLS} did not move at all. The October ${latestOct.y} issue pushed ${h.num(latestOct.oct!.up)} forward and ${h.num(latestOct.oct!.down)} back, a reminder that the reset does not lift every line.</p>
<h2>Why September is the tense month</h2>
<p>By late summer, the numbers for a category are either nearly used up or clearly not going to be. USCIS describes retrogression as something that generally happens when the annual limit for a category or country has been reached or is expected to run out soon. A bulletin can then hold a date, pull it back, or mark a category as unavailable for the rest of the year. Applicants whose dates were current in August sometimes find themselves outside the cutoff for a few weeks until October brings the next allocation. ${h.a('guide-retrogression', 'How retrogression works')}.</p>
<p>The opposite can also happen. In ${h.num(ROWS.filter((r) => r.sep && r.sep.up > r.sep.down).length)} of the ${h.num(ROWS.filter((r) => r.sep).length)} Septembers in the table, more cutoffs moved forward than back. A September advance is a statement about the closing year, though, not a promise about the next one.</p>
<h2>Fiscal year labels in the archive</h2>
<p>The State Department files its bulletins by fiscal year, not by calendar year. The issue for ${h.month('2026-10')} sits in a folder named 2027 on the department’s servers, just as the issues for November and December 2025 sit in the 2026 folder. The text follows the same logic: the October 2026 issue speaks of FY 2027 numbers and FY 2027 limits. When you search the archive for an older autumn bulletin, look one year ahead of the calendar date. The mini calculator above does that conversion for any date you enter.</p>
<p>The label also explains a common confusion about annual totals. A statement that a category used its numbers for a given year refers to the twelve bulletins from October to September, so a cutoff that held all summer and jumped in October did not speed up in the middle of a year: a new year simply started. The table above reads the same way, with each September closing one fiscal year and the following October opening the next.</p>
<h2>Reading a new issue quickly</h2>
<ul>
<li>Find your preference category row and your chargeability column, which is usually your country of birth.</li>
<li>Read the Final Action Date first: it decides when a green card can be approved or an immigrant visa issued.</li>
<li>Read the Dates for Filing next, then check the USCIS filing charts page to learn which chart applies to an I-485 that month.</li>
<li>Compare with the previous issue on ${h.a('visa-bulletin-history', 'the bulletin history')}, which keeps every cutoff since December 2001.</li>
<li>Read the notes at the end of the bulletin, where the State Department explains retrogressions and warns about the months ahead.</li>
</ul>
<p>The release of a bulletin changes the queue, not the speed of a USCIS office or a consulate. Processing times for forms are a separate set of figures, published separately and covered on our processing-time pages.</p>`,
  },
});
