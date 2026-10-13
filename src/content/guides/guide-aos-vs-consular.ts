import { definePage } from '../../lib/guide-types';
import { feeTotal, DEFAULT_FEES, type FeeInput } from '../../lib/engine/fees';
import { OFFICES, NATIONAL, NATIONAL_MONTH } from '../../lib/engine/ptimes';
import { filingChart, LATEST } from '../../lib/engine/cases';
import { formatMoney } from '../../lib/format';
import { monthName } from '../../lib/text';

// Frais totalisés par le moteur (G-1055 du 10/07/26 et frais du Département d'État, params-2026.json) ; jamais tapés.
const T = (x: Partial<FeeInput>) => feeTotal({ ...DEFAULT_FEES, ...x });
// Une personne, puis une famille de trois : deux adultes et un enfant de moins de 14 ans.
const famAos1 = T({ path: 'marriage' });
const famAos1Bare = T({ path: 'marriage', ead: false, advanceParole: false });
const famCon1 = T({ path: 'family-consular' });
const famAos3 = T({ path: 'marriage', extraAdults: 1, kidsUnder14: 1 });
const famCon3 = T({ path: 'family-consular', consularApplicants: 3 });
const empAos1 = T({ path: 'employment' });
const empCon1 = T({ path: 'employment-consular' });
const empAos3 = T({ path: 'employment', extraAdults: 1, kidsUnder14: 1 });
const empCon3 = T({ path: 'employment-consular', consularApplicants: 3 });
const gap1 = famAos1.total - famCon1.total;
// Délais : moyenne nationale du rapport au Congrès et fourchettes publiées par bureau (relevé USCIS).
const natFam = NATIONAL['I-485 family'], natEmp = NATIONAL['I-485 employment'], natI130 = NATIONAL['I-130'];
const OFF = ['HOU', 'LOS', 'CHI', 'NYC', 'MIA', 'HLG'];
const offRows = OFF.filter((k) => OFFICES[k]?.i485fam).map((k) => ({ name: OFFICES[k].name, b: OFFICES[k].i485fam! }));
const usdEn = (n: number) => formatMoney(n, 0, 'en');
const usdEs = (n: number) => formatMoney(n, 0, 'es');
const chart = filingChart('F2A');

export default definePage({
  id: "guide-aos-vs-consular", group: "guides", order: 710,
  mini: "aosVsConsular",
  related: ["consular-processing-cost", "marriage-green-card-cost", "i-485-family-processing-time", "guide-cspa", "guide-final-action-vs-dates-for-filing"],
  sources: ["consular", "g1055", "dosFees", "immigrantFee", "i485Form", "aosCharts", "uscisReport", "itData", "cspaPolicy", "legalHelp", "ivPosts"],
  en: {
    path: "guides/adjustment-of-status-vs-consular-processing",
    nav: 'Adjustment vs consular', card: 'Filing Form I-485 in the U.S. or interviewing at a consulate abroad: the 2026 fees, the published times and the gaps.',
    title: 'Adjustment of Status vs Consular Processing: 2026 Fees, Time',
    description: 'Adjustment of status or consular processing: 2026 fees from USCIS and the State Department, the USCIS times that are published and what nobody publishes.',
    h1: 'Adjustment of status or consular processing: what changes in cost and time',
    intro: 'Choose family or employment and the number of people immigrating to compare the government fees of the two routes.',
    resume: `A green card can be finished in two ways. Adjustment of status means filing Form I-485 with USCIS from inside the United States, usually with a work permit and travel document while it is pending; consular processing means an immigrant visa interview at a U.S. embassy or consulate abroad, then entry as a permanent resident. In government fees the consular route is cheaper: for one person in a family case, adjustment with the work and travel permits costs ${usdEn(famAos1.total)} on paper under the G-1055 fee schedule, against ${usdEn(famCon1.total)} for the I-130, the State Department fees and the USCIS Immigrant Fee abroad. Time is harder to compare. USCIS publishes its processing times, about ${natFam} months on average for a family I-485 in the ${monthName(NATIONAL_MONTH, 'en')} report to Congress, and a range for each field office. The State Department does not publish a consulate-by-consulate interview wait that can be read as a number, so any total for the consular route has a blank in it.`,
    faqs: [
      { q: 'Why does adjustment of status cost more than consular processing?', a: 'Because the I-485 is a USCIS application with its own fee, and most applicants add a work permit and advance parole while it is pending. Abroad, the State Department charges a visa application fee per person and USCIS charges the Immigrant Fee for the card. The consular route avoids the I-485 fee but adds travel, which no fee table counts.' },
      { q: 'Which route lets the applicant work while the green card is pending?', a: 'Adjustment of status. With a pending I-485 the applicant can file Form I-765 at the reduced fee for a pending adjustment case and work once the card is issued. In consular processing the applicant waits abroad, usually without U.S. work authorization, until the immigrant visa is issued and they enter the United States.' },
      { q: 'Is the consular interview wait published by the State Department?', a: 'Not as a number we can use. USCIS publishes ranges by form and office every month, but the State Department does not release a consulate-by-consulate waiting time for immigrant visa interviews in a form that can be compared. That is why our consular estimates stop at the priority date and the fees, and say so.' },
      { q: 'Do both routes use the same Visa Bulletin chart?', a: 'For the final step, yes: a green card or immigrant visa is issued only when the priority date is earlier than the Final Action Date. Before that, USCIS may let adjustment applicants file the I-485 under the Dates for Filing chart, and the National Visa Center uses the Dates for Filing chart to collect documents from applicants abroad.' },
      { q: 'Who does the medical exam in adjustment of status and in consular processing?', a: 'Inside the United States, a civil surgeon designated by USCIS completes Form I-693, which has no USCIS fee. Abroad, a panel physician designated by the State Department does the exam before the interview. In both cases the doctor sets the price, so it is not included in the official fee totals.' },
      { q: 'Can anyone in the United States choose adjustment of status?', a: 'No. Eligibility to adjust depends on how the person entered, their status history and the category, and some people who are physically present cannot adjust. That question is legal, not arithmetic. A licensed immigration attorney or a DOJ-accredited representative can check it before anyone files or leaves the country for an interview.' },
    ],
    body: (h) => `
<h2>Same petition, two endings</h2>
<p>Both routes start the same way, with an approved I-130 or I-140 and, in a preference category, a priority date that has to reach the cutoff. The split comes at the end. In adjustment of status the applicant files ${h.src('i485Form', 'Form I-485')} with USCIS, gives fingerprints, may be interviewed at a USCIS field office, and receives the card by mail. In consular processing the approved petition goes to the State Department’s National Visa Center, the applicant files Form DS-260 online and sends civil documents, then interviews at a U.S. embassy or consulate in the home country. The ${h.src('consular', 'State Department’s immigrant visa process')} lays out those steps.</p>
<h2>The fees, line by line</h2>
<p>All amounts below come from our fee engine, which reads the ${h.src('g1055', 'USCIS G-1055 fee schedule')} and the ${h.src('dosFees', 'State Department visa fees')}. Adjustment figures assume paper filing with the work permit (I-765) and advance parole (I-131); the family of three is two adults and a child under 14.</p>
${h.table(['Route', 'One person', 'Family of three', 'Paid to USCIS (one person)', 'Paid to the State Department (one person)'], [
  ['Family, adjustment of status', h.usd(famAos1.total), h.usd(famAos3.total), h.usd(famAos1.uscis), h.usd(famAos1.dos)],
  ['Family, consular processing', h.usd(famCon1.total), h.usd(famCon3.total), h.usd(famCon1.uscis), h.usd(famCon1.dos)],
  ['Employment, adjustment of status', h.usd(empAos1.total), h.usd(empAos3.total), h.usd(empAos1.uscis), h.usd(empAos1.dos)],
  ['Employment, consular processing', h.usd(empCon1.total), h.usd(empCon3.total), h.usd(empCon1.uscis), h.usd(empCon1.dos)],
], `Government fees under the G-1055 edition ${h.P.g1055_edition}; medical exam, travel, translations and lawyers not included.`, ['l', 'r', 'r', 'r', 'r'])}
<p>For one person in a family case, the consular route saves ${h.usd(gap1)} in fees. Much of that gap is the work permit and travel document: an adjustment applicant who skips them pays ${h.usd(famAos1Bare.total)}, ${famAos1Bare.total > famCon1.total ? 'still more than abroad, because the I-485 fee is larger than the State Department fees plus the' : 'close to the cost abroad, which adds the'} ${h.src('immigrantFee', 'USCIS Immigrant Fee')}. The gap grows with family size on paper, but the consular column hides a cost per traveler: flights, a stay near the consulate, the panel physician and days away from work. For a family of three, those costs can erase the saving. Employment rows include the I-140 and its Asylum Program Fee, which the employer usually pays.</p>
<h2>The time that is published</h2>
<p>USCIS publishes how long it takes. In its ${h.src('uscisReport', 'report to Congress')} for ${h.month(NATIONAL_MONTH)}, the average was ${h.num(natFam, 1)} months for a family I-485, ${h.num(natEmp, 1)} months for an employment I-485 and ${h.num(natI130, 1)} months for an I-130. Field offices differ widely; the range below is the one USCIS shows for a family I-485, the upper end being the time within which it says it completes 80% of cases.</p>
${h.table(['USCIS field office', 'Family I-485, months'], offRows.map((o) => [o.name, o.b.min === null ? `up to ${h.num(o.b.max ?? 0, 1)}` : `${h.num(o.b.min, 1)} to ${h.num(o.b.max ?? 0, 1)}`]), 'Processing-time data: ImmigrationTimes.org (CC BY 4.0), from USCIS; selected and reformatted.', ['l', 'r'])}
<p>The full list is on the ${h.a('i-485-family-processing-time', 'family I-485 processing time page')}, with ${h.src('itData', 'the open data behind it')}.</p>
<h2>The time that is not published</h2>
<p>For consular processing two waits stack up after the priority date is current: the National Visa Center’s review of the file, and the consulate’s scheduling of the interview. The State Department does not release either one consulate by consulate as a figure that can be compared, month after month, the way USCIS does. We do not estimate it and we do not borrow numbers from forums. Our calculator therefore shows, for the consular route, where the priority date stands and what the fees are, then leaves the interview wait blank with a note. A site that prints a consulate wait in months is showing a guess.</p>
<h2>How the bulletin works on each side</h2>
<p>The approval follows the Final Action Date on both routes. The waiting room differs. Inside the United States, USCIS designates each month on its ${h.src('aosCharts', 'filing charts page')} which chart it accepts for the I-485: in ${h.month(LATEST)} it is the ${chart === 'DFF' ? 'Dates for Filing' : 'Final Action'} chart for family cases. An applicant who files early gets a pending I-485, a work permit and permission to travel, and waits at home and at work. Abroad, the Dates for Filing chart tells the National Visa Center when to collect documents, but the interview waits for the Final Action Date, and life goes on in the home country. See ${h.a('guide-final-action-vs-dates-for-filing', 'the two charts')} for the monthly detail.</p>
<h2>Children close to 21 and the one-year step</h2>
<p>For a son or daughter protected by the Child Status Protection Act, the route changes the act that counts. The Policy Manual accepts a properly filed I-485 inside the United States, or, abroad, a completed Part 1 of Form DS-260, payment of the immigrant visa fee or payment of the affidavit of support review fee to the State Department. Any of these must happen within one year of the date the visa became available. Families who plan to interview abroad sometimes wait for the National Visa Center to write first, and lose months they did not have. The ${h.a('guide-cspa', 'CSPA guide')} explains the age calculation.</p>
<h2>Employment cases: a job change in the middle</h2>
<p>An employment applicant whose I-485 has been pending 180 days can, under the AC21 portability rule, move to a same or similar job without starting over; the ${h.a('guide-portability', 'portability guide')} covers the conditions. Abroad there is no pending application to carry, so the offer from the sponsoring employer has to hold until the visa is issued.</p>
<h2>What arrives at the end</h2>
<p>An approved adjustment ends with a card in the mail. A consular case ends with an immigrant visa in the passport; before travel the new immigrant pays the USCIS Immigrant Fee, which covers the production of the card, and the card is mailed after entry to the United States.</p>
<h2>What the choice does not decide</h2>
<p>A family does not always have a choice. Adjustment requires being in the United States and meeting conditions that depend on the category and the person’s immigration history. Leaving for a consular interview can have consequences that also depend on that history. Those are legal questions, not fee questions. Before anyone files an I-485 or books a flight to an interview, a licensed immigration attorney or a DOJ-accredited representative should review the case. The fees and times on this page are public data; they are not legal advice, and we are not affiliated with USCIS or the State Department.</p>
<h2>The short version, in numbers</h2>
<ul>
<li>Fees for one family applicant: ${h.usd(famAos1.total)} adjusting with permits, ${h.usd(famAos1Bare.total)} without them, ${h.usd(famCon1.total)} abroad.</li>
<li>Published wait after the date is current: USCIS family I-485 at your office, from the table above.</li>
<li>Unpublished wait: the consulate’s interview scheduling.</li>
<li>Same rule on both routes: no approval before the Final Action Date.</li>
</ul>
<p>Our ${h.a('consular-processing-cost', 'consular processing cost page')} and ${h.a('marriage-green-card-cost', 'marriage green card cost page')} break each total into forms.</p>`,
  },
  es: {
    path: "guias/ajuste-de-estatus-o-proceso-consular",
    nav: 'Ajuste o proceso consular', card: 'Terminar la residencia aquí con el I-485 o en el consulado de su país: tarifas 2026, tiempos publicados y lo que falta.',
    title: 'Ajuste de estatus o proceso consular: costos y tiempos 2026',
    description: 'Su familiar termina la residencia aquí con el I-485 o en el consulado en México o Centroamérica: tarifas 2026 de USCIS y del Departamento de Estado, y tiempos.',
    h1: 'Ajuste de estatus o proceso consular: qué cambia para su familia',
    intro: 'Elija petición familiar o de empleo y cuántas personas inmigran para comparar las tarifas oficiales de los dos caminos.',
    resume: `La residencia permanente se termina por uno de dos caminos. El ajuste de estatus (adjustment of status) es presentar el formulario I-485 ante USCIS desde Estados Unidos, casi siempre con permiso de trabajo y permiso de viaje mientras está pendiente. El proceso consular (consular processing) es la entrevista de visa de inmigrante en una embajada o consulado de Estados Unidos en el país de su familiar, por ejemplo en Ciudad Juárez para quien vive en México, y luego la entrada como residente. En tarifas oficiales el consulado sale más barato: para una persona en un caso familiar, el ajuste con los dos permisos cuesta ${usdEs(famAos1.total)} en papel según la tabla G-1055, contra ${usdEs(famCon1.total)} por la I-130, las tarifas del Departamento de Estado y la tarifa de inmigrante de USCIS. El tiempo es más difícil de comparar: USCIS publica sus tiempos, unos ${natFam} meses en promedio para un I-485 familiar en el informe de ${monthName(NATIONAL_MONTH, 'es')}, pero el Departamento de Estado no publica la espera de la entrevista por consulado.`,
    faqs: [
      { q: '¿Por qué el ajuste de estatus cuesta más que la visa en el consulado?', a: 'Porque el I-485 es una solicitud de USCIS con su propia tarifa, y casi todos agregan el permiso de trabajo y el permiso de viaje mientras esperan. En el consulado se paga una tarifa de visa por persona al Departamento de Estado y la tarifa de inmigrante a USCIS. El consulado evita la tarifa del I-485, pero suma viaje, hotel y días sin trabajar.' },
      { q: '¿Puede trabajar mi esposa mientras espera el ajuste de estatus?', a: 'Si presenta el I-485 desde Estados Unidos, puede pedir el permiso de trabajo con el formulario I-765, que con un ajuste pendiente tiene tarifa reducida, y trabajar cuando reciba la tarjeta. En el proceso consular su esposa espera en su país, normalmente sin permiso para trabajar en Estados Unidos, hasta recibir la visa de inmigrante y entrar.' },
      { q: '¿Cuánto tarda la cita de visa de inmigrante en el consulado de Ciudad Juárez?', a: 'No lo sabemos y no lo inventamos. El Departamento de Estado no publica la espera de las entrevistas de visa de inmigrante por consulado como un número que se pueda comparar mes a mes. USCIS sí publica los tiempos de sus oficinas. Por eso nuestra calculadora, en el camino consular, muestra la fecha de prioridad y las tarifas, y deja la espera en blanco.' },
      { q: '¿El ajuste de estatus y el consulado usan la misma tabla del boletín de visas?', a: 'Para el paso final, sí: la residencia o la visa se aprueba solo cuando la fecha de prioridad es anterior a la fecha de acción final. Antes, USCIS puede aceptar el I-485 con la tabla de fechas de presentación, y el Centro Nacional de Visas usa esa misma tabla para pedir los documentos a quien está fuera.' },
      { q: '¿Dónde hace el examen médico mi familiar en cada camino?', a: 'En Estados Unidos lo hace un cirujano civil (civil surgeon) autorizado por USCIS, que llena el formulario I-693, sin tarifa de USCIS. Fuera del país lo hace un médico autorizado por el Departamento de Estado (panel physician) antes de la entrevista. En los dos casos el médico pone el precio, así que no entra en los totales oficiales.' },
      { q: '¿Cualquier persona que vive en Estados Unidos puede pedir el ajuste de estatus?', a: 'No. Poder ajustar depende de cómo entró la persona, de su historial migratorio y de la categoría, y hay personas que viven aquí y no pueden ajustar. Salir del país para una entrevista también puede tener consecuencias según ese historial. Antes de presentar nada o de viajar, pida que lo revise un abogado de inmigración con licencia o un representante acreditado.' },
    ],
    body: (h) => `
<h2>La misma petición, dos finales</h2>
<p>Los dos caminos empiezan igual: una petición I-130 aprobada y, en una categoría de preferencia, una fecha de prioridad que debe llegar a la fecha límite del boletín. La diferencia está al final. En el ajuste de estatus su familiar presenta el ${h.src('i485Form', 'formulario I-485')} ante USCIS, da sus huellas, puede tener una entrevista en una oficina local de USCIS y recibe la tarjeta por correo. En el proceso consular la petición pasa al Centro Nacional de Visas (National Visa Center) del Departamento de Estado, su familiar llena el formulario DS-260 en línea, envía actas y documentos, y luego se presenta a la entrevista en el consulado. El ${h.src('consular', 'Departamento de Estado describe esos pasos')}.</p>
<h2>Las tarifas, una por una</h2>
<p>Los montos salen de nuestro motor de tarifas, que lee la ${h.src('g1055', 'tabla G-1055 de USCIS')} y las ${h.src('dosFees', 'tarifas de visa del Departamento de Estado')}. El ajuste se calcula en papel con permiso de trabajo (I-765) y permiso de viaje (I-131); la familia de tres son dos adultos y un niño menor de 14 años.</p>
${h.table(['Camino', 'Una persona', 'Familia de tres', 'Pagado a USCIS (una persona)', 'Pagado al Departamento de Estado (una persona)'], [
  ['Familiar, ajuste de estatus', h.usd(famAos1.total), h.usd(famAos3.total), h.usd(famAos1.uscis), h.usd(famAos1.dos)],
  ['Familiar, proceso consular', h.usd(famCon1.total), h.usd(famCon3.total), h.usd(famCon1.uscis), h.usd(famCon1.dos)],
  ['Empleo, ajuste de estatus', h.usd(empAos1.total), h.usd(empAos3.total), h.usd(empAos1.uscis), h.usd(empAos1.dos)],
  ['Empleo, proceso consular', h.usd(empCon1.total), h.usd(empCon3.total), h.usd(empCon1.uscis), h.usd(empCon1.dos)],
], `Tarifas oficiales, edición G-1055 del ${h.P.g1055_edition}; no incluye examen médico, viaje, traducciones ni abogado.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Para una persona en un caso familiar, el consulado ahorra ${h.usd(gap1)} en tarifas. Buena parte de la diferencia son los dos permisos: quien ajusta sin pedirlos paga ${h.usd(famAos1Bare.total)}, ${famAos1Bare.total > famCon1.total ? 'todavía más que en el consulado, porque la tarifa del I-485 es mayor que las tarifas del Departamento de Estado más la' : 'cerca del costo consular, que suma la'} ${h.src('immigrantFee', 'tarifa de inmigrante de USCIS')}. Pero la columna del consulado esconde gastos por persona: el viaje a Ciudad Juárez o a la capital de su país, el hotel, el médico autorizado y los días sin trabajar. Para una familia de tres, esos gastos pueden comerse el ahorro.</p>
<h2>El tiempo que sí se publica</h2>
<p>USCIS publica cuánto tarda. En su ${h.src('uscisReport', 'informe al Congreso')} de ${h.month(NATIONAL_MONTH)}, el promedio fue de ${h.num(natFam, 1)} meses para un I-485 familiar y de ${h.num(natI130, 1)} meses para una I-130. Las oficinas locales cambian mucho entre sí; la tabla da el rango que USCIS muestra para un I-485 familiar en varias oficinas con muchas familias latinas. El número alto es el tiempo en el que USCIS dice terminar el 80 % de los casos.</p>
${h.table(['Oficina de USCIS', 'I-485 familiar, meses'], offRows.map((o) => [o.name, o.b.min === null ? `hasta ${h.num(o.b.max ?? 0, 1)}` : `${h.num(o.b.min, 1)} a ${h.num(o.b.max ?? 0, 1)}`]), 'Datos de tiempos: ImmigrationTimes.org (CC BY 4.0), a partir de USCIS; seleccionados y reformateados.', ['l', 'r'])}
<p>La lista completa está en la ${h.a('i-485-family-processing-time', 'página de tiempos del I-485 familiar')}, con los ${h.src('itData', 'datos abiertos que la alimentan')}.</p>
<h2>El tiempo que nadie publica</h2>
<p>En el proceso consular hay dos esperas después de que la fecha de prioridad se pone al día: la revisión del expediente en el Centro Nacional de Visas y la cita en el consulado. El Departamento de Estado no publica ninguna de las dos por consulado como un número que se pueda comparar mes a mes, como sí lo hace USCIS. Nosotros no la calculamos ni copiamos cifras de foros o de redes sociales. Nuestra calculadora muestra, para el camino consular, dónde está la fecha de prioridad y cuánto se paga, y deja la espera de la cita en blanco con una nota. Si alguien le promete una fecha de entrevista en Ciudad Juárez, está adivinando.</p>
<h2>El boletín en cada camino</h2>
<p>La aprobación sigue la fecha de acción final en los dos caminos. Lo que cambia es la antesala. Dentro de Estados Unidos, USCIS indica cada mes en su ${h.src('aosCharts', 'página de tablas de presentación')} qué tabla acepta para el I-485: en ${h.month(LATEST)} es la de ${chart === 'DFF' ? 'fechas de presentación' : 'acción final'} para los casos familiares. Quien presenta temprano tiene un I-485 pendiente, permiso de trabajo y permiso de viaje, y espera aquí con su familia. Fuera del país, la tabla de fechas de presentación le dice al Centro Nacional de Visas cuándo pedir documentos, pero la entrevista espera a la fecha de acción final. Más detalles en la ${h.a('guide-final-action-vs-dates-for-filing', 'guía de las dos tablas')}.</p>
<h2>Hijos que están por cumplir 21 años</h2>
<p>Para un hijo protegido por la Ley CSPA, el camino cambia el acto que cuenta para el plazo de un año. El Manual de USCIS acepta un I-485 bien presentado en Estados Unidos o, fuera del país, la parte 1 completa del DS-260, el pago de la tarifa de visa de inmigrante o el pago de la revisión de la declaración de patrocinio al Departamento de Estado. Algunas familias en México esperan a que el Centro Nacional de Visas les escriba y pierden meses que no tenían. La ${h.a('guide-cspa', 'guía de la CSPA')} explica el cálculo.</p>
<h2>Lo que llega al final</h2>
<p>Un ajuste aprobado termina con la tarjeta por correo. Un caso consular termina con la visa de inmigrante en el pasaporte; antes de viajar se paga la tarifa de inmigrante de USCIS, que cubre la producción de la tarjeta, y la tarjeta llega por correo después de entrar a Estados Unidos.</p>
<h2>Lo que la elección no decide</h2>
<p>Muchas familias no pueden escoger. Para ajustar hay que estar en Estados Unidos y cumplir condiciones que dependen de la categoría y del historial migratorio de la persona. Salir del país para una entrevista consular también puede tener consecuencias según ese historial, y para algunas familias mexicanas y centroamericanas esa es la pregunta más importante de todo el trámite. No es una pregunta de tarifas. Antes de presentar un I-485 o de comprar el boleto a la entrevista, pida que revise el caso un abogado de inmigración con licencia o un representante acreditado por el Departamento de Justicia, y desconfíe de cualquier oficina que no tenga esa acreditación. Las tarifas y los tiempos de esta página son datos públicos; no son asesoría legal y no tenemos relación con USCIS ni con el Departamento de Estado.</p>
<h2>En resumen, con números</h2>
<ul>
<li>Tarifas para una persona en caso familiar: ${h.usd(famAos1.total)} con permisos, ${h.usd(famAos1Bare.total)} sin ellos, ${h.usd(famCon1.total)} por el consulado.</li>
<li>Espera publicada cuando la fecha está al día: el I-485 familiar en su oficina, según la tabla.</li>
<li>Espera no publicada: la cita en el consulado.</li>
<li>La misma regla en los dos caminos: ninguna aprobación antes de la fecha de acción final.</li>
</ul>
<p>La ${h.a('consular-processing-cost', 'página del costo del proceso consular')} y la de ${h.a('marriage-green-card-cost', 'la residencia por matrimonio')} desglosan cada total por formulario.</p>`,
  },
});
