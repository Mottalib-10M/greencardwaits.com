import { definePage } from '../../lib/guide-types';
import { cellAt, LATEST } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';
import PARAMS from '../../data/params-2026.json';
import VB from '../../data/visa-bulletin.json';

// Tout est lu dans src/data/visa-bulletin.json : colonne « SV » (El Salvador, Guatemala, Honduras) des bulletins.
type B = { month: string; cols?: { family?: string[]; employment?: string[] }; FAD: Record<string, Record<string, string>>; DFF?: Record<string, Record<string, string>> };
const ALL = (VB as unknown as { bulletins: B[] }).bulletins;
const withSV = ALL.filter((b) => (b.cols?.employment ?? []).includes('SV') || (b.cols?.family ?? []).includes('SV'));
const svFamily = ALL.some((b) => (b.cols?.family ?? []).includes('SV'));
const first = withSV[0].month, last = withSV[withSV.length - 1].month;
// Catégories où la date SV a différé de celle du reste du monde, au moins une fois.
const diffCats = [...new Set(withSV.flatMap((b) => Object.entries(b.FAD).filter(([, v]) => v.SV && v.SV !== v.ROW).map(([k]) => k)))];
const onlyEb4 = diffCats.every((k) => k === 'EB4' || k === 'SR');
const lastB = withSV[withSV.length - 1];
const lastSV = lastB.FAD.EB4.SV, lastRow = lastB.FAD.EB4.ROW;
const firstB = withSV[0];
const firstSV = firstB.FAD.EB4.SV, firstRow = firstB.FAD.EB4.ROW;
const latestB = ALL[ALL.length - 1];
const svNow = (latestB.cols?.employment ?? []).includes('SV') || (latestB.cols?.family ?? []).includes('SV');
const eb4 = cellAt('EB4', 'ROW', 'FAD'), eb4dff = cellAt('EB4', 'ROW', 'DFF');
const f4 = cellAt('F4', 'ROW', 'FAD'), f2a = cellAt('F2A', 'ROW', 'FAD'), f3 = cellAt('F3', 'ROW', 'FAD');
const f4mx = cellAt('F4', 'MX', 'FAD'), f3mx = cellAt('F3', 'MX', 'FAD');
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);
const L = PARAMS.limits;
const en = (c: string) => cellText(c, 'en'), es = (c: string) => cellText(c, 'es');
const monthEn = (ym: string) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const monthEs = (ym: string) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('es-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export default definePage({
  id: "country-el-salvador-guatemala-honduras", group: "country", order: 304,
  tool: {"kind": "greencard", "cat": "F4", "country": "ROW"},
  data: {"countryAll": "ROW"},
  related: ["eb-4", "country-mexico", "guide-per-country", "guide-chargeability", "f4"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/el-salvador-guatemala-honduras",
    nav: 'El Salvador, Guatemala, Honduras', card: 'Born in El Salvador, Guatemala or Honduras: the EB-4 column that came and went, and the dates you use today.',
    title: 'Visa Bulletin El Salvador, Guatemala, Honduras 2026 Dates',
    description: 'Visa Bulletin dates for people born in El Salvador, Guatemala or Honduras: the separate EB-4 column from 2016 to 2023, and why they use worldwide dates now.',
    h1: 'El Salvador, Guatemala and Honduras in the Visa Bulletin',
    intro: 'Enter your category and priority date: people born in these three countries use the worldwide column this month, shown in the table below.',
    resume: `El Salvador, Guatemala and Honduras share one column in the Visa Bulletin when they get one, and in the ${LATEST.slice(0, 4)} bulletins they do not: ${svNow ? 'the column is printed this month.' : 'people born in these three countries use the worldwide dates in every family and employment category.'} The archive shows the shared column in ${withSV.length} bulletins, from ${monthEn(first)} to ${monthEn(last)}, and only in the employment table${svFamily ? ' and in the family table' : ''}. ${onlyEb4 ? 'In all those months it differed from the worldwide date only in EB-4, the category for certain special immigrants, and in its religious worker subcategory.' : ''} When the column first appeared, EB-4 was ${firstRow === 'C' ? 'current' : `at ${en(firstRow)}`} for the rest of the world while the three countries were held to ${en(firstSV)}; in its last month the gap was ${en(lastSV)} against ${en(lastRow)}. The worldwide EB-4 Final Action Date is now ${en(eb4)}. A country gets its own column only when its demand in a category passes the ${Math.round(L.perCountryShare * 100)}% per-country limit.`,
    faqs: [
      { q: 'Do people born in El Salvador, Guatemala or Honduras have their own Visa Bulletin dates now?', a: 'Not in the current bulletin. Applicants born in these three countries use the worldwide column, labeled All Chargeability Areas Except Those Listed, in every family and employment category. The shared column existed in the employment table from 2016 to 2023 and could return if demand from the three countries passes the per-country limit again.' },
      { q: 'Why did the El Salvador, Guatemala and Honduras column only affect EB-4?', a: 'The bulletin does not explain each column, but a separate date appears only where demand passes the per-country share, and for these three countries that happened in EB-4 alone. In the family lines and in EB-1, EB-2, EB-3 and EB-5, their applicants stayed within the worldwide queue, so the shared column repeated the worldwide date in those rows.' },
      { q: 'Is a Honduran-born applicant charged to Honduras even with another nationality?', a: 'Yes, the bulletin charges applicants to their country of birth, not their passport. A spouse born in another country can sometimes let both partners use that country’s date when they immigrate together. Since the three countries use the worldwide dates at the moment, that matters mostly when the couple also includes someone born in Mexico, India, China or the Philippines.' },
    ],
    body: (h) => `
<h2>A column that came and went</h2>
<p>From ${h.month(first)} to ${h.month(last)} the employment table of the bulletin carried a column headed El Salvador, Guatemala and Honduras. We count it in ${h.num(withSV.length)} bulletins. ${svFamily ? 'It also appeared in the family table in some months.' : 'The family table never had it: relatives of citizens and green card holders born in these countries always used the worldwide dates.'} ${onlyEb4 ? 'Inside the employment table, the column matched the worldwide date in every row except EB-4 and its religious worker line.' : ''}</p>
<h2>What the EB-4 dates looked like</h2>
<p>In ${h.month(first)}, the first month of the column, the worldwide EB-4 cell read ${h.cell(firstRow)} and the three-country cell read ${h.cell(firstSV)}. By ${h.month(last)}, the last month, the worldwide cell read ${h.cell(lastRow)} and the three-country cell ${h.cell(lastSV)}, a gap of about ${h.num(years(lastSV, lastRow), 1)} years. The bulletin after that dropped the column, and the three countries moved onto the worldwide line. ${h.a('eb-4', 'The EB-4 page')} follows the category since then.</p>
<h2>${h.month(LATEST)}: the worldwide dates apply</h2>
<p>${svNow ? 'This month the column is printed again; check its row in the official bulletin.' : `This month there is no separate column. A Salvadoran, Guatemalan or Honduran applicant reads the worldwide cell: EB-4 at ${h.cell(eb4)} for final action and ${h.cell(eb4dff)} for filing, F4 siblings at ${h.cell(f4)}, F3 married children at ${h.cell(f3)}, F2A at ${h.cell(f2a)}.`} The full worldwide row is in the table below.</p>
<h2>Why a column appears</h2>
<p>The Immigration and Nationality Act limits any single country to ${h.pct(L.perCountryShare)} of the preference numbers each year, ${h.num(L.perCountry)} visas. When demand from a country in one category would pass that line, the State Department gives it a separate cutoff. For these three countries that happened once, in EB-4. Nothing in the data says it will or will not happen again. ${h.a('guide-per-country', 'How the per-country cap works')}; ${h.src('vbIndex', 'monthly Visa Bulletin')}.</p>`,
  },
  es: {
    path: "pais/el-salvador-guatemala-honduras",
    nav: 'El Salvador, Guatemala, Honduras', card: 'Nacidos en El Salvador, Guatemala u Honduras: qué fechas del boletín de visas les tocan hoy a sus familiares.',
    title: 'Boletín de Visas El Salvador, Guatemala y Honduras 2026',
    description: 'Fechas del boletín de visas para familias de El Salvador, Guatemala y Honduras: hoy usan las del resto del mundo; la columna EB-4 propia existió de 2016 a 2023.',
    h1: 'Familias de El Salvador, Guatemala y Honduras ante el boletín de visas',
    intro: 'Elija la categoría de su familiar y escriba la fecha de prioridad del I-130: este mes estos tres países usan la columna del resto del mundo.',
    resume: `Si usted o su familiar nació en El Salvador, Guatemala u Honduras, en los boletines de ${LATEST.slice(0, 4)} le corresponden las fechas del resto del mundo (All Chargeability Areas Except Those Listed) en todas las categorías. ${svNow ? 'Este mes el boletín vuelve a publicar una columna propia para los tres países.' : 'No existe hoy una columna propia para estos tres países.'} Sí existió: el archivo la muestra en ${withSV.length} boletines, de ${monthEs(first)} a ${monthEs(last)}, solo en la tabla de empleo${onlyEb4 ? ', y solo con fechas distintas en EB-4 (inmigrantes especiales) y en su subcategoría de trabajadores religiosos' : ''}. Para las peticiones familiares eso significa una ventaja frente a México: un hermano de ciudadano nacido en Guatemala espera en F4 con fecha ${es(f4)}, mientras que uno nacido en México tiene fecha ${es(f4mx)}. Lo que decide la columna es el país de nacimiento, no la nacionalidad. Un país recibe columna propia solo cuando su demanda supera el límite del ${Math.round(L.perCountryShare * 100)} % por país.`,
    faqs: [
      { q: '¿Mi hermano nacido en El Salvador espera lo mismo en F4 que uno nacido en México?', a: 'No. Este mes las personas nacidas en El Salvador, Guatemala u Honduras usan la fecha F4 del resto del mundo, que va muchos años por delante de la fecha F4 de México. Si la petición I-130 la presentó un ciudadano estadounidense para su hermano salvadoreño, la fila que cuenta es la mundial. La tabla de esta página muestra todas esas fechas.' },
      { q: '¿Qué fue la columna de El Salvador, Guatemala y Honduras en el boletín de visas?', a: 'Entre 2016 y 2023, la tabla de empleo del boletín tuvo una columna compartida por los tres países. Solo marcó fechas distintas en EB-4, la categoría de ciertos inmigrantes especiales, y en la de trabajadores religiosos. En las demás categorías repetía la fecha mundial. Desde su último mes, los tres países usan la columna del resto del mundo.' },
      { q: '¿Si nací en Honduras pero tengo pasaporte de otro país, qué fecha uso?', a: 'La del país donde nació, porque el boletín de visas asigna a cada persona según su lugar de nacimiento. Hoy eso significa la columna del resto del mundo. Si su cónyuge nació en otro país, en algunos casos se puede usar el país del cónyuge cuando inmigran juntos. Consulte con un representante acreditado por el Departamento de Justicia (DOJ).' },
    ],
    body: (h) => `
<h2>Su familia usa hoy la fila del resto del mundo</h2>
<p>${svNow ? 'Este mes el boletín publica una columna propia para los tres países; revise su fila en el boletín oficial.' : `El boletín de ${h.month(LATEST)} no tiene columna propia para El Salvador, Guatemala u Honduras.`} Para una familia que vive en Estados Unidos y pidió a un pariente nacido en uno de estos países, las fechas de acción final (Final Action Date) de este mes son:</p>
<ul>
<li>F2A, cónyuge o hijo menor de un residente: ${h.cell(f2a)}.</li>
<li>F3, hijo casado de un ciudadano: ${h.cell(f3)}.</li>
<li>F4, hermano de un ciudadano: ${h.cell(f4)}.</li>
</ul>
<p>Las demás categorías están en la tabla de abajo, en la columna del resto del mundo.</p>
<h2>La comparación con México</h2>
<p>Una familia con parientes nacidos en México y en Centroamérica ve dos filas muy distintas. En F3, la fecha mexicana es ${h.cell(f3mx)} y la mundial ${h.cell(f3)}: unos ${h.num(years(f3mx, f3), 1)} años de diferencia. En F4, ${h.cell(f4mx)} contra ${h.cell(f4)}. ${h.a('country-mexico', 'Vea la página de México')}.</p>
<h2>La columna EB-4 de 2016 a 2023</h2>
<p>Desde ${h.month(first)} hasta ${h.month(last)} hubo una columna compartida por los tres países en la tabla de empleo. En su primer mes, EB-4 estaba ${firstRow === 'C' ? 'al día (Current)' : `en ${h.cell(firstRow)}`} para el resto del mundo y en ${h.cell(firstSV)} para los tres países; en su último mes, en ${h.cell(lastRow)} frente a ${h.cell(lastSV)}. Después el boletín dejó de publicarla. Hoy la fecha mundial de EB-4 es ${h.cell(eb4)}. ${h.a('eb-4', 'Página de EB-4')}.</p>
<h2>Por qué un país recibe columna propia</h2>
<p>La ley limita a cada país al ${h.pct(L.perCountryShare)} de las visas de preferencia del año, ${h.num(L.perCountry)} en total. Cuando la demanda de un país en una categoría supera ese límite, el Departamento de Estado le fija una fecha aparte. ${h.src('ina203', 'Ley de Inmigración y Nacionalidad, secciones 201 a 203')}.</p>`,
  },
});
