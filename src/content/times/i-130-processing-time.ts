import { definePage } from '../../lib/guide-types';
import PT from '../../data/ptimes.json';
import { KINDS, centerRows, NATIONAL_MONTH, PUBLISHED } from '../../lib/engine/ptimes';
import { cellAt } from '../../lib/engine/cases';
import { formatNumber, displayDate } from '../../lib/format';
import { monthName, cellText } from '../../lib/text';

// Chiffres lus dans les données : six sous-types de l'I-130, trois unités (FOD, NBC, SCD), rapport au Congrès.
type L = 'en' | 'es';
const NF = (PT as unknown as { national: { forms: Record<string, { months: number; received: number; pending: number }> } }).national.forms;
const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const [mName, mYear] = NATIONAL_MONTH.split(' ');
const natYm = `${mYear}-${String(MN.indexOf(mName) + 1).padStart(2, '0')}`;
const n = (x: number | null | undefined, l: L = 'en') => (x == null ? '—' : formatNumber(x, x % 1 ? 1 : 0, l));
const nat = NF['I-130'];
const kinds = KINDS.filter((k) => k.file === 'i-130');
const spread = kinds.map((k) => {
  const rs = centerRows(k).filter((r) => r.max != null).sort((a, b) => a.max! - b.max!);
  return { k, lo: rs[0], hi: rs[rs.length - 1] };
});
const ir = spread.find((s) => s.k.id === 'i130ir')!;
const allRows = kinds.flatMap((k) => centerRows(k)).filter((r) => r.max != null);
const longest = allRows.reduce((a, b) => (b.max! > a.max! ? b : a));
const oldestInquiry = allRows.filter((r) => r.inquiry).map((r) => r.inquiry!).sort()[0];
const f4mx = cellAt('F4', 'MX', 'FAD');
const pubEn = displayDate(PUBLISHED, 'en-US');
const pubEs = displayDate(PUBLISHED, 'es-US');
const yrs = (months: number, l: L) => formatNumber(months / 12, 1, l);

export default definePage({
  id: "i-130-processing-time", group: "times", order: 504, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i130ir", "office": "HOU"},
  data: {"form": "i-130"},
  related: ["processing-times", "i-130-fee", "guide-priority-date", "f4-mexico", "i-485-family-processing-time"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i130Form", "visaPriority", "consular"],
  en: {
    path: "processing-times/i-130",
    nav: 'I-130 processing time', card: 'Relative petition times for all six I-130 categories at the three units that publish them.',
    title: 'I-130 Processing Time 2026: Every Relative Category',
    description: 'I-130 processing time in 2026 for spouses, parents, children and siblings: the range at each USCIS unit, the national average, and the long preference lines.',
    h1: 'I-130 processing time for each family category',
    intro: 'Choose the relationship on your petition and the unit handling it, then enter the receipt date to see how the case compares with the published range.',
    resume: `The I-130 relative petition is published in six categories and by three USCIS units, and the eighteen ranges have little in common. For a U.S. citizen petitioning a spouse, parent or child under 21, the upper bound of the range in the edition of ${pubEn} goes from ${n(ir.lo.max)} months at the ${ir.lo.name} to ${n(ir.hi.max)} months at the ${ir.hi.name}. The preference categories show far longer figures at some units; the longest published upper bound is ${n(longest.max)} months, about ${yrs(longest.max!, 'en')} years, and the earliest inquiry date on the list is ${displayDate(oldestInquiry, 'en-US')}. The report to Congress for ${NATIONAL_MONTH} gives a single national average of ${n(nat.months)} months for all I-130 decisions that month. It is a true figure and so are the ranges; the average weighs every completed petition equally, while each range describes the median and the 80% mark of one category at one unit. USCIS had ${n(nat.pending)} I-130 petitions pending, the largest backlog of any form we track.`,
    faqs: [
      { q: 'How long does an I-130 for a spouse of a U.S. citizen take?', a: 'USCIS publishes the spouse, parent and minor child category, called immediate relatives, as one line at each of three units, and the ranges differ a lot between them. The checker on this page shows each line and places your receipt date against it. If the unit is not clear from your notices, compare with all three before deciding whether to make an inquiry.' },
      { q: 'Why do some I-130 processing-time lines show waits of many years?', a: 'USCIS publishes those figures for some preference categories at some units, without an explanation on its processing-times tool. We show them exactly as published and do not attribute a cause. What we can say is that the national average for all I-130 decisions in the report to Congress is far shorter, because it is a different measure.' },
      { q: 'Does an approved I-130 mean the relative can immigrate right away?', a: 'Only for immediate relatives of U.S. citizens, for whom USCIS says a visa is always available. Brothers, sisters, married sons and daughters, and relatives of green card holders must also wait until a visa number is available under the Visa Bulletin before the green card can be issued. The priority date of that wait comes from the petition.' },
      { q: 'What does the I-130 national average in the report to Congress include?', a: 'Every Form I-130 that USCIS completed in the month, whatever the category and whichever unit decided it, measured from receipt to decision. It does not separate immediate relatives from preference cases. That is why it cannot be compared line by line with the published ranges, which are given per category and per unit.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Six categories, three units</h2>
<p>For each I-130 category, here is the shortest and the longest upper bound USCIS publishes across the National Benefits Center, Service Center Operations and the Field Office Directorate. The full list of eighteen lines, with medians and inquiry dates, follows the checker.</p>
${h.table(['Category', 'Shortest upper bound', 'Longest upper bound'], spread.map((s) => [s.k.label.en, `${m(s.lo.max)} months (${s.lo.name})`, `${m(s.hi.max)} months (${s.hi.name})`]), `USCIS publication of ${h.date(PUBLISHED)}. Some lines publish an upper bound only.`, ['l', 'r', 'r'])}
<h2>Reading figures measured in years</h2>
<p>The longest line on the list reads ${m(longest.max)} months, and some inquiry dates go back to ${h.date(oldestInquiry)}. USCIS does not explain these figures on its tool, so we describe them and stop there. Two things are certain. First, they are office-level statistics about past completions, not a forecast for a petition filed today. Second, they sit next to a national average of ${m(nat.months)} months for ${h.month(natYm)}, which counts every I-130 completed that month. Neither cancels the other.</p>
<h2>The petition and the queue are separate</h2>
<p>Approval of the I-130 does not by itself end the wait in the preference categories. USCIS explains on the ${h.src('i130Form', 'Form I-130 page')} that immediate relatives always have a visa available, while other relatives must wait for a visa number before filing Form I-485. That second wait is the Visa Bulletin, measured from the ${h.a('guide-priority-date', 'priority date')}. Our green card calculator adds both clocks for a given category and country.</p>`;
    },
  },
  es: {
    path: "tiempos-de-proceso/i-130",
    nav: 'Tiempo del I-130', card: 'Cuánto tarda la petición familiar I-130 para esposos, hijos, padres y hermanos, unidad por unidad.',
    title: 'I-130 tiempo de proceso 2026: petición familiar USCIS',
    description: 'Cuánto tarda la petición familiar I-130 en 2026: el rango de USCIS para esposos, hijos, padres y hermanos, el promedio nacional y la espera del Visa Bulletin.',
    h1: 'Petición I-130: cuánto tarda según el parentesco',
    intro: 'Elija el parentesco de su petición y la unidad que la tramita, escriba la fecha de recibo y vea cómo va el caso frente al rango publicado.',
    resume: `La petición de familiar extranjero (Petition for Alien Relative), formulario I-130, es el primer paso para que un ciudadano o residente pida a su esposo, sus hijos, sus padres o sus hermanos. USCIS publica su tiempo en seis categorías y en tres unidades. En la publicación del ${pubEs}, para el cónyuge, el padre o el hijo menor de 21 años de un ciudadano, la cifra alta del rango va de ${n(ir.lo.max, 'es')} meses a ${n(ir.hi.max, 'es')} meses según la unidad. En otras categorías hay líneas mucho más largas: la cifra más alta publicada es de ${n(longest.max, 'es')} meses, unos ${yrs(longest.max!, 'es')} años. El informe al Congreso de ${monthName(natYm, 'es')} da un promedio nacional de ${n(nat.months, 'es')} meses para todas las peticiones I-130 terminadas en el mes, con ${n(nat.pending, 'es')} pendientes. Las dos cifras son ciertas y miden cosas distintas. Para un hermano nacido en México, además, la espera del Visa Bulletin se mide en décadas: la fecha de acción final de F4 México de este mes es: ${cellText(f4mx, 'es')}.`,
    faqs: [
      { q: '¿Cuánto tarda la petición I-130 de un ciudadano para su esposa en México?', a: 'USCIS publica la categoría de pariente inmediato (cónyuge, padres e hijos menores de 21 años de un ciudadano) como una sola línea en cada una de sus tres unidades, con rangos muy distintos entre ellas. La herramienta de arriba las muestra todas. Después de la aprobación, el caso pasa al proceso consular en el Departamento de Estado, que no publica un tiempo de entrevista.' },
      { q: '¿Por qué la petición I-130 de un hermano aparece con tiempos de muchos años?', a: 'USCIS publica esas cifras para algunas categorías de preferencia en algunas unidades y no explica la razón en su herramienta de tiempos. Las mostramos tal como se publican, sin suponer una causa. Lo que sí es seguro es que, para un hermano, también cuenta la espera del Visa Bulletin, que para México en la categoría F4 es de varias décadas.' },
      { q: '¿Qué fecha de prioridad me da la petición I-130 de mi familiar?', a: 'En los casos familiares, la fecha de prioridad (priority date) es la fecha en que USCIS recibió la petición I-130, impresa en el aviso de recibo I-797C. Esa fecha es la que se compara cada mes con el Visa Bulletin. Por eso conviene guardar el aviso aunque la petición tarde en aprobarse: el lugar en la fila ya está fijado.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      const y = (x: number | null | undefined) => (x == null ? '—' : h.num(x / 12, 1));
      return `<h2>El parentesco cambia todo</h2>
<p>Una ciudadana de Los Ángeles que pide a su esposo y la misma ciudadana que pide a su hermano en Jalisco presentan el mismo formulario, pagan la misma tarifa y entran en líneas muy diferentes. Esta tabla convierte a años la cifra alta más corta y la más larga de cada categoría.</p>
${h.table(['Categoría', 'Cifra alta más corta', 'Cifra alta más larga'], spread.map((s) => [s.k.label.es, `${y(s.lo.max)} años`, `${y(s.hi.max)} años`]), `Publicación de USCIS del ${h.date(PUBLISHED)}, entre el Centro Nacional de Beneficios, los centros de servicio y la dirección de oficinas locales.`, ['l', 'r', 'r'])}
<p>La lista completa, en meses y con las fechas de consulta, está debajo de la herramienta. Algunas líneas solo publican la cifra alta.</p>
<h2>Promedio nacional y rangos: no se contradicen</h2>
<p>El promedio de ${m(nat.months)} meses del informe de ${h.month(natYm)} mezcla todas las peticiones terminadas en el mes, de todas las categorías. Un rango describe una sola categoría en una sola unidad: su caso mediano y el plazo del 80 % de los casos. USCIS no explica en su herramienta por qué algunas líneas son tan largas, y nosotros tampoco lo suponemos.</p>
<h2>Dos esperas para la mayoría de las familias</h2>
<p>Según la ${h.src('i130Form', 'página del formulario I-130')}, los parientes inmediatos siempre tienen una visa disponible; los demás esperan un número de visa. Para un hermano mexicano, la fecha de acción final de F4 de este mes es: ${h.cell(f4mx)}, como muestra la página de ${h.a('f4-mexico', 'F4 México')}. La aprobación del I-130 asegura el lugar en la fila; no la acorta.</p>`;
    },
  },
});
