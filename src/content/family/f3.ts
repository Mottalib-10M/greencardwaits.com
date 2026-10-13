import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { centerRows, kindById } from '../../lib/engine/ptimes';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const at = (cat: 'F1' | 'F3', c: 'ROW' | 'MX' | 'PH', ym?: string) => cellAt(cat, c, 'FAD', ym ? MONTHS.indexOf(ym) : undefined);
const fad = at('F3', 'ROW');
const dff = cellAt('F3', 'ROW', 'DFF');
const mx = at('F3', 'MX');
const ph = at('F3', 'PH');
const f1row = at('F1', 'ROW');
const oct2011 = at('F3', 'ROW', '2011-10');
const oct2021 = at('F3', 'ROW', '2021-10');
const oct2022 = at('F3', 'ROW', '2022-10');
const oct2025 = at('F3', 'ROW', '2025-10');
const move = moveDays('F3', 'ROW') ?? 0;
const bt12 = backtestCell('F3', 'ROW', 12)!;
const bt48 = backtestCell('F3', 'ROW', 48)!;
const retro = retrogressions('F3', 'ROW');
const nbc = centerRows(kindById('i130f3')!).find((r) => r.office === 'NBC');
let jump = 0, jumpAt = MONTHS[MONTHS.length - 1];
for (let i = MONTHS.length - 12; i < MONTHS.length; i++) {
  const d = moveDays('F3', 'ROW', 'FAD', i) ?? 0;
  if (d > jump) { jump = d; jumpAt = MONTHS[i]; }
}
const DAY = 86_400_000;
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * DAY);
const latestDay = `${MONTHS[MONTHS.length - 1]}-01`;
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');

export default definePage({
  id: "f3", group: "family", order: 103,
  tool: {"kind": "greencard", "cat": "F3", "country": "ROW"},
  data: {"cat": "F3", "country": "ROW"},
  related: ["f3-mexico", "f3-philippines", "guide-cspa", "i-130-processing-time", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form", "cspaPolicy", "cfr204_2", "cfr205_1", "vbOct2026", "famPref"],
  en: {
    path: "family/f3",
    nav: 'F3 (married son or daughter)', card: 'Married sons and daughters of U.S. citizens, with spouse and children: the cutoff, the 2026 leap and the long Mexico line.',
    title: 'F3 Visa Bulletin 2026: Married Son or Daughter Wait',
    description: 'F3 for married sons and daughters of U.S. citizens: this month’s Final Action Date, the filing chart, Mexico and Philippines lines, and the derivative children.',
    h1: 'F3: a U.S. citizen’s married son or daughter, and the whole family behind them',
    intro: 'Enter the priority date from the I-130 to see where an F3 case stands this month and what the record since 2001 suggests about the rest of the wait.',
    resume: `F3 is the family preference for the married sons and daughters of U.S. citizens, and it usually brings the largest households: the son or daughter, the spouse, and every unmarried child under 21. In the latest Visa Bulletin the Final Action Date for most countries is ${en(fad)} and the Date for Filing ${en(dff)}, so the line is about ${years(fad, latestDay).toFixed(1)} years long. Mexico sits at ${en(mx)}, one of the oldest cutoffs in the whole bulletin, and the Philippines at ${en(ph)}. The worldwide date did not move between October 2021 and October 2022 (${en(oct2022)}), stood at ${en(oct2025)} a year ago, and gained ${Math.round(jump)} days in the bulletin of ${monthName(jumpAt, 'en')} alone. Divorce returns the case to F1, today at ${en(f1row)}. For a priority date twelve months behind, our back-tested forecast missed by a median of ${bt12.medianError} months.`,
    faqs: [
      { q: 'Who can immigrate together in an F3 case?', a: 'The married son or daughter of a U.S. citizen is the principal beneficiary. The spouse and each unmarried child under 21 are derivatives: they need no petition of their own and share the priority date. A grandchild who turns 21 before the visa is issued drops off unless the Child Status Protection Act keeps the age below 21, which is a frequent problem in a line this long.' },
      { q: 'Does an F3 case change if the son or daughter divorces?', a: 'Yes. A divorced son or daughter of a U.S. citizen is unmarried again, so the petition moves to F1 with the same priority date if the beneficiary is 21 or older. The former spouse is no longer a derivative. The F1 worldwide date is usually ahead of F3, so the move tends to shorten the remaining wait.' },
      { q: 'Can a green card holder petition in the F3 category?', a: 'No. F3 exists only for the married children of U.S. citizens. A permanent resident parent cannot file for a married son or daughter at all, and an F2B petition is revoked if the beneficiary marries. Once the parent naturalizes, a new I-130 in F3 is possible, with the filing date of that new petition as the priority date.' },
    ],
    body: (h) => `
<h2>A queue for households, not individuals</h2>
<p>An F3 petition starts with one ${h.src('i130Form', 'Form I-130')} from the citizen parent for a married son or daughter. Every visa issued in the case, though, counts against the F3 numbers: the beneficiary’s spouse and each child under 21 take one too. That is why a single F3 priority date can represent four or five immigrants, and why the ${h.a('guide-cspa', 'CSPA age rule')} matters so much here: children born after the filing can grow past 21 during the wait.</p>
<h2>Fifteen years of slow progress, then a jump</h2>
<p>In October 2011 the worldwide cutoff was ${h.cell(oct2011)}. A decade later, in October 2021, it was ${h.cell(oct2021)}, and a year after that it had not moved at all. It reached ${h.cell(oct2025)} in October 2025. The bulletin of ${h.month(jumpAt)} then added ${h.num(Math.round(jump))} days in one step, and today’s date is ${h.cell(fad)}; ${move === 0 ? 'the latest bulletin left it unchanged' : `the latest bulletin moved it ${h.num(Math.abs(Math.round(move)))} days`}. F3 has retrogressed only ${h.num(retro.n)} times since 2001, most sharply by about ${h.num(Math.round(retro.worstMonths))} months in ${h.month(retro.worstAt)}.</p>
<h2>Mexico and the Philippines</h2>
<p>A married son born in Mexico waits on a separate line at ${h.cell(mx)}, some ${h.num(years(mx, fad), 1)} years behind the worldwide date; a married daughter born in the Philippines is at ${h.cell(ph)}. Country of birth of the beneficiary decides the column, and a derivative spouse born elsewhere can sometimes change it through cross-chargeability, explained in the ${h.a('guide-chargeability', 'chargeability guide')}. The ${h.a('f3-mexico', 'F3 Mexico')} and ${h.a('f3-philippines', 'F3 Philippines')} pages follow those two lines.</p>
<h2>What moves a case into or out of F3</h2>
<ul>
<li><strong>Marriage of an F1 beneficiary</strong> converts the case to F3 with the original priority date.</li>
<li><strong>Divorce or widowhood</strong> converts it back to F1 if the beneficiary is 21 or older, to immediate relative if under 21.</li>
<li><strong>A resident parent</strong> has no F3 at all; the category begins on naturalization.</li>
</ul>
<h2>Paperwork while the date is far</h2>
<p>${nbc ? `USCIS lists ${h.num(nbc.min ?? 0, 1)} to ${h.num(nbc.max ?? 0, 1)} months at the National Benefits Center for this I-130 type. ` : ''}Most F3 families finish at a consulate abroad; the ${h.a('consular-processing-cost', 'consular processing costs')} are paid per person, which adds up in a family of five. A beneficiary already in the United States in a status that allows adjustment can instead file Form I-485 once the Date for Filing, ${h.cell(dff)} this month, is later than the priority date, in a month when USCIS designates that chart on its ${h.src('aosCharts', 'filing-charts page')}. For priority dates four years behind the cutoff, our back-test missed by a median of ${h.num(bt48.medianError)} months and the range caught ${h.pct(bt48.coverage)} of outcomes.</p>`,
  },
  es: {
    path: "familia/f3",
    nav: 'F3 (hijo casado de ciudadano)', card: 'Hijos casados de un ciudadano, con su cónyuge y sus hijos: la fecha del mes, el salto de 2026 y la fila de México.',
    title: 'F3 boletín de visas 2026: hijo casado de ciudadano',
    description: 'F3 para hijos casados de un ciudadano de EE. UU.: fecha de acción final, fecha para presentar, México y Filipinas, y qué pasa con los nietos que cumplen 21.',
    h1: 'F3: cuando un ciudadano pide a su hijo casado y viene toda la familia',
    intro: 'Escriba la fecha de prioridad del I-130 y vea en qué punto está la petición F3 de su hija o de su hijo casado este mes.',
    resume: `La categoría F3 es para los hijos e hijas casados de un ciudadano estadounidense, y con ellos vienen su cónyuge y sus hijos solteros menores de 21 años: el yerno, la nuera y los nietos. En el boletín de visas (Visa Bulletin) más reciente, la fecha de acción final (Final Action Date) para los nacidos en El Salvador, Guatemala, Honduras o cualquier país sin columna propia es ${es(fad)}, y la fecha para presentar (Date for Filing) es ${es(dff)}. Para un hijo nacido en México la fila es mucho más larga: ${es(mx)}, una de las fechas más antiguas de todo el boletín. En Filipinas va en ${es(ph)}. La fecha general estuvo en ${es(oct2022)} en octubre de 2022, sin avance en un año, y luego dio un salto de ${Math.round(jump)} días en ${monthName(jumpAt, 'es')}. Si su hijo se divorcia, la petición pasa a F1, hoy ${es(f1row)}. Con doce meses de atraso, nuestro pronóstico falló por una mediana de ${bt12.medianError} meses entre 2012 y 2025.`,
    faqs: [
      { q: '¿Los nietos vienen con la petición F3 de mi hija casada?', a: 'Sí, los hijos solteros menores de 21 de su hija vienen como derivados, igual que su esposo, sin petición propia y con la misma fecha de prioridad. El riesgo está en la edad: en una fila tan larga, un nieto puede cumplir 21 antes de la visa. La ley CSPA a veces lo protege; la calculadora CSPA del sitio hace la cuenta.' },
      { q: '¿Qué pasa con la F3 si mi hijo se divorcia?', a: 'La petición pasa a F1, hijo soltero de ciudadano, y conserva la fecha de prioridad si su hijo tiene 21 años o más. Su excónyuge deja de ser derivado. En la columna general la F1 suele ir por delante de la F3, así que el cambio suele acortar la espera. Para su caso, consulte a un abogado de inmigración.' },
      { q: '¿Siendo residente puedo pedir a mi hija casada en F3?', a: 'No. La categoría F3 existe solo para los hijos casados de ciudadanos. Un residente permanente no puede pedir a un hijo casado. Cuando usted se naturalice podrá presentar un I-130 en F3, y la fecha de prioridad será la de esa nueva petición. Por eso muchas familias calculan cuándo pueden pedir la ciudadanía.' },
    ],
    body: (h) => `
<h2>Una petición, toda una casa</h2>
<p>Usted es ciudadano y su hija está casada, con dos niños, en Usulután o en Cobán. Usted presenta un solo ${h.src('i130Form', 'formulario I-130')} por ella. Su esposo y sus hijos solteros menores de 21 vienen como derivados, cada uno con su propia visa dentro de la misma categoría. Por eso la F3 avanza despacio: detrás de cada fecha de prioridad hay a menudo cuatro o cinco personas.</p>
<h2>El problema de los nietos que crecen</h2>
<p>Con una fila de unos ${h.num(years(fad, latestDay), 0)} años en la columna general, un nieto que tenía 8 años al presentar la petición puede llegar a la entrevista con 20 o con 22. La ley CSPA resta a su edad el tiempo que el I-130 estuvo pendiente y exige que busque la residencia dentro de un año desde que la fecha se pone al día. La ${h.a('guide-cspa', 'guía CSPA')} explica el cálculo paso a paso.</p>
<h2>Cómo se ha movido la fecha</h2>
<p>La fecha general era ${h.cell(oct2011)} en octubre de 2011 y ${h.cell(oct2021)} en octubre de 2021: unos ${h.num(years(oct2011, oct2021), 0)} años de fechas de prioridad en diez años de calendario. En octubre de 2025 marcaba ${h.cell(oct2025)}; en ${h.month(jumpAt)} saltó ${h.num(Math.round(jump))} días y hoy está en ${h.cell(fad)}. ${move === 0 ? 'El último boletín la dejó sin cambio.' : `El último boletín la movió ${h.num(Math.abs(Math.round(move)))} días ${move > 0 ? 'hacia adelante' : 'hacia atrás'}.`} Desde 2001 solo ha retrocedido ${h.num(retro.n)} veces.</p>
<h2>Si su hijo nació en México</h2>
<p>La fila mexicana va en ${h.cell(mx)}, unos ${h.num(years(mx, fad), 1)} años detrás de la general, para la misma categoría. La página ${h.a('f3-mexico', 'F3 México')} cuenta esa historia, con sus retrocesos. Si el yerno o la nuera nació en otro país, la ${h.a('guide-chargeability', 'guía de imputación (chargeability)')} explica cuándo puede usarse su país.</p>
<h2>Divorcio, viudez y naturalización</h2>
<ul>
<li>Si su hijo se divorcia o enviuda, la petición pasa a F1 (21 años o más) o a familiar inmediato (menor de 21).</li>
<li>Si un hijo soltero en F1 se casa, pasa a F3 sin perder la fecha.</li>
<li>Un residente no tiene F3: la categoría empieza el día de la naturalización.</li>
</ul>
<p>${nbc ? `USCIS indica de ${h.num(nbc.min ?? 0, 1)} a ${h.num(nbc.max ?? 0, 1)} meses para este I-130 en el Centro Nacional de Beneficios. ` : ''}Casi todas las familias F3 terminan por trámite consular, con ${h.a('consular-processing-cost', 'costos por persona')}. Si su hijo ya vive en Estados Unidos con un estatus que permite el ajuste de estatus (adjustment of status), puede presentar el I-485 cuando la fecha para presentar, ${h.cell(dff)} este mes, pase su fecha de prioridad y USCIS indique esa tabla en su ${h.src('aosCharts', 'página de tablas')}.</p>`,
  },
});
