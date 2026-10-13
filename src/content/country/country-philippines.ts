import { definePage } from '../../lib/guide-types';
import { cellAt, QUEUE_CATS, CAT_SHORT, MONTHS, LATEST, distinctShare } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';
import PARAMS from '../../data/params-2026.json';

// Chiffres lus dans les données (jamais tapés).
const now = `${LATEST}-01`;
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const isDate = (c: string) => c !== 'C' && c !== 'U';
const en = (c: string) => cellText(c, 'en');
const L = PARAMS.limits;
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
// Catégories où les Philippines ont leur propre date ce mois, et leur retard (années) sur le reste du monde.
const own = QUEUE_CATS.filter((c) => cellAt(c, 'PH', 'FAD') !== cellAt(c, 'ROW', 'FAD'))
  .map((c) => { const a = cellAt(c, 'PH', 'FAD'), r = cellAt(c, 'ROW', 'FAD'); return { c, a, r, gap: isDate(a) ? years(a, isDate(r) ? r : now) : 0 }; })
  .sort((x, y) => y.gap - x.gap);
const fam = own.filter((x) => x.c.startsWith('F'));
const emp = own.filter((x) => !x.c.startsWith('F'));
const top = own[0];
const shared = QUEUE_CATS.filter((c) => c.startsWith('F') && cellAt(c, 'PH', 'FAD') === cellAt(c, 'ROW', 'FAD')).map((c) => CAT_SHORT[c]);
const f3 = cellAt('F3', 'PH', 'FAD'), f4 = cellAt('F4', 'PH', 'FAD');
const f4Oct2016 = cellAt('F4', 'PH', 'FAD', MONTHS.indexOf('2016-10'));
const f3Oct2016 = cellAt('F3', 'PH', 'FAD', MONTHS.indexOf('2016-10'));
const eb3Share = distinctShare('EB3', 'PH');
const ewShare = distinctShare('EW', 'PH');

export default definePage({
  id: "country-philippines", group: "country", order: 303,
  tool: {"kind": "greencard", "cat": "F2B", "country": "PH"},
  data: {"countryAll": "PH"},
  related: ["f3-philippines", "f1-philippines", "f4-philippines", "eb-3-philippines", "guide-chargeability"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/philippines",
    nav: 'Philippines', card: 'Every Visa Bulletin category for people born in the Philippines, against the worldwide dates.',
    title: 'Visa Bulletin Philippines 2026: Family and EB-3 Cutoffs',
    description: 'Visa Bulletin dates for applicants born in the Philippines: four family lines with their own cutoff, the EB-3 column, how far each trails the world and why.',
    h1: 'Green card dates for people born in the Philippines',
    intro: 'Select your category and enter your priority date; the table below sets every Philippine cutoff this month beside the worldwide date.',
    resume: `The Philippines has its own Visa Bulletin column because Filipino demand passes the ${Math.round(L.perCountryShare * 100)}% per-country limit, ${L.perCountry.toLocaleString('en-US')} visas a year, in several preference categories. Where India's backlog is an employment story, the Philippine one is mostly about families: in the ${LATEST.slice(0, 4)} bulletins ${fam.length} family categories have their own Philippine date (${list(fam.map((x) => CAT_SHORT[x.c]))})${emp.length ? `, against ${emp.length} in employment (${list(emp.map((x) => CAT_SHORT[x.c]))})` : ' and none in employment'}. The longest gap is ${CAT_SHORT[top.c]}, married sons and daughters of U.S. citizens, at ${en(top.a)}, about ${Math.round(top.gap)} years behind the worldwide date. Brothers and sisters in F4 are at ${en(f4)}, a line that has gained ground quickly since 2016. The column is decided by country of birth: a Filipino-born applicant with another passport still uses it, and a spouse born elsewhere can sometimes move the couple to another queue.`,
    faqs: [
      { q: 'Which Philippine family categories have their own Visa Bulletin date?', a: 'In recent bulletins the Philippines has had separate dates for F1, F2B, F3 and F4, the lines for adult children and siblings of U.S. citizens and adult unmarried children of green card holders. Spouses and minor children of green card holders in F2A share the worldwide date, and immediate relatives of citizens have no queue at all.' },
      { q: 'Why does EB-3 Philippines sometimes match the worldwide date?', a: 'When the State Department expects Filipino EB-3 demand to pass the per-country share, it sets a separate cutoff; when it does not, the Filipino line uses the worldwide date. Since 2015 the EB-3 Philippines column has been different from the world in a little under half of the bulletins, which is why it is worth checking every month.' },
      { q: 'Is F2B or F1 shorter for a Filipino adult son or daughter?', a: 'The two Philippine lines have run within months of each other in recent years and have changed order several times, so neither is reliably shorter. The comparison matters most when a green card holder parent naturalizes and the case moves from F2B to F1. The F1 and F2B Philippines pages track both dates and their history.' },
    ],
    body: (h) => `
<h2>A family backlog</h2>
<p>The Immigration and Nationality Act limits any one country to ${h.pct(L.perCountryShare)} of the yearly preference numbers, ${h.num(L.perCountry)} visas across family and employment. The Philippines reaches that limit through its family petitions. This month ${h.num(fam.length)} of the five family preference lines carry a Philippine date. ${shared.length ? `Only ${list(shared)} follows the worldwide cutoff.` : ''} ${h.src('ina203', 'INA sections 201 to 203')}.</p>
<h2>The longest and the fastest</h2>
<p>F3, married sons and daughters of U.S. citizens, is the deepest line: ${h.cell(f3)} against ${h.cell(cellAt('F3', 'ROW', 'FAD'))} worldwide. In October 2016 it stood at ${h.cell(f3Oct2016)}, so it has gained about ${h.num(years(f3Oct2016, f3), 1)} years in ten. F4 has moved even faster, from ${h.cell(f4Oct2016)} in October 2016 to ${h.cell(f4)} today, about ${h.num(years(f4Oct2016, f4), 1)} years of progress. ${h.a('f3-philippines', 'F3 Philippines')} and ${h.a('f4-philippines', 'F4 Philippines')} have the detail.</p>
<h2>Adult children: F1 and F2B side by side</h2>
<p>An unmarried Filipino son or daughter over 21 waits in F1 if the parent is a citizen and in F2B if the parent holds a green card. This month the two dates are ${h.cell(cellAt('F1', 'PH', 'FAD'))} and ${h.cell(cellAt('F2B', 'PH', 'FAD'))}. Their order has flipped more than once since 2001, so neither line is a safe bet. ${h.a('f1-philippines', 'Compare the two')}.</p>
<h2>Employment: the EB-3 column</h2>
<p>On the employment side the Philippines comes and goes in two lines. Since 2015 its EB-3 date has differed from the worldwide date in ${h.pct(eb3Share)} of bulletins, and its EB-3 Other Workers date in ${h.pct(ewShare)}. ${emp.length ? `This month the separate ${list(emp.map((x) => CAT_SHORT[x.c]))} date is ${h.cell(emp[0].a)}, against ${h.cell(emp[0].r)} worldwide.` : 'This month it shares the worldwide date.'} ${h.a('eb-3-philippines', 'EB-3 Philippines')}.</p>
<h2>Birth decides the column</h2>
<p>A Filipino-born applicant who holds another passport still uses this column, and a spouse born in a worldwide country can sometimes let the couple use that date when they immigrate together. ${h.a('guide-chargeability', 'The chargeability guide')} explains the conditions.</p>`,
  },
});
