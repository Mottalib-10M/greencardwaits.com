import { route, hasRoute, type Locale } from './routes';
import { PAGES, pageById, GROUPS } from '../lib/guides';
import type { Group } from '../lib/guide-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  en: { home: 'Green card wait', method: 'Method and past error', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
  es: { home: 'Espera de la green card', method: 'Método y error pasado', about: 'Quiénes somos', widget: 'Insertar la calculadora', contact: 'Contacto', editorial: 'Política editorial', privacy: 'Privacidad', terms: 'Aviso legal', cookies: 'Cookies' },
};
const GROUP_LABEL: Record<Locale, Record<Group, string>> = {
  en: { bulletin: 'Visa Bulletin', family: 'Family', employment: 'Employment', country: 'By country', times: 'Processing times', office: 'Field offices', fees: 'Fees', tools: 'Calculators', guides: 'Guides' },
  es: { bulletin: 'Boletín de Visas', family: 'Familia', employment: 'Empleo', country: 'Por país', times: 'Tiempos de USCIS', office: 'Oficinas', fees: 'Costos', tools: 'Calculadoras', guides: 'Guías' },
};
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? (pageById(id)?.[lang] ?? pageById(id)?.en)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
/** Liens d'une rubrique dans une langue : seulement les pages qui existent dans cette langue. */
const inGroup = (g: Group, lang: Locale, max = 99) => PAGES.filter((p) => p.group === g && hasRoute(p.id, lang)).slice(0, max).map((p) => link(p.id, lang));
const MENU: Group[] = ['bulletin', 'family', 'employment', 'times', 'fees', 'tools'];
export function navCategories(lang: Locale): NavCategory[] {
  return MENU.map((g) => ({ label: GROUP_LABEL[lang][g], links: inGroup(g, lang, 14) })).filter((c) => c.links.length);
}
export const groupLabel = (g: Group, lang: Locale) => GROUP_LABEL[lang][g];
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...(['bulletin', 'times', 'fees', 'tools', 'guides'] as Group[]).map((g) => ({ label: GROUP_LABEL[lang][g], links: inGroup(g, lang, 12) })).filter((c) => c.links.length),
  { label: lang === 'es' ? 'Este sitio' : 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
export const popularLinks = (lang: Locale): NavLink[] => [...inGroup('country', lang), ...inGroup('office', lang, 8)];
export { GROUPS };
