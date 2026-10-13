/**
 * Parseur du Visa Bulletin (Département d'État), toutes époques confondues : décembre 2001 à aujourd'hui.
 *
 * Aucune dépendance : le HTML de adoptions.state.gov est lu par expressions régulières, tableau par tableau.
 * Ce qui change d'une époque à l'autre et que le parseur normalise (tests : tests/vb-parse.test.ts) :
 *  - libellés : « 1st » / « F1 », « 2A* » / « F2A », EB-5 renommé quatre fois (5th, C5/T5, Unreserved, Set Aside) ;
 *  - colonnes : Chine absente des premiers bulletins, El Salvador/Guatemala/Honduras et Vietnam certaines années,
 *    en-têtes aux espaces variables (« CHINA- mainland born », « CHINA - mainland born ») ;
 *  - valeurs : DDMMMYY, « C » (courante), « U » (indisponible) ; une année à deux chiffres postérieure à celle
 *    du bulletin vaut 19xx ;
 *  - deux tableaux par domaine depuis octobre 2015 : Final Action Dates puis Dates for Filing.
 * Le module n'importe rien : il tourne sous Node (scripts/build-bulletins.ts) comme sous vitest.
 */

export type Chart = 'FAD' | 'DFF';
export type Domain = 'family' | 'employment';
export type Country = 'ROW' | 'CN' | 'IN' | 'MX' | 'PH' | 'SV' | 'VN';
export type Cat = 'F1' | 'F2A' | 'F2B' | 'F3' | 'F4' | 'EB1' | 'EB2' | 'EB3' | 'EW' | 'EB4' | 'SR' | 'EB5' | 'EB5RC' | 'EB5R' | 'EB5H' | 'EB5I';
/** Valeur d'une case : date ISO (AAAA-MM-JJ), « C » (courante) ou « U » (indisponible). */
export type Cell = string;
export type Table = Partial<Record<Cat, Partial<Record<Country, Cell>>>>;
export interface Bulletin {
  /** Mois du bulletin, AAAA-MM. */
  month: string;
  FAD: Table;
  /** Dates for Filing : seulement depuis octobre 2015. */
  DFF?: Table;
  /** Colonnes de pays publiées par domaine (un pays absent suit la colonne « reste du monde »). */
  cols: Partial<Record<Domain, Country[]>>;
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/** « visa-bulletin-for-october-2026.html » → « 2026-10 ». */
export function monthFromUrl(url: string): string {
  const m = /visa-bulletin-for-([a-z]+)-(\d{4})/i.exec(url);
  if (!m) throw new Error(`URL de bulletin illisible : ${url}`);
  const i = MONTH_NAMES.indexOf(m[1].toLowerCase());
  if (i < 0) throw new Error(`Mois inconnu dans ${url}`);
  return `${m[2]}-${String(i + 1).padStart(2, '0')}`;
}

const decode = (s: string) =>
  s.replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&').replace(/&#8211;|&ndash;/gi, '-').replace(/&#\d+;|&[a-z]+;/gi, ' ');
// Balises en ligne (« 1<sup>st</sup> », « <b>F1</b> ») retirées sans espace ; les autres valent une espace.
const text = (html: string) =>
  decode(html.replace(/<\/?(sup|sub|b|i|u|strong|em|span|font|a)\b[^>]*>/gi, '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Valeur d'une case normalisée. Renvoie null si la case est vide ou illisible. */
export function parseCell(raw: string, bulletinMonth: string): Cell | null {
  const s = raw.toUpperCase().replace(/\s+/g, '');
  if (!s) return null;
  if (/^C\*?$/.test(s) || s === 'CURRENT') return 'C';
  if (/^U\*?$/.test(s) || s === 'UNAVAILABLE') return 'U';
  const m = /(\d{1,2})([A-Z]{3})(\d{2})/.exec(s);
  if (!m) return null;
  const mi = MONTHS.indexOf(m[2]);
  if (mi < 0) return null;
  const yy = Number(m[3]);
  const by = Number(bulletinMonth.slice(2, 4));
  const year = (yy > by + 1 ? 1900 : 2000) + yy;
  return `${year}-${String(mi + 1).padStart(2, '0')}-${String(Number(m[1])).padStart(2, '0')}`;
}

/** En-tête de colonne → pays. */
export function columnCountry(h: string): Country | null {
  // Espaces et tirets retirés : « PHILIP-PINES » (mars 2006), « Charge- ability » (2005), « CHINA - mainland born ».
  const s = h.toUpperCase().replace(/[\s-]+/g, '');
  if (/CHARGEAB|CHARGAB/.test(s)) return 'ROW';
  if (/CHINA/.test(s)) return 'CN';
  if (/INDIA/.test(s)) return 'IN';
  if (/MEXICO/.test(s)) return 'MX';
  if (/PHILIPPINES/.test(s)) return 'PH';
  if (/SALVADOR|GUATEMALA|HONDURAS/.test(s)) return 'SV';
  if (/VIETNAM/.test(s)) return 'VN';
  return null;
}

/** Libellé de ligne → catégorie, selon le domaine du tableau. */
export function rowCategory(label: string, domain: Domain): Cat | null {
  const s = label.toUpperCase().replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  if (domain === 'family') {
    if (/^(F1|1(ST|ND|RD|TH)?)\b/.test(s)) return 'F1';
    if (/^(F2A|2A)\b/.test(s)) return 'F2A';
    if (/^(F2B|2B)\b/.test(s)) return 'F2B';
    if (/^(F3|3(ST|ND|RD|TH)?)\b/.test(s)) return 'F3';
    if (/^(F4|4(ST|ND|RD|TH)?)\b/.test(s)) return 'F4';
    return null;
  }
  if (/OTHER WORKERS/.test(s)) return 'EW';
  if (/RELIGIOUS/.test(s)) return 'SR';
  if (/RURAL/.test(s)) return 'EB5R';
  if (/HIGH UNEMPLOYMENT/.test(s)) return 'EB5H';
  if (/INFRASTRUCTURE/.test(s)) return 'EB5I';
  if (/^5TH/.test(s) || /^EB-?5/.test(s)) {
    // « 5th Regional Center (I5 and R5) » et « Targeted Employment Areas/Regional Centers » : programme des centres régionaux.
    if (/NON-?REGIONAL|UNRESERVED/.test(s)) return 'EB5';
    if (/REGIONAL CENTER|PILOT/.test(s)) return 'EB5RC';
    return 'EB5';
  }
  if (/TARGETED EMPLOYMENT|REGIONAL CENTER/.test(s)) return 'EB5RC';
  if (/^(1(ST|ND|RD|TH)?|EB-?1)\b/.test(s)) return 'EB1';
  if (/^(2(ST|ND|RD|TH)?|EB-?2)\b/.test(s)) return 'EB2';
  if (/^(3(ST|ND|RD|TH)?|EB-?3)\b/.test(s)) return 'EB3';
  if (/^(4(ST|ND|RD|TH)?|EB-?4)\b/.test(s)) return 'EB4';
  return null;
}

interface RawTable { start: number; rows: string[][] }

/** Tableaux du document, avec leurs lignes de cellules (texte). Un tableau court jusqu'à son `</table>` ou jusqu'à
 *  la balise `<table` suivante : plusieurs bulletins de 2002 et 2003 oublient de fermer le tableau famille. */
function rawTables(html: string): RawTable[] {
  const out: RawTable[] = [];
  const starts = [...html.matchAll(/<table\b[^>]*>/gi)];
  starts.forEach((m, i) => {
    const from = m.index! + m[0].length;
    const nextOpen = i + 1 < starts.length ? starts[i + 1].index! : html.length;
    const close = html.toLowerCase().indexOf('</table>', from);
    const body = html.slice(from, Math.min(nextOpen, close < 0 ? html.length : close));
    const rows: string[][] = [];
    // Une ligne court jusqu'à son </tr> ou jusqu'au <tr suivant (balises de fin parfois absentes).
    for (const r of body.split(/<tr\b[^>]*>/i).slice(1)) {
      const cells: string[] = [];
      for (const c of r.split(/<t[hd]\b[^>]*>/i).slice(1)) cells.push(text(c.replace(/<\/t[hd]>[\s\S]*$/i, '').replace(/<\/tr>[\s\S]*$/i, '')));
      if (cells.length) rows.push(cells);
    }
    out.push({ start: m.index!, rows });
  });
  return out;
}

/** Lit un bulletin complet. `month` : AAAA-MM du bulletin (tiré de l'URL de l'index, jamais reconstruit). */
export function parseBulletin(html: string, month: string): Bulletin {
  const tables = rawTables(html);
  const b: Bulletin = { month, FAD: {}, cols: {} };
  const seen: Record<Domain, number> = { family: 0, employment: 0 };
  for (const t of tables) {
    const hi = t.rows.findIndex((r) => r.some((c) => /charg\s*e?-?\s*ab/i.test(c)));
    if (hi < 0) continue;
    const header = t.rows[hi];
    const cols = header.map(columnCountry);
    if (!cols.includes('ROW')) continue;
    const corner = header[0] ?? '';
    const labels = t.rows.slice(hi + 1).map((r) => r[0] ?? '');
    let domain: Domain;
    if (/family/i.test(corner) || labels.some((l) => /^family/i.test(l))) domain = 'family';
    else if (/employ/i.test(corner) || labels.some((l) => /^employ/i.test(l))) domain = 'employment';
    else if (labels.some((l) => /^(F1|F2A|2A)/i.test(l.trim()))) domain = 'family';
    else if (labels.some((l) => /other workers/i.test(l))) domain = 'employment';
    else continue;
    // Les titres qui précèdent le tableau disent lequel des deux tableaux on lit ; à défaut, l'ordre (FAD puis DFF).
    const before = text(html.slice(Math.max(0, t.start - 4000), t.start)).toUpperCase();
    const iFiling = before.lastIndexOf('DATES FOR FILING');
    const iFinal = before.lastIndexOf('FINAL ACTION DATE');
    let chart: Chart = seen[domain] === 0 ? 'FAD' : 'DFF';
    if (iFiling >= 0 || iFinal >= 0) chart = iFiling > iFinal ? 'DFF' : 'FAD';
    if (month < '2015-10') chart = 'FAD';
    seen[domain]++;
    if (chart === 'FAD') b.cols[domain] = cols.filter((c): c is Country => !!c);
    const target: Table = chart === 'FAD' ? b.FAD : (b.DFF ??= {});
    // Le tableau a déjà été rempli (tableau répété) : on garde le premier.
    for (const row of t.rows.slice(hi + 1)) {
      const cat = rowCategory(row[0] ?? '', domain);
      if (!cat) continue;
      if (target[cat]) continue;
      const vals: Partial<Record<Country, Cell>> = {};
      // Ligne avec une cellule de moins que l'en-tête (coin vide fusionné) : on aligne par la droite.
      const offset = header.length - row.length;
      cols.forEach((country, ci) => {
        if (!country) return;
        const v = row[ci - offset];
        if (v === undefined || ci - offset < 1) return;
        const cell = parseCell(v, month);
        if (cell) vals[country] = cell;
      });
      if (Object.keys(vals).length) target[cat] = vals;
    }
  }
  // De 2011 à 2015, une seule ligne EB-5 (« 5th Targeted Employment Areas/Regional Centers and Pilot Programs ») :
  // elle vaut pour toute la catégorie.
  for (const t of [b.FAD, b.DFF]) if (t && !t.EB5 && t.EB5RC) t.EB5 = t.EB5RC;
  return b;
}

/** Contrôle d'intégrité : les cinq cases famille et EB-1 à EB-4 avec la colonne « reste du monde », et une valeur
 *  pour chaque pays dont la colonne est publiée ; les deux tableaux depuis octobre 2015. */
export function integrity(b: Bulletin): string[] {
  const errs: string[] = [];
  const fam: Cat[] = ['F1', 'F2A', 'F2B', 'F3', 'F4'];
  const emp: Cat[] = ['EB1', 'EB2', 'EB3', 'EW', 'EB4'];
  for (const [cats, dom] of [[fam, 'family'], [emp, 'employment']] as Array<[Cat[], Domain]>) {
    const cols = b.cols[dom] ?? [];
    if (!cols.includes('ROW')) errs.push(`${b.month} tableau ${dom} introuvable`);
    for (const c of cats) for (const k of cols) if (!b.FAD[c]?.[k]) errs.push(`${b.month} FAD ${c} ${k} manquant`);
    if (b.month >= '2015-10') for (const c of cats) if (!b.DFF?.[c]?.ROW) errs.push(`${b.month} DFF ${c} ROW manquant`);
  }
  return errs;
}
