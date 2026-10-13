import { definePage } from '../../lib/guide-types';
import PR from '../../data/params-2026.json';
import { kindById, centerRows, OFFICES, PUBLISHED } from '../../lib/engine/ptimes';
import { formatNumber, formatMoney, displayDate } from '../../lib/format';

// Chiffres lus dans les données : I-131 advance parole et permis de retour (Service Center Operations).
type L = 'en' | 'es';
const n = (x: number | null | undefined, l: L = 'en') => (x == null ? '—' : formatNumber(x, x % 1 ? 1 : 0, l));
const ap = centerRows(kindById('i131ap')!)[0];
const re = centerRows(kindById('i131re')!)[0];
const fam = Object.values(OFFICES).filter((o) => o.i485fam?.max != null);
const famFaster = fam.filter((o) => o.i485fam!.max! < ap.max!).length;
const F = PR.fees.i131;
const usd = (x: number, l: L) => formatMoney(x, 0, l);
const pubEn = displayDate(PUBLISHED, 'en-US');
const pubEs = displayDate(PUBLISHED, 'es-US');

export default definePage({
  id: "i-131-processing-time", group: "times", order: 506, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i131ap", "office": "HOU"},
  data: {"form": "i-131"},
  related: ["processing-times", "i-131-fee", "i-485-family-processing-time", "guide-n400-residence"],
  sources: ["uscisTimes", "itData", "uscisData", "i131Form", "g1055", "legalHelp"],
  en: {
    path: "processing-times/i-131",
    nav: 'I-131 advance parole time', card: 'Advance parole and re-entry permit times as USCIS publishes them, set against the green card case they travel with.',
    title: 'I-131 Processing Time 2026: Advance Parole and Re-entry',
    description: 'I-131 processing time in 2026: the advance parole range for pending green card cases, the re-entry permit for residents, and how both compare with the I-485.',
    h1: 'I-131 processing time for advance parole and re-entry permits',
    intro: 'Choose advance parole or the re-entry permit, enter the receipt date of your I-131, and compare it with the range USCIS currently publishes.',
    resume: `Form I-131 covers two very different travel documents, and USCIS publishes each separately at Service Center Operations. Advance parole, the document many adjustment applicants request so they can travel while Form I-485 is pending, shows a range of ${n(ap.min)} to ${n(ap.max)} months in the edition of ${pubEn}, with case inquiries accepted for receipts up to ${displayDate(ap.inquiry!, 'en-US')}. The re-entry permit, requested by green card holders who plan a long stay abroad, shows ${n(re.min)} to ${n(re.max)} months. In each case the first figure is the median and the second the time by which 80% of applications were decided. No national average for Form I-131 appears in the monthly report to Congress, so the published ranges are the only official measure. A striking comparison: at ${n(famFaster)} of the 90 field offices, the upper bound for a family-based I-485 is shorter than the upper bound for advance parole, so the green card itself can arrive before the travel document requested alongside it. The paper fee for advance parole is ${usd(F.advanceParolePaper, 'en')}.`,
    faqs: [
      { q: 'Can advance parole take longer than the I-485 it was filed with?', a: 'It can. USCIS publishes advance parole at one unit with a long range, while family-based I-485 ranges vary by field office and some are shorter. If the green card is approved first, the pending travel document no longer matters for most travel, because the card itself is the entry document for a permanent resident.' },
      { q: 'How long does a re-entry permit take compared with advance parole?', a: 'USCIS publishes the re-entry permit and refugee travel document as one line, separate from advance parole, with its own median and 80% figure. The re-entry permit is for people who already hold a green card and plan a long absence; it cannot be filed online, according to the Form I-131 page.' },
      { q: 'What does the I-131 advance parole fee depend on?', a: 'The G-1055 schedule lists a paper fee and a lower online fee for advance parole. Applicants whose Form I-485 was filed with a fee before April 1, 2024 and is still pending pay no fee for advance parole. Our I-131 fee page shows the current amounts and the re-entry permit fee.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Two documents on one form</h2>
${h.table(['Document', 'Who asks for it', 'Published range', 'Inquiries for receipts up to', 'Paper fee'], [['Advance parole', 'Applicant with a pending I-485', `${m(ap.min)} to ${m(ap.max)} months`, h.date(ap.inquiry!), h.usd(F.advanceParolePaper)], ['Re-entry permit or refugee travel document', 'Green card holder planning a long absence, or refugee', `${m(re.min)} to ${m(re.max)} months`, h.date(re.inquiry!), h.usd(F.reentryPermitPaper)]], `USCIS publication of ${h.date(PUBLISHED)}; fees from Form G-1055, edition ${h.P.g1055_edition}.`, ['l', 'l', 'r', 'l', 'r'])}
<p>The fee for the re-entry permit is the same as for advance parole on paper, but only advance parole can be filed online, at ${h.usd(F.advanceParoleOnline)}.</p>
<h2>When the travel document is the slow part</h2>
<p>Adjustment applicants often file Forms I-485, I-765 and I-131 the same day and expect them to move together. They do not. Advance parole is published with an upper bound of ${m(ap.max)} months, and ${h.num(famFaster)} of the 90 field offices publish a shorter upper bound for the family I-485. In those areas, a family planning a trip around the travel document may find the green card arrives first. Elsewhere, the reverse holds. Check both lines for your situation in the checker.</p>
<h2>Long stays abroad after the green card</h2>
<p>For permanent residents, the re-entry permit is the document USCIS lists on the ${h.src('i131Form', 'Form I-131 page')} for long absences. Time abroad also counts against continuous residence for naturalization: an absence of more than six months creates a presumption of a break, and one year or more breaks it, as our ${h.a('guide-n400-residence', 'residence guide')} explains. Travel plans with an application pending are a good moment to consult an immigration attorney or a DOJ-accredited representative.</p>`;
    },
  },
  es: {
    path: "tiempos-de-proceso/i-131",
    nav: 'Tiempo del advance parole', card: 'Cuánto tarda el permiso de viaje (advance parole) y el permiso de reingreso, con su tarifa.',
    title: 'Advance parole I-131 2026: tiempo de proceso de USCIS',
    description: 'Cuánto tarda el advance parole (I-131) en 2026 si espera la green card, y el permiso de reingreso para residentes: rangos de USCIS, tarifas y cómo planear.',
    h1: 'Advance parole y permiso de reingreso: cuánto tarda el I-131',
    intro: 'Elija advance parole o permiso de reingreso, escriba la fecha de recibo de su I-131 y compárela con el rango que publica USCIS.',
    resume: `Con el formulario I-131 se piden dos documentos de viaje distintos. El primero es el permiso de viaje anticipado (advance parole), que solicita quien tiene un I-485 pendiente y necesita salir del país, por ejemplo para visitar a una madre enferma en San Salvador o en Guatemala. En la publicación de USCIS del ${pubEs}, su rango es de ${n(ap.min, 'es')} a ${n(ap.max, 'es')} meses: la mitad de los casos se resolvió antes de la primera cifra y el 80 % antes de la segunda. El segundo es el permiso de reingreso (re-entry permit), para residentes permanentes que pasarán una temporada larga fuera, con un rango de ${n(re.min, 'es')} a ${n(re.max, 'es')} meses. El informe mensual al Congreso no da un promedio para el I-131, así que el rango publicado es la única cifra oficial. La tarifa del advance parole en papel es de ${usd(F.advanceParolePaper, 'es')} y en línea de ${usd(F.advanceParoleOnline, 'es')}.`,
    faqs: [
      { q: '¿Puedo viajar a México o Centroamérica mientras espero el advance parole?', a: 'Salir del país con un I-485 pendiente sin un documento de viaje aprobado puede tener consecuencias graves para el caso. Antes de comprar un boleto, hable con un abogado de inmigración con licencia o con un representante acreditado por el Departamento de Justicia. Esta página solo muestra el tiempo publicado por USCIS y no es asesoría legal.' },
      { q: '¿Cuánto cuesta el advance parole si mi I-485 es de antes de abril de 2024?', a: 'Según el formulario G-1055, quien presentó el I-485 pagando la tarifa antes del 1 de abril de 2024, y lo tiene pendiente, no paga por el advance parole. Para un I-485 presentado desde esa fecha, se paga la tarifa en papel o la tarifa en línea, que es más baja. La tabla de esta página muestra los montos.' },
      { q: '¿Para qué sirve el permiso de reingreso de un residente permanente?', a: 'Es el documento que USCIS ofrece con el mismo formulario I-131 a residentes que planean una ausencia larga de Estados Unidos. Se presenta solo en papel. Tenga en cuenta que las ausencias largas también cuentan para la ciudadanía: más de seis meses fuera crean la presunción de que se rompió la residencia continua.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Planear un viaje con estas cifras</h2>
<p>Con una cifra alta de ${m(ap.max)} meses, el advance parole no sirve para una emergencia que llega sin aviso. Muchas familias lo piden junto con el I-485, precisamente para tenerlo listo cuando haga falta. Si ya lo presentó, la herramienta de arriba le dice cuántos meses lleva y desde qué fecha USCIS acepta una consulta: hoy, para recibos hasta el ${h.date(ap.inquiry!)}.</p>
<h2>Lo que cuesta cada documento</h2>
${h.table(['Documento', 'Papel', 'En línea'], [['Advance parole, I-485 presentado desde el 1 de abril de 2024', h.usd(F.advanceParolePaper), h.usd(F.advanceParoleOnline)], ['Advance parole, I-485 presentado con tarifa antes del 1 de abril de 2024', h.usd(F.withPendingI485Before2024), h.usd(F.withPendingI485Before2024)], ['Permiso de reingreso', h.usd(F.reentryPermitPaper), 'No disponible']], `Formulario G-1055 de USCIS, edición del ${h.P.g1055_edition}.`, ['l', 'r', 'r'])}
<h2>Cuando la green card llega primero</h2>
<p>En ${h.num(famFaster)} de las 90 oficinas locales, la cifra alta del I-485 por familia es menor que la del advance parole. En esas zonas, la residencia puede aprobarse antes que el permiso de viaje. Con la tarjeta de residente en la mano, se viaja como residente permanente. Compare las dos líneas en la página del ${h.a('i-485-family-processing-time', 'tiempo del I-485 por familia')}.</p>
<h2>Qué fecha escribir en la herramienta</h2>
<p>Use la fecha de recibo del aviso I-797C del I-131, no la del I-485, aunque los haya enviado en el mismo paquete. Cuando la herramienta le diga que su caso ya pasó la fecha de consulta, puede pedir a USCIS que lo revise (case inquiry); antes de esa fecha, la respuesta será que el trámite sigue dentro del tiempo normal.</p>`;
    },
  },
});
