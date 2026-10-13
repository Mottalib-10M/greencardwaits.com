import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';

// Règles lues dans params-2026.json > naturalization (Policy Manual, vol. 12, partie D, chap. 3 et 4).
const N = P.naturalization;
const DAYS5 = 1826, DAYS3 = 1096; // jours d'une période de 5 ans et de 3 ans (année bissextile comprise)
const breakDays = N.breakPresumedMonths * 30; // repère d'environ six mois, affiché en mois dans le texte
/** Effet d'un voyage sur la résidence continue, selon sa durée en jours. */
const tripEffect = (d: number) => (d >= 365 * N.breakYears ? 'broken, unless an approved Form N-470 covers it' : d > breakDays + 2 ? 'presumed broken, can be rebutted' : 'no presumption of a break');
// Scénarios illustratifs (période de 5 ans).
const SCEN = [
  { label: 'Ten trips of three weeks each', away: 210, longest: 21 },
  { label: 'One seven-month assignment abroad', away: 213, longest: 213 },
  { label: 'Frequent short trips adding up to 950 days', away: 950, longest: 60 },
  { label: 'One trip of thirteen months', away: 396, longest: 396 },
];

export default definePage({
  id: "guide-n400-residence", group: "guides", order: 711,
  mini: "n400Days",
  related: ["n-400-early-filing-calculator", "n-400-fee", "n-400-processing-time", "priority-date-calculator"],
  sources: ["n400Residence", "n400Presence", "n400Form"],
  en: {
    path: "guides/n-400-continuous-residence",
    nav: 'N-400 residence rules', card: 'Continuous residence and physical presence for citizenship: the day counts, the six-month and one-year trip rules.',
    title: 'N-400 Continuous Residence 2026: Trips, Days and Breaks',
    description: 'Continuous residence and physical presence for Form N-400: the 913 and 548 day counts, what a trip over six months or a year does, and how to rebut a break.',
    h1: 'Continuous residence and physical presence for the N-400',
    intro: 'Enter your total days abroad and your longest trip to check both naturalization tests at once, then read how USCIS treats long absences.',
    resume: `Naturalization on Form N-400 asks for two separate things, and an applicant must meet both. Continuous residence means living in the United States as a permanent resident for ${N.residenceYears} years before filing, or ${N.residenceYearsSpouse} years for a person married to and living with a U.S. citizen, with USCIS accepting the application up to ${N.earlyFilingDays} days early. Physical presence means having actually been in the country for at least half of that period: ${N.physicalPresenceDays5} days on the ${N.residenceYears}-year path and ${N.physicalPresenceDays3} days on the ${N.residenceYearsSpouse}-year path. The two tests fail in different ways. Many short trips can exhaust the days without touching residence, while one long trip can break residence even when the day count is fine. Under the USCIS Policy Manual, an absence of more than ${N.breakPresumedMonths} months but less than ${N.breakYears} year is presumed to break continuous residence, a presumption the applicant can rebut with evidence, and an absence of ${N.breakYears} year or more breaks it outright unless an approved Form N-470 preserves it.`,
    faqs: [
      { q: 'Does a trip of more than six months break continuous residence for the N-400?', a: 'It creates a presumption that residence was broken, not an automatic break. The USCIS Policy Manual lets the applicant rebut it with evidence from the time abroad, for example that the U.S. job was kept and no job was taken abroad, that immediate family stayed in the United States, or that the applicant kept full access to a U.S. home.' },
      { q: 'What happens to N-400 continuous residence after a trip of one year or more?', a: 'An absence of a year or more breaks continuous residence automatically, unless the applicant has an approved Form N-470 for qualifying work abroad. The applicant then needs a new period of residence. For the five-year path the Policy Manual describes waiting at least 4 years and 1 day after returning, and still overcoming the presumption from the absence.' },
      { q: 'Do the days I leave and return count as days in the U.S. for physical presence?', a: 'Yes. In the USCIS Policy Manual chapter on physical presence, both the day of departure and the day of return count as days present in the United States. Only full days spent abroad reduce the total. Keeping travel dates from passports, boarding passes or itineraries makes the count on the N-400 easy to check.' },
      { q: 'Can many short trips cause a problem for N-400 residence?', a: 'They can affect both tests. Short trips add up against the physical presence count of 913 or 548 days. The Policy Manual also says officers can look at whether several absences of under six months each, taken together, broke the continuity of residence, even though no single trip triggers the presumption.' },
      { q: 'Is my green card enough to prove physical presence for naturalization?', a: 'No. The Policy Manual says that holding a Permanent Resident Card does not by itself show that you were in the country. USCIS looks at documentation of actual presence and may also rely on your testimony. Records that place you in the United States, such as work, school or tax records, help support the dates you list.' },
      { q: 'Do I have to live in my state for a while before filing the N-400?', a: 'Yes. Besides the continuous residence period, the Policy Manual requires that the applicant has lived for three months in the state or USCIS service district that has jurisdiction over the application before filing. A recent move can therefore delay the filing date even when the residence and presence periods are already complete.' },
      { q: 'Does Form N-470 protect physical presence as well as residence?', a: 'Form N-470 is described in the Policy Manual chapter on continuous residence, for permanent residents working abroad in qualifying roles, such as for the U.S. government or certain U.S. companies. The physical presence chapter does not mention it, and approval does not prevent USCIS from finding that permanent residence was abandoned.' },
    ],
    body: (h) => `
<h2>Two tests that fail in different ways</h2>
<p>Most N-400 problems with travel come from treating residence and presence as one requirement. The ${h.src('n400Presence', 'Policy Manual chapter on physical presence')} says the two are interrelated but that each must be satisfied. Continuous residence asks whether you kept living in the United States, and long absences are what break it. Physical presence asks how many days you were actually in the country, and every day abroad counts against it, however short the trip.</p>
${h.table(
  ['Requirement', `${N.residenceYears}-year path`, `${N.residenceYearsSpouse}-year path (spouse of a U.S. citizen)`],
  [
    ['Continuous residence as a permanent resident', `${N.residenceYears} years`, `${N.residenceYearsSpouse} years`],
    ['Physical presence in the period', `${h.num(N.physicalPresenceDays5)} days`, `${h.num(N.physicalPresenceDays3)} days`],
    ['Approximate days in the period', h.num(DAYS5), h.num(DAYS3)],
    ['Days that can be spent abroad and still meet presence', h.num(DAYS5 - N.physicalPresenceDays5), h.num(DAYS3 - N.physicalPresenceDays3)],
    ['Earliest filing', `${N.earlyFilingDays} days before the ${N.residenceYears}-year mark`, `${N.earlyFilingDays} days before the ${N.residenceYearsSpouse}-year mark`],
    ['Residence in the state or service district', 'three months before filing', 'three months before filing'],
  ],
  'Naturalization residence and presence rules, USCIS Policy Manual, Volume 12, Part D',
  ['l', 'r', 'r'],
)}
<p>The third row is simple arithmetic on the rule: physical presence is half the period, so the other half may be spent abroad without failing the day count. That is a large margin, and it is why one long trip deserves as much attention as the total number of days away.</p>
<h2>What a single trip does to residence</h2>
<p>The ${h.src('n400Residence', 'Policy Manual chapter on continuous residence')} sorts absences by length. The rule is about each trip, not the total.</p>
${h.table(
  ['Length of one absence', 'Effect on continuous residence'],
  [
    [`Up to ${N.breakPresumedMonths} months`, tripEffect(30)],
    [`More than ${N.breakPresumedMonths} months, less than ${N.breakYears} year`, tripEffect(240)],
    [`${N.breakYears} year or more`, tripEffect(400)],
  ],
  'How one absence from the United States affects continuous residence',
)}
<p>Short trips are not entirely safe either. The Policy Manual says officers may still find that several absences of under six months each, taken together, broke the continuity of residence. A pattern of living mostly abroad and visiting the United States can raise the question even if no trip crosses the six-month line.</p>
<h2>Rebutting the six-month presumption</h2>
<p>An absence of more than ${N.breakPresumedMonths} months and less than ${N.breakYears} year shifts the burden to the applicant. The Policy Manual lists evidence that can rebut the presumption, without limiting it to these examples, documentation that during the absence:</p>
<ul>
<li>the applicant did not end U.S. employment and did not take a job abroad;</li>
<li>the applicant’s immediate family stayed in the United States;</li>
<li>the applicant kept full access to a U.S. home, or continued to own or lease one.</li>
</ul>
<p>Pay records from the U.S. employer, a lease or a mortgage statement, and school records for children who stayed behind are the kind of documents that match those three examples. The point is to show that life stayed anchored in the United States while you were away.</p>
<h2>Four travel histories, two tests</h2>
<p>The table applies both tests to four illustrative five-year histories. It uses the same thresholds as the calculator at the top of this page.</p>
${h.table(
  ['Travel history', 'Days abroad', 'Days present', `Presence (${h.num(N.physicalPresenceDays5)} needed)`, 'Residence, from the longest trip'],
  SCEN.map((s) => [s.label, s.away, DAYS5 - s.away, DAYS5 - s.away >= N.physicalPresenceDays5 ? 'met' : 'short', tripEffect(s.longest)]),
  'Illustrative travel over a five-year period',
  ['l', 'r', 'r', 'l', 'l'],
)}
<p>The third history shows the trap of frequent travel: no single trip is long, residence is not presumed broken, yet the day count falls short. The fourth shows the opposite: the day count is comfortable, but the thirteen-month trip ends the residence period.</p>
<h2>After a break: starting a new period</h2>
<p>A broken residence period does not end the path to citizenship; it restarts the clock. For an absence of a year or more on the five-year path, the Policy Manual describes waiting at least 4 years and 1 day after returning, and then still overcoming the presumption that the absence created; an applicant who waits 4 years and 6 months after reestablishing residence no longer faces that presumption. The three-year path for spouses of citizens uses 2 years and 1 day and 2 years and 6 months. Form N-470 can preserve residence for permanent residents working abroad in qualifying roles, but it must be approved, and the manual adds that approval does not stop USCIS from finding that permanent residence was abandoned.</p>
<h2>The Policy Manual’s own example</h2>
<p>The manual works through a case that shows how far a single trip can push a filing date. An applicant on the five-year path is abroad for eight months and returns on ${h.date('2018-08-01')}. If that applicant cannot rebut the presumption, a new period of residence has to be built, and the manual gives ${h.date('2023-02-01')} as the earliest date to apply again. Eight months away cost far more than eight months of waiting, because the clock restarted on return. Had the same applicant been able to show a kept job, family in the country and a home held throughout, the original period could have counted.</p>
<h2>The early filing window and the two tests</h2>
<p>USCIS accepts an N-400 up to ${N.earlyFilingDays} days before the ${N.residenceYears}-year or ${N.residenceYearsSpouse}-year mark. The window moves the filing date, not the requirements, so a long trip taken in the months before an early filing still has to fit both tests. The quick calculator above counts the whole five-year or three-year window and does not shorten it for an early filing, so it is a first check rather than a filing date. The ${h.a('n-400-fee', 'N-400 fee page')} lists what the application costs in 2026, and the ${h.a('n-400-processing-time', 'N-400 processing times')} show how long field offices currently take once the application is in.</p>
<h2>Counting days the way USCIS does</h2>
<p>The day you leave and the day you come back both count as days in the United States. Only the full days in between count as absence. The physical presence chapter also says that a green card alone does not prove presence: USCIS looks for documents and may rely on testimony. The ${h.src('n400Form', 'Form N-400')} asks about your time outside the United States, so building the list of trips from passport stamps and travel records before filing is the easiest way to see both tests clearly. The ${h.a('n-400-early-filing-calculator', 'early filing calculator')} turns your green card date and trips into a first filing date. For a history with a long absence, a rebuttal or an N-470, an immigration attorney or a DOJ-accredited representative can review the facts before you file.</p>`,
  },
});
