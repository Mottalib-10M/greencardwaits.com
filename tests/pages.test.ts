/**
 * Contrôle des fichiers de pages (src/content/) avant le build : snippets (§11), paragraphe citable (§21), FAQ (§7),
 * longueur du texte écrit, mots interdits, tiret cadratin, questions uniques sur tout le site.
 * Une page seule : PAGE_FILES=employment/eb-2-india npx vitest run tests/pages.test.ts (plusieurs : séparées par des virgules).
 */
import { describe, it, expect } from 'vitest';
import { PAGES } from '../src/lib/guides';
import { HOME } from '../src/content/home';
import { helpers } from '../src/lib/helpers';
import type { PageText } from '../src/lib/guide-types';

const only = (process.env.PAGE_FILES ?? '').split(',').map((s) => s.trim().split('/').pop()!).filter(Boolean);
const pages = PAGES.filter((p) => !only.length || only.includes(p.id));
const COUNTRY = /^(Australia|Canada|México|Mexico|Mexican|US |USA|American|UK |United Kingdom|India |China |Philippines )/;
const GENERIC = /^(¿|calculator\b|calculate\b|calculadora\b|calcula\b|cálculo\b|about\b|methodology\b|faq\b|how\b|what\b|when\b|cuánto\b|cómo\b|qué\b|sobre nosotros\b|preguntas frecuentes\b)/i;
const BANNED = [/it['’]s important to note/i, /\bdelve\b/i, /dive into/i, /whether you['’]re/i, /\bmoreover\b/i, /\bfurthermore\b/i, /\bnestled\b/i, /\bboasts?\b/i, /hidden gem/i, /\bin conclusion\b/i, /\bnotario\b/i, /\bin today['’]s\b/i, /navigate the complex/i, /\bunlock\b/i, /\bseamless/i, /\brobust\b/i, /\bembark/i];
const EMDASH = new RegExp('\\u2014');
const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const isGuide = (g: string) => g === 'guides';

function checkText(id: string, lang: 'en' | 'es', x: PageText, guide: boolean, hasTool: boolean) {
  const body = x.body(helpers(lang));
  const all = [x.title, x.description, x.h1, x.intro, x.resume, body, ...x.faqs.flatMap((f) => [f.q, f.a])].join(' ');
  it(`${id} ${lang} : aucun TODO`, () => expect(all).not.toMatch(/TODO/));
  it(`${id} ${lang} : titre 50-60 car., terme-clé en tête`, () => {
    expect(x.title.length, x.title).toBeGreaterThanOrEqual(50);
    expect(x.title.length, x.title).toBeLessThanOrEqual(60);
    expect(x.title).not.toMatch(COUNTRY);
    expect(x.title).not.toMatch(GENERIC);
  });
  it(`${id} ${lang} : description 150-160 car.`, () => {
    expect(x.description.length, x.description).toBeGreaterThanOrEqual(150);
    expect(x.description.length, x.description).toBeLessThanOrEqual(160);
  });
  it(`${id} ${lang} : paragraphe citable d'au moins 120 mots, sans balise`, () => {
    expect(words(x.resume), x.resume.slice(0, 60)).toBeGreaterThanOrEqual(120);
    expect(x.resume).not.toMatch(/<|\n\n/);
  });
  it(`${id} ${lang} : FAQ (${guide ? '6 à 8' : '3 à 5'}), réponses de 40 à 90 mots, nom du sujet`, () => {
    const lo = guide ? 6 : 3, hi = guide ? 8 : 5;
    expect(x.faqs.length).toBeGreaterThanOrEqual(lo);
    expect(x.faqs.length).toBeLessThanOrEqual(hi);
    for (const f of x.faqs) {
      const n = words(f.a);
      expect(n, f.q).toBeGreaterThanOrEqual(40);
      expect(n, f.q).toBeLessThanOrEqual(90);
      expect(f.a.length, f.q).toBeGreaterThanOrEqual(120);
    }
  });
  it(`${id} ${lang} : longueur du texte écrit`, () => {
    const n = words(body);
    if (guide) expect(n, 'guide : corps ≥ 900 mots').toBeGreaterThanOrEqual(900);
    else {
      expect(n, 'page : corps ≥ 180 mots').toBeGreaterThanOrEqual(hasTool ? 180 : 400);
      // Texte écrit pour la page (corps + paragraphe citable + FAQ) : au moins 450 mots.
      expect(n + words(x.resume) + x.faqs.reduce((a, f) => a + words(f.a) + words(f.q), 0), 'texte écrit ≥ 450 mots').toBeGreaterThanOrEqual(450);
    }
    expect(body).toMatch(/<h2/);
  });
  it(`${id} ${lang} : ni mots interdits ni tiret cadratin`, () => {
    for (const b of BANNED) expect(all, String(b)).not.toMatch(b);
    expect(all).not.toMatch(EMDASH);
  });
  it(`${id} ${lang} : aucun lien vers un autre site du portefeuille`, () => {
    expect(all).not.toMatch(/immigrationpoints|usfamilycalc|usbenefitscalc|netsalarycalculator|taxratesbystate|laborlawbystate/i);
  });
}

describe('pages de contenu', () => {
  for (const p of pages) {
    checkText(p.id, 'en', p.en, isGuide(p.group), !!p.tool);
    if (p.es) checkText(p.id, 'es', p.es, isGuide(p.group), !!p.tool);
  }
});

describe.skipIf(only.length > 0 && !only.includes('home'))('accueil', () => {
  for (const lang of ['en', 'es'] as const) {
    const x = HOME[lang];
    it(`home ${lang} : snippets`, () => {
      expect(x.title.length).toBeGreaterThanOrEqual(50); expect(x.title.length).toBeLessThanOrEqual(60);
      expect(x.description.length).toBeGreaterThanOrEqual(150); expect(x.description.length).toBeLessThanOrEqual(160);
      expect(x.title).not.toMatch(GENERIC);
    });
    it(`home ${lang} : 6 à 8 questions, citable, corps ≥ 1 300 mots`, () => {
      expect(x.faqs.length).toBeGreaterThanOrEqual(6); expect(x.faqs.length).toBeLessThanOrEqual(8);
      for (const f of x.faqs) { expect(words(f.a)).toBeGreaterThanOrEqual(40); expect(words(f.a)).toBeLessThanOrEqual(90); }
      expect(words(x.resume)).toBeGreaterThanOrEqual(120);
      expect(words(x.body(helpers(lang)))).toBeGreaterThanOrEqual(1300);
      expect([x.title, x.description, x.resume, x.body(helpers(lang))].join(' ')).not.toMatch(EMDASH);
    });
  }
});

describe('unicité sur tout le site', () => {
  it('une question de FAQ ne paraît qu’une fois', () => {
    const qs = [...PAGES.flatMap((p) => [...p.en.faqs, ...(p.es?.faqs ?? [])]), ...HOME.en.faqs, ...HOME.es.faqs].map((f) => f.q.trim().toLowerCase()).filter((q) => q !== 'todo');
    const dup = qs.filter((q, i) => qs.indexOf(q) !== i);
    expect(dup).toEqual([]);
  });
  it('deux pages ne partagent pas le même titre', () => {
    const ts = [...PAGES.flatMap((p) => [p.en.title, p.es?.title].filter(Boolean)), HOME.en.title, HOME.es.title].filter((t) => t !== 'TODO');
    expect(ts.filter((t, i) => ts.indexOf(t) !== i)).toEqual([]);
  });
});
