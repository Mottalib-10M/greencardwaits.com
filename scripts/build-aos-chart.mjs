#!/usr/bin/env node
/**
 * Tableau imposé par USCIS pour déposer l'I-485 (Final Action Dates ou Dates for Filing), mois par mois.
 *
 *   node scripts/build-aos-chart.mjs
 *
 * Source : uscis.gov, « Adjustment of Status Filing Charts from the Visa Bulletin » (page publique, lue telle quelle ;
 * aucun contournement). La page énonce, pour le mois en cours et souvent le suivant : « For all family-sponsored
 * preference categories, you must use the <chart> chart in the Department of State Visa Bulletin for <Month YYYY> »,
 * et la même phrase pour l'emploi.
 * Sortie : params-2026.json > aosHistory (un relevé par mois) et aosChart (le mois du dernier Visa Bulletin lu, ou à
 * défaut le dernier mois publié par USCIS). Code 2 si la page est injoignable ou illisible : les paramètres restent tels
 * quels et le workflow continue (à relire à la main).
 */
import { readFileSync, writeFileSync } from 'node:fs';

const URL_AOS = 'https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin';
const PARAMS = new URL('../src/data/params-2026.json', import.meta.url);
const VB = new URL('../src/data/visa-bulletin.json', import.meta.url);
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

let html = '';
try {
  const r = await fetch(URL_AOS, { headers: { 'user-agent': 'Mozilla/5.0 (greencardwaits chart check)' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  html = await r.text();
} catch (e) {
  console.error('Page USCIS des filing charts injoignable :', e.message, '(aosChart inchangé, à relire à la main)');
  process.exit(2);
}

const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&rsquo;|&#8217;/g, '’').replace(/\s+/g, ' ');
const re = /For all (family-sponsored|employment-based) preference categories,? you must use the (Dates for Filing|Final Action Dates?) chart in the Department of State Visa Bulletin for ([A-Za-z]+) (\d{4})/gi;
/** @type {Record<string, {family?: string, employment?: string}>} */
const found = {};
for (const m of text.matchAll(re)) {
  const mi = MONTHS.indexOf(m[3].toLowerCase());
  if (mi < 0) continue;
  const month = `${m[4]}-${String(mi + 1).padStart(2, '0')}`;
  const chart = /filing/i.test(m[2]) ? 'DFF' : 'FAD';
  const kind = m[1].toLowerCase().startsWith('family') ? 'family' : 'employment';
  (found[month] ??= {})[kind] = chart;
}
const complete = Object.keys(found).filter((k) => found[k].family && found[k].employment).sort();
if (!complete.length) {
  console.error('Aucune phrase « you must use the … chart » lisible sur la page USCIS : relire à la main (aosChart inchangé).');
  process.exit(2);
}

const P = JSON.parse(readFileSync(PARAMS, 'utf8'));
const latestVb = JSON.parse(readFileSync(VB, 'utf8')).latest;
const today = new Date().toISOString().slice(0, 10);
P.aosHistory ??= {};
for (const k of complete) P.aosHistory[k] = { family: found[k].family, employment: found[k].employment };
// Le mois retenu est celui du dernier bulletin lu ; si USCIS ne l'a pas encore publié, le dernier mois publié.
const month = complete.includes(latestVb) ? latestVb : complete.filter((k) => k <= latestVb).pop() ?? complete[0];
const next = complete.find((k) => k > month) ?? null;
const prev = P.aosChart ?? {};
const changed = prev.month !== month || prev.family !== found[month].family || prev.employment !== found[month].employment
  || JSON.stringify(prev.next ?? null) !== JSON.stringify(next ? { month: next, ...P.aosHistory[next] } : null);
P.aosChart = {
  month,
  family: found[month].family,
  employment: found[month].employment,
  next: next ? { month: next, ...P.aosHistory[next] } : null,
  reviewed: changed ? today : (prev.reviewed ?? today),
  _src: 'aosCharts',
};
writeFileSync(PARAMS, JSON.stringify(P, null, 2) + '\n');
console.log(`Filing charts USCIS : ${complete.map((k) => `${k} famille ${found[k].family}, emploi ${found[k].employment}`).join(' ; ')}. Retenu : ${month}${month === latestVb ? '' : ` (bulletin ${latestVb} pas encore désigné par USCIS)`}.`);
