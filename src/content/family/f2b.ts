import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, MONTHS } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { centerRows, kindById } from '../../lib/engine/ptimes';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const at = (cat: 'F1' | 'F2B', c: 'ROW' | 'MX' | 'PH', ym?: string) => cellAt(cat, c, 'FAD', ym ? MONTHS.indexOf(ym) : undefined);
const fad = at('F2B', 'ROW');
const dff = cellAt('F2B', 'ROW', 'DFF');
const mx = at('F2B', 'MX');
const ph = at('F2B', 'PH');
const f1row = at('F1', 'ROW');
const f1mx = at('F1', 'MX');
const f1ph = at('F1', 'PH');
const oct2021 = at('F2B', 'ROW', '2021-10');
const oct2023 = at('F2B', 'ROW', '2023-10');
const oct2025 = at('F2B', 'ROW', '2025-10');
const move = moveDays('F2B', 'ROW') ?? 0;
const bt12 = backtestCell('F2B', 'ROW', 12)!;
const bt24 = backtestCell('F2B', 'ROW', 24)!;
const retro = retrogressions('F2B', 'ROW');
const nbc = centerRows(kindById('i130f2b')!).find((r) => r.office === 'NBC');
// Le plus grand bond d'un bulletin à l'autre sur les douze derniers mois.
let jump = 0, jumpAt = MONTHS[MONTHS.length - 1];
for (let i = MONTHS.length - 12; i < MONTHS.length; i++) {
  const d = moveDays('F2B', 'ROW', 'FAD', i) ?? 0;
  if (d > jump) { jump = d; jumpAt = MONTHS[i]; }
}
const DAY = 86_400_000;
const months = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / (30.4375 * DAY));
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');
const cmp = (a: string, b: string, l: 'en' | 'es') => (a > b ? (l === 'en' ? 'ahead' : 'por delante') : a < b ? (l === 'en' ? 'behind' : 'por detrás') : (l === 'en' ? 'level' : 'igual'));

export default definePage({
  id: "f2b", group: "family", order: 102,
  tool: {"kind": "greencard", "cat": "F2B", "country": "ROW"},
  data: {"cat": "F2B", "country": "ROW"},
  related: ["f2b-mexico", "f2b-philippines", "guide-f2b-to-f1", "i-130-processing-time", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form", "cspaPolicy", "legalHelp"],
  en: {
    path: "family/f2b",
    nav: 'F2B (adult child of resident)', card: 'Unmarried sons and daughters 21+ of green card holders: the cutoff, the 2026 jump, and the F1 conversion question.',
    title: 'F2B Visa Bulletin 2026: Adult Child of a Resident Wait',
    description: 'F2B for unmarried sons and daughters 21 or older of permanent residents: Final Action Date, filing chart, Mexico and Philippines lines, and the F1 opt-out.',
    h1: 'F2B: unmarried son or daughter, 21 or older, of a green card holder',
    intro: 'Enter the priority date of the I-130 your resident parent filed to see how far it sits from the F2B cutoff and what the past says about the wait.',
    resume: `F2B is the family preference for the unmarried sons and daughters, 21 or older, of lawful permanent residents. In the latest bulletin the Final Action Date for most countries is ${en(fad)} and the Date for Filing is ${en(dff)}. Mexico waits on a separate line at ${en(mx)}, the Philippines at ${en(ph)}. The worldwide date was frozen at ${en(oct2021)} from October 2021 to October 2023, reached ${en(oct2025)} a year ago, and gained ${Math.round(jump)} days in the single bulletin of ${monthName(jumpAt, 'en')}. Since 2001 it has gone backwards only ${retro.n} time${retro.n === 1 ? '' : 's'}, the steadiest record among the worldwide family columns. F2B is also the category that changes when the parent naturalizes: it becomes F1, today at ${en(f1row)} worldwide, and the beneficiary may ask to stay in F2B when that is the faster line. Our twelve-month forecast missed by a median of ${bt12.medianError} months in the 2012 to 2025 back-test.`,
    faqs: [
      { q: 'Who is eligible for the F2B category?', a: 'A son or daughter of a lawful permanent resident who is 21 or older and has never married, or is no longer married, when the visa is issued. The resident parent files Form I-130. Children under 21 of the beneficiary can join as derivatives. A child who was in F2A and aged out without CSPA protection also lands here with the original priority date.' },
      { q: 'What happens to an F2B petition if the beneficiary marries?', a: 'It ends. A green card holder has no category for a married son or daughter, so the petition is automatically revoked on marriage. If the parent later becomes a U.S. citizen, a new petition in F3 is possible, but it takes a new priority date. That is the main difference with F1, where marriage only converts the case to F3.' },
      { q: 'Should an F2B beneficiary opt out of conversion to F1?', a: 'We do not advise on individual cases. The rule is that F2B converts to F1 when the parent naturalizes, and the beneficiary can request in writing to remain in F2B. Whether that helps depends on the two cutoffs for the country of birth, which this page and the F2B to F1 guide show each month. An immigration attorney can review the decision.' },
      { q: 'How long does USCIS take on an F2B I-130?', a: 'USCIS publishes a range for this I-130 subtype at the National Benefits Center and at other directorates, updated monthly; the I-130 processing time page shows it. For F2B the petition time is rarely the bottleneck, because the visa number is usually years away. Approval of the I-130 does not let the beneficiary immigrate before the Final Action Date.' },
    ],
    body: (h) => `
<h2>Who waits in F2B</h2>
<p>The resident parent with a grown, single child: a daughter who was 24 when her father got his green card, or a son who started in F2A and turned 21 before his number came. Both stand here. The ${h.src('i130Form', 'Form I-130')} receipt date is the ${h.a('guide-priority-date', 'priority date')}, and the beneficiary’s own unmarried children under 21 travel on the same case. Most F2B beneficiaries live abroad and finish at a U.S. consulate, so the State Department fees in the ${h.a('consular-processing-cost', 'consular processing cost')} breakdown apply. A son or daughter already in the United States in a status that allows adjustment can file Form I-485 when the Date for Filing, ${h.cell(dff)} this month, passes the priority date and USCIS designates that chart.</p>
<h2>Two years without a move, then a leap</h2>
<p>The worldwide F2B date read ${h.cell(oct2021)} in October 2021 and exactly the same, ${h.cell(oct2023)}, in October 2023. Families who checked every month for two years saw nothing. It had reached ${h.cell(oct2025)} by October 2025, and the bulletin of ${h.month(jumpAt)} carried it ${h.num(Math.round(jump))} days forward at once, to today’s ${h.cell(fad)}. ${move === 0 ? 'The latest bulletin left it unchanged.' : `The latest bulletin moved it ${h.num(Math.abs(Math.round(move)))} days ${move > 0 ? 'forward' : 'backward'}.`} F2B has retrogressed only ${h.num(retro.n)} time${retro.n === 1 ? '' : 's'} since 2001 (about ${h.num(Math.round(retro.worstMonths))} months in ${h.month(retro.worstAt)}): it stalls, but it rarely goes back.</p>
<h2>Three columns, three waits</h2>
${h.table(['Born in', 'F2B cutoff', 'F1 cutoff', 'F2B against F1'], [
  ['Most countries', h.cell(fad), h.cell(f1row), cmp(fad, f1row, 'en')],
  ['Mexico', h.cell(mx), h.cell(f1mx), cmp(mx, f1mx, 'en')],
  ['Philippines', h.cell(ph), h.cell(f1ph), cmp(ph, f1ph, 'en')],
], `Final Action Dates, ${h.month(MONTHS[MONTHS.length - 1])} Visa Bulletin`)}
<p>The last column is the one families watch when a resident parent is about to naturalize. Where F2B is ahead, conversion to F1 would push the case back, and the law lets the son or daughter request to stay in F2B; the ${h.a('guide-f2b-to-f1', 'F2B to F1 guide')} sets out the rule and the calculation. The ${h.a('f2b-mexico', 'F2B Mexico')} and ${h.a('f2b-philippines', 'F2B Philippines')} pages follow each line.</p>
<h2>What ends or changes the case</h2>
<ul>
<li><strong>Marriage</strong> revokes the petition: residents cannot sponsor married children.</li>
<li><strong>The parent’s naturalization</strong> converts it to F1 with the same priority date, unless the beneficiary opts out.</li>
<li><strong>A child under 21</strong> belongs in F2A, not here, and the ${h.a('guide-cspa', 'CSPA age')} decides which side of 21 counts.</li>
</ul>
<p>${nbc ? `USCIS lists ${h.num(nbc.min ?? 0, 1)} to ${h.num(nbc.max ?? 0, 1)} months for this I-130 type at the National Benefits Center. ` : ''}For a priority date two years behind the cutoff, our model’s range held the real outcome only ${h.pct(bt24.coverage)} of the time, so the calculator may answer “no reliable forecast” for long distances.</p>`,
  },
  es: {
    path: "familia/f2b",
    nav: 'F2B (hijo soltero de residente)', card: 'Hijos solteros de 21 años o más de un residente: la fecha del mes, el salto de 2026 y el paso a F1.',
    title: 'F2B boletín de visas 2026: hijo soltero de residente',
    description: 'F2B para hijos solteros de 21 años o más de un residente permanente: fecha de acción final, fecha para presentar, México, Filipinas y el paso a F1 del hijo.',
    h1: 'F2B: el hijo soltero mayor de 21 de un residente permanente',
    intro: 'Escriba la fecha de prioridad del I-130 que presentó su padre o su madre residente y vea cuánto le falta en la categoría F2B.',
    resume: `La categoría F2B es para los hijos e hijas solteros, de 21 años o más, de un residente permanente legal. En el boletín de visas (Visa Bulletin) más reciente, la fecha de acción final (Final Action Date) para los nacidos en Centroamérica, Sudamérica o cualquier país sin columna propia es ${es(fad)}, y la fecha para presentar (Date for Filing) es ${es(dff)}. Para un hijo nacido en México, la fila va en ${es(mx)}; en Filipinas, ${es(ph)}. La fecha general estuvo congelada en ${es(oct2021)} de octubre de 2021 a octubre de 2023 y luego dio un salto de ${Math.round(jump)} días en el boletín de ${monthName(jumpAt, 'es')}. Desde 2001 solo ha retrocedido ${retro.n} ${retro.n === 1 ? 'vez' : 'veces'}. Dos hechos cambian la petición: si el hijo se casa, se cancela; si el padre se hace ciudadano, pasa a F1 (hoy ${es(f1row)} en la columna general), y el hijo puede pedir quedarse en F2B si esa fila va más rápido.`,
    faqs: [
      { q: '¿Qué pasa con la petición F2B si mi hijo se casa?', a: 'Se cancela automáticamente. Un residente permanente no tiene categoría para pedir a un hijo casado. Si usted se hace ciudadano más adelante, podrá presentar un nuevo I-130 en F3, pero con una fecha de prioridad nueva, es decir, empezando la fila desde cero. Por eso muchas familias hablan de esto con un abogado de inmigración antes de una boda.' },
      { q: '¿Me conviene seguir en F2B cuando me hago ciudadano?', a: 'No le damos consejo sobre su caso. La regla es que la petición F2B pasa sola a F1 al naturalizarse el padre, y que el hijo puede pedir por escrito a USCIS seguir en F2B. Conviene o no según las dos fechas del país de nacimiento de su hijo, que esta página y la guía de F2B a F1 muestran cada mes.' },
      { q: '¿Un hijo que tenía F2A y cumplió 21 pasa a F2B?', a: 'Sí, si su edad calculada según la ley CSPA queda en 21 años o más. La petición se convierte a F2B y conserva la fecha de prioridad original, así que no vuelve al final de la fila. La calculadora CSPA del sitio hace la cuenta con la fecha de nacimiento, la del I-130 y la fecha en que la categoría se puso al día.' },
    ],
    body: (h) => `
<h2>Para quién es la F2B</h2>
<p>Piense en un padre que recibió la residencia hace unos años y tiene una hija de 26, soltera, que sigue en San Pedro Sula, o un hijo que estaba en F2A y cumplió 21 antes de que llegara su turno. Ambos están en F2B. El residente presenta el ${h.src('i130Form', 'formulario I-130')}; la fecha de recibo es la ${h.a('guide-priority-date', 'fecha de prioridad')}, y los hijos solteros menores de 21 del beneficiario vienen como derivados.</p>
<h2>Dos años quieta, después un salto</h2>
<p>En octubre de 2021 la fecha general era ${h.cell(oct2021)}, y en octubre de 2023 seguía igual: ${h.cell(oct2023)}. Dos años sin un solo día de avance. En octubre de 2025 ya marcaba ${h.cell(oct2025)}, y en ${h.month(jumpAt)} avanzó ${h.num(Math.round(jump))} días de una vez hasta ${h.cell(fad)}. A diferencia de otras categorías, la F2B casi nunca retrocede: ${h.num(retro.n)} ${retro.n === 1 ? 'vez' : 'veces'} desde 2001. Lo habitual es que se detenga meses enteros, no que vuelva atrás, así que una fecha alcanzada rara vez se pierde.</p>
<h2>La pregunta del día de la naturalización</h2>
<p>Cuando el padre residente se hace ciudadano, la petición de su hijo soltero pasa a F1. Compare las dos fechas según el país de nacimiento del hijo:</p>
${h.table(['País de nacimiento', 'F2B', 'F1', 'F2B frente a F1'], [
  ['Columna general', h.cell(fad), h.cell(f1row), cmp(fad, f1row, 'es')],
  ['México', h.cell(mx), h.cell(f1mx), cmp(mx, f1mx, 'es')],
  ['Filipinas', h.cell(ph), h.cell(f1ph), cmp(ph, f1ph, 'es')],
], `Fechas de acción final, boletín de ${h.month(MONTHS[MONTHS.length - 1])}`)}
<p>Si la F2B va por delante, el paso a F1 retrasaría el caso, y la ley permite que el hijo pida por escrito quedarse en F2B. La ${h.a('guide-f2b-to-f1', 'guía de F2B a F1')} explica la regla y hace el cálculo. Para un hijo nacido en México, vea la página ${h.a('f2b-mexico', 'F2B México')}.</p>
<h2>Antes de una boda</h2>
<p>Es el punto que más familias desconocen: casarse cancela la petición F2B. No pasa a otra categoría, como ocurre en F1, sino que termina. ${nbc ? `USCIS indica hoy de ${h.num(nbc.min ?? 0, 1)} a ${h.num(nbc.max ?? 0, 1)} meses para este tipo de I-130 en el Centro Nacional de Beneficios, y ese tiempo cuenta poco frente a los años de fila. ` : ''}Para una decisión así, busque a un abogado de inmigración o a un representante acreditado por el Departamento de Justicia (${h.src('legalHelp', 'lista oficial')}).</p>`,
  },
});
