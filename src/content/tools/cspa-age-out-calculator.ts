import { definePage } from '../../lib/guide-types';
import PARAMS from '../../data/params-2026.json';
import { cspa } from '../../lib/engine/rules';
import { formatNumber } from '../../lib/format';

// Règle CSPA lue dans params-2026.json > cspa (Policy Manual, vol. 7, partie A, chap. 7) ; exemples calculés par le moteur.
const C = PARAMS.cspa;
// Exemple anglais : les valeurs par défaut de l'outil, puis la même famille avec une approbation rapide.
const slow = cspa({ birth: '2004-06-01', petitionFiled: '2019-03-01', petitionApproved: '2020-02-01', visaAvailable: '2025-09-01' });
const fast = cspa({ birth: '2004-06-01', petitionFiled: '2019-03-01', petitionApproved: '2019-05-01', visaAvailable: '2025-09-01' });
// Exemple espagnol : hija derivada d'une pétition F2A, deux enfants nés à un an d'écart.
const hija = cspa({ birth: '2005-04-10', petitionFiled: '2024-02-01', petitionApproved: '2025-08-15', visaAvailable: '2026-10-01' });
const hijo = cspa({ birth: '2003-10-10', petitionFiled: '2024-02-01', petitionApproved: '2025-08-15', visaAvailable: '2026-10-01' });
const y = (d: number, l: 'en' | 'es') => formatNumber(d / 365.25, 2, l);

export default definePage({
  id: "cspa-age-out-calculator", group: "tools", order: 401,
  tool: {"kind": "cspa"},
  related: ["guide-cspa", "f2a", "priority-date-calculator", "f2a-mexico", "guide-f2b-to-f1"],
  sources: ["cspaPolicy", "cspaPage", "vbIndex", "cfr205_1"],
  en: {
    path: "tools/cspa-age-out-calculator",
    nav: 'CSPA age-out calculator', card: 'Will a child still count as under 21? CSPA age from four dates, with the one-year filing deadline.',
    title: 'CSPA Calculator 2026: Child Status Protection Act Age',
    description: 'CSPA calculator: enter birth date, petition filing and approval dates and the month the date went current to get the CSPA age and the one-year deadline.',
    h1: 'CSPA age-out calculator: is the child still under 21?',
    intro: 'Four dates from the approval notice and the Visa Bulletin give the child’s CSPA age, the protected or aged-out verdict and the date to seek residence by.',
    resume: `The Child Status Protection Act does not freeze a child’s age in the preference categories; it subtracts time. USCIS takes the child’s age on the date a visa becomes available, which is the later of the petition approval and the first day of the month whose Visa Bulletin shows the priority date current on the Final Action Dates chart, then removes the number of days the I-130 or I-140 was pending between its filing date and its approval date. If the result is under ${C.ageLimit}, the unmarried son or daughter keeps the child category, provided the family seeks to acquire permanent residence within ${C.soughtToAcquireYears} year of that availability date. A child who was ${y(slow.ageDays, 'en')} years old when the date went current but whose parent’s petition sat ${formatNumber(slow.pendingDays, 0, 'en')} days at USCIS has a CSPA age of ${y(slow.cspaDays, 'en')} and stays protected. The years spent waiting in the queue after approval are never subtracted, which is why long family lines still produce age-outs.`,
    faqs: [
      { q: 'Which dates does the CSPA age-out calculator need from my documents?', a: 'The child’s date of birth, the receipt date of the I-130 or I-140 (the filing date, not the priority date when they differ), the approval date on the I-797 approval notice, and the bulletin month in which the priority date first showed as current on the Final Action Dates chart. The Policy Manual says the priority date itself should not be used to measure pending time.' },
      { q: 'Why does the CSPA calculator use Final Action Dates and not Dates for Filing?', a: 'Because the USCIS Policy Manual now uses the Final Action Dates chart to fix the date a visa becomes available for CSPA purposes. A child may still file Form I-485 under the Dates for Filing chart in a month USCIS allows it, but the age calculation waits for the Final Action Date. The manual keeps a separate rule for adjustment applications filed before August 15, 2025.' },
      { q: 'What counts as seeking to acquire residence within the CSPA one-year window?', a: 'The Policy Manual lists several acts: properly filing Form I-485, submitting Part I of Form DS-260, paying the immigrant visa fee, paying the affidavit of support review fee, or having a Form I-824 properly filed on the child’s behalf. Missing the year can be excused only for extraordinary circumstances that the child did not create and that directly caused the delay.' },
      { q: 'Does the CSPA calculator apply to spouses and children of U.S. citizens?', a: 'Not in the same way. For an immediate relative child of a U.S. citizen, the Policy Manual freezes the age on the date the I-130 is filed, so no subtraction is needed. The calculator is built for preference cases: family preference principals and derivatives, and children who are derivatives of an employment-based or diversity case.' },
    ],
    body: (h) => `
<h2>Four dates and one subtraction</h2>
<p>The form on this page asks for exactly what the ${h.src('cspaPolicy', 'Policy Manual chapter on CSPA')} uses. From the birth date and the bulletin month it works out the child’s age on the availability date, choosing the approval date instead when approval came later. From the filing and approval dates it counts the pending days. The headline then says “Protected: under 21” or “Ages out”, with the CSPA age to two decimals, followed by the date by which the child must seek to acquire residence. Nothing leaves your browser, and a filing date later than the approval date is refused rather than computed.</p>
<h2>Why a slow approval can help</h2>
<p>The rule rewards time spent at USCIS, not time spent in line. Take the dates the calculator opens with: a child born in June 2004, a petition filed in March 2019 and approved in February 2020, a priority date that went current in September 2025. The child was ${h.num(slow.ageDays / 365.25, 2)} on the availability date, ${h.num(slow.pendingDays)} days come off, and the CSPA age is ${h.num(slow.cspaYears, 2)}. Had the same petition been approved after ${h.num(fast.pendingDays)} days, the CSPA age would be ${h.num(fast.cspaYears, 2)} and the child ${fast.protected ? 'would still be protected' : 'would have aged out'}. Same family, same queue, a different answer.</p>
<h2>The deadline under the verdict</h2>
<p>A protected result is conditional. The one-year date shown in the result is when the window closes; the Policy Manual accepts a properly filed I-485 or Part I of the DS-260 as seeking to acquire, among other acts. Marriage ends child status whatever the CSPA age.</p>
<h2>Where the calculator stops</h2>
<p>It does not check whether the child is unmarried, whether an aged-out F2A case converts to another category, or whether extraordinary circumstances excuse a late filing. Those questions are covered on the ${h.a('guide-cspa', 'CSPA guide')} and the ${h.src('cspaPage', 'USCIS CSPA page')}; for a child close to the line, a licensed immigration attorney or a DOJ-accredited representative should read the actual notices.</p>`,
  },
  es: {
    path: "herramientas/calculadora-cspa",
    nav: 'Calculadora CSPA', card: '¿Su hijo seguirá contando como menor de 21? Edad CSPA con cuatro fechas y el plazo de un año.',
    title: 'Edad CSPA 2026: calculadora para hijos que cumplen 21',
    description: 'Edad CSPA de su hijo con la fecha de nacimiento, la presentación y la aprobación del I-130 y el mes en que la fecha se puso al día. Incluye el plazo de un año.',
    h1: 'Calculadora CSPA: ¿mi hijo todavía cuenta como menor?',
    intro: 'Con cuatro fechas del aviso de aprobación y del Visa Bulletin, la calculadora dice si su hijo conserva la protección de la ley CSPA y hasta cuándo debe actuar.',
    resume: `Muchas familias mexicanas y centroamericanas esperan años con una petición de residente o de ciudadano, y en ese tiempo los hijos crecen. La Ley de Protección del Estatus del Menor (Child Status Protection Act, CSPA) no congela la edad en las categorías de preferencia: le resta tiempo. USCIS toma la edad del hijo el día en que hay visa disponible, que es la fecha más tardía entre la aprobación de la petición y el primer día del mes cuyo boletín muestra la fecha de prioridad al día en la tabla de fechas de acción final (Final Action Dates). A esa edad le quita los días que la petición I-130 estuvo pendiente, desde que se presentó hasta que se aprobó. Si el resultado queda por debajo de ${C.ageLimit} años y el hijo sigue soltero, conserva la categoría de hijo, siempre que la familia busque obtener la residencia dentro de ${C.soughtToAcquireYears} año. Los años de espera en la fila después de la aprobación nunca se restan.`,
    faqs: [
      { q: '¿Qué fechas necesita la calculadora CSPA y dónde las encuentro?', a: 'Necesita la fecha de nacimiento del hijo, la fecha de recibo (receipt date) del I-130, la fecha de aprobación que aparece en el aviso I-797 y el mes del Visa Bulletin en que su fecha de prioridad apareció al día en la tabla de acción final. Para el tiempo pendiente, el Manual de USCIS usa la fecha de presentación y no la fecha de prioridad.' },
      { q: '¿Mi hijo que viene en la petición de mi esposo residente está protegido por CSPA?', a: 'La ley CSPA cubre a los hijos que vienen como derivados en una petición de preferencia familiar, como la F2A de un residente para su esposa con hijos. La calculadora le da la edad CSPA de cada hijo con las fechas de esa petición. Si un hijo sale con 21 o más, pida una revisión a un abogado de inmigración con licencia antes de dar el caso por perdido.' },
      { q: '¿Qué pasa con la edad CSPA si mi hijo se casa antes de recibir la residencia?', a: 'El matrimonio termina la condición de hijo menor para estas categorías, aunque la edad CSPA sea menor de 21. Por eso la calculadora pide solo fechas: da por hecho que el hijo sigue soltero. Si el hijo ya se casó, la categoría puede cambiar o desaparecer según quién lo pidió; un representante acreditado por el Departamento de Justicia puede revisar su caso.' },
      { q: '¿Cómo cumple mi familia con el plazo de un año de la ley CSPA?', a: 'El Manual de USCIS acepta, entre otros actos, presentar correctamente el I-485 si el hijo está en Estados Unidos, o enviar la parte I del formulario DS-260 o pagar la tarifa de visa si el trámite es en el consulado. Pasado el año, solo se perdona el retraso por circunstancias extraordinarias que la familia no causó.' },
    ],
    body: (h) => `
<h2>Lo que la calculadora resta y lo que no</h2>
<p>La regla está en el ${h.src('cspaPolicy', 'Manual de políticas de USCIS, capítulo sobre CSPA')}: edad el día de la disponibilidad del visa, menos el tiempo pendiente de la petición. Solo se resta el tiempo que la petición pasó en USCIS esperando aprobación. Los años que la familia pasa después en la fila del Visa Bulletin, que en las categorías de México pueden ser muchos, no se descuentan. Por eso dos hermanos con la misma petición pueden tener resultados opuestos.</p>
<h2>Dos hermanos, una petición</h2>
<p>Un residente que vive en Texas pide a su esposa en la categoría F2A, con dos hijos como derivados. Supongamos que el I-130 se presentó en febrero de 2024, se aprobó en agosto de 2025 tras ${h.num(hija.pendingDays)} días, y la fecha se puso al día en octubre de 2026. La hija, nacida en abril de 2005, tenía ${h.num(hija.ageDays / 365.25, 2)} años ese mes; su edad CSPA es ${h.num(hija.cspaYears, 2)} y ${hija.protected ? 'queda protegida' : 'pierde la protección'}. Su hermano, nacido año y medio antes, llega a ${h.num(hijo.cspaYears, 2)} y ${hijo.protected ? 'también queda protegido' : 'pierde la edad de hijo'}. La calculadora hace este cálculo para cada hijo por separado.</p>
<h2>Cómo leer el resultado</h2>
<p>Arriba aparece «Protegido: menos de 21» o «Pierde la edad», con la edad CSPA en años y dos decimales. Debajo, la fecha de disponibilidad, la edad ese día, los días pendientes y la fecha límite para solicitar la residencia. Si escribe una aprobación anterior a la presentación, no calcula nada. Las fechas no salen de su navegador.</p>
<h2>Antes de decidir nada</h2>
<p>La calculadora no revisa si el hijo sigue soltero ni si una petición F2A puede convertirse a otra categoría (conversion) cuando el hijo pasa de 21. Tampoco aplica a los hijos menores de un ciudadano, cuya edad queda fija el día en que se presenta el I-130. Para su caso, consulte a un abogado de inmigración con licencia o a un representante acreditado por el Departamento de Justicia. La ${h.a('guide-cspa', 'guía sobre CSPA')} explica la regla con más detalle.</p>`,
  },
});
