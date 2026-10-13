import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { centerRows, kindById } from '../../lib/engine/ptimes';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const fad = cellAt('F2A', 'ROW', 'FAD');
const dff = cellAt('F2A', 'ROW', 'DFF');
const mx = cellAt('F2A', 'MX', 'FAD');
const ph = cellAt('F2A', 'PH', 'FAD');
const f2bRow = cellAt('F2B', 'ROW', 'FAD');
const oct2018 = cellAt('F2A', 'ROW', 'FAD', MONTHS.indexOf('2018-10'));
const oct2025 = cellAt('F2A', 'ROW', 'FAD', MONTHS.indexOf('2025-10'));
const move = moveDays('F2A', 'ROW') ?? 0;
const bt12 = backtestCell('F2A', 'ROW', 12)!;
const bt6 = backtestCell('F2A', 'ROW', 6)!;
const retro = retrogressions('F2A', 'ROW');
const nbc = centerRows(kindById('i130f2a')!).find((r) => r.office === 'NBC');
// Plus longue période « Current » du tableau Final Action, et depuis quand le tableau Dates for Filing est « C ».
function longestRun(chart: 'FAD' | 'DFF') {
  let best = { from: '', to: '', n: 0 }, start = -1;
  for (let i = 0; i <= MONTHS.length; i++) {
    const c = i < MONTHS.length && cellAt('F2A', 'ROW', chart, i) === 'C';
    if (c && start < 0) start = i;
    if (!c && start >= 0) { if (i - start > best.n) best = { from: MONTHS[start], to: MONTHS[i - 1], n: i - start }; start = -1; }
  }
  return best;
}
const run = longestRun('FAD');
let dffSince = MONTHS.length - 1;
while (dffSince > 0 && cellAt('F2A', 'ROW', 'DFF', dffSince - 1) === 'C') dffSince--;
const dffCurrentNow = dff === 'C';
const DAY = 86_400_000;
const months = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / (30.4375 * DAY));
const latestDay = `${MONTHS[MONTHS.length - 1]}-01`;
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');
const mxGap = months(mx, fad);
const behindDays = Math.round((Date.parse(latestDay) - Date.parse(fad)) / DAY);
const behindEn = behindDays < 62 ? `${behindDays} days` : `${months(fad, latestDay)} months`;
const behindEs = behindDays < 62 ? `${behindDays} días` : `${months(fad, latestDay)} meses`;

export default definePage({
  id: "f2a", group: "family", order: 101,
  tool: {"kind": "greencard", "cat": "F2A", "country": "ROW"},
  data: {"cat": "F2A", "country": "ROW"},
  related: ["f2a-mexico", "guide-cspa", "i-130-processing-time", "marriage-green-card-cost", "guide-priority-date"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form", "cspaPolicy", "ina203", "vbOct2026"],
  en: {
    path: "family/f2a",
    nav: 'F2A (spouse or child of resident)', card: 'Spouses and children under 21 of green card holders: the shortest family line, often current on the filing chart.',
    title: 'F2A Visa Bulletin 2026: Green Card Holder Spouse Wait',
    description: 'F2A for spouses and minor children of permanent residents: this month’s cutoff, why the filing chart is often current, Mexico’s line and the age-21 rule.',
    h1: 'F2A: spouse or minor child of a green card holder',
    intro: 'Enter the priority date from the I-130 your green card holder spouse or parent filed to see where it stands on both charts this month.',
    resume: `F2A covers the spouse and the unmarried children under 21 of a lawful permanent resident, and it is the shortest preference queue in the family table. The current Final Action Date for most countries is ${en(fad)}, only ${behindEn} behind the bulletin itself, and the Dates for Filing chart reads ${en(dff)}${dffCurrentNow ? ', meaning anyone with a filed I-130 is past that cutoff' : ''}. Mexico has its own, slightly slower date of ${en(mx)}; the Philippines share the worldwide date (${en(ph)}). The category was fully current from ${monthName(run.from, 'en')} to ${monthName(run.to, 'en')}, then fell back by about ${Math.round(retro.worstMonths)} months in ${monthName(retro.worstAt, 'en')}. A year ago the worldwide date was ${en(oct2025)}. Our forecast for someone twelve months behind missed by a median of ${bt12.medianError} months from 2012 to 2025, and its range held the real date ${Math.round(bt12.coverage * 100)}% of the time.`,
    faqs: [
      { q: 'Why is F2A so much faster than the other family categories?', a: 'F2A receives most of the second-preference numbers, and the Visa Bulletin explains that 75% of the F2A numbers are exempt from the per-country limit. Demand is also cut short each time a petitioner naturalizes, because the spouse and minor children then leave the queue as immediate relatives. The result is a line counted in months or a few years, not decades.' },
      { q: 'What happens to F2A if my green card holder spouse becomes a citizen?', a: 'The petition converts automatically: the spouse and any children still under 21 become immediate relatives of a U.S. citizen, with no Visa Bulletin cutoff at all. The priority date no longer matters for them. A child who is already 21 or older at that moment converts to F1 instead, because only minor children are immediate relatives.' },
      { q: 'Does an F2A child who turns 21 lose the place in line?', a: 'Not necessarily. Under the Child Status Protection Act, the child’s age is frozen at the age when the Final Action Date became current, minus the time the I-130 was pending, provided the child seeks the green card within one year. If that CSPA age is still 21 or more, the case moves to F2B with the same priority date.' },
      { q: 'Can a spouse in the U.S. file the I-485 now under F2A?', a: 'When USCIS designates the Dates for Filing chart for family cases and that chart shows the F2A cell as current, a spouse living in the United States in a status that allows adjustment can file Form I-485 without waiting for the priority date. The final approval still needs the Final Action Date. USCIS states the chart in force on its filing-charts page each month.' },
    ],
    body: (h) => `
<h2>The family this category serves</h2>
<p>An F2A case usually starts with a marriage to someone who already holds a green card, or with a resident parent sending for children who stayed in the home country. The resident files ${h.src('i130Form', 'Form I-130')}, the receipt date becomes the ${h.a('guide-priority-date', 'priority date')}, and the spouse’s own children under 21 can come as derivatives on the same petition. Marrying a U.S. citizen is a different track, with no queue: see the ${h.a('marriage-green-card-cost', 'marriage green card costs')}.</p>
<h2>Current for almost four years, then the August 2023 drop</h2>
<p>F2A was listed as current on the Final Action chart from ${h.month(run.from)} to ${h.month(run.to)}, ${h.num(run.n)} bulletins in a row, after sitting at ${h.cell(oct2018)} in October 2018. The bill came in ${h.month(retro.worstAt)}, when the cutoff lost about ${h.num(Math.round(retro.worstMonths))} months in a single bulletin, the largest of the ${h.num(retro.n)} retrogressions recorded since 2001. Recovery has been steady: ${h.cell(oct2025)} a year ago, ${h.cell(fad)} today, ${move === 0 ? 'unchanged in the latest bulletin' : `with the latest bulletin moving it ${h.num(Math.abs(Math.round(move)))} days ${move > 0 ? 'forward' : 'backward'}`}.</p>
<h2>The filing chart is the real news</h2>
<p>${dffCurrentNow ? `The Dates for Filing chart has shown F2A as current since ${h.month(MONTHS[dffSince])}.` : `The Dates for Filing chart reads ${h.cell(dff)} this month.`} In a month when USCIS designates that chart for family cases, as it does now on its ${h.src('aosCharts', 'filing-charts page')}, a spouse in the United States who is eligible to adjust can submit Form I-485 and ask for a work permit while the Final Action Date catches up.</p>
<h2>Mexico and the per-country rule</h2>
<p>The ${h.src('vbOct2026', 'Visa Bulletin')} states that 75% of F2A numbers are exempt from the per-country limit, which keeps Mexico close to the rest: ${h.cell(mx)} against ${h.cell(fad)}, about ${h.num(Math.abs(mxGap))} months apart. The Philippines use the worldwide date. Country of birth decides the column, so a Mexican-born wife of a resident from Texas waits on the Mexico line, wherever she lives today. The ${h.a('f2a-mexico', 'F2A Mexico page')} tracks that gap month by month.</p>
<h2>Turning 21, naturalizing, marrying</h2>
<ul>
<li>A child who reaches 21 may keep F2A through the ${h.a('guide-cspa', 'CSPA age calculation')}; otherwise the case drops to F2B, today at ${h.cell(f2bRow)}.</li>
<li>When the resident naturalizes, spouse and minor children become immediate relatives and leave the queue.</li>
<li>A child who marries while the parent is still a resident has no category left: residents cannot petition for married children.</li>
</ul>
<p>${nbc ? `USCIS lists ${h.num(nbc.min ?? 0, 1)} to ${h.num(nbc.max ?? 0, 1)} months at the National Benefits Center for this I-130 type. ` : ''}At six months behind the cutoff, our back-test missed by a median of ${h.num(bt6.medianError)} months.</p>`,
  },
  es: {
    path: "familia/f2a",
    nav: 'F2A (cónyuge de residente)', card: 'Esposa, esposo o hijos menores de 21 de un residente permanente: la fila familiar más corta, a menudo al día.',
    title: 'F2A boletín de visas 2026: esposa o hijo de residente',
    description: 'F2A para cónyuge e hijos menores de 21 de un residente permanente: fecha del mes, por qué la tabla para presentar suele estar al día y qué pasa a los 21.',
    h1: 'F2A: cuando un residente pide a su esposa o a sus hijos menores',
    intro: 'Escriba la fecha de prioridad del I-130 que presentó su esposo, esposa o padre residente y vea las dos tablas del mes.',
    resume: `La categoría F2A es para el cónyuge y los hijos solteros menores de 21 años de un residente permanente legal (lawful permanent resident), y es la fila más corta de todo el cuadro familiar. Para quien nació en El Salvador, Guatemala, Honduras, Filipinas o cualquier país sin columna propia, la fecha de acción final (Final Action Date) es ${es(fad)}, apenas ${behindEs} detrás del boletín, y la tabla de fechas para presentar (Dates for Filing) marca ${es(dff)}. Para los nacidos en México la fecha es ${es(mx)}. Entre ${monthName(run.from, 'es')} y ${monthName(run.to, 'es')} la categoría estuvo al día (Current) sin interrupción, y luego retrocedió unos ${Math.round(retro.worstMonths)} meses de golpe en ${monthName(retro.worstAt, 'es')}. Si el residente se hace ciudadano, su cónyuge y sus hijos menores salen de la fila. Con doce meses de atraso, nuestro pronóstico falló por una mediana de ${bt12.medianError} meses entre 2012 y 2025.`,
    faqs: [
      { q: '¿Qué gana mi esposa en F2A si yo me hago ciudadano?', a: 'La petición se convierte sola: su esposa y sus hijos menores de 21 pasan a ser familiares inmediatos (immediate relatives) de un ciudadano, sin fecha de corte ni espera de boletín. No hace falta un nuevo I-130. Un hijo que ya tenga 21 años o más en ese momento pasa a F1, no a familiar inmediato.' },
      { q: '¿Mi hijo pierde la F2A si cumple 21 años mientras esperamos?', a: 'No siempre. La ley CSPA calcula una edad protegida: la edad cuando la fecha de acción final se puso al día, menos el tiempo que el I-130 estuvo pendiente, siempre que su hijo busque la residencia dentro de un año. Si esa edad queda en 21 o más, el caso pasa a F2B con la misma fecha de prioridad.' },
      { q: '¿Qué significa que la F2A esté al día en la tabla para presentar?', a: 'Que, en los meses en que USCIS ordena usar la tabla de fechas para presentar en casos familiares, un cónyuge que vive en Estados Unidos y cumple los requisitos del ajuste de estatus puede entregar el formulario I-485 sin esperar su fecha. La aprobación final sigue dependiendo de la fecha de acción final.' },
      { q: '¿Puede un residente pedir a un hijo casado en la categoría F2A?', a: 'No. Un residente permanente solo puede pedir a su cónyuge, a sus hijos menores de 21 (F2A) y a sus hijos solteros de 21 o más (F2B). Si un hijo se casa mientras el padre sigue siendo residente, la petición deja de tener categoría. Al hacerse ciudadano, el padre sí puede pedir a un hijo casado en F3.' },
    ],
    body: (h) => `
<h2>Una boda después de la tarjeta verde</h2>
<p>La historia de F2A suele ser esta: él consiguió la residencia por su trabajo o por su familia, luego se casó, y ahora pide a su esposa, o a los niños que se quedaron con la abuela en Santa Ana o en Quetzaltenango. Usted presenta el ${h.src('i130Form', 'formulario I-130')}, el día de recibo se vuelve la ${h.a('guide-priority-date', 'fecha de prioridad')} y los hijos menores de 21 de su esposa pueden venir como derivados en la misma petición.</p>
<h2>Casi al día, otra vez</h2>
<p>La fecha general está en ${h.cell(fad)}; hace un año estaba en ${h.cell(oct2025)}. ${move === 0 ? 'El último boletín la dejó sin cambio.' : `El último boletín la movió ${h.num(Math.abs(Math.round(move)))} días ${move > 0 ? 'hacia adelante' : 'hacia atrás'}.`} La categoría estuvo al día ${h.num(run.n)} boletines seguidos, de ${h.month(run.from)} a ${h.month(run.to)}, y en ${h.month(retro.worstAt)} cayó de golpe unos ${h.num(Math.round(retro.worstMonths))} meses: muchas familias que ya tenían cita tuvieron que volver a esperar. Por eso, aunque hoy falte poco, conviene revisar cada boletín.</p>
<h2>Lo que puede hacer este mes desde Estados Unidos</h2>
<p>${dffCurrentNow ? `La tabla de fechas para presentar marca a la F2A como al día desde ${h.month(MONTHS[dffSince])}.` : `La tabla de fechas para presentar marca ${h.cell(dff)} este mes.`} Cuando USCIS indica en su ${h.src('aosCharts', 'página de tablas')} que se usa esa tabla para casos familiares, como ahora, un cónyuge que está en Estados Unidos y puede hacer el ajuste de estatus (adjustment of status) entrega el I-485 y pide permiso de trabajo mientras espera la fecha final. Quien vive fuera sigue por trámite consular. ${nbc ? `Para este tipo de I-130, USCIS indica de ${h.num(nbc.min ?? 0, 1)} a ${h.num(nbc.max ?? 0, 1)} meses en el Centro Nacional de Beneficios.` : ''}</p>
<h2>México va un poco detrás</h2>
<p>El boletín explica que el 75 % de los números de F2A no está sujeto al límite por país, por eso México va cerca del resto: ${h.cell(mx)} frente a ${h.cell(fad)}, unos ${h.num(Math.abs(mxGap))} meses de diferencia. Si su esposa o sus hijos nacieron en México, vea la página ${h.a('f2a-mexico', 'F2A México')}.</p>
<h2>Los niños que se acercan a los 21</h2>
<p>Es la preocupación más común en esta categoría. Si su hijo cumple 21 antes de recibir la visa, la ${h.a('guide-cspa', 'calculadora CSPA')} dice si conserva la F2A. Si no, el caso pasa a F2B, hoy en ${h.cell(f2bRow)}, varios años más atrás. Hacerse ciudadano antes de que el hijo cumpla 21 lo convierte en familiar inmediato. Para su caso concreto, consulte a un abogado de inmigración o a un representante acreditado por el Departamento de Justicia.</p>`,
  },
});
