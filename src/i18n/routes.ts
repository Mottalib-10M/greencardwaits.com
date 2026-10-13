import { makeRouter, type RouteDef } from './routes-core';
import { PAGES } from '../lib/guides';
export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, en: string, es: string, noindex = false): RouteDef<Locale> => ({ id, paths: { en: `/en/${en}/`, es: `/es/${es}/` }, ...(noindex ? { noindex } : {}) });
/** Pages du cœur. Les pages de contenu viennent de `src/content/` (lib/guides.ts) ; l'espagnol n'existe que si le fichier le porte. */
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { en: '/en/', es: '/es/' } },
  R('method', 'method', 'metodologia'),
  R('about', 'about', 'sobre-nosotros'),
  R('widget', 'widget', 'widget', true),
  R('contact', 'contact', 'contacto', true),
  R('editorial', 'editorial-policy', 'politica-editorial', true),
  R('privacy', 'privacy', 'privacidad', true),
  R('terms', 'legal-notice', 'aviso-legal', true),
  R('cookies', 'cookies', 'cookies', true),
];
export const ROUTES: RouteDef<Locale>[] = [
  CORE[0],
  ...PAGES.map((p) => ({ id: p.id, paths: { en: `/en/${p.en.path}/`, ...(p.es ? { es: `/es/${p.es.path}/` } : {}) } })),
  ...CORE.slice(1),
];
export const { NOINDEX_PATHS, route, hasRoute, altPaths } = makeRouter(LOCALES, ROUTES);
