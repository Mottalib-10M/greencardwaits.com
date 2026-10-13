import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, QUEUE_CATS, CAT_SHORT, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText } from '../../lib/text';
import PARAMS from '../../data/params-2026.json';
import VB from '../../data/visa-bulletin.json';

// Chiffres lus dans les données (jamais tapés).
const now = `${LATEST}-01`;
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const isDate = (c: string) => c !== 'C' && c !== 'U';
const en = (c: string) => cellText(c, 'en');
const L = PARAMS.limits;
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
// Catégories où la Chine continentale a sa propre date ce mois, et son retard (années) sur le reste du monde.
const own = QUEUE_CATS.filter((c) => cellAt(c, 'CN', 'FAD') !== cellAt(c, 'ROW', 'FAD'))
  .map((c) => { const a = cellAt(c, 'CN', 'FAD'), r = cellAt(c, 'ROW', 'FAD'); return { c, a, r, gap: isDate(a) ? years(a, isDate(r) ? r : now) : 0 }; })
  .sort((x, y) => y.gap - x.gap);
const top = own[0];
const famOwn = own.filter((x) => x.c.startsWith('F'));
const eb2 = own.find((x) => x.c === 'EB2'), eb3 = own.find((x) => x.c === 'EB3');
const eb2Oct2016 = cellAt('EB2', 'CN', 'FAD', MONTHS.indexOf('2016-10'));
const eb2Retro = retrogressions('EB2', 'CN');
const eb5Move = moveDays('EB5', 'CN') ?? 0;
// EB-5 réservé (rural, chômage élevé, infrastructure) : colonnes du dernier bulletin.
const last = (VB as any).bulletins[(VB as any).bulletins.length - 1];
const setAside = [['EB5R', 'rural'], ['EB5H', 'high-unemployment'], ['EB5I', 'infrastructure']].map(([k, n]) => ({ n, v: String(last.FAD?.[k]?.CN ?? 'U') }));
const bulls = (VB as any).bulletins as any[];
const saMonths = bulls.filter((b) => b.FAD?.EB5R);
const saFirst = saMonths[0]?.month as string;
const saAlwaysC = saMonths.every((b) => ['EB5R', 'EB5H', 'EB5I'].every((k) => b.FAD?.[k]?.CN === 'C'));
const setAsideCurrent = setAside.filter((x) => x.v === 'C').map((x) => x.n);

export default definePage({
  id: "country-china", group: "country", order: 301,
  tool: {"kind": "greencard", "cat": "EB2", "country": "CN"},
  data: {"countryAll": "CN"},
  related: ["eb-2-china", "eb-5-china", "eb-3-china", "guide-per-country", "guide-chargeability"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/china",
    nav: 'China', card: 'Every Visa Bulletin category for people born in mainland China, with the worldwide date beside it.',
    title: 'Visa Bulletin China Mainland Born 2026: All Category Dates',
    description: 'All Visa Bulletin categories for applicants born in mainland China: the separate employment and EB-5 dates, the family lines that match the world, and why.',
    h1: 'Green card dates for people born in mainland China',
    intro: 'Choose your category and enter your priority date; the table below lists each mainland China cutoff this month beside the worldwide date.',
    resume: `The Visa Bulletin column for China covers people born in mainland China, and it exists because demand from that country passes the ${Math.round(L.perCountryShare * 100)}% per-country limit, ${L.perCountry.toLocaleString('en-US')} visas a year, in several employment categories. In the ${LATEST.slice(0, 4)} bulletins China has its own Final Action Date in ${own.length} categories: ${list(own.map((x) => CAT_SHORT[x.c]))}. The deepest backlog is ${CAT_SHORT[top.c]}, where the Chinese cutoff of ${en(top.a)} sits about ${Math.round(top.gap)} years behind a worldwide line that is ${top.r === 'C' ? 'current' : `at ${en(top.r)}`}. ${eb2 ? `EB-2 China is at ${en(eb2.a)}, about ${Math.round(eb2.gap)} years behind the world.` : ''} ${famOwn.length ? '' : 'Every family category uses the worldwide date, so a Chinese-born relative of a citizen or green card holder waits no longer than anyone else.'} Chargeability follows birth, so someone born in Hong Kong, Taiwan or abroad to Chinese parents should check which column the bulletin assigns before reading this one.`,
    faqs: [
      { q: 'Why is the EB-5 China date years behind when EB-5 is current elsewhere?', a: `Investors born in mainland China filed far more unreserved EB-5 petitions than their country’s share of the category allows, so the bulletin sets a Chinese cutoff while most other countries are current. The reserved EB-5 lines for rural, high-unemployment and infrastructure projects, listed in the bulletin since 2022, have their own columns${saAlwaysC ? ' and have stayed current for China in every bulletin since they appeared' : ' and are worth checking separately'}.` },
      { q: 'Do family categories have a separate China date in the Visa Bulletin?', a: 'Not in recent bulletins. Chinese-born applicants in F1, F2A, F2B, F3 and F4 have used the worldwide date, because demand from China in those family lines stays within the per-country share. The employment categories are where China has its own cutoffs, and the table on this page shows any change from one month to the next.' },
      { q: 'Does EB-2 China move faster than EB-3 China?', a: 'The two Chinese employment lines run close to each other and have traded places more than once, so neither is always faster. Compare both dates in the current bulletin and their histories on the EB-2 China and EB-3 China pages. A move from one category to the other needs a new petition, which has its own cost and timing.' },
    ],
    body: (h) => `
<h2>Mainland birth, not passport</h2>
<p>The bulletin labels this column China mainland born. Applicants are charged to their country of birth, so a U.S. green card applicant holding a Canadian passport but born in Shanghai uses this column, while a Chinese citizen born elsewhere may not. A spouse born in another country can sometimes let both partners use that country's date. ${h.a('guide-chargeability', 'The chargeability guide')} sets out the conditions.</p>
<h2>An employment and investor backlog</h2>
<p>Under the Immigration and Nationality Act no country may take more than ${h.pct(L.perCountryShare)} of the preference numbers in a year, ${h.num(L.perCountry)} visas. China passes that line in employment, not family. This month the deepest gap is ${CAT_SHORT[top.c]} at ${h.cell(top.a)}. ${Math.round(eb5Move) === 0 ? 'The unreserved EB-5 China date did not move in the latest bulletin.' : `The latest bulletin moved the EB-5 China date ${h.num(Math.abs(Math.round(eb5Move)))} days ${eb5Move > 0 ? 'forward' : 'backward'}.`} ${setAsideCurrent.length ? `By contrast, the reserved EB-5 ${list(setAsideCurrent)} lines are current for China${saAlwaysC ? `, as they have been in every bulletin since ${h.month(saFirst)}` : ''}. The two routes are compared on ${h.a('eb-5-china', 'the EB-5 China page')}.` : ''} ${h.src('ina203', 'INA sections 201 to 203')}.</p>
<h2>EB-2 and EB-3: a few years, not decades</h2>
<p>${eb2 && eb3 ? `EB-2 China stands at ${h.cell(eb2.a)} and EB-3 China at ${h.cell(eb3.a)}, gaps of about ${h.num(eb2.gap, 1)} and ${h.num(eb3.gap, 1)} years against the worldwide dates.` : ''} That is far shorter than the Indian queues in the same categories. In October 2016 the Chinese EB-2 date was ${h.cell(eb2Oct2016)}, so the line has advanced about ${h.num(years(eb2Oct2016, cellAt('EB2', 'CN', 'FAD')), 1)} years in ten, with ${h.num(eb2Retro.n)} retrogressions since 2001 along the way. ${h.a('eb-2-china', 'EB-2 China in detail')}.</p>
<h2>Family relatives</h2>
<p>${famOwn.length ? `This month ${list(famOwn.map((x) => CAT_SHORT[x.c]))} carries a China date.` : 'No family category has its own China date this month: F1, F2A, F2B, F3 and F4 all follow the worldwide cutoffs, shown in the last column of the table below.'} Immediate relatives of U.S. citizens are outside the bulletin altogether.</p>`,
  },
});
