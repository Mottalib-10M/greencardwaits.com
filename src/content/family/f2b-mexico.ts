import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, evaluate, MONTHS, type Cat } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const at = (cat: Exclude<Cat, 'IR'>, c: 'ROW' | 'MX', ym?: string) => cellAt(cat, c, 'FAD', ym ? MONTHS.indexOf(ym) : undefined);
const fad = at('F2B', 'MX');
const dff = cellAt('F2B', 'MX', 'DFF');
const row = at('F2B', 'ROW');
const f1mx = at('F1', 'MX');
const oct2016 = at('F2B', 'MX', '2016-10');
const oct2023 = at('F2B', 'MX', '2023-10');
const move = moveDays('F2B', 'MX') ?? 0;
const bt12 = backtestCell('F2B', 'MX', 12)!;
const retro = retrogressions('F2B', 'MX');
// Le plus grand recul de chaque catégorie familiale de México, pour comparer.
const worst = (['F1', 'F2A', 'F3', 'F4'] as const).map((c) => retrogressions(c, 'MX').worstMonths);
const othersMin = Math.round(Math.min(...worst));
// Combien de bulletins la date précédente est restée figée avant le dernier mouvement.
const L = MONTHS.length - 1;
const prev = cellAt('F2B', 'MX', 'FAD', L - 1);
let held = 0;
while (L - 1 - held >= 0 && cellAt('F2B', 'MX', 'FAD', L - 1 - held) === prev) held++;
const pdOneYear = `${Number(fad.slice(0, 4)) + 1}${fad.slice(4)}`;
const ex = evaluate('F2B', 'MX', pdOneYear);
const DAY = 86_400_000;
const months = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / (30.4375 * DAY));
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * DAY);
const octGain = (y: number) => months(at('F2B', 'MX', `${y - 1}-10`), at('F2B', 'MX', `${y}-10`));
const g24 = octGain(2024), g25 = octGain(2025), g26 = months(at('F2B', 'MX', '2025-10'), fad);
// Avance cumulé sur trois ans (octobre 2023 à aujourd'hui) de chaque catégorie familiale de México.
const three = (c: Exclude<Cat, 'IR'>) => months(at(c, 'MX', '2023-10'), at(c, 'MX'));
const mostThree = (['F1', 'F2A', 'F3', 'F4'] as const).every((c) => three(c) < three('F2B'));
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');
const aheadOfF1 = fad > f1mx;

export default definePage({
  id: "f2b-mexico", group: "family", order: 107, parent: "f2b",
  tool: {"kind": "greencard", "cat": "F2B", "country": "MX"},
  data: {"cat": "F2B", "country": "MX"},
  related: ["f2b", "country-mexico", "f1-mexico", "guide-f2b-to-f1", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "legalHelp"],
  en: {
    path: "family/f2b/mexico",
    nav: 'F2B Mexico', card: 'Mexican-born unmarried sons and daughters 21+ of green card holders: three fast years and a line now ahead of F1.',
    title: 'F2B Mexico Visa Bulletin 2026: Adult Child of Resident',
    description: 'F2B Mexico: Final Action Date for Mexican-born adult children of permanent residents, three years of fast movement, and why naturalizing can slow the case.',
    h1: 'F2B Mexico: a resident’s unmarried son or daughter, born in Mexico',
    intro: 'Enter the priority date from the I-130 your resident parent filed to compare it with the Mexico F2B cutoff and the F1 line it would convert to.',
    resume: `For an unmarried son or daughter, 21 or older, born in Mexico, whose parent holds a green card, the F2B Final Action Date in the latest Visa Bulletin is ${en(fad)} and the Date for Filing ${en(dff)}. The worldwide F2B date is ${en(row)}, about ${years(fad, row).toFixed(1)} years ahead. ${mostThree ? 'Over three years this line has gained more ground than any other Mexican family column' : 'This line has moved quickly over three years'}: about ${g24} months of progress in the year to October 2024, ${g25} in the year to October 2025 and ${g26} in the past twelve months, including ${Math.round(move)} days in the latest bulletin alone after ${held} bulletins without movement. It is also ${aheadOfF1 ? 'ahead of' : 'behind'} F1 Mexico (${en(f1mx)}), the line the case joins if the parent naturalizes, so the right to stay in F2B matters for Mexican families. Its worst retrogression since 2001 was about ${Math.round(retro.worstMonths)} months${retro.worstMonths < othersMin ? ', the mildest of the five Mexico family columns' : ''}.`,
    faqs: [
      { q: 'Why is F2B Mexico ahead of F1 Mexico?', a: 'The two lines draw on different yearly allotments and different pools of waiting Mexican families, so they move at their own pace. In recent years F2B Mexico has advanced faster, and the gap means a resident parent’s naturalization would move an adult child to the slower F1 line. The comparison can reverse in any bulletin, which is why this page reads both dates each month.' },
      { q: 'Can my F2B Mexico son stay in F2B after I naturalize?', a: 'The law lets an F2B beneficiary whose parent naturalizes ask USCIS in writing not to convert to F1, keeping the F2B category and priority date. Whether to do so depends on the two Mexico dates at that time. This page describes the rule only; an immigration attorney or a DOJ-accredited representative can apply it to your family.' },
      { q: 'Does an F2B Mexico petition survive a wedding?', a: 'No. A green card holder cannot petition for a married son or daughter, so marriage revokes the F2B petition. If the parent becomes a citizen later, a new I-130 can be filed in F3, where the Mexico line is among the oldest in the bulletin, and it starts with a new priority date. Many families learn this rule only after the wedding.' },
    ],
    body: (h) => `
<h2>Three years of real movement</h2>
<p>For most of the last decade F2B Mexico crawled: ${h.cell(oct2016)} in October 2016, ${h.cell(oct2023)} in October 2023. Then the pace changed. The cutoff gained about ${h.num(g24)} months in the year to October 2024, ${h.num(g25)} the next year and ${h.num(g26)} in the past twelve months, to ${h.cell(fad)} today. The pattern is stop and go: the previous date held for ${h.num(held)} bulletins before the latest one moved it ${h.num(Math.round(move))} days at once.</p>
<h2>A column that rarely goes back</h2>
<p>F2B Mexico has retrogressed ${h.num(retro.n)} times since 2001, and its largest drop was about ${h.num(Math.round(retro.worstMonths))} months in ${h.month(retro.worstAt)}. Every other Mexican family column has lost at least ${h.num(othersMin)} months in a single bulletin at some point. That record is why the calculator, whose main model fails the back-test for this case, can still show a range based on the pace of the last twelve months, which passed it.</p>
<h2>The F1 paradox</h2>
<p>Today F2B Mexico is ${aheadOfF1 ? 'ahead of' : 'behind'} F1 Mexico, ${h.cell(f1mx)}. ${aheadOfF1 ? 'A resident parent who becomes a citizen therefore moves an adult Mexican-born child onto the slower line, unless the child asks to remain in F2B. The ' + h.a('guide-f2b-to-f1', 'F2B to F1 guide') + ' sets out the rule and runs the comparison.' : 'Conversion to F1 would not cost time this month; the ' + h.a('guide-f2b-to-f1', 'F2B to F1 guide') + ' explains the opt-out for months when it would.'} See also the ${h.a('f1-mexico', 'F1 Mexico page')}.</p>
<h2>What the calculator shows</h2>
<p>For a priority date of ${h.date(pdOneYear)}, one year after the cutoff, ${ex.reliable && ex.range?.[0] && ex.range?.[2] ? `the calculator gives ${h.month(ex.range[0])} to ${h.month(ex.range[2])}${ex.method === 'pace' ? ', using the twelve-month pace that passed the back-test' : ''}.` : 'the calculator says there is no reliable forecast this month.'} The main model’s twelve-month error was ${h.num(bt12.medianError)} months.</p>
<p>Where the case ends depends on where the beneficiary lives. From Mexico it is an immigrant visa interview at a U.S. consulate, priced in the ${h.a('consular-processing-cost', 'consular cost breakdown')}. From inside the United States, adjustment is open only to someone whose status allows it, and only once the Mexico F2B Date for Filing, ${h.cell(dff)} at present, is later than the priority date in a month USCIS has chosen that chart.</p>`,
  },
  es: {
    path: "familia/f2b/mexico",
    nav: 'F2B México', card: 'Hijos solteros de 21 años o más, nacidos en México, de un residente: tres años de avance y una fila que hoy supera a la F1.',
    title: 'F2B México boletín de visas 2026: hijo soltero de residente',
    description: 'F2B México: fecha de acción final para el hijo soltero mayor de 21 nacido en México de un residente, su avance reciente y por qué naturalizarse puede frenarlo.',
    h1: 'F2B México: su hijo soltero mayor de 21, nacido en México',
    intro: 'Escriba la fecha de prioridad del I-130 que usted presentó como residente y compárela con la fecha F2B de México y con la F1.',
    resume: `Si usted es residente permanente y pidió a su hijo o hija soltera de 21 años o más, nacida en México, la fecha de acción final (Final Action Date) del boletín de visas más reciente es ${es(fad)} y la fecha para presentar (Date for Filing) es ${es(dff)}. Para los nacidos en otros países la F2B va en ${es(row)}. ${mostThree ? 'En tres años, ninguna otra fila familiar mexicana ha avanzado tanto' : 'En tres años esta fila ha avanzado rápido'}: unos ${g24} meses de avance en el año hasta octubre de 2024, ${g25} en el siguiente y ${g26} en los últimos doce meses; solo el último boletín la adelantó ${Math.round(move)} días, después de ${held} boletines sin moverse. Hoy va ${aheadOfF1 ? 'por delante de' : 'por detrás de'} la F1 de México (${es(f1mx)}), la fila a la que pasaría su hijo si usted se hace ciudadano. Por eso, antes de naturalizarse, muchas familias mexicanas comparan las dos fechas. Y una boda cancela la petición F2B.`,
    faqs: [
      { q: '¿Si me hago ciudadano, mi hijo en F2B México espera más?', a: 'Puede pasar. Al naturalizarse usted, la petición F2B de su hijo pasa sola a F1, y en los últimos boletines la F1 de México va detrás de la F2B. La ley permite que su hijo pida por escrito a USCIS quedarse en F2B con su misma fecha. Revise las dos fechas del mes y la guía de F2B a F1 antes de decidir.' },
      { q: '¿Mi hija pierde la F2B de México si se casa?', a: 'Sí. Un residente no puede pedir a un hijo casado, así que la boda cancela la petición F2B. Si usted se hace ciudadano después, puede presentar un nuevo I-130 en F3, pero con una fecha de prioridad nueva y en la fila F3 de México, una de las más antiguas del boletín. Consulte antes a un abogado de inmigración.' },
      { q: '¿Por qué la calculadora sí da un rango para F2B México?', a: 'Porque esta fila casi no retrocede y su avance reciente ha sido regular. Nuestro modelo principal no pasó la prueba retrospectiva para este caso, pero el ritmo de los últimos doce meses sí, con su margen de error. Cuando ninguno de los dos pasa la prueba, la calculadora no da fecha y lo dice claramente.' },
    ],
    body: (h) => `
<h2>Un padre en Los Ángeles, una hija en Zacatecas</h2>
<p>Usted es residente, su hija tiene 27 años, sigue soltera y vive en Zacatecas. Su petición está en F2B, columna de México: ${h.cell(fad)} este mes. En octubre de 2016 la fecha era ${h.cell(oct2016)} y en octubre de 2023, ${h.cell(oct2023)}: siete años para avanzar poco. Después vinieron tres años distintos, con unos ${h.num(g24)}, ${h.num(g25)} y ${h.num(g26)} meses de avance. Si su hija hubiera nacido en Honduras, su fecha sería ${h.cell(row)}, unos ${h.num(years(fad, row), 1)} años más adelante: cuenta el lugar de nacimiento, no la nacionalidad.</p>
<h2>Avanza a saltos</h2>
<p>La fecha anterior se quedó quieta ${h.num(held)} boletines, y el último la movió ${h.num(Math.round(move))} días de una vez. Así se mueve esta fila: meses sin cambio, luego un salto. Lo bueno es que casi no retrocede: ${h.num(retro.n)} veces desde 2001, y la peor caída fue de unos ${h.num(Math.round(retro.worstMonths))} meses en ${h.month(retro.worstAt)}${retro.worstMonths < othersMin ? ', la más pequeña entre las cinco filas familiares de México' : ''}.</p>
<h2>La decisión antes de la ciudadanía</h2>
<p>Hoy la F2B de México va ${aheadOfF1 ? 'por delante de' : 'por detrás de'} la F1 de México (${h.cell(f1mx)}). ${aheadOfF1 ? 'Si usted se naturaliza, su hija pasaría a la fila más lenta, salvo que pida por escrito quedarse en F2B.' : 'Este mes el paso a F1 no le haría perder tiempo.'} La ${h.a('guide-f2b-to-f1', 'guía de F2B a F1')} explica la regla. Para aplicarla a su familia, busque un abogado de inmigración o un representante acreditado (${h.src('legalHelp', 'lista del Departamento de Justicia')}).</p>
<h2>El rango de la calculadora</h2>
<p>Para una fecha de prioridad un año detrás de la actual, ${ex.reliable && ex.range?.[0] && ex.range?.[2] ? `la calculadora estima entre ${h.month(ex.range[0])} y ${h.month(ex.range[2])}${ex.method === 'pace' ? ', con el ritmo de los últimos doce meses' : ''}.` : 'la calculadora no da fecha este mes.'} Si su hija vive en México, el caso termina por trámite consular (${h.a('consular-processing-cost', 'costos')}).</p>`,
  },
});
