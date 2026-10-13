import { definePage } from '../../lib/guide-types';
import BT from '../../data/backtest.json';
import VB from '../../data/visa-bulletin.json';
import { formatNumber, formatPercent } from '../../lib/format';
import { monthName } from '../../lib/text';

// Chiffres du rétro-test, recalculés à chaque reconstruction des données.
const cells = Object.values(BT.cases).flatMap((c) => c.cells).filter((c) => c.observed >= 12 && Number.isFinite(c.coverage));
const model = cells.filter((c) => c.reliable).length;
const pace = cells.filter((c) => c.naiveReliable).length;
const total = Object.values(BT.cases).flatMap((c) => c.cells).length;
const n = (x: number, l: 'en' | 'es') => formatNumber(x, 0, l);
const sorted = [...cells.map((c) => c.coverage)].sort((a, b) => a - b);
const medCov = sorted[Math.floor(sorted.length / 2)];

export default definePage({
  id: 'priority-date-calculator', group: 'tools', order: 400,
  tool: { kind: 'greencard', cat: 'EB2', country: 'IN', pd: '2014-06-01' },
  related: ['visa-bulletin-predictions', 'guide-priority-date', 'uscis-fee-calculator', 'visa-bulletin-history'],
  sources: ['vbIndex', 'vbMirror', 'aosCharts', 'visaPriority'],
  en: {
    path: 'tools/priority-date-calculator',
    nav: 'Priority date calculator', card: 'When will my priority date be current? A forecast range, its past error, filing status and fees.',
    title: 'Priority Date Calculator 2026: When Will Yours Be Current?',
    description: 'Priority date calculator: enter category, country and date to see the Final Action status, I-485 filing, a forecast range with its past error and the 2026 fees.',
    h1: 'Priority date calculator: when will my date be current?',
    intro: 'The full version of the calculator, with the cutoff history since 2012 drawn against your date and the forecast range shaded on it.',
    resume: `A priority date becomes current when the Visa Bulletin’s Final Action Date for your category and country of chargeability moves past it. This calculator reads the latest bulletin, tells you whether you are current, how far behind you are and whether USCIS lets you file Form I-485 this month, and then estimates when the cutoff will reach you. The estimate is a range, never a single date: the fastest 20% and the slowest 20% of past outcomes for people at the same distance behind the same cutoff are left outside it. It is shown only where the method held up in a back-test over ${n(VB.count, 'en')} bulletins: of ${n(total, 'en')} combinations of case and distance, ${n(model, 'en')} pass with our model and ${n(pace, 'en')} more with the simpler rule of the last 12 months. Everywhere else the answer is “no reliable forecast”, because a date that fails its own test would only mislead.`,
    faqs: [
      { q: 'How does the priority date calculator estimate a future date?', a: 'It looks at the last ten years of the same cutoff and measures, for each month, how long the date took to move forward by the distance that separates you from it today. The middle of those outcomes is the central estimate; the 20% and 80% points give the range. Months whose outcome is still unknown are handled statistically rather than ignored.' },
      { q: 'Why does the calculator sometimes say there is no reliable forecast?', a: 'Because for that case and that distance, forecasts made the same way in the past missed the real date too often. Our rule asks that the range held the real outcome at least 40% of the time and that the typical error stayed under half the real wait. When neither our model nor the 12-month pace passes, no date is printed.' },
      { q: 'Does the calculator use the Final Action Date or the Date for Filing?', a: 'Both, for different answers. The forecast and the current-or-not status use the Final Action Date, which governs approval. The line about filing Form I-485 uses the chart USCIS designates for the month, which in October 2026 is Dates for Filing for both family and employment cases.' },
      { q: 'Is my priority date sent anywhere when I use the calculator?', a: 'No. The calculation runs in your browser with data already loaded on the page, and nothing you type is stored, sent or written into the page address. The reminder button creates a calendar file on your own device, and closing the tab erases everything you entered.' },
    ],
    body: (h) => `
<h2>What the calculator reads</h2>
<p>Every bulletin since ${h.month(VB.first)} has been read cell by cell: ${h.num(VB.count)} months, five family and six employment categories, the worldwide column and the columns for China, India, Mexico and the Philippines, and since October 2015 both charts. The ${h.month(VB.latest)} bulletin gives the current cutoffs; USCIS’s filing-charts page says which chart it accepts for Form I-485 this month. If you select a USCIS field office, the result adds the family green card range USCIS publishes for that office; otherwise it shows the national average from the monthly report to Congress.</p>
<h2>How to read the result</h2>
<p>The headline is either “Current”, a range of months, or “No reliable forecast”. Under it, the result lists both cutoffs, whether you can file the I-485 now, the past error of the method at your distance, the office time and the government fees for the path you chose. The step-by-step panel shows each number with its source. On a large screen, the chart puts the cutoff history since 2012 next to your date as a red line; when a forecast is shown, the shaded cone is the range.</p>
<h2>When the answer is the 12-month pace</h2>
<p>For some cases our main method failed the back-test while a simple rule passed: assume the cutoff keeps the pace of the last 12 months. In those cases the calculator shows that estimate with a band equal to its median past error and says so in the steps. This happens mostly in family categories for Mexico, where the date has moved steadily in recent years. ${h.a('method', 'The full back-test table')} lists which cases pass, case by case, and how often the range held: a median ${h.pct(medCov)} across all tested combinations.</p>
<h2>What the calculator cannot know</h2>
<p>It does not know if your I-140 or I-130 is approved, if you can use a spouse’s country of birth, whether a child is protected by the Child Status Protection Act, or whether a consulate has an appointment. Those questions have their own pages on this site, and none of them replaces advice from a licensed immigration attorney or a DOJ-accredited representative on your own file.</p>`,
  },
  es: {
    path: 'herramientas/calculadora-fecha-de-prioridad',
    nav: 'Calculadora de fecha de prioridad', card: '¿Cuándo estará al día mi fecha de prioridad? Rango de pronóstico, su error pasado, trámite y costos.',
    title: 'Fecha de prioridad 2026: calculadora de cuándo estará al día',
    description: 'Calculadora de fecha de prioridad: categoría, país y fecha para saber si está al día, si puede presentar el I-485, un rango de pronóstico y las tarifas.',
    h1: 'Calculadora de fecha de prioridad: ¿cuándo me toca?',
    intro: 'La versión completa de la calculadora, con la historia de la fecha límite desde 2012 dibujada junto a su fecha y el rango del pronóstico sombreado.',
    resume: `Una fecha de prioridad se pone al día cuando la fecha de acción final (Final Action Date) del Visa Bulletin para su categoría y su país de cargo la pasa. Esta calculadora lee el último boletín, le dice si ya está al día, cuánto le falta y si USCIS le deja presentar el formulario I-485 este mes, y luego calcula cuándo llegará la fecha límite a la suya. El resultado es un rango y nunca una fecha sola: se dejan fuera el 20 % de los casos pasados más rápidos y el 20 % más lentos, entre personas que estaban a la misma distancia de la misma fecha límite. Solo se muestra donde el método pasó una prueba con ${n(VB.count, 'es')} boletines: de ${n(total, 'es')} combinaciones de caso y distancia, ${n(model, 'es')} pasan con nuestro modelo y ${n(pace, 'es')} más con la regla sencilla del ritmo de los últimos 12 meses. En las demás, la respuesta es «sin pronóstico fiable».`,
    faqs: [
      { q: '¿Cómo calcula la fecha futura la calculadora de fecha de prioridad?', a: 'Mira los últimos diez años de la misma fecha límite y mide, mes por mes, cuánto tardó en avanzar la distancia que hoy lo separa de ella. La mitad de esos resultados da la estimación central; los puntos del 20 % y del 80 % dan el rango. Los meses cuyo resultado aún no se conoce se tratan con estadística en vez de ignorarlos.' },
      { q: '¿Por qué la calculadora a veces no da ninguna fecha?', a: 'Porque en ese caso y a esa distancia, los pronósticos hechos igual en el pasado fallaron demasiado. Pedimos que el rango acertara al menos el 40 % de las veces y que el error típico no pasara de la mitad de la espera real. Si ni nuestro modelo ni el ritmo de 12 meses lo cumplen, no se publica fecha.' },
      { q: '¿La calculadora usa la fecha de acción final o la de presentación?', a: 'Las dos, para respuestas distintas. El pronóstico y el estado «al día» usan la fecha de acción final, que manda para la aprobación. La línea sobre el I-485 usa la tabla que USCIS designa cada mes; en octubre de 2026 son las fechas de presentación, para familia y para empleo.' },
      { q: '¿Se envía mi fecha de prioridad a algún lado?', a: 'No. El cálculo se hace en su navegador con los datos ya cargados en la página, y nada de lo que escribe se guarda, se envía ni se escribe en la dirección de la página. El botón de recordatorio crea un archivo de calendario en su propio dispositivo.' },
    ],
    body: (h) => `
<h2>Lo que lee la calculadora</h2>
<p>Cada boletín desde ${h.month(VB.first)} se leyó casilla por casilla: ${h.num(VB.count)} meses, cinco categorías familiares y seis de empleo, la columna del resto del mundo y las de China, India, México y Filipinas, y desde octubre de 2015 las dos tablas. El boletín de ${h.month(VB.latest)} da las fechas actuales; la página de USCIS sobre las tablas de presentación dice cuál acepta este mes para el I-485. Si elige una oficina de USCIS, el resultado agrega el rango publicado para la green card familiar en esa oficina; si no, muestra el promedio nacional del informe mensual al Congreso.</p>
<h2>Cómo leer el resultado</h2>
<p>El titular dice «Al día», un rango de meses o «Sin pronóstico fiable». Debajo aparecen las dos fechas límite, si puede presentar el I-485 ya, el error pasado del método a su distancia, el tiempo de la oficina y las tarifas del gobierno para el trámite elegido. El panel «Cómo se calculó» muestra cada cifra con su fuente.</p>
<h2>Cuando la respuesta es el ritmo de 12 meses</h2>
<p>En algunos casos nuestro método no pasó la prueba y una regla sencilla sí: suponer que la fecha sigue el ritmo de los últimos 12 meses. Entonces la calculadora muestra esa estimación con un margen igual a su error mediano y lo dice. Pasa sobre todo en categorías familiares de México, donde la fecha ha avanzado de forma pareja en los últimos años. ${h.a('method', 'La tabla completa de la prueba')} muestra qué casos pasan.</p>
<h2>Lo que la calculadora no sabe</h2>
<p>No sabe si su I-130 está aprobado, si puede usar el país de nacimiento de su cónyuge, si un hijo está protegido por la ley CSPA ni si el consulado tiene cita. Para su caso, consulte a un abogado de inmigración con licencia o a un representante acreditado por el Departamento de Justicia. Si alguien sin licencia le ofrece «arreglar» su caso, la guía de USCIS para evitar estafas explica cómo comprobarlo.</p>`,
  },
});
