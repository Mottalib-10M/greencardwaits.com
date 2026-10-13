import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, evaluate, MONTHS } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const at = (cat: 'F1' | 'F2B', c: 'ROW' | 'MX', ym?: string) => cellAt(cat, c, 'FAD', ym ? MONTHS.indexOf(ym) : undefined);
const fad = at('F1', 'MX');
const dff = cellAt('F1', 'MX', 'DFF');
const row = at('F1', 'ROW');
const f2bmx = at('F2B', 'MX');
const oct2016 = at('F1', 'MX', '2016-10');
const oct2021 = at('F1', 'MX', '2021-10');
const oct2025 = at('F1', 'MX', '2025-10');
const move = moveDays('F1', 'MX') ?? 0;
const bt12 = backtestCell('F1', 'MX', 12)!;
const retro = retrogressions('F1', 'MX');
const before = cellAt('F1', 'MX', 'FAD', MONTHS.indexOf(retro.worstAt) - 1);
const after = cellAt('F1', 'MX', 'FAD', MONTHS.indexOf(retro.worstAt));
// Exemple : une date de priorité un an après la limite actuelle.
const pdOneYear = `${Number(fad.slice(0, 4)) + 1}${fad.slice(4)}`;
const ex = evaluate('F1', 'MX', pdOneYear);
const DAY = 86_400_000;
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * DAY);
const months = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / (30.4375 * DAY));
const latestDay = `${MONTHS[MONTHS.length - 1]}-01`;
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');
const yearGain = months(oct2025, fad);
const f2bAhead = f2bmx > fad;
// Gain d'octobre à octobre (en mois), et meilleur gain annuel de 2014 à 2023.
const octGain = (y: number) => months(at('F1', 'MX', `${y - 1}-10`), at('F1', 'MX', `${y}-10`));
const prevGain = octGain(2025);
const best1423 = Math.max(...[2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].map(octGain));

export default definePage({
  id: "f1-mexico", group: "family", order: 105, parent: "f1",
  tool: {"kind": "greencard", "cat": "F1", "country": "MX"},
  data: {"cat": "F1", "country": "MX"},
  related: ["f1", "country-mexico", "f2b-mexico", "guide-f2b-to-f1", "guide-chargeability"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f1/mexico",
    nav: 'F1 Mexico', card: 'Mexican-born adult sons and daughters of U.S. citizens: a line nearly two decades long that ran fast in 2026.',
    title: 'F1 Mexico Visa Bulletin 2026: Cutoff and Wait History',
    description: 'F1 Mexico: the Final Action Date for Mexican-born unmarried sons and daughters of U.S. citizens, its 2005 collapse, this year’s run and why F2B can be faster.',
    h1: 'F1 Mexico: a citizen’s unmarried son or daughter born in Mexico',
    intro: 'Enter the priority date from the I-130 to compare it with the Mexico F1 cutoff, which runs on its own line years behind the rest of the world.',
    resume: `For a son or daughter born in Mexico, unmarried and 21 or older, whose parent is a U.S. citizen, the F1 Final Action Date in the latest Visa Bulletin is ${en(fad)} and the Date for Filing ${en(dff)}. The same petition for someone born in most other countries is at ${en(row)}, about ${years(fad, row).toFixed(1)} years further ahead. Mexico has had its own F1 column in every bulletin since 2015. The line was at ${en(oct2016)} in October 2016 and at ${en(oct2025)} a year ago, so the past twelve months carried it about ${yearGain} months forward, after ${prevGain} months the year before; from 2014 to 2023 no October-to-October year gained more than ${best1423}. History warns against extrapolating: in ${monthName(retro.worstAt, 'en')} the Mexico F1 date fell from ${en(before)} to ${en(after)} in one bulletin. Our back-test for this case missed by a median of ${bt12.medianError} months at one year behind, ${bt12.reliable ? 'which passed our test, so the calculator shows a range' : 'which fails our test, so the calculator does not print a date'}.`,
    faqs: [
      { q: 'Why is F1 Mexico so far behind the worldwide F1 date?', a: 'Because the per-country limit caps any country at 7% of the preference visas each year, and the number of Mexican sons and daughters of citizens waiting in F1 is far larger than that share. Mexico therefore gets its own column. Birth in Mexico is what counts, not citizenship, so a son born in Mexico but raised elsewhere still waits on this line.' },
      { q: 'Is F2B Mexico faster than F1 Mexico for a son or daughter?', a: 'It can be, and it is the unusual feature of the Mexico columns. When F2B Mexico is ahead, a parent’s naturalization converts the son or daughter into a slower F1 case. The law lets the beneficiary request to stay in F2B. Compare the two dates on this page each month and discuss the choice with an immigration attorney or a DOJ-accredited representative.' },
      { q: 'Can a spouse born outside Mexico change the F1 Mexico wait?', a: 'An F1 beneficiary is unmarried, so there is no spouse to borrow a country from: cross-chargeability through a spouse does not apply here. It becomes relevant only if the son or daughter marries, which converts the petition to F3, where the Mexico line is even older. The F1 Mexico column applies to every Mexican-born F1 beneficiary.' },
    ],
    body: (h) => `
<h2>The Mexico F1 line in four dates</h2>
<p>October 2016: ${h.cell(oct2016)}. October 2021: ${h.cell(oct2021)}. October 2025: ${h.cell(oct2025)}. Today: ${h.cell(fad)}. In the first five years the line advanced about ${h.num(years(oct2016, oct2021), 1)} years of priority dates; in the last twelve months alone, about ${h.num(yearGain)} months, including ${h.num(Math.abs(Math.round(move)))} days in the latest bulletin. The queue is now about ${h.num(years(fad, latestDay), 1)} years long, against ${h.num(years(row, latestDay), 1)} for the worldwide F1 column.</p>
<h2>The July 2005 collapse</h2>
<p>Mexico F1 has gone backwards ${h.num(retro.n)} times since 2001. The worst came in ${h.month(retro.worstAt)}, when the cutoff dropped from ${h.cell(before)} to ${h.cell(after)}: roughly ${h.num(Math.round(retro.worstMonths))} months erased in one bulletin. Families who had been told their date was close found it a decade away. That episode is why we refuse to turn a fast year into a promise.</p>
<h2>When naturalization slows a case</h2>
<p>Many Mexican F1 cases started as F2B: a resident parent filed for an adult child, then naturalized. Right now F2B Mexico sits at ${h.cell(f2bmx)}, ${f2bAhead ? 'ahead of' : 'behind'} F1 Mexico. ${f2bAhead ? 'A son or daughter converted from F2B therefore moved to the slower line, and the opt-out described in the ' + h.a('guide-f2b-to-f1', 'F2B to F1 guide') + ' exists for that situation.' : 'Conversion to F1 does not cost time this month; the ' + h.a('guide-f2b-to-f1', 'F2B to F1 guide') + ' explains the opt-out rule for months when it would.'} The ${h.a('f2b-mexico', 'F2B Mexico page')} tracks the other column.</p>
<h2>What the calculator says for a date one year back</h2>
<p>Take a priority date of ${h.date(pdOneYear)}, one year after the current cutoff. ${ex.reliable && ex.range?.[1] ? `The calculator gives a range around ${h.month(ex.range[1])}.` : `The calculator shows the distance, about ${h.num(ex.behindMonths, 0)} months, and the filing status, then says there is no reliable forecast: from October 2012 to October 2025 the range held the real outcome only ${h.pct(bt12.coverage)} of the time.`} USCIS this month uses the ${ex.filingChart === 'DFF' ? 'Dates for Filing' : 'Final Action'} chart for family cases.</p>
<p>A son or daughter living in Mexico finishes through consular processing once the Final Action Date passes the priority date, and pays the State Department and USCIS immigrant fees listed under ${h.a('consular-processing-cost', 'consular processing costs')}. One in the United States can file Form I-485 only with a status that allows adjustment.</p>`,
  },
  es: {
    path: "familia/f1/mexico",
    nav: 'F1 México', card: 'Hijos solteros mayores de 21, nacidos en México, de un ciudadano: una fila de casi veinte años que se aceleró en 2026.',
    title: 'F1 México boletín de visas 2026: hijo soltero de ciudadano',
    description: 'F1 México: fecha de acción final para el hijo soltero mayor de 21 nacido en México de un ciudadano, el retroceso de 2005, el avance de este año y la F2B.',
    h1: 'F1 México: su hijo soltero, nacido en México, y la fila del boletín',
    intro: 'Escriba la fecha de prioridad del I-130 que presentó por su hijo o hija y compárela con la fecha de México, que va años detrás del resto.',
    resume: `Si usted es ciudadano estadounidense y pidió a su hijo o hija soltera, de 21 años o más, nacida en México, la fecha de acción final (Final Action Date) del boletín de visas más reciente es ${es(fad)} y la fecha para presentar (Date for Filing) es ${es(dff)}. La misma petición para un hijo nacido en Guatemala o en El Salvador va en ${es(row)}, unos ${years(fad, row).toFixed(1)} años más adelante. Hace un año la fecha mexicana estaba en ${es(oct2025)}: avanzó unos ${yearGain} meses en doce boletines, después de ${prevGain} el año anterior; entre 2014 y 2023 ningún año pasó de ${best1423} meses. Pero esta fila ya cayó de golpe: en ${monthName(retro.worstAt, 'es')} pasó de ${es(before)} a ${es(after)}. Hoy la F2B de México va en ${es(f2bmx)}, ${f2bAhead ? 'por delante de' : 'por detrás de'} la F1, algo que importa si su petición empezó cuando usted era residente. Con un año de atraso, nuestro pronóstico falló por una mediana de ${bt12.medianError} meses entre 2012 y 2025, ${bt12.reliable ? 'y pasó nuestra prueba: la calculadora muestra un rango' : 'y no pasó nuestra prueba: la calculadora no da fecha'}.`,
    faqs: [
      { q: '¿Por qué la F1 de México va tan atrás de la fecha general?', a: 'Porque ningún país puede recibir más del 7 % de las visas de preferencia en un año, y hay muchos más hijos mexicanos de ciudadanos esperando en F1 que ese 7 %. Por eso México tiene columna propia. Cuenta el lugar de nacimiento del hijo: aunque haya crecido en Estados Unidos, si nació en México espera en esta fila.' },
      { q: 'Me hice ciudadano y mi hijo pasó de F2B a F1: ¿perdió tiempo en México?', a: 'Depende de las dos fechas del mes. Cuando la F2B de México va por delante de la F1, el cambio lo pone en la fila más lenta, y la ley le permite pedir por escrito quedarse en F2B. Esa decisión conviene revisarla con un abogado de inmigración o un representante acreditado por el Departamento de Justicia, nunca con un intermediario sin licencia.' },
      { q: '¿Qué pasa con la F1 de México si mi hijo se casa en México?', a: 'La petición pasa a F3, hijo casado de ciudadano, y conserva la fecha de prioridad. Pero la fila F3 de México es todavía más antigua, de las más lentas de todo el boletín. Su esposa o esposo y sus hijos menores de 21 vendrían como derivados. Si luego se divorcia, el caso puede volver a F1.' },
    ],
    body: (h) => `
<h2>Una familia, dos filas</h2>
<p>Usted vive en Houston o en Chicago, se hizo ciudadano y presentó el ${h.src('i130Form', 'formulario I-130')} por su hija que sigue soltera en Michoacán. Si ella hubiera nacido en Guatemala, su fecha sería ${h.cell(row)}. Como nació en México, es ${h.cell(fad)}. La fila mexicana mide hoy unos ${h.num(years(fad, latestDay), 1)} años.</p>
<h2>Un año de avance poco común</h2>
<p>En octubre de 2016 la fecha era ${h.cell(oct2016)}; en octubre de 2021, ${h.cell(oct2021)}; en octubre de 2025, ${h.cell(oct2025)}. En los últimos doce meses avanzó unos ${h.num(yearGain)} meses, ${h.num(Math.abs(Math.round(move)))} días solo en el último boletín. Es buena noticia, pero la historia pide prudencia: la F1 de México ha retrocedido ${h.num(retro.n)} veces desde 2001, y en ${h.month(retro.worstAt)} perdió unos ${h.num(Math.round(retro.worstMonths))} meses de una vez.</p>
<h2>Si su petición empezó como F2B</h2>
<p>Muchos casos de F1 México nacieron cuando el padre era residente. Al naturalizarse, la F2B pasó sola a F1. Este mes la F2B de México va en ${h.cell(f2bmx)}. ${f2bAhead ? 'Como va por delante de la F1, el cambio retrasó a esos hijos; la ' + h.a('guide-f2b-to-f1', 'guía de F2B a F1') + ' explica cómo pedir seguir en F2B.' : 'Este mes el cambio no cuesta tiempo; la ' + h.a('guide-f2b-to-f1', 'guía de F2B a F1') + ' explica la regla para cuando sí lo cueste.'} Vea también la página ${h.a('f2b-mexico', 'F2B México')}.</p>
<h2>Lo que puede y no puede decir la calculadora</h2>
<p>Para una fecha de prioridad un año detrás de la actual, ${ex.reliable && ex.range?.[1] ? `la calculadora da un rango alrededor de ${h.month(ex.range[1])}.` : `la calculadora muestra la distancia y si puede presentar, pero no da fecha: en nuestra prueba de 2012 a 2025 el rango acertó solo ${h.pct(bt12.coverage)} de las veces.`} Si su hijo vive en Estados Unidos con un estatus que permita el ajuste de estatus (adjustment of status), la tabla que USCIS indica este mes está en su ${h.src('aosCharts', 'página de tablas')}. Si su hija vive en México, el caso termina por trámite consular (consular processing) cuando la fecha de acción final pase su fecha de prioridad; los costos están en la página de ${h.a('consular-processing-cost', 'trámite consular')}.</p>`,
  },
});
