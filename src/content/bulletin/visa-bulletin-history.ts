import { definePage } from '../../lib/guide-types';
import { cellAt, MONTHS, LATEST } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';

// Repères historiques lus dans l'archive (mois figés, valeurs jamais tapées).
const at = (c: Parameters<typeof cellAt>[0], k: Parameters<typeof cellAt>[1], m: string, chart: 'FAD' | 'DFF' = 'FAD') => cellAt(c, k, chart, MONTHS.indexOf(m));
const BULLETINS = MONTHS.filter((_, i) => cellAt('F1', 'ROW', 'FAD', i) !== 'U').length;
const GAPS = MONTHS.filter((_, i) => cellAt('F1', 'ROW', 'FAD', i) === 'U');
const r = {
  eb1In: retrogressions('EB1', 'IN'), eb3Row: retrogressions('EB3', 'ROW'), f2aRow: retrogressions('F2A', 'ROW'),
  f1Mx: retrogressions('F1', 'MX'), f3Mx: retrogressions('F3', 'MX'), f4Mx: retrogressions('F4', 'MX'), eb2In: retrogressions('EB2', 'IN'),
};

export default definePage({
  id: "visa-bulletin-history", group: "bulletin", order: 12, parent: "visa-bulletin",
  tool: {"kind": "bulletin", "month": "2015-10", "pick": true, "cat": "EB2", "country": "IN"},
  data: {"special": "history"},
  related: ["visa-bulletin", "guide-retrogression", "visa-bulletin-predictions", "guide-final-action-vs-dates-for-filing", "country-mexico"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "visa-bulletin/history",
    nav: 'Bulletin history', card: 'Every Visa Bulletin since December 2001 on one screen: pick a month, a category and a country.',
    title: 'Visa Bulletin History: Every Month Since December 2001',
    description: 'Visa Bulletin history explorer: pick any month since December 2001 to see both charts, plus the big episodes of 2005, 2007, 2011, 2015 and the 2023 rollbacks.',
    h1: 'Visa Bulletin history, month by month since 2001',
    intro: 'Choose any bulletin from December 2001 to today and a category to see the cutoffs printed that month and where the same box stands now.',
    resume: `Our archive holds ${BULLETINS} Visa Bulletins, from December 2001 to ${monthName(LATEST, 'en')}, each read from the State Department's own pages and stored as published. Five months are missing from the source we read (${GAPS.map((m) => monthName(m, 'en')).join(', ')}), and the calculations skip them rather than guess. The record shows a queue that rarely moves in a straight line. Employment categories went from current to unavailable between July and August 2007. Family cutoffs fell sharply in January 2011. A second chart, Dates for Filing, first appeared in October 2015. Several categories that had been current for years, F2A and EB-3 among them, retrogressed during 2023, and EB-1 India lost ${Math.round(r.eb1In.worstMonths)} months in a single bulletin in ${monthName(r.eb1In.worstAt, 'en')}. EB-2 India has stepped back ${r.eb2In.n} times. Every forecast on this site is built from this archive, with its gaps marked.`,
    faqs: [
      { q: 'Where can I see an old Visa Bulletin from a specific month?', a: 'Use the explorer at the top of this page: pick the month and the category, and it shows the Final Action Date for every country column, plus the Dates for Filing chart for bulletins from October 2015 onward. The State Department also keeps its own archive of past bulletins, linked in the sources at the bottom.' },
      { q: 'What happened in the July 2007 Visa Bulletin?', a: 'The July 2007 bulletin listed almost every employment category as current, including EB-2 and EB-3 for India and China, and many people prepared to file. The August 2007 bulletin then listed the employment categories as unavailable. The episode is the clearest example in the archive of how fast the picture can turn.' },
      { q: 'When did the Visa Bulletin start printing two charts?', a: 'In October 2015. From that bulletin on, each category has a Final Action Date, which governs approval, and a Date for Filing, which can let applicants submit paperwork earlier. Bulletins before October 2015 have a single chart, so our history shows the second chart only from that month.' },
      { q: 'Why are some months missing from the Visa Bulletin history?', a: 'The archive we read has no bulletin for a handful of months, all in 2009 and 2012. We do not fill them by guessing. The forecast and the movement figures step over the gap to the nearest published bulletin, and the explorer simply shows nothing for those months.' },
    ],
    body: (h) => `
<h2>Twenty-five years in one screen</h2>
<p>Each of the ${h.num(BULLETINS)} bulletins is stored the way it was printed: a date, ${h.cell('C')} or ${h.cell('U')} in every box. Pick a month in the explorer and you see that month's charts beside today's. The table below the text lines up every October since 2002 for six of the most searched boxes, because October opens the fiscal year and makes the cleanest comparison from one year to the next.</p>
<h2>The eras the archive shows</h2>
<p><strong>The early 2000s.</strong> In December 2001, a brother or sister born in the Philippines needed a priority date before ${h.cell(at('F4', 'PH', '2001-12'))}. Mexico was already on its own line, and in July 2005 it lurched back: F1 Mexico went from ${h.cell(at('F1', 'MX', '2005-06'))} to ${h.cell(at('F1', 'MX', '2005-07'))} in one bulletin.</p>
<p><strong>July 2007.</strong> Nearly every employment box read ${h.cell(at('EB2', 'IN', '2007-07'))}; the next month they read ${h.cell(at('EB2', 'IN', '2007-08'))}. No other month in the record shows the whole employment system opening and shutting so quickly.</p>
<p><strong>January 2011.</strong> After a fast run in 2010, family cutoffs were pulled back: F2A for most of the world from ${h.cell(at('F2A', 'ROW', '2010-12'))} to ${h.cell(at('F2A', 'ROW', '2011-01'))}, F3 from ${h.cell(at('F3', 'ROW', '2010-12'))} to ${h.cell(at('F3', 'ROW', '2011-01'))}.</p>
<p><strong>May 2012.</strong> EB-2 India and China fell from ${h.cell(at('EB2', 'IN', '2012-04'))} to ${h.cell(at('EB2', 'IN', '2012-05'))}, then to ${h.cell(at('EB2', 'IN', '2012-06'))} the following month.</p>
<p><strong>October 2015.</strong> The bulletin added Dates for Filing. That first month, EB-2 India read ${h.cell(at('EB2', 'IN', '2015-10'))} for approval and ${h.cell(at('EB2', 'IN', '2015-10', 'DFF'))} for filing, and USCIS began choosing each month which chart it accepts (${h.src('aosCharts', 'USCIS filing charts')}).</p>
<p><strong>2019 to 2022.</strong> F2A, spouses and children of green card holders, turned current in July 2019 and stayed there through the pandemic years, as did EB-3 for most countries for long stretches.</p>
<p><strong>2023.</strong> The current boxes closed. F2A dropped to ${h.cell(at('F2A', 'ROW', '2023-04'))} in April and ${h.cell(at('F2A', 'ROW', '2023-08'))} in August; EB-3 worldwide to ${h.cell(at('EB3', 'ROW', '2023-08'))}; EB-1 India to ${h.cell(at('EB1', 'IN', '2023-08'))}. Since 2001, EB-3 worldwide has stepped back ${h.num(r.eb3Row.n)} times and F2A ${h.num(r.f2aRow.n)} times.</p>
<h2>Using the past without overreading it</h2>
<p>The archive is what our forecasts learn from, and also a warning: every one of these episodes came after a period that looked steady. The ${h.a('guide-retrogression', 'retrogression guide')} explains why steps back happen, and the ${h.a('visa-bulletin-predictions', 'predictions page')} shows where the record is regular enough to forecast. Sources: the ${h.src('vbIndex', 'State Department Visa Bulletin index')} and its ${h.src('vbMirror', 'archive host')}.</p>`,
  },
  es: {
    path: "boletin-de-visas/historial",
    nav: 'Historial del boletín', card: 'Todos los boletines desde diciembre de 2001: elija un mes y vea cómo estaba la fila de su familia.',
    title: 'Historial del Boletín de Visas: cada mes desde 2001',
    description: 'Historial del Boletín de Visas desde diciembre de 2001: elija un mes y vea las fechas de su categoría, con los grandes retrocesos de México en 2005 y 2011.',
    h1: 'Historial del Boletín de Visas desde diciembre de 2001',
    intro: 'Elija cualquier boletín desde diciembre de 2001 y la categoría de su familia para ver la fecha de ese mes y compararla con la de hoy.',
    resume: `El archivo reúne ${BULLETINS} boletines de visas, de diciembre de 2001 a ${monthName(LATEST, 'es')}, leídos en las páginas del Departamento de Estado y guardados tal como se publicaron; faltan cinco meses en la fuente y no los inventamos. Para las familias mexicanas, el historial cuenta una espera larga y con sobresaltos. En diciembre de 2001, un hermano de ciudadano nacido en México necesitaba una fecha de prioridad anterior a ${cellText(at('F4', 'MX', '2001-12'), 'es')}; hoy la fecha de F4 México es ${cellText(cellAt('F4', 'MX', 'FAD'), 'es')}. En julio de 2005 las filas mexicanas retrocedieron de golpe, y en enero de 2011 F2A México, la fila de los cónyuges de residentes, perdió casi cinco años. F1 México ha retrocedido ${r.f1Mx.n} veces desde 2001, F3 México ${r.f3Mx.n} y F4 México ${r.f4Mx.n}. Todos los pronósticos del sitio salen de este archivo.`,
    faqs: [
      { q: '¿Dónde veo cómo estaba el Boletín de Visas el año en que pedí a mi familiar?', a: 'En el explorador de esta página: elija el mes en que USCIS recibió la petición I-130 y la categoría, y verá la fecha de acción final de cada columna de país ese mes, junto a la de hoy. Así sabe cuánto avanzó la fila desde que su familiar entró en ella. Desde octubre de 2015 también aparece la tabla de presentación.' },
      { q: '¿Qué pasó con las fechas de México en julio de 2005?', a: 'En el boletín de julio de 2005, varias categorías familiares de México retrocedieron muchos años en un solo mes. F1 México, la de los hijos solteros de ciudadanos, fue la que más perdió. Es el retroceso más grande de esa columna en todo el archivo y explica por qué los pronósticos para F1 México siguen siendo tan inciertos.' },
      { q: '¿Cuándo estuvo al día la categoría F2A para los cónyuges de residentes?', a: 'Desde julio de 2019 la fecha de acción final de F2A quedó al día (C) y se mantuvo así durante los años de la pandemia. En 2023 volvió a tener fecha límite y retrocedió en abril y en agosto. Hoy F2A México tiene su propia fecha, distinta de la del resto del mundo.' },
    ],
    body: (h) => `
<h2>Cómo usar el historial para su caso</h2>
<p>Busque el mes en que USCIS recibió la petición de su familiar: esa es la fecha de prioridad. Elíjalo en el explorador y verá dónde estaba la fecha límite entonces. Compare con la de hoy y sabrá cuánto ha avanzado la fila desde que su familiar entró. Si un señor de Michoacán pidió a su hermana en 2006, la casilla F4 México de ese año y la de ${h.month(LATEST)} cuentan la historia de su espera mejor que cualquier promedio.</p>
<h2>Los momentos que marcaron a las familias mexicanas</h2>
<p><strong>Diciembre de 2001.</strong> F3 México, hijos casados de ciudadanos, estaba en ${h.cell(at('F3', 'MX', '2001-12'))}; F2A México, cónyuges de residentes, en ${h.cell(at('F2A', 'MX', '2001-12'))}.</p>
<p><strong>Julio de 2005.</strong> F1 México cayó de ${h.cell(at('F1', 'MX', '2005-06'))} a ${h.cell(at('F1', 'MX', '2005-07'))}, y F4 México de ${h.cell(at('F4', 'MX', '2005-06'))} a ${h.cell(at('F4', 'MX', '2005-07'))}. En un solo mes, las familias que ya estaban cerca vieron alejarse su turno.</p>
<p><strong>Enero de 2011.</strong> F2A México pasó de ${h.cell(at('F2A', 'MX', '2010-12'))} a ${h.cell(at('F2A', 'MX', '2011-01'))}: el mayor retroceso de esa casilla desde 2001.</p>
<p><strong>Octubre de 2015.</strong> Nace la segunda tabla, la de fechas de presentación (Dates for Filing). Desde entonces USCIS indica cada mes cuál de las dos acepta para el formulario I-485 (${h.src('aosCharts', 'tablas de USCIS')}).</p>
<p><strong>De 2019 a 2023.</strong> F2A estuvo al día para el resto del mundo desde julio de 2019. En 2023 volvió la fecha límite: ${h.cell(at('F2A', 'ROW', '2023-04'))} en abril y ${h.cell(at('F2A', 'ROW', '2023-08'))} en agosto.</p>
<p><strong>Hoy.</strong> F3 México está en ${h.cell(cellAt('F3', 'MX', 'FAD'))} y F4 México en ${h.cell(cellAt('F4', 'MX', 'FAD'))}. Las familias de El Salvador, Guatemala y Honduras siguen la columna del resto del mundo, cuya historia también aparece en el explorador.</p>
<h2>Lo que el pasado enseña, y lo que no</h2>
<p>Cada retroceso llegó después de meses que parecían tranquilos. Por eso nuestros pronósticos miran diez años de boletines y no solo los últimos meses, y por eso a veces dicen «sin pronóstico fiable». La ${h.a('guide-retrogression', 'guía de retrocesos')} explica por qué pasan, y las ${h.a('visa-bulletin-predictions', 'predicciones')} muestran dónde el pasado es lo bastante regular. Los meses que faltan en la fuente (${GAPS.map((m) => h.month(m)).join(', ')}) se saltan, no se rellenan. Fuente: ${h.src('vbIndex', 'Visa Bulletin del Departamento de Estado')}.</p>`,
  },
});
