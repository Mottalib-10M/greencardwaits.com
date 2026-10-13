import { definePage } from '../../lib/guide-types';
import PARAMS from '../../data/params-2026.json';
import { cellAt, distinctShare, LATEST, CAT_SHORT, COUNTRY_LABEL, type Cat, type Country } from '../../lib/engine/cases';
import { isoToDays, MONTH_DAYS } from '../../lib/engine/forecast';
import { monthName, cellText } from '../../lib/text';

// Plafond par pays et territoires dépendants : params-2026.json > limits (Visa Bulletin, paragraphe 2).
const L = PARAMS.limits;
const latest = monthName(LATEST, 'en');
type Q = Exclude<Cat, 'IR'>;
// Ce que vaut le passage au pays du conjoint quand celui-ci est sur la colonne du reste du monde.
const val = (c: string) => (c === 'C' ? Infinity : c === 'U' ? -Infinity : isoToDays(c));
const CASES: Array<[Q, Country]> = [['F1', 'MX'], ['F2B', 'MX'], ['F3', 'MX'], ['F4', 'MX'], ['F2B', 'PH'], ['F3', 'PH'], ['F4', 'PH'], ['F4', 'IN'], ['EB1', 'IN'], ['EB2', 'IN'], ['EB3', 'IN'], ['EB2', 'CN'], ['EB3', 'CN'], ['EB5', 'CN'], ['EB3', 'PH']];
const rows = CASES.map(([c, k]) => {
  const own = cellAt(c, k, 'FAD'), row = cellAt(c, 'ROW', 'FAD');
  const a = val(own), b = val(row);
  const gain = Number.isFinite(a) && Number.isFinite(b) ? (b - a) / MONTH_DAYS : b === Infinity && Number.isFinite(a) ? Infinity : 0;
  return { c, k, own, row, gain, share: distinctShare(c, k) };
});
const finite = rows.filter((r) => Number.isFinite(r.gain));
const top = finite.reduce((x, y) => (y.gain > x.gain ? y : x));
const f4mx = rows.find((r) => r.c === 'F4' && r.k === 'MX')!;
const eb2in = rows.find((r) => r.c === 'EB2' && r.k === 'IN')!;
const en = (c: string) => cellText(c, 'en');
const yrs = (m: number) => m / 12;

export default definePage({
  id: "guide-chargeability", group: "guides", order: 702,
  mini: "chargeability",
  related: ["priority-date-calculator", "guide-per-country", "country-india", "country-mexico", "visa-bulletin"],
  sources: ["ina203", "vbOct2026", "visaPriority", "vbIndex"],
  en: {
    path: "guides/chargeability",
    nav: 'Chargeability', card: 'Which country your green card is counted against, and when a spouse or parent born elsewhere changes the queue.',
    title: 'Chargeability and Cross-Chargeability: Visa Bulletin 2026',
    description: 'Country of chargeability in the Visa Bulletin: why birthplace, not citizenship, picks your column, and how a spouse or parent born elsewhere can move you.',
    h1: 'Chargeability: which country your place in line is counted against',
    intro: 'Your Visa Bulletin column depends on where you were born, not your passport; the law lets a spouse or parent born elsewhere change that in a few defined cases.',
    resume: `Every preference immigrant is counted against one foreign state, called the country of chargeability, and the Immigration and Nationality Act sets the rule in section 202(b): chargeability is determined by birth, not by citizenship or residence. That is why an Indian-born engineer with a Canadian passport still waits on the India line. The same section allows four exceptions. A spouse may be charged to the country of the other spouse he or she is accompanying or following to join, to avoid separating the couple, if that spouse qualifies for an immigrant visa and numbers are available. A child accompanying or following to join a parent may be charged to either parent’s country under similar conditions. A person born in the United States is treated as born in the country of citizenship. And someone born in a country where neither parent was born or lived at the time may be charged to either parent’s country. In the ${latest} bulletin, ${eb2in.gain === Infinity ? 'the worldwide EB-2 line is current' : `the worldwide EB-2 date is about ${Math.round(yrs(eb2in.gain))} years ahead of India’s`}, so the spouse rule can be worth a decade.`,
    faqs: [
      { q: 'Is my country of chargeability my citizenship or my country of birth?', a: 'Your country of birth. Section 202(b) of the Immigration and Nationality Act says the foreign state to which an immigrant is chargeable is determined by birth within that state, with a short list of exceptions. Naturalizing in another country, holding two passports or living somewhere else for decades does not change the column of the Visa Bulletin you read.' },
      { q: 'How does cross-chargeability through a spouse work for the Visa Bulletin?', a: 'If you and your spouse were born in different countries, you may be charged to your spouse’s country when he or she is immigrating with you or following to join you, has received or qualifies for an immigrant visa, and numbers are available in that country. The provision exists to avoid separating a married couple. It works in either direction between principal and derivative.' },
      { q: 'Can a child use a parent’s country of birth for chargeability?', a: 'Yes, in two situations described in section 202(b). A child accompanying or following to join parents who were born in different countries may be charged to either parent’s country. And a child born in a country where neither parent was born or had a residence at the time of birth may be charged to the country of either parent.' },
      { q: 'Does cross-chargeability help if my spouse is not immigrating?', a: 'No. The law ties the spouse exception to a spouse who is accompanying or following to join you and who has received or would qualify for an immigrant visa. A spouse who stays a U.S. citizen, keeps another status or does not immigrate at all cannot lend a country of birth. Divorce before the visa is issued removes the basis too.' },
      { q: 'Which countries have their own column in the October 2026 Visa Bulletin?', a: 'The bulletin lists four oversubscribed chargeability areas: China (mainland born), India, Mexico and the Philippines. Everyone else reads the column titled All Chargeability Areas Except Those Listed. A country gets its own column when its demand would exceed the per-country limit, and the State Department then prorates its numbers under section 202(e).' },
      { q: 'Is a person born in Taiwan or Hong Kong charged to China?', a: 'The bulletin’s column is labeled China, mainland born, which tells you the column covers births in mainland China. For a birthplace outside the mainland, the Secretary of State decides which foreign state the place is attributed to; the bulletin and the State Department’s visa pages are the place to confirm it, and a licensed immigration attorney can check it against your documents.' },
      { q: 'Why is chargeability important for green card holders born in Mexico?', a: `Because Mexico has its own column in every family category, and in some of them the gap with the worldwide date is measured in decades. In F4, for brothers and sisters of U.S. citizens, the Mexican Final Action Date has trailed the worldwide date by years in every recent bulletin. A Mexican-born principal with a spouse born in Guatemala or Colombia may be able to use the worldwide date.` },
    ],
    body: (h) => `
<h2>Birth decides, not the passport</h2>
<p>The ${h.src('visaPriority', 'USCIS page on visa availability')} says the State Department allocates visas by preference category, country of chargeability and priority date, and that the law limits the share any single country may receive. Which country is “yours” is settled by the ${h.src('ina203', 'Immigration and Nationality Act')}, section 202(b): the foreign state of birth. A British citizen born in Mumbai is charged to India. A Mexican-born green card holder who became Spanish by descent is still charged to Mexico. Where you live now, the nationality on your passport and the country of your employer do not enter the calculation.</p>
<h2>Why the column matters so much</h2>
<p>Section 202 caps any one country at ${h.pct(L.perCountryShare, 0)} of the combined family and employment preference limits, ${h.num(L.perCountry)} visas a year at the minimum levels, and dependent areas at ${h.pct(L.dependentShare, 0)}, or ${h.num(Math.round((L.family + L.employment) * L.dependentShare))} visas. Under section 202(b), inhabited lands that are not treated as separate foreign states are attributed to a foreign state specified by the Secretary of State. When demand from one country would pass that cap, the ${h.src('vbOct2026', `bulletin for ${latest}`)} applies the prorating provisions of section 202(e) and prints a separate column. Four areas are listed this month: China (mainland born), India, Mexico and the Philippines. Everyone else, from Canada to Nigeria to Guatemala, reads the column called “All Chargeability Areas Except Those Listed”.</p>
<p>The table shows what that separation costs this month: the Final Action Date of each country column next to the worldwide date in the same category, and the share of bulletins since October 2015 in which the country had a date of its own.</p>
${h.table(['Case', 'Country date', 'Worldwide date', 'Worldwide ahead by', 'Own date since 2015'], rows.map((r) => [`${CAT_SHORT[r.c]} ${COUNTRY_LABEL.en[r.k]}`, h.cell(r.own), h.cell(r.row), r.gain === Infinity ? 'worldwide current' : r.gain > 0 ? `${h.num(r.gain, 0)} months` : 'none', h.pct(r.share, 0)]), `Final Action Dates, Visa Bulletin for ${latest}.`, ['l', 'l', 'l', 'r', 'r'])}
<p>The widest gap in the list is ${CAT_SHORT[top.c]} for ${COUNTRY_LABEL.en[top.k]}, where the worldwide date is about ${h.num(top.gain, 0)} months, or ${h.num(yrs(top.gain), 1)} years, ahead. That gap is the prize the exceptions below can open for a few families, and the reason the question “which country am I charged to?” deserves a careful answer.</p>
<h2>The four exceptions in section 202(b)</h2>
<p>The statute lists them in order. None of them is automatic; each has conditions, and each is applied by the officer who issues the visa or approves the adjustment.</p>
<ul>
<li><strong>Spouse.</strong> If you are chargeable to a different country from your spouse, you may be charged to your spouse’s country, if necessary to prevent the separation of husband and wife, when your spouse is the one you are accompanying or following to join, has received or would qualify for an immigrant visa, and numbers are available for that country.</li>
<li><strong>Child.</strong> A child accompanying or following to join parents born in two different countries may be charged to either parent’s country, under similar conditions, when the child is not otherwise entitled to an immigrant status.</li>
<li><strong>Born in the United States.</strong> Someone born in the United States who is not a U.S. citizen is treated as born in the country of which he or she is a citizen, or, failing that, in the last foreign country of residence.</li>
<li><strong>Born in a third country.</strong> A person born in a country where neither parent was born and neither parent had a residence at the time of the birth may be charged to the country of either parent.</li>
</ul>
<h2>The spouse rule in practice</h2>
<p>Most real uses are the first exception. Picture an EB-2 engineer born in Pune whose wife was born in São Paulo. On the India line the Final Action Date is ${h.cell(eb2in.own)}; on the worldwide line it is ${h.cell(eb2in.row)}. If she immigrates with him as his derivative and qualifies for her own immigrant visa, he may be charged to Brazil and read the worldwide column. ${eb2in.gain === Infinity ? 'That column is current this month.' : `On this month’s dates that is a head start of about ${h.num(yrs(eb2in.gain), 1)} years for the same priority date and the same petition.`} The rule runs in both directions: a derivative may borrow the principal’s country as well as the reverse.</p>
<p>Family cases work the same way. A brother of a U.S. citizen, born in Zacatecas, waits in F4 Mexico at ${h.cell(f4mx.own)}. If his wife was born in Guatemala and immigrates with him, the worldwide F4 date of ${h.cell(f4mx.row)} may apply to both. The quick check at the top of this page compares the two columns for any category and pair of countries.</p>
<h2>Where the rule stops</h2>
<p>The spouse must actually be immigrating. A spouse who is already a U.S. citizen, who will keep a nonimmigrant status, or who stays abroad without applying cannot lend a birthplace. A marriage that ends before the visa is issued leaves nothing to borrow. Numbers must also be available for the borrowed country, so cross-charging into another oversubscribed column can still leave you waiting.</p>
<p>The priority date does not change either. Cross-chargeability moves you to a different column of the same category; it does not create a new petition or a new place in line. If a second petition in another category is the better route, the ${h.a('guide-eb2-to-eb3', 'EB-2 to EB-3 guide')} covers how a priority date can carry over.</p>
<h2>Check the date in your new column</h2>
<p>Once you know which country you are charged to, the next question is whether that column is current for your date this month.</p>
${h.mini('isCurrent')}
<p>The officer who issues the visa or approves the adjustment is the one who applies the rule, on the facts of the file. This page describes the rule in the statute and the bulletin; it does not say whether it applies to you. For that, a licensed immigration attorney or a DOJ-accredited representative should look at the documents. The ${h.a('guide-per-country', 'per-country limit guide')} explains how the ${h.pct(L.perCountryShare, 0)} cap is computed each year.</p>`,
  },
});
