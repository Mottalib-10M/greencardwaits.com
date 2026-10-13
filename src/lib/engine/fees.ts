/**
 * Frais d'un parcours de carte verte ou de naturalisation, ligne par ligne, d'après le barème G-1055 d'USCIS
 * (édition 10/07/26) et les frais de visa du Département d'État. Tous les montants viennent de params-2026.json.
 * Ce qui n'est jamais compté parce que personne ne le fixe : l'examen médical chez le médecin agréé, les traductions,
 * les photos, l'avocat.
 */
import PARAMS from '../../data/params-2026.json';

export const F = PARAMS.fees;
export type Path = 'marriage' | 'family-consular' | 'employment' | 'employment-consular' | 'k1' | 'n400' | 'i751' | 'i90';
export type Lang = 'en' | 'es';

export interface FeeInput {
  path: Path;
  /** Dépôt en ligne quand USCIS le permet (moins cher de 50 $ sur la plupart des formulaires). */
  online: boolean;
  /** Personnes qui déposent un I-485 en plus du demandeur principal (conjoint, enfants de 14 ans ou plus). */
  extraAdults: number;
  /** Enfants de moins de 14 ans qui déposent leur I-485 avec celui d'un parent. */
  kidsUnder14: number;
  /** Demander le permis de travail (I-765) et l'advance parole (I-131) avec l'I-485. */
  ead: boolean;
  advanceParole: boolean;
  /** N-400 : revenu du foyer au plus 400 % du seuil fédéral de pauvreté (dépôt papier seulement). */
  reducedN400: boolean;
  /** I-140 : employeur de 25 salariés ou moins, ou auto-pétition (frais Asylum Program réduit). */
  smallEmployer: boolean;
  /** Personnes qui passent l'entretien consulaire (procédure consulaire). */
  consularApplicants: number;
}

export const DEFAULT_FEES: FeeInput = { path: 'marriage', online: false, extraAdults: 0, kidsUnder14: 0, ead: true, advanceParole: true, reducedN400: false, smallEmployer: false, consularApplicants: 1 };

export interface FeeLine { form: string; label: Record<Lang, string>; amount: number; payer: 'uscis' | 'dos'; count: number }

const L = (en: string, es: string) => ({ en, es });

function i485Lines(x: FeeInput): FeeLine[] {
  const adults = 1 + Math.max(0, Math.floor(x.extraAdults));
  const kids = Math.max(0, Math.floor(x.kidsUnder14));
  const out: FeeLine[] = [{ form: 'I-485', label: L('Adjustment of status, age 14 or older', 'Ajuste de estatus, 14 años o más'), amount: x.online ? F.i485.online : F.i485.paper, payer: 'uscis', count: adults }];
  if (kids) out.push({ form: 'I-485', label: L('Adjustment of status, child under 14 filing with a parent', 'Ajuste de estatus, menor de 14 años con un padre'), amount: x.online ? F.i485.under14WithParentOnline : F.i485.under14WithParentPaper, payer: 'uscis', count: kids });
  const people = adults + kids;
  if (x.ead) out.push({ form: 'I-765', label: L('Work permit with a pending I-485', 'Permiso de trabajo con I-485 pendiente'), amount: F.i765.withPendingI485Since2024, payer: 'uscis', count: people });
  if (x.advanceParole) out.push({ form: 'I-131', label: L('Advance parole with a pending I-485', 'Advance parole con I-485 pendiente'), amount: x.online ? F.i131.advanceParoleOnline : F.i131.advanceParolePaper, payer: 'uscis', count: people });
  out.push({ form: 'I-864', label: L('Affidavit of support (no USCIS fee)', 'Declaración jurada de patrocinio (sin tarifa)'), amount: F.i864.amount, payer: 'uscis', count: 1 });
  out.push({ form: 'I-693', label: L('Medical exam form (no USCIS fee; the doctor bills separately)', 'Examen médico (sin tarifa de USCIS; el médico cobra aparte)'), amount: F.i693.amount, payer: 'uscis', count: people });
  return out;
}

function i140(x: FeeInput): FeeLine[] {
  return [
    { form: 'I-140', label: L('Immigrant petition for a worker (usually paid by the employer)', 'Petición de trabajador inmigrante (la suele pagar el empleador)'), amount: x.online ? F.i140.online : F.i140.paper, payer: 'uscis', count: 1 },
    { form: 'I-140', label: L('Asylum Program Fee', 'Asylum Program Fee (tarifa del programa de asilo)'), amount: x.smallEmployer ? F.i140.asylumProgramSmall : F.i140.asylumProgramRegular, payer: 'uscis', count: 1 },
  ];
}

/** Lignes de frais d'un parcours. */
export function feeLines(x: FeeInput): FeeLine[] {
  const n = Math.max(1, Math.floor(x.consularApplicants));
  switch (x.path) {
    case 'marriage':
      return [{ form: 'I-130', label: L('Petition for alien relative', 'Petición de familiar extranjero'), amount: x.online ? F.i130.online : F.i130.paper, payer: 'uscis', count: 1 }, ...i485Lines(x)];
    case 'family-consular':
      return [
        { form: 'I-130', label: L('Petition for alien relative', 'Petición de familiar extranjero'), amount: x.online ? F.i130.online : F.i130.paper, payer: 'uscis', count: 1 },
        { form: 'DS-260', label: L('Immigrant visa application, family-based (State Department)', 'Solicitud de visa de inmigrante, familiar (Departamento de Estado)'), amount: F.dosImmigrantFamily.amount, payer: 'dos', count: n },
        { form: 'I-864', label: L('Affidavit of support review at the National Visa Center', 'Revisión de la declaración de patrocinio en el NVC'), amount: F.dosAffidavitReview.amount, payer: 'dos', count: 1 },
        { form: 'USCIS', label: L('USCIS Immigrant Fee (card production, paid before travel)', 'USCIS Immigrant Fee (producción de la tarjeta, antes de viajar)'), amount: F.immigrantFee.amount, payer: 'uscis', count: n },
      ];
    case 'employment':
      return [...i140(x), ...i485Lines(x).filter((l) => l.form !== 'I-864')];
    case 'employment-consular':
      return [
        ...i140(x),
        { form: 'DS-260', label: L('Immigrant visa application, employment-based (State Department)', 'Solicitud de visa de inmigrante, empleo (Departamento de Estado)'), amount: F.dosImmigrantEmployment.amount, payer: 'dos', count: n },
        { form: 'USCIS', label: L('USCIS Immigrant Fee (card production, paid before travel)', 'USCIS Immigrant Fee (producción de la tarjeta, antes de viajar)'), amount: F.immigrantFee.amount, payer: 'uscis', count: n },
      ];
    case 'k1':
      return [
        { form: 'I-129F', label: L('Petition for alien fiancé(e)', 'Petición de prometido(a) extranjero(a)'), amount: F.i129f.paper, payer: 'uscis', count: 1 },
        { form: 'DS-160', label: L('K visa application (State Department)', 'Solicitud de visa K (Departamento de Estado)'), amount: F.dosK.amount, payer: 'dos', count: n },
        ...i485Lines({ ...x, extraAdults: Math.max(0, n - 1) }),
      ];
    case 'n400':
      return [{ form: 'N-400', label: x.reducedN400 ? L('Naturalization, reduced fee (paper filing)', 'Naturalización, tarifa reducida (en papel)') : L('Application for naturalization', 'Solicitud de naturalización'), amount: x.reducedN400 ? F.n400.reduced : x.online ? F.n400.online : F.n400.paper, payer: 'uscis', count: 1 }];
    case 'i751':
      return [{ form: 'I-751', label: L('Petition to remove conditions on residence', 'Petición para retirar las condiciones de residencia'), amount: x.online ? F.i751.online : F.i751.paper, payer: 'uscis', count: 1 }];
    case 'i90':
      return [{ form: 'I-90', label: L('Replace or renew a green card', 'Reemplazar o renovar la green card'), amount: x.online ? F.i90.online : F.i90.paper, payer: 'uscis', count: 1 }];
  }
}

export interface FeeTotal { lines: FeeLine[]; uscis: number; dos: number; total: number }
export function feeTotal(x: FeeInput): FeeTotal {
  const lines = feeLines(x);
  const sum = (p: 'uscis' | 'dos') => lines.filter((l) => l.payer === p).reduce((a, l) => a + l.amount * l.count, 0);
  const uscis = sum('uscis'), dos = sum('dos');
  return { lines, uscis, dos, total: uscis + dos };
}
