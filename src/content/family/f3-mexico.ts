import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, backtestCell, evaluate, MONTHS, type Cat } from '../../lib/engine/cases';
import { retrogressions } from '../../lib/minis/retro';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
const at = (cat: Exclude<Cat, 'IR'>, c: 'ROW' | 'MX', ym?: string) => cellAt(cat, c, 'FAD', ym ? MONTHS.indexOf(ym) : undefined);
const fad = at('F3', 'MX');
const dff = cellAt('F3', 'MX', 'DFF');
const row = at('F3', 'ROW');
const f1mx = at('F1', 'MX');
const oct2016 = at('F3', 'MX', '2016-10');
const oct2021 = at('F3', 'MX', '2021-10');
const oct2023 = at('F3', 'MX', '2023-10');
const oct2024 = at('F3', 'MX', '2024-10');
const oct2025 = at('F3', 'MX', '2025-10');
const move = moveDays('F3', 'MX') ?? 0;
const bt12 = backtestCell('F3', 'MX', 12)!;
const bt24 = backtestCell('F3', 'MX', 24)!;
const retro = retrogressions('F3', 'MX');
const before = cellAt('F3', 'MX', 'FAD', MONTHS.indexOf(retro.worstAt) - 1);
const after = cellAt('F3', 'MX', 'FAD', MONTHS.indexOf(retro.worstAt));
// Le recul de F3 Mexique est-il le plus profond de toutes les cases familiales suivies ?
const deepest = (['F1', 'F2A', 'F2B', 'F3', 'F4'] as const).every((c) => (['ROW', 'MX', 'PH', 'IN', 'CN'] as const).every((k) => (c === 'F3' && k === 'MX') || retrogressions(c, k).worstMonths < retro.worstMonths));
const fadYear = fad.slice(0, 4);
const mostRetro = (['F1', 'F2A', 'F2B', 'F4'] as const).every((c) => retrogressions(c, 'MX').n < retro.n);
const pdOneYear = `${Number(fad.slice(0, 4)) + 1}${fad.slice(4)}`;
const ex = evaluate('F3', 'MX', pdOneYear);
const DAY = 86_400_000;
const months = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / (30.4375 * DAY));
const years = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * DAY);
const latestDay = `${MONTHS[MONTHS.length - 1]}-01`;
const lineYears = years(fad, latestDay);
const g24 = months(oct2023, oct2024), gNow = months(oct2025, fad);
const dffLead = months(fad, dff);
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');

export default definePage({
  id: "f3-mexico", group: "family", order: 108, parent: "f3",
  tool: {"kind": "greencard", "cat": "F3", "country": "MX"},
  data: {"cat": "F3", "country": "MX"},
  related: ["f3", "country-mexico", "guide-cspa", "f1-mexico", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "cspaPolicy", "vbOct2026", "cfr204_2", "famPref"],
  en: {
    path: "family/f3/mexico",
    nav: 'F3 Mexico', card: 'Mexican-born married sons and daughters of U.S. citizens: a quarter-century line with the deepest drop on record.',
    title: 'F3 Mexico Visa Bulletin 2026: Married Son or Daughter',
    description: 'F3 Mexico: Final Action Date for Mexican-born married children of U.S. citizens, one of the oldest cutoffs, its 2006 collapse and the grandchildren who age out.',
    h1: 'F3 Mexico: a citizen’s married son or daughter, born in Mexico',
    intro: 'Enter the priority date from the I-130 to see how the Mexico F3 cutoff compares with it, and why the calculator is cautious about this line.',
    resume: `For a married son or daughter of a U.S. citizen, born in Mexico, the F3 Final Action Date in the latest Visa Bulletin is ${en(fad)}, so the queue covers about ${lineYears.toFixed(0)} years of priority dates. Petitions filed in ${fadYear} are only now reaching the front. The worldwide F3 date is ${en(row)}, some ${years(fad, row).toFixed(1)} years ahead. The Dates for Filing chart is further along at ${en(dff)}, about ${dffLead} months past the Final Action Date. Movement has been uneven: about ${g24} months of progress in the year to October 2024, then only ${gNow} months in the past twelve. In ${monthName(retro.worstAt, 'en')} the cutoff fell from ${en(before)} to ${en(after)}, ${deepest ? 'the deepest single drop in any family column we track' : 'one of the deepest single drops in the family table'}. Our back-test fails for this case at one and two years behind, so the calculator gives no date here, only the distance and filing status.`,
    faqs: [
      { q: 'Why does F3 Mexico move so slowly?', a: 'Married sons and daughters immigrate with their spouses and children under 21, so each Mexican F3 case uses several visa numbers from a small yearly F3 allotment, and Mexico is capped by the per-country limit on top of that. The line is long because demand built up over decades and every priority date carries a household. A good year can still be followed by a pause.' },
      { q: 'Do grandchildren born after the F3 Mexico petition count as derivatives?', a: 'Yes, a child born to the beneficiary after the filing is a derivative as long as the child is unmarried and under 21 when the visa is issued, or protected by the Child Status Protection Act. In a line this long, the opposite problem is more common: children who were small at filing turn 21 before the date arrives.' },
      { q: 'Is a divorced F3 Mexico beneficiary better off in F1?', a: 'Divorce converts the case to F1 Mexico with the same priority date when the beneficiary is 21 or older, and the F1 Mexico cutoff is currently years ahead of F3 Mexico. The former spouse stops being a derivative. A divorce has many consequences besides the visa line, so for a real decision speak to an immigration attorney or a DOJ-accredited representative.' },
    ],
    body: (h) => `
<h2>A line measured in generations</h2>
<p>An F3 Mexico priority date that becomes current today was filed in ${fadYear}; a son who was 30 then is about ${30 + Math.round(lineYears)} now, and his children have grown up during the wait. The cutoff, ${h.cell(fad)}, sits about ${h.num(lineYears, 0)} years behind the bulletin date, against ${h.num(years(row, latestDay), 0)} years for the worldwide F3 column. ${move === 0 ? 'The latest bulletin left it unchanged.' : `The latest bulletin moved it ${h.num(Math.abs(Math.round(move)))} days ${move > 0 ? 'forward' : 'backward'}.`}</p>
<h2>The 2006 collapse and the long climb back</h2>
<p>In ${h.month(retro.worstAt)} the Mexico F3 date dropped from ${h.cell(before)} to ${h.cell(after)}, erasing about ${h.num(Math.round(retro.worstMonths))} months in a single bulletin. It took years to recover. The cutoff was ${h.cell(oct2016)} in October 2016, ${h.cell(oct2021)} in October 2021 and ${h.cell(oct2025)} in October 2025. With ${h.num(retro.n)} retrogressions since 2001, this ${mostRetro ? 'is the Mexican family column that has gone backwards most often' : 'is one of the Mexican family columns that most often goes backwards'}.</p>
<h2>Marriage, divorce and the Mexico columns</h2>
<p>Many F3 Mexico cases began as F1: a citizen filed for a single son, who later married. The petition kept its priority date but moved from F1 Mexico, now ${h.cell(f1mx)}, to this line, about ${h.num(years(fad, f1mx), 1)} years further back. Divorce works the other way. The ${h.a('f1-mexico', 'F1 Mexico page')} follows that column.</p>
<h2>Grandchildren and the age of 21</h2>
<p>With a wait this long, the ${h.a('guide-cspa', 'CSPA calculation')} often decides whether a grandchild comes with the parents. It subtracts the time the I-130 was pending, usually small next to the bulletin wait, so many children still age out.</p>
<h2>Why no date</h2>
<p>For a priority date of ${h.date(pdOneYear)}, one year after the cutoff, ${ex.reliable && ex.range?.[1] ? `the calculator shows a range around ${h.month(ex.range[1])}.` : `the calculator shows the distance and says there is no reliable forecast: at two years behind, our range caught the real outcome only ${h.pct(bt24.coverage)} of the time.`} The one-year median error was ${h.num(bt12.medianError)} months.</p>`,
  },
  es: {
    path: "familia/f3/mexico",
    nav: 'F3 México', card: 'Hijos casados, nacidos en México, de un ciudadano: una fila de unos veinticinco años y el retroceso más grande del boletín.',
    title: 'F3 México boletín de visas 2026: hijo casado de ciudadano',
    description: 'F3 México: fecha de acción final para el hijo casado nacido en México de un ciudadano, una de las fechas más antiguas, su caída de 2006 y la edad de los nietos.',
    h1: 'F3 México: su hijo casado, nacido en México, y toda su familia',
    intro: 'Escriba la fecha de prioridad del I-130 que presentó por su hijo casado y vea dónde está frente a la fecha F3 de México.',
    resume: `Si usted es ciudadano estadounidense y pidió a su hijo o hija casada, nacida en México, la fecha de acción final (Final Action Date) del boletín de visas más reciente es ${es(fad)}: la fila cubre unos ${lineYears.toFixed(0)} años de fechas de prioridad. Las peticiones presentadas en ${fadYear} apenas llegan hoy al frente. Para los nacidos en otros países, la F3 va en ${es(row)}. La fecha para presentar (Date for Filing) va algo más adelante, en ${es(dff)}. El avance ha sido desigual: unos ${g24} meses en el año hasta octubre de 2024 y apenas ${gNow} en los últimos doce. En ${monthName(retro.worstAt, 'es')} la fecha cayó de ${es(before)} a ${es(after)}, ${deepest ? 'el peor retroceso de todas las filas familiares' : 'uno de los peores retrocesos del cuadro familiar'}. Con su yerno o su nuera vienen los nietos menores de 21, pero muchos cumplen 21 antes de la visa. Nuestro pronóstico no pasó la prueba retrospectiva para este caso: la calculadora no da fecha.`,
    faqs: [
      { q: '¿Por qué la F3 de México tarda tanto?', a: 'Porque cada hijo casado viene con su cónyuge y sus hijos menores de 21, así que cada caso usa varias visas de un cupo anual pequeño, y México además tiene el límite por país. La demanda se acumuló durante décadas. Un buen año puede venir seguido de meses sin avance, como se ve en la historia de esta fila.' },
      { q: '¿Mis nietos nacidos después de la petición F3 México pueden venir?', a: 'Sí. Un hijo que su hijo tuvo después de presentar la petición es derivado si sigue soltero y menor de 21 cuando se emite la visa, o si lo protege la ley CSPA. En esta fila el problema más común es el contrario: nietos que eran pequeños al presentar y cumplen 21 antes de que llegue la fecha.' },
      { q: '¿Si mi hijo se divorcia, la F3 México pasa a F1?', a: 'Sí, si tiene 21 años o más: la petición pasa a F1 México con la misma fecha de prioridad, y hoy la F1 de México va años por delante de la F3. Su excónyuge deja de ser derivado. Un divorcio tiene muchas otras consecuencias; para una decisión así, consulte a un abogado de inmigración o a un representante acreditado.' },
    ],
    body: (h) => `
<h2>Una petición de hace un cuarto de siglo</h2>
<p>Usted se hizo ciudadano hace muchos años y pidió a su hijo, ya casado, que vive en Puebla con su esposa y sus hijos. La fecha F3 de México es ${h.cell(fad)}: unos ${h.num(lineYears, 0)} años de fila, frente a unos ${h.num(years(row, latestDay), 0)} para la columna general. ${move === 0 ? 'El último boletín la dejó sin cambio.' : `El último boletín la movió ${h.num(Math.abs(Math.round(move)))} días ${move > 0 ? 'hacia adelante' : 'hacia atrás'}.`}</p>
<h2>La caída de 2006</h2>
<p>En ${h.month(retro.worstAt)} la fecha bajó de ${h.cell(before)} a ${h.cell(after)}: unos ${h.num(Math.round(retro.worstMonths))} meses perdidos en un solo boletín. Recuperarse tomó años: ${h.cell(oct2016)} en octubre de 2016, ${h.cell(oct2021)} en octubre de 2021, ${h.cell(oct2025)} en octubre de 2025. En total ha retrocedido ${h.num(retro.n)} veces desde 2001${mostRetro ? ', más que cualquier otra fila familiar mexicana' : ''}.</p>
<h2>Cuando un hijo en F1 se casa</h2>
<p>Muchos casos F3 México empezaron como F1: el hijo era soltero y se casó durante la espera. Conservó la fecha, pero pasó de la F1 de México (${h.cell(f1mx)}) a esta fila, unos ${h.num(years(fad, f1mx), 1)} años más atrás. Vea la página ${h.a('f1-mexico', 'F1 México')}.</p>
<h2>Los nietos</h2>
<p>La ${h.a('guide-cspa', 'guía CSPA')} explica cómo se calcula la edad protegida: se resta el tiempo que el I-130 estuvo pendiente, que suele ser poco frente a los años de boletín. Por eso muchos nietos quedan fuera al cumplir 21. Si su hijo vive en Estados Unidos con un estatus que permite el ajuste de estatus, la tabla de fechas para presentar (${h.cell(dff)}) puede abrirle el I-485 antes, en los meses en que USCIS la indique. Si vive en México, el caso termina por trámite consular, con ${h.a('consular-processing-cost', 'costos por persona')}.</p>`,
  },
});
