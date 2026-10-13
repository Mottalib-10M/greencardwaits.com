/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://us-greencard.example";
export const SITE_NAMES: Record<string, string> = {"en": "Green Card Waits", "es": "Green Card Waits"};
export const LANG_TAGS: Record<string, string> = {"en": "en-US", "es": "es-US"};
export const OG_LOCALES: Record<string, string> = {"en": "en_US", "es": "es_US"};
export const LOCALE_TAG = 'en-US';
export const CURRENCY = 'USD';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-13';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"en": "Publisher of Visa Bulletin data, green card wait forecasts, USCIS processing times and 2026 filing fees", "es": "Editor de datos del Boletín de Visas, pronósticos de espera de la green card, tiempos de USCIS y tarifas de 2026"};
export const AUTHOR_DESC: Record<string, string> = {"en": "(voir src/data/site-config.ts)", "es": "(voir src/data/site-config.ts)"};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"en": ["Visa Bulletin final action dates and dates for filing", "Family-sponsored and employment-based priority dates", "USCIS processing times by field office", "USCIS filing fees (Form G-1055)", "Child Status Protection Act age calculation", "Naturalization early filing and residence rules"], "es": ["Fechas de acción final y fechas de presentación del Boletín de Visas", "Fechas de prioridad familiares y de empleo", "Tiempos de proceso de USCIS por oficina", "Tarifas de USCIS (formulario G-1055)", "Cálculo de edad de la Ley CSPA", "Plazos de la naturalización"]};
export const CONTACT_EMAIL = "contact@us-greencard.example";
export const THEME_COLOR = '#1F6F50';
export const LOGO_SYMBOL = 'GC';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau, aucun cookie, Clarity chargé en mode sans cookie (consentv2 denied).
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = '6b1f0c8e4d2a47f3a9e5c7b18d3f2a61';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: '',            // raison sociale ou nom commercial exploité
  legalForm: '',             // ex. entreprise individuelle, SASU, GmbH, eenmanszaak
  street: '',
  postalCode: '',
  city: '',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: '', address: '', phone: '', url: '' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'legalForm', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
