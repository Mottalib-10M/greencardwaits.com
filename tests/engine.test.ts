/**
 * Moteurs de calcul : prévision, case du bulletin, frais G-1055, âge CSPA, naturalisation, délais.
 * Chaque montant attendu est recalculé à la main depuis le G-1055 (édition 10/07/26) ou la page citée.
 */
import { describe, it, expect } from 'vitest';
import { forecastAt, kmQuantiles, passages, actualWait, bucketFor, isReliable, CURRENT, isoToDays, monthStart, addMonths, type Val } from '../src/lib/engine/forecast';
import { evaluate, cellAt, filingChart, moveDays, distinctShare, backtestCells, LATEST } from '../src/lib/engine/cases';
import { feeTotal, DEFAULT_FEES } from '../src/lib/engine/fees';
import { cspa, n400, checkTime, ageOn } from '../src/lib/engine/rules';
import BT from '../src/data/backtest.json';
import P from '../src/data/params-2026.json';

// Série synthétique : 200 mois, la date limite avance de 30 jours par mois.
const months = Array.from({ length: 200 }, (_, i) => addMonths('2005-01', i));
const linear: Val[] = months.map((m) => monthStart(m) - 3650 + 0);

describe('prévision par temps de passage', () => {
  it('une date limite qui avance d’un mois par mois : 12 mois de retard → environ 12 mois', () => {
    const t = 180;
    const pd = (linear[t] as number) + 365;
    const f = forecastAt(linear, months, t, pd);
    expect(f.status).toBe('waiting');
    expect(f.p50).toBeGreaterThanOrEqual(11);
    expect(f.p50).toBeLessThanOrEqual(13);
    expect(f.p20).toBeLessThanOrEqual(f.p50);
    expect(f.p80).toBeGreaterThanOrEqual(f.p50);
  });
  it('courante si la date de priorité est antérieure à la date limite, ou si la case est « C »', () => {
    expect(forecastAt(linear, months, 100, (linear[100] as number) - 1).status).toBe('current');
    const cur: Val[] = months.map(() => CURRENT);
    expect(forecastAt(cur, months, 100, monthStart(months[100])).status).toBe('current');
  });
  it('« U » ce mois : pas de prévision', () => {
    const s = [...linear];
    s[150] = null;
    expect(forecastAt(s, months, 150, 0).status).toBe('unavailable');
  });
  it('ne lit jamais l’avenir : changer les mois après t ne change pas la prévision', () => {
    const t = 120, pd = (linear[t] as number) + 400;
    const a = forecastAt(linear, months, t, pd);
    const s = linear.map((v, i) => (i > t ? 0 : v));
    expect(forecastAt(s, months, t, pd)).toEqual(a);
  });
  it('Kaplan-Meier : départs censurés ni comptés réussis ni échoués', () => {
    const ev = [{ h: 2, done: true }, { h: 4, done: true }, { h: 3, done: false }, { h: 10, done: false }];
    const [p20, p50, p80] = kmQuantiles(ev, [0.2, 0.5, 0.8]);
    expect(p20).toBe(2);
    expect(p50).toBe(4);
    expect(p80).toBe(Infinity);
  });
  it('une date figée ne passe jamais le cap : délai infini', () => {
    const flat: Val[] = months.map(() => isoToDays('2010-01-01'));
    const f = forecastAt(flat, months, 150, isoToDays('2011-01-01'));
    expect(f.p50).toBe(Infinity);
    expect(passages(flat, months, 150, 30).every((e) => !e.done)).toBe(true);
  });
  it('délai réel observé', () => {
    expect(actualWait(linear, months, 100, (linear[100] as number) + 300)).toBe(10);
  });
  it('case de rétro-test selon le retard', () => {
    expect(bucketFor(5)).toBe(6);
    expect(bucketFor(15)).toBe(12);
    expect(bucketFor(40)).toBe(48);
    expect(bucketFor(100)).toBeNull();
  });
  it('règle de fiabilité', () => {
    expect(isReliable({ observed: 100, pending: 0, medianError: 3, coverage: 0.6, medianActual: 9 })).toBe(true);
    expect(isReliable({ observed: 100, pending: 0, medianError: 12, coverage: 0.6, medianActual: 9 })).toBe(false);
    expect(isReliable({ observed: 100, pending: 0, medianError: 3, coverage: 0.2, medianActual: 9 })).toBe(false);
    expect(isReliable({ observed: 5, pending: 0, medianError: 1, coverage: 0.9, medianActual: 9 })).toBe(false);
  });
});

describe('rétro-test publié', () => {
  it('couvre octobre 2012 à octobre 2025, 55 cases × 4 retards', () => {
    expect(BT.from).toBe('2012-10');
    expect(BT.to).toBe('2025-10');
    expect(Object.keys(BT.cases)).toHaveLength(55);
    for (const c of Object.values(BT.cases)) expect(c.cells).toHaveLength(4);
  });
  it('fourchette mieux calibrée que la cible minimale sur les cases de famille du reste du monde', () => {
    for (const k of ['F1-ROW', 'F2B-ROW', 'F3-ROW', 'F4-ROW']) {
      const c = (BT.cases as any)[k].cells.find((x: any) => x.gapMonths === 12);
      expect(c.coverage).toBeGreaterThanOrEqual(0.4);
    }
  });
  it('pays à date propre : seuil de 25 % des bulletins depuis 2015', () => {
    expect(distinctShare('EB2', 'IN')).toBeGreaterThan(0.9);
    expect(distinctShare('F1', 'CN')).toBeLessThan(0.25);
    expect(distinctShare('F2A', 'MX')).toBeGreaterThan(0.25);
  });
  it('chaque case porte ses quatre lignes', () => expect(backtestCells('F4', 'PH')).toHaveLength(4));
});

describe('case du bulletin d’octobre 2026', () => {
  it('dernier bulletin', () => expect(LATEST).toBe('2026-10'));
  it('valeurs du mois', () => {
    expect(cellAt('EB2', 'IN', 'FAD')).toBe('2013-11-01');
    expect(cellAt('EB2', 'IN', 'DFF')).toBe('2015-01-15');
    expect(cellAt('F2A', 'ROW', 'DFF')).toBe('C');
    expect(cellAt('EB1', 'ROW', 'FAD')).toBe('C');
  });
  it('USCIS impose les Dates for Filing en octobre 2026, famille et emploi', () => {
    expect(filingChart('F2B')).toBe('DFF');
    expect(filingChart('EB3')).toBe('DFF');
  });
  it('EB-2 Inde, priorité 2013 : courante', () => expect(evaluate('EB2', 'IN', '2013-06-01').status).toBe('current'));
  it('EB-2 Inde, priorité juin 2014 : en attente, mais I-485 déposable (Dates for Filing 15 janvier 2015)', () => {
    const r = evaluate('EB2', 'IN', '2014-06-01');
    expect(r.status).toBe('waiting');
    expect(r.canFile).toBe(true);
    expect(r.behindMonths).toBeGreaterThan(6);
    expect(r.range).toHaveLength(3);
  });
  it('EB-2 Inde, priorité 2020 : ni courante ni déposable', () => {
    const r = evaluate('EB2', 'IN', '2020-03-01');
    expect(r.canFile).toBe(false);
    expect(r.behindMonths).toBeGreaterThan(72);
    expect(r.reliable).toBe(false);
  });
  it('F2B Mexique, deux ans de retard : le modèle échoue au rétro-test, le rythme des 12 mois passe et sert de prévision', () => {
    const r = evaluate('F2B', 'MX', '2012-05-15');
    expect(r.backtest?.reliable).toBe(false);
    expect(r.backtest?.naiveReliable).toBe(true);
    expect(r.method).toBe('pace');
    expect(r.reliable).toBe(true);
  });
  it('immediate relative : aucune file d’attente', () => expect(evaluate('IR', 'MX', '2026-01-01').status).toBe('noqueue'));
  it('avance du mois : nombre ou null', () => {
    const m = moveDays('F2B', 'MX');
    expect(m === null || Number.isFinite(m)).toBe(true);
  });
});

describe('frais G-1055 (édition 10/07/26) et Département d’État', () => {
  it('édition lue', () => expect(P.g1055_edition).toBe('10/07/26'));
  it('carte verte par mariage, papier, avec permis de travail et advance parole : 675 + 1 440 + 260 + 630', () => {
    expect(feeTotal(DEFAULT_FEES).total).toBe(3005);
  });
  it('même dossier en ligne : 625 + 1 390 + 260 + 580', () => expect(feeTotal({ ...DEFAULT_FEES, online: true }).total).toBe(2855));
  it('mariage sans permis ni advance parole : 2 115', () => expect(feeTotal({ ...DEFAULT_FEES, ead: false, advanceParole: false }).total).toBe(2115));
  it('enfant de moins de 14 ans avec un parent : 950 $ (papier)', () => {
    const t = feeTotal({ ...DEFAULT_FEES, ead: false, advanceParole: false, kidsUnder14: 1 });
    expect(t.total).toBe(675 + 1440 + 950);
  });
  it('procédure consulaire familiale, un demandeur : 675 + 325 + 120 + 235', () => {
    const t = feeTotal({ ...DEFAULT_FEES, path: 'family-consular' });
    expect(t.total).toBe(1355);
    expect(t.dos).toBe(445);
  });
  it('emploi, ajustement : I-140 715 + 600 (Asylum Program) + I-485 1 440, sans options', () => {
    expect(feeTotal({ ...DEFAULT_FEES, path: 'employment', ead: false, advanceParole: false }).total).toBe(2755);
    expect(feeTotal({ ...DEFAULT_FEES, path: 'employment', ead: false, advanceParole: false, smallEmployer: true }).total).toBe(2455);
  });
  it('emploi, consulaire : 715 + 600 + 345 + 235', () => expect(feeTotal({ ...DEFAULT_FEES, path: 'employment-consular' }).total).toBe(1895));
  it('fiancé(e) K-1 puis I-485 : 675 + 265 + 1 440 + 260 + 630', () => expect(feeTotal({ ...DEFAULT_FEES, path: 'k1' }).total).toBe(3270));
  it('N-400 : 760 papier, 710 en ligne, 380 réduit', () => {
    expect(feeTotal({ ...DEFAULT_FEES, path: 'n400' }).total).toBe(760);
    expect(feeTotal({ ...DEFAULT_FEES, path: 'n400', online: true }).total).toBe(710);
    expect(feeTotal({ ...DEFAULT_FEES, path: 'n400', online: true, reducedN400: true }).total).toBe(380);
  });
  it('I-751 750 / 700, I-90 465 / 415', () => {
    expect(feeTotal({ ...DEFAULT_FEES, path: 'i751' }).total).toBe(750);
    expect(feeTotal({ ...DEFAULT_FEES, path: 'i751', online: true }).total).toBe(700);
    expect(feeTotal({ ...DEFAULT_FEES, path: 'i90' }).total).toBe(465);
    expect(feeTotal({ ...DEFAULT_FEES, path: 'i90', online: true }).total).toBe(415);
  });
});

describe('âge CSPA (Policy Manual, vol. 7, partie A, chap. 7)', () => {
  it('exemple d’USCIS : pétition du 1er février 2016 approuvée le 1er août 2016 = 182 jours', () => {
    const r = cspa({ birth: '1996-01-01', petitionFiled: '2016-02-01', petitionApproved: '2016-08-01', visaAvailable: '2016-09-01' });
    expect(r.pendingDays).toBe(182);
  });
  it('21 ans et 3 mois au visa, pétition instruite 6 mois : protégé', () => {
    const r = cspa({ birth: '2004-06-01', petitionFiled: '2020-01-01', petitionApproved: '2020-07-01', visaAvailable: '2025-09-01' });
    expect(ageOn('2004-06-01', r.availability)).toBe(21);
    expect(r.protected).toBe(true);
    expect(r.soughtBy).toBe('2026-09-01');
  });
  it('21 ans et 9 mois au visa, pétition instruite 3 mois : non protégé', () => {
    const r = cspa({ birth: '2004-01-01', petitionFiled: '2020-01-01', petitionApproved: '2020-04-01', visaAvailable: '2025-10-01' });
    expect(r.protected).toBe(false);
  });
  it('approbation postérieure à la date courante : c’est l’approbation qui compte', () => {
    expect(cspa({ birth: '2005-01-01', petitionFiled: '2022-01-01', petitionApproved: '2024-03-15', visaAvailable: '2023-01-01' }).availability).toBe('2024-03-15');
  });
});

describe('naturalisation (Policy Manual, vol. 12, partie D)', () => {
  it('dépôt possible 90 jours avant les 5 ans', () => {
    const r = n400({ residentSince: '2021-11-15', spouseOfCitizen: false, trips: [], today: '2026-10-13' });
    expect(r.anniversary).toBe('2026-11-15');
    expect(r.earliestFiling).toBe('2026-08-17');
    expect(r.canFileToday).toBe(true);
    expect(r.daysRequired).toBe(913);
  });
  it('conjoint de citoyen : 3 ans et 548 jours', () => {
    const r = n400({ residentSince: '2024-03-01', spouseOfCitizen: true, trips: [], today: '2026-10-13' });
    expect(r.anniversary).toBe('2027-03-01');
    expect(r.daysRequired).toBe(548);
    expect(r.canFileToday).toBe(false);
  });
  it('voyages : jours de départ et de retour présents ; absence de plus de 6 mois signalée', () => {
    const r = n400({ residentSince: '2020-01-01', spouseOfCitizen: false, trips: [{ out: '2023-01-01', back: '2023-01-11' }, { out: '2024-01-01', back: '2024-08-01' }], today: '2026-10-13' });
    expect(r.daysAbroad).toBe(9 + 212);
    expect(r.longTrips).toBe(1);
    expect(r.breakingTrips).toBe(0);
    expect(r.presenceOk).toBe(true);
  });
});

describe('délai USCIS', () => {
  it('hors délai et demande de renseignement possible', () => {
    const c = checkTime('2024-01-01', '2026-10-13', 12, 14, '2025-08-25');
    expect(c.state).toBe('outside');
    expect(c.canInquire).toBe(true);
  });
  it('dans le délai', () => expect(checkTime('2026-05-01', '2026-10-13', 12, 14, '2025-08-25').state).toBe('within'));
});
