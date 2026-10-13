import { definePage } from '../../lib/guide-types';
import { QUEUE_CATS, COUNTRIES, CAT_SHORT, COUNTRY_LABEL, cellAt, moveDays, filingChart, LATEST } from '../../lib/engine/cases';
import { cellText, monthName } from '../../lib/text';
import P from '../../data/params-2026.json';

// Mouvements du bulletin du mois, lus dans les données : seules les colonnes de pays qui ont leur propre date comptent.
const own = QUEUE_CATS.flatMap((c) => COUNTRIES.map((k) => ({ c, k, d: moveDays(c, k) })))
  .filter((m) => m.k === 'ROW' || cellAt(m.c, m.k, 'FAD') !== cellAt(m.c, 'ROW', 'FAD'));
const known = own.filter((m) => m.d !== null);
const up = known.filter((m) => m.d! >= 1).sort((a, b) => b.d! - a.d!);
const down = known.filter((m) => m.d! <= -1).sort((a, b) => a.d! - b.d!);
const flat = known.filter((m) => Math.abs(m.d!) < 1);
const name = (m: { c: string; k: string }, l: 'en' | 'es') => `${CAT_SHORT[m.c as keyof typeof CAT_SHORT]} ${m.k === 'ROW' ? (l === 'en' ? 'worldwide' : 'resto del mundo') : COUNTRY_LABEL[l][m.k as keyof (typeof COUNTRY_LABEL)['en']]}`;
const unavailable = own.filter((m) => cellAt(m.c, m.k, 'FAD') === 'U');
const famChart = filingChart('F1'), empChart = filingChart('EB2');
const chartLine = famChart === empChart ? `lets both family and employment cases file Form I-485 on the ${famChart === 'DFF' ? 'Dates for Filing' : 'Final Action Dates'} chart this month` : `lets family cases file Form I-485 on the ${famChart === 'DFF' ? 'Dates for Filing' : 'Final Action Dates'} chart and employment cases on the ${empChart === 'DFF' ? 'Dates for Filing' : 'Final Action Dates'} chart this month`;
const mxFam = (['F1', 'F2A', 'F2B', 'F3', 'F4'] as const).map((c) => ({ c, v: cellAt(c, 'MX', 'FAD'), d: moveDays(c, 'MX') ?? 0 }));
const mxUp = mxFam.filter((x) => x.d >= 1);
const f2aMx = cellAt('F2A', 'MX', 'FAD');
const f2aMxDff = cellAt('F2A', 'MX', 'DFF');
const f4Row = cellAt('F4', 'ROW', 'FAD');
const eb2In = cellAt('EB2', 'IN', 'FAD');
const days = (n: number) => Math.round(Math.abs(n));
const chartEn = (c: string) => (c === 'DFF' ? 'Dates for Filing' : 'Final Action Dates');
const chartEs = (c: string) => (c === 'DFF' ? 'fechas de presentación' : 'fechas de acción final');

export default definePage({
  id: "visa-bulletin", group: "bulletin", order: 10,
  tool: {"kind": "bulletin", "month": "2026-10", "cat": "F2B", "country": "MX"},
  data: {"special": "month", "month": "2026-10"},
  related: ["visa-bulletin-predictions", "visa-bulletin-history", "visa-bulletin-2026-09", "guide-final-action-vs-dates-for-filing", "priority-date-calculator"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "vbOct2026", "ina203"],
  en: {
    path: "visa-bulletin",
    nav: 'Visa Bulletin', card: 'This month’s Final Action Dates and Dates for Filing for every category and country, with what moved.',
    title: 'Visa Bulletin 2026: This Month’s Cutoffs and Both Charts',
    description: 'The latest Visa Bulletin in full: Final Action Dates and Dates for Filing for family and employment categories, what moved, and the chart USCIS accepts.',
    h1: 'The Visa Bulletin this month, read for you',
    intro: 'Pick your category and country of birth to see this month’s cutoff on both charts, whether your priority date beats it, and how far it moved.',
    resume: `The Visa Bulletin for ${monthName(LATEST, 'en')} is the State Department's monthly list of cutoff dates for green cards that have an annual limit. Each family and employment category has one row, and the columns are the countries that use more than their share: China, India, Mexico and the Philippines, with everyone else in the first column. Your priority date must be earlier than the date in your box. This month ${up.length} of those boxes moved forward, ${down.length} moved back and ${flat.length} did not move. The largest advance was ${up.length ? `${name(up[0], 'en')}, by ${days(up[0].d!)} days` : 'none'}; ${down.length ? `the largest step back was ${name(down[0], 'en')}, by ${days(down[0].d!)} days` : 'no box went backwards'}. For applicants inside the United States, USCIS ${chartLine}. Immediate relatives of U.S. citizens are not in the bulletin at all, because they have no cap.`,
    faqs: [
      { q: 'How do I find my box in the Visa Bulletin chart?', a: 'Take the category from your petition approval (for example F2B or EB-3), find that row, then move across to the column of your country of birth, not your citizenship. Mexico, the Philippines, India and China have their own columns; everyone else uses the first one. If your priority date is earlier than the date in that box, it is current.' },
      { q: 'What do “C” and “U” mean in the Visa Bulletin?', a: 'C means current: every priority date qualifies that month, so there is no line. U means unavailable: no visa number can be issued in that category for that country during the month, whatever the priority date. A U often appears near the end of a fiscal year, when the annual numbers for a country have run out.' },
      { q: 'Does the Visa Bulletin apply to the spouse of a U.S. citizen?', a: 'No. Spouses, parents and unmarried children under 21 of U.S. citizens are immediate relatives, with no annual limit, so they never wait for a bulletin date. The spouse of a green card holder is different: that is category F2A, which has a cutoff and appears in the family chart every month.' },
      { q: 'Why can the Visa Bulletin cutoff go backwards?', a: 'The cutoff is set so that demand in a month matches the numbers left for the year. When more people with early dates come forward than expected, the State Department moves the date back to stop numbers running out. That is called retrogression, and it has happened in every major category since 2001.' },
    ],
    body: (h) => `
<h2>Reading the ${h.month(LATEST)} bulletin in three moves</h2>
<p>Find the row first: the preference category on your approved petition, F1 to F4 for family, EB-1 to EB-5 for employment. Then the column, which is your country of chargeability, almost always your country of birth. Last, compare. The date in the box is the cutoff; anyone with an earlier priority date can move to the final step this month. A box that reads ${h.cell('C')} has no line at all, and one that reads ${h.cell('U')} is closed whatever your date. The tables below this text hold all ${h.num(QUEUE_CATS.length)} categories, both charts, and the change since last month for every box.</p>
<h2>What moved this month, and what slipped</h2>
<p>Counting only the boxes that have a date of their own, ${h.num(up.length)} advanced, ${h.num(down.length)} went back and ${h.num(flat.length)} stayed where they were. ${up.length ? `The longest jump forward was ${name(up[0], 'en')} at ${h.num(days(up[0].d!))} days${up[1] ? `, ahead of ${name(up[1], 'en')} at ${h.num(days(up[1].d!))}` : ''}.` : ''} ${down.length ? `The worst step back was ${name(down[0], 'en')}, which lost ${h.num(days(down[0].d!))} days; a move like that usually means the State Department saw more demand than numbers.` : 'No box retrogressed.'} ${unavailable.length ? `${h.num(unavailable.length)} box${unavailable.length > 1 ? 'es read' : ' reads'} unavailable.` : 'Not a single box is unavailable.'} For context, EB-2 India stands at ${h.cell(eb2In)} and F4 for most of the world at ${h.cell(f4Row)}. To see how a month like this one fits the long record, open the ${h.a('visa-bulletin-history', 'archive of every bulletin since 2001')}; for what may come next, the ${h.a('visa-bulletin-predictions', 'predictions page')} shows ranges only where our back-test allows it.</p>
<h2>The chart USCIS accepts for Form I-485</h2>
<p>Two charts appear in each bulletin. Final Action Dates govern approval; Dates for Filing let people hand in Form I-485 earlier. Which one counts for filing inside the United States is not set by the bulletin but by USCIS, on its ${h.src('aosCharts', 'filing charts page')}. For ${h.month(h.P.aosChart.month)} it chose ${famChart === empChart ? `${chartEn(famChart)} for both family and employment cases` : `${chartEn(famChart)} for family cases and ${chartEn(empChart)} for employment cases`}, checked on ${h.date(h.P.aosChart.reviewed)}. Abroad, an immigrant visa can only be issued once the Final Action Date has passed the priority date.</p>
<h2>Where these numbers come from</h2>
<p>Family preference visas are capped at ${h.num(h.P.limits.family)} a year and employment visas at ${h.num(h.P.limits.employment)}, with no country above ${h.pct(h.P.limits.perCountryShare)} of the total (${h.src('ina203', 'INA sections 201 to 203')}). We read each bulletin from the State Department's own archive (${h.src('vbOct2026', `bulletin for ${h.month(LATEST)}`)}) the day it appears, and type nothing by hand. To test your own date, use the ${h.a('priority-date-calculator', 'priority date calculator')}.</p>`,
  },
  es: {
    path: "boletin-de-visas",
    nav: 'Boletín de Visas', card: 'Las fechas del mes para cada categoría familiar y de empleo, con la columna de México y lo que se movió.',
    title: 'Boletín de Visas 2026: fechas del mes para su familia',
    description: 'El Boletín de Visas (Visa Bulletin) del mes: fechas de acción final y de presentación por categoría, la columna de México, qué avanzó y qué tabla acepta USCIS.',
    h1: 'El Boletín de Visas de este mes, explicado para su familia',
    intro: 'Elija la categoría de la petición y el país de nacimiento de su familiar para ver la fecha del mes en las dos tablas y si su fecha de prioridad ya pasa.',
    resume: `El Boletín de Visas (Visa Bulletin) de ${monthName(LATEST, 'es')} es la lista mensual del Departamento de Estado con las fechas límite de las green cards que tienen cupo anual. Cada categoría familiar tiene una fila: F1 para los hijos solteros mayores de 21 años de un ciudadano, F2A para el cónyuge y los hijos menores de un residente, F2B para los hijos solteros mayores de un residente, F3 para los hijos casados de un ciudadano y F4 para los hermanos de un ciudadano mayor de edad. México tiene su propia columna porque su demanda pasa el tope por país. Este mes, ${mxUp.length ? `${mxUp.length} de las cinco fechas familiares de México avanzaron` : 'ninguna fecha familiar de México avanzó'}, y F2A México quedó en ${cellText(f2aMx, 'es')}. Para presentar el formulario I-485 dentro del país, USCIS acepta este mes la tabla de ${chartEs(famChart)} en los casos familiares. El cónyuge, los padres y los hijos menores de un ciudadano no aparecen en el boletín: son familiares inmediatos y no hacen fila.`,
    faqs: [
      { q: '¿Cómo encuentro la fecha de mi familiar en el Boletín de Visas?', a: 'Busque la fila de la categoría que aparece en la aprobación de la petición I-130 (por ejemplo F2B o F4) y luego la columna del país donde nació su familiar, no la de su nacionalidad. Si nació en México, use la columna de México; si nació en El Salvador, Guatemala u Honduras, la del resto del mundo. Si su fecha de prioridad es anterior a la de la casilla, ya está al día.' },
      { q: '¿Qué significan la «C» y la «U» en el Boletín de Visas?', a: 'La C (current) quiere decir que la categoría está al día: cualquier fecha de prioridad sirve ese mes y no hay fila. La U (unavailable) quiere decir que ese mes no se puede entregar ninguna visa en esa categoría para ese país, sin importar la fecha. La U aparece sobre todo cerca de septiembre, cuando se acaban los números del año fiscal.' },
      { q: '¿Qué hago si la fecha de mi familiar en México ya está al día?', a: 'Si su familiar vive en México, el caso sigue en el Centro Nacional de Visas (NVC) y luego en el consulado, que fija la entrevista. Si ya vive en Estados Unidos y tiene derecho a ajustar su estatus, puede presentar el formulario I-485 según la tabla que USCIS indique ese mes. Un abogado de inmigración o un representante acreditado puede revisar su caso.' },
      { q: '¿Por qué la fecha del Boletín de Visas a veces retrocede?', a: 'Porque el Departamento de Estado fija la fecha para que la demanda del mes quepa en los números que quedan del año. Si se presentan más personas con fechas antiguas de lo esperado, la fecha se mueve hacia atrás para no agotar el cupo. Se llama retroceso (retrogression) y ha pasado varias veces en las columnas de México desde 2001.' },
    ],
    body: (h) => `
<h2>Cómo leer la fila de su familia</h2>
<p>El boletín tiene dos partes: familia y empleo. En la parte familiar hay cinco filas, una por categoría, y cinco columnas: resto del mundo, China, India, México y Filipinas. Supongamos que usted es residente permanente en Houston y pidió a su hija soltera de 25 años, nacida en Puebla. Su categoría es F2B y su columna, México: hoy esa casilla dice ${h.cell(cellAt('F2B', 'MX', 'FAD'))}. Si la fecha de prioridad del aviso I-797 es anterior, su hija ya puede pasar a la última etapa; si es posterior, sigue en la fila. Una casilla con ${h.cell('C')} no tiene fila; una con ${h.cell('U')} está cerrada ese mes.</p>
<h2>Las fechas de México este mes</h2>
<p>${mxFam.map((x) => `${x.c}: ${h.cell(x.v)}${x.d >= 1 ? ` (avanzó ${h.num(days(x.d))} días)` : x.d <= -1 ? ` (retrocedió ${h.num(days(x.d))} días)` : ' (sin cambio)'}`).join('; ')}. Las familias de El Salvador, Guatemala y Honduras usan la columna del resto del mundo, que suele ir varios años por delante en F1, F2B, F3 y F4. Entre todas las casillas con fecha propia del boletín, ${h.num(up.length)} avanzaron, ${h.num(down.length)} retrocedieron y ${h.num(flat.length)} no se movieron. Para ver cómo se compara este mes con los anteriores, abra el ${h.a('visa-bulletin-history', 'historial desde 2001')}.</p>
<h2>Fecha de acción final y fecha de presentación</h2>
<p>Cada boletín trae dos tablas. La fecha de acción final (Final Action Date) decide cuándo se aprueba la green card. La fecha de presentación (Date for Filing) permite entregar el formulario I-485 antes, si USCIS lo autoriza ese mes en su ${h.src('aosCharts', 'página de tablas')}. Para ${h.month(h.P.aosChart.month)}, USCIS aceptó la tabla de ${chartEs(famChart)} en los casos familiares. Ejemplo: en F2A México, la fecha de acción final es ${h.cell(f2aMx)} y la de presentación ${h.cell(f2aMxDff)}. La esposa de un residente que ya vive en el país puede, con esa tabla, presentar su I-485 y pedir permiso de trabajo mientras espera.</p>
<h2>Si su familiar vive fuera de Estados Unidos</h2>
<p>Cuando la fecha llega, el caso de un familiar en México o en Centroamérica sigue por el Centro Nacional de Visas (NVC) y el consulado, y la visa solo puede entregarse cuando la fecha de acción final ya pasó su fecha de prioridad. El tiempo de cita del consulado no se publica, así que no lo estimamos. El boletín cubre ${h.num(h.P.limits.family)} visas familiares al año (${h.src('ina203', 'Ley de Inmigración y Nacionalidad')}); los datos se leen en el ${h.src('vbOct2026', `boletín de ${h.month(LATEST)}`)} del Departamento de Estado. Para su propia fecha, use la ${h.a('priority-date-calculator', 'calculadora de fecha de prioridad')}.</p>`,
  },
});
