import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, QUEUE_CATS, CAT_SHORT, MONTHS, LATEST, type Cat } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';
import PARAMS from '../../data/params-2026.json';

// Chiffres lus dans les données (jamais tapés).
type Q = Exclude<Cat, 'IR'>;
const now = `${LATEST}-01`;
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const isDate = (c: string) => c !== 'C' && c !== 'U';
const en = (c: string) => cellText(c, 'en');
const L = PARAMS.limits;
// Catégories où l'Inde a sa propre date ce mois, et son retard sur le reste du monde (en années).
const own = QUEUE_CATS.filter((c) => cellAt(c, 'IN', 'FAD') !== cellAt(c, 'ROW', 'FAD'))
  .map((c) => { const a = cellAt(c, 'IN', 'FAD'), r = cellAt(c, 'ROW', 'FAD'); return { c, a, r, gap: isDate(a) ? years(a, isDate(r) ? r : now) : 0 }; })
  .sort((x, y) => y.gap - x.gap);
const ownNames = own.map((x) => CAT_SHORT[x.c]);
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const top = own[0], second = own[1];
const famOwn = own.filter((x) => x.c.startsWith('F')).map((x) => CAT_SHORT[x.c]);
const famShared = QUEUE_CATS.filter((c) => c.startsWith('F') && cellAt(c, 'IN', 'FAD') === cellAt(c, 'ROW', 'FAD')).map((c) => CAT_SHORT[c]);
const currentElsewhere = own.filter((x) => x.r === 'C').map((x) => CAT_SHORT[x.c]);
const eb2 = cellAt('EB2', 'IN', 'FAD'), eb3 = cellAt('EB3', 'IN', 'FAD');
const eb2Oct2016 = cellAt('EB2', 'IN', 'FAD', MONTHS.indexOf('2016-10'));
const eb5move = moveDays('EB5', 'IN') ?? 0;
const ebSwap = isDate(eb2) && isDate(eb3) ? (eb3 > eb2 ? 'EB-3' : eb2 > eb3 ? 'EB-2' : '') : '';

export default definePage({
  id: "country-india", group: "country", order: 300,
  tool: {"kind": "greencard", "cat": "EB2", "country": "IN"},
  data: {"countryAll": "IN"},
  related: ["eb-2-india", "eb-3-india", "f4-india", "guide-per-country", "guide-chargeability"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/india",
    nav: 'India', card: 'Every Visa Bulletin category for people born in India, side by side with the worldwide dates.',
    title: 'Visa Bulletin India 2026: Every Category and Its Cutoff',
    description: 'Every Visa Bulletin category for applicants born in India: which lines have their own date, how far EB-2 and EB-3 trail the world, and how chargeability works.',
    h1: 'Green card dates for people born in India, category by category',
    intro: 'Pick your category and enter your priority date: the table below shows every Indian cutoff this month next to the worldwide date.',
    resume: `India has its own column in the Visa Bulletin because demand from Indian-born applicants exceeds the per-country limit: no single country may receive more than ${Math.round(L.perCountryShare * 100)}% of the family and employment preference numbers in a year, which is ${L.perCountry.toLocaleString('en-US')} visas. In the ${LATEST.slice(0, 4)} bulletins India has a separate Final Action Date in ${own.length} categories: ${list(ownNames)}. The longest gap is in ${CAT_SHORT[top.c]}, where the Indian cutoff of ${en(top.a)} trails the worldwide date by about ${Math.round(top.gap)} years, followed by ${CAT_SHORT[second.c]} at ${en(second.a)}. Unlike the Philippines or Mexico, India's backlog is mostly an employment story: in the family lines only ${list(famOwn)} has its own date. What counts is the country of birth, not citizenship or residence, and a spouse born elsewhere can sometimes move both partners to that country's queue.`,
    faqs: [
      { q: 'Which Visa Bulletin categories have a separate India date?', a: 'In recent bulletins India has had its own Final Action Date in the categories shown in the table on this page, mainly the employment lines EB-1, EB-2, EB-3, EB-3 Other Workers and EB-5, plus F4 for siblings. In every other category Indian applicants use the worldwide date. The list can change from one bulletin to the next as demand shifts.' },
      { q: 'Does Indian citizenship or Indian birth decide the India queue?', a: 'Birth. The Visa Bulletin charges each applicant to the country of birth, so a Canadian or British citizen born in India waits on the Indian line, and an Indian citizen born in the United Arab Emirates does not. A spouse’s country of birth can be used instead when both immigrate together, under cross-chargeability.' },
      { q: 'Why is EB-1 India behind when EB-1 is current for everyone else?', a: 'Because Indian applicants in EB-1 alone would use more than the share their country may receive, the State Department sets a cutoff for India while other countries stay current. Applicants in the first preference from India therefore wait behind a cutoff, even though the category is open worldwide.' },
      { q: 'Is the India green card backlog getting shorter?', a: 'It depends on the category. Some Indian lines have advanced several years over the last decade, others have barely moved, and several have retrogressed along the way. The chart on each category page shows the path since 2001, and our forecast says plainly when it cannot predict an Indian date with tested accuracy.' },
    ],
    body: (h) => `
<h2>Why India gets its own column</h2>
<p>The Immigration and Nationality Act caps each country at ${h.pct(L.perCountryShare)} of the yearly preference total, which the bulletin puts at ${h.num(L.perCountry)} visas across ${h.num(L.family)} family and at least ${h.num(L.employment)} employment numbers. India reaches that ceiling mainly through employment demand: its employer-sponsored lines are where the gaps are widest. Once a country's demand passes the cap in a category, the bulletin gives it a separate cutoff. ${h.src('ina203', 'INA sections 201 to 203')}.</p>
<h2>Where the Indian lines stand</h2>
<p>This month ${h.num(own.length)} categories carry an Indian date. ${CAT_SHORT[top.c]} is the furthest behind, at ${h.cell(top.a)} against ${h.cell(top.r)} worldwide, about ${h.num(top.gap, 1)} years. ${CAT_SHORT[second.c]} follows at ${h.cell(second.a)}. In October 2016 the Indian EB-2 date was ${h.cell(eb2Oct2016)}. ${ebSwap ? `Right now ${ebSwap} India holds the later of the two cutoffs, which is why some applicants compare the two queues with ${h.a('guide-eb2-to-eb3', 'the EB-2 to EB-3 guide')}.` : ''} ${currentElsewhere.length ? `In ${list(currentElsewhere)} the rest of the world is current while India waits.` : ''} The EB-5 India line moved ${h.num(Math.abs(Math.round(eb5move)))} days ${eb5move >= 0 ? 'forward' : 'backward'} in the latest bulletin.</p>
<h2>The family side</h2>
<p>Indian-born relatives use the worldwide dates in ${list(famShared)}, so an Indian-born adult son or daughter, or the spouse of a green card holder, waits exactly as long as anyone else in those lines. ${famOwn.length ? `${list(famOwn)} is the exception, with its own Indian cutoff. ${h.a('f4-india', 'The F4 India page')} has its history.` : 'No family category has its own Indian date this month.'}</p>
<h2>Chargeability: birth, not passport</h2>
<p>The column you use is decided by your country of birth. A spouse born in another country can let the couple be charged there when they immigrate together, which for a spouse born in a worldwide country opens a much earlier queue. ${h.a('guide-chargeability', 'Our chargeability guide')} covers the conditions, and a licensed immigration attorney or DOJ-accredited representative can confirm how they apply to a specific case.</p>`,
  },
});
