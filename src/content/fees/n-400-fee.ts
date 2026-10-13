import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';

// Tarifs N-400 du G-1055 (édition 10/07/26) et règles de résidence lus dans params-2026.json, jamais tapés.
const F = P.fees;
const N = P.naturalization;
const en = (n: number) => formatMoney(n, 0, 'en');
const es = (n: number) => formatMoney(n, 0, 'es');
const half = F.n400.paper - F.n400.reduced;
const onlineSave = F.n400.paper - F.n400.online;
const couple = 2 * F.n400.paper;

export default definePage({
  id: "n-400-fee", group: "fees", order: 604, parent: "fees",
  tool: {"kind": "fees", "path": "n400"},
  data: {"fees": "n400"},
  related: ["fees", "n-400-early-filing-calculator", "n-400-processing-time", "guide-n400-residence", "i-90-fee"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "n400Form", "n400Residence", "n400Presence", "legalHelp", "cfr320_2"],
  en: {
    path: "fees/n-400",
    nav: 'N-400 fee', card: 'The citizenship application fee on paper, online and at the reduced rate for lower household incomes.',
    title: 'N-400 Fee 2026: Citizenship Application Fee Paper or Online',
    description: 'The N-400 fee in 2026 under the G-1055 of 10/07/26: paper, online and the reduced citizenship application fee for households at or under 400% of poverty.',
    h1: 'The N-400 fee: three prices for the same application',
    intro: 'Tell the calculator how you will file and whether your household income qualifies for the reduced rate to see your citizenship fee.',
    resume: `The citizenship application fee for Form N-400 is ${en(F.n400.paper)} on paper and ${en(F.n400.online)} when filed online, under the USCIS fee schedule G-1055 dated ${P.g1055_edition}. A reduced fee of ${en(F.n400.reduced)}, half the paper price, applies when household income is at or below 400% of the federal poverty guidelines, and it can only be requested on a paper filing. That makes the online discount and the income discount mutually exclusive: an applicant who qualifies for the reduced rate saves ${en(half)} by mailing the form, while one who does not saves ${en(onlineSave)} by filing online. The current schedule has no separate biometrics charge on top of the N-400. Each spouse files and pays separately, so a married couple naturalizing together pays ${en(couple)} on paper at the standard rate. The fee is the same for the five-year and the three-year spouse-of-citizen routes.`,
    faqs: [
      { q: 'Who qualifies for the reduced N-400 fee in 2026?', a: `Applicants whose household income is at or below 400% of the federal poverty guidelines for their household size. The reduced fee is ${en(F.n400.reduced)} and is available only when the N-400 is filed on paper with proof of income. The poverty guidelines change every year, so check the current table on the USCIS N-400 page before you claim it.` },
      { q: 'Is the N-400 fee refunded if my citizenship application is denied?', a: `USCIS fees pay for the review of the application, not for an approval, so a denied N-400 does not bring the money back. That is one reason to check residence and physical presence before filing: the ${N.earlyFilingDays}-day early filing window and the ${N.physicalPresenceDays5}-day presence rule are the two points our calculator tests first.` },
      { q: 'Does the N-400 citizenship fee include fingerprints and the interview?', a: `Yes, as far as the schedule goes. The G-1055 dated ${P.g1055_edition} lists no separate biometric services fee for the N-400, and the interview and oath ceremony carry no extra USCIS charge. What is not included is any help you pay for: an attorney, an accredited representative or a class for the civics test.` },
      { q: 'Is it cheaper to naturalize or to keep renewing a green card?', a: `In fees alone, a ten-year green card renewal on Form I-90 costs ${en(F.i90.paper)} on paper, while the N-400 costs ${en(F.n400.paper)} once. The choice is rarely about money: citizenship brings the vote, a U.S. passport and petitions for parents, married children and siblings that a resident cannot file, and it ends the risk tied to long trips abroad.` },
    ],
    body: (h) => `
<h2>One form, three price tags</h2>
<p>Most USCIS forms have two prices, paper and online. The N-400 has three. ${h.usd(F.n400.paper)} is the standard paper fee, ${h.usd(F.n400.online)} the online fee, and ${h.usd(F.n400.reduced)} the reduced fee for households at or below 400% of the federal poverty guidelines. The catch sits in the last line of the ${h.src('g1055', 'fee schedule')}: the reduced rate is paper only. Someone who qualifies and files online out of habit pays ${h.usd(F.n400.online - F.n400.reduced)} more than necessary.</p>
${h.table(['How you file', 'Fee', 'Saving against paper'], [
  ['Paper, standard', h.usd(F.n400.paper), h.usd(0)],
  ['Online, standard', h.usd(F.n400.online), h.usd(onlineSave)],
  ['Paper, reduced (income at or under 400% of poverty)', h.usd(F.n400.reduced), h.usd(half)],
], `Form G-1055, edition ${P.g1055_edition}.`, ['l', 'r', 'r'])}
<h2>Paying for an application that is not ready</h2>
<p>A citizenship fee buys a decision, not a certificate. Filing more than ${N.earlyFilingDays} days before the five-year mark (three years for the spouse of a citizen) or with fewer than ${N.physicalPresenceDays5} days inside the country in the last five years (${N.physicalPresenceDays3} on the three-year route) is the most common way to lose the money. The ${h.a('n-400-early-filing-calculator', 'early filing calculator')} counts both from your trips, and the ${h.a('guide-n400-residence', 'residence guide')} explains why a trip of more than six months raises questions.</p>
<h2>Couples and families</h2>
<p>There is no family rate. Each spouse files a separate N-400 and pays a separate fee. Under 8 CFR 320.2, children under 18 who hold a green card and reside in the United States in the legal and physical custody of the citizen parent become citizens automatically when that parent naturalizes; their proof of citizenship is a different form with a different fee, not covered here.</p>
<h2>After you pay</h2>
<p>The wait that follows depends on your field office; see the ${h.a('n-400-processing-time', 'N-400 processing time')} by office. If your case involves arrests, long absences or a past immigration problem, a licensed immigration attorney or a ${h.src('legalHelp', 'DOJ-accredited representative')} should look at it before the fee is spent.</p>`,
  },
  es: {
    path: "costos/n-400",
    nav: 'Costo de la ciudadanía', card: 'Lo que cuesta pasar de residente a ciudadano: N-400 en papel, en línea o con tarifa reducida.',
    title: 'Costo de la ciudadanía americana 2026: tarifa del N-400',
    description: 'Costo de la ciudadanía americana en 2026: el N-400 en papel, en línea o con la tarifa reducida, y lo que gana su familia en México al hacerse ciudadano.',
    h1: 'Cuánto cuesta hacerse ciudadano de Estados Unidos',
    intro: 'Elija cómo va a presentar la solicitud y si sus ingresos califican para la tarifa reducida para ver su costo exacto.',
    resume: `La solicitud de naturalización (Form N-400) cuesta ${es(F.n400.paper)} en papel y ${es(F.n400.online)} en línea según la tabla de tarifas G-1055 de USCIS del ${P.g1055_edition}. Si los ingresos de su hogar no pasan del 400 % del nivel federal de pobreza (federal poverty guidelines), puede pagar ${es(F.n400.reduced)}, la mitad, pero solo si envía el formulario en papel. No hay cobro aparte por huellas digitales ni por la ceremonia. Cada persona paga su propio N-400: si usted y su esposa se hacen ciudadanos al mismo tiempo, son ${es(couple)} en papel con la tarifa normal. Para muchas familias mexicanas y centroamericanas, el precio se mide contra lo que se gana: un ciudadano de 21 años o más puede pedir a sus padres sin fila, y sus hijos solteros mayores de 21 años pasan de la categoría F2B a la F1. Para saber si ya cumple los años de residencia, use la calculadora de fecha temprana.`,
    faqs: [
      { q: '¿Quién puede pagar la tarifa reducida de la ciudadanía americana?', a: `Quien tiene ingresos del hogar iguales o menores al 400 % del nivel federal de pobreza según el número de personas en su casa. La tarifa reducida es de ${es(F.n400.reduced)} y solo se pide con el N-400 en papel, junto con pruebas de ingresos. La tabla de pobreza cambia cada año; revise la cifra vigente en la página del N-400 de USCIS.` },
      { q: '¿Qué gana mi familia en México cuando yo paso de residente a ciudadano?', a: `Como ciudadano de 21 años o más puede pedir a sus padres como familiares inmediatos, sin esperar fecha en el boletín de visas. Sus hijos solteros mayores de 21 años, si ya tenían una petición F2B, pasan a la categoría F1, que en México a veces avanza distinto. También puede pedir a hijos casados (F3) y hermanos (F4), algo que un residente no puede hacer.` },
      { q: '¿Me devuelven el costo del N-400 si me niegan la ciudadanía?', a: `No. La tarifa paga la revisión de la solicitud, no la aprobación. Por eso conviene revisar antes los ${N.residenceYears} años de residencia (3 si está casado con un ciudadano), los días dentro del país y los viajes largos. Si tiene arrestos o problemas migratorios pasados, hable antes con un abogado de inmigración o un representante acreditado por el DOJ.` },
    ],
    body: (h) => `
<h2>Tres precios para el mismo formulario</h2>
${h.table(['Cómo lo presenta', 'Tarifa'], [
  ['En papel, tarifa normal', h.usd(F.n400.paper)],
  ['En línea, tarifa normal', h.usd(F.n400.online)],
  ['En papel, tarifa reducida por ingresos', h.usd(F.n400.reduced)],
], `Tabla G-1055 de USCIS, edición del ${P.g1055_edition}.`, ['l', 'r'])}
<p>La trampa está en la última línea: la tarifa reducida no existe en línea. Una persona que califica y presenta por internet por costumbre paga ${h.usd(F.n400.online - F.n400.reduced)} de más. Si sus ingresos son más altos, en cambio, presentar en línea ahorra ${h.usd(onlineSave)}.</p>
<h2>Lo que compra la ciudadanía para la familia</h2>
<p>Un residente permanente solo puede pedir a su cónyuge y a sus hijos solteros, y siempre con fila (F2A y F2B). Un ciudadano de 21 años o más puede pedir a su papá y a su mamá sin fila, a sus hijos casados (F3) y a sus hermanos (F4). Además, cuando usted se naturaliza, la petición F2B que ya tenía para un hijo soltero de más de 21 años se convierte en F1 con la misma fecha de prioridad; la ${h.a('guide-f2b-to-f1', 'guía de conversión de F2B a F1')} compara las dos filas para México.</p>
<h2>Antes de pagar ${h.usd(F.n400.paper)}</h2>
<p>El dinero no se devuelve si la solicitud se niega. USCIS permite presentar hasta ${N.earlyFilingDays} días antes de cumplir los ${N.residenceYears} años de residencia (3 años si vive casado con un ciudadano), y pide ${N.physicalPresenceDays5} días dentro del país en esos cinco años. Un viaje de más de seis meses a México o a Honduras se presume que rompe la residencia continua. La ${h.a('n-400-early-filing-calculator', 'calculadora de fecha temprana')} cuenta sus viajes por usted.</p>
<h2>Después de presentar</h2>
<p>Vea el ${h.a('n-400-processing-time', 'tiempo del N-400')} en su oficina de USCIS. Para preguntas sobre su caso, busque un abogado de inmigración o un ${h.src('legalHelp', 'representante acreditado')}, nunca a alguien que solo ofrece llenar formularios.</p>`,
  },
});
