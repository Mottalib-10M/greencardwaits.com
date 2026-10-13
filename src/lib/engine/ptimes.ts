/**
 * Catalogue des délais USCIS suivis par le site : formulaire, sous-type tel qu'USCIS le publie, libellés.
 * Les chiffres viennent de src/data/ptimes-latest.json (relevé USCIS du 17 septembre 2026, republié en CC BY 4.0
 * par ImmigrationTimes.org). « min » et « max » sont la fourchette affichée par USCIS ; la borne haute est le délai
 * dans lequel USCIS dit traiter 80 % des dossiers.
 */
import PT from '../../data/ptimes-latest.json';

export type Lang = 'en' | 'es';
export interface PtimeKind { id: string; form: string; file: string; subtype: string; field: boolean; label: Record<Lang, string> }
const K = (id: string, form: string, subtype: string, en: string, es: string, field = false): PtimeKind => ({ id, form, file: form.toLowerCase(), subtype, field, label: { en, es } });

export const KINDS: PtimeKind[] = [
  K('n400', 'N-400', '160A', 'N-400 naturalization', 'N-400 naturalización', true),
  K('i485fam', 'I-485', '131A-FAM', 'I-485 family-based', 'I-485 por familia', true),
  K('i485emp', 'I-485', '131A', 'I-485 employment-based', 'I-485 por empleo'),
  K('i130ir', 'I-130', '134A-IR', 'I-130 citizen for spouse, parent or child under 21', 'I-130 ciudadano para cónyuge, padre o hijo menor de 21'),
  K('i130f2a', 'I-130', '134A-F21', 'I-130 green card holder for spouse or child under 21 (F2A)', 'I-130 residente para cónyuge o hijo menor de 21 (F2A)'),
  K('i130f1', 'I-130', '134B-F11', 'I-130 citizen for unmarried son or daughter 21+ (F1)', 'I-130 ciudadano para hijo soltero de 21+ (F1)'),
  K('i130f2b', 'I-130', '134B-F24', 'I-130 green card holder for unmarried son or daughter 21+ (F2B)', 'I-130 residente para hijo soltero de 21+ (F2B)'),
  K('i130f3', 'I-130', '134B-F31', 'I-130 citizen for married son or daughter (F3)', 'I-130 ciudadano para hijo casado (F3)'),
  K('i130f4', 'I-130', '134B-F41', 'I-130 citizen for brother or sister (F4)', 'I-130 ciudadano para hermano (F4)'),
  K('i765c9', 'I-765', '147-C9', 'I-765 work permit with a pending I-485 (c)(9)', 'I-765 permiso de trabajo con I-485 pendiente (c)(9)'),
  K('i131ap', 'I-131', '141B-OTH', 'I-131 advance parole', 'I-131 advance parole'),
  K('i131re', 'I-131', '141A-RT', 'I-131 re-entry permit or refugee travel document', 'I-131 permiso de reingreso o documento de viaje de refugiado'),
  K('i140eb1', 'I-140', '136A-E11', 'I-140 extraordinary ability (EB-1A)', 'I-140 habilidad extraordinaria (EB-1A)'),
  K('i140eb2', 'I-140', '136A-E21', 'I-140 advanced degree (EB-2)', 'I-140 título avanzado (EB-2)'),
  K('i140niw', 'I-140', '136A-NIW', 'I-140 national interest waiver', 'I-140 exención por interés nacional (NIW)'),
  K('i140eb3', 'I-140', '136A-E31', 'I-140 skilled worker or professional (EB-3)', 'I-140 trabajador calificado (EB-3)'),
  K('i751', 'I-751', '148A', 'I-751 remove conditions', 'I-751 retirar condiciones'),
  K('i90renew', 'I-90', '140B', 'I-90 ten-year card renewal', 'I-90 renovación de la tarjeta de 10 años'),
  K('i90replace', 'I-90', '140A', 'I-90 replacement or first card', 'I-90 reemplazo o primera tarjeta'),
  K('i129f', 'I-129F', '134A-K', 'I-129F fiancé(e) petition (K-1)', 'I-129F petición de prometido(a) (K-1)'),
  K('i526e', 'I-526E', '526IP', 'I-526E regional center investor', 'I-526E inversionista de centro regional'),
];
export const kindById = (id: string) => KINDS.find((k) => k.id === id);

export interface Office { name: string; n400: Band | null; i485fam: Band | null }
export interface Band { date?: string; min: number | null; max: number | null; inquiry: string | null }
export const OFFICES = PT.offices as unknown as Record<string, Office>;
export const OFFICE_NAMES = PT.officeNames as Record<string, string>;
export const PUBLISHED = PT.published;
export const NATIONAL = PT.national as Record<string, number>;
export const NATIONAL_MONTH = PT.nationalMonth;

/** Lignes publiées pour un sous-type hors bureau de terrain (centres de service, NBC, direction des bureaux). */
export function centerRows(k: PtimeKind): Array<{ office: string; name: string; min: number | null; max: number | null; inquiry: string | null }> {
  const f = (PT.forms as Record<string, { rows: Array<{ office: string; subtype: string; min: number | null; max: number | null; inquiry: string | null }> }>)[k.file];
  return (f?.rows ?? []).filter((r) => r.subtype === k.subtype && !OFFICES[r.office]).map((r) => ({ ...r, name: OFFICE_NAMES[r.office] ?? r.office }));
}

/** Fourchette d'un formulaire à un bureau (bureau de terrain) ou à un centre. */
export function band(k: PtimeKind, office: string): Band | null {
  if (k.field) {
    const o = OFFICES[office];
    return (k.id === 'n400' ? o?.n400 : o?.i485fam) ?? null;
  }
  const r = centerRows(k).find((x) => x.office === office) ?? centerRows(k)[0];
  return r ? { min: r.min, max: r.max, inquiry: r.inquiry } : null;
}
