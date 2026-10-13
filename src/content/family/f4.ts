import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, distinctShare, MONTHS } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { centerRows, kindById } from '../../lib/engine/ptimes';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const at = (c: 'ROW' | 'MX' | 'PH' | 'IN', ym?: string) => cellAt('F4', c, 'FAD', ym ? MONTHS.indexOf(ym) : undefined);
const fad = at('ROW');
const dff = cellAt('F4', 'ROW', 'DFF');
const mx = at('MX');
const ph = at('PH');
const ind = at('IN');
const oct2019 = at('ROW', '2019-10');
const oct2020 = at('ROW', '2020-10');
const oct2024 = at('ROW', '2024-10');
const oct2025 = at('ROW', '2025-10');
const move = moveDays('F4', 'ROW') ?? 0;
const bt12 = backtestCell('F4', 'ROW', 12)!;
const bt24 = backtestCell('F4', 'ROW', 24)!;
const bt48 = backtestCell('F4', 'ROW', 48)!;
const retro = retrogressions('F4', 'ROW');
const nbc = centerRows(kindById('i130f4')!).find((r) => r.office === 'NBC');
let jump = 0, jumpAt = MONTHS[MONTHS.length - 1];
for (let i = MONTHS.length - 12; i < MONTHS.length; i++) {
  const d = moveDays('F4', 'ROW', 'FAD', i) ?? 0;
  if (d > jump) { jump = d; jumpAt = MONTHS[i]; }
}
const DAY = 86_400_000;
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * DAY);
const latestDay = `${MONTHS[MONTHS.length - 1]}-01`;
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');

export default definePage({
  id: "f4", group: "family", order: 104,
  tool: {"kind": "greencard", "cat": "F4", "country": "ROW"},
  data: {"cat": "F4", "country": "ROW"},
  related: ["f4-mexico", "f4-philippines", "f4-india", "i-130-processing-time", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form", "cspaPolicy", "vbOct2026", "cfr204_1", "famPref"],
  en: {
    path: "family/f4",
    nav: 'F4 (brother or sister)', card: 'Brothers and sisters of adult U.S. citizens: the longest family line, its Mexico, Philippines and India columns.',
    title: 'F4 Visa Bulletin 2026: Sibling of U.S. Citizen Wait',
    description: 'F4 for brothers and sisters of U.S. citizens aged 21 or older: Final Action Date, filing chart, Mexico, Philippines and India lines, and a back-tested forecast.',
    h1: 'F4: brother or sister of a U.S. citizen',
    intro: 'Enter the priority date of the sibling petition to see how far it sits from the F4 cutoff this month and how reliable a forecast for that distance has been.',
    resume: `F4 is the family preference for the brothers and sisters of U.S. citizens who are at least 21, and it is the longest family queue for most of the world. In the latest Visa Bulletin the Final Action Date for applicants born in most countries is ${en(fad)}, and the Date for Filing ${en(dff)}: the line is roughly ${years(fad, latestDay).toFixed(0)} years long. Three countries have their own column. India is at ${en(ind)}, the Philippines at ${en(ph)}, and Mexico at ${en(mx)}, the oldest family cutoff in the table. The worldwide date crept from ${en(oct2020)} in October 2020 to ${en(oct2025)} in October 2025, then gained ${Math.round(jump)} days in the bulletin of ${monthName(jumpAt, 'en')}. Unlike F1 to F3, the beneficiary’s marriage changes nothing here. For a priority date one year behind, our back-tested forecast missed by a median of ${bt12.medianError} months, and two years behind by ${bt24.medianError}.`,
    faqs: [
      { q: 'Who can file in the F4 category, and for whom?', a: 'A U.S. citizen who is at least 21 can file Form I-130 for a brother or sister. Permanent residents cannot. The sibling’s spouse and unmarried children under 21 come as derivatives on the same priority date. Each sibling needs a separate petition, so a citizen with three brothers abroad files three I-130s, each with its own receipt date.' },
      { q: 'Does marriage or divorce change an F4 petition?', a: 'No. F4 is the only family preference where the beneficiary’s marital status does not move the case to another category. A brother who marries during the wait simply adds his spouse as a derivative, and a sister who divorces loses her former husband as a derivative. The derivative children still have to remain under 21, or be protected by CSPA.' },
      { q: 'Why does the F4 worldwide date sometimes go backwards?', a: 'Because demand from the very large pool of sibling petitions can exceed the yearly F4 numbers once a cutoff moves fast, and the State Department then pulls the date back to stay inside the annual limit. The largest such step in the worldwide column came in September 2017. The calculator counts these steps in its range instead of hiding them.' },
    ],
    body: (h) => `
<h2>The sibling petition</h2>
<p>A naturalized citizen who turns 21, or who is already older, can file ${h.src('i130Form', 'Form I-130')} for a brother or sister born of at least one common parent. The sibling’s husband or wife and their children under 21 ride on that one petition. Nothing a sibling does with marriage pulls the case into another line, which makes F4 the most stable category in form and the slowest in practice: for most of the world the queue covers about ${h.num(years(fad, latestDay), 0)} years of priority dates.</p>
<h2>Four columns, four waits</h2>
${h.table(['Born in', 'Final Action Date', 'Years behind the bulletin'], [
  ['Most countries', h.cell(fad), h.num(years(fad, latestDay), 1)],
  ['India', h.cell(ind), h.num(years(ind, latestDay), 1)],
  ['Philippines', h.cell(ph), h.num(years(ph, latestDay), 1)],
  ['Mexico', h.cell(mx), h.num(years(mx, latestDay), 1)],
], `F4, ${h.month(MONTHS[MONTHS.length - 1])} Visa Bulletin`, ['l', 'l', 'r'])}
<p>F4 is the one family category where India regularly has its own date, in ${h.pct(distinctShare('F4', 'IN'))} of bulletins since October 2015; the ${h.a('f4-india', 'F4 India page')} follows it. The ${h.a('f4-mexico', 'F4 Mexico')} and ${h.a('f4-philippines', 'F4 Philippines')} pages tell the other two stories.</p>
<h2>Five years of inches, one bulletin of yards</h2>
<p>The worldwide cutoff was ${h.cell(oct2019)} in October 2019 and ${h.cell(oct2020)} a year later: twelve months of bulletins ended behind where they started. It reached ${h.cell(oct2024)} in October 2024 and ${h.cell(oct2025)} in October 2025. The bulletin of ${h.month(jumpAt)} then moved it ${h.num(Math.round(jump))} days, and today it reads ${h.cell(fad)}${move === 0 ? ', unchanged in the latest bulletin' : `, after ${h.num(Math.abs(Math.round(move)))} more days in the latest one`}. F4 worldwide has gone backwards ${h.num(retro.n)} times since 2001, the biggest drop being about ${h.num(Math.round(retro.worstMonths))} months in ${h.month(retro.worstAt)}. A fast stretch like the current one is often followed by a pause.</p>
<h2>Children who age out on the way</h2>
<p>A niece who was 10 when the petition was filed can be over 21 by the time the date is reached. The ${h.a('guide-cspa', 'CSPA calculation')} subtracts the time the I-130 was pending from her age when the Final Action Date became current, and she must seek the green card within a year. In this category it often decides whether a child immigrates with the parents.</p>
<h2>The forecast at long distances</h2>
<p>${nbc ? `USCIS lists ${h.num(nbc.min ?? 0, 1)} to ${h.num(nbc.max ?? 0, 1)} months at the National Benefits Center for a sibling I-130. ` : ''}For a priority date two years behind, our back-test range held the real outcome ${h.pct(bt24.coverage)} of the time; at four years behind, the median error was ${h.num(bt48.medianError)} months, ${bt48.reliable ? 'which passed' : 'which did not pass'} our publication test. Most siblings finish at a consulate; see the ${h.a('consular-processing-cost', 'consular processing costs')}.</p>`,
  },
  es: {
    path: "familia/f4",
    nav: 'F4 (hermano de ciudadano)', card: 'Hermanos de ciudadanos mayores de 21: la fila familiar más larga y sus columnas de México, Filipinas e India.',
    title: 'F4 boletín de visas 2026: hermano de ciudadano de EE. UU.',
    description: 'F4 para hermanos de un ciudadano de 21 años o más: fecha de acción final, fecha para presentar, México, Filipinas e India, y lo que se sabe de la espera.',
    h1: 'F4: cuando un ciudadano pide a su hermano o a su hermana',
    intro: 'Escriba la fecha de prioridad del I-130 que presentó para su hermano y vea cuánto le falta en la categoría F4 este mes.',
    resume: `La categoría F4 es para los hermanos y hermanas de un ciudadano estadounidense de 21 años o más, y es la fila familiar más larga para casi todo el mundo. En el boletín de visas (Visa Bulletin) más reciente, la fecha de acción final (Final Action Date) para los nacidos en El Salvador, Guatemala, Honduras, Colombia o cualquier país sin columna propia es ${es(fad)}, y la fecha para presentar (Date for Filing) es ${es(dff)}: unos ${years(fad, latestDay).toFixed(0)} años de fila. Para un hermano nacido en México la fecha es ${es(mx)}, la más antigua del cuadro familiar; en Filipinas, ${es(ph)}; en India, ${es(ind)}. Un residente permanente no puede pedir a sus hermanos: primero tiene que naturalizarse. Casarse o divorciarse no cambia la categoría, solo quién viene como derivado. La fecha general avanzó ${Math.round(jump)} días en el boletín de ${monthName(jumpAt, 'es')}; con un año de atraso, nuestro pronóstico falló por una mediana de ${bt12.medianError} meses entre 2012 y 2025.`,
    faqs: [
      { q: '¿Puedo pedir a mi hermano en F4 si soy residente permanente?', a: 'No. Solo un ciudadano estadounidense de 21 años o más puede presentar el I-130 para un hermano o una hermana. Si usted es residente, primero tiene que naturalizarse; la fecha de prioridad será el día en que USCIS reciba esa petición. Muchas familias calculan el día en que pueden presentar el N-400 por esta razón.' },
      { q: '¿Mi hermana pierde la F4 si se casa o se divorcia?', a: 'No. En F4 el estado civil del hermano no cambia la categoría. Si se casa durante la espera, su esposo viene como derivado; si se divorcia, el excónyuge deja de serlo. Lo que sí importa es la edad de los sobrinos: deben seguir siendo menores de 21, o estar protegidos por la ley CSPA.' },
      { q: '¿Necesito un I-130 aparte para cada hermano en la categoría F4?', a: 'Sí. Cada hermano o hermana necesita su propia petición, con su propio recibo y su propia fecha de prioridad. El cónyuge y los hijos menores de 21 de cada hermano vienen como derivados en la petición de ese hermano. Los costos se suman por petición; la página de costos consulares los desglosa.' },
    ],
    body: (h) => `
<h2>Pedir a un hermano, en la práctica</h2>
<p>Usted se hizo ciudadano y quiere traer a su hermano, que vive en Morazán con su esposa y sus tres hijos. Presenta un ${h.src('i130Form', 'formulario I-130')} solo por él: su esposa y los hijos solteros menores de 21 vienen como derivados. Si tiene otra hermana en Guatemala, necesita otra petición. Cada una corre por su cuenta en la fila. Y usted debe tener al menos 21 años el día en que presenta: un ciudadano más joven todavía no puede pedir a sus hermanos.</p>
<h2>La fila según dónde nació su hermano</h2>
${h.table(['País de nacimiento', 'Fecha de acción final', 'Años detrás del boletín'], [
  ['Columna general', h.cell(fad), h.num(years(fad, latestDay), 1)],
  ['India', h.cell(ind), h.num(years(ind, latestDay), 1)],
  ['Filipinas', h.cell(ph), h.num(years(ph, latestDay), 1)],
  ['México', h.cell(mx), h.num(years(mx, latestDay), 1)],
], `F4, boletín de ${h.month(MONTHS[MONTHS.length - 1])}`, ['l', 'l', 'r'])}
<p>Lo que cuenta es el país de nacimiento del hermano, no su nacionalidad ni el país donde vive ahora. Si nació en México, la página ${h.a('f4-mexico', 'F4 México')} explica por qué esa fila casi no se mueve.</p>
<h2>Cómo se ha movido la columna general</h2>
<p>En octubre de 2019 la fecha era ${h.cell(oct2019)} y un año después, ${h.cell(oct2020)}: el año terminó más atrás de donde empezó. En octubre de 2025 iba en ${h.cell(oct2025)}. En ${h.month(jumpAt)} avanzó ${h.num(Math.round(jump))} días de un golpe; ${move === 0 ? 'el último boletín la dejó sin cambio' : `el último boletín la movió ${h.num(Math.abs(Math.round(move)))} días`}. Ha retrocedido ${h.num(retro.n)} veces desde 2001, la peor unos ${h.num(Math.round(retro.worstMonths))} meses en ${h.month(retro.worstAt)}. Después de un avance rápido, lo común es una pausa.</p>
<h2>Los sobrinos y los 21 años</h2>
<p>En una fila de más de una década, un sobrino de 9 años al presentar la petición puede tener más de 21 en la entrevista. La ley CSPA resta el tiempo que el I-130 estuvo pendiente y exige buscar la residencia dentro de un año; la ${h.a('guide-cspa', 'guía CSPA')} hace la cuenta. Si un sobrino queda fuera, no hay categoría de tío a sobrino: tendría que pedirlo su padre una vez que sea residente.</p>
<h2>Trámite y pronóstico</h2>
<p>${nbc ? `USCIS indica de ${h.num(nbc.min ?? 0, 1)} a ${h.num(nbc.max ?? 0, 1)} meses para este I-130 en el Centro Nacional de Beneficios. ` : ''}Casi todos los hermanos terminan por trámite consular (${h.a('consular-processing-cost', 'costos')}). Con dos años de atraso, el rango de nuestro pronóstico acertó ${h.pct(bt24.coverage)} de las veces en nuestra prueba retrospectiva de 2012 a 2025; por eso la calculadora muestra un rango y no un mes.</p>`,
  },
});
