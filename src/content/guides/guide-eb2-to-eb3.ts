import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, MONTHS, LATEST, COUNTRY_LABEL, type Country } from '../../lib/engine/cases';
import { isoToDays } from '../../lib/engine/forecast';
import P from '../../data/params-2026.json';
import { cellText } from '../../lib/text';
const en = (v: string) => cellText(v, 'en');

// Chiffres lus dans les données : ce mois et chaque mois d'octobre depuis 2016.
const COLS: Country[] = ['ROW', 'CN', 'IN', 'MX', 'PH'];
const val = (v: string) => (v === 'C' ? Infinity : v === 'U' ? -Infinity : isoToDays(v));
/** 1 si EB-3 est devant, -1 si EB-2 est devant, 0 si égalité. */
const lead = (k: Country, i?: number) => Math.sign(val(cellAt('EB3', k, 'FAD', i)) - val(cellAt('EB2', k, 'FAD', i)));
const OCT_FROM = 2016;
const OCTS = MONTHS.filter((m) => m.endsWith('-10') && Number(m.slice(0, 4)) >= OCT_FROM);
const octIdx = OCTS.map((m) => MONTHS.indexOf(m));
const eb3AheadIn = octIdx.filter((i) => lead('IN', i) > 0).length;
const eb2AheadIn = octIdx.filter((i) => lead('IN', i) < 0).length;
const eb3AheadCn = octIdx.filter((i) => lead('CN', i) > 0).length;
const eb2AheadCn = octIdx.filter((i) => lead('CN', i) < 0).length;
// Mois depuis octobre 2015 où l'ordre EB-2 / EB-3 indien s'inverse.
const since = MONTHS.indexOf('2015-10');
let flipsIn = 0;
for (let i = since + 1; i < MONTHS.length; i++) { const a = lead('IN', i - 1), b = lead('IN', i); if (a !== 0 && b !== 0 && a !== b) flipsIn++; }
const gapIn = (val(cellAt('EB3', 'IN', 'FAD')) - val(cellAt('EB2', 'IN', 'FAD'))) / 30.4375;
const gapRow = (val(cellAt('EB2', 'ROW', 'FAD')) - val(cellAt('EB3', 'ROW', 'FAD'))) / 30.4375;
const eb2RowMove = moveDays('EB2', 'ROW') ?? 0;
const i140 = P.fees.i140;

export default definePage({
  id: "guide-eb2-to-eb3", group: "guides", order: 708,
  mini: "downgrade",
  related: ["eb-2-india", "eb-3-india", "eb-2-china", "eb-3-china", "guide-portability"],
  sources: ["vbIndex", "aosCharts", "pmPdRetention", "pmTransferBasis", "g1055"],
  en: {
    path: "guides/eb-2-to-eb-3-downgrade",
    nav: 'EB-2 to EB-3 downgrade', card: 'When the EB-3 line for your country is ahead of EB-2, and what moving down a category involves.',
    title: 'EB-2 to EB-3 Downgrade 2026: Cutoffs and the Second I-140',
    description: 'EB-2 and EB-3 cutoffs side by side for every country column, each October since 2016, and how a second I-140 and a basis transfer keep your priority date.',
    h1: 'EB-2 to EB-3: when the lower category is the shorter line',
    intro: 'Choose your country of chargeability and enter your priority date to see which of the two lines is ahead for you in this month’s Visa Bulletin.',
    resume: `A downgrade from EB-2 to EB-3 means an employer files a second Form I-140 for the same worker in the third preference, so that the worker can use whichever line is moving faster. The USCIS Policy Manual lets the beneficiary of an approved petition keep its priority date on a later petition, so the EB-3 filing does not restart the wait. If an I-485 is already pending, the applicant can ask USCIS in writing to transfer it to the new petition; the decision is discretionary, a visa must be immediately available on the date of the request, and no new I-485 or filing fee is required. The comparison changes over time. In the ${LATEST.slice(0, 4)} bulletins, EB-3 India stands at ${en(cellAt('EB3', 'IN', 'FAD'))} against ${en(cellAt('EB2', 'IN', 'FAD'))} for EB-2 India, while for the rest of the world EB-2 is ahead. In the Octobers since ${OCT_FROM}, EB-3 India led in ${eb3AheadIn} and EB-2 India in ${eb2AheadIn}.`,
    faqs: [
      { q: 'Does an EB-2 to EB-3 downgrade keep my original priority date?', a: 'Yes, once the earlier EB-2 petition has been approved. The USCIS Policy Manual says the beneficiary of an approved petition keeps its priority date for later petitions, unless the approval is revoked for fraud or willful misrepresentation, the labor certification is revoked, or the approval rested on a material error. The new EB-3 petition must still qualify on its own.' },
      { q: 'Can I switch my pending I-485 from EB-2 to EB-3 without refiling?', a: 'You can ask. USCIS calls this a transfer of underlying basis: a written request, made while the I-485 is still pending, to rely on a different petition. The Policy Manual says it is discretionary, that a visa must be immediately available in the new category on the date of the request, and that no new adjustment application or filing fee is needed.' },
      { q: 'Is EB-3 ahead of EB-2 for every country in the Visa Bulletin?', a: 'No, and it changes. This month the comparison differs by column, as the table on this page shows. For the rest of the world, EB-2 has been ahead in recent bulletins, while the Indian and Chinese lines have swapped places several times since 2015. Check the current cutoffs before treating either category as the faster one.' },
      { q: 'What does a second I-140 for an EB-3 downgrade cost in 2026?', a: `The I-140 fee in the G-1055 schedule dated ${P.g1055_edition} applies again, since the EB-3 filing is a new petition. Legal fees and any premium processing are separate. Moving a pending I-485 onto the new petition carries no new adjustment fee, according to the USCIS Policy Manual, so the I-140 is the main government cost.` },
      { q: 'Can I keep both the EB-2 and the EB-3 petitions after a downgrade?', a: 'Nothing in the priority date rule forces the first petition to be withdrawn: the date comes from the earlier approval either way. A pending I-485 rests on one petition at a time, though, and moving it needs a transfer request. The Policy Manual also says the new petition must be properly filed before the original one is withdrawn, denied or revoked.' },
      { q: 'Why would EB-3 India move faster than EB-2 India in some years?', a: 'Each preference has its own share of the yearly employment numbers, and the Indian demand in each is different. EB-3 also receives numbers that EB-2 does not use, under the order printed in the bulletin. When the Indian EB-2 line is longer than the EB-3 line in a given year, the EB-3 cutoff can pull ahead, and later fall behind again.' },
      { q: 'Does a downgrade to EB-3 change the Dates for Filing chart I use?', a: 'The chart USCIS designates applies to all employment categories alike in a given month. What changes is the date in your row: the EB-3 column for your country on that chart may be earlier or later than the EB-2 one. USCIS posts the chart choice each month on its adjustment of status filing charts page.' },
    ],
    body: (h) => `
<h2>Why a lower category can be a shorter wait</h2>
<p>EB-2 is the preference for advanced degrees and exceptional ability, EB-3 the one for skilled workers and professionals. The labels suggest a ranking, but each category has its own share of the yearly employment numbers and its own queue of applicants from each country. When more people born in a country are waiting in EB-2 than in EB-3, the EB-3 cutoff can sit later than the EB-2 one. The so-called downgrade is a response to that: the worker who qualifies for EB-2 also qualifies for EB-3, and the employer files in the line that happens to move faster.</p>
<h2>This month, side by side</h2>
<p>The table reads the ${h.month(LATEST)} bulletin for each chargeability column. A later date is a shorter wait for the same priority date.</p>
${h.table(
  ['Chargeability', 'EB-2 Final Action', 'EB-3 Final Action', 'EB-2 Date for Filing', 'EB-3 Date for Filing', 'Ahead (Final Action)'],
  COLS.map((k) => [COUNTRY_LABEL.en[k], h.cell(cellAt('EB2', k, 'FAD')), h.cell(cellAt('EB3', k, 'FAD')), h.cell(cellAt('EB2', k, 'DFF')), h.cell(cellAt('EB3', k, 'DFF')), lead(k) > 0 ? 'EB-3' : lead(k) < 0 ? 'EB-2' : 'Tied']),
  `EB-2 and EB-3 cutoffs by chargeability, ${h.month(LATEST)} Visa Bulletin`,
)}
<p>For an Indian applicant, the EB-3 cutoff is ${gapIn >= 0 ? 'later' : 'earlier'} than the EB-2 one by about ${h.num(Math.abs(Math.round(gapIn)))} months this month. For the rest of the world the order is reversed, and EB-2 leads by about ${h.num(Math.abs(Math.round(gapRow)))} months, even after the ${h.num(Math.abs(Math.round(eb2RowMove)))}-day ${eb2RowMove < 0 ? 'retrogression' : 'move'} of EB-2 for the rest of the world in the October issue. ${['MX', 'PH'].filter((k) => cellAt('EB2', k as Country, 'FAD') === cellAt('EB2', 'ROW', 'FAD')).length === 2 ? 'Mexico and the Philippines share the worldwide EB-2 date this month' : 'Mexico and the Philippines do not both share the worldwide EB-2 date this month'}${cellAt('EB3', 'PH', 'FAD') !== cellAt('EB3', 'ROW', 'FAD') ? ', while the Philippines has an EB-3 date of its own.' : ', and both also follow the worldwide EB-3 date.'}</p>
<h2>Every October since ${OCT_FROM}</h2>
<p>October is the first bulletin of each fiscal year, which makes it a fair point of comparison from one year to the next. The table puts the two categories next to each other for the columns where they differ most.</p>
${h.table(
  ['October', 'Rest of world EB-2', 'Rest of world EB-3', 'China EB-2', 'China EB-3', 'India EB-2', 'India EB-3', 'Philippines EB-3'],
  octIdx.map((i, k) => [OCTS[k].slice(0, 4), h.cell(cellAt('EB2', 'ROW', 'FAD', i)), h.cell(cellAt('EB3', 'ROW', 'FAD', i)), h.cell(cellAt('EB2', 'CN', 'FAD', i)), h.cell(cellAt('EB3', 'CN', 'FAD', i)), h.cell(cellAt('EB2', 'IN', 'FAD', i)), h.cell(cellAt('EB3', 'IN', 'FAD', i)), h.cell(cellAt('EB3', 'PH', 'FAD', i))]),
  `Final Action Dates in each October bulletin, ${OCT_FROM} to ${LATEST.slice(0, 4)}`,
)}
<p>Read down the Indian columns and the lead changes hands: EB-3 India was ahead in ${h.num(eb3AheadIn)} of these Octobers and EB-2 India in ${h.num(eb2AheadIn)}. Counting every monthly bulletin since October 2015, the Indian order flipped ${h.num(flipsIn)} times. The Chinese columns show the same instability, with EB-3 China ahead in ${h.num(eb3AheadCn)} Octobers and EB-2 China in ${h.num(eb2AheadCn)}. For the rest of the world, both categories were current for years, then both acquired cutoffs, and the gap between them has stayed modest. A downgrade decided on one October’s numbers can look wrong a year later.</p>
<h2>Not the same line as EB-3 Other Workers</h2>
<p>The bulletin prints a separate row for EB-3 Other Workers, a subgroup inside the third preference with its own cutoff. The ${h.src('vbIndex', 'Visa Bulletin')} explains that no more than 10,000 of the third-preference numbers go to that subgroup, and its cutoff often trails the main EB-3 row: for the rest of the world it reads ${h.cell(cellAt('EW', 'ROW', 'FAD'))} this month, against ${h.cell(cellAt('EB3', 'ROW', 'FAD'))} for skilled workers and professionals. A downgrade from EB-2 aims at the skilled-worker or professional row, the one that matches a job already offered at the advanced-degree level. Reading the wrong row is an easy mistake when comparing the two categories. ${h.a('eb-3-other-workers', 'More on EB-3 Other Workers')}.</p>
<h2>How the switch works on paper</h2>
<p>The mechanics rest on two USCIS rules. The first is priority date retention, set out in the ${h.src('pmPdRetention', 'Policy Manual chapter on employment-based evidence')}: once a petition is approved, the beneficiary keeps its priority date for later petitions, except after a revocation for fraud or willful misrepresentation, a revoked labor certification, or a material error. An EB-3 petition filed after an approved EB-2 petition therefore carries the older date.</p>
<p>The second is the ${h.src('pmTransferBasis', 'transfer of underlying basis')}, which matters only when an I-485 is already pending. The applicant asks USCIS in writing to move the pending application to the new petition. The Policy Manual sets several conditions:</p>
<ul>
<li>the I-485 is still pending, since a request received on or after the final decision is denied;</li>
<li>a visa is immediately available in the new category on the date the request is filed;</li>
<li>the new petition is properly filed before the original one is withdrawn, denied or revoked, and approved first where the new basis requires it;</li>
<li>the applicant shows eligibility in the new category, and no new ground of inadmissibility or bar appears.</li>
</ul>
<p>USCIS treats simple transfers between the first three employment categories as a recognized case, but the decision stays discretionary. No new adjustment application and no new filing fee are required for the transfer itself.</p>
<h2>The costs and the trade-offs</h2>
<p>The second petition is a new I-140, so the employer pays the I-140 fee again: ${h.usd(i140.paper)} on paper or ${h.usd(i140.online)} online in the ${h.src('g1055', 'G-1055 schedule')}, before any legal fees. A downgrade also commits the case to the EB-3 line, which can retrogress on its own schedule. If the EB-2 line overtakes again, a further transfer back is a new request, with the same conditions. Some applicants keep both petitions on file to preserve that choice; others prefer one clean case. The calculator above compares the two lines for your date this month, and the ${h.a('priority-date-calculator', 'full calculator')} adds the history and our tested forecast range for each. Whether a second petition makes sense for a given job and employer is a question for an immigration attorney, not for a table.</p>`,
  },
});
