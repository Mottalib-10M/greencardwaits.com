/**
 * Collecte et lit l'archive des Visa Bulletins (décembre 2001 → dernier publié).
 *
 *   node scripts/build-bulletins.ts            # lit le cache scripts/.cache-raw/vb/, télécharge ce qui manque
 *   node scripts/build-bulletins.ts --refresh  # relit l'index et retélécharge le dernier bulletin
 *
 * Source : https://adoptions.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html (miroir du
 * Département d'État ; travel.state.gov refuse les robots, on ne contourne pas). L'URL de chaque bulletin est
 * prise dans l'index, jamais reconstruite (octobre 2026 est rangé sous /2027/, exercice fiscal).
 * Sortie : src/data/visa-bulletin.json (versionné). Le build échoue si une case attendue manque.
 */
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseBulletin, integrity, monthFromUrl, type Bulletin } from '../src/lib/engine/vb-parse.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'scripts/.cache-raw/vb');
const HOST = 'https://adoptions.state.gov';
const INDEX = `${HOST}/content/travel/en/legal/visa-law0/visa-bulletin.html`;
const UA = 'Mozilla/5.0 (compatible; greencardwaits-data/1.0; +contact via site)';
mkdirSync(CACHE, { recursive: true });
const refresh = process.argv.includes('--refresh');

async function get(url: string): Promise<string> {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

const idxFile = join(CACHE, 'index.html');
if (refresh || !existsSync(idxFile)) writeFileSync(idxFile, await get(INDEX));
const idx = readFileSync(idxFile, 'utf8');
const links = [...new Set([...idx.matchAll(/href="([^"]*visa-bulletin-for-[a-z]+-\d{4}\.html)"/gi)].map((m) => m[1]))];
const items = links.map((l) => ({ url: l.startsWith('http') ? l : HOST + l, month: monthFromUrl(l) })).sort((a, b) => a.month.localeCompare(b.month));
const latest = items[items.length - 1]?.month;

const bulletins: Bulletin[] = [];
const errors: string[] = [];
for (const it of items) {
  const f = join(CACHE, it.url.split('/').pop()!);
  if (!existsSync(f) || (refresh && it.month === latest)) {
    writeFileSync(f, await get(it.url));
    await new Promise((r) => setTimeout(r, 800));
  }
  const b = parseBulletin(readFileSync(f, 'utf8'), it.month);
  errors.push(...integrity(b));
  // Chemin seul (sans hôte) : check-sources ne doit pas ouvrir les 294 pages à chaque contrôle.
  bulletins.push({ ...b, path: it.url.replace(HOST, "") } as Bulletin & { path: string });
}

if (bulletins.length < 294) errors.push(`${bulletins.length} bulletins seulement (294 attendus au 2026-10-13)`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const out = { source: INDEX, retrieved_at: new Date().toISOString().slice(0, 10), count: bulletins.length, first: bulletins[0].month, latest, bulletins };
writeFileSync(join(ROOT, 'src/data/visa-bulletin.json'), JSON.stringify(out));
console.log(`${bulletins.length} bulletins, ${out.first} → ${latest}, 0 case manquante`);
