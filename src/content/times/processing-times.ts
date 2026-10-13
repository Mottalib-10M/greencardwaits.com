import { definePage } from '../../lib/guide-types';
import PT from '../../data/ptimes.json';
import { OFFICES, NATIONAL, NATIONAL_MONTH, PUBLISHED } from '../../lib/engine/ptimes';
import { formatNumber, displayDate } from '../../lib/format';
import { monthName } from '../../lib/text';

// Chiffres lus dans les données : relevé USCIS et rapport mensuel au Congrès.
type L = 'en' | 'es';
const NF = (PT as unknown as { national: { forms: Record<string, { months: number; received: number; pending: number }> } }).national.forms;
const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const [mName, mYear] = NATIONAL_MONTH.split(' ');
const natYm = `${mYear}-${String(MN.indexOf(mName) + 1).padStart(2, '0')}`;
const n = (x: number | null | undefined, l: L = 'en') => (x == null ? '–' : formatNumber(x, x % 1 ? 1 : 0, l));
const pubEn = displayDate(PUBLISHED, 'en-US');
const pubEs = displayDate(PUBLISHED, 'es-US');
const field = Object.values(OFFICES).filter((o) => o.n400?.max != null).sort((a, b) => a.n400!.max! - b.n400!.max!);
const fastN = field[0], slowN = field[field.length - 1];
const famField = Object.values(OFFICES).filter((o) => o.i485fam?.max != null).sort((a, b) => a.i485fam!.max! - b.i485fam!.max!);
const fastF = famField[0], slowF = famField[famField.length - 1];
const nOffices = Object.keys(OFFICES).length;
const REPORT = ['N-400', 'I-485 family', 'I-485 employment', 'I-130', 'I-765', 'I-751'];
const ES_LABEL: Record<string, string> = { 'I-485 family': 'I-485 por familia', 'I-485 employment': 'I-485 por empleo' };
const i130Ratio = Math.round(NF['I-130'].pending / NF['I-130'].received);

export default definePage({
  id: "processing-times", group: "times", order: 500,
  tool: {"kind": "ptime", "form": "n400", "office": "HOU"},
  data: {"special": "alltimes", "form": "n-400"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "i-130-processing-time", "i-765-processing-time", "office-houston"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "legalHelp", "avoidScams"],
  en: {
    path: "processing-times",
    nav: 'USCIS processing times', card: 'Every green card and citizenship form we track, with the range USCIS publishes and the national average.',
    title: 'USCIS Processing Times 2026: Green Card and N-400 Forms',
    description: 'USCIS processing times for 21 green card and citizenship forms: the range published by office, the national average sent to Congress, and why they differ.',
    h1: 'USCIS processing times for green card and citizenship forms',
    intro: 'Pick a form and an office, add the receipt date from your notice, and see where your case stands against the latest range USCIS published.',
    resume: `USCIS puts out two kinds of processing-time figures, and they rarely match. The first is the range on its Check Case Processing Times tool, refreshed about once a month; the edition used here is dated ${pubEn}. Each range has a lower figure, the median case, and an upper figure, the point by which four cases in five at that office had been decided. The second is the average in the monthly report USCIS sends to Congress, which takes every case completed in the month, from receipt to decision, and averages them. For ${NATIONAL_MONTH}, that average was ${n(NATIONAL['N-400'])} months for naturalization, ${n(NATIONAL['I-485 family'])} months for family-based adjustment of status and ${n(NATIONAL['I-130'])} months for the I-130 relative petition. Both figures are true and they answer different questions. This page leads to one page per form, with the published range at each office, the national average where USCIS reports one, and a checker that places your receipt date against both.`,
    faqs: [
      { q: 'Why does the USCIS processing-times tool disagree with the report to Congress?', a: 'The tool describes one office and one form: its median case and the time by which 80% of its cases were finished. The report to Congress averages every case of that form completed anywhere in the month, quick ones and very old ones alike. A national average can therefore sit below most office ranges, or above them, without either source being wrong.' },
      { q: 'Which USCIS office publishes the processing time for my form?', a: 'Naturalization and family-based green card applications are published for each of the 90 field offices, because they end with an interview there. Other forms are published by the unit that decides them, such as Service Center Operations, the National Benefits Center, the Field Office Directorate or the Immigrant Investor Program Office. The checker lists only the units USCIS publishes for the form you choose.' },
      { q: 'What does the inquiry date next to a USCIS processing time mean?', a: 'It is the receipt date before which USCIS treats a case as outside normal processing time. If the receipt date on your Form I-797C is on or before that date, USCIS accepts a case inquiry about it. If it is later, the case is still considered normal, however long it feels. Each form and office has its own inquiry date.' },
      { q: 'How far back do the USCIS processing times on this site go?', a: 'For the 90 field offices we keep every publication since March 2022, as republished in open data by ImmigrationTimes.org under the CC BY 4.0 licence. That lets each office page show how its N-400 and family I-485 ranges moved over four years. For the other forms we show the latest publication, next to the national average from the monthly report to Congress.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '–' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Two official numbers, two different questions</h2>
<p>Take naturalization. The report to Congress for ${h.month(natYm)} puts the average at ${m(NATIONAL['N-400'])} months from receipt to decision. Yet across the ${h.num(nOffices)} field offices, the upper end of the published N-400 range runs from ${m(fastN.n400!.max)} months in ${fastN.name} to ${m(slowN.n400!.max)} months in ${slowN.name}. The family green card spreads even wider, from ${m(fastF.i485fam!.max)} months in ${fastF.name} to ${m(slowF.i485fam!.max)} in ${slowF.name}, against a national average of ${m(NATIONAL['I-485 family'])}. The report averages every file closed that month, including some that waited for years and some decided in weeks. The published range describes one office: its median case and the point by which 80% of its cases were done. The office range is closer to your own situation; the average describes the system.</p>
<h2>Where each form is decided</h2>
<p>Two queues are published office by office: Form N-400 and family-based Form I-485, both of which normally end with an interview. The rest are published by the unit that handles them. Service Center Operations covers the I-140, the I-129F, the I-90 and the advance parole application. The I-130 is split between the National Benefits Center, Service Center Operations and the Field Office Directorate, and the I-526E sits with the Immigrant Investor Program Office. The table further down lists each one.</p>
<h2>How many cases are waiting</h2>
${h.table(['Form', 'Received in the month', 'Pending', 'Average months to decision'], REPORT.map((k) => [k, h.num(NF[k].received), h.num(NF[k].pending), m(NF[k].months)]), `USCIS report to Congress, ${h.month(natYm)}.`, ['l', 'r', 'r', 'r'])}
<p>The I-130 line stands apart: ${h.num(NF['I-130'].pending)} petitions pending, about ${h.num(i130Ratio)} times what USCIS received in the month. The I-765 work permit has the largest monthly intake, ${h.num(NF['I-765'].received)} applications.</p>
<h2>Reading your own case</h2>
<p>Use the receipt date printed on Form I-797C, not the day you mailed the package. The checker shows the months elapsed, the published range for the office and whether USCIS would already accept an inquiry. Each form page explains what is specific to that queue. Processing-time data: ImmigrationTimes.org (CC BY 4.0), from USCIS; national averages: ${h.src('uscisReport', 'USCIS report to Congress')}.</p>`;
    },
  },
  es: {
    path: "tiempos-de-proceso",
    nav: 'Tiempos de USCIS', card: 'Los formularios de la green card y la ciudadanía, con el rango que publica USCIS y el promedio nacional.',
    title: 'Tiempo de proceso USCIS 2026: green card y ciudadanía',
    description: 'Tiempo de proceso de USCIS para cada formulario de su familia: I-130, I-485, permiso de trabajo, advance parole, I-751, I-90 y N-400, por oficina y en promedio.',
    h1: 'Tiempos de proceso de USCIS, formulario por formulario',
    intro: 'Elija el formulario y la oficina, escriba la fecha de recibo de su aviso y vea cómo va su caso frente al último rango que publicó USCIS.',
    resume: `Una familia que tramita la residencia en Estados Unidos pasa casi siempre por varios formularios de USCIS: la petición I-130, el ajuste de estatus (I-485), el permiso de trabajo (I-765), a veces el permiso de viaje (advance parole), y años después la ciudadanía (N-400). Cada uno tiene su propio tiempo, y USCIS lo da de dos maneras. En su herramienta Check Case Processing Times publica un rango por oficina, actualizado el ${pubEs}: la cifra baja es el caso mediano y la alta, el plazo en que se resolvieron cuatro de cada cinco casos. En su informe mensual al Congreso da otra cifra, el promedio de todos los casos terminados en el mes: para ${monthName(natYm, 'es')}, ${n(NATIONAL['I-485 family'], 'es')} meses para el I-485 por familia, ${n(NATIONAL['I-130'], 'es')} para el I-130 y ${n(NATIONAL['N-400'], 'es')} para la naturalización. Las dos cifras son verdaderas, pero miden cosas distintas. Esta página reúne todos los formularios y lleva a una página por cada uno.`,
    faqs: [
      { q: '¿Por qué el promedio de USCIS no coincide con el rango de mi oficina?', a: 'Porque el promedio del informe al Congreso mezcla todos los casos de ese formulario que USCIS terminó en el mes, en todo el país, los rápidos y los muy antiguos. El rango de la oficina describe solo a esa oficina: su caso mediano y el plazo en que resolvió el 80 % de sus casos. Para su propio expediente, el rango de su oficina es la referencia más cercana.' },
      { q: '¿En qué orden suelen llegar los formularios de USCIS en un caso familiar?', a: 'Primero la petición I-130 del familiar ciudadano o residente. Si la persona está en Estados Unidos y puede ajustar su estatus, sigue el I-485, a menudo junto con el I-765 y el I-131. Quien recibe una residencia condicional por matrimonio presenta luego el I-751, la tarjeta de diez años se renueva con el I-90 y la ciudadanía se pide con el N-400.' },
      { q: '¿Qué es la fecha de consulta que aparece junto al tiempo de USCIS?', a: 'Es la fecha de recibo a partir de la cual USCIS acepta una consulta de caso (case inquiry). Si la fecha de su aviso I-797C es igual o anterior, su caso ya está fuera del tiempo normal y puede preguntar. Si es posterior, USCIS lo considera dentro de lo normal, aunque la espera le parezca larga. Cada formulario y cada oficina tienen su fecha.' },
      { q: '¿Quién puede ayudarme si mi caso de USCIS está atrasado y algo no cuadra?', a: 'Un abogado de inmigración con licencia o un representante acreditado por el Departamento de Justicia (DOJ). Desconfíe de quien promete acelerar un caso a cambio de dinero: USCIS publica una página para evitar estafas. Esta página solo muestra los tiempos publicados y no es asesoría legal; no estamos afiliados a USCIS.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '–' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Dos cifras oficiales que no miden lo mismo</h2>
<p>Piense en una pareja de Houston donde la esposa, nacida en México, ajusta su estatus por matrimonio con un ciudadano. El informe al Congreso de ${h.month(natYm)} dice que el I-485 por familia tarda en promedio ${m(NATIONAL['I-485 family'])} meses. Pero el rango de su oficina puede ser muy distinto: entre las ${h.num(nOffices)} oficinas locales (field offices), la cifra alta va de ${m(fastF.i485fam!.max)} meses en ${fastF.name} a ${m(slowF.i485fam!.max)} en ${slowF.name}. El promedio incluye todos los casos cerrados en el mes, también los que esperaron años. El rango habla de una sola oficina. Para saber si su caso va bien, compare con el rango; el promedio sirve para ver el sistema completo.</p>
<h2>Qué oficina publica cada formulario</h2>
<p>La naturalización y el ajuste por familia terminan normalmente con una entrevista, por eso USCIS los publica oficina por oficina. Los demás formularios los publica la unidad que los decide: el Centro Nacional de Beneficios (National Benefits Center), las operaciones de los centros de servicio (Service Center Operations), la dirección de oficinas locales (Field Office Directorate) o la oficina de inversionistas para el I-526E. La tabla de abajo indica cuál corresponde a cada uno.</p>
<h2>Cuántos casos esperan</h2>
${h.table(['Formulario', 'Recibidos en el mes', 'Pendientes', 'Promedio hasta la decisión (meses)'], REPORT.map((k) => [ES_LABEL[k] ?? k, h.num(NF[k].received), h.num(NF[k].pending), m(NF[k].months)]), `Informe de USCIS al Congreso, ${h.month(natYm)}.`, ['l', 'r', 'r', 'r'])}
<p>La petición I-130 es la fila que más llama la atención: ${h.num(NF['I-130'].pending)} pendientes, unas ${h.num(i130Ratio)} veces lo que USCIS recibió en el mes. Detrás de esa cifra hay padres, hermanos e hijos de familias que ya viven aquí.</p>
<h2>Cómo usar la herramienta con su aviso</h2>
<p>Use la fecha de recibo (receipt date) del aviso I-797C, no el día en que envió el paquete por correo. La herramienta muestra los meses que han pasado, el rango de la oficina y si USCIS ya aceptaría una consulta. Datos de tiempos: ImmigrationTimes.org (CC BY 4.0), a partir de USCIS; promedios: ${h.src('uscisReport', 'informe de USCIS al Congreso')}.</p>`;
    },
  },
});
