/**
 * Délais de traitement USCIS par bureau et par formulaire.
 *
 *   node scripts/build-ptimes.ts            # lit le cache scripts/.cache-raw/ptimes/
 *   node scripts/build-ptimes.ts --refresh  # retélécharge les fichiers
 *
 * Sources :
 *  - Délais par bureau et par formulaire publiés par USCIS (egov.uscis.gov/processing-times), tels que republiés en
 *    données ouvertes par ImmigrationTimes.org, licence CC BY 4.0 (https://immigrationtimes.org/data/, DOI
 *    10.5281/zenodo.21311840). L'API officielle d'USCIS est derrière une protection anti-robot : on ne la contourne pas.
 *    Modifications apportées : sélection des formulaires et sous-types, conversion en tableau par bureau, rang.
 *  - Délai moyen national : rapport mensuel d'USCIS au Congrès (« Report to Congress », CSV, domaine public).
 * Sortie : src/data/ptimes.json (versionné).
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'scripts/.cache-raw/ptimes');
mkdirSync(CACHE, { recursive: true });
const refresh = process.argv.includes('--refresh');
const IT = 'https://immigrationtimes.org/api/v1';
const FORMS = ['n-400', 'i-485', 'i-130', 'i-765', 'i-131', 'i-140', 'i-751', 'i-90', 'i-129f', 'i-526e'];
const NATIONAL_CSV = 'appropriation_requirement_august_2026_v1.0.csv';
const NATIONAL_URL = `https://www.uscis.gov/sites/default/files/document/data/${NATIONAL_CSV}`;

async function cached(name: string, url: string): Promise<string> {
  const f = join(CACHE, name);
  if (refresh || !existsSync(f)) {
    const r = await fetch(url, { headers: { 'User-Agent': 'greencardwaits-data/1.0' } });
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    writeFileSync(f, await r.text());
    await new Promise((res) => setTimeout(res, 500));
  }
  return readFileSync(f, 'utf8');
}

function csv(text: string): Record<string, string>[] {
  const lines = text.replace(/^﻿/, '').trim().split(/\r?\n/);
  const split = (l: string) => { const out: string[] = []; let cur = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; };
  const head = split(lines[0]);
  return lines.slice(1).map((l) => Object.fromEntries(split(l).map((v, i) => [head[i], v])));
}

const num = (s: string | number | null | undefined) => (s === null || s === undefined || s === '' ? null : Number(s));

// Séries N-400 et I-485 famille par bureau (depuis mars 2022).
const hist: Record<string, Record<string, Array<[string, number | null, number | null]>>> = {};
for (const [file, sub, key] of [['n-400', '160A', 'n400'], ['i-485', '131A-FAM', 'i485fam']] as const) {
  for (const r of csv(await cached(`${file}.csv`, `${IT}/${file}.csv`))) {
    if (r.form_subtype !== sub && !(key === 'i485fam' && r.form_subtype === 'I-485 Family')) continue;
    ((hist[r.office_code] ??= {})[key] ??= []).push([r.date, num(r.min_months), num(r.max_months)]);
  }
}
for (const o of Object.values(hist)) for (const k of Object.keys(o)) o[k].sort((a, b) => a[0].localeCompare(b[0]));

// Dernière publication par formulaire, sous-type et bureau.
interface Row { office: string; subtype: string; info: string; min: number | null; max: number | null; inquiry: string | null }
const forms: Record<string, { updated: string; rows: Row[] }> = {};
const names: Record<string, string> = {};
for (const f of FORMS) {
  const j = JSON.parse(await cached(`${f}.json`, `${IT}/${f}.json`));
  for (const a of j.office_aggregates ?? []) names[a.office_code] = a.office_name;
  forms[f] = {
    updated: j.last_updated,
    rows: (j.offices ?? []).map((o: any) => ({ office: o.office_code, subtype: o.subtype, info: o.subtype_info, min: num(o.lower_months), max: num(o.upper_months), inquiry: o.service_request_date ?? null })),
  };
}

// Délai moyen national (mois), rapport au Congrès.
const nat = csv((await cached(NATIONAL_CSV, NATIONAL_URL)).split(/\r?\n/).slice(4).join('\n'));
const national: Record<string, { label: string; months: number; received: number; pending: number }> = {};
const natKey = (form: string, desc: string) => (form === 'I-485' ? `I-485 ${(/\(([^)]+)\)/.exec(desc)?.[1] ?? '').toLowerCase()}` : form);
for (const r of nat) {
  if (!/^[IN]-\d/.test(r['Form Number'] ?? '')) continue;
  national[natKey(r['Form Number'], r['Description'])] = { label: r['Description'], months: Number(r['Avg. Processing Time']), received: Number(r['Forms Received'].replace(/,/g, '')), pending: Number(r['Pending'].replace(/,/g, '')) };
}
const natMonth = /For the Month of ([A-Za-z]+ \d{4})/.exec(readFileSync(join(CACHE, NATIONAL_CSV), 'utf8'))?.[1] ?? '';

// Bureaux de terrain : délai N-400 et I-485 famille du dernier relevé, et rang (1 = le plus rapide) sur la borne haute.
const latestOf = (a?: Array<[string, number | null, number | null]>) => (a && a.length ? a[a.length - 1] : null);
const offices: Record<string, any> = {};
for (const [code, h] of Object.entries(hist)) {
  if (!names[code] || ['FOD', 'SCD', 'NBC', 'IPO'].includes(code)) continue;
  const n = latestOf(h.n400), i = latestOf(h.i485fam);
  const inquiry = (f: string, sub: string) => forms[f].rows.find((r) => r.office === code && r.subtype === sub)?.inquiry ?? null;
  offices[code] = { name: names[code], n400: n && { date: n[0], min: n[1], max: n[2], inquiry: inquiry('n-400', '160A') }, i485fam: i && { date: i[0], min: i[1], max: i[2], inquiry: inquiry('i-485', '131A-FAM') }, hist: h };
}
const rank = (key: 'n400' | 'i485fam') => {
  const list = Object.entries(offices).filter(([, o]) => o[key]?.max != null).sort((a, b) => a[1][key].max - b[1][key].max || a[0].localeCompare(b[0]));
  list.forEach(([code], i) => (offices[code][`${key}Rank`] = i + 1));
  return list.length;
};
const counts = { n400: rank('n400'), i485fam: rank('i485fam') };
const published = forms['n-400'].updated;

const out = {
  published,
  source: { name: 'ImmigrationTimes.org Open Data (Version 2), from USCIS', url: 'https://immigrationtimes.org/data/', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', doi: '10.5281/zenodo.21311840', official: 'https://egov.uscis.gov/processing-times/' },
  national: { month: natMonth, url: NATIONAL_URL, forms: national },
  counts, offices, forms, officeNames: names,
};
writeFileSync(join(ROOT, 'src/data/ptimes.json'), JSON.stringify(out));
// Version allégée pour les simulateurs du navigateur : dernier relevé seulement, sans les séries.
const slimOffices = Object.fromEntries(Object.entries(offices).map(([c, o]) => [c, { name: o.name, n400: o.n400, i485fam: o.i485fam }]));
const slimForms = Object.fromEntries(Object.entries(forms).filter(([f]) => f !== 'n-400').map(([f, v]) => [f, { updated: v.updated, rows: f === 'i-485' ? v.rows.filter((r) => !offices[r.office]) : v.rows }]));
writeFileSync(join(ROOT, 'src/data/ptimes-latest.json'), JSON.stringify({ published, national: Object.fromEntries(Object.entries(national).map(([k, v]) => [k, v.months])), nationalMonth: natMonth, offices: slimOffices, forms: slimForms, officeNames: names }));
console.log(`publication USCIS ${published} · ${Object.keys(offices).length} bureaux (N-400 ${counts.n400}, I-485 famille ${counts.i485fam}) · national ${natMonth} : ${Object.keys(national).length} lignes`);
