import { definePage } from '../../lib/guide-types';
import PARAMS from '../../data/params-2026.json';
import { cellAt, series, evaluate, MONTHS, LATEST, CAT_SHORT, COUNTRY_LABEL, QUEUE_CATS, COUNTRIES, type Cat, type Country } from '../../lib/engine/cases';
import { isoToDays, MONTH_DAYS, CURRENT } from '../../lib/engine/forecast';
import { monthName } from '../../lib/text';

// Tableau imposé par USCIS ce mois (params-2026.json > aosChart, lu sur la page USCIS « filing charts »).
const A = PARAMS.aosChart;
const chartName = (c: string) => (c === 'DFF' ? 'Dates for Filing' : 'Final Action Dates');
const latest = monthName(LATEST, 'en');
const reviewed = A.reviewed;

// Cases montrées : écart entre les deux tableaux ce mois, en mois.
type Q = Exclude<Cat, 'IR'>;
const CASES: Array<[Q, Country]> = [['F1', 'ROW'], ['F2A', 'MX'], ['F2B', 'MX'], ['F3', 'PH'], ['F4', 'IN'], ['EB1', 'IN'], ['EB2', 'ROW'], ['EB2', 'IN'], ['EB3', 'CN'], ['EB4', 'ROW'], ['EB5', 'CN']];
const gap = (fad: string, dff: string) => (fad === 'C' || fad === 'U' || dff === 'U' ? null : dff === 'C' ? Infinity : (isoToDays(dff) - isoToDays(fad)) / MONTH_DAYS);
const rows = CASES.map(([c, k]) => { const fad = cellAt(c, k, 'FAD'), dff = cellAt(c, k, 'DFF'); return { c, k, fad, dff, g: gap(fad, dff) }; });
const finite = rows.filter((r) => r.g !== null && Number.isFinite(r.g)) as Array<typeof rows[number] & { g: number }>;
const widest = finite.reduce((a, b) => (b.g > a.g ? b : a));
const narrowest = finite.reduce((a, b) => (b.g < a.g ? b : a));

// Depuis octobre 2015 : mois où la Final Action Date dépassait la Date for Filing (dédoublonné par catégorie et mois).
const i0 = MONTHS.indexOf('2015-10');
const flips: Array<{ c: Q; k: Country; m: string; fad: string; dff: string }> = [];
const seen = new Set<string>();
for (const c of QUEUE_CATS) for (const k of COUNTRIES) {
  const F = series(c, k, 'FAD'), D = series(c, k, 'DFF');
  for (let i = i0; i < MONTHS.length; i++) {
    const a = F[i], b = D[i];
    if (a === null || b === null || a === CURRENT || b === CURRENT || !(a > b)) continue;
    const id = `${c}|${MONTHS[i]}|${a}`;
    if (seen.has(id)) continue;
    seen.add(id);
    flips.push({ c, k, m: MONTHS[i], fad: cellAt(c, k, 'FAD', i), dff: cellAt(c, k, 'DFF', i) });
  }
}
const dffMonths = MONTHS.length - i0;
// Exemple : EB-2 Inde, date de priorité au milieu de l'écart entre les deux tableaux.
const inFad = cellAt('EB2', 'IN', 'FAD'), inDff = cellAt('EB2', 'IN', 'DFF');
const midIso = new Date(((isoToDays(inFad) + isoToDays(inDff)) / 2) * 86_400_000).toISOString().slice(0, 10);
const mid = evaluate('EB2', 'IN', midIso);

export default definePage({
  id: "guide-final-action-vs-dates-for-filing", group: "guides", order: 701,
  mini: "whichChart",
  related: ["priority-date-calculator", "visa-bulletin", "guide-priority-date", "guide-portability", "guide-aos-vs-consular"],
  sources: ["vbIndex", "vbOct2026", "aosCharts", "visaPriority", "i485Form"],
  en: {
    path: "guides/final-action-dates-vs-dates-for-filing",
    nav: 'Final Action vs Dates for Filing', card: 'Two charts in every Visa Bulletin: which one USCIS lets you file with this month, and what each one decides.',
    title: 'Final Action Dates vs Dates for Filing: Which Chart 2026',
    description: 'Final Action Dates or Dates for Filing: what each Visa Bulletin chart decides, which one USCIS designates for Form I-485 this month, and how far apart they sit.',
    h1: 'Final Action Dates or Dates for Filing: which chart applies to you',
    intro: 'Every Visa Bulletin prints two cutoffs per category; one decides when a green card can be approved, the other when the paperwork may go in, and USCIS picks which one counts each month.',
    resume: `Since October 2015 each Visa Bulletin has carried two charts. The Final Action Dates chart says when a visa number can actually be issued: only applicants whose priority date is earlier than that cutoff can be approved. The Dates for Filing chart is earlier in the process: applicants abroad with a priority date before it may send their documents to the National Visa Center, and applicants inside the United States may file Form I-485 with it, but only in a month when USCIS says so on its Adjustment of Status Filing Charts page. For ${latest}, USCIS designated the ${chartName(A.family)} chart for all family-sponsored categories and the ${chartName(A.employment)} chart for all employment-based categories. One more rule from that USCIS page: when a category is current on the Final Action Dates chart, or its Final Action Date is later than its Date for Filing, applicants may file with the Final Action Dates chart that month. The approval itself always waits for the Final Action Date.`,
    faqs: [
      { q: 'Who decides each month whether the Dates for Filing chart can be used for the I-485?', a: 'USCIS, not the State Department. The bulletin itself sends adjustment applicants to the USCIS website to check. USCIS says it expects to designate one of the two charts each month, usually within a week of the bulletin’s publication, and to allow Dates for Filing when it sees more visas than known applicants for the rest of the fiscal year.' },
      { q: 'If I file my I-485 under Dates for Filing, can it be approved right away?', a: 'No. Filing early puts the application in the queue at USCIS, where it can be reviewed, but a green card can only be approved once a visa number is available, which means your priority date must be earlier than the Final Action Date for your category and country of chargeability. Until then the file stays pending, sometimes for years.' },
      { q: 'What do the Dates for Filing chart and the National Visa Center have to do with each other?', a: 'For people outside the United States, the Dates for Filing chart is the State Department’s signal to start documents. The bulletin says applicants with a priority date earlier than that date may assemble and submit required documents to the National Visa Center after they receive its instructions. The consular interview still depends on the Final Action Date.' },
      { q: 'Can the Final Action Date ever be later than the Date for Filing?', a: `It is rare but it happens, and USCIS has a rule for it: in that month applicants may file with the Final Action Dates chart. Since the second chart appeared in October 2015 it has happened only a handful of times, counting each category once when several countries shared the same dates. The table on this page lists every instance we found in the archive.` },
      { q: 'Does the Dates for Filing chart matter for the CSPA age of a child?', a: 'Not for the age itself. The USCIS Policy Manual uses the Final Action Dates chart to fix the date a visa becomes available for the Child Status Protection Act, with a separate rule for applications filed before August 15, 2025. A child may still file early under Dates for Filing; the CSPA calculator on this site uses the Final Action month.' },
      { q: 'Why do some categories show the same date on both Visa Bulletin charts?', a: 'Because the State Department sets each chart on its own, from the demand it expects. When it sees little room to move ahead of approvals, it prints a Date for Filing only days after the Final Action Date, as it does this month for several worldwide family categories. A wide gap usually means it expects the Final Action Date to advance in the coming months.' },
      { q: 'What happens to an I-485 filed under Dates for Filing if the Final Action Date retrogresses?', a: 'Approval still needs a visa number, so it cannot happen while your priority date is not earlier than the Final Action Date. USCIS describes retrogression as the result of a category or country using up, or nearly using up, its annual limit, and says the new supply on October 1 usually, but not always, brings dates back. What it means for your own file is a question for a licensed attorney.' },
    ],
    body: (h) => `
<h2>Two charts, two different questions</h2>
<p>The ${h.src('vbIndex', 'Visa Bulletin')} answers two questions for each preference category and each oversubscribed country. The Final Action Dates chart answers “can a visa be issued now?”. In the bulletin’s own words, numbers are authorized only for applicants whose priority date is earlier than the date listed; “C” means current and “U” means no numbers at all. The Dates for Filing chart answers “can the paperwork start?”. It was added in October 2015 and sits ahead of the first chart, sometimes by days, sometimes by years.</p>
<p>The two dates mean different things for people in different places. Outside the United States, the Dates for Filing chart tells the National Visa Center who may submit documents. Inside the country, it may let someone file Form I-485, but only if USCIS allows it that month. Approval, whether at a consulate or at a USCIS office, always waits for the Final Action Date.</p>
<h2>How USCIS picks the chart each month</h2>
<p>The bulletin itself does not tell adjustment applicants which chart to use; it points them to the ${h.src('aosCharts', 'USCIS Adjustment of Status Filing Charts page')}. USCIS explains its test there: when it judges that more visas are available than known applicants for the rest of the fiscal year, it says you may use the Dates for Filing chart; otherwise it says you must use the Final Action Dates chart. It expects to post that designation within a week of the bulletin’s publication, which is why the first days of a new bulletin can be confusing.</p>
<p>For ${h.month(A.month)}, the page says family-sponsored applicants must use the ${chartName(A.family)} chart and employment-based applicants the ${chartName(A.employment)} chart. We read it on ${h.date(reviewed)} and read it again with every new bulletin; the calculators on this site use that designation, never a guess.</p>
<h2>How far apart the charts sit this month</h2>
<p>The distance between the two dates is the size of the waiting room: people whose priority date falls between them can file but not yet be approved. Here is that distance for a few cases where it matters, from the ${h.month(LATEST)} bulletin.</p>
${h.table(['Case', 'Final Action Date', 'Date for Filing', 'Head start'], rows.map((r) => [`${CAT_SHORT[r.c]} ${COUNTRY_LABEL.en[r.k]}`, h.cell(r.fad), h.cell(r.dff), r.g === null ? 'n/a' : r.g === Infinity ? 'filing chart current' : r.g < 1 ? `${h.num(Math.round(r.g * MONTH_DAYS))} days` : `${h.num(r.g, 0)} months`]), `Visa Bulletin for ${latest}. Head start = Date for Filing minus Final Action Date.`, ['l', 'l', 'l', 'r'])}
<p>The widest gap in this list is ${CAT_SHORT[widest.c]} ${COUNTRY_LABEL.en[widest.k]}, about ${h.num(widest.g, 0)} months, and the narrowest is ${CAT_SHORT[narrowest.c]} ${COUNTRY_LABEL.en[narrowest.k]}, ${narrowest.g < 1 ? `only ${h.num(Math.round(narrowest.g * MONTH_DAYS))} days` : `about ${h.num(narrowest.g, 0)} months`}. A gap of a few days, as in several worldwide family categories, means the filing chart buys almost nothing. A gap of a year or more means that thousands of people can have a pending I-485 long before a number exists for them.</p>
<p>Take an EB-2 applicant born in India whose priority date is ${h.date(midIso)}, halfway between the two Indian dates. This month the answer to “can I file?” is ${mid.canFile ? 'yes' : 'no'}, ${A.employment === 'DFF' ? `because the Dates for Filing chart is designated and that date is earlier than ${h.cell(inDff)}` : 'because USCIS designated only the Final Action Dates chart for employment cases'}. The answer to “can I be approved?” is ${mid.status === 'current' ? 'yes' : 'no'}, because the Final Action Date is still ${h.cell(inFad)}. The same person on the same day gets two different answers, and both are correct.</p>
<h2>The exception: when the Final Action Date is ahead</h2>
<p>USCIS adds one rule that is easy to miss. If a category is current on the Final Action Dates chart, or its Final Action Date is later than its Date for Filing, applicants in that category may file with the Final Action Dates chart in that month, even when the designated chart is Dates for Filing. The site’s eligibility check applies it: it compares your priority date with both dates and keeps whichever is later.</p>
<p>It does not happen often. Across the ${h.num(dffMonths)} bulletins since October 2015, here are the months in which the Final Action Date sat later than the Date for Filing.</p>
${h.table(['Case', 'Bulletin', 'Final Action Date', 'Date for Filing'], flips.map((f) => [`${CAT_SHORT[f.c]} ${COUNTRY_LABEL.en[f.k]}`, h.month(f.m), h.cell(f.fad), h.cell(f.dff)]), 'Each category is listed once per month when several countries shared the same dates.', ['l', 'l', 'l', 'l'])}
<p>In each of those months the filing chart had not kept pace with the final cutoff, and an applicant who looked only at the designated chart would have thought the door was closed when it was open.</p>
<h2>What a pending I-485 gives you while you wait</h2>
<p>Filing under Dates for Filing is worth something only because of what a pending application opens up in practice: a work permit request on Form I-765 at the reduced fee for applicants with a pending I-485, a travel document on Form I-131, and for employment cases the job flexibility described in the ${h.a('guide-portability', 'portability guide')}. The cost is real too: the ${h.a('i-485-fee', 'I-485 fee')} is paid up front, years before a possible approval in the longest queues. Whether to file in a given month is a decision for you and, ideally, a licensed immigration attorney or a DOJ-accredited representative; this page only explains what each chart allows.</p>
<h2>Consular cases follow a different rhythm</h2>
<p>If the person immigrating lives abroad, USCIS’s designation does not apply. The Dates for Filing chart instead triggers the National Visa Center’s instructions to gather civil documents, pay fees and submit the immigrant visa application. The interview is scheduled only when the Final Action Date has passed the priority date, and consulates do not publish their scheduling times, so this site does not estimate them. The ${h.a('guide-aos-vs-consular', 'adjustment or consular processing guide')} compares the two routes.</p>
<h2>Reading your own case</h2>
<p>The quick check above takes a category, a country of chargeability and a priority date, then tells you which chart USCIS designates this month, both cutoffs, whether an I-485 can be filed now and whether approval is possible now. The ${h.a('priority-date-calculator', 'priority date calculator')} goes further and estimates when the Final Action Date may reach you, with the error that method has shown in the past.</p>`,
  },
});
