import { definePage } from '../../lib/guide-types';
import PR from '../../data/params-2026.json';
import { kindById, centerRows, PUBLISHED } from '../../lib/engine/ptimes';
import { formatNumber, formatMoney, displayDate } from '../../lib/format';

// Chiffres lus dans les données : I-90 renouvellement (140B) et remplacement (140A), Service Center Operations.
type L = 'en' | 'es';
const n = (x: number | null | undefined, l: L = 'en') => (x == null ? '—' : formatNumber(x, x % 1 ? 1 : 0, l));
const renew = centerRows(kindById('i90renew')!)[0];
const repl = centerRows(kindById('i90replace')!)[0];
const renewSlower = renew.max! > repl.max!;
const F = PR.fees.i90;
const usd = (x: number, l: L) => formatMoney(x, 0, l);
const pubEn = displayDate(PUBLISHED, 'en-US');
const pubEs = displayDate(PUBLISHED, 'es-US');

export default definePage({
  id: "i-90-processing-time", group: "times", order: 509, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i90renew", "office": "HOU"},
  data: {"form": "i-90"},
  related: ["processing-times", "i-90-fee", "i-751-processing-time", "n-400-processing-time"],
  sources: ["uscisTimes", "itData", "uscisData", "i90Form", "g1055"],
  en: {
    path: "processing-times/i-90",
    nav: 'I-90 card renewal time', card: 'How long a ten-year green card renewal or a replacement card takes, as USCIS publishes it.',
    title: 'I-90 Processing Time 2026: Green Card Renewal Wait',
    description: 'I-90 processing time in 2026: the USCIS range for renewing a ten-year green card and for replacing a lost, stolen or damaged one, with inquiry dates and fees.',
    h1: 'I-90 processing time for green card renewal and replacement',
    intro: 'Choose renewal or replacement, enter the receipt date of your I-90, and see how the application compares with the range USCIS publishes.',
    resume: `Form I-90 is the application a permanent resident uses to renew a ten-year green card or to replace one that was lost, stolen, damaged or never received. USCIS publishes two lines for it at Service Center Operations. In the edition of ${pubEn}, the ten-year renewal shows ${n(renew.min)} to ${n(renew.max)} months, with case inquiries accepted for receipts up to ${displayDate(renew.inquiry!, 'en-US')}. Initial issuance or replacement shows ${n(repl.min)} to ${n(repl.max)} months, with inquiries for receipts up to ${displayDate(repl.inquiry!, 'en-US')}. The first figure of each pair is the median and the second the time by which 80% of applications were decided. ${renewSlower ? 'A routine renewal currently takes longer than replacing a lost card. ' : ''}The monthly report to Congress has no line for the I-90, so the published ranges are the only official measure. The fee is ${usd(F.paper, 'en')} on paper or ${usd(F.online, 'en')} online, under the G-1055 schedule.`,
    faqs: [
      { q: 'Is an I-90 renewal slower than an I-90 replacement?', a: 'USCIS publishes the ten-year renewal and the replacement or initial card as two separate lines, each with its own median and 80% figure, and the two do not move together. The table on this page shows both. USCIS does not explain the difference on its processing-times tool, so we do not attribute a cause.' },
      { q: 'Does an expired green card mean I am no longer a permanent resident?', a: 'No. The card is evidence of status, not the status itself. USCIS does say on the Form I-90 page that a permanent resident must carry a valid, unexpired green card or equivalent documentation at all times, which is why the renewal processing time matters. For travel or work questions while the card is being renewed, ask an immigration attorney.' },
      { q: 'Is the I-90 the right form for a two-year conditional green card?', a: 'A conditional resident with a two-year card is in a different process: the conditions are removed with Form I-751, filed in the 90 days before the conditional residence expires, and that petition has its own processing time. Our I-751 page covers it. If you are unsure which card you hold, the card itself shows its validity period.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Renewal and replacement side by side</h2>
${h.table(['Request', 'Median', '80% of cases', 'Inquiries for receipts up to', 'Fee, paper / online'], [['Ten-year renewal', `${m(renew.min)} months`, `${m(renew.max)} months`, h.date(renew.inquiry!), `${h.usd(F.paper)} / ${h.usd(F.online)}`], ['Initial issuance or replacement', `${m(repl.min)} months`, `${m(repl.max)} months`, h.date(repl.inquiry!), `${h.usd(F.paper)} / ${h.usd(F.online)}`]], `USCIS publication of ${h.date(PUBLISHED)}; fees from Form G-1055, edition ${h.P.g1055_edition}.`, ['l', 'r', 'r', 'l', 'r'])}
<p>${renewSlower ? `The routine case is the slower one: a renewal reaches its 80% mark ${m(renew.max! - repl.max!)} months after a replacement does.` : 'The two lines are close in the current edition.'} USCIS does not explain the gap on its tool. Both lines are published by Service Center Operations, and both are measured from the receipt date to a decision on the application.</p>
<h2>Counting from the right day</h2>
<p>Enter the receipt date printed on the I-797C notice, or shown in your USCIS account for an online filing. The checker then tells you how many months have passed and whether the case has reached the inquiry date. A renewal filed a few weeks before the card expires will, at the current range, still be pending well after the expiry date, which is worth knowing before a trip or a job change.</p>
<h2>Where the I-90 fits</h2>
<p>The I-90 has no queue behind it: there is no Visa Bulletin cutoff and no priority date to wait for. Its processing time is the whole wait, which makes the published range a fairly direct guide. Residents who qualify for citizenship can compare it with the ${h.a('n-400-processing-time', 'N-400 processing time')}: naturalization replaces the green card with a certificate and ends the renewal cycle. The ${h.src('i90Form', 'Form I-90 page')} lists the current edition.</p>`;
    },
  },
  es: {
    path: "tiempos-de-proceso/i-90",
    nav: 'Tiempo del I-90', card: 'Cuánto tarda renovar la green card de diez años o reemplazar una tarjeta perdida, con la tarifa.',
    title: 'I-90 renovación de green card 2026: tiempo de USCIS',
    description: 'Cuánto tarda renovar la green card en 2026 con el I-90: el rango de USCIS para la tarjeta de diez años y para reemplazar una perdida, con consultas y tarifa.',
    h1: 'Renovar la green card con el I-90: cuánto tarda',
    intro: 'Elija renovación o reemplazo, escriba la fecha de recibo de su I-90 y compárela con el rango que publica USCIS.',
    resume: `El formulario I-90 sirve para renovar la tarjeta de residente permanente de diez años o para reemplazar una tarjeta perdida, robada o dañada. Es el trámite típico de un residente que vive en Chicago o en San Antonio y ve que su tarjeta vence en unos meses. En la publicación de USCIS del ${pubEs}, la renovación de diez años tiene un rango de ${n(renew.min, 'es')} a ${n(renew.max, 'es')} meses y el reemplazo, de ${n(repl.min, 'es')} a ${n(repl.max, 'es')} meses: la primera cifra es el caso mediano y la segunda, el plazo en que se resolvió el 80 % de los casos. ${renewSlower ? 'Hoy la renovación tarda más que el reemplazo. ' : ''}El informe mensual al Congreso no incluye el I-90, así que el rango publicado es la única cifra oficial. USCIS recuerda en la página del formulario que el residente debe llevar consigo una tarjeta vigente o un documento equivalente en todo momento. La tarifa es de ${usd(F.paper, 'es')} en papel y ${usd(F.online, 'es')} en línea.`,
    faqs: [
      { q: '¿Puedo viajar a México mientras USCIS renueva mi green card con el I-90?', a: 'USCIS exige llevar una tarjeta vigente o un documento equivalente en todo momento, y la renovación puede tardar más de lo que dura un viaje planeado. Antes de salir con la tarjeta vencida o por vencer, consulte a un abogado de inmigración o a un representante acreditado. Esta página solo muestra los tiempos publicados y no es asesoría legal.' },
      { q: '¿Mi residencia se pierde si mi tarjeta del I-90 vence antes de la renovación?', a: 'No. La tarjeta es la prueba de su estatus de residente permanente, no el estatus en sí. Vencida, la tarjeta deja de servirle como documento vigente, y por eso conviene presentar el I-90 con tiempo. La herramienta de esta página le muestra cuánto lleva su solicitud según la fecha de recibo de su aviso.' },
      { q: '¿Cuánto cuesta renovar la tarjeta de residente con el formulario I-90?', a: `Según el formulario G-1055 de 2026, el I-90 cuesta ${usd(F.paper, 'es')} si lo presenta en papel y ${usd(F.online, 'es')} si lo presenta en línea. El precio es el mismo para la renovación de diez años y para el reemplazo. La página de la tarifa del I-90 tiene el detalle y otros casos.` },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Renovar con tiempo</h2>
<p>Con una cifra alta de ${m(renew.max)} meses para la renovación, quien presenta el I-90 pocas semanas antes del vencimiento probablemente tendrá la tarjeta vencida durante una parte de la espera. Las dos líneas que publica USCIS:</p>
${h.table(['Trámite', 'Rango publicado', 'Consultas para recibos hasta'], [['Renovación de la tarjeta de diez años', `${m(renew.min)} a ${m(renew.max)} meses`, h.date(renew.inquiry!)], ['Reemplazo o primera tarjeta', `${m(repl.min)} a ${m(repl.max)} meses`, h.date(repl.inquiry!)]], `Publicación de USCIS del ${h.date(PUBLISHED)}, centros de servicio.`, ['l', 'r', 'l'])}
<p>USCIS no explica en su herramienta por qué una línea tarda más que la otra; nosotros tampoco lo suponemos.</p>
<h2>Si su tarjeta es de dos años</h2>
<p>La tarjeta condicional de dos años, la que se recibe por un matrimonio reciente, no se renueva con el I-90: las condiciones se quitan con el ${h.a('i-751-processing-time', 'formulario I-751')}, que tiene su propio tiempo. Se presenta durante los 90 días anteriores al vencimiento de la residencia condicional.</p>
<h2>Qué fecha escribir</h2>
<p>Use la fecha de recibo del aviso I-797C, o la que aparece en su cuenta de USCIS si presentó en línea. La herramienta le dice cuántos meses lleva su solicitud y si ya pasó la fecha a partir de la cual USCIS acepta una consulta de caso.</p>
<h2>Una alternativa a renovar cada diez años</h2>
<p>Si usted ya cumple los requisitos de la naturalización, la ciudadanía reemplaza la tarjeta por un certificado y termina con las renovaciones. Compare el tiempo del I-90 con el del ${h.a('n-400-processing-time', 'N-400')} en su oficina, y lea la ${h.src('i90Form', 'página oficial del formulario I-90')}.</p>`;
    },
  },
});
