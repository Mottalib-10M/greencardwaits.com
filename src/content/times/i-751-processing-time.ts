import { definePage } from '../../lib/guide-types';
import PT from '../../data/ptimes.json';
import PR from '../../data/params-2026.json';
import { kindById, centerRows, NATIONAL_MONTH, PUBLISHED } from '../../lib/engine/ptimes';
import { formatNumber, formatMoney, displayDate } from '../../lib/format';
import { monthName } from '../../lib/text';

// Chiffres lus dans les données : I-751 à la direction des bureaux (FOD) et aux centres de service (SCD), rapport au Congrès.
type L = 'en' | 'es';
const NF = (PT as unknown as { national: { forms: Record<string, { months: number; received: number; pending: number }> } }).national.forms;
const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const [mName, mYear] = NATIONAL_MONTH.split(' ');
const natYm = `${mYear}-${String(MN.indexOf(mName) + 1).padStart(2, '0')}`;
const n = (x: number | null | undefined, l: L = 'en') => (x == null ? '–' : formatNumber(x, x % 1 ? 1 : 0, l));
const rows = centerRows(kindById('i751')!);
const fod = rows.find((r) => r.office === 'FOD')!, scd = rows.find((r) => r.office === 'SCD')!;
const nat = NF['I-751'];
const backlog = Math.round(nat.pending / nat.received);
const others = ['N-400', 'I-485 family', 'I-485 employment', 'I-130', 'I-765'];
const longerThan = others.filter((k) => NF[k].months < nat.months).length;
const F = PR.fees.i751;
const usd = (x: number, l: L) => formatMoney(x, 0, l);
const pubEn = displayDate(PUBLISHED, 'en-US');
const pubEs = displayDate(PUBLISHED, 'es-US');

export default definePage({
  id: "i-751-processing-time", group: "times", order: 508, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i751", "office": "HOU"},
  data: {"form": "i-751"},
  related: ["processing-times", "i-751-fee", "marriage-green-card-cost", "n-400-processing-time"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i751Form", "g1055", "legalHelp"],
  en: {
    path: "processing-times/i-751",
    nav: 'I-751 processing time', card: 'How long removing conditions on a two-year green card takes, at the two units USCIS publishes.',
    title: 'I-751 Processing Time 2026: Removing Green Card Conditions',
    description: 'I-751 processing time in 2026: the two ranges USCIS publishes for removing conditions on residence, the national average, the backlog and the 90-day window.',
    h1: 'I-751 processing time: removing conditions on residence',
    intro: 'Choose the unit handling your petition and enter the receipt date from your notice to compare the case with the range USCIS publishes.',
    resume: `Form I-751, the petition to remove conditions on residence, is filed by conditional residents who received a two-year green card through marriage to a U.S. citizen or permanent resident. USCIS publishes it at two units. In the edition of ${pubEn}, the Field Office Directorate shows a range of ${n(fod.min)} to ${n(fod.max)} months and Service Center Operations ${n(scd.min)} to ${n(scd.max)} months; the first figure is the median case and the second the point by which 80% were decided. The report to Congress for ${NATIONAL_MONTH} gives a national average of ${n(nat.months)} months, shorter than either range, because it averages every I-751 decided that month, including quick approvals. Both figures are correct. The backlog is large for a form with modest intake: USCIS received ${n(nat.received)} petitions in the month and had ${n(nat.pending)} pending, roughly ${n(backlog)} months of filings. The petition must be filed during the 90 days immediately before the conditional residence expires.`,
    faqs: [
      { q: 'When exactly can Form I-751 be filed?', a: 'USCIS says the petition must be filed during the 90-day period immediately before your conditional residence expires, and its I-751 page links to a tool that gives the first day of that window. The processing range on this page starts counting from the receipt date of a petition filed in that window.' },
      { q: 'Does USCIS explain why the I-751 processing time is so long?', a: 'Not on its processing-times tool, which gives the median, the 80% figure and the inquiry date for each unit without comment. We report the figures as published and do not attribute a cause. The body of this page compares the I-751 with the other green card and citizenship forms in the report to Congress, so you can judge the gap yourself.' },
      { q: 'Should I make an inquiry if my I-751 is past the published range?', a: 'When the receipt date on your notice is on or before the inquiry date USCIS publishes for your unit, the case is outside normal processing time and USCIS accepts a case inquiry. The checker shows both units and their dates. For questions about status, travel or a change in the marriage, speak to an immigration attorney or a DOJ-accredited representative.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '–' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Two units, two clocks</h2>
<p>The I-751 is one of the few forms that USCIS publishes at both the Field Office Directorate and Service Center Operations. The two lines start close, with medians of ${m(fod.min)} and ${m(scd.min)} months, but the field-office line reaches ${m(fod.max)} months at the 80% mark against ${m(scd.max)} for the service centers. Inquiries are accepted for receipts up to ${h.date(fod.inquiry!)} on the first line and ${h.date(scd.inquiry!)} on the second. USCIS does not say on its tool which petitions go where.</p>
<h2>A long average too</h2>
<p>The national average of ${m(nat.months)} months for ${h.month(natYm)} is longer than the average for ${longerThan === others.length ? `every one of the ${h.num(others.length)}` : `${h.num(longerThan)} of the ${h.num(others.length)}`} other green card and citizenship forms in the report, including naturalization at ${m(NF['N-400'].months)} and family-based adjustment at ${m(NF['I-485 family'].months)}. The pending caseload equals about ${h.num(backlog)} months of new filings at the latest monthly intake.</p>
<h2>Estimating the end of the range before filing</h2>
<p>Because the filing window is tied to the expiry of the conditional card, the receipt date is predictable: it falls within the last 90 days of the two-year residence. Add the upper bound of your unit’s range to that date and you have the point by which four in five petitions were decided. ${Math.min(fod.max!, scd.max!) > 24 ? 'On the current figures, that point lands well after the date printed on the card for both units.' : 'Compare that point with the date printed on the card.'}</p>
<h2>Fees and filing</h2>
<p>The G-1055 schedule sets the fee at ${h.usd(F.paper)} on paper and ${h.usd(F.online)} online. The ${h.src('i751Form', 'Form I-751 page')} gives the current edition and the filing window. A petition filed online gets its receipt notice in the USCIS account, which gives the date to enter in the checker. Couples who also plan to apply for citizenship can compare this range with the ${h.a('n-400-processing-time', 'N-400 processing time')}.</p>`;
    },
  },
  es: {
    path: "tiempos-de-proceso/i-751",
    nav: 'Tiempo del I-751', card: 'Cuánto tarda quitar las condiciones de la residencia de dos años por matrimonio, y cuándo presentarlo.',
    title: 'I-751 tiempo de proceso 2026: residencia condicional',
    description: 'Cuánto tarda el I-751 en 2026 para quitar las condiciones de la tarjeta de dos años por matrimonio: rangos de USCIS, promedio, tarifa y plazo de 90 días.',
    h1: 'I-751: cuánto tarda quitar las condiciones de la residencia',
    intro: 'Elija la unidad que tramita su petición, escriba la fecha de recibo de su aviso y compárela con el rango que publica USCIS.',
    resume: `Quien recibió la residencia por un matrimonio reciente con un ciudadano o un residente suele recibir primero una tarjeta condicional de dos años. Para cambiarla por la de diez años se presenta el formulario I-751, la petición para quitar las condiciones (Petition to Remove Conditions on Residence), durante los 90 días anteriores a que venza la residencia condicional. En la publicación de USCIS del ${pubEs}, el rango es de ${n(fod.min, 'es')} a ${n(fod.max, 'es')} meses en la dirección de oficinas locales (Field Office Directorate) y de ${n(scd.min, 'es')} a ${n(scd.max, 'es')} meses en los centros de servicio: la primera cifra es el caso mediano y la segunda, el plazo del 80 % de los casos. El informe al Congreso de ${monthName(natYm, 'es')} da un promedio de ${n(nat.months, 'es')} meses, con ${n(nat.pending, 'es')} peticiones pendientes. Las dos cifras son verdaderas y miden cosas diferentes. La tarifa es de ${usd(F.paper, 'es')} en papel y ${usd(F.online, 'es')} en línea.`,
    faqs: [
      { q: '¿Cuándo presento el I-751 si mi tarjeta de residente condicional vence pronto?', a: 'USCIS indica que el I-751 se presenta durante el período de 90 días inmediatamente anterior al vencimiento de la residencia condicional. Su página del formulario enlaza una herramienta para calcular el primer día de esa ventana. Si ya pasó la fecha, o si el matrimonio terminó, consulte a un abogado de inmigración o a un representante acreditado antes de presentar.' },
      { q: '¿USCIS explica por qué el I-751 tarda tanto?', a: 'No en su herramienta de tiempos, que solo da el caso mediano, la cifra del 80 % y la fecha de consulta de cada unidad. Mostramos las cifras tal como se publican, sin suponer una causa. En esta misma página puede comparar el promedio del I-751 con el de los demás formularios del informe al Congreso.' },
      { q: '¿Qué fecha uso para saber cuánto lleva mi I-751?', a: 'La fecha de recibo (receipt date) del aviso I-797C que USCIS envía después de recibir la petición, en papel o en su cuenta en línea. La herramienta de esta página compara esa fecha con el rango de la unidad elegida y le dice si USCIS ya acepta una consulta de caso. No use la fecha en que envió el sobre.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '–' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Una espera más larga que la propia tarjeta</h2>
<p>Una pareja de Phoenix que recibió la residencia condicional y presentó el I-751 a tiempo puede esperar, según la unidad, hasta ${m(fod.max)} meses para la decisión${fod.max! > 24 ? ', más que los dos años de validez de la tarjeta' : ''}. Por eso conviene guardar el aviso de recibo con la tarjeta y anotar la fecha. Las cifras de cada unidad:</p>
${h.table(['Unidad', 'Caso mediano', '80 % de los casos', 'Consultas para recibos hasta'], [[fod.name, `${m(fod.min)} meses`, `${m(fod.max)} meses`, h.date(fod.inquiry!)], [scd.name, `${m(scd.min)} meses`, `${m(scd.max)} meses`, h.date(scd.inquiry!)]], `Publicación de USCIS del ${h.date(PUBLISHED)}.`, ['l', 'r', 'r', 'l'])}
<h2>El promedio y la fila</h2>
<p>El promedio de ${m(nat.months)} meses del informe de ${h.month(natYm)} junta todas las peticiones I-751 terminadas en el mes. Con ${h.num(nat.received)} peticiones nuevas en el mes y ${h.num(nat.pending)} pendientes, la fila equivale a unos ${h.num(backlog)} meses de solicitudes. Como la ventana para presentar depende del vencimiento de la tarjeta, usted puede calcular de antemano hasta cuándo llegaría el rango: sume la cifra alta de su unidad a la fecha en que espera presentar.</p>
<h2>Cómo encaja con la ciudadanía</h2>
<p>Muchas parejas empiezan a pensar en la ciudadanía estadounidense mientras el I-751 todavía sigue pendiente. Las reglas de cuándo se puede presentar el N-400 están en la ${h.a('n-400-early-filing-calculator', 'calculadora de presentación anticipada')}, y los tiempos, en la página del ${h.a('n-400-processing-time', 'tiempo del N-400')}. Si su caso tiene una complicación, busque ayuda en la ${h.src('legalHelp', 'lista oficial de representantes')}.</p>`;
    },
  },
});
