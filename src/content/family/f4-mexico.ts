import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, evaluate, MONTHS } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const at = (c: 'ROW' | 'MX', ym?: string) => cellAt('F4', c, 'FAD', ym ? MONTHS.indexOf(ym) : undefined);
const fad = at('MX');
const dff = cellAt('F4', 'MX', 'DFF');
const row = at('ROW');
const oct2016 = at('MX', '2016-10');
const oct2021 = at('MX', '2021-10');
const oct2025 = at('MX', '2025-10');
const move = moveDays('F4', 'MX') ?? 0;
const bt12 = backtestCell('F4', 'MX', 12)!;
const bt24 = backtestCell('F4', 'MX', 24)!;
const retro = retrogressions('F4', 'MX');
const before = cellAt('F4', 'MX', 'FAD', MONTHS.indexOf(retro.worstAt) - 1);
const after = cellAt('F4', 'MX', 'FAD', MONTHS.indexOf(retro.worstAt));
// Combien de bulletins la date précédente est restée figée avant le dernier mouvement.
const L = MONTHS.length - 1;
const prev = cellAt('F4', 'MX', 'FAD', L - 1);
let held = 0;
while (L - 1 - held >= 0 && cellAt('F4', 'MX', 'FAD', L - 1 - held) === prev) held++;
const pdOneYear = `${Number(fad.slice(0, 4)) + 1}${fad.slice(4)}`;
const ex = evaluate('F4', 'MX', pdOneYear);
const DAY = 86_400_000;
const days = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * DAY);
const latestDay = `${MONTHS[MONTHS.length - 1]}-01`;
const lineYears = years(fad, latestDay);
const yearDays = days(oct2025, fad);
const decade = years(oct2016, fad);
// La date F4 Mexique est-elle la plus ancienne de toutes les cases familiales suivies ?
const oldest = (['F1', 'F2A', 'F2B', 'F3', 'F4'] as const).every((c) => (['ROW', 'MX', 'PH', 'IN', 'CN'] as const).every((k) => {
  const v = cellAt(c, k, 'FAD');
  return (c === 'F4' && k === 'MX') || v === 'C' || v === 'U' || v > fad;
}));
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');

export default definePage({
  id: "f4-mexico", group: "family", order: 109, parent: "f4",
  tool: {"kind": "greencard", "cat": "F4", "country": "MX"},
  data: {"cat": "F4", "country": "MX"},
  related: ["f4", "country-mexico", "guide-cspa", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f4/mexico",
    nav: 'F4 Mexico', card: 'Mexican-born brothers and sisters of U.S. citizens: the oldest family cutoff in the bulletin and a year of almost no movement.',
    title: 'F4 Mexico Visa Bulletin 2026: Sibling Petition Wait',
    description: 'F4 Mexico: the Final Action Date for Mexican-born siblings of U.S. citizens, among the oldest family cutoffs, a decade of movement in numbers and the 2005 drop.',
    h1: 'F4 Mexico: a U.S. citizen’s brother or sister born in Mexico',
    intro: 'Enter the priority date of the sibling I-130 to see how far it sits from the Mexico F4 cutoff, one of the slowest family lines in the bulletin.',
    resume: `For a brother or sister of a U.S. citizen, born in Mexico, the F4 Final Action Date in the latest Visa Bulletin is ${en(fad)} and the Date for Filing ${en(dff)}. That makes the line about ${lineYears.toFixed(0)} years long, ${oldest ? 'the oldest family cutoff in the table' : 'one of the oldest family cutoffs in the table'}, while siblings born in most other countries are at ${en(row)}. The past year shows how slowly it moves: the date was ${en(oct2025)} in October 2025, held still for ${held} bulletins in a row, and then advanced ${yearDays} days. Over ten years, from October 2016, it covered about ${decade.toFixed(1)} years of priority dates. In ${monthName(retro.worstAt, 'en')} it fell from ${en(before)} to ${en(after)}. A citizen filing for a Mexican-born sibling today is filing for a wait that has, historically, run longer than two decades, and our calculator shows that distance plainly rather than a hopeful month.`,
    faqs: [
      { q: 'Why is F4 Mexico the slowest family line in the Visa Bulletin?', a: 'The pool of sibling petitions filed by U.S. citizens for Mexican-born brothers and sisters is enormous, built up over decades, and the per-country limit stops Mexico from using more than its share in any year. Each sibling also brings a spouse and children under 21 who use visa numbers from the same line. The result is a cutoff that advances by days or weeks in many years.' },
      { q: 'Can a sibling’s spouse born outside Mexico shorten an F4 Mexico wait?', a: 'Possibly. Under cross-chargeability, a principal beneficiary born in Mexico may be charged to the spouse’s country of birth when both immigrate together, which can move the case to a faster column. The rule does not help an unmarried sibling. The chargeability guide explains the conditions; an immigration attorney can confirm whether it applies in your case.' },
      { q: 'What happens to nephews and nieces in a long F4 Mexico wait?', a: 'They come as derivatives only while unmarried and under 21, or while the Child Status Protection Act keeps their age below 21. In a line measured in decades, most children of the sibling will be adults when the date arrives. There is no category for an aunt or uncle to sponsor a nephew, so they need another basis to immigrate.' },
    ],
    body: (h) => `
<h2>A year counted in days</h2>
<p>October 2025: ${h.cell(oct2025)}. Then ${h.num(held)} bulletins in a row with the same date. Then a move of ${h.num(Math.abs(Math.round(move)))} days to today’s ${h.cell(fad)}. For a Mexican-born sibling, twelve months of bulletins advanced the line by ${h.num(yearDays)} days. Over a longer window the picture is less bleak but still slow: ${h.cell(oct2016)} in October 2016, ${h.cell(oct2021)} in October 2021, about ${h.num(decade, 1)} years of priority dates in ten years.</p>
<h2>The 2005 drop</h2>
<p>In ${h.month(retro.worstAt)} the cutoff fell from ${h.cell(before)} to ${h.cell(after)}, roughly ${h.num(Math.round(retro.worstMonths))} months in one bulletin. It is one of ${h.num(retro.n)} retrogressions on this line since 2001. Worldwide F4 is at ${h.cell(row)}, about ${h.num(years(fad, row), 1)} years ahead; the ${h.a('f4', 'F4 page')} compares all four columns.</p>
<h2>Who files, and what they are filing for</h2>
<p>Only a citizen aged 21 or older can file ${h.src('i130Form', 'Form I-130')} for a brother or sister. A Mexican-born sibling may be married or single; F4 does not care. What matters is that a priority date filed today joins a line that ${h.num(lineYears, 0)} years of applicants are already standing in. A spouse born outside Mexico can sometimes change the column through ${h.a('guide-chargeability', 'cross-chargeability')}.</p>
<h2>What the calculator does with this line</h2>
<p>For a priority date of ${h.date(pdOneYear)}, one year after the cutoff, ${ex.reliable && ex.range?.[0] && ex.range?.[2] ? `the calculator’s range runs from ${h.month(ex.range[0])} to ${h.month(ex.range[2])}${ex.method === 'pace' ? ', built from the pace of the last twelve bulletins, which passed our back-test; a range that far out mostly says how little the date moved this year' : ''}.` : 'the calculator shows the distance and says there is no reliable forecast.'} The main model’s median error was ${h.num(bt12.medianError)} months at one year behind and ${h.num(bt24.medianError)} at two. Nephews and nieces face the ${h.a('guide-cspa', 'CSPA age test')} at the end of the wait.</p>`,
  },
  es: {
    path: "familia/f4/mexico",
    nav: 'F4 México', card: 'Hermanos nacidos en México de un ciudadano: la fecha familiar más antigua del boletín y un año casi sin avance.',
    title: 'F4 México boletín de visas 2026: petición para un hermano',
    description: 'F4 México: fecha de acción final para el hermano nacido en México de un ciudadano, de las más antiguas del cuadro, cuánto avanza al año y la caída de 2005.',
    h1: 'F4 México: cuando un ciudadano pide a su hermano nacido en México',
    intro: 'Escriba la fecha de prioridad del I-130 que presentó por su hermano o su hermana y vea a qué distancia está de la fecha F4 de México.',
    resume: `Si usted es ciudadano estadounidense y pidió a su hermano o hermana nacida en México, la fecha de acción final (Final Action Date) del boletín de visas más reciente es ${es(fad)} y la fecha para presentar (Date for Filing) es ${es(dff)}. ${oldest ? 'Es la fecha familiar más antigua de todo el boletín' : 'Es una de las fechas familiares más antiguas del boletín'}: la fila mide unos ${lineYears.toFixed(0)} años. Para un hermano nacido en El Salvador o en Honduras la fecha es ${es(row)}. El último año muestra el ritmo: en octubre de 2025 la fecha era ${es(oct2025)}, se quedó igual ${held} boletines seguidos y luego avanzó ${yearDays} días. En diez años, desde octubre de 2016, cubrió unos ${decade.toFixed(1)} años de fechas de prioridad. En ${monthName(retro.worstAt, 'es')} cayó de ${es(before)} a ${es(after)}. Quien presenta hoy una petición F4 por un hermano mexicano entra en una fila que históricamente ha durado más de veinte años, y la calculadora lo muestra tal cual.`,
    faqs: [
      { q: '¿Por qué la F4 de México casi no avanza?', a: 'Porque hay muchísimas peticiones de ciudadanos por hermanos nacidos en México, y el límite por país impide que México use más de su parte cada año. Además, cada hermano viene con su cónyuge y sus hijos menores de 21, que usan visas de la misma fila. El resultado es una fecha que en muchos años avanza solo días o semanas.' },
      { q: '¿Mi cuñada nacida en Guatemala puede acortar la espera F4 México?', a: 'Puede ser. Con la imputación cruzada (cross-chargeability), un hermano nacido en México puede usar el país de nacimiento de su cónyuge si los dos emigran juntos, y Guatemala usa la columna general, mucho más adelantada. No sirve si su hermano es soltero. Confirme las condiciones con un abogado de inmigración o un representante acreditado.' },
      { q: '¿Mis sobrinos pueden venir con la petición F4 de México?', a: 'Sí, como derivados, mientras sean solteros y menores de 21, o mientras la ley CSPA mantenga su edad por debajo de 21. En una fila de décadas, la mayoría de los sobrinos serán adultos cuando llegue la fecha. No existe una categoría para que un tío pida a un sobrino; necesitarían otra vía.' },
    ],
    body: (h) => `
<h2>Un hermano en Oaxaca, una fila de décadas</h2>
<p>Usted vive en California, se hizo ciudadano y presentó el ${h.src('i130Form', 'formulario I-130')} por su hermano, que sigue en Oaxaca con su esposa y sus hijos. Su fecha de prioridad se compara con ${h.cell(fad)}, la fecha F4 de México. Si su hermano hubiera nacido en Honduras, la fecha sería ${h.cell(row)}, unos ${h.num(years(fad, row), 1)} años más adelante.</p>
<h2>Un año medido en días</h2>
<p>En octubre de 2025 la fecha era ${h.cell(oct2025)}. Se quedó así ${h.num(held)} boletines seguidos y el último la movió ${h.num(Math.abs(Math.round(move)))} días. En doce meses, la fila avanzó ${h.num(yearDays)} días. En diez años avanzó unos ${h.num(decade, 1)} años: ${h.cell(oct2016)} en octubre de 2016, ${h.cell(oct2021)} en octubre de 2021.</p>
<h2>La caída de 2005</h2>
<p>En ${h.month(retro.worstAt)} la fecha bajó de ${h.cell(before)} a ${h.cell(after)}, unos ${h.num(Math.round(retro.worstMonths))} meses en un solo boletín. Ha retrocedido ${h.num(retro.n)} veces desde 2001. Por eso no tomamos un buen mes como promesa. Y recuerde: solo un ciudadano de 21 años o más puede pedir a un hermano; un residente tiene que naturalizarse antes.</p>
<h2>Lo que hace la calculadora</h2>
<p>Para una fecha de prioridad un año detrás de la actual, ${ex.reliable && ex.range?.[0] && ex.range?.[2] ? `la calculadora da un rango de ${h.month(ex.range[0])} a ${h.month(ex.range[2])}${ex.method === 'pace' ? ', calculado con el ritmo de los últimos doce boletines; un rango tan lejano refleja sobre todo lo poco que se movió la fecha este año' : ''}.` : 'la calculadora muestra la distancia y dice que no hay pronóstico confiable.'} Si su cuñado o cuñada nació fuera de México, la ${h.a('guide-chargeability', 'guía de imputación')} explica cuándo puede cambiar la columna. Para los sobrinos, vea la ${h.a('guide-cspa', 'guía CSPA')}. Si su hermano vive en México, el caso termina por trámite consular (${h.a('consular-processing-cost', 'costos')}).</p>`,
  },
});
