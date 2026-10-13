import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { centerRows, kindById } from '../../lib/engine/ptimes';
import { cellText } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const at = (cat: 'F1' | 'F2B' | 'F3', c: 'ROW' | 'MX' | 'PH', ym?: string) => cellAt(cat, c, 'FAD', ym ? MONTHS.indexOf(ym) : undefined);
const fad = at('F1', 'ROW');
const dff = cellAt('F1', 'ROW', 'DFF');
const mx = at('F1', 'MX');
const ph = at('F1', 'PH');
const f3row = at('F3', 'ROW');
const f2bmx = at('F2B', 'MX');
const oct2016 = at('F1', 'ROW', '2016-10');
const oct2021 = at('F1', 'ROW', '2021-10');
const oct2022 = at('F1', 'ROW', '2022-10');
const oct2025 = at('F1', 'ROW', '2025-10');
const move = moveDays('F1', 'ROW') ?? 0;
const bt12 = backtestCell('F1', 'ROW', 12)!;
const bt24 = backtestCell('F1', 'ROW', 24)!;
const retro = retrogressions('F1', 'ROW');
const nbc = centerRows(kindById('i130f1')!).find((r) => r.office === 'NBC');
const DAY = 86_400_000;
const months = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / (30.4375 * DAY));
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * DAY);
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');
const gainYear = months(oct2025, fad);
const f3gap = months(f3row, fad);

export default definePage({
  id: "f1", group: "family", order: 100,
  tool: {"kind": "greencard", "cat": "F1", "country": "ROW"},
  data: {"cat": "F1", "country": "ROW"},
  related: ["f1-mexico", "f1-philippines", "guide-f2b-to-f1", "i-130-processing-time", "guide-priority-date"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form", "ina203"],
  en: {
    path: "family/f1",
    nav: 'F1 (adult son or daughter)', card: 'Unmarried sons and daughters 21+ of U.S. citizens: this month’s cutoff, the Mexico and Philippines lines, and the wait.',
    title: 'F1 Visa Bulletin 2026: Priority Date Cutoff and Wait',
    description: 'F1 category for unmarried adult children of U.S. citizens: Final Action Date, Date for Filing, Mexico and Philippines lines, history since 2001 and a forecast.',
    h1: 'F1: the queue for a U.S. citizen’s unmarried son or daughter',
    intro: 'Type the priority date printed on the I-130 receipt or approval notice to see where it sits against the F1 cutoff this month.',
    resume: `F1 is the family preference for the unmarried sons and daughters, aged 21 or older, of U.S. citizens. In the latest Visa Bulletin the Final Action Date for applicants born in most countries is ${en(fad)}, and the Date for Filing is ${en(dff)}. Two countries wait on their own, longer lines: Mexico at ${en(mx)} and the Philippines at ${en(ph)}. The worldwide date was ${en(oct2025)} a year earlier, so twelve bulletins carried it about ${gainYear} months forward, after a stretch in which it sat at ${en(oct2021)} for more than a year. Marriage before the green card moves the beneficiary to F3, whose worldwide date is ${en(f3row)}. Our back-test from October 2012 to October 2025 shows forecasts for a person twelve months behind the cutoff missed by a median of ${bt12.medianError} months, so the calculator gives a range, never a single month.`,
    faqs: [
      { q: 'Who qualifies for the F1 category of the Visa Bulletin?', a: 'A son or daughter of a U.S. citizen who is 21 or older and not married when the visa is issued. The citizen files Form I-130. The beneficiary’s own unmarried children under 21 can come along as derivatives with the same priority date, and a spouse cannot, because a married son or daughter belongs to F3 instead.' },
      { q: 'What happens to an F1 petition if my son gets married?', a: 'The petition does not disappear: it converts to F3, the married son or daughter of a U.S. citizen, and keeps its original priority date. The F3 line is usually further behind, so the wait grows. A spouse and children under 21 then become derivatives. If the marriage ends before the visa is issued, the case can return to F1.' },
      { q: 'Can an F2B case turn into F1 when the parent naturalizes?', a: 'Yes. When a green card holder parent becomes a U.S. citizen, an F2B petition for an unmarried son or daughter over 21 converts to F1 with the same priority date. Because the F1 line for some countries is slower than F2B, the law lets the beneficiary ask in writing to stay in F2B. Our F2B to F1 guide compares the two dates.' },
      { q: 'Does the F1 Date for Filing let me apply for a green card early?', a: 'Only when USCIS designates the Dates for Filing chart for family cases, which it publishes each month on its filing-charts page. In that month, an F1 beneficiary living in the United States in a status that allows adjustment can file Form I-485 once the priority date is earlier than that date. Approval still waits for the Final Action Date.' },
    ],
    body: (h) => `
<h2>Who stands in this line</h2>
<p>F1 is for a grown child of a U.S. citizen, 21 or older and single. The typical case is a parent who naturalized after years as a resident and then petitioned for a son or daughter who stayed abroad or aged past 21 while waiting in another category. The beneficiary’s own unmarried children under 21 ride on the same petition. ${h.a('guide-priority-date', 'The priority date')} is the day USCIS received the ${h.src('i130Form', 'Form I-130')}, and it is that date, not the approval, that is compared to the bulletin.</p>
<h2>A cutoff that stalled, then ran</h2>
<p>For most countries the cutoff was ${h.cell(oct2016)} in October 2016 and ${h.cell(oct2021)} in October 2021. It still read ${h.cell(oct2022)} a year later: no progress at all for a full fiscal year. It then crept to ${h.cell(oct2025)} by October 2025 and jumped to ${h.cell(fad)} in the current bulletin, roughly ${h.num(gainYear)} months of priority dates cleared in twelve months. ${move === 0 ? 'The latest bulletin left it unchanged.' : `The latest bulletin moved it ${h.num(Math.abs(Math.round(move)))} days ${move > 0 ? 'forward' : 'backward'}.`} Today’s line is about ${h.num(years(fad, `${MONTHS[MONTHS.length - 1]}-01`), 1)} years long. Since 2001 the worldwide F1 date has gone backwards ${h.num(retro.n)} times, the largest step being about ${h.num(Math.round(retro.worstMonths))} months in ${h.month(retro.worstAt)}.</p>
<h2>Mexico and the Philippines wait apart</h2>
<p>Because no country may take more than 7% of the preference visas in a year, heavy demand gives Mexico and the Philippines their own F1 column. A Mexican-born son is at ${h.cell(mx)}, a Filipino-born daughter at ${h.cell(ph)}. What matters is the beneficiary’s country of birth, not nationality or residence; the ${h.a('f1-mexico', 'F1 Mexico page')} and ${h.a('f1-philippines', 'F1 Philippines page')} follow those lines in detail. For Mexican-born children the F2B date (${h.cell(f2bmx)}) sits ${f2bmx > mx ? 'ahead of F1, so a resident parent’s naturalization can slow the case, which is what the opt-out in the ' + h.a('guide-f2b-to-f1', 'F2B to F1 guide') + ' is for' : 'behind F1 this month; the ' + h.a('guide-f2b-to-f1', 'F2B to F1 guide') + ' explains the opt-out for months when it is not'}.</p>
<h2>Events that move a case out of F1</h2>
<ul>
<li><strong>Marriage</strong> converts the petition to F3, today ${h.num(Math.abs(f3gap))} months ${f3gap >= 0 ? 'further back' : 'further ahead'} for most countries, at ${h.cell(f3row)}.</li>
<li><strong>Divorce or a spouse’s death</strong> after an F3 conversion can bring the case back to F1 with the same priority date.</li>
<li><strong>Being under 21</strong> is not F1 at all: a citizen’s unmarried child under 21 is an immediate relative with no queue.</li>
</ul>
<h2>Before the bulletin: USCIS time on the I-130</h2>
<p>${nbc ? `At the National Benefits Center, USCIS currently lists ${h.num(nbc.min ?? 0, 1)} to ${h.num(nbc.max ?? 0, 1)} months for this I-130 subtype (citizen for an unmarried son or daughter 21 or older). ` : ''}A long I-130 is rarely what delays an F1 case, because the visa number itself is years away; see ${h.a('i-130-processing-time', 'I-130 processing times')}. Our back-test for a priority date two years behind the worldwide cutoff missed by a median of ${h.num(bt24.medianError)} months, with the range catching the real outcome ${h.pct(bt24.coverage)} of the time.</p>`,
  },
  es: {
    path: "familia/f1",
    nav: 'F1 (hijo soltero mayor)', card: 'Hijos solteros de 21 años o más de un ciudadano: la fecha del mes, las filas de México y Filipinas, y la espera.',
    title: 'F1 boletín de visas 2026: hijo soltero de ciudadano',
    description: 'Categoría F1 para hijos solteros de 21 años o más de un ciudadano de EE. UU.: fecha de acción final, fecha para presentar, México, Filipinas y la espera.',
    h1: 'F1: cuando un ciudadano pide a su hijo soltero mayor de 21',
    intro: 'Escriba la fecha de prioridad del aviso de recibo del I-130 y vea si su hijo o hija ya está al día en la categoría F1 este mes.',
    resume: `La categoría F1 es para el hijo o la hija soltera, de 21 años o más, de un ciudadano estadounidense. En el boletín de visas (Visa Bulletin) más reciente, la fecha de acción final (Final Action Date) para quien nació en El Salvador, Guatemala, Honduras o cualquier país sin columna propia es ${es(fad)}; la fecha para presentar (Date for Filing) es ${es(dff)}. Si su hijo nació en México, la fila es otra y mucho más lenta: ${es(mx)}. En Filipinas va en ${es(ph)}. Un año antes, la fecha general estaba en ${es(oct2025)}, de modo que avanzó unos ${gainYear} meses en doce boletines. Si su hijo se casa antes de recibir la visa, la petición pasa a F3, cuya fecha general es ${es(f3row)}. Por eso nuestra calculadora muestra un rango y nunca promete un mes: con doce meses de atraso, el pronóstico falló por una mediana de ${bt12.medianError} meses entre 2012 y 2025.`,
    faqs: [
      { q: '¿Quién entra en la categoría F1 si soy ciudadano y pido a mi hijo?', a: 'Su hijo o hija de 21 años o más que siga soltero hasta que se emita la visa. Usted presenta el formulario I-130. Los hijos solteros menores de 21 de su hijo pueden venir como derivados con la misma fecha de prioridad. Un yerno o una nuera no: si su hijo está casado, la categoría es F3.' },
      { q: '¿Mi hijo pierde su lugar en F1 si se casa antes de la entrevista?', a: 'No pierde la fecha de prioridad, pero la petición cambia de F1 a F3 (hijo casado de ciudadano), que suele avanzar más despacio. Su cónyuge y sus hijos menores de 21 pasan a ser derivados. Antes de tomar decisiones con efectos así, conviene consultar a un abogado de inmigración o a un representante acreditado por el Departamento de Justicia.' },
      { q: '¿Un hijo nacido en El Salvador usa la fecha general de F1?', a: 'Sí. En las categorías familiares, El Salvador, Guatemala y Honduras no tienen columna propia en el boletín, así que usan la columna general (All Chargeability Areas). Lo que cuenta es el país de nacimiento del beneficiario, no la nacionalidad del padre que pide ni el lugar donde vive hoy la familia.' },
      { q: '¿Qué pasa con la petición F2B cuando el padre residente se hace ciudadano?', a: 'Pasa sola a F1 y conserva la fecha de prioridad. Para los nacidos en México, la fila F1 a veces va detrás de la F2B, y la ley permite pedir por escrito seguir en F2B. Nuestra guía de conversión de F2B a F1 compara las dos fechas del mes antes de que usted decida.' },
    ],
    body: (h) => `
<h2>La familia típica de F1</h2>
<p>Un padre o una madre que vivió años como residente permanente, se hizo ciudadano y ahora pide a una hija que ya cumplió 21 años, sigue soltera y quizá vive en San Salvador, en Tegucigalpa o en la misma ciudad que usted. Esa es la cara más común de la categoría F1. La ${h.a('guide-priority-date', 'fecha de prioridad (priority date)')} es el día en que USCIS recibió su ${h.src('i130Form', 'formulario I-130')}; esa fecha, y no la de aprobación, es la que se compara con el boletín cada mes.</p>
<h2>Columna general, columna de México</h2>
<p>Ningún país puede recibir más del 7 % de las visas de preferencia en un año. México y Filipinas lo superan, y por eso tienen columna propia. Para un hijo nacido en Guatemala, Honduras, El Salvador o Colombia, la fecha es ${h.cell(fad)}. Para un hijo nacido en México, ${h.cell(mx)}: unos ${h.num(years(mx, fad), 1)} años de diferencia en la misma categoría, con la misma petición. La página ${h.a('f1-mexico', 'F1 México')} sigue esa fila mes a mes.</p>
<h2>Un año que cambió el panorama</h2>
<p>La fecha general pasó de ${h.cell(oct2021)} en octubre de 2021 a ${h.cell(oct2022)} en octubre de 2022: cero avance en un año fiscal entero. En octubre de 2025 estaba en ${h.cell(oct2025)} y hoy en ${h.cell(fad)}. ${move === 0 ? 'El último boletín la dejó sin cambio.' : `El último boletín la movió ${h.num(Math.abs(Math.round(move)))} días ${move > 0 ? 'hacia adelante' : 'hacia atrás'}.`} Desde 2001 la fecha general ha retrocedido ${h.num(retro.n)} veces; los saltos grandes suelen pagarse después con meses de quietud.</p>
<h2>Tres cambios de vida que mueven la categoría</h2>
<ul>
<li><strong>Si su hijo se casa</strong>, la petición pasa a F3, hoy en ${h.cell(f3row)} para la columna general, unos ${h.num(Math.abs(f3gap))} meses ${f3gap >= 0 ? 'más atrás' : 'más adelante'} que F1.</li>
<li><strong>Si se divorcia o enviuda</strong> después, la petición puede volver a F1 sin perder la fecha.</li>
<li><strong>Si usted era residente cuando pidió</strong> y luego se naturalizó, la F2B se convierte en F1; vea la ${h.a('guide-f2b-to-f1', 'guía F2B a F1')}.</li>
</ul>
<h2>Presentar desde Estados Unidos</h2>
<p>Si su hijo vive en Estados Unidos con un estatus que le permita el ajuste de estatus (adjustment of status), puede presentar el formulario I-485 cuando USCIS indique que se usa la tabla de fechas para presentar, ${h.cell(dff)} este mes para la columna general; USCIS lo publica en su ${h.src('aosCharts', 'página de tablas')}. ${nbc ? `El Centro Nacional de Beneficios (National Benefits Center) indica hoy de ${h.num(nbc.min ?? 0, 1)} a ${h.num(nbc.max ?? 0, 1)} meses para este tipo de I-130. ` : ''}Si su hijo está fuera, el caso sigue por trámite consular. En ambos casos, la visa misma llega solo cuando la fecha de acción final alcanza la de su petición.</p>`,
  },
});
