import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, evaluate, distinctShare, MONTHS } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const at = (c: 'ROW' | 'MX', ym?: string, chart: 'FAD' | 'DFF' = 'FAD') => cellAt('F2A', c, chart, ym ? MONTHS.indexOf(ym) : undefined);
const fad = at('MX');
const dff = at('MX', undefined, 'DFF');
const row = at('ROW');
const oct2025 = at('MX', '2025-10');
const row2025 = at('ROW', '2025-10');
const aug2022 = at('MX', '2022-08');
const rowAug2022 = at('ROW', '2022-08');
const move = moveDays('F2A', 'MX') ?? 0;
const bt12 = backtestCell('F2A', 'MX', 12)!;
const bt6 = backtestCell('F2A', 'MX', 6)!;
const retro = retrogressions('F2A', 'MX');
const before = cellAt('F2A', 'MX', 'FAD', MONTHS.indexOf(retro.worstAt) - 1);
const after = cellAt('F2A', 'MX', 'FAD', MONTHS.indexOf(retro.worstAt));
const share = distinctShare('F2A', 'MX');
const pdOneYear = `${Number(fad.slice(0, 4)) + 1}${fad.slice(4)}`;
const ex = evaluate('F2A', 'MX', pdOneYear);
const DAY = 86_400_000;
const months = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / (30.4375 * DAY));
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');
const gapNow = months(fad, row);
// Écart minimal (en années) entre les autres colonnes Mexique et leur colonne mondiale.
const otherGap = Math.floor(Math.min(...(['F1', 'F2B', 'F3', 'F4'] as const).map((c) => (Date.parse(cellAt(c, 'ROW', 'FAD')) - Date.parse(cellAt(c, 'MX', 'FAD'))) / (365.25 * DAY))));
const gap2025 = months(oct2025, row2025);
const yearGain = months(oct2025, fad);

export default definePage({
  id: "f2a-mexico", group: "family", order: 106, parent: "f2a",
  tool: {"kind": "greencard", "cat": "F2A", "country": "MX"},
  data: {"cat": "F2A", "country": "MX"},
  related: ["f2a", "country-mexico", "guide-cspa", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "vbOct2026", "cspaPolicy", "cfr204_2"],
  en: {
    path: "family/f2a/mexico",
    nav: 'F2A Mexico', card: 'Mexican-born spouses and minor children of green card holders: the one Mexico family line counted in months.',
    title: 'F2A Mexico Visa Bulletin 2026: Spouse of Resident Wait',
    description: 'F2A Mexico: the Final Action Date for Mexican-born spouses and children of permanent residents, the gap with other countries, and a back-tested forecast.',
    h1: 'F2A Mexico: spouse or child under 21 of a resident, born in Mexico',
    intro: 'Enter the priority date of the I-130 your resident spouse or parent filed to see where it stands against the Mexico F2A date this month.',
    resume: `For a spouse or unmarried child under 21 of a green card holder, born in Mexico, the F2A Final Action Date in the latest Visa Bulletin is ${en(fad)}. Applicants born elsewhere are at ${en(row)}, so Mexico trails by about ${gapNow} months, down from ${gap2025} months in October 2025. That gap is small by Mexican standards: every other Mexico family column trails its worldwide twin by ${otherGap} years or more. The reason is written in the bulletin, which exempts 75% of F2A numbers from the per-country limit. Mexico still has its own F2A date in ${Math.round(share * 100)}% of bulletins since October 2015. The Dates for Filing chart shows Mexico F2A as ${en(dff)}. Over the past twelve months the Mexican cutoff advanced about ${yearGain} months. This is also the only Mexico family case where our main model passed the back-test at one year behind: median error ${bt12.medianError} months, range right ${Math.round(bt12.coverage * 100)}% of the time from 2012 to 2025.`,
    faqs: [
      { q: 'Why does F2A Mexico have a date of its own if most numbers are exempt?', a: 'Because the exemption covers 75% of F2A numbers, not all of them. The remaining quarter is subject to the per-country limit, and Mexican demand is large enough to hit it. When that happens, Mexican-born applicants wait slightly longer than everyone else. In many months the two dates are identical or only weeks apart; in others Mexico trails by a year.' },
      { q: 'What happens to an F2A Mexico case when the resident spouse naturalizes?', a: 'The spouse and any children still under 21 become immediate relatives of a U.S. citizen. Immediate relatives have no Visa Bulletin cutoff and no Mexico column, so the remaining wait disappears and only processing time is left. A child who is 21 or older at the date of naturalization converts to F1 Mexico instead, a much longer line.' },
      { q: 'Did F2A Mexico stay current when the rest of the world did?', a: 'Almost. Both columns were current from July 2019, but in the August and September 2022 bulletins Mexico alone received a cutoff while every other country stayed current. Mexico returned to current in October 2022, and both columns retrogressed together in 2023. The episode shows how the non-exempt quarter of F2A numbers can split Mexico from the rest.' },
    ],
    body: (h) => `
<h2>The Mexico line that stays close to the rest</h2>
<p>Every other Mexico family column runs years or decades behind its worldwide twin. F2A does not, because the ${h.src('vbOct2026', 'Visa Bulletin')} exempts 75% of its numbers from the per-country limit. What remains is a gap of about ${h.num(gapNow)} months today: ${h.cell(fad)} for Mexico against ${h.cell(row)}. In October 2025 the gap was ${h.num(gap2025)} months (${h.cell(oct2025)} against ${h.cell(row2025)}). ${move === 0 ? 'The latest bulletin left the Mexican date unchanged.' : `The latest bulletin moved the Mexican date ${h.num(Math.abs(Math.round(move)))} days ${move > 0 ? 'forward' : 'backward'}.`}</p>
<h2>A short split in 2022</h2>
<p>From July 2019 the category was current for everyone. In ${h.month('2022-08')} Mexico alone was given a cutoff of ${h.cell(aug2022)}, while the rest of the world stayed at ${h.cell(rowAug2022)}; two bulletins later Mexico was current again. The heavier blow had come earlier, in ${h.month(retro.worstAt)}, when the Mexican F2A date fell from ${h.cell(before)} to ${h.cell(after)}, about ${h.num(Math.round(retro.worstMonths))} months in one bulletin. In all, Mexico F2A has retrogressed ${h.num(retro.n)} times since 2001.</p>
<h2>A forecast we are willing to show</h2>
<p>For F1 and F3 Mexico our back-test fails and the calculator prints no date. F2A Mexico is the one Mexican family line where the main model passes. Take a priority date of ${h.date(pdOneYear)}, a year after the cutoff: ${ex.reliable && ex.range?.[0] && ex.range?.[2] ? `the calculator puts the date becoming current between ${h.month(ex.range[0])} and ${h.month(ex.range[2])}.` : 'the calculator shows the distance and says there is no reliable forecast this month.'} At six months behind, the median error since 2012 was ${h.num(bt6.medianError)} months and the range caught ${h.pct(bt6.coverage)} of outcomes.</p>
<h2>Children near 21</h2>
<p>A Mexican-born child whose CSPA age stays under 21 keeps F2A; otherwise the case moves to F2B Mexico, a far older line. If the resident parent naturalizes while the child is still under 21, the child leaves the queue as an immediate relative and the Mexico column no longer applies. The ${h.a('guide-cspa', 'CSPA guide')} shows the calculation, and the ${h.a('f2a', 'F2A page')} compares Mexico with the worldwide column.</p>`,
  },
  es: {
    path: "familia/f2a/mexico",
    nav: 'F2A México', card: 'Esposa, esposo o hijos menores nacidos en México de un residente: la única fila mexicana que se cuenta en meses.',
    title: 'F2A México boletín de visas 2026: esposa de residente',
    description: 'F2A México: fecha de acción final para el cónyuge y los hijos menores de 21 nacidos en México de un residente, la diferencia con otros países y el pronóstico.',
    h1: 'F2A México: su esposa o sus hijos menores, nacidos en México',
    intro: 'Escriba la fecha de prioridad del I-130 que usted presentó como residente y vea cuánto le falta a su familia en la fila F2A de México.',
    resume: `Si usted es residente permanente y pidió a su esposa, a su esposo o a sus hijos solteros menores de 21 nacidos en México, la fecha de acción final (Final Action Date) del boletín de visas más reciente es ${es(fad)}. Para los nacidos en otros países es ${es(row)}: México va unos ${gapNow} meses detrás, cuando en octubre de 2025 la diferencia era de ${gap2025} meses. Es poco para México, donde las otras filas familiares van ${otherGap} años o más detrás de su columna general. La razón está en el boletín: el 75 % de los números de F2A no cuenta para el límite por país. La tabla de fechas para presentar (Dates for Filing) marca ${es(dff)} para México. En los últimos doce meses la fecha mexicana avanzó unos ${yearGain} meses. Es además el único caso familiar mexicano donde nuestro modelo principal pasó la prueba retrospectiva con un año de atraso: error mediano de ${bt12.medianError} meses entre 2012 y 2025. Si usted se hace ciudadano, su familia sale de la fila.`,
    faqs: [
      { q: '¿Mi esposa mexicana espera más en F2A que una esposa guatemalteca?', a: 'Normalmente un poco más. Tres cuartas partes de los números de F2A no están sujetas al límite por país, pero la cuarta parte restante sí, y la demanda mexicana lo alcanza. Por eso México tiene a veces su propia fecha, unos meses detrás de la general. Para una esposa nacida en Guatemala o en El Salvador se usa la columna general.' },
      { q: '¿Si me hago ciudadano, mi esposa sale de la fila F2A de México?', a: 'Sí. Al naturalizarse usted, su esposa y sus hijos menores de 21 pasan a ser familiares inmediatos (immediate relatives) de un ciudadano, sin fecha de corte ni columna de México. Solo queda el tiempo de trámite. Un hijo que ya tenga 21 años en ese momento pasa a F1 México, una fila mucho más larga.' },
      { q: '¿Qué pasa si mi hijo nacido en México cumple 21 durante la espera F2A?', a: 'La ley CSPA calcula su edad restando el tiempo que el I-130 estuvo pendiente, y pide que busque la residencia dentro de un año desde que la fecha se pone al día. Si esa edad queda por debajo de 21, sigue en F2A. Si no, pasa a F2B México con la misma fecha de prioridad, varios años más atrás.' },
    ],
    body: (h) => `
<h2>Casado con un residente, esperando en Jalisco</h2>
<p>Usted obtuvo la residencia, se casó en Guadalajara y presentó el I-130 por su esposa. Ella está en F2A, y como nació en México se usa la columna mexicana: ${h.cell(fad)} este mes, frente a ${h.cell(row)} para el resto del mundo. Unos ${h.num(gapNow)} meses de diferencia. Sus hijos menores de 21, si los tiene, pueden venir como derivados en la misma petición, con la misma fecha. ${move === 0 ? 'El último boletín dejó la fecha mexicana sin cambio.' : `El último boletín movió la fecha mexicana ${h.num(Math.abs(Math.round(move)))} días ${move > 0 ? 'hacia adelante' : 'hacia atrás'}.`}</p>
<h2>Por qué México va casi al par</h2>
<p>El ${h.src('vbOct2026', 'boletín de visas')} explica que el 75 % de los números de F2A no está sujeto al límite por país. Solo la cuarta parte restante cuenta para el tope de 7 %, y ahí México se queda corto. En agosto y septiembre de 2022, por ejemplo, solo México tuvo fecha de corte (${h.cell(aug2022)}) mientras el resto del mundo seguía al día. La caída más fuerte fue en ${h.month(retro.worstAt)}: de ${h.cell(before)} a ${h.cell(after)}, unos ${h.num(Math.round(retro.worstMonths))} meses de golpe.</p>
<h2>Lo que puede hacer este mes</h2>
<p>Si su esposa vive en Estados Unidos y cumple los requisitos del ajuste de estatus (adjustment of status), la tabla de fechas para presentar marca ${h.cell(dff)} para México, y USCIS indica cada mes en su ${h.src('aosCharts', 'página de tablas')} cuál se usa. Si vive en México, el caso sigue por trámite consular (${h.a('consular-processing-cost', 'costos')}).</p>
<h2>Un pronóstico que sí mostramos</h2>
<p>Para una fecha de prioridad un año detrás de la actual, ${ex.reliable && ex.range?.[0] && ex.range?.[2] ? `la calculadora estima que estará al día entre ${h.month(ex.range[0])} y ${h.month(ex.range[2])}.` : 'la calculadora muestra la distancia, pero este mes no da fecha.'} Con seis meses de atraso, el rango acertó ${h.pct(bt6.coverage)} de las veces desde 2012. En F1 y F3 México, en cambio, la calculadora no da fecha.</p>`,
  },
});
