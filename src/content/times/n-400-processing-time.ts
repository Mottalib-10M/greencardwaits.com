import { definePage } from '../../lib/guide-types';
import PT from '../../data/ptimes.json';
import { NATIONAL_MONTH, PUBLISHED } from '../../lib/engine/ptimes';
import { formatNumber, formatMoney, displayDate } from '../../lib/format';
import PR from '../../data/params-2026.json';
import { monthName } from '../../lib/text';

// Chiffres lus dans les données : 90 bureaux de terrain, séries depuis mars 2022, rapport au Congrès.
type L = 'en' | 'es';
type Row = [string, number | null, number | null];
interface Off { name: string; n400: { min: number | null; max: number | null; inquiry: string | null } | null; n400Rank: number; hist: { n400?: Row[] } }
const O = (PT as unknown as { offices: Record<string, Off> }).offices;
const NF = (PT as unknown as { national: { forms: Record<string, { months: number; received: number; pending: number }> } }).national.forms;
const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const [mName, mYear] = NATIONAL_MONTH.split(' ');
const natYm = `${mYear}-${String(MN.indexOf(mName) + 1).padStart(2, '0')}`;
const n = (x: number | null | undefined, l: L = 'en') => (x == null ? '–' : formatNumber(x, x % 1 ? 1 : 0, l));
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); const k = Math.floor(s.length / 2); return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
const nat = NF['N-400'];
const all = Object.values(O).filter((o) => o.n400?.max != null).sort((a, b) => a.n400!.max! - b.n400!.max!);
const fast = all[0], slow = all[all.length - 1];
const medNow = median(all.map((o) => o.n400!.max!));
const firstYear = Number(Object.values(O).flatMap((o) => o.hist.n400 ?? []).map((r) => r[0]).sort()[0].slice(0, 4));
const lastYear = Number(PUBLISHED.slice(0, 4));
const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i).map((y) => {
  const ends = Object.values(O).map((o) => (o.hist.n400 ?? []).filter((r) => r[0].startsWith(String(y)) && r[2] != null).pop()).filter(Boolean) as Row[];
  const xs = ends.map((r) => r[2]!);
  return { y, med: median(xs), lo: Math.min(...xs), hi: Math.max(...xs), last: ends.map((r) => r[0]).sort().pop()! };
});
const peak = years.reduce((a, b) => (b.med > a.med ? b : a));
const low = years.reduce((a, b) => (b.med < a.med ? b : a));
const story = peak.y < low.y && low.y < lastYear;
const ES_OFFICES = ['HLG', 'ELP', 'IMP', 'SBD', 'SAA', 'LAC', 'FRE', 'TUC', 'ABQ', 'HIA', 'KND', 'QNS'].filter((c) => O[c]?.n400);
const F4 = PR.fees.n400;
const usdEs = (x: number) => formatMoney(x, 0, 'es');
const pubEn = displayDate(PUBLISHED, 'en-US');
const pubEs = displayDate(PUBLISHED, 'es-US');

export default definePage({
  id: "n-400-processing-time", group: "times", order: 501, parent: "processing-times",
  tool: {"kind": "ptime", "form": "n400", "office": "HOU"},
  data: {"form": "n-400"},
  related: ["processing-times", "n-400-early-filing-calculator", "guide-n400-residence", "n-400-fee", "office-san-jose"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "n400Form", "n400Residence", "n400Presence", "g1055", "ar11", "legalHelp"],
  en: {
    path: "processing-times/n-400",
    nav: 'N-400 processing time', card: 'Naturalization times at all 90 field offices, the national average and how the wait moved since 2022.',
    title: 'N-400 Processing Time 2026: Citizenship Wait by Office',
    description: 'N-400 processing time in 2026: the naturalization range at 90 USCIS field offices, how the typical wait moved since 2022 and what the national average means.',
    h1: 'N-400 processing time: how long naturalization takes in 2026',
    intro: 'Choose your field office and enter the receipt date of your N-400 to see how far along the case is against that office’s published range.',
    resume: `Across the 90 USCIS field offices, the typical upper bound of the published N-400 range is now ${n(medNow)} months, in the USCIS edition of ${pubEn}. That figure is the median of the 90 offices’ 80% marks, and the spread around it is wide: ${fast.name} shows ${n(fast.n400!.max)} months at the top of its range and ${slow.name} ${n(slow.n400!.max)}. The national average in the report to Congress for ${NATIONAL_MONTH} is lower, ${n(nat.months)} months, because it averages every naturalization decision of the month rather than describing one office’s slower cases. USCIS received ${n(nat.received)} applications that month and had ${n(nat.pending)} pending. The trend matters as much as the level: ${story ? `at the end of ${peak.y} the typical upper bound was ${n(peak.med)} months, it fell to ${n(low.med)} months by the end of ${low.y}, and it has risen since.` : `the typical upper bound has ranged from ${n(low.med)} to ${n(peak.med)} months at the end of each year since ${firstYear}.`} The checker on this page uses your office’s current range and your receipt date.`,
    faqs: [
      { q: 'Has the N-400 processing time gone up or down since 2022?', a: 'Both. Naturalization ranges were long in 2022, then fell sharply through 2023 and 2024 at most field offices, and have lengthened again since. The table on this page shows the median upper bound across the 90 offices at the end of each year, with the fastest and slowest office, so you can see the movement rather than a single snapshot.' },
      { q: 'Why is the national N-400 average shorter than most office ranges?', a: 'The average in the report to Congress covers every naturalization case USCIS decided in the month, in every office, from receipt to decision. The office range is a different measure: its median case and the time by which 80% of its cases were done. A long tail of slow cases pushes the 80% mark up much more than it moves an average.' },
      { q: 'Does filing the N-400 early shorten the naturalization processing time?', a: 'It does not shorten the processing itself, but it starts the clock sooner. USCIS accepts Form N-400 up to 90 days before you reach the five-year mark, or the three-year mark for spouses of U.S. citizens, provided the other requirements are met. Our early filing calculator gives the first date from the date on your green card.' },
      { q: 'Can I choose a faster field office for my N-400?', a: 'No. USCIS assigns the field office from the address on your application, so the range that applies to you is the one for the office covering where you live. A move to another area can transfer the case. Keep your address current with Form AR-11 within ten days of moving, so notices reach you.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '–' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>A wait that fell, then climbed again</h2>
<p>The naturalization queue has not stood still since the first publication in our series, in March 2022. We took the last publication of each year for every field office and kept the upper bound, the 80% mark. The middle office tells the story better than any single city.</p>
${h.table(['End of year', 'Median office, upper bound', 'Fastest office', 'Slowest office', 'Publication'], years.map((r) => [String(r.y), `${m(r.med)} months`, `${m(r.lo)} months`, `${m(r.hi)} months`, h.date(r.last)]), 'N-400 upper bounds at the 90 field offices, last USCIS publication of each year. The current year uses the latest publication.', ['l', 'r', 'r', 'r', 'l'])}
<p>${story ? `The median dropped from ${m(peak.med)} months at the end of ${peak.y} to ${m(low.med)} at the end of ${low.y}, then rose back to ${m(medNow)}. Anyone comparing advice written during the fast period with today’s figures will find it optimistic.` : `Year-end medians have ranged from ${m(low.med)} to ${m(peak.med)} months; the latest is ${m(medNow)}.`}</p>
<h2>Your office decides more than the average does</h2>
<p>The report to Congress gives ${m(nat.months)} months for ${h.month(natYm)}. That is a true number for the country, but it hides a spread of ${m(slow.n400!.max - fast.n400!.max)} months between ${fast.name} and ${slow.name}. Two neighbors who file the same week can wait very different lengths of time only because their addresses fall in different service areas.</p>
<h2>Before the clock starts</h2>
<p>The range counts from the receipt date, so the filing date is the one lever you control. USCIS accepts the application 90 days before the five-year anniversary of permanent residence, or three years for spouses of citizens, as long as residence and physical presence are met. Our ${h.a('n-400-early-filing-calculator', 'early filing calculator')} gives that date, and the ${h.a('guide-n400-residence', 'residence guide')} explains how long trips count. Check the Form N-400 page on ${h.src('n400Form', 'uscis.gov')} for the current edition before mailing or filing online.</p>`;
    },
  },
  es: {
    path: "tiempos-de-proceso/n-400",
    nav: 'Tiempo del N-400', card: 'Cuánto tarda la ciudadanía en cada oficina de USCIS, con las oficinas de la frontera y del sur de California.',
    title: 'N-400 tiempo de proceso 2026: ciudadanía por oficina',
    description: 'Cuánto tarda la ciudadanía en 2026: el rango del N-400 en las 90 oficinas de USCIS, las oficinas de la frontera, el promedio nacional y cómo leer su aviso.',
    h1: 'Tiempo de proceso del N-400: cuánto tarda la ciudadanía',
    intro: 'Elija su oficina de USCIS y escriba la fecha de recibo de su N-400 para ver cuánto lleva su caso frente al rango publicado.',
    resume: `Para un residente permanente que pide la ciudadanía con el formulario N-400, el tiempo depende sobre todo de la oficina local (field office) que le toca según su domicilio. En la publicación de USCIS del ${pubEs}, la cifra alta del rango va de ${n(fast.n400!.max, 'es')} meses en ${fast.name} a ${n(slow.n400!.max, 'es')} meses en ${slow.name}, y la oficina típica de las 90 está en ${n(medNow, 'es')} meses. Esa cifra alta es el plazo en que la oficina resolvió el 80 % de sus casos; la baja es el caso mediano. El informe de USCIS al Congreso da otra medida, el promedio de todas las decisiones del mes: ${n(nat.months, 'es')} meses en ${monthName(natYm, 'es')}, con ${n(nat.pending, 'es')} solicitudes pendientes. Las dos cifras son ciertas, pero el promedio nacional no le dice cuánto tardará su oficina. La tabla de esta página muestra las oficinas de la frontera con México, del sur de California y del sur de Florida que no aparecen entre las 20 más grandes.`,
    faqs: [
      { q: '¿Cuánto tarda la ciudadanía americana si vivo cerca de la frontera con México?', a: 'Depende de la oficina que cubre su domicilio: Harlingen, El Paso, Imperial o San Diego, por ejemplo, publican rangos distintos y USCIS los actualiza cada mes. La tabla de esta página muestra la cifra actual de cada una. La herramienta de arriba aplica el rango de su oficina a la fecha de recibo de su propio aviso I-797C.' },
      { q: '¿Puedo pedir la ciudadanía si viajo seguido a México o Centroamérica?', a: 'Los viajes cortos no rompen la residencia continua. Una ausencia de más de seis meses crea la presunción de que se rompió, aunque se puede demostrar lo contrario, y una ausencia de un año o más la rompe. Además hay que sumar la presencia física mínima. Si tiene viajes largos, consulte a un abogado de inmigración o a un representante acreditado.' },
      { q: '¿Cuánto cuesta el N-400 y existe una tarifa reducida para la ciudadanía?', a: `La tarifa del N-400 es de ${usdEs(F4.paper)} en papel y ${usdEs(F4.online)} en línea, según el formulario G-1055 de 2026. Existe una tarifa reducida de ${usdEs(F4.reduced)} para hogares cuyos ingresos no pasan del 400 % de la línea federal de pobreza, solo en papel. Pagar la tarifa reducida no cambia el tiempo de proceso.` },
      { q: '¿El N-400 se tarda menos si lo presento en línea?', a: 'USCIS publica un solo rango por oficina para el N-400, sin separar las solicitudes en papel de las presentadas en línea. Presentar en línea cuesta menos y le da acceso a su caso en su cuenta de USCIS, pero no hay una cifra oficial que muestre un tiempo distinto. El reloj empieza en la fecha de recibo de su aviso.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '–' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Las oficinas que más le importan a una familia latina</h2>
<p>La tabla general de abajo muestra las 20 oficinas más grandes. Muchas familias mexicanas y centroamericanas, sin embargo, viven en zonas que atienden oficinas más pequeñas: el Valle del Río Grande, El Paso, el Valle Imperial, el Inland Empire o el sur de Florida.</p>
${h.table(['Oficina', 'Rango publicado del N-400', 'Puesto de 90 (1 = más rápida)', 'Consultas para recibos hasta'], ES_OFFICES.map((c) => [O[c].name, `${m(O[c].n400!.min)} a ${m(O[c].n400!.max)} meses`, h.num(O[c].n400Rank), O[c].n400!.inquiry ? h.date(O[c].n400!.inquiry!) : '–']), `Publicación de USCIS del ${h.date(PUBLISHED)}.`, ['l', 'r', 'r', 'l'])}
<h2>El promedio nacional no es su plazo</h2>
<p>Cuando alguien le dice que la ciudadanía tarda unos ${m(nat.months)} meses, probablemente leyó el informe al Congreso de ${h.month(natYm)}. Ese número junta todos los casos decididos en el mes. El rango de su oficina dice otra cosa: en cuánto tiempo terminó la mitad de los casos y en cuánto el 80 %. Entre la oficina más rápida y la más lenta hay hoy ${m(slow.n400!.max - fast.n400!.max)} meses de diferencia.</p>
<h2>Lo que usted sí puede preparar</h2>
<p>USCIS acepta el N-400 hasta 90 días antes de cumplir cinco años de residencia, o tres si está casado con un ciudadano, siempre que cumpla la residencia continua y la presencia física. La ${h.a('n-400-early-filing-calculator', 'calculadora de presentación anticipada')} le da esa fecha. Si se muda, avise a USCIS con el formulario AR-11 en un plazo de diez días: su caso puede pasar a otra oficina con otro rango. Si tiene dudas, busque un abogado de inmigración o un representante acreditado por el Departamento de Justicia (${h.src('legalHelp', 'lista oficial')}).</p>`;
    },
  },
});
