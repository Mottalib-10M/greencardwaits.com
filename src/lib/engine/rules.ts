/**
 * Règles de calcul écrites dans le Policy Manual d'USCIS, en fonctions pures :
 *  - âge CSPA (vol. 7, partie A, chap. 7) : âge au 1er jour du mois du bulletin où le visa devient disponible
 *    (tableau Final Action Dates), ou à l'approbation si elle est postérieure, moins la durée d'instruction de
 *    la pétition ; protégé sous 21 ans, à condition de « chercher à obtenir » la résidence dans l'année ;
 *  - naturalisation (vol. 12, partie D, chap. 3, 4 et 6) : dépôt possible 90 jours avant les 5 ans (3 ans pour le
 *    conjoint d'un citoyen) ; présence physique d'au moins 913 jours (548) ; une absence de plus de 6 mois fait
 *    présumer une rupture de résidence, une absence d'un an ou plus la rompt.
 * Les seuils viennent de params-2026.json.
 */
import PARAMS from '../../data/params-2026.json';
import { DAY_MS, isoToDays, daysToIso } from './forecast';

const P = PARAMS;
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** Âge exact en jours entre deux dates ISO. */
export const daysBetween = (a: string, b: string) => isoToDays(b) - isoToDays(a);

/** Âge en années révolues à une date (anniversaire compris). */
export function ageOn(birth: string, on: string): number {
  const b = toDate(birth), d = toDate(on);
  let a = d.getUTCFullYear() - b.getUTCFullYear();
  if (d.getUTCMonth() < b.getUTCMonth() || (d.getUTCMonth() === b.getUTCMonth() && d.getUTCDate() < b.getUTCDate())) a--;
  return a;
}

export interface CspaInput { birth: string; petitionFiled: string; petitionApproved: string; visaAvailable: string }
export interface CspaResult {
  /** Date retenue comme disponibilité du visa : la plus tardive de l'approbation et de la date « courante ». */
  availability: string;
  pendingDays: number;
  /** Âge biologique à la disponibilité, en jours. */
  ageDays: number;
  /** Âge CSPA en jours, puis en années décimales. */
  cspaDays: number;
  cspaYears: number;
  protected: boolean;
  /** Date limite pour chercher à obtenir la résidence (un an après la disponibilité). */
  soughtBy: string;
}

export function cspa(x: CspaInput): CspaResult {
  const availability = x.petitionApproved > x.visaAvailable ? x.petitionApproved : x.visaAvailable;
  const pendingDays = Math.max(0, daysBetween(x.petitionFiled, x.petitionApproved));
  const ageDays = daysBetween(x.birth, availability);
  const cspaDays = ageDays - pendingDays;
  // 21 ans en jours : de la naissance au 21e anniversaire (années bissextiles comprises).
  const b = toDate(x.birth);
  const birthday21 = new Date(Date.UTC(b.getUTCFullYear() + P.cspa.ageLimit, b.getUTCMonth(), b.getUTCDate())).getTime() / DAY_MS;
  const limit = birthday21 - isoToDays(x.birth);
  const a = toDate(availability);
  const soughtBy = daysToIso(Date.UTC(a.getUTCFullYear() + P.cspa.soughtToAcquireYears, a.getUTCMonth(), a.getUTCDate()) / DAY_MS);
  return { availability, pendingDays, ageDays, cspaDays, cspaYears: cspaDays / 365.25, protected: cspaDays < limit, soughtBy };
}

export interface Trip { out: string; back: string }
export interface N400Input { residentSince: string; spouseOfCitizen: boolean; trips: Trip[]; today: string }
export interface N400Result {
  years: number;
  anniversary: string;
  /** Premier jour où USCIS accepte le N-400 (90 jours avant l'anniversaire). */
  earliestFiling: string;
  canFileToday: boolean;
  /** Jours hors des États-Unis pendant la période légale qui précède la date de dépôt la plus proche. */
  daysAbroad: number;
  daysRequired: number;
  /** Jours présents sur la période (les jours de départ et de retour comptent comme présents). */
  daysPresent: number;
  presenceOk: boolean;
  /** Absences de plus de 6 mois (présomption de rupture) et d'un an ou plus (rupture). */
  longTrips: number;
  breakingTrips: number;
}

export function n400(x: N400Input): N400Result {
  const N = P.naturalization;
  const years = x.spouseOfCitizen ? N.residenceYearsSpouse : N.residenceYears;
  const r = toDate(x.residentSince);
  const anniversary = daysToIso(Date.UTC(r.getUTCFullYear() + years, r.getUTCMonth(), r.getUTCDate()) / DAY_MS);
  const earliestFiling = daysToIso(isoToDays(anniversary) - N.earlyFilingDays);
  const filing = x.today > earliestFiling ? x.today : earliestFiling;
  // Période légale : les `years` années qui précèdent le dépôt.
  const f = toDate(filing);
  const start = daysToIso(Date.UTC(f.getUTCFullYear() - years, f.getUTCMonth(), f.getUTCDate()) / DAY_MS);
  let daysAbroad = 0, longTrips = 0, breakingTrips = 0;
  for (const t of x.trips) {
    if (!t.out || !t.back || t.back < t.out) continue;
    const len = daysBetween(t.out, t.back) - 1; // jours de départ et de retour : présents (Policy Manual, chap. 4)
    const a = t.out < start ? start : t.out, b = t.back > filing ? filing : t.back;
    if (b > a) daysAbroad += Math.max(0, daysBetween(a, b) - 1);
    if (len >= 365) breakingTrips++;
    else if (len > 182) longTrips++;
  }
  const total = daysBetween(start, filing);
  const daysRequired = years === 5 ? N.physicalPresenceDays5 : N.physicalPresenceDays3;
  const daysPresent = total - daysAbroad;
  return { years, anniversary, earliestFiling, canFileToday: x.today >= earliestFiling, daysAbroad, daysRequired, daysPresent, presenceOk: daysPresent >= daysRequired, longTrips, breakingTrips };
}

/** Délai écoulé depuis le dépôt et position par rapport à la fourchette publiée par USCIS. */
export interface PtimeCheck { elapsedMonths: number; min: number | null; max: number | null; state: 'within' | 'outside' | 'unknown'; inquiryDate: string | null; canInquire: boolean }
export function checkTime(receipt: string, today: string, min: number | null, max: number | null, inquiry: string | null): PtimeCheck {
  const elapsedMonths = daysBetween(receipt, today) / 30.4375;
  const state = max === null ? 'unknown' : elapsedMonths > max ? 'outside' : 'within';
  // USCIS accepte une demande de renseignement (« case inquiry ») si la date de réception est antérieure ou égale
  // à la « receipt date for a case inquiry » publiée pour le bureau et le formulaire.
  return { elapsedMonths, min, max, state, inquiryDate: inquiry, canInquire: !!inquiry && receipt <= inquiry };
}
