import { definePage } from '../../lib/guide-types';
import { cellAt, evaluate, MONTHS, LATEST, LATEST_INDEX, COUNTRY_LABEL, type Country } from '../../lib/engine/cases';
import { NATIONAL } from '../../lib/engine/ptimes';
import { cellText, monthName } from '../../lib/text';

// Chiffres lus dans les données (jamais tapés) : bulletin d'octobre 2026 au moment de l'écriture.
// Inde et Chine partagent la colonne générale en F1 et F2B : trois colonnes suffisent.
const COLS: Country[] = ['ROW', 'MX', 'PH'];
const DAY = 86_400_000;
const isIso = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
// Écart en mois entre la date limite F1 et la date limite F2B (positif : F1 plus avancée, donc plus rapide).
const gap = (k: Country, i = LATEST_INDEX) => {
  const a = cellAt('F1', k, 'FAD', i), b = cellAt('F2B', k, 'FAD', i);
  return isIso(a) && isIso(b) ? (Date.parse(a) - Date.parse(b)) / (30.4375 * DAY) : NaN;
};
// Part des bulletins depuis octobre 2015 où la date F2B était plus avancée que la date F1.
const from = MONTHS.indexOf('2015-10');
const f2bAheadShare = (k: Country) => {
  let n = 0, t = 0;
  for (let i = from; i <= LATEST_INDEX; i++) { const g = gap(k, i); if (Number.isFinite(g)) { t++; if (g < 0) n++; } }
  return t ? n / t : 0;
};
const G = Object.fromEntries(COLS.map((k) => [k, gap(k)])) as Record<Country, number>;
const SH = Object.fromEntries(COLS.map((k) => [k, f2bAheadShare(k)])) as Record<Country, number>;
const slower = COLS.filter((k) => G[k] < -0.5); // colonnes où F1 est aujourd'hui plus lente que F2B
const f1mx = cellAt('F1', 'MX', 'FAD'), f2bmx = cellAt('F2B', 'MX', 'FAD');
const f1row = cellAt('F1', 'ROW', 'FAD'), f2brow = cellAt('F2B', 'ROW', 'FAD');
const f2aMx = cellAt('F2A', 'MX', 'FAD'), f2aRow = cellAt('F2A', 'ROW', 'FAD');
// Exemple fixe : un fils né au Mexique avec une date de priorité de juin 2009.
const EX_PD = '2009-06-01';
const exF2B = evaluate('F2B', 'MX', EX_PD), exF1 = evaluate('F1', 'MX', EX_PD);
const n400Avg = NATIONAL['N-400'];
const en = (c: string) => cellText(c, 'en');
const es = (c: string) => cellText(c, 'es');
const st = (r: ReturnType<typeof evaluate>, l: 'en' | 'es') => r.status === 'current' ? (l === 'en' ? 'current' : 'al día') : (l === 'en' ? `about ${Math.round(r.behindMonths)} months behind` : `unos ${Math.round(r.behindMonths)} meses detrás`);
const ahead = (k: Country, l: 'en' | 'es') => {
  const g = G[k];
  if (!Number.isFinite(g)) return '–';
  if (Math.abs(g) <= 0.5) return l === 'en' ? 'about even' : 'casi igual';
  const m = Math.round(Math.abs(g));
  const u = l === 'en' ? (m === 1 ? 'month' : 'months') : (m === 1 ? 'mes' : 'meses');
  return `${g > 0 ? 'F1' : 'F2B'}, ${l === 'en' ? 'by' : 'por'} ${m} ${u}`;
};

export default definePage({
  id: "guide-f2b-to-f1", group: "guides", order: 705,
  mini: "conversion",
  related: ["f2b", "f1-mexico", "f2b-mexico", "guide-cspa", "n-400-processing-time"],
  sources: ["cspaPage", "f2bOptOut", "vbIndex", "visaPriority", "n400Form", "cfr204_2", "cfr205_1"],
  en: {
    path: "guides/f2b-to-f1-conversion",
    nav: 'F2B to F1 conversion', card: 'What a parent’s naturalization does to F2A and F2B petitions, and when staying in F2B is the shorter line.',
    title: 'F2B to F1 Conversion 2026: Naturalization and the Opt-Out',
    description: 'When a green card holder parent becomes a citizen, F2B turns into F1 and F2A into immediate relative. Compare both lines by country and see how to opt out.',
    h1: 'F2B to F1 when a parent naturalizes: which line is shorter',
    intro: 'Enter the country of birth and the priority date to compare the F2B and F1 cutoffs for the same petition this month.',
    resume: `When a green card holder who petitioned for a son or daughter becomes a U.S. citizen, USCIS converts the petition automatically and the priority date stays the same. A child under 21 in F2A becomes an immediate relative, with no visa line at all, and the child’s age freezes on the day of the parent’s naturalization. An unmarried son or daughter 21 or older moves from F2B to F1. That is usually a step forward, but not in every column of the Visa Bulletin: in ${monthName(LATEST, 'en')}, F1 for Mexico is at ${en(f1mx)} while F2B for Mexico is at ${en(f2bmx)}, and since October 2015 the Mexican F2B date has been ahead of F1 in ${Math.round(SH.MX * 100)}% of bulletins. The law lets the son or daughter opt out of the conversion and stay in F2B. The request is a signed letter from the beneficiary, not the parent, sent to the USCIS office that approved the I-130.`,
    faqs: [
      { q: 'Who signs the letter to opt out of the F2B to F1 conversion?', a: 'The son or daughter who is the beneficiary, not the parent who filed the petition. USCIS asks for a signed letter saying the beneficiary wishes to stay in F2B, with the names and dates of birth of both parent and child and the I-130 receipt number. The parent’s signature alone does not make the request.' },
      { q: 'Where is the F2B opt-out request sent?', a: 'To the USCIS office that approved the Form I-130. Its name is printed on the approval notice, and the receipt number on that notice identifies the case. If the family does not know which office approved it, the USCIS Contact Center can tell them, and the Policy Manual says the opt-out can also be requested through the Contact Center.' },
      { q: 'Does the F2B to F1 conversion change the priority date?', a: 'No. The USCIS Policy Manual says that when a petition converts to another family category because circumstances change, the beneficiary keeps the original priority date. The date on the I-130 notice is simply compared with a different row of the Visa Bulletin from the month of the naturalization onward, so only the cutoff it is measured against changes.' },
      { q: 'What happens to an F2A child when the green card holder parent naturalizes?', a: 'If the child is under 21 on the day the parent becomes a citizen, the case converts to immediate relative and the child’s age freezes on that date, so the child cannot age out. Immediate relatives have no annual limit, which means no cutoff to wait for. A son or daughter already 21 or older is in F2B and moves to F1 instead.' },
      { q: 'What happens if an F2B or F1 beneficiary marries?', a: 'The two categories react differently. There is no category for the married son or daughter of a green card holder, so an F2B beneficiary who marries loses the petition. An F1 beneficiary who marries moves to F3, the married son or daughter of a citizen, and keeps the priority date. The order of naturalization and wedding therefore matters.' },
      { q: 'Is F1 always a faster line than F2B after a parent naturalizes?', a: 'No. Both are preference categories with annual limits and per-country cutoffs, and they move at their own pace. In the worldwide column F2B has often been ahead of F1, and in the Mexico column F2B has been ahead in most bulletins since 2015. Compare the two dates for your country in the same month before deciding anything.' },
    ],
    body: (h) => `
<h2>Two petitions change category on the same day</h2>
<p>A green card holder can petition for a spouse or child under 21 (F2A) and for an unmarried son or daughter 21 or older (F2B). The moment that parent takes the oath of citizenship, USCIS treats the existing petitions as if a citizen had filed them. Nobody files anything new: the ${h.src('f2bOptOut', 'Policy Manual')} calls this automatic conversion, and the beneficiary keeps the original priority date. Two things then happen.</p>
<ul>
<li><strong>F2A becomes immediate relative.</strong> A child under 21 on the day of naturalization is now the child of a citizen. Immediate relatives have no yearly cap, so there is no cutoff to wait for, and USCIS says on its ${h.src('cspaPage', 'CSPA page')} that the child’s age freezes on the date the parent became a citizen.</li>
<li><strong>F2B becomes F1.</strong> An unmarried son or daughter 21 or older moves to the first preference, the unmarried son or daughter of a citizen. F1 still has a cap and a cutoff, so the beneficiary keeps waiting, only in another row of the bulletin.</li>
</ul>
<h2>F2A: the clear gain</h2>
<p>For a minor child the conversion removes the line. This month the F2A Final Action Date is ${h.cell(f2aRow)} for most countries and ${h.cell(f2aMx)} for Mexico, so a recent F2A filing can still sit months or years behind. After naturalization that wait disappears; what remains is processing by USCIS or the consulate. The age freeze matters too: a child who would have turned 21 in the F2A line no longer needs the CSPA formula, because an immediate relative’s age is fixed. Our ${h.a('guide-cspa', 'CSPA guide')} explains what happens to children who stay in a preference line.</p>
<h2>F2B to F1: check the two dates before celebrating</h2>
<p>Many families assume that a citizen’s petition is always faster. The bulletin says otherwise. Both F1 and F2B are capped, both are split by country of chargeability, and in some columns F2B has run ahead of F1 for years. The table compares the two Final Action Dates this month and counts, since October 2015, how often F2B was the more advanced of the two.</p>
${h.table(['Column', 'F1 Final Action', 'F2B Final Action', 'Ahead this month', 'Bulletins since Oct. 2015 with F2B ahead'], COLS.map((k) => [k === 'ROW' ? 'All other countries (incl. India, China)' : COUNTRY_LABEL.en[k], h.cell(cellAt('F1', k, 'FAD')), h.cell(cellAt('F2B', k, 'FAD')), ahead(k, 'en'), h.pct(SH[k])]), `${h.month(LATEST)} Visa Bulletin; India and China share the worldwide column in F1 and F2B.`, ['l', 'l', 'l', 'l', 'r'])}
<p>${slower.length ? `This month F1 is the slower line in ${slower.map((k) => COUNTRY_LABEL.en[k]).join(' and ')}: there, a son or daughter who converts falls further from the front, and staying in F2B is the shorter wait.` : 'This month F1 is not behind F2B in any of the three columns, but the history in the last column shows how often that has changed.'} In the worldwide column, F1 reads ${h.cell(f1row)} against ${h.cell(f2brow)} for F2B, yet F2B was ahead in ${h.pct(SH.ROW)} of the bulletins since 2015, so this month’s order is not a rule.</p>
<p>Take a son born in Mexico whose F2B priority date is ${h.date(EX_PD)}. In this month’s bulletin that date is ${st(exF2B, 'en')} in F2B and ${st(exF1, 'en')} in F1. ${exF2B.status === 'current' && exF1.status !== 'current' ? 'If his mother naturalizes now and he does nothing, he moves from a line where his visa is available to one where it is not.' : 'The gap between the two rows is what the mini calculator above measures for any date.'}</p>
<h2>The opt-out under INA 204(k)</h2>
<p>The law allows the son or daughter to refuse the conversion and remain in F2B. The Policy Manual cites INA 204(k)(2) for this, and the USCIS CSPA page describes the steps:</p>
<ul>
<li>The <strong>beneficiary</strong> writes and signs the letter, not the parent.</li>
<li>The letter says the beneficiary wishes to opt out of the conversion from F2B to F1, and gives the names and dates of birth of the beneficiary and the parent and the I-130 receipt number.</li>
<li>It goes to the USCIS office that approved the I-130, named on the approval notice. A family that cannot find it can call the USCIS Contact Center, which the Policy Manual also lists as a way to make the request.</li>
</ul>
<p>The opt-out is a choice about which cutoff to follow, so it only makes sense after comparing both rows for the beneficiary’s country of chargeability. Because the two lines trade places over time, a family may want a licensed immigration attorney or a DOJ-accredited representative to look at the timing, especially if a wedding or a consular interview is near.</p>
<h2>A child who already aged out of F2A</h2>
<p>Some sons and daughters reach F2B by another road. A child listed with a parent in an F2A case, or named in an F2A petition, can turn 21 with a CSPA age that is too high. The Policy Manual says that a derivative child of a green card holder’s spouse who ages out converts automatically to F2B as a principal beneficiary, with no new petition and with the priority date of the original filing. The CSPA chapter adds that an F2A applicant who does not qualify under the formula may continue on the petition converted to F2B or F1. For these families the naturalization question comes twice: first the move from F2A to F2B at 21, then the move from F2B to F1 at the oath, each time with the same date.</p>
<h2>What to check in the month of the oath</h2>
<ul>
<li>The two Final Action Dates for the beneficiary’s country, F1 and F2B, in that month’s bulletin.</li>
<li>Whether the beneficiary is married or planning to marry.</li>
<li>Where the case is: still at USCIS, or already sent on for consular processing.</li>
<li>The receipt number and the approving office, both on the I-797 approval notice.</li>
</ul>
<h2>Marriage changes the answer</h2>
<p>The conversion rules also explain why some families time the naturalization before a wedding. The Policy Manual is plain about it. An F2B beneficiary who marries has no category left, because there is no visa for the married son or daughter of a green card holder; under 8 CFR 205.1 an approved petition is revoked automatically on the marriage. An F1 beneficiary who marries converts to F3, the married son or daughter of a citizen, and keeps the priority date. A divorced F3 beneficiary converts back to F1. So a son or daughter who stays in F2B by opting out keeps the faster line but also keeps the rule that marriage ends the case.</p>
<h2>How long the parent’s naturalization takes</h2>
<p>None of this happens until the oath. USCIS reported an average of ${h.num(n400Avg, 1)} months to decide a naturalization application in its latest report to Congress, and the range at each field office is on our ${h.a('n-400-processing-time', 'N-400 processing time page')}. A parent who can file Form ${h.src('n400Form', 'N-400')} now should know that the conversion lands on the day of the oath, not the day of filing, and that for an F2A child under 21 that day can decide whether the child is still a child.</p>
<p>This guide describes the rules USCIS publishes; it is not legal advice, and we are not affiliated with USCIS or the State Department.</p>`,
  },
  es: {
    path: "guias/conversion-f2b-a-f1",
    nav: 'Conversión F2B a F1', card: 'Qué pasa con la petición de sus hijos cuando usted, residente, se hace ciudadano, y cuándo conviene quedarse en F2B.',
    title: 'Conversión F2B a F1 en 2026: qué pasa al hacerse ciudadano',
    description: 'Usted es residente y se naturaliza: la F2A de su hijo menor pasa a familiar inmediato y la F2B a F1. Compare las dos filas para México y cómo quedarse en F2B.',
    h1: 'Me hice ciudadano: ¿mi hijo pasa de F2B a F1 o le conviene quedarse?',
    intro: 'Elija el país de nacimiento de su hijo y la fecha de prioridad para comparar este mes la fila F2B con la fila F1.',
    resume: `Cuando un residente permanente que pidió a sus hijos se hace ciudadano estadounidense, USCIS convierte la petición sola y la fecha de prioridad no cambia. El hijo menor de 21 años que estaba en F2A pasa a familiar inmediato (immediate relative): ya no hay fila del boletín, y su edad queda congelada el día en que el padre se naturalizó. El hijo soltero de 21 años o más pasa de F2B a F1. Para una familia mexicana eso no siempre es bueno: en ${monthName(LATEST, 'es')}, la F1 de México está en ${es(f1mx)} y la F2B de México en ${es(f2bmx)}, y desde octubre de 2015 la F2B mexicana ha ido por delante de la F1 en el ${Math.round(SH.MX * 100)} % de los boletines. Por eso la ley permite que el hijo pida quedarse en F2B. Lo pide él, no el padre, con una carta firmada a la oficina de USCIS que aprobó la I-130.`,
    faqs: [
      { q: '¿Quién firma la carta para quedarse en F2B cuando el padre se hace ciudadano?', a: 'El hijo o la hija que es beneficiario de la petición, no el padre que la presentó. USCIS pide una carta firmada por el beneficiario donde diga que quiere quedarse en F2B. Si la firma solo el padre, la solicitud no vale. El hijo puede firmarla desde México o desde Centroamérica y enviarla a la oficina indicada.' },
      { q: '¿Qué datos lleva la carta para no pasar de F2B a F1?', a: 'La declaración de que el beneficiario quiere quedarse en la segunda preferencia F2B, su nombre y fecha de nacimiento, el nombre y la fecha de nacimiento del padre o la madre que pidió, y el número de recibo de la I-130, que aparece en los avisos de recibo y de aprobación. Va dirigida a la oficina de USCIS que aprobó la petición.' },
      { q: '¿Mi hija menor de 21 años sigue en la fila si me hago ciudadana estadounidense?', a: 'No. Si su hija tiene menos de 21 años el día de su juramento, la petición F2A pasa a familiar inmediato y la edad de su hija queda congelada en esa fecha, así que ya no puede perder la condición de hija menor. Los familiares inmediatos no tienen límite anual de visas: desaparece la espera del boletín y queda solo el trámite.' },
      { q: '¿Le conviene a mi hijo soltero de Zacatecas seguir en F2B o pasar a F1?', a: 'Depende de las dos fechas de México en el mismo boletín. En la mayoría de los boletines desde 2015 la F2B de México ha ido por delante de la F1 de México, pero eso puede cambiar. Compare las dos casillas el mes en que usted se naturaliza y, si la decisión es difícil, consúltelo con un abogado de inmigración.' },
      { q: '¿Qué pasa si mi hijo en F2B se casa en México antes de que yo me naturalice?', a: 'Pierde la petición. No existe una categoría para el hijo casado de un residente permanente, de modo que USCIS niega la petición pendiente o, si ya estaba aprobada, en general queda revocada. Si el hijo se casa cuando usted ya es ciudadano y él está en F1, pasa a F3 y conserva la fecha de prioridad.' },
      { q: '¿Se pierde la fecha de prioridad cuando la petición F2B se convierte en F1?', a: 'No. El Manual de políticas de USCIS dice que, cuando una petición cambia de categoría porque cambió la situación de la familia, el beneficiario conserva la fecha de prioridad original. Lo único que cambia es la fila del boletín con la que se compara esa fecha, a partir del día del juramento del padre o la madre.' },
    ],
    body: (h) => `
<h2>El día del juramento cambia la petición de sus hijos</h2>
<p>Como residente permanente, usted pudo pedir a su esposa y a sus hijos menores de 21 años en la categoría F2A, y a sus hijos solteros de 21 años o más en la F2B. El día en que jura como ciudadano, USCIS trata esas peticiones como si las hubiera presentado un ciudadano. No hay que llenar otra I-130: el ${h.src('f2bOptOut', 'Manual de políticas de USCIS')} lo llama conversión automática (automatic conversion), y sus hijos conservan la fecha de prioridad original. Pasan dos cosas distintas.</p>
<ul>
<li><strong>La F2A pasa a familiar inmediato.</strong> Si su hijo tiene menos de 21 años el día del juramento, ahora es hijo de ciudadano. Los familiares inmediatos no tienen tope anual, y USCIS explica en su ${h.src('cspaPage', 'página sobre la Ley CSPA')} que la edad del hijo se congela en la fecha en que el padre se hizo ciudadano.</li>
<li><strong>La F2B pasa a F1.</strong> El hijo soltero de 21 años o más pasa a la primera preferencia, hijo soltero de ciudadano. La F1 también tiene tope y fecha límite: su hijo sigue esperando, pero en otra fila del boletín.</li>
</ul>
<h2>Hijos menores: la espera se termina</h2>
<p>Para un hijo menor la conversión quita la fila. Este mes la fecha de acción final de la F2A es ${h.cell(f2aMx)} para México y ${h.cell(f2aRow)} para los demás países, incluidos El Salvador, Guatemala y Honduras. Después del juramento esa espera desaparece; queda el trámite de USCIS o del consulado. Además, el hijo que estaba por cumplir 21 años ya no depende del cálculo de la Ley CSPA, porque la edad de un familiar inmediato queda fija. Lo que pasa con los hijos que siguen en una categoría de preferencia está en la ${h.a('guide-cspa', 'guía de la CSPA')}.</p>
<h2>Hijos solteros mayores: en México, F1 puede ser la fila más lenta</h2>
<p>Muchas familias creen que la petición de un ciudadano siempre va más rápido. El boletín dice otra cosa. La F1 y la F2B tienen sus propios topes, las dos se dividen por país de nacimiento, y en la columna de México la F2B ha ido por delante de la F1 durante años. La tabla compara las dos fechas de este mes y cuenta, desde octubre de 2015, en qué parte de los boletines la F2B iba más adelantada.</p>
${h.table(['Columna', 'F1, acción final', 'F2B, acción final', 'Va adelante este mes', 'Boletines desde oct. 2015 con F2B adelante'], COLS.map((k) => [k === 'ROW' ? 'Resto del mundo (incluye Centroamérica)' : COUNTRY_LABEL.es[k], h.cell(cellAt('F1', k, 'FAD')), h.cell(cellAt('F2B', k, 'FAD')), ahead(k, 'es'), h.pct(SH[k])]), `Boletín de visas de ${h.month(LATEST)}.`, ['l', 'l', 'l', 'l', 'r'])}
<p>${slower.includes('MX') ? 'Este mes la F1 de México va detrás de la F2B de México: un hijo nacido en México que pasa a F1 se aleja de la puerta, y quedarse en F2B es la espera más corta.' : 'Este mes la F1 de México no va detrás de la F2B de México, pero la última columna muestra cuántas veces ha sido al revés.'} Para un hijo nacido en El Salvador, Guatemala u Honduras cuenta la columna general, donde la F1 marca ${h.cell(f1row)} y la F2B ${h.cell(f2brow)}.</p>
<p>Un ejemplo: su hijo nació en Michoacán y su fecha de prioridad F2B es el ${h.date(EX_PD)}. En el boletín de este mes esa fecha está ${st(exF2B, 'es')} en F2B y ${st(exF1, 'es')} en F1. ${exF2B.status === 'current' && exF1.status !== 'current' ? 'Si usted jura como ciudadano ahora y su hijo no hace nada, pasa de una fila donde su visa está disponible a otra donde no lo está.' : 'El simulador de arriba mide esa diferencia para cualquier fecha.'}</p>
<h2>Cómo pedir quedarse en F2B</h2>
<p>La ley (sección 204(k) de la Ley de Inmigración y Nacionalidad, que cita el Manual de políticas) permite que el hijo rechace la conversión y siga en F2B. USCIS describe los pasos:</p>
<ul>
<li>La carta la escribe y la firma <strong>su hijo</strong>, el beneficiario, no usted.</li>
<li>Dice que quiere quedarse en F2B y no pasar a F1, e incluye el nombre y la fecha de nacimiento del hijo y del padre o la madre, y el número de recibo de la I-130.</li>
<li>Se envía a la oficina de USCIS que aprobó la I-130, cuyo nombre aparece en el aviso de aprobación. Si la familia no sabe cuál es, puede llamar al Centro de Contacto de USCIS, que según el Manual también recibe esta solicitud.</li>
</ul>
<p>Quedarse en F2B es escoger con qué fecha límite medirse, así que solo tiene sentido después de comparar las dos casillas del país de nacimiento. Como las dos filas cambian de lugar con los años, vale la pena que un abogado de inmigración con licencia o un representante acreditado por el Departamento de Justicia revise el momento, sobre todo si hay boda o entrevista consular cerca.</p>
<h2>El hijo que ya perdió la F2A al cumplir 21 años</h2>
<p>Algunos hijos llegan a la F2B por otro camino: estaban en la petición F2A de su madre o de su padre y cumplieron 21 años con una edad CSPA demasiado alta. El Manual de políticas explica que el hijo derivado del cónyuge de un residente que pierde la edad pasa solo a F2B como beneficiario principal, sin nueva petición y con la fecha de prioridad original. Para esas familias la conversión llega dos veces: de F2A a F2B a los 21 años, y de F2B a F1 el día del juramento, siempre con la misma fecha.</p>
<h2>Si su hijo piensa casarse</h2>
<p>Aquí la diferencia entre F2B y F1 es enorme. Un hijo en F2B que se casa se queda sin categoría, porque no existe visa para el hijo casado de un residente: según 8 CFR 205.1, la petición aprobada queda revocada automáticamente con la boda. Un hijo en F1 que se casa pasa a F3, hijo casado de ciudadano, y conserva la fecha de prioridad; si después se divorcia, vuelve a F1. Por eso hay familias que esperan el juramento del padre antes de la boda. Y por eso un hijo que pidió quedarse en F2B debe saber que mantiene la fila más rápida, pero también la regla de que casarse termina el caso.</p>
<h2>Cuánto tarda la ciudadanía del padre</h2>
<p>Nada de esto pasa antes del juramento. En su último informe al Congreso, USCIS reportó un promedio de ${h.num(n400Avg, 1)} meses para decidir una solicitud de naturalización, y el rango de cada oficina está en nuestra ${h.a('n-400-processing-time', 'página de tiempos del N-400')}. Si usted puede presentar el ${h.src('n400Form', 'formulario N-400')}, recuerde que la conversión ocurre el día del juramento, no el día en que manda la solicitud, y que para un hijo menor que está por cumplir 21 años ese día puede decidir si sigue siendo hijo menor.</p>
<p>Esta guía describe las reglas que publica USCIS; no es asesoría legal y no tiene relación con USCIS ni con el Departamento de Estado.</p>`,
  },
});
