import { definePage } from '../../lib/guide-types';
import PR from '../../data/params-2026.json';
import { kindById, centerRows, OFFICES, PUBLISHED } from '../../lib/engine/ptimes';
import { formatNumber, formatMoney, displayDate } from '../../lib/format';

// Chiffres lus dans les données : I-129F (K-1 à K-4) à Service Center Operations, puis I-485 familial par bureau.
type L = 'en' | 'es';
const n = (x: number | null | undefined, l: L = 'en') => (x == null ? '—' : formatNumber(x, x % 1 ? 1 : 0, l));
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); const k = Math.floor(s.length / 2); return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
const k = centerRows(kindById('i129f')!)[0];
const famMed = median(Object.values(OFFICES).filter((o) => o.i485fam?.max != null).map((o) => o.i485fam!.max!));
const F = PR.fees;
const usd = (x: number, l: L) => formatMoney(x, 0, l);
const pubEn = displayDate(PUBLISHED, 'en-US');
const pubEs = displayDate(PUBLISHED, 'es-US');

export default definePage({
  id: "i-129f-processing-time", group: "times", order: 510, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i129f", "office": "HOU"},
  data: {"form": "i-129f"},
  related: ["processing-times", "k-1-visa-cost", "i-485-family-processing-time", "guide-aos-vs-consular"],
  sources: ["uscisTimes", "itData", "uscisData", "i129fForm", "consular", "dosFees", "g1055"],
  en: {
    path: "processing-times/i-129f",
    nav: 'I-129F / K-1 visa time', card: 'How long the fiancé(e) petition takes at USCIS, and the stages of a K-1 visa that have no published time.',
    title: 'I-129F Processing Time 2026: K-1 Fiancé Visa at USCIS',
    description: 'K-1 visa processing time in 2026: the USCIS range for Form I-129F, the steps after approval with no published wait, the fees and the green card after marriage.',
    h1: 'I-129F processing time and the K-1 fiancé(e) visa',
    intro: 'Enter the receipt date of your I-129F to see how far the petition has come against the range USCIS publishes for fiancé(e) and spouse K visas.',
    resume: `A U.S. citizen who wants to bring a fiancé or fiancée from abroad to marry in the United States starts with Form I-129F, the petition for an alien fiancé(e). USCIS publishes one line for it at Service Center Operations, covering K-1 fiancé(e)s and the related K-2, K-3 and K-4 categories. In the edition of ${pubEn}, the range is ${n(k.min)} to ${n(k.max)} months: the median petition was decided in ${n(k.min)} months and 80% within ${n(k.max)}. Case inquiries are accepted for receipts up to ${displayDate(k.inquiry!, 'en-US')}. That is only the USCIS part of a K-1 visa. After approval, the case moves to the State Department for the visa interview abroad, a stage for which no wait is published that we can use. The I-129F fee is ${usd(F.i129f.paper, 'en')} on paper, and the State Department charges ${usd(F.dosK.amount, 'en')} for the K visa. After arrival and the wedding, the green card application is a family-based I-485 with its own processing time.`,
    faqs: [
      { q: 'How long does a K-1 visa take from start to finish?', a: 'Only part of it can be measured. USCIS publishes a range for Form I-129F, shown on this page. The consular stage that follows, from approval to the interview and visa, has no published time we can use. After entry, the couple marries and files a family-based Form I-485, which has its own range at each field office.' },
      { q: 'Does the I-129F processing time include the K-1 visa interview?', a: 'No. The published range ends with the USCIS decision on the petition. The interview at a U.S. embassy or consulate is handled by the State Department, which does not publish a comparable processing time. Any total wait quoted for a K-1 visa therefore combines the USCIS figure with estimates that are not official.' },
      { q: 'What must a K-1 petition show about the wedding?', a: 'The I-129F checklist on uscis.gov asks for evidence that you and your fiancé(e) intend to marry within 90 days of their admission to the United States as a K-1 nonimmigrant. The 90 days count from entry, not from the approval of the petition, so the processing time on this page does not reduce that window.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Three stages, one with a published time</h2>
${h.table(['Stage', 'Who handles it', 'Published time', 'Fee'], [['Form I-129F petition', 'USCIS, Service Center Operations', `${m(k.min)} to ${m(k.max)} months`, h.usd(F.i129f.paper)], ['K-1 visa interview abroad', 'State Department', 'Not published', h.usd(F.dosK.amount)], ['Green card after the wedding (I-485)', 'USCIS field office', `${m(famMed)} months at the median office (80% mark)`, h.usd(F.i485.paper)]], `USCIS publication of ${h.date(PUBLISHED)}; fees from Form G-1055 and the State Department.`, ['l', 'l', 'r', 'r'])}
<p>Only the first and last rows have official figures. Sites that quote a single K-1 total are adding the middle stage from their own estimates.</p>
<h2>The 90-day window does not move</h2>
<p>The petition must show the intent to marry within 90 days of admission as a K-1. That window starts when the fiancé(e) enters the United States, so a slow I-129F does not eat into it. What a slow petition does affect is everything planned around the arrival: leases, jobs, the wedding date.</p>
<h2>Checking a petition that seems slow</h2>
<p>Enter the receipt date from the I-797C notice in the checker. It shows the months elapsed and compares them with the median and the 80% mark. Once the receipt date is on or before ${h.date(k.inquiry!)}, the inquiry date in the current edition, USCIS treats the petition as outside normal processing time and accepts a case inquiry. Before that date, the petition counts as within the published range, however long the separation feels.</p>
<h2>After the wedding</h2>
<p>Once married, the couple files Form I-485 at the field office for their address, and its range varies from office to office. The ${h.a('i-485-family-processing-time', 'family I-485 page')} lists them. The ${h.a('k-1-visa-cost', 'K-1 visa cost page')} adds up every fee along the way, and the ${h.src('i129fForm', 'Form I-129F page')} gives the current edition.</p>`;
    },
  },
  es: {
    path: "tiempos-de-proceso/i-129f",
    nav: 'Tiempo de la visa K-1', card: 'Cuánto tarda la petición de prometido(a) I-129F y qué etapas de la visa K-1 no tienen tiempo publicado.',
    title: 'Visa K-1 tiempo de proceso 2026: petición I-129F de USCIS',
    description: 'Cuánto tarda la visa K-1 de prometido(a) en 2026: el rango de USCIS para la petición I-129F, la entrevista consular, las tarifas y la residencia tras la boda.',
    h1: 'Visa de prometido(a) K-1: cuánto tarda la petición I-129F',
    intro: 'Escriba la fecha de recibo de su I-129F para ver cuánto lleva la petición frente al rango que publica USCIS para las visas K.',
    resume: `Un ciudadano estadounidense que quiere casarse en Estados Unidos con su novia de Guadalajara o su novio de Bogotá empieza con el formulario I-129F, la petición de prometido(a) extranjero (Petition for Alien Fiancé(e)). USCIS lo publica en una sola línea de los centros de servicio, que incluye la visa K-1 y las categorías K-2, K-3 y K-4. En la publicación del ${pubEs}, el rango es de ${n(k.min, 'es')} a ${n(k.max, 'es')} meses: la mitad de las peticiones se decidió antes de ${n(k.min, 'es')} meses y el 80 % antes de ${n(k.max, 'es')}. Después de la aprobación, el caso pasa al Departamento de Estado para la entrevista en el consulado, una etapa sin tiempo publicado que podamos usar. La petición cuesta ${usd(F.i129f.paper, 'es')} y la visa K, ${usd(F.dosK.amount, 'es')}. Tras la llegada y la boda, la residencia se pide con el I-485 por familia, que tiene su propio tiempo en cada oficina de USCIS.`,
    faqs: [
      { q: '¿Cuánto tarda la visa K-1 para mi prometida que vive en México?', a: 'Solo la parte de USCIS tiene un tiempo oficial: el rango del I-129F que muestra esta página. La entrevista en el consulado de Ciudad Juárez o en otro consulado depende del Departamento de Estado, que no publica un tiempo comparable. Desconfíe de quien le prometa una fecha exacta para todo el proceso.' },
      { q: '¿En cuántos días hay que casarse después de llegar con la visa K-1?', a: 'La lista de requisitos del I-129F en uscis.gov pide pruebas de que la pareja tiene la intención de casarse dentro de los 90 días siguientes a la admisión del prometido o la prometida en Estados Unidos con la visa K-1. Los 90 días se cuentan desde la entrada al país, no desde la aprobación de la petición.' },
      { q: '¿La visa K-1 conviene más que pedir a mi esposa con el I-130?', a: 'Son caminos distintos con tiempos y costos distintos, y la elección depende de la situación de cada pareja. Esta página no da asesoría legal. Compare el rango del I-129F con el del I-130 para cónyuges en la página de tiempos del I-130, y consulte a un abogado de inmigración o a un representante acreditado antes de decidir.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Lo que se sabe y lo que no</h2>
<p>De las tres etapas de una visa K-1, dos tienen cifras oficiales de USCIS y una no tiene ninguna. La petición I-129F está hoy en ${m(k.min)} a ${m(k.max)} meses, con consultas aceptadas para recibos hasta el ${h.date(k.inquiry!)}. La entrevista en el consulado no tiene un tiempo publicado. El ajuste de estatus después de la boda depende de la oficina: la oficina típica de las 90 publica ${m(famMed)} meses como cifra alta.</p>
${h.table(['Pago', 'Monto'], [['Petición I-129F (USCIS)', h.usd(F.i129f.paper)], ['Visa K (Departamento de Estado)', h.usd(F.dosK.amount)], ['Ajuste de estatus I-485 después de la boda, en papel', h.usd(F.i485.paper)]], `Formulario G-1055 de USCIS y tarifas del Departamento de Estado.`, ['l', 'r'])}
<h2>Planear la boda</h2>
<p>Como los 90 días para casarse empiezan con la entrada a Estados Unidos, la boda se puede planear alrededor de la llegada, no de la aprobación. Lo que una petición lenta sí afecta es todo lo demás: el trabajo, la renta, los boletos. Use la herramienta con la fecha de su aviso I-797C para saber si ya puede pedir una consulta de caso.</p>
<h2>Si la petición parece detenida</h2>
<p>Mientras la fecha de recibo sea posterior a la fecha de consulta que publica USCIS, la petición se considera dentro del tiempo normal, aunque la pareja lleve meses separada. Cuando la herramienta indique que ya pasó esa fecha, el ciudadano peticionario puede enviar una consulta de caso (case inquiry) a USCIS.</p>
<h2>Después de casarse</h2>
<p>El siguiente paso es el ${h.a('i-485-family-processing-time', 'I-485 por familia')}, en la oficina que corresponde a su domicilio. La página del ${h.a('k-1-visa-cost', 'costo de la visa K-1')} suma todas las tarifas.</p>`;
    },
  },
});
