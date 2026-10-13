import { definePage } from '../../lib/guide-types';
import { cellAt, distinctShare, LATEST, CAT_SHORT, type Country } from '../../lib/engine/cases';
import P from '../../data/params-2026.json';
import VB from '../../data/visa-bulletin.json';

// Limites et parts : params-2026.json > limits (relues sur le bulletin d'octobre 2026).
const L = P.limits;
const combined = L.family + L.employment;
const capCalc = Math.round(combined * L.perCountryShare);
const depCalc = Math.round(combined * L.dependentShare);
// Colonnes du bulletin dans l'archive (294 bulletins).
type Dom = 'family' | 'employment';
function colStats(k: string, dom: Dom) {
  const hits = VB.bulletins.filter((b) => ((b.cols as Partial<Record<Dom, string[]>>)[dom] ?? []).includes(k));
  return { n: hits.length, first: hits[0]?.month ?? null, last: hits[hits.length - 1]?.month ?? null };
}
const SV = colStats('SV', 'employment');
const VN = colStats('VN', 'employment');
const TOTAL = VB.bulletins.length;
const CATS = ['F1', 'F2B', 'F3', 'F4', 'EB1', 'EB2', 'EB3', 'EB5'] as const;
const FOUR: Country[] = ['MX', 'PH', 'IN', 'CN'];
const yrs = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const f4Mx = cellAt('F4', 'MX', 'FAD'), f4Row = cellAt('F4', 'ROW', 'FAD');
const eb2In = cellAt('EB2', 'IN', 'FAD'), eb2Row = cellAt('EB2', 'ROW', 'FAD');

export default definePage({
  id: "guide-per-country", group: "guides", order: 709,
  mini: "perCountry",
  related: ["guide-chargeability", "country-india", "country-mexico", "country-philippines", "country-china"],
  sources: ["ina203", "vbOct2026", "vbIndex", "visaPriority"],
  en: {
    path: "guides/per-country-limit-and-spillover",
    nav: 'Per-country limit', card: 'The 7% cap on any one country, how unused numbers fall to the next category, and why four countries get their own column.',
    title: 'Per-Country Limit 2026: The 7% Cap, Spillover and 25,620',
    description: 'How the 7% per-country cap of 25,620 visas is computed, how unused numbers fall from one preference to the next, and why four countries get their own dates.',
    h1: 'The 7% per-country limit and how unused visas spill over',
    intro: 'Change the yearly family and employment limits to see how the per-country cap and the dependent-area cap follow, then read why some countries outgrow them.',
    resume: `No single country may receive more than 7% of the family-sponsored and employment-based preference visas available in a year. The Visa Bulletin sets the family limit at ${L.family.toLocaleString('en-US')} and the employment limit at a minimum of ${L.employment.toLocaleString('en-US')}, so the combined total is ${combined.toLocaleString('en-US')} and the per-country cap is ${L.perCountry.toLocaleString('en-US')} visas; a dependent area is capped at 2%. The cap applies to the family and employment preferences together, not to each category separately. When demand from a country is larger than its share, the State Department gives that country its own column, and its cutoffs fall behind the worldwide dates. The October 2026 bulletin lists four such oversubscribed areas: mainland China, India, Mexico and the Philippines. Unused numbers do not vanish: the bulletin assigns what one preference does not need to the next, such as EB-2 numbers not used by EB-1, and USCIS notes that annual limits can be exceeded with visas left from the previous year.`,
    faqs: [
      { q: 'How is the 25,620 per-country limit calculated?', a: `It is 7% of the combined preference limits. The Visa Bulletin uses a family-sponsored limit of ${L.family.toLocaleString('en-US')} and an employment-based level of at least ${L.employment.toLocaleString('en-US')}, which add up to ${combined.toLocaleString('en-US')}. Seven percent of that total gives ${L.perCountry.toLocaleString('en-US')}. If either annual level rises in a year, the per-country figure rises with it.` },
      { q: 'Does the per-country limit apply to each green card category separately?', a: 'No. The 7% share is counted on the family and employment preference visas together for a country of chargeability, not category by category. Once a country reaches it, the bulletin explains that section 202(e) governs how that country’s numbers are spread across the categories, which is why an oversubscribed country often has later dates in several rows at once.' },
      { q: 'Are spouses and children of U.S. citizens counted in the per-country limit?', a: 'The 7% share applies to preference immigrants, the family-sponsored and employment-based categories printed in the Visa Bulletin. Immediate relatives of U.S. citizens, such as spouses and unmarried children under 21, are not in those charts and have no cutoff date. The bulletin only lists the preference categories that the limits apply to.' },
      { q: 'What is visa spillover in the employment categories?', a: 'It is the rule that numbers one preference does not use pass to another. The Visa Bulletin describes EB-1 as receiving numbers not required by EB-4 and EB-5, EB-2 as receiving numbers not required by EB-1, and EB-3 as receiving numbers not required by EB-1 and EB-2. How many numbers actually fall down depends on demand in each year.' },
      { q: 'Which countries are oversubscribed in the October 2026 Visa Bulletin?', a: 'The October 2026 bulletin names four oversubscribed chargeability areas: mainland China, India, Mexico and the Philippines. They have their own columns in the charts. Other countries, including some that had their own employment column in earlier years, are charged to the worldwide column, labeled all chargeability areas except those listed.' },
      { q: 'What is the dependent area limit in the Visa Bulletin?', a: `It is a separate cap of 2% for a dependent area, a territory that depends on an independent country rather than being one. The October 2026 bulletin sets it at 2%, or ${depCalc.toLocaleString('en-US')} visas, of the same combined preference total used for the per-country cap. It is printed next to the 7% per-country share in the opening paragraphs of each bulletin.` },
      { q: 'Can unused family-based visas raise the employment limit the next year?', a: 'USCIS says the annual limits may be exceeded when certain immigrant visas from the previous fiscal year were not fully used, and the bulletin itself describes the employment level as at least 140,000, not exactly that figure. The exact recalculation is made each year by the government; we only report the limits the bulletin prints, currently those for fiscal year 2027.' },
    ],
    body: (h) => `
<h2>The arithmetic behind the cap</h2>
<p>Section 202 of the ${h.src('ina203', 'Immigration and Nationality Act')} limits how many preference visas any one country may use in a year. The ${h.src('vbOct2026', 'October 2026 Visa Bulletin')} prints the figures it works with in its opening paragraphs. The table rebuilds them from those numbers.</p>
${h.table(
  ['Item', 'Visas per year', 'Rule'],
  [
    ['Family-sponsored preference limit', L.family, 'annual minimum printed in the bulletin'],
    ['Employment-based preference level', L.employment, 'at least this number'],
    ['Combined preference total', combined, 'family plus employment'],
    [`Per-country cap (${h.pct(L.perCountryShare)})`, capCalc, `printed as ${h.num(L.perCountry)}`],
    [`Dependent area cap (${h.pct(L.dependentShare)})`, depCalc, 'printed in the October 2026 bulletin'],
  ],
  'Annual preference limits and the caps derived from them, Visa Bulletin for October 2026',
  ['l', 'r', 'l'],
)}
<p>Two details are often missed. The cap is shared by the family and employment preferences of one country: an Indian brother of a citizen in F4 and an Indian engineer in EB-2 draw on the same national allotment. And the cap is a ceiling, not a guarantee. A country with little demand uses far less than its share, and its applicants simply follow the worldwide dates.</p>
<h2>What happens when a country goes over</h2>
<p>The bulletin explains that the prorating provisions of section 202(e) apply to a country that reaches its limit, and that applicants are then reached in the order in which their petitions were filed. In practice that produces a separate column: the State Department sets a cutoff for that country in each category where its demand is too high, and leaves the worldwide date for everyone else. The column follows the country of chargeability, which ${h.src('visaPriority', 'USCIS')} describes as usually the country of birth, not the passport or the place of residence. ${h.a('guide-chargeability', 'How chargeability is decided')}.</p>
<p>The effect can be large. This month F4 for Mexico stands at ${h.cell(f4Mx)}, about ${h.num(yrs(f4Mx, f4Row), 1)} years behind the worldwide F4 date of ${h.cell(f4Row)}. EB-2 India is at ${h.cell(eb2In)}, about ${h.num(yrs(eb2In, eb2Row), 1)} years behind the rest of the world at ${h.cell(eb2Row)}. The rules and the degree are the same; the country of birth changes the line.</p>
<h2>Why these four countries have a column</h2>
<p>The October 2026 bulletin names its oversubscribed areas: mainland China, India, Mexico and the Philippines. They are not oversubscribed in the same places. The table shows, for each category, the share of bulletins since October 2015 in which the country’s date differed from the worldwide date.</p>
${h.table(
  ['Category', ...FOUR.map((k) => ({ MX: 'Mexico', PH: 'Philippines', IN: 'India', CN: 'China (mainland)' } as Record<string, string>)[k])],
  CATS.map((c) => [CAT_SHORT[c], ...FOUR.map((k) => h.pct(distinctShare(c, k)))]),
  `Share of bulletins with a separate date, October 2015 to ${h.month(LATEST)}`,
  ['l', 'r', 'r', 'r', 'r'],
)}
<p>The pattern splits in two. Mexico and the Philippines are family-migration countries: their own dates appear in essentially every family bulletin for F1, F2B, F3 and F4, while their employment rows mostly follow the worldwide line. India and mainland China are the reverse: their family rows track the worldwide dates in almost every month, apart from F4 India, and their EB-2 and EB-3 rows have been separate in almost every bulletin since 2015, with EB-1 and EB-5 separate for part of the period. Each country’s column exists because of where its demand is concentrated.</p>
<h2>Columns that came and went</h2>
<p>The list is not permanent. In our archive of ${h.num(TOTAL)} bulletins, an employment column for El Salvador, Guatemala and Honduras appears in ${h.num(SV.n)} issues, from ${SV.first ? h.month(SV.first) : '-'} to ${SV.last ? h.month(SV.last) : '-'}, and a Vietnam column in ${h.num(VN.n)}, from ${VN.first ? h.month(VN.first) : '-'} to ${VN.last ? h.month(VN.last) : '-'}. Mainland China has had its own family column only since ${h.month(colStats('CN', 'family').first ?? '2005-01')}. In the bulletin’s own terms, a column marks an oversubscribed chargeability area, and the list is revised as demand changes. ${h.a('country-el-salvador-guatemala-honduras', 'The Central American column')}.</p>
<h2>Spillover: where unused numbers go</h2>
<p>Within each family of categories, the bulletin assigns the numbers one preference does not use to another. On the employment side, EB-1 receives numbers not required by EB-4 and EB-5, EB-2 receives numbers not required by EB-1, and EB-3 receives numbers not required by EB-1 and EB-2. On the family side, F1 receives numbers not required for F4, F2 receives unused F1 numbers, F3 those not required by F1 and F2, and F4 those not required by the first three. The flow is why a quiet year in EB-1 can speed up EB-2 for countries whose dates are held back.</p>
<p>A second kind of spillover crosses fiscal years. USCIS notes on its ${h.src('visaPriority', 'visa availability page')} that the annual limits may be exceeded when certain immigrant visas from the previous fiscal year were not fully used. The bulletin, for its part, describes the employment level as at least ${h.num(L.employment)} rather than as a fixed number. We do not estimate those recalculations; we report the limits the ${h.src('vbIndex', 'bulletin')} prints, and the forecasts on this site learn from how the cutoffs actually moved.</p>
<h2>A worked example: when the employment level rises</h2>
<p>Because the cap is a percentage, it moves with the totals. Suppose a year in which numbers carried over from the previous year lift the employment level by 20,000 above its minimum, to ${h.num(L.employment + 20_000)}. The combined total becomes ${h.num(combined + 20_000)}, and 7% of it is ${h.num(Math.round((combined + 20_000) * L.perCountryShare))}, or ${h.num(Math.round((combined + 20_000) * L.perCountryShare) - L.perCountry)} more visas for each country than the printed ${h.num(L.perCountry)}. That is a real increase for a country at the limit, but a small one next to queues measured in years. The mini calculator at the top of this page runs the same arithmetic for any pair of limits; the figures are illustrations, not a forecast of a coming year.</p>
<h2>Three common misreadings</h2>
<ul>
<li><strong>Citizenship decides the column.</strong> It is the country of chargeability, normally the country of birth. A person born in India who holds another passport is still charged to India unless an exception applies.</li>
<li><strong>Each category has its own 7%.</strong> The share covers the family and employment preferences of a country together, then section 202(e) spreads that country’s numbers across categories.</li>
<li><strong>A separate column is a penalty.</strong> It is a consequence of demand. The same country can follow the worldwide date in one category and lag far behind in another in the same bulletin, as the table above shows.</li>
</ul>
<h2>What the cap means for a single applicant</h2>
<p>For one person the cap is not something to calculate but a column to read. Find your category, find the column for your country of chargeability, and compare your priority date with that date, not with the worldwide one. Where a spouse was born in a country with a shorter line, cross-chargeability can sometimes move a whole family to that column; the rules are narrow and worth checking with an immigration attorney or a DOJ-accredited representative.</p>`,
  },
});
