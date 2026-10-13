import { definePage } from '../../lib/guide-types';
import PARAMS from '../../data/params-2026.json';
import { n400 } from '../../lib/engine/rules';
import { formatMoney } from '../../lib/format';

// Seuils lus dans params-2026.json > naturalization (Policy Manual, vol. 12, partie D) ; exemples calculés par le moteur.
const N = PARAMS.naturalization;
const F = PARAMS.fees.n400;
// Valeurs par défaut de l'outil, évaluées le premier jour de dépôt (résultat stable dans le temps).
const base = n400({ residentSince: '2021-11-15', spouseOfCitizen: false, trips: [{ out: '2024-06-01', back: '2024-07-15' }], today: '2021-11-15' });
const def = n400({ residentSince: '2021-11-15', spouseOfCitizen: false, trips: [{ out: '2024-06-01', back: '2024-07-15' }], today: base.earliestFiling });
// Même carte avec un séjour de sept mois : présomption de rupture de résidence.
const long = n400({ residentSince: '2021-11-15', spouseOfCitizen: false, trips: [{ out: '2023-01-10', back: '2023-08-20' }], today: base.earliestFiling });
// Exemple espagnol : conjoint d'un citoyen, voyages d'hiver au Mexique.
const sp0 = n400({ residentSince: '2023-08-01', spouseOfCitizen: true, trips: [], today: '2023-08-01' });
const sp = n400({ residentSince: '2023-08-01', spouseOfCitizen: true, trips: [{ out: '2024-12-01', back: '2025-02-15' }, { out: '2025-11-20', back: '2026-03-10' }], today: sp0.earliestFiling });
const usd = (n: number, l: 'en' | 'es') => formatMoney(n, 0, l);

export default definePage({
  id: "n-400-early-filing-calculator", group: "tools", order: 402,
  tool: {"kind": "n400"},
  related: ["guide-n400-residence", "n-400-processing-time", "n-400-fee", "uscis-fee-calculator", "guide-f2b-to-f1"],
  sources: ["n400Residence", "n400Presence", "n400Form"],
  en: {
    path: "tools/n-400-early-filing-calculator",
    nav: 'N-400 early filing calculator', card: 'The first day USCIS accepts your N-400, with the days present and any long trip that puts residence at risk.',
    title: 'N-400 Early Filing Calculator 2026: First Day to Apply',
    description: 'N-400 early filing calculator: from the Resident Since date and your trips, get the first filing day 90 days early, days present against 913 or 548, long trips.',
    h1: 'N-400 early filing calculator: the first day you can apply',
    intro: 'Enter the Resident Since date on your green card and your longest trips to see when USCIS accepts Form N-400 and whether your days in the country add up.',
    resume: `USCIS accepts Form N-400 up to ${N.earlyFilingDays} days before the anniversary that makes a permanent resident eligible: ${N.residenceYears} years after the Resident Since date on the card, or ${N.residenceYearsSpouse} years for someone married to a U.S. citizen. Filing on that ninetieth day is only half the test. In the statutory period before filing, the applicant must have been physically present in the United States for at least ${N.physicalPresenceDays5} days on the ${N.residenceYears}-year route or ${N.physicalPresenceDays3} days on the ${N.residenceYearsSpouse}-year route, counting the day of departure and the day of return as days present. Continuous residence is a separate condition: an absence of more than ${N.breakPresumedMonths} months but less than ${N.breakYears} year raises a presumption that residence was broken, which the applicant may try to rebut, and an absence of ${N.breakYears} year or more breaks it. This calculator returns the first filing day, the days present and required, and a count of trips over each threshold.`,
    faqs: [
      { q: 'How early can I send Form N-400 with the early filing calculator date?', a: `On the date the calculator shows, which is ${N.earlyFilingDays} days before your ${N.residenceYears}-year or ${N.residenceYearsSpouse}-year anniversary as a permanent resident. A form that reaches USCIS before that day can be rejected, so many applicants leave a margin of a few days for mail. The 2026 fee is ${usd(F.online, 'en')} online or ${usd(F.paper, 'en')} on paper.` },
      { q: 'Do the days I leave and return count in the N-400 physical presence total?', a: `Yes. Under the USCIS Policy Manual chapter on physical presence, the day you depart and the day you come back both count as days inside the United States, and the calculator follows that rule. A trip from June 1 to July 15 therefore removes ${def.daysAbroad} days, not ${def.daysAbroad + 2}. Keep passport stamps and travel records: the trips you list on the N-400 are what USCIS will compare these dates against.` },
      { q: 'What does the N-400 calculator do with a trip longer than six months?', a: 'It counts it in the row for trips over six months and shows the verdict unchanged unless the days present fall short. Such a trip does not disqualify you on its own, but USCIS presumes continuous residence was broken and you would need evidence that you kept your job, home and ties. A trip of a full year or more turns the headline into “Residence broken”.' },
    ],
    body: (h) => `
<h2>What the calculator counts</h2>
<p>It starts from the Resident Since date and adds ${h.num(N.residenceYears)} years, or ${h.num(N.residenceYearsSpouse)} if you answer yes to the spouse question, then steps back ${h.num(N.earlyFilingDays)} days. It then rebuilds the statutory period behind that filing day, or behind today if today is later, and subtracts the days spent abroad on each trip you enter, leaving out the departure and return days as the ${h.src('n400Presence', 'physical presence chapter')} requires. Only the part of a trip that falls inside the period is counted.</p>
<h2>The default card, read line by line</h2>
<p>The form opens on a card dated November 15, 2021. The ${h.num(N.residenceYears)}-year anniversary is ${h.date(def.anniversary)}, so the first filing day is ${h.date(def.earliestFiling)}. One summer trip of six weeks costs ${h.num(def.daysAbroad)} days, leaving ${h.num(def.daysPresent)} days present against ${h.num(def.daysRequired)} required. Replace that trip with seven months away in 2023 and the presence total still reads ${h.num(long.daysPresent)}, which passes, yet the row for long trips shows ${h.num(long.longTrips)}: the case would rest on rebutting the presumption described in the ${h.src('n400Residence', 'continuous residence chapter')}.</p>
<h2>Why a date alone is not enough</h2>
<p>An early-filing date is easy to get from a calendar. What trips people up is the trip they forgot, or a long stay abroad that leaves the day count fine but the residence in question. Entering the two longest trips is usually enough to see which side of the line you are on; if you have more, add their days by hand.</p>
<h2>Limits</h2>
<p>The calculator does not check the marriage conditions of the ${h.num(N.residenceYearsSpouse)}-year route, good moral character, the English and civics tests, or residence in your state. Read the ${h.src('n400Form', 'Form N-400 page')} and, if a long trip or an arrest is in your history, speak with a licensed immigration attorney or a DOJ-accredited representative first. Fees are on the ${h.a('n-400-fee', 'N-400 fee page')}.</p>`,
  },
  es: {
    path: "herramientas/calculadora-n-400",
    nav: 'Calculadora del N-400', card: 'El primer día en que USCIS acepta su solicitud de ciudadanía y los días que lleva dentro del país.',
    title: 'Ciudadanía N-400 2026: calculadora del día para presentar',
    description: 'Calcule desde qué día puede pedir la ciudadanía con el N-400: fecha Resident Since, 90 días antes, días dentro de EE. UU. y viajes largos que ponen en riesgo.',
    h1: 'Calculadora del N-400: desde cuándo puede pedir la ciudadanía',
    intro: 'Escriba la fecha Resident Since de su tarjeta y sus viajes más largos, por ejemplo las temporadas en México, para saber cuándo puede presentar y si le alcanzan los días.',
    resume: `Para pedir la ciudadanía con el formulario N-400, la regla general es tener ${N.residenceYears} años como residente permanente, o ${N.residenceYearsSpouse} años si está casado con un ciudadano estadounidense, contados desde la fecha Resident Since impresa en la green card. USCIS acepta la solicitud hasta ${N.earlyFilingDays} días antes de ese aniversario. Además debe haber estado físicamente dentro de Estados Unidos al menos ${N.physicalPresenceDays5} días en el periodo de ${N.residenceYears} años, o ${N.physicalPresenceDays3} días en el de ${N.residenceYearsSpouse}; el día en que sale y el día en que regresa cuentan como días presentes. Y hay una regla aparte para la residencia continua: una ausencia de más de ${N.breakPresumedMonths} meses y menos de ${N.breakYears} año hace presumir que la residencia se interrumpió, y una de ${N.breakYears} año o más la interrumpe. Muchas familias pasan diciembre y enero en México o cuidan a un padre enfermo durante meses; la calculadora suma esos viajes y le dice en qué lado de la línea está.`,
    faqs: [
      { q: '¿Las temporadas largas en México afectan mi solicitud N-400?', a: `Pueden afectarla de dos maneras. Cada día fuera resta de los ${N.physicalPresenceDays5} días de presencia física que pide la ruta de ${N.residenceYears} años, y un solo viaje de más de ${N.breakPresumedMonths} meses hace presumir que su residencia continua se interrumpió. La calculadora muestra las dos cosas. Si tiene un viaje así, prepare pruebas de su trabajo, su casa y sus impuestos aquí.` },
      { q: '¿Cuánto cuesta presentar el N-400 una vez que la calculadora dice que ya puedo?', a: `Según la tabla G-1055 vigente, ${usd(F.paper, 'es')} en papel o ${usd(F.online, 'es')} en línea. Si los ingresos de su hogar no pasan del 400 % de la línea federal de pobreza, puede pagar ${usd(F.reduced, 'es')}, pero solo presentando en papel. Las tarifas se pagan únicamente a USCIS, nunca a un intermediario.` },
      { q: '¿Qué gana mi familia cuando me hago ciudadano con el N-400?', a: 'Como ciudadano de 21 años o más puede pedir a sus padres como familiares inmediatos, sin fila del Visa Bulletin, y sus hijos solteros mayores de 21 que esperan en F2B pasan a la categoría F1, cuya fecha a veces avanza más rápido y a veces no. La guía de F2B a F1 compara las dos fechas de México. Un abogado con licencia puede decirle qué conviene en su caso.' },
    ],
    body: (h) => `
<h2>Cómo cuenta la calculadora</h2>
<p>Parte de la fecha Resident Since, suma ${h.num(N.residenceYears)} años (o ${h.num(N.residenceYearsSpouse)} si contesta que está casado con un ciudadano) y resta ${h.num(N.earlyFilingDays)} días. Luego toma el periodo que exige la ley antes de ese día y descuenta los días fuera del país de cada viaje, sin contar el día de salida ni el de regreso, como indica el ${h.src('n400Presence', 'capítulo de USCIS sobre presencia física')}. Si un viaje empezó antes del periodo, solo cuenta la parte que cae dentro.</p>
<h2>Un ejemplo con dos inviernos en México</h2>
<p>Una señora casada con un ciudadano recibió su green card el 1 de agosto de 2023. Su aniversario de ${h.num(N.residenceYearsSpouse)} años es el ${h.date(sp.anniversary)}, así que puede presentar desde el ${h.date(sp.earliestFiling)}. Pasó dos temporadas con su familia en Puebla: diciembre a mediados de febrero, y luego de noviembre a marzo. En total son ${h.num(sp.daysAbroad)} días fuera dentro del periodo, le quedan ${h.num(sp.daysPresent)} días presentes y necesita ${h.num(sp.daysRequired)}. ${sp.presenceOk ? 'Le alcanzan' : 'No le alcanzan'}, y ${sp.longTrips ? 'uno de los viajes pasa de seis meses' : 'ningún viaje pasa de seis meses'}.</p>
<h2>Qué significa cada línea</h2>
<p>El titular dice «Ya puede presentar», la fecha en que podrá hacerlo, «Pocos días presente» o «Residencia interrumpida» si algún viaje duró un año o más. Debajo verá el aniversario, el primer día para presentar, los días fuera, los días presentes contra los requeridos, y cuántos viajes pasan de seis meses o de un año. Puede escribir dos viajes; si tiene más, sume sus días aparte.</p>
<h2>Lo que la calculadora no revisa</h2>
<p>No revisa las condiciones del matrimonio para la ruta de ${h.num(N.residenceYearsSpouse)} años, el examen de inglés y civismo, los antecedentes ni el tiempo viviendo en su estado. Lea la ${h.src('n400Form', 'página oficial del N-400')} y, si tuvo un viaje largo o un problema con la policía, consulte primero a un abogado de inmigración con licencia o a un representante acreditado por el Departamento de Justicia.</p>`,
  },
});
