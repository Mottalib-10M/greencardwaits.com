import { definePage } from '../../lib/guide-types';
import PT from '../../data/ptimes.json';
import PR from '../../data/params-2026.json';
import { kindById, centerRows, OFFICE_NAMES, NATIONAL_MONTH, PUBLISHED } from '../../lib/engine/ptimes';
import { formatNumber, formatMoney, displayDate } from '../../lib/format';
import { monthName } from '../../lib/text';

// Chiffres lus dans les données : I-765 (c)(9) au NBC et aux centres de service, autres catégories publiées, rapport au Congrès.
type L = 'en' | 'es';
const NF = (PT as unknown as { national: { forms: Record<string, { months: number; received: number; pending: number }> } }).national.forms;
type R = { office: string; subtype: string; info: string; min: number | null; max: number | null; inquiry: string | null };
const ALL = ((PT as unknown as { forms: Record<string, { rows: R[] }> }).forms['i-765']?.rows ?? []).filter((r) => r.max != null);
const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const [mName, mYear] = NATIONAL_MONTH.split(' ');
const natYm = `${mYear}-${String(MN.indexOf(mName) + 1).padStart(2, '0')}`;
const n = (x: number | null | undefined, l: L = 'en') => (x == null ? '—' : formatNumber(x, x % 1 ? 1 : 0, l));
const c9 = centerRows(kindById('i765c9')!);
const c9hi = Math.max(...c9.map((r) => r.max ?? 0)), c9lo = Math.min(...c9.map((r) => r.max ?? 99));
const nat = NF['I-765'];
const sorted = [...ALL].sort((a, b) => a.max! - b.max!);
const c9rank = sorted.findIndex((r) => r.subtype === '147-C9') + 1;
const F = PR.fees.i765;
const pubEn = displayDate(PUBLISHED, 'en-US');
const pubEs = displayDate(PUBLISHED, 'es-US');
const usd = (x: number, l: L) => formatMoney(x, 0, l);

export default definePage({
  id: "i-765-processing-time", group: "times", order: 505, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i765c9", "office": "HOU"},
  data: {"form": "i-765"},
  related: ["processing-times", "i-765-fee", "i-485-family-processing-time", "i-131-processing-time"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i765Form", "g1055"],
  en: {
    path: "processing-times/i-765",
    nav: 'I-765 work permit time', card: 'How long the (c)(9) work permit takes with a pending green card application, and why the average looks shorter.',
    title: 'I-765 Processing Time 2026: (c)(9) Work Permit at USCIS',
    description: 'I-765 processing time in 2026 for the (c)(9) work permit with a pending I-485: the published range, its rank among EAD categories and the national average.',
    h1: 'I-765 (c)(9) processing time: the work permit while your green card is pending',
    intro: 'Pick the unit handling your work permit and enter its receipt date to see where the application stands against the latest published range.',
    resume: `The employment authorization document many green card applicants request is the (c)(9) category, filed on Form I-765 because Form I-485 is pending. In the USCIS edition of ${pubEn}, it is published at two units, the National Benefits Center and Service Center Operations, with upper bounds between ${n(c9lo)} and ${n(c9hi)} months; the upper bound is the time by which 80% of those applications were decided. The report to Congress for ${NATIONAL_MONTH} shows a much shorter national average for Form I-765, ${n(nat.months)} months. Both are accurate. The national figure averages every work permit decided in the month, across all categories, including some that USCIS publishes in weeks; the (c)(9) range describes only adjustment applicants. USCIS received ${n(nat.received)} work permit applications that month, more than any other form we track, and had ${n(nat.pending)} pending. The fee for a (c)(9) request filed with or after an I-485 submitted since April 1, 2024 is ${usd(F.withPendingI485Since2024, 'en')}.`,
    faqs: [
      { q: 'Why is the national I-765 average so much shorter than the (c)(9) range?', a: 'The report to Congress counts every Form I-765 decided in the month, whatever the eligibility category, and some categories move in weeks. The (c)(9) range covers only work permits based on a pending adjustment application, and it is published as a median and an 80% mark. Mixing the two would give a false picture of your own wait.' },
      { q: 'How much does a (c)(9) work permit cost with a pending I-485?', a: 'Under the G-1055 fee schedule, the fee is the reduced amount listed for applicants whose Form I-485 was filed with a fee on or after April 1, 2024 and is still pending. If the I-485 was filed with a fee between July 30, 2007 and March 31, 2024, the I-765 carries no fee. Our I-765 fee page shows the figures.' },
      { q: 'Can I start working before my (c)(9) work permit is approved?', a: 'The (c)(9) category gives permission to work once the card is approved, which is why its processing time matters to families who depend on a second income. This page describes the published wait and does not give legal advice; for questions about your current status or a job offer, speak to an immigration attorney or a DOJ-accredited representative.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Where (c)(9) sits among work permit categories</h2>
<p>USCIS publishes ${h.num(ALL.length)} work permit lines with a figure. Sorted by upper bound, the (c)(9) line ranks ${h.num(c9rank)} of ${h.num(ALL.length)}, counting from the fastest.</p>
${h.table(['Category as published', 'Unit', 'Upper bound'], sorted.map((r) => [r.subtype === '147-C9' ? `<strong>${r.info}</strong>` : r.info, r.office, `${m(r.max)} ${r.max === 1 ? 'month' : 'months'}`]), `USCIS publication of ${h.date(PUBLISHED)}. NBC: ${OFFICE_NAMES.NBC}; SCD: ${OFFICE_NAMES.SCD}.`, ['l', 'l', 'r'])}
<h2>Why the average looks optimistic</h2>
<p>The report to Congress for ${h.month(natYm)} gives ${m(nat.months)} months for all work permits. Lines that clear in weeks pull that average down; the (c)(9) line, at ${m(c9lo)} to ${m(c9hi)} months at the top of its range, does not. For an adjustment applicant, the relevant clock is the (c)(9) range, measured from the receipt date of the I-765 itself, which may differ from the I-485 receipt date when the two were not filed together.</p>
<h2>Timing a renewal</h2>
<p>Because the published range is long, a renewal filed late can leave a gap between the old card and the new one. The ${h.src('i765Form', 'Form I-765 page')} gives the current rules for when a renewal can be filed. The fee depends on when the I-485 was filed, as the ${h.a('i-765-fee', 'I-765 fee page')} shows.</p>`;
    },
  },
  es: {
    path: "tiempos-de-proceso/i-765",
    nav: 'Tiempo del permiso de trabajo', card: 'Cuánto tarda el permiso de trabajo (c)(9) mientras espera la green card, y cuánto cuesta.',
    title: 'I-765 permiso de trabajo 2026: tiempo de proceso (c)(9)',
    description: 'Cuánto tarda el permiso de trabajo I-765 (c)(9) en 2026 con un I-485 pendiente: el rango de USCIS, por qué el promedio nacional es más corto y la tarifa.',
    h1: 'Permiso de trabajo I-765: cuánto tarda con el I-485 pendiente',
    intro: 'Escriba la fecha de recibo de su I-765 y elija la unidad que lo tramita para ver cuánto lleva su permiso frente al rango publicado.',
    resume: `Quien ajusta su estatus en Estados Unidos, por ejemplo la esposa de un ciudadano que llegó con visa y espera su green card en Dallas, suele pedir un permiso de trabajo (Employment Authorization Document) con el formulario I-765 en la categoría (c)(9), basada en el I-485 pendiente. En la publicación de USCIS del ${pubEs}, esa categoría aparece en dos unidades, el Centro Nacional de Beneficios (National Benefits Center) y los centros de servicio, con una cifra alta de entre ${n(c9lo, 'es')} y ${n(c9hi, 'es')} meses: el plazo en que se resolvió el 80 % de los casos. El informe al Congreso de ${monthName(natYm, 'es')} da un promedio de ${n(nat.months, 'es')} meses para todos los permisos de trabajo. Las dos cifras son ciertas: el promedio mezcla todas las categorías, algunas muy rápidas. La tarifa del (c)(9) con un I-485 presentado desde el 1 de abril de 2024 es de ${usd(F.withPendingI485Since2024, 'es')}.`,
    faqs: [
      { q: '¿Cuánto tarda el permiso de trabajo si mi esposo es ciudadano y ajusto estatus?', a: 'El permiso de trabajo basado en un I-485 pendiente, categoría (c)(9), tiene su propio rango publicado por USCIS, independiente del I-485. Es el mismo para un caso por matrimonio que para otros casos de ajuste. La herramienta de arriba aplica el rango actual a la fecha de recibo de su I-765, que aparece en su aviso I-797C.' },
      { q: '¿Cuánto cuesta el permiso de trabajo I-765 con un I-485 en trámite?', a: 'Depende de cuándo presentó el I-485. Si lo presentó pagando la tarifa desde el 1 de abril de 2024 y sigue pendiente, paga la tarifa reducida del G-1055. Si lo presentó pagando entre el 30 de julio de 2007 y el 31 de marzo de 2024, el permiso no lleva tarifa. La tabla de esta página muestra los montos.' },
      { q: '¿Por qué mi vecina recibió su permiso de trabajo mucho más rápido?', a: 'Probablemente su permiso es de otra categoría. USCIS publica más de una docena de líneas para el I-765, por ejemplo para estudiantes, cónyuges de trabajadores temporales o solicitantes de asilo, y algunas se resuelven en semanas. El promedio nacional mezcla todas. Para quien ajusta estatus, la referencia es la línea (c)(9).' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Un permiso con su propio reloj</h2>
<p>Muchas familias suponen que el permiso de trabajo llega en pocas semanas porque eso le pasó a un conocido. Para la categoría (c)(9), la cifra alta publicada está hoy entre ${m(c9lo)} y ${m(c9hi)} meses, y ocupa el puesto ${h.num(c9rank)} de las ${h.num(ALL.length)} líneas del I-765 con cifra, contando desde la más rápida. El promedio de ${m(nat.months)} meses del informe de ${h.month(natYm)} incluye todas las categorías y por eso queda más bajo.</p>
<h2>Lo que paga según la fecha de su I-485</h2>
${h.table(['Situación', 'Tarifa del I-765'], [['I-485 presentado con tarifa desde el 1 de abril de 2024 y pendiente', h.usd(F.withPendingI485Since2024)], ['I-485 presentado con tarifa entre el 30 de julio de 2007 y el 31 de marzo de 2024', h.usd(F.withPendingI485Before2024)], ['Otras categorías, en papel', h.usd(F.paper)], ['Otras categorías, en línea', h.usd(F.online)]], `Formulario G-1055 de USCIS, edición del ${h.P.g1055_edition}.`, ['l', 'r'])}
<h2>Cuando el permiso tarda</h2>
<p>Si la fecha de recibo de su I-765 ya es igual o anterior a la fecha de consulta que publica USCIS para su unidad, la herramienta se lo indica: su caso está fuera del tiempo normal y puede enviar una consulta de caso (case inquiry). Antes de esa fecha, USCIS responde que el permiso sigue dentro de lo normal. Una consulta no garantiza una respuesta rápida.</p>
<h2>Cómo leer la fecha correcta</h2>
<p>Si presentó el I-765 junto con el I-485, los dos avisos suelen tener la misma fecha de recibo. Si lo presentó después, cuente desde la fecha del aviso del I-765. Esa es la que va en la herramienta. Para renovar, revise en la ${h.src('i765Form', 'página del formulario I-765')} cuándo se puede presentar la solicitud, y no espere al último mes: con rangos de más de un año, un retraso puede dejarle sin permiso vigente.</p>`;
    },
  },
});
