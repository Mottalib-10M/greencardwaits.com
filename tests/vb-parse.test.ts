/**
 * Le parseur du Visa Bulletin, un cas par époque, sur les bulletins réels (tests/fixtures, téléchargés le
 * 2026-10-13 sur adoptions.state.gov). Les valeurs attendues ont été lues à l'œil sur les tableaux publiés.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseBulletin, parseCell, rowCategory, columnCountry, monthFromUrl, integrity } from '../src/lib/engine/vb-parse';
import VB from '../src/data/visa-bulletin.json';

const fx = (m: string) => readFileSync(new URL(`./fixtures/visa-bulletin-for-${m}.html.txt`, import.meta.url), 'utf8');

describe('janvier 2002 : un seul tableau par domaine, pas de colonne Chine, années à deux chiffres anciennes', () => {
  const b = parseBulletin(fx('january-2002'), '2002-01');
  it('famille, colonne reste du monde', () => {
    expect(b.FAD.F1?.ROW).toBe('1999-03-01');
    expect(b.FAD.F2A?.ROW).toBe('1996-10-01');
    expect(b.FAD.F3?.ROW).toBe('1996-05-08');
    expect(b.FAD.F4?.ROW).toBe('1989-12-01');
  });
  it('Mexique et Philippines, siècle 19xx', () => {
    expect(b.FAD.F1?.MX).toBe('1994-04-22');
    expect(b.FAD.F1?.PH).toBe('1988-08-08');
    expect(b.FAD.F4?.PH).toBe('1979-11-15');
  });
  it('emploi : tout courant, aucune colonne Chine, pas de Dates for Filing', () => {
    expect(b.FAD.EB2?.ROW).toBe('C');
    expect(b.FAD.EB3?.IN).toBe('C');
    expect(b.FAD.EB1?.CN).toBeUndefined();
    expect(b.DFF).toBeUndefined();
    expect(b.cols.family).toEqual(['ROW', 'IN', 'MX', 'PH']);
  });
  it('intégrité', () => expect(integrity(b)).toEqual([]));
});

describe('octobre 2015 : premier mois à deux tableaux (Final Action et Dates for Filing)', () => {
  const b = parseBulletin(fx('october-2015'), '2015-10');
  it('Final Action Dates', () => {
    expect(b.FAD.EB2?.IN).toBe('2005-05-01');
    expect(b.FAD.EB2?.CN).toBe('2012-01-01');
    expect(b.FAD.F1?.MX).toBe('1994-11-22');
    expect(b.FAD.F2A?.ROW).toBe('2014-04-15');
    expect(b.FAD.EW?.CN).toBe('2006-01-01');
  });
  it('Dates for Filing', () => {
    expect(b.DFF?.EB2?.IN).toBe('2009-07-01');
    expect(b.DFF?.F1?.ROW).toBe('2009-05-01');
    expect(b.DFF?.F2A?.MX).toBe('2015-03-01');
  });
  it('EB-5 : la ligne hors centres régionaux est retenue, la ligne des centres régionaux est « U »', () => {
    expect(b.FAD.EB5?.CN).toBe('2013-10-08');
    expect(b.FAD.EB5RC?.ROW).toBe('U');
  });
  it('intégrité', () => expect(integrity(b)).toEqual([]));
});

describe('octobre 2026 : EB-5 « Unreserved » et trois réserves, URL rangée sous /2027/', () => {
  const b = parseBulletin(fx('october-2026'), '2026-10');
  it('famille', () => {
    expect(b.FAD.F1).toEqual({ ROW: '2020-01-22', CN: '2020-01-22', IN: '2020-01-22', MX: '2008-09-08', PH: '2013-11-01' });
    expect(b.FAD.F3?.MX).toBe('2001-07-01');
    expect(b.FAD.F4?.IN).toBe('2006-12-15');
    expect(b.FAD.F4?.MX).toBe('2001-04-22');
  });
  it('emploi', () => {
    expect(b.FAD.EB1?.ROW).toBe('C');
    expect(b.FAD.EB1?.IN).toBe('2023-02-01');
    expect(b.FAD.EB2?.IN).toBe('2013-11-01');
    expect(b.FAD.EB3?.PH).toBe('2023-08-15');
    expect(b.FAD.EB5?.CN).toBe('2016-12-01');
    expect(b.FAD.EB5R?.CN).toBe('C');
  });
  it('Dates for Filing', () => {
    expect(b.DFF?.F2A?.ROW).toBe('C');
    expect(b.DFF?.EB2?.IN).toBe('2015-01-15');
    expect(b.DFF?.EB3?.IN).toBe('2015-01-15');
  });
  it('mois tiré de l’URL, jamais du dossier d’exercice', () => {
    expect(monthFromUrl('/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-october-2026.html')).toBe('2026-10');
  });
});

describe('normalisation', () => {
  it('valeurs', () => {
    expect(parseCell('01JUL01', '2026-10')).toBe('2001-07-01');
    expect(parseCell('15NOV79', '2002-01')).toBe('1979-11-15');
    expect(parseCell(' C ', '2026-10')).toBe('C');
    expect(parseCell('U', '2026-10')).toBe('U');
    expect(parseCell('', '2026-10')).toBeNull();
  });
  it('libellés de toutes les époques', () => {
    expect(rowCategory('2A*', 'family')).toBe('F2A');
    expect(rowCategory('4rd', 'family')).toBe('F4');
    expect(rowCategory('1st', 'employment')).toBe('EB1');
    expect(rowCategory('5th Non-Regional Center (C5 and T5)', 'employment')).toBe('EB5');
    expect(rowCategory('5th Regional Center (I5 and R5)', 'employment')).toBe('EB5RC');
    expect(rowCategory('5th Unreserved (including C5, T5, I5, R5)', 'employment')).toBe('EB5');
    expect(rowCategory('5th Set Aside: Rural (20%)', 'employment')).toBe('EB5R');
    expect(rowCategory('Other Workers', 'employment')).toBe('EW');
  });
  it('en-têtes de colonnes', () => {
    expect(columnCountry('CHINA - mainland born')).toBe('CN');
    expect(columnCountry('PHILIP-PINES')).toBe('PH');
    expect(columnCountry('All Charge- ability Areas Except Those Listed')).toBe('ROW');
  });
});

describe('archive complète', () => {
  it('294 bulletins de décembre 2001 à octobre 2026, aucune case manquante', () => {
    expect(VB.count).toBe(294);
    expect(VB.first).toBe('2001-12');
    expect(VB.latest).toBe('2026-10');
    for (const b of VB.bulletins as any[]) expect(integrity(b)).toEqual([]);
  });
});
