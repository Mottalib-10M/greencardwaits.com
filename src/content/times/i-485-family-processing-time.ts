import { definePage } from '../../lib/guide-types';
import PT from '../../data/ptimes.json';
import { NATIONAL_MONTH, PUBLISHED } from '../../lib/engine/ptimes';
import { formatNumber, displayDate } from '../../lib/format';
import { monthName } from '../../lib/text';

// Chiffres lus dans les données : I-485 familial dans les 90 bureaux, séries depuis mars 2022, rapport au Congrès.
type L = 'en' | 'es';
type Row = [string, number | null, number | null];
type B = { min: number | null; max: number | null; inquiry: string | null } | null;
interface Off { name: string; n400: B; i485fam: B; i485famRank: number; hist: { n400?: Row[]; i485fam?: Row[] } }
const O = (PT as unknown as { offices: Record<string, Off> }).offices;
const NF = (PT as unknown as { national: { forms: Record<string, { months: number; received: number; pending: number }> } }).national.forms;
const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const [mName, mYear] = NATIONAL_MONTH.split(' ');
const natYm = `${mYear}-${String(MN.indexOf(mName) + 1).padStart(2, '0')}`;
const n = (x: number | null | undefined, l: L = 'en') => (x == null ? '—' : formatNumber(x, x % 1 ? 1 : 0, l));
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); const k = Math.floor(s.length / 2); return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
const nat = NF['I-485 family'];
const offs = Object.values(O).filter((o) => o.i485fam?.max != null).sort((a, b) => a.i485fam!.max! - b.i485fam!.max!);
const fastest = offs.slice(0, 5), slowest = offs.slice(-5).reverse();
const wa = slowest.filter((o) => o.name.endsWith(', WA'));
const medNow = median(offs.map((o) => o.i485fam!.max!));
const slowerThanN400 = offs.filter((o) => o.n400?.max != null && o.i485fam!.max! > o.n400.max).length;
const yearEnd = (k: 'n400' | 'i485fam') => {
  const first = Number(Object.values(O).flatMap((o) => o.hist[k] ?? []).map((r) => r[0]).sort()[0].slice(0, 4));
  const last = Number(PUBLISHED.slice(0, 4));
  return Array.from({ length: last - first + 1 }, (_, i) => first + i).map((y) => {
    const xs = Object.values(O).map((o) => (o.hist[k] ?? []).filter((r) => r[0].startsWith(String(y)) && r[2] != null).pop()).filter(Boolean).map((r) => r![2]!);
    return { y, med: median(xs) };
  });
};
const famYears = yearEnd('i485fam'), natYears = yearEnd('n400');
const prevYear = famYears[famYears.length - 2];
const natPrev = natYears[natYears.length - 2], natNow = natYears[natYears.length - 1];
const pubEn = displayDate(PUBLISHED, 'en-US');
const pubEs = displayDate(PUBLISHED, 'es-US');

export default definePage({
  id: "i-485-family-processing-time", group: "times", order: 502, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i485fam", "office": "HOU"},
  data: {"form": "i-485-family"},
  related: ["processing-times", "i-765-processing-time", "i-131-processing-time", "marriage-green-card-cost", "guide-final-action-vs-dates-for-filing"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i485Form", "aosCharts", "legalHelp"],
  en: {
    path: "processing-times/i-485-family",
    nav: 'I-485 family-based', card: 'Family green card interview times at all 90 field offices, from the fastest to the slowest, with the trend.',
    title: 'I-485 Processing Time 2026: Family-Based Green Card',
    description: 'Family-based I-485 processing time in 2026 at all 90 USCIS field offices: the five fastest and slowest, how the range grew this year, and the national average.',
    h1: 'Family-based I-485 processing time at every USCIS field office',
    intro: 'Pick the field office on your interview or receipt notice and enter the receipt date to see where your adjustment of status case stands.',
    resume: `A family-based green card application filed inside the United States, Form I-485, is decided at one of 90 USCIS field offices, and the office makes a large difference. In the USCIS publication of ${pubEn}, the upper bound of the range, the point by which 80% of that office’s cases were finished, runs from ${n(offs[0].i485fam!.max)} months in ${offs[0].name} to ${n(offs[offs.length - 1].i485fam!.max)} months in ${offs[offs.length - 1].name}. The middle office sits at ${n(medNow)} months, ${medNow >= prevYear.med ? 'up' : 'down'} from ${n(prevYear.med)} at the end of ${prevYear.y}. The report to Congress for ${NATIONAL_MONTH} gives a national average of ${n(nat.months)} months, a much shorter figure, because it averages every family adjustment decided in the month instead of measuring how long the slower part of one office’s queue takes. USCIS had ${n(nat.pending)} family-based applications pending. In ${n(slowerThanN400)} of the 90 offices, the family I-485 takes longer than naturalization at the same address.`,
    faqs: [
      { q: 'Why is the family-based I-485 slower than the N-400 at the same field office?', a: 'They are separate queues decided by the same officers. USCIS publishes each one with its own range, and at almost every office the family adjustment range is the longer of the two. USCIS does not publish a reason office by office, so we report the figures as they stand rather than guess at the cause.' },
      { q: 'Does the family I-485 processing time include waiting for a visa number?', a: 'The published range counts from the receipt date to a decision, whatever happened in between. For preference categories, USCIS can only approve the green card once the priority date is earlier than the Final Action Date in the Visa Bulletin. Spouses, parents and minor children of U.S. citizens have no such wait, because a visa is always available to immediate relatives.' },
      { q: 'When will USCIS answer an inquiry about a family-based I-485 that seems stuck?', a: 'Each field office has its own inquiry date for family adjustment. If the receipt date on your Form I-797C is on or before that date, the case is outside normal processing time and USCIS accepts a case inquiry. The checker on this page shows the date for the office you select, and whether your own receipt date already qualifies.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      const row = (o: Off) => [o.name, `${m(o.i485fam!.min)} to ${m(o.i485fam!.max)} months`, h.num(o.i485famRank), o.i485fam!.inquiry ? h.date(o.i485fam!.inquiry) : '—'];
      return `<h2>The ends of the list</h2>
<p>The table below the checker covers the 20 largest offices. The extremes sit elsewhere, in smaller cities and in one state that dominates the slow end.</p>
${h.table(['Field office', 'Published range', 'Rank of 90', 'Inquiries for receipts up to'], [...fastest.map(row), ...slowest.map(row)], 'Five fastest, then five slowest, by the upper bound of the family-based I-485 range.', ['l', 'r', 'r', 'l'])}
<p>${wa.length >= 2 ? `Washington State holds ${h.num(wa.length)} of the slowest five: ${wa.map((o) => o.name.replace(', WA', '')).join(', ')}. ` : ''}A gap of ${m(slowest[0].i485fam!.max! - fastest[0].i485fam!.max!)} months separates the top of the list from the bottom.</p>
<h2>This year against last year</h2>
<p>At the end of ${prevYear.y}, the median office published ${m(prevYear.med)} months as its upper bound. In the latest edition it is ${m(medNow)}. Naturalization at the same offices went from ${m(natPrev.med)} to ${m(natNow.med)} months over the same period. The national average of ${m(nat.months)} months for ${h.month(natYm)} moves differently, because a monthly average of completed cases includes many files that moved quickly and reacts slowly to a growing tail of old ones.</p>
<h2>Two clocks for preference cases</h2>
<p>For a spouse or child of a green card holder, or a sibling of a citizen, the office range is only one clock. The other is the Visa Bulletin: USCIS can accept the I-485 under the chart it designates each month, on its ${h.src('aosCharts', 'filing charts page')}, but approval waits for the ${h.a('guide-final-action-vs-dates-for-filing', 'Final Action Date')}. An interview can be ready before the visa number is. Immediate relatives of citizens have only the office clock.</p>`;
    },
  },
  es: {
    path: "tiempos-de-proceso/i-485-familia",
    nav: 'I-485 por familia', card: 'Cuánto tarda el ajuste de estatus por familia en su oficina de USCIS y qué hacer mientras espera.',
    title: 'I-485 por familia 2026: tiempo de proceso de USCIS',
    description: 'Tiempo de proceso del I-485 por familia en 2026: el rango de su oficina de USCIS, cómo cambió desde 2022 y los permisos de trabajo y de viaje mientras espera.',
    h1: 'I-485 por familia: cuánto tarda el ajuste de estatus',
    intro: 'Escriba la fecha de recibo de su I-485 y elija su oficina de USCIS para ver cuánto lleva su caso frente al rango publicado.',
    resume: `Cuando un familiar ya está en Estados Unidos y puede pedir la residencia sin salir del país, presenta el formulario I-485, el ajuste de estatus (adjustment of status). La decisión la toma una de las 90 oficinas locales de USCIS (field offices), casi siempre después de una entrevista, y cada oficina tiene su propio ritmo. En la publicación del ${pubEs}, la cifra alta del rango, el plazo en que se resolvió el 80 % de los casos, va de ${n(offs[0].i485fam!.max, 'es')} meses en ${offs[0].name} a ${n(offs[offs.length - 1].i485fam!.max, 'es')} meses en ${offs[offs.length - 1].name}; la oficina típica está en ${n(medNow, 'es')} meses. El informe al Congreso de ${monthName(natYm, 'es')} da un promedio nacional de ${n(nat.months, 'es')} meses, más corto porque promedia todos los casos terminados en el mes. Las dos cifras son ciertas. Mientras el caso está pendiente, el permiso de trabajo y el permiso de viaje tienen sus propios tiempos.`,
    faqs: [
      { q: '¿Cuánto tarda la residencia por matrimonio con un ciudadano si ajusto estatus aquí?', a: 'El cónyuge de un ciudadano es pariente inmediato (immediate relative): siempre hay una visa disponible, así que no espera al Visa Bulletin. Su tiempo es el de la oficina de USCIS que le toca por domicilio, que la herramienta de arriba muestra con su fecha de recibo. Las tarifas del caso completo están en la página del costo de la green card por matrimonio.' },
      { q: '¿Puedo trabajar mientras espero la decisión de mi I-485 por familia?', a: 'Puede pedir un permiso de trabajo con el formulario I-765 en la categoría (c)(9), basado en el I-485 pendiente, junto con el I-485 o después. Ese permiso tiene su propio tiempo de proceso, publicado aparte por USCIS, y su propia tarifa. La página del tiempo del I-765 muestra el rango actual del Centro Nacional de Beneficios.' },
      { q: '¿El I-485 por familia tarda más este año que el año pasado?', a: 'Depende de la oficina, pero la tendencia general se ve en la tabla. La tabla de esta página muestra, para cada fin de año desde 2022, la cifra alta del rango en la oficina típica de las 90, junto a la de la ciudadanía. El año en curso usa la última publicación de USCIS, que se actualiza más o menos una vez al mes.' },
    ],
    body: (h) => {
      const m = (x: number | null | undefined) => (x == null ? '—' : h.num(x, x % 1 ? 1 : 0));
      return `<h2>Cómo ha cambiado la espera desde 2022</h2>
<p>Tomamos la última publicación de cada año para las 90 oficinas y nos quedamos con la cifra alta del rango. La oficina del medio resume bien lo que viven las familias que esperan su entrevista.</p>
${h.table(['Fin de año', 'I-485 por familia, oficina típica', 'N-400, oficina típica'], famYears.map((r, i) => [String(r.y), `${m(r.med)} meses`, natYears[i] ? `${m(natYears[i].med)} meses` : '—']), 'Mediana de las 90 oficinas, cifra alta del rango (80 % de los casos). El año en curso usa la última publicación.', ['l', 'r', 'r'])}
<p>La oficina típica ${medNow > prevYear.med ? 'subió' : 'bajó'} de ${m(prevYear.med)} meses a fines de ${prevYear.y} a ${m(medNow)} ahora. En ${h.num(slowerThanN400)} de las 90 oficinas, el ajuste por familia tarda más que la ciudadanía.</p>
<h2>Dos relojes según el parentesco</h2>
<p>Para el esposo, la esposa, los hijos solteros menores de 21 años o los padres de un ciudadano, solo cuenta el reloj de la oficina. Para los demás, por ejemplo el hijo casado de un ciudadano (F3) o el hermano (F4), hay un segundo reloj: la fecha de prioridad (priority date) debe estar al día en el Visa Bulletin. USCIS indica cada mes en su ${h.src('aosCharts', 'página de tablas de presentación')} con qué tabla se puede presentar el I-485.</p>
<h2>Mientras espera</h2>
<p>Con el I-485 pendiente se puede pedir el ${h.a('i-765-processing-time', 'permiso de trabajo (I-765)')} y el ${h.a('i-131-processing-time', 'permiso de viaje (advance parole)')}. Cada uno tiene su propio tiempo, a veces más largo de lo que la familia espera. Antes de viajar, consulte a un abogado de inmigración o a un representante acreditado (${h.src('legalHelp', 'lista del Departamento de Justicia')}).</p>`;
    },
  },
});
