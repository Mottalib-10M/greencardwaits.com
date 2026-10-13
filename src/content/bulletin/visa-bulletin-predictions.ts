import { definePage } from '../../lib/guide-types';
import { cellAt, evaluate, backtestCell, LATEST, BACKTEST_FROM, BACKTEST_TO, type Cat, type Country, type CaseResult } from '../../lib/engine/cases';
import { addMonths } from '../../lib/engine/forecast';
import { monthName } from '../../lib/text';

// Même liste et même règle que la table générée « un an derrière la date limite » (DataBlocks, special: predictions).
const CASES: Array<[Exclude<Cat, 'IR'>, Country]> = [['F1', 'ROW'], ['F1', 'MX'], ['F1', 'PH'], ['F2A', 'ROW'], ['F2A', 'MX'], ['F2B', 'ROW'], ['F2B', 'MX'], ['F2B', 'PH'], ['F3', 'ROW'], ['F3', 'MX'], ['F3', 'PH'], ['F4', 'ROW'], ['F4', 'IN'], ['F4', 'MX'], ['F4', 'PH'], ['EB1', 'IN'], ['EB1', 'CN'], ['EB2', 'ROW'], ['EB2', 'IN'], ['EB2', 'CN'], ['EB3', 'ROW'], ['EB3', 'IN'], ['EB3', 'CN'], ['EB3', 'PH'], ['EW', 'ROW'], ['EB5', 'IN'], ['EB5', 'CN']];
interface Row { c: Exclude<Cat, 'IR'>; k: Country; kind: 'open' | 'near' | 'model' | 'pace' | 'none'; r?: CaseResult }
const rows: Row[] = CASES.map(([c, k]): Row => {
  const raw = cellAt(c, k, 'FAD');
  if (raw === 'C' || raw === 'U') return { c, k, kind: 'open' };
  const pd = addMonths(raw.slice(0, 7), 12) + raw.slice(7);
  if (pd > `${LATEST}-01`) return { c, k, kind: 'near' };
  const r = evaluate(c, k, pd);
  return { c, k, kind: r.reliable ? (r.method === 'pace' ? 'pace' : 'model') : 'none', r };
});
const count = (k: string) => rows.filter((x) => x.kind === k).length;
const nModel = count('model'), nPace = count('pace'), nNone = count('none'), nNear = count('near'), nOpen = count('open');
const mexRows = rows.filter((x) => x.k === 'MX');
const f2bMx = rows.find((x) => x.c === 'F2B' && x.k === 'MX')!;
const f4Mx = rows.find((x) => x.c === 'F4' && x.k === 'MX')!;
const bt = (c: Exclude<Cat, 'IR'>, k: Country, g: number) => backtestCell(c, k, g)!;
const eb2In12 = bt('EB2', 'IN', 12), f1Mx12 = bt('F1', 'MX', 12), f1Row12 = bt('F1', 'ROW', 12), f4Ph12 = bt('F4', 'PH', 12), eb2Row12 = bt('EB2', 'ROW', 12), f2bMx12 = bt('F2B', 'MX', 12);
const nextMonth = addMonths(LATEST, 1);
const catEs: Record<string, string> = { F1: 'F1 (hijos solteros de ciudadano)', F2A: 'F2A (cónyuge e hijos menores de residente)', F2B: 'F2B (hijos solteros mayores de residente)', F3: 'F3 (hijos casados de ciudadano)', F4: 'F4 (hermanos de ciudadano)' };

export default definePage({
  id: "visa-bulletin-predictions", group: "bulletin", order: 11, parent: "visa-bulletin",
  tool: {"kind": "greencard", "cat": "EB3", "country": "ROW", "pd": "2025-02-01"},
  data: {"special": "predictions"},
  related: ["visa-bulletin", "priority-date-calculator", "guide-retrogression", "visa-bulletin-history", "guide-bulletin-release"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203", "vbDec2022", "ivPosts"],
  en: {
    path: "visa-bulletin/predictions",
    nav: 'Predictions', card: 'Graded forecast ranges for people a year behind each cutoff, and the boxes where we refuse to guess.',
    title: 'Visa Bulletin Predictions 2026: Ranges With Their Past Error',
    description: 'Visa Bulletin predictions you can check: a 20% to 80% range for each case a year behind the cutoff, the median error since 2012, and no guess where it failed.',
    h1: 'Visa Bulletin predictions, graded against the past',
    intro: 'Enter a priority date to see the range of months in which it is likely to turn current, or why the back-test says the case cannot be forecast.',
    resume: `A Visa Bulletin prediction is a statement about future demand and future numbers, two things the State Department sees and the public does not. What can be measured is how fast each cutoff has closed the same distance in the past. Our table takes a priority date set twelve months behind the ${monthName(LATEST, 'en')} Final Action Date for ${CASES.length} cases and asks when it turns current, as a range from the 20th to the 80th percentile of ten years of observed waits. Each range was back-tested month by month from ${monthName(BACKTEST_FROM, 'en')} to ${monthName(BACKTEST_TO, 'en')}. This month ${nModel + nPace} cases pass that test and show a range; ${nNone} fail it and say no reliable forecast; ${nNear + nOpen} have a cutoff too recent or no cutoff at all to test a full year behind. For EB-2 India, the typical miss a year out was ${eb2In12.medianError} months. We do not predict next month's exact dates.`,
    faqs: [
      { q: 'Can anyone predict next month’s Visa Bulletin dates exactly?', a: 'Not from public data. The State Department sets each cutoff from demand it can see, such as documentarily qualified applicants and pending USCIS cases, against numbers left in the fiscal year. Outsiders see only the result. Our ranges describe how long a given distance has taken to close, not which date will be printed next month.' },
      { q: 'Why do Visa Bulletin predictions here say “no reliable forecast” so often?', a: 'Because we tested every case and distance on thirteen years of past bulletins, using only data known at each point, and kept a range only where it held the real outcome at least 40% of the time with a moderate median error. Volatile queues such as F1 Mexico or EB-2 India fail that rule at a year out.' },
      { q: 'What is the “12-month pace” in the Visa Bulletin predictions table?', a: 'A simpler rule: the cutoff keeps moving at the speed of the last twelve bulletins. Where our main model failed the back-test but that rule passed, the table shows the pace range with its own past error. It is labeled so you can tell which method produced the months you are reading.' },
      { q: 'Do the Visa Bulletin predictions account for retrogression?', a: 'They count past retrogressions, because every step back in the last ten years is inside the waits we measure. They cannot foresee a new one. A range that looks comfortable today can be wrong if demand jumps, which is why the 80th percentile matters more than the middle month when planning a move or a job change.' },
    ],
    body: (h) => `
<h2>What a forecast can know, and what it cannot</h2>
<p>The cutoff in each box is chosen by the State Department so that the people who become eligible in a month roughly match the visa numbers left for the fiscal year. It sees how many applicants are documentarily qualified, how many I-485 cases USCIS holds, and how many family numbers went unused the year before, which raise the next employment limit (the ${h.src('vbDec2022', 'December 2022 bulletin')} counted about ${h.num(57_000)}). None of that is published in a form anyone can model month by month. A prediction from outside is therefore a reading of the past, and it should say so.</p>
<h2>How the table below is built</h2>
<p>For each case we place a priority date exactly twelve months behind this month's Final Action Date, then ask how long the cutoff has taken, from every starting month in the previous ten years, to advance twelve months. Waits that never finished inside the archive are kept as unfinished rather than thrown away. The 20th and 80th percentiles of those waits give the range in the third column; the fourth column is the median miss of the same method, run on each month from ${h.month(BACKTEST_FROM)} to ${h.month(BACKTEST_TO)} without seeing the future.</p>
<h2>Why most employment boxes stay blank</h2>
<p>This month ${h.num(nModel)} cases show a model range, ${h.num(nPace)} show the twelve-month pace instead, and ${h.num(nNone)} show no reliable forecast. EB-2 India held its range often enough, but its typical miss a year out was ${h.num(eb2In12.medianError)} months, too wide to publish. EB-2 for the rest of the world, which went from current to a date and back several times, missed by ${h.num(eb2Row12.medianError)}. Steadier family lines do better: F1 worldwide missed by ${h.num(f1Row12.medianError)} months and F4 Philippines by ${h.num(f4Ph12.medianError)}. F1 Mexico, at ${h.num(f1Mx12.medianError)}, is withheld. ${nNear ? `In ${h.num(nNear)} case${nNear > 1 ? 's' : ''}, such as F2A, the cutoff is less than a year old, so a date twelve months behind it does not exist yet.` : ''}</p>
<h2>What we never print</h2>
<p>We do not print the ${h.month(nextMonth)} cutoff before the State Department does, we do not call a retrogression in advance, and we do not estimate consulate interview waits, which are not published. If your case depends on timing, for a job change under portability or a child near 21, the ${h.a('guide-retrogression', 'retrogression guide')} and a licensed immigration attorney are better guides than any range. Your own date, at any distance, goes in the ${h.a('priority-date-calculator', 'priority date calculator')}.</p>`,
  },
  es: {
    path: "boletin-de-visas/predicciones",
    nav: 'Predicciones', card: 'Rangos probados para las familias que están a un año de la fecha límite, y dónde no adivinamos.',
    title: 'Predicciones del Boletín de Visas 2026 con su error pasado',
    description: 'Predicciones del Boletín de Visas que puede revisar: rangos para las categorías familiares de México y del resto del mundo, con su error medido desde 2012.',
    h1: 'Predicciones del Boletín de Visas para las familias',
    intro: 'Escriba la fecha de prioridad de su familiar para ver en qué meses podría quedar al día, o por qué la prueba dice que ese caso no se puede pronosticar.',
    resume: `Nadie fuera del Departamento de Estado sabe cuál será la fecha del próximo boletín, porque depende de cuántas personas están listas para la entrevista y cuántos números quedan en el año fiscal. Lo que sí se puede medir es cuánto tardó cada fila en avanzar la misma distancia en el pasado. Nuestra tabla toma una fecha de prioridad doce meses detrás de la fecha de acción final de ${monthName(LATEST, 'es')} en ${CASES.length} casos y calcula el rango del percentil 20 al 80 en que se pone al día, con los últimos diez años de boletines. Cada rango se probó mes por mes de ${monthName(BACKTEST_FROM, 'es')} a ${monthName(BACKTEST_TO, 'es')}. Este mes ${nModel + nPace} casos pasan la prueba y muestran un rango, y ${nNone} no la pasan y dicen «sin pronóstico fiable». En las cinco categorías familiares de México, ${mexRows.filter((x) => x.kind === 'model' || x.kind === 'pace').length} tienen rango. Para F1 México, el error típico a un año fue de ${f1Mx12.medianError} meses: por eso no damos fecha.`,
    faqs: [
      { q: '¿Alguien puede adivinar la fecha exacta del próximo Boletín de Visas?', a: 'No con datos públicos. El Departamento de Estado fija cada fecha según la demanda que ve, como las personas que ya entregaron sus documentos al Centro Nacional de Visas, frente a los números que quedan en el año. Desde fuera solo vemos el resultado. Nuestros rangos dicen cuánto ha tardado una distancia en cerrarse, no qué fecha saldrá el mes que viene.' },
      { q: '¿Por qué las predicciones para F1 México dicen «sin pronóstico fiable»?', a: 'Porque probamos el método en F1 México con trece años de boletines, usando solo lo que se sabía cada mes, y a un año de distancia el error mediano fue demasiado grande para nuestra regla. La fila mexicana avanza a saltos y ha retrocedido varias veces. Preferimos mostrarle la fecha límite y la distancia antes que un mes inventado.' },
      { q: '¿Qué es el «ritmo de 12 meses» en las predicciones del boletín?', a: 'Una regla más simple: suponer que la fecha seguirá avanzando a la velocidad de los últimos doce boletines. Cuando nuestro modelo principal no pasó la prueba pero esta regla sí, la tabla muestra el rango del ritmo con su propio error pasado y lo indica entre paréntesis, para que sepa qué método produjo los meses que lee.' },
    ],
    body: (h) => `
<h2>Lo que una predicción puede saber</h2>
<p>La fecha de cada casilla la decide el Departamento de Estado para que las personas que se vuelven elegibles en el mes quepan en los números que quedan del año fiscal. Para eso mira cuántas familias ya entregaron sus documentos, cuántos casos I-485 tiene USCIS y cuántos números familiares sobraron el año anterior, que suben el límite de empleo del año siguiente (el ${h.src('vbDec2022', 'boletín de diciembre de 2022')} contó unos ${h.num(57_000)}). Esa información no se publica de forma que se pueda calcular mes por mes. Por eso cualquier predicción hecha desde fuera es una lectura del pasado, y debe decirlo.</p>
<h2>Las cinco filas de México, una por una</h2>
<p>${mexRows.map((x) => `${catEs[x.c]}: ${x.kind === 'model' ? 'rango del modelo' : x.kind === 'pace' ? 'rango del ritmo de 12 meses' : x.kind === 'none' ? 'sin pronóstico fiable' : x.kind === 'near' ? 'la fecha límite tiene menos de un año, no hay nadie un año detrás' : 'sin fecha límite'}`).join('; ')}. F2B México, por ejemplo, ${f2bMx.r && f2bMx.kind !== 'none' ? `muestra el ritmo de 12 meses porque el modelo principal falló a un año (error de ${h.num(f2bMx12.medianError)} meses) y la regla simple pasó` : 'no tiene rango este mes'}. En F4 México, la fila de los hermanos, el ritmo reciente es tan lento que ${f4Mx.r?.range?.[0] ? `el rango empieza en ${h.month(f4Mx.r.range[0])}` : 'no sale un rango útil'}: es una forma honesta de decir que, a esa velocidad, la espera se cuenta en décadas, no en años.</p>
<h2>Cómo se arma la tabla</h2>
<p>Para cada caso ponemos una fecha de prioridad doce meses detrás de la fecha de acción final del mes y medimos, desde cada mes de inicio de los diez años anteriores, cuánto tardó la fila en avanzar esos doce meses. Las esperas que no terminaron dentro del archivo se cuentan como abiertas, no se borran. El rango va del percentil 20 al 80, y la última columna es el error mediano del mismo método, probado en cada mes de ${h.month(BACKTEST_FROM)} a ${h.month(BACKTEST_TO)} sin mirar el futuro.</p>
<h2>Lo que nunca publicamos</h2>
<p>No adelantamos la fecha de ${h.month(nextMonth)}, no anunciamos retrocesos y no calculamos la cita del consulado en Ciudad Juárez ni en ningún otro lugar, porque no se publica. Si un hijo está por cumplir 21 años, el tiempo importa: lea la ${h.a('guide-cspa', 'guía de la Ley CSPA')} y consulte a un abogado de inmigración o a un representante acreditado. Para su propia fecha, use la ${h.a('priority-date-calculator', 'calculadora de fecha de prioridad')}.</p>`,
  },
});
