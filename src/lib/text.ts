/** Mise en forme des mois et des cases du bulletin, sans dépendance aux routes (importable depuis les pages). */
import { LANG_TAGS } from '../data/site-config';
import { displayDate } from './format';
type Locale = 'en' | 'es';

export function monthName(ym: string, lang: Locale): string {
  const d = new Date(`${ym}-01T00:00:00Z`);
  return d.toLocaleDateString(LANG_TAGS[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
export function cellText(v: string, lang: Locale): string {
  if (v === 'C') return lang === 'es' ? 'Al día (C)' : 'Current (C)';
  if (v === 'U') return lang === 'es' ? 'No disponible (U)' : 'Unavailable (U)';
  return displayDate(v, LANG_TAGS[lang]);
}

