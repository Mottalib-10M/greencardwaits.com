/** Accueil, anglais et espagnol. Texte écrit pour le site ; chiffres via `h` (jamais tapés). */
import type { FAQ, Helpers } from '../lib/guide-types';
interface HomeText { title: string; description: string; h1: string; intro: string; resume: string; faqs: FAQ[]; body: (h: Helpers) => string }
export const HOME: Record<'en' | 'es', HomeText> = {
  en: { title: 'TODO', description: 'TODO', h1: 'When will your green card come?', intro: 'TODO.', resume: 'TODO', faqs: [], body: () => '' },
  es: { title: 'TODO', description: 'TODO', h1: '¿Cuándo llega su green card?', intro: 'TODO.', resume: 'TODO', faqs: [], body: () => '' },
};
