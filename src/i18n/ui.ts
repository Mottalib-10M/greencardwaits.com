import type { Locale } from './routes';
const en = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Questions people ask', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources and data', writtenBy: 'Published by',
  asOf: 'Data for', lastUpdated: 'checked on', footerValidated: 'Every Visa Bulletin since December 2001 read and tested · forecasts back-tested month by month', footerBrowser: 'Calculations run in your browser · nothing you type is stored or sent · free',
  footerDisclaimer: 'Green Card Waits is an independent site published by Radif Partners. Not affiliated with USCIS, the Department of State or any government agency. Estimates from public data, not legal advice: for advice on your case, see a licensed immigration attorney or a DOJ-accredited representative.', footerPopular: 'Most read', notFound: 'There is no page at this address.',
  readMore: 'Read more',
};
const es: typeof en = {
  updatedOn: 'Actualizado el', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Revisado por',
  skipToContent: 'Ir al contenido', mainNav: 'Navegación principal', breadcrumbLabel: 'Ruta de navegación', breadcrumbHome: 'Inicio', menuOpen: 'Abrir el menú',
  faqTitle: 'Preguntas frecuentes', relatedCalculators: 'Siga con', sourcesTitle: 'Fuentes oficiales y datos', writtenBy: 'Publicado por',
  asOf: 'Datos de', lastUpdated: 'revisados el', footerValidated: 'Cada Visa Bulletin desde diciembre de 2001 leído y probado · pronósticos contrastados mes a mes', footerBrowser: 'Los cálculos se hacen en su navegador · nada de lo que escribe se guarda ni se envía · gratis',
  footerDisclaimer: 'Green Card Waits es un sitio independiente publicado por Radif Partners. No está afiliado a USCIS, al Departamento de Estado ni a ninguna agencia del gobierno. Estimaciones con datos públicos que no sustituyen la asesoría legal: para su caso, consulte a un abogado de inmigración con licencia o a un representante acreditado por el Departamento de Justicia.', footerPopular: 'Lo más leído', notFound: 'No hay ninguna página en esta dirección.',
  readMore: 'Leer más',
};
export function t(lang: Locale) { return lang === 'es' ? es : en; }
