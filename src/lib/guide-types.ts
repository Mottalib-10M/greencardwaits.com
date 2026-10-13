/**
 * Une page = UN fichier dans `src/content/<groupe>/<id>.ts` (CONTRIBUTING-PAGES.md).
 * Le fichier porte l'anglais (obligatoire) et l'espagnol (facultatif : 40 pages seulement), le texte, la FAQ,
 * les sources, l'outil ou le mini-simulateur, et ce que les blocs de données générés doivent montrer.
 * Le cœur (routes, menus, sitemap, hreflang, schémas, pied de page) lit ces fichiers seul.
 */
import type { SourceKey, Params } from './params';
import type { Cat, Country } from './engine/cases';
import type { Path } from './engine/fees';

export type Lang = 'en' | 'es';
/** Rubrique du menu. */
export type Group = 'bulletin' | 'family' | 'employment' | 'country' | 'times' | 'office' | 'fees' | 'tools' | 'guides';
export interface FAQ { q: string; a: string }

/** Outil principal d'une page (île React) et son préréglage. */
export type ToolSpec =
  | { kind: 'greencard'; cat?: Cat; country?: Country; pd?: string }
  | { kind: 'bulletin'; month: string; pick?: boolean; cat?: Exclude<Cat, 'IR'>; country?: Country }
  | { kind: 'ptime'; form?: string; subtype?: string; office?: string }
  | { kind: 'fees'; path: Path; ead?: boolean; advanceParole?: boolean }
  | { kind: 'cspa' }
  | { kind: 'n400' };

/** Blocs de données générés sous le texte d'introduction (tableaux, graphique, rétro-test). */
export interface DataSpec {
  /** Page de case : catégorie et, s'il y a lieu, pays (graphique, tableau annuel, ligne de rétro-test). */
  cat?: Exclude<Cat, 'IR'>;
  country?: Country;
  /** Page pays : toutes les catégories du pays. */
  countryAll?: Country;
  /** Page de bulletin mensuel : AAAA-MM. */
  month?: string;
  /** Page de formulaire (délais) : clé de formulaire (n-400, i-485-family…). */
  form?: string;
  /** Page de bureau : code USCIS (HOU, NYC…). */
  office?: string;
  /** Page de frais : parcours. */
  fees?: Path;
  /** Blocs de synthèse des pages de rubrique. */
  special?: 'month' | 'office20' | 'allfees' | 'alltimes' | 'predictions' | 'history';
}

export interface Helpers {
  lang: Lang;
  /** Lien interne par identifiant de page (texte affiché). */
  a: (id: string, text: string) => string;
  usd: (n: number) => string;
  num: (n: number, decimals?: number) => string;
  pct: (x: number, decimals?: number) => string;
  /** Date ISO écrite en toutes lettres dans la langue. */
  date: (iso: string) => string;
  /** Mois AAAA-MM écrit en toutes lettres (« October 2026 », « octubre de 2026 »). */
  month: (ym: string) => string;
  /** Valeur de bulletin écrite : « Current », date en toutes lettres, « Unavailable ». */
  cell: (v: string) => string;
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  src: (key: SourceKey, text?: string) => string;
  /** Mini-simulateur de sujet inséré dans le corps (RECETTE §9.3). */
  mini: (kind: string) => string;
  /** Paramètres 2026 (frais, règles) : chaque chiffre vient d'ici. */
  P: Params;
}

export interface PageText {
  /** Chemin sans langue ni barres extrêmes, ex. « employment/eb-2/india ». */
  path: string;
  nav: string;
  card: string;
  /** 50 à 60 caractères, terme-clé en tête (RECETTE §11). */
  title: string;
  /** 150 à 160 caractères. */
  description: string;
  h1: string;
  intro: string;
  /** Paragraphe citable, au moins 120 mots, un seul paragraphe (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
}

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  tool?: ToolSpec;
  /** Mini-simulateur après le paragraphe citable (guides) : fichier `src/lib/minis/<kind>.ts`. */
  mini?: string;
  data?: DataSpec;
  /** Page parente dans le fil d'Ariane (identifiant). */
  parent?: string;
  related: string[];
  sources: SourceKey[];
  en: PageText;
  es?: PageText;
}

export const definePage = (p: PageDef): PageDef => p;
