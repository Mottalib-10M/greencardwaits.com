import { definePage } from '../../lib/guide-types';
import { cellAt, QUEUE_CATS, CAT_SHORT, MONTHS, LATEST, distinctShare } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';
import PARAMS from '../../data/params-2026.json';

// Chiffres lus dans les données (jamais tapés).
const now = `${LATEST}-01`;
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const isDate = (c: string) => c !== 'C' && c !== 'U';
const L = PARAMS.limits;
const listIn = (and: string) => (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${and} ${xs[xs.length - 1]}`);
const listEn = listIn('and'), listEs = listIn('y');
// Catégories où le Mexique a sa propre date ce mois, et son retard (années) sur le reste du monde.
const own = QUEUE_CATS.filter((c) => cellAt(c, 'MX', 'FAD') !== cellAt(c, 'ROW', 'FAD'))
  .map((c) => { const a = cellAt(c, 'MX', 'FAD'), r = cellAt(c, 'ROW', 'FAD'); return { c, a, r, gap: isDate(a) ? years(a, isDate(r) ? r : now) : 0 }; })
  .sort((x, y) => y.gap - x.gap);
const fam = own.filter((x) => x.c.startsWith('F'));
const emp = own.filter((x) => !x.c.startsWith('F'));
const top = own[0];
const fad = (c: 'F1' | 'F2A' | 'F2B' | 'F3' | 'F4') => cellAt(c, 'MX', 'FAD');
const dffF2A = cellAt('F2A', 'MX', 'DFF');
// Seul pays avec sa propre date F2A ?
const f2aOnlyMx = (['CN', 'IN', 'PH'] as const).every((k) => cellAt('F2A', k, 'FAD') === cellAt('F2A', 'ROW', 'FAD')) && fad('F2A') !== cellAt('F2A', 'ROW', 'FAD');
const f2aShare = distinctShare('F2A', 'MX');
const f3Queue = years(fad('F3'), now);
const f4Oct2016 = cellAt('F4', 'MX', 'FAD', MONTHS.indexOf('2016-10'));
const f1BehindF2b = fad('F1') < fad('F2B');

export default definePage({
  id: "country-mexico", group: "country", order: 302,
  tool: {"kind": "greencard", "cat": "F2B", "country": "MX"},
  data: {"countryAll": "MX"},
  related: ["f3-mexico", "f4-mexico", "f2a-mexico", "f2b-mexico", "guide-chargeability"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/mexico",
    nav: 'Mexico', card: 'Every Visa Bulletin category for people born in Mexico, with the worldwide date for comparison.',
    title: 'Visa Bulletin Mexico 2026: Every Family Line and Its Gap',
    description: 'Visa Bulletin dates for people born in Mexico: five family lines with their own cutoff, the only separate F2A date, and employment lines that match the world.',
    h1: 'Green card dates for people born in Mexico',
    intro: 'Choose the category and enter your priority date; the table below shows each Mexican cutoff this month next to the worldwide date.',
    resume: `Mexico has its own Visa Bulletin column because family demand from Mexican-born applicants passes the ${Math.round(L.perCountryShare * 100)}% per-country limit, ${L.perCountry.toLocaleString('en-US')} visas a year. In the ${LATEST.slice(0, 4)} bulletins Mexico has a separate Final Action Date in ${fam.length} family categories (${listEn(fam.map((x) => CAT_SHORT[x.c]))})${emp.length ? ` and ${emp.length} employment categories` : ' and none in employment'}, which makes it the most family-heavy backlog in the bulletin. The longest gap is ${CAT_SHORT[top.c]}, married sons and daughters of U.S. citizens, at ${cellText(top.a, 'en')}: about ${Math.round(top.gap)} years behind the worldwide date and about ${Math.round(f3Queue)} years behind the bulletin month. ${f2aOnlyMx ? 'Mexico is also the only country with its own F2A date, for spouses and minor children of green card holders.' : ''} In the employment categories Mexican-born workers use the worldwide dates. The column follows country of birth, not citizenship, and a spouse born elsewhere can sometimes let both partners use that country's queue.`,
    faqs: [
      { q: 'Why does Mexico have its own F2A date in the Visa Bulletin?', a: 'F2A covers spouses and minor children of green card holders, and Mexican demand in that line is large enough that the State Department often sets a separate Mexican cutoff while the rest of the world moves ahead. Since 2015 the Mexican F2A date has differed from the worldwide date in about two thirds of the bulletins.' },
      { q: 'Do Mexican workers wait longer in EB-2 and EB-3 than others?', a: 'Not in recent bulletins. In the employment categories, Mexican-born applicants have used the same cutoffs as the rest of the world, because employment demand from Mexico stays within the per-country share. The table on this page shows any month in which that changes.' },
      { q: 'Is F1 Mexico faster than F2B Mexico?', a: 'Often not. For Mexican-born adult unmarried sons and daughters, the F1 line for children of citizens has frequently been further behind the F2B line for children of green card holders. That matters when a resident parent naturalizes and the case moves from F2B to F1. The F1 Mexico and F2B Mexico pages show both dates side by side.' },
    ],
    body: (h) => `
<h2>Five family lines of their own</h2>
<p>The Immigration and Nationality Act holds each country to ${h.pct(L.perCountryShare)} of the yearly preference total, ${h.num(L.perCountry)} visas. ${fam.length === 5 ? 'Mexico reaches the ceiling in every family preference this month' : `Mexico reaches the ceiling in ${fam.length} of the five family preferences this month`}: ${listEn(fam.map((x) => CAT_SHORT[x.c]))} ${fam.length > 1 ? 'all carry' : 'carries'} a Mexican date. ${h.src('ina203', 'INA sections 201 to 203')}.</p>
<h2>Where each line stands</h2>
<p>F3 is the deepest, at ${h.cell(fad('F3'))}, a queue of about ${h.num(f3Queue, 1)} years. F4 siblings are at ${h.cell(fad('F4'))}; in October 2016 they were at ${h.cell(f4Oct2016)}. F1 is at ${h.cell(fad('F1'))} and F2B at ${h.cell(fad('F2B'))}, so ${f1BehindF2b ? 'the line for children of citizens is behind the line for children of residents' : 'F1 is ahead of F2B this month'}. ${h.a('f3-mexico', 'F3 Mexico')} and ${h.a('f4-mexico', 'F4 Mexico')} have the full history.</p>
<h2>F2A: the one queue that is short</h2>
<p>${f2aOnlyMx ? 'No other country has its own F2A date.' : 'Mexico often has its own F2A date.'} This month the Mexican Final Action Date is ${h.cell(fad('F2A'))}, about ${h.num(years(fad('F2A'), cellAt('F2A', 'ROW', 'FAD')) * 12)} months behind the world, and the Dates for Filing chart for Mexican F2A reads ${h.cell(dffF2A)}. Since 2015 the Mexican date has been separate in ${h.pct(f2aShare)} of bulletins. With USCIS accepting the filing chart for family cases this month, a Mexican spouse of a green card holder who is already in the United States and eligible to adjust can file Form I-485 ${dffF2A === 'C' ? 'whatever the priority date' : `with a priority date before ${h.cell(dffF2A)}`}. If the resident spouse naturalizes first, the husband or wife becomes an immediate relative and leaves the queue. ${h.a('f2a-mexico', 'F2A Mexico')}.</p>
<h2>Employment and investors</h2>
<p>${emp.length ? `This month ${listEn(emp.map((x) => CAT_SHORT[x.c]))} carries a Mexican date.` : 'Every employment category uses the worldwide date this month.'} ${emp.length ? '' : 'Mexico’s backlog is a family one: a Mexican engineer in EB-2 waits on the same date as a colleague born in Brazil or Spain.'}</p>
<h2>Birth, not passport</h2>
<p>The column is decided by country of birth. A Mexican-born applicant with a spouse born in Guatemala or Canada may be able to use the spouse's country when they immigrate together. ${h.a('guide-chargeability', 'The chargeability guide')} explains when that works.</p>`,
  },
  es: {
    path: "pais/mexico",
    nav: 'México', card: 'Todas las categorías del Visa Bulletin para personas nacidas en México, con la fecha del resto del mundo.',
    title: 'Boletín de Visas México 2026: Fechas por Tipo de Familiar',
    description: 'Fechas del Visa Bulletin para familias mexicanas: cónyuges de residentes, hijos solteros, hijos casados y hermanos de ciudadanos, y qué cambia si se naturaliza.',
    h1: 'Fechas de la green card para personas nacidas en México',
    intro: 'Elija la categoría de su familiar e ingrese la fecha de prioridad del recibo del I-130; la tabla muestra cada fecha mexicana de este mes.',
    resume: `Las personas nacidas en México tienen su propia columna en el boletín de visas (Visa Bulletin) porque la demanda familiar desde México supera el límite por país del ${Math.round(L.perCountryShare * 100)} %, ${L.perCountry.toLocaleString('en-US')} visas al año. En los boletines de ${LATEST.slice(0, 4)}, México tiene una fecha de acción final (Final Action Date) propia en ${fam.length} categorías familiares: ${listEs(fam.map((x) => CAT_SHORT[x.c]))}. La espera más larga es F3, hijos casados de ciudadanos, con fecha ${cellText(top.a, 'es')}: unos ${Math.round(f3Queue)} años desde la fecha de prioridad hasta hoy. Para el cónyuge o el hijo menor de un residente permanente (F2A), la fecha mexicana es ${cellText(fad('F2A'), 'es')}, mucho más cercana. En las categorías de empleo, los trabajadores nacidos en México usan las mismas fechas que el resto del mundo. Lo que cuenta es el país de nacimiento, no el pasaporte. Si el familiar que pidió la visa se hace ciudadano, la categoría puede cambiar, y no siempre para mejor.`,
    faqs: [
      { q: '¿Qué pasa con la petición de mi esposa si me hago ciudadano estadounidense?', a: 'Si usted es residente permanente y pidió a su cónyuge en F2A, al naturalizarse su cónyuge pasa a ser familiar inmediato (immediate relative) de un ciudadano. Los familiares inmediatos no esperan en el boletín de visas, así que la fila mexicana de F2A deja de aplicarse. Conviene que un abogado de inmigración con licencia revise el expediente antes de dar pasos.' },
      { q: '¿Mi hijo soltero mayor de 21 espera menos en F1 que en F2B si soy de México?', a: 'No necesariamente. Para los nacidos en México, la fila F1 (hijos solteros de ciudadanos) ha estado muchas veces más atrasada que la F2B (hijos solteros de residentes). Si usted se naturaliza, la petición de su hijo pasa de F2B a F1 con la misma fecha de prioridad, y en México eso puede alargar la espera. Compare las dos fechas en la tabla.' },
      { q: '¿Cuántos años esperan los hermanos de ciudadanos nacidos en México en F4?', a: 'La fila F4 de México es una de las más largas de todo el boletín: la fecha de acción final de este mes está a más de dos décadas de hoy. El tiempo real depende de cuánto avance la fecha cada año, y nuestro pronóstico solo muestra un rango cuando pasó la prueba con datos desde 2012.' },
      { q: '¿Si nací en México pero mi esposo nació en Guatemala, qué fila uso?', a: 'En principio, la de su país de nacimiento, México. La ley permite en ciertos casos usar el país de nacimiento del cónyuge cuando ambos inmigran juntos (cross-chargeability). Guatemala usa hoy las fechas del resto del mundo, que en las filas familiares van años por delante de México. Un representante acreditado por el Departamento de Justicia (DOJ) puede confirmar si aplica.' },
    ],
    body: (h) => `
<h2>Una fila distinta para cada familiar</h2>
<p>El boletín de visas no tiene una sola fila para México, sino ${h.num(fam.length)} en la parte familiar, y cada una depende de quién pide y a quién. Este mes, las fechas de acción final mexicanas son:</p>
<ul>
<li>F2A, cónyuge o hijo menor de un residente: ${h.cell(fad('F2A'))}.</li>
<li>F2B, hijo soltero de 21 años o más de un residente: ${h.cell(fad('F2B'))}.</li>
<li>F1, hijo soltero de 21 años o más de un ciudadano: ${h.cell(fad('F1'))}.</li>
<li>F3, hijo casado de un ciudadano: ${h.cell(fad('F3'))}.</li>
<li>F4, hermano de un ciudadano mayor de 21 años: ${h.cell(fad('F4'))}.</li>
</ul>
<p>La razón es el límite por país: ningún país puede recibir más del ${h.pct(L.perCountryShare)} de las visas de preferencia de un año, y la demanda familiar desde México lo supera. ${h.src('ina203', 'Ley de Inmigración y Nacionalidad, secciones 201 a 203')}.</p>
<h2>Cuando el residente se hace ciudadano</h2>
<p>Puede pasar que el familiar que pidió la visa sea residente al presentar el I-130 y se naturalice años después. Para el cónyuge en F2A eso suele ser una buena noticia, porque pasa a familiar inmediato y sale de la fila. Para un hijo soltero mayor de 21 no siempre: pasa de F2B a F1, y hoy la fecha F1 mexicana (${h.cell(fad('F1'))}) está ${f1BehindF2b ? 'detrás' : 'delante'} de la F2B (${h.cell(fad('F2B'))}). ${h.a('f2b-mexico', 'Vea F2B México')}.</p>
<h2>Presentar el ajuste dentro de Estados Unidos</h2>
<p>Este mes USCIS acepta la tabla de fechas de presentación (Dates for Filing) para casos familiares. En F2A México esa tabla marca ${h.cell(dffF2A)}. Solo puede presentar el formulario I-485 quien ya está en Estados Unidos y cumple los requisitos del ajuste de estatus; quien vive en México termina el trámite en el consulado, donde manda la fecha de acción final. ${h.src('aosCharts', 'Tablas de USCIS')}.</p>
<h2>Empleo: la misma fila que el mundo</h2>
<p>${emp.length ? `Este mes ${listEs(emp.map((x) => CAT_SHORT[x.c]))} tiene fecha mexicana propia.` : 'Ninguna categoría de empleo tiene fecha mexicana propia este mes.'} ${emp.length ? '' : 'Un trabajador nacido en México con una petición EB-2 o EB-3 espera lo mismo que uno nacido en Colombia o en España.'}</p>`,
  },
});
