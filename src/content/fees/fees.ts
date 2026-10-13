import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';
import { feeTotal, DEFAULT_FEES, type Path } from '../../lib/engine/fees';

// Tous les montants : G-1055 édition 10/07/26 et frais du Département d'État (params-2026.json), jamais tapés.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const es = (n: number) => formatMoney(n, 0, 'es');
const tot = (path: Path, online = false) => feeTotal({ ...DEFAULT_FEES, path, online }).total;
const mar = tot('marriage'), marOn = tot('marriage', true);
const marBare = feeTotal({ ...DEFAULT_FEES, path: 'marriage', ead: false, advanceParole: false }).total;
const cons = tot('family-consular'), consOn = tot('family-consular', true);
const emp = tot('employment'), empC = tot('employment-consular');
const k1 = tot('k1');
const gap = mar - cons;
const save = F.i485.paper - F.i485.online;

export default definePage({
  id: "fees", group: "fees", order: 600,
  tool: {"kind": "fees", "path": "marriage"},
  data: {"special": "allfees"},
  related: ["uscis-fee-calculator", "marriage-green-card-cost", "consular-processing-cost", "n-400-fee", "employment-green-card-cost"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees", "immigrantFee"],
  en: {
    path: "fees",
    nav: 'USCIS fees 2026', card: 'Every green card and citizenship fee in the G-1055 of 10/07/26, paper and online, added up by path.',
    title: 'USCIS Fees 2026: Green Card and Citizenship Fee Schedule',
    description: 'USCIS fees from the G-1055 edition of 10/07/26: I-130, I-485, I-765, I-131, I-140, N-400 and State Department visa fees, totaled for each green card path.',
    h1: 'USCIS fees in 2026, form by form and path by path',
    intro: 'Pick your path and options to add up the government fees you will actually pay, with each line traced to Form G-1055.',
    resume: `USCIS fees for green card and citizenship forms come from one document, Form G-1055, whose current edition is dated ${P.g1055_edition}. A U.S. citizen sponsoring a spouse who lives in the United States pays ${en(mar)} on paper for the I-130, the I-485, the work permit and the travel document, or ${en(marOn)} where online filing is allowed. Leaving out the work permit and travel document brings the same case to ${en(marBare)}. The same family case processed at a consulate abroad costs ${en(cons)}, because the State Department charges ${en(F.dosImmigrantFamily.amount)} for the immigrant visa, ${en(F.dosAffidavitReview.amount)} to review the affidavit of support and USCIS adds a ${en(F.immigrantFee.amount)} Immigrant Fee for the card. Naturalization on Form N-400 is ${en(F.n400.paper)} on paper, ${en(F.n400.online)} online, or ${en(F.n400.reduced)} for households at or below 400% of the federal poverty line. The medical exam, translations and lawyers are never part of these totals.`,
    faqs: [
      { q: 'Which edition of the USCIS fee schedule G-1055 does this page use?', a: `The edition dated ${P.g1055_edition}, read in full from the USCIS PDF. When USCIS publishes a new edition, our build stops until every amount is checked again, so a total on this site never mixes two schedules. Before you mail anything, open the official fee calculator and compare: if the amounts differ, the newer USCIS page wins.` },
      { q: 'Are USCIS fees cheaper online than on paper in 2026?', a: `For most green card forms, yes: the online price is ${en(save)} lower, for example ${en(F.i485.online)} instead of ${en(F.i485.paper)} for the I-485 and ${en(F.i130.online)} instead of ${en(F.i130.paper)} for the I-130. The fiancé petition I-129F has only a paper price in the schedule, and the reduced N-400 fee exists only for paper filings.` },
      { q: 'Do the USCIS fees on this page include the medical exam and a lawyer?', a: `No. Form I-693 has no USCIS fee, but the civil surgeon or panel physician sets their own price, and so do translators, photo shops and attorneys. Nobody publishes an official rate for these, so we show them as excluded instead of guessing a number that could be wrong for your city.` },
      { q: 'Who receives each green card fee, USCIS or the State Department?', a: `Petitions and applications filed inside the United States, such as the I-130, I-485 and N-400, are paid to USCIS. Immigrant visa fees for a case abroad, ${en(F.dosImmigrantFamily.amount)} family or ${en(F.dosImmigrantEmployment.amount)} employment, go to the State Department through the National Visa Center. The ${en(F.immigrantFee.amount)} Immigrant Fee goes back to USCIS before travel.` },
    ],
    body: (h) => `
<h2>Three kinds of money in one bill</h2>
<p>A green card bill has three parts. USCIS charges for petitions and applications, at the prices listed in ${h.src('g1055', 'Form G-1055')}. The State Department charges for immigrant visas issued abroad: ${h.usd(F.dosImmigrantFamily.amount)} for a family case, ${h.usd(F.dosImmigrantEmployment.amount)} for an employment case, ${h.usd(F.dosAffidavitReview.amount)} for the National Visa Center to review the affidavit of support, and ${h.usd(F.dosK.amount)} for a K visa. The third part has no official price at all: the civil surgeon’s medical exam, certified translations, photos, postage and any legal help. We count the first two and name the third, because a guessed number would be worse than none.</p>
<h2>What each path adds up to</h2>
${h.table(['Path', 'Paper', 'Online'], [
  [h.a('marriage-green-card-cost', 'Spouse in the U.S. (I-130 + I-485)'), h.usd(mar), h.usd(marOn)],
  [h.a('consular-processing-cost', 'Family case abroad'), h.usd(cons), h.usd(consOn)],
  [h.a('employment-green-card-cost', 'Employment, adjustment in the U.S.'), h.usd(emp), h.usd(tot('employment', true))],
  ['Employment, visa abroad', h.usd(empC), h.usd(tot('employment-consular', true))],
  [h.a('k-1-visa-cost', 'Fiancé(e) K-1, then I-485'), h.usd(k1), h.usd(tot('k1', true))],
], 'One applicant; adjustment paths include the work permit and advance parole.', ['l', 'r', 'r'])}
<p>The spread is wide. Adjusting status inside the country costs ${h.usd(gap)} more than the consular route for the same marriage, mostly because the I-485 alone is ${h.usd(F.i485.paper)} and the interim work permit and travel document are optional extras that many couples still choose. Employment cases carry the heaviest line of all, the Asylum Program Fee attached to every ${h.a('i-140-fee', 'Form I-140')}.</p>
<h2>Paper or online</h2>
<p>Where USCIS accepts online filing, the schedule usually knocks ${h.usd(save)} off the paper price. Two exceptions matter: the ${h.a('n-400-fee', 'reduced N-400 fee')} of ${h.usd(F.n400.reduced)} is paper only, and the I-129F has no online price. The ${h.usd(F.i765.withPendingI485Since2024)} work permit with a pending I-485 costs the same either way.</p>
<h2>No biometrics line</h2>
<p>Older articles still add a biometrics charge to each form. In the current G-1055 there is no separate biometric services fee for the forms on this page; the cost is built into each form’s price. Check the total against the ${h.src('feeCalculator', 'official USCIS fee calculator')} before you pay, since a package with the wrong amount can be rejected.</p>`,
  },
  es: {
    path: "costos",
    nav: 'Costos de la residencia', card: 'Lo que cobran USCIS y el Departamento de Estado por la residencia y la ciudadanía en 2026, sumado por caso.',
    title: 'Costo de la residencia americana 2026: tarifas de USCIS',
    description: 'Cuánto cuesta la residencia americana en 2026: tarifas oficiales del G-1055 para I-130, I-485, permiso de trabajo y N-400, más los cargos del consulado.',
    h1: 'Cuánto cuesta la residencia americana en 2026',
    intro: 'Elija el caso de su familia y las opciones para ver, línea por línea, las tarifas oficiales que pagará al gobierno.',
    resume: `La residencia permanente (green card) no tiene un precio único: depende de dónde está la persona que va a inmigrar. Si su esposa o esposo ya vive en Estados Unidos y usted es ciudadano, la petición (I-130), el ajuste de estatus (I-485), el permiso de trabajo y el permiso de viaje suman ${es(mar)} en papel según la tabla de tarifas G-1055 del ${P.g1055_edition}. Si su familiar vive en México o en Centroamérica y hace el trámite en el consulado, el total oficial baja a ${es(cons)}: la misma petición de ${es(F.i130.paper)}, ${es(F.dosImmigrantFamily.amount)} para la visa de inmigrante, ${es(F.dosAffidavitReview.amount)} por revisar la declaración de patrocinio en el Centro Nacional de Visas y ${es(F.immigrantFee.amount)} de USCIS Immigrant Fee antes de viajar. Más adelante, la ciudadanía con el N-400 cuesta ${es(F.n400.paper)} en papel o ${es(F.n400.reduced)} con ingresos bajos. El examen médico y los honorarios de un abogado van aparte.`,
    faqs: [
      { q: '¿Cuánto cuesta la residencia americana para un familiar que vive en México?', a: `Con proceso consular, las tarifas oficiales suman ${es(cons)} para una persona: ${es(F.i130.paper)} de la petición I-130 en papel, ${es(F.dosImmigrantFamily.amount)} de visa familiar, ${es(F.dosAffidavitReview.amount)} de revisión de la declaración de patrocinio y ${es(F.immigrantFee.amount)} de USCIS Immigrant Fee. El examen médico con el médico autorizado por la embajada se paga aparte y su precio no lo fija el gobierno.` },
      { q: '¿Las tarifas de USCIS para la residencia se pagan por persona o por familia?', a: `Casi todas son por persona. Cada hijo que hace su propio ajuste de estatus paga su I-485: ${es(F.i485.paper)} si tiene 14 años o más, o ${es(F.i485.under14WithParentPaper)} si es menor de 14 y presenta junto con uno de sus padres. En el consulado, cada inmigrante paga su visa y su Immigrant Fee. La revisión de la declaración de patrocinio se cobra una vez por caso.` },
      { q: '¿Quién puede cobrarme por llenar los formularios de la residencia?', a: `Las tarifas del gobierno se pagan a USCIS o al Departamento de Estado, nunca a una persona. Para ayuda con el caso, busque un abogado de inmigración con licencia o un representante acreditado por el Departamento de Justicia (DOJ). USCIS advierte sobre personas que cobran por trámites sin estar autorizadas; su página de estafas explica cómo reconocerlas.` },
      { q: '¿Cuesta menos presentar la residencia por internet que en papel?', a: `En varios formularios sí: la tabla G-1055 cobra ${es(save)} menos en línea, por ejemplo ${es(F.i130.online)} en vez de ${es(F.i130.paper)} por la I-130. No todo se puede presentar en línea, y la tarifa reducida de la ciudadanía de ${es(F.n400.reduced)} solo existe en papel. Revise el formulario en la página oficial antes de elegir.` },
    ],
    body: (h) => `
<h2>Primero: ¿su familiar está aquí o en su país?</h2>
<p>La pregunta que más cambia el precio no es el formulario, sino el lugar. Quien ya vive en Estados Unidos y puede ajustar su estatus paga el I-485 de ${h.usd(F.i485.paper)} en papel, y muchas familias suman el permiso de trabajo (I-765) y el permiso de viaje (advance parole, I-131) para no quedarse meses sin poder trabajar ni salir del país. Quien vive en Guadalajara, San Salvador o Tegucigalpa hace el proceso consular (consular processing): no paga el I-485, paga la visa al Departamento de Estado. Si su familiar entró sin inspección o tuvo problemas migratorios, la vía posible puede ser otra; eso lo decide un abogado de inmigración, no una calculadora.</p>
<h2>Las dos rutas de una familia, en números</h2>
${h.table(['Caso', 'Papel', 'En línea'], [
  [h.a('marriage-green-card-cost', 'Cónyuge en EE. UU., con permisos'), h.usd(mar), h.usd(marOn)],
  ['Cónyuge en EE. UU., sin permisos', h.usd(marBare), h.usd(feeTotal({ ...DEFAULT_FEES, path: 'marriage', ead: false, advanceParole: false, online: true }).total)],
  [h.a('consular-processing-cost', 'Familiar en su país, por el consulado'), h.usd(cons), h.usd(consOn)],
], 'Una persona. Tarifas G-1055 de USCIS y del Departamento de Estado.', ['l', 'r', 'r'])}
<p>La diferencia entre la primera y la última línea es de ${h.usd(gap)}. No es un juicio sobre cuál conviene: el proceso consular implica viajar, esperar la entrevista fuera y pagar el examen médico con un médico autorizado por la embajada.</p>
<h2>Lo que nunca aparece en la tabla oficial</h2>
<p>El examen médico (formulario I-693) no tiene tarifa de USCIS, pero el médico cobra lo que decide. Las traducciones certificadas de actas de nacimiento o de matrimonio, las fotos y el envío tampoco tienen precio oficial. La declaración de patrocinio (I-864) es gratis cuando se presenta con el I-485; en el consulado, el Centro Nacional de Visas (NVC) cobra ${h.usd(F.dosAffidavitReview.amount)} por revisarla.</p>
<h2>Antes de pagar</h2>
<p>Pague solo a USCIS o al Departamento de Estado. Compare el total con la ${h.src('feeCalculator', 'calculadora oficial de USCIS')} y lea las ${h.src('avoidScams', 'advertencias de USCIS sobre estafas')}. Para la ciudadanía, vea la página del ${h.a('n-400-fee', 'costo del N-400')}.</p>`,
  },
});
