import { definePage } from '../../lib/guide-types';
import { cspa } from '../../lib/engine/rules';
import { LATEST } from '../../lib/engine/cases';
import P from '../../data/params-2026.json';
import { monthName } from '../../lib/text';
import { formatNumber } from '../../lib/format';

// Règle lue dans params-2026.json (Policy Manual, vol. 7, partie A, chap. 7) et calculée par le moteur rules.ts.
const C = P.cspa;
// Trois enfants nés le même jour, dont la date devient « courante » le 1er du mois du dernier bulletin :
// seule la durée d'instruction de la pétition change.
const BIRTH = '2005-02-01';
const AVAIL = `${LATEST}-01`;
const FILED = '2018-01-01';
const KIDS = [
  { approved: '2018-07-01' },
  { approved: '2021-01-01' },
  { approved: '2023-01-01' },
].map((k) => ({ ...k, r: cspa({ birth: BIRTH, petitionFiled: FILED, petitionApproved: k.approved, visaAvailable: AVAIL }) }));
const [a, b] = KIDS.map((k) => k.r);
const yrs = (d: number) => d / 365.25;
const y = (d: number, l: 'en' | 'es') => formatNumber(yrs(d), 1, l);

export default definePage({
  id: "guide-cspa", group: "guides", order: 706,
  mini: "cspaQuick",
  related: ["cspa-age-out-calculator", "guide-f2b-to-f1", "f2a", "guide-final-action-vs-dates-for-filing", "priority-date-calculator"],
  sources: ["cspaPolicy", "cspaPage", "vbIndex", "i485Form", "legalHelp"],
  en: {
    path: "guides/child-turning-21-cspa",
    nav: 'Child turning 21 (CSPA)', card: 'How the CSPA age is worked out, why the queue after approval still counts, and the one-year step families miss.',
    title: 'CSPA Age 2026: Child Turning 21 in a Green Card Case',
    description: 'A child turning 21 during the green card wait: how USCIS works out the CSPA age, why Final Action Dates set it, and what must happen within the one year.',
    h1: 'When a child turns 21 during the wait: the CSPA age, step by step',
    intro: 'Enter the birth date, the months the petition was pending and the month the date became current to get the CSPA age in one line.',
    resume: `The Child Status Protection Act, in force since August 6, 2002, lets some sons and daughters stay “children” after their 21st birthday, but it works differently by category. For a child of a U.S. citizen the age freezes on the day the I-130 is filed. In the preference categories, and for children who come as derivatives of an employment or family applicant, nothing freezes: USCIS takes the age on the date a visa becomes available and subtracts the days the petition was pending. The visa becomes available on the later of the approval date and the first day of the month whose bulletin shows the priority date current in the Final Action Dates chart. Under ${C.ageLimit} means protected, if the child is unmarried and seeks to acquire residence within ${C.soughtToAcquireYears} year. Two children both ${y(a.ageDays, 'en')} when a date went current in ${monthName(LATEST, 'en')} end up apart: six months pending gives a CSPA age of ${y(a.cspaDays, 'en')}, three years gives ${y(b.cspaDays, 'en')}.`,
    faqs: [
      { q: 'Why does a long USCIS backlog help a child under the CSPA formula?', a: 'Because the time the petition sat at USCIS before approval is subtracted from the child’s age. A petition pending three years gives three years back; one approved in a few months gives almost nothing. The years spent after approval, waiting for the priority date to reach the cutoff, are not subtracted at all, which is where most age-outs come from.' },
      { q: 'Does the CSPA age use the date the Visa Bulletin was published?', a: 'No. USCIS uses the first day of the month the bulletin covers, not its publication day, and only the Final Action Dates chart for applications filed on or after August 15, 2025. If the petition was approved after that first day, the approval date is used instead, because the visa cannot be available before the petition is approved.' },
      { q: 'What happens to a child who ages out of an F2A petition under CSPA?', a: 'The case does not simply end. The Policy Manual explains that a derivative child of a green card holder’s spouse who ages out converts automatically to F2B as a principal beneficiary, keeping the original priority date with no new petition. The wait becomes the F2B line for the child’s country, which is usually longer.' },
      { q: 'Is a child who marries still protected by the CSPA age?', a: 'No. The CSPA calculates an age; it does not change the rule that a child must be unmarried. A son or daughter with a CSPA age of 19 who marries before getting residence is no longer a child for immigration purposes. The Policy Manual says the same of derivative children: a child who marries no longer meets the definition.' },
      { q: 'Can missing the CSPA one-year deadline be excused?', a: 'Only by showing extraordinary circumstances that the applicant did not create. The Policy Manual says ordinary problems such as money trouble or minor medical issues do not qualify. Contacting a lawyer or collecting documents is not enough either: the act must be a filing or a payment on the list, done within one year of visa availability.' },
      { q: 'Does the CSPA protect children of employment-based green card applicants?', a: 'Yes, as derivatives. USCIS lists employment-based derivative applicants among those covered. The child’s CSPA age uses the pending time of the parent’s I-140 and the date the parent’s priority date became available in the Final Action chart, so an Indian or Chinese EB family with a long queue faces the same arithmetic as a family case.' },
    ],
    body: (h) => `
<h2>Two different rules hide under one name</h2>
<p>The ${h.src('cspaPage', 'USCIS CSPA page')} starts from a definition: a child is unmarried and under 21. The Act, in force since August 6, 2002, does not change that definition. It gives USCIS a way to calculate an age that can be lower than the real one, and the method depends on the category.</p>
<ul>
<li><strong>Immediate relatives</strong> (the child of a U.S. citizen): the age is frozen on the day the I-130 is filed. Filed before the 21st birthday means the child cannot age out, as long as the child stays unmarried.</li>
<li><strong>Preference categories and derivatives</strong> (F2A, a child named on an F3 or F4 petition of a parent, a child of an EB-2 or EB-3 applicant): nothing is frozen. The age is calculated once, at a precise moment, with the formula below.</li>
<li><strong>F2A when the parent naturalizes</strong>: the case becomes an immediate relative case, and the age freezes on the day of the naturalization. Our ${h.a('guide-f2b-to-f1', 'conversion guide')} covers that event.</li>
</ul>
<h2>Who can use it</h2>
<p>USCIS lists the people covered: immediate relatives, principal and derivative applicants in the family preference categories, VAWA self-petitioners and their derivatives, derivative children of employment-based and diversity visa applicants, and derivative refugees and asylees. The case qualifies if the I-485, or the underlying petition (I-130, I-140, I-360, I-526 or I-526E, among others), was filed or still pending on or after August 6, 2002. Refugee and asylee children have their own frozen date, set at the parent’s refugee interview or asylum filing. A principal applicant in an employment category, the worker named on the I-140, gets no CSPA calculation, because that person is not applying as anyone’s child.</p>
<h2>The formula in the Policy Manual</h2>
<p>The ${h.src('cspaPolicy', 'Policy Manual chapter on the CSPA')} writes it as one subtraction: age at the time of visa availability minus pending time equals CSPA age. Each term has a strict meaning.</p>
<p><strong>Visa availability</strong> is the later of two dates: the day the petition was approved, and the first day of the month of the Visa Bulletin that shows the priority date current in the Final Action Dates chart. Not the publication date of the bulletin, not the day the family noticed, and not the Dates for Filing chart for current applications.</p>
<p><strong>Pending time</strong> is the number of days between the filing date of the petition (the receipt date on the I-130 or I-140 notice) and its approval date. For a derivative child it is the parent’s petition that counts.</p>
<p>USCIS gives its own example: a child who is 21 years and 4 months old when the visa becomes available, on a petition that was pending 6 months, has a CSPA age of 20 years and 10 months. If the result is below ${h.P.cspa.ageLimit}, the son or daughter is treated as a child. Our engine applies exactly this: the same function powers the mini calculator above and the full ${h.a('cspa-age-out-calculator', 'CSPA age-out calculator')}.</p>
<h2>Three children, same birthday, different files</h2>
<p>The table runs the formula for three children born on ${h.date(BIRTH)}. In each case the parent’s petition was filed on ${h.date(FILED)} and the priority date became current in the Final Action chart in ${h.month(LATEST)}. Only the time the petition spent at USCIS before approval changes.</p>
${h.table(['Petition approved', 'Pending time', 'Age when the visa is available', 'CSPA age', 'Result', 'Seek residence by'], KIDS.map((k) => [h.date(k.approved), `${h.num(yrs(k.r.pendingDays), 1)} yrs`, `${h.num(yrs(k.r.ageDays), 1)} yrs`, `${h.num(k.r.cspaYears, 1)} yrs`, k.r.protected ? 'Protected' : 'Ages out', h.date(k.r.soughtBy)]), `CSPA age calculated with the Policy Manual formula; visa availability on the first day of ${h.month(LATEST)}.`, ['l', 'r', 'r', 'r', 'l', 'l'])}
<p>The first child, whose petition was approved within ${h.num(yrs(a.pendingDays), 1)} years, ${a.protected ? 'stays protected' : 'ages out'} with a CSPA age of ${h.num(a.cspaYears, 1)}; the second, whose file sat ${h.num(yrs(b.pendingDays), 1)} years, ${b.protected ? 'stays a child' : 'still ages out'} at ${h.num(b.cspaYears, 1)}. The lesson is uncomfortable. A fast approval, which every family hopes for, gives the child nothing to subtract. The years after approval, waiting for the line to move, are never deducted. That is why age-outs cluster in the long lines: F4 for the Philippines and Mexico, F3 for Mexico, and employment cases for India, where a child can be twelve when the I-140 is approved and past 21 when the date finally turns current.</p>
<h2>The chart rule changed twice</h2>
<p>Which chart fixes visa availability has not always been the same, and the answer depends on when the I-485 was filed.</p>
${h.table(['Adjustment application filed', 'Chart USCIS uses for the CSPA age'], [['Before August 15, 2025', 'Dates for Filing chart (guidance of February 14, 2023)'], ['On or after August 15, 2025', 'Final Action Dates chart']], 'USCIS Policy Manual, Volume 7, Part A, Chapter 7.')}
<p>The Final Action chart usually shows earlier cutoffs than the Dates for Filing chart, so under the current rule the date of availability tends to come later, and the child is older when the age is measured. USCIS also said in 2023 that its February 2023 change could count as an extraordinary circumstance for families who missed the one-year step because of it. The ${h.a('guide-final-action-vs-dates-for-filing', 'two-chart guide')} explains the monthly designation that still governs when the I-485 itself may be filed.</p>
<h2>The step families miss: sought to acquire within one year</h2>
<p>A protected CSPA age is not enough on its own. The child must seek to acquire permanent residence within ${h.P.cspa.soughtToAcquireYears} year of the date the visa became available. The Policy Manual lists what counts:</p>
<ul>
<li>properly filing ${h.src('i485Form', 'Form I-485')} inside the United States;</li>
<li>submitting a completed Part 1 of Form DS-260 to the State Department;</li>
<li>paying the immigrant visa fee, or the affidavit of support review fee if the child is listed on it, to the State Department;</li>
<li>having a Form I-824 properly filed on the child’s behalf.</li>
</ul>
<p>Calling a lawyer, gathering birth certificates or planning a trip do not count. A missed deadline can only be excused by extraordinary circumstances that the family did not create, and the manual says ordinary financial or minor medical problems are not enough. The last column of the table gives the deadline for each example. Write it down the month the date turns current and plan the filing or the payment well before it, since a late act cannot be undone afterwards.</p>
<h2>Where the formula stops</h2>
<p>The CSPA age is a number; it does not override other rules. The child must stay unmarried until residence is granted. Cases with two petitions, a retrogression after the date was current, or a child who aged out and converted to F2B belong with a licensed immigration attorney or a DOJ-accredited representative (${h.src('legalHelp', 'find one through the Justice Department')}). This guide explains a published formula and is not legal advice; we are not affiliated with USCIS or the State Department.</p>`,
  },
  es: {
    path: "guias/hijo-de-21-anos-cspa",
    nav: 'Hijo que cumple 21 (CSPA)', card: 'Qué pasa cuando su hijo cumple 21 años en la fila: la edad CSPA, la regla del año y los errores comunes.',
    title: 'Edad CSPA 2026: su hijo cumple 21 años durante la espera',
    description: 'Su hijo cumple 21 años mientras espera la residencia: cómo calcula USCIS la edad CSPA, por qué cuenta la fecha de acción final y qué hacer en el plazo del año.',
    h1: 'Mi hijo cumple 21 años en la fila: cómo se calcula la edad CSPA',
    intro: 'Escriba la fecha de nacimiento, los meses que estuvo pendiente la petición y la fecha en que se puso al día para ver la edad CSPA.',
    resume: `En las familias mexicanas y centroamericanas que esperan una visa de preferencia, los hijos menores suelen cumplir 21 años antes de que llegue la fecha. La Ley de Protección del Estatus del Menor (Child Status Protection Act, CSPA), vigente desde el 6 de agosto de 2002, puede salvarlos, pero no congela la edad en esas categorías: le resta tiempo. USCIS toma la edad del hijo el día en que hay visa disponible y le resta los días que la petición estuvo pendiente antes de aprobarse. La visa está disponible en la fecha más tardía entre la aprobación y el primer día del mes cuyo boletín muestra la fecha de prioridad al día en la tabla de acción final. Si el resultado es menor de ${C.ageLimit}, el hijo sigue siendo hijo, siempre que esté soltero y busque la residencia dentro de ${C.soughtToAcquireYears} año. Dos hijos con ${y(a.ageDays, 'es')} años cuando la fecha se puso al día en ${monthName(LATEST, 'es')} terminan distinto: seis meses de trámite dan una edad CSPA de ${y(a.cspaDays, 'es')} y tres años dan ${y(b.cspaDays, 'es')}.`,
    faqs: [
      { q: '¿Por qué los años de espera en la fila no se restan en la edad CSPA de mi hijo?', a: 'Porque la ley solo descuenta el tiempo en que la petición estuvo pendiente en USCIS, desde el recibo hasta la aprobación. Los años que pasan después, mientras la fecha de prioridad espera la fecha límite del boletín, no se restan. Por eso en las filas largas de México, como F3 y F4, muchos hijos pierden la edad aunque la petición se haya presentado a tiempo.' },
      { q: '¿Mi hijo que vive en Puebla cumple la regla del año de la CSPA si yo junto los papeles?', a: 'No basta con juntar papeles ni con hablar con un abogado. El Manual de USCIS exige un acto concreto dentro del año: enviar completa la primera parte del formulario DS-260, pagar al Departamento de Estado la tarifa de visa de inmigrante o la de revisión de la declaración de patrocinio, o presentar un I-485 si el hijo está aquí.' },
      { q: '¿La edad CSPA de mi hija se congela cuando yo, ciudadano, presento la I-130?', a: 'Sí, si usted es ciudadano y su hija es soltera y menor de 21 años el día en que presenta la I-130: es familiar inmediato y su edad queda congelada en esa fecha. Si usted es residente permanente, la edad no se congela; se calcula con la fórmula de la CSPA cuando haya visa disponible.' },
      { q: '¿Qué pasa con la petición F2A si mi hijo pierde la edad con la CSPA?', a: 'La petición no muere. El Manual de USCIS explica que el hijo derivado del cónyuge de un residente que pierde la edad pasa solo a la categoría F2B como beneficiario principal, sin nueva petición y con la misma fecha de prioridad. La espera cambia a la fila F2B de su país, que para México suele ser mucho más larga.' },
      { q: '¿Cuenta la tabla de fechas de presentación para la edad CSPA de mi hijo?', a: 'Para los ajustes de estatus presentados desde el 15 de agosto de 2025, no: USCIS usa la tabla de fechas de acción final. Para los presentados antes de esa fecha, el Manual aplica la guía de febrero de 2023, que usaba la tabla de fechas de presentación. Revise en qué fecha se presentó el I-485 de su hijo.' },
      { q: '¿Se puede perdonar el plazo de un año de la CSPA si mi familia lo perdió?', a: 'Solo si se demuestran circunstancias extraordinarias que la familia no causó. El Manual de USCIS dice que los problemas comunes, como la falta de dinero o una enfermedad menor, no son suficientes. Es una decisión discrecional de USCIS, así que conviene que un abogado de inmigración o un representante acreditado revise el caso.' },
    ],
    body: (h) => `
<h2>Por qué tantos hijos cumplen 21 años en la fila</h2>
<p>Una familia de Jalisco que pidió a su hijo casado (F3) o un ciudadano que pidió a su hermana en Honduras (F4) con sus hijos como derivados puede esperar muchos años. En ese tiempo los niños crecen. La ley define al hijo como soltero y menor de 21 años, y la ${h.src('cspaPage', 'página de USCIS sobre la CSPA')} lo dice desde el principio: cumplir 21 años antes de recibir la residencia se llama «perder la edad» (aging out). La CSPA no cambia esa definición. Calcula una edad que puede ser menor que la real, y la forma de hacerlo depende de quién hizo la petición.</p>
<ul>
<li><strong>Hijo de ciudadano</strong> (familiar inmediato): la edad se congela el día en que se presenta la I-130. Si el hijo tenía menos de 21 años ese día y sigue soltero, no pierde la edad.</li>
<li><strong>Hijo en una categoría de preferencia</strong> (F2A, o hijo que viene como derivado en una F3 o F4 de su padre o su madre): no se congela nada. La edad se calcula una sola vez, con la fórmula de abajo.</li>
<li><strong>F2A cuando el padre se naturaliza</strong>: el caso pasa a familiar inmediato y la edad se congela el día del juramento. Lo explicamos en la ${h.a('guide-f2b-to-f1', 'guía de conversión F2B a F1')}.</li>
</ul>
<h2>A quién cubre la ley</h2>
<p>USCIS enumera a los cubiertos: familiares inmediatos, beneficiarios principales y derivados de las categorías familiares de preferencia, quienes presentan su propia petición bajo la ley VAWA y sus derivados, los hijos derivados de una petición de empleo o de la lotería de visas, y los hijos derivados de refugiados y asilados. El caso califica si el I-485 o la petición de base, como la I-130, estaba presentada o pendiente el 6 de agosto de 2002 o después. Para los hijos de refugiados y asilados la edad se congela en otra fecha: la entrevista de refugiado del padre o la presentación de su solicitud de asilo.</p>
<h2>La fórmula, término por término</h2>
<p>El ${h.src('cspaPolicy', 'capítulo del Manual de políticas de USCIS sobre la CSPA')} la escribe como una resta: edad en el momento de la disponibilidad de la visa menos tiempo pendiente igual a edad CSPA.</p>
<p><strong>Disponibilidad de la visa</strong>: la fecha más tardía entre la aprobación de la petición y el primer día del mes del boletín de visas que muestra la fecha de prioridad al día en la tabla de fechas de acción final (Final Action Dates). No es el día en que se publica el boletín ni el día en que la familia se entera.</p>
<p><strong>Tiempo pendiente</strong> (pending time): los días entre la fecha de recibo de la petición I-130 y su fecha de aprobación. Si el hijo viene como derivado, cuenta la petición del padre o de la madre.</p>
<p>USCIS da su propio ejemplo: un hijo que tiene 21 años y 4 meses cuando la visa queda disponible, con una petición que estuvo pendiente 6 meses, tiene una edad CSPA de 20 años y 10 meses. Si el resultado es menor de ${h.P.cspa.ageLimit} años, el hijo sigue siendo hijo. El simulador de arriba y la ${h.a('cspa-age-out-calculator', 'calculadora CSPA completa')} usan exactamente esta resta.</p>
<h2>Tres hijos nacidos el mismo día</h2>
<p>La tabla aplica la fórmula a tres hijos nacidos el ${h.date(BIRTH)}. En los tres casos la petición se presentó el ${h.date(FILED)} y la fecha de prioridad se puso al día en ${h.month(LATEST)}. Lo único que cambia es cuánto tardó USCIS en aprobar la petición.</p>
${h.table(['Petición aprobada', 'Tiempo pendiente', 'Edad con visa disponible', 'Edad CSPA', 'Resultado', 'Buscar la residencia antes del'], KIDS.map((k) => [h.date(k.approved), `${h.num(yrs(k.r.pendingDays), 1)} años`, `${h.num(yrs(k.r.ageDays), 1)} años`, `${h.num(k.r.cspaYears, 1)} años`, k.r.protected ? 'Protegido' : 'Pierde la edad', h.date(k.r.soughtBy)]), `Edad CSPA con la fórmula del Manual de USCIS; visa disponible el primer día de ${h.month(LATEST)}.`, ['l', 'r', 'r', 'r', 'l', 'l'])}
<p>La conclusión sorprende a muchas familias: una aprobación rápida no le deja al hijo nada que restar. Los años después de la aprobación, esperando que avance la fila, nunca se descuentan. Por eso las pérdidas de edad son frecuentes en las filas largas de México, como la F3 y la F4, donde un niño de diez años al aprobarse la petición puede tener más de 21 cuando la fecha por fin se pone al día.</p>
<h2>Qué tabla del boletín cuenta, según la fecha del I-485</h2>
${h.table(['Ajuste de estatus presentado', 'Tabla que USCIS usa para la edad CSPA'], [['Antes del 15 de agosto de 2025', 'Fechas de presentación (guía del 14 de febrero de 2023)'], ['Desde el 15 de agosto de 2025', 'Fechas de acción final']], 'Manual de políticas de USCIS, volumen 7, parte A, capítulo 7.')}
<p>Como la tabla de acción final suele ir más atrás que la de presentación, con la regla actual la visa queda disponible más tarde y el hijo es mayor cuando se mide su edad. USCIS también dijo en 2023 que su cambio de febrero de ese año podía contar como circunstancia extraordinaria para quien no cumplió el plazo de un año por esa razón.</p>
<h2>El plazo de un año: el paso que más se olvida</h2>
<p>Una edad CSPA menor de 21 no basta. El hijo debe buscar la residencia (sought to acquire) dentro de ${h.P.cspa.soughtToAcquireYears} año desde que la visa quedó disponible. El Manual acepta estos actos:</p>
<ul>
<li>presentar correctamente el ${h.src('i485Form', 'formulario I-485')}, si el hijo está en Estados Unidos;</li>
<li>enviar completa la parte 1 del formulario DS-260 al Departamento de Estado, si el hijo está en México o Centroamérica;</li>
<li>pagar al Departamento de Estado la tarifa de visa de inmigrante, o la de revisión de la declaración de patrocinio (I-864) si el hijo aparece en ella;</li>
<li>que se presente a su favor un formulario I-824.</li>
</ul>
<p>Llamar a un abogado, sacar actas de nacimiento o planear el viaje no cuenta. La última columna de la tabla da la fecha límite de cada ejemplo. Anótela en el calendario de la familia el mismo mes en que la fecha se pone al día.</p>
<h2>Lo que la fórmula no arregla</h2>
<p>La edad CSPA es un número; no cambia las demás reglas. El hijo debe seguir soltero hasta recibir la residencia. Los casos con varias peticiones, con retrocesos del boletín o con hijos que ya pasaron a F2B merecen la revisión de un abogado de inmigración con licencia o de un representante acreditado por el Departamento de Justicia (${h.src('legalHelp', 'búsquelo en la lista oficial')}). Nunca pague a alguien que no tenga esa acreditación. Esta guía explica una fórmula publicada; no es asesoría legal y no tiene relación con USCIS ni con el Departamento de Estado.</p>`,
  },
});
