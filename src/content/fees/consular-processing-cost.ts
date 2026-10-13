import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';
import { feeTotal, DEFAULT_FEES } from '../../lib/engine/fees';

// Frais USCIS (G-1055 du 10/07/26) et du Département d'État, lus dans params-2026.json ; totaux par le moteur.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const es = (n: number) => formatMoney(n, 0, 'es');
const one = feeTotal({ ...DEFAULT_FEES, path: 'family-consular' }).total;
const oneOn = feeTotal({ ...DEFAULT_FEES, path: 'family-consular', online: true }).total;
const three = feeTotal({ ...DEFAULT_FEES, path: 'family-consular', consularApplicants: 3 }).total;
const perHead = F.dosImmigrantFamily.amount + F.immigrantFee.amount;
const dosPart = F.dosImmigrantFamily.amount + F.dosAffidavitReview.amount;
const adjust = feeTotal({ ...DEFAULT_FEES, path: 'marriage' }).total;

export default definePage({
  id: "consular-processing-cost", group: "fees", order: 603, parent: "fees",
  tool: {"kind": "fees", "path": "family-consular"},
  data: {"fees": "family-consular"},
  related: ["fees", "uscis-immigrant-fee", "i-130-fee", "guide-aos-vs-consular", "country-mexico"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees", "immigrantFee", "consular", "legalHelp", "ivPosts"],
  en: {
    path: "fees/consular-processing",
    nav: 'Consular processing cost', card: 'I-130, State Department visa fee, affidavit review and USCIS Immigrant Fee for a relative abroad.',
    title: 'Consular Processing Cost 2026: NVC and Visa Fees Added Up',
    description: 'Consular processing cost for a family green card in 2026: I-130, the State Department visa fee, NVC affidavit review and the USCIS Immigrant Fee, per person.',
    h1: 'Consular processing: what a family immigrant visa costs from start to arrival',
    intro: 'Set the number of relatives who will attend the visa interview to total every government fee from petition to green card.',
    resume: `Bringing a relative who lives abroad through consular processing costs ${en(one)} in government fees for one person when the I-130 is filed on paper, or ${en(oneOn)} when it is filed online. The petition goes to USCIS at ${en(F.i130.paper)} (${en(F.i130.online)} online) under Form G-1055 dated ${P.g1055_edition}. Once USCIS approves it, the National Visa Center collects ${en(F.dosImmigrantFamily.amount)} for the family immigrant visa application and ${en(F.dosAffidavitReview.amount)} to review the sponsor’s affidavit of support. After the visa is issued, each immigrant pays USCIS a ${en(F.immigrantFee.amount)} Immigrant Fee so the green card can be produced and mailed. A spouse and children who immigrate with the main beneficiary in a preference category share the petition but each pay ${en(perHead)} more, so a family of three comes to ${en(three)}. The medical exam with the embassy’s panel physician is paid separately and is not included.`,
    faqs: [
      { q: 'When are the consular processing fees paid, and to whom?', a: `In three steps. The I-130 fee is paid to USCIS when the petition is filed. After approval, the National Visa Center invoices the ${en(F.dosImmigrantFamily.amount)} visa fee and the ${en(F.dosAffidavitReview.amount)} affidavit review fee, paid online to the State Department. The ${en(F.immigrantFee.amount)} USCIS Immigrant Fee comes last, once the visa is in the passport and before the trip.` },
      { q: 'Is consular processing cheaper than adjusting status for a spouse?', a: `In government fees, yes. The same marriage costs ${en(adjust)} on paper through an I-485 with work permit and travel document, against ${en(one)} through a consulate. The comparison leaves out what has no official price: travel to the interview city, the panel physician’s exam, and months of living apart while the case moves.` },
      { q: 'Does each child pay the consular processing visa fee separately?', a: `Yes. Every person who receives an immigrant visa files a DS-260 and pays the ${en(F.dosImmigrantFamily.amount)} family visa fee, then the ${en(F.immigrantFee.amount)} Immigrant Fee before travel. The affidavit of support review is charged once per case. In immediate relative cases each child needs his or her own I-130, which adds ${en(F.i130.paper)} on paper per child.` },
      { q: 'What does the panel physician charge for a consular processing medical exam?', a: `There is no official rate. The exam is done by a doctor designated by the U.S. embassy or consulate, who sets the price, including any vaccines required. Neither USCIS nor the State Department publishes it, so we leave it out of every total rather than print a number that might not match your country.` },
    ],
    body: (h) => `
<h2>Three payments across two agencies</h2>
<p>Consular processing moves a case from one government office to another, and each office sends its own bill. USCIS decides the ${h.a('i-130-fee', 'I-130 petition')}. The State Department, through the National Visa Center and then the embassy, decides the visa. USCIS returns at the end to print the card. That is why the total here mixes ${h.usd(F.i130.paper)} paid in the United States, ${h.usd(dosPart)} paid to the ${h.src('dosFees', 'State Department')} and the ${h.a('uscis-immigrant-fee', 'Immigrant Fee')} of ${h.usd(F.immigrantFee.amount)}.</p>
<h2>Who counts as a separate applicant</h2>
<p>The petitioner pays the I-130 once for the main beneficiary. In a preference category such as ${h.a('f3', 'F3')} or ${h.a('f4', 'F4')}, the beneficiary’s spouse and minor children can immigrate on the same petition as derivatives, but each still has a DS-260, a visa fee and an Immigrant Fee. For a married sibling bringing two people with them, that is three visa fees and three Immigrant Fees on one petition. In an immediate relative case, every child needs a petition of their own.</p>
<h2>What the bill does not show</h2>
<p>The affidavit of support (Form I-864) is free to file; the ${h.usd(F.dosAffidavitReview.amount)} is the National Visa Center’s review charge. The medical exam is done abroad by a panel physician whose price varies by country. Police certificates, civil documents and translations are paid locally. None of these have a U.S. government price, so none are in our total.</p>
<h2>Employment cases abroad</h2>
<p>Workers who process at a consulate after an approved I-140 pay ${h.usd(F.dosImmigrantEmployment.amount)} to the State Department instead of ${h.usd(F.dosImmigrantFamily.amount)}, plus the same Immigrant Fee, and no affidavit review. The ${h.a('guide-aos-vs-consular', 'comparison of the two routes')} explains who can choose.</p>`,
  },
  es: {
    path: "costos/proceso-consular",
    nav: 'Costo del proceso consular', card: 'Petición, visa del consulado, revisión del NVC y USCIS Immigrant Fee para su familiar que vive en su país.',
    title: 'Proceso consular 2026: costo de la visa de inmigrante',
    description: 'Proceso consular en 2026: lo que paga una familia por la I-130, la visa de inmigrante del NVC, la revisión del I-864 y el Immigrant Fee, por persona y por caso.',
    h1: 'Cuánto cuesta traer a un familiar por el consulado',
    intro: 'Indique cuántos familiares van a la entrevista para sumar, paso a paso, las tarifas del gobierno de Estados Unidos.',
    resume: `Para un familiar que vive en México, El Salvador, Guatemala u Honduras, la residencia por proceso consular (consular processing) cuesta ${es(one)} en tarifas oficiales para una persona si la petición se presenta en papel. El pago se hace en tres momentos: ${es(F.i130.paper)} a USCIS por la petición de familiar (I-130), según la tabla G-1055 del ${P.g1055_edition}; luego, en el Centro Nacional de Visas (National Visa Center, NVC), ${es(F.dosImmigrantFamily.amount)} por la solicitud de visa familiar y ${es(F.dosAffidavitReview.amount)} por revisar la declaración de patrocinio (I-864); y al final, ya con la visa, ${es(F.immigrantFee.amount)} de USCIS Immigrant Fee para que la tarjeta se imprima y llegue por correo. Si con su hermano vienen su esposa y su hijo, cada uno paga su visa y su Immigrant Fee: ${es(three)} en total. El examen médico con el médico de la embajada se paga aparte.`,
    faqs: [
      { q: '¿En qué orden se pagan las tarifas del proceso consular?', a: `Primero la I-130 a USCIS, de ${es(F.i130.paper)} en papel o ${es(F.i130.online)} en línea. Cuando USCIS la aprueba, el NVC envía las facturas de ${es(F.dosImmigrantFamily.amount)} y ${es(F.dosAffidavitReview.amount)}, que se pagan en línea al Departamento de Estado. El USCIS Immigrant Fee de ${es(F.immigrantFee.amount)} se paga después de recibir la visa y antes de viajar.` },
      { q: '¿Dónde hacen la entrevista consular los familiares que viven en México?', a: `Las visas de inmigrante para quienes viven en México se tramitan en el consulado de Estados Unidos en Ciudad Juárez, el único de México en la lista de consulados que procesan visas de inmigrante del Departamento de Estado. El viaje, el hospedaje y el examen médico no tienen tarifa oficial y no están en nuestro total. Los tiempos del consulado no se publican, así que no los estimamos.` },
      { q: '¿El proceso consular cuesta lo mismo para un hijo menor de 14 años?', a: `Sí. A diferencia del I-485 dentro de Estados Unidos, la visa de inmigrante no tiene precio reducido por edad en nuestra tabla: cada hijo paga ${es(F.dosImmigrantFamily.amount)} de visa familiar y ${es(F.immigrantFee.amount)} de Immigrant Fee. La revisión de la declaración de patrocinio se cobra una sola vez por caso, no por persona.` },
    ],
    body: (h) => `
<h2>Tres pagos a dos agencias</h2>
<p>El proceso consular pasa por dos agencias. USCIS recibe y aprueba la ${h.a('i-130-fee', 'petición I-130')}. Después el caso va al Centro Nacional de Visas y a la embajada o consulado, que dependen del ${h.src('dosFees', 'Departamento de Estado')}. Por eso hay pagos a dos lugares y en fechas distintas, a veces con años de diferencia: en las categorías con fila, como hermanos (F4) o hijos casados (F3), pueden pasar años entre la petición y la factura del NVC.</p>
<h2>Quién paga y cuánto, en una familia típica</h2>
<p>Usted, como peticionario, paga la I-130 una vez. Si pide a su hermano en Guatemala y él viene con su esposa y un hijo, los tres son solicitantes: cada uno llena su DS-260, paga ${h.usd(F.dosImmigrantFamily.amount)} de visa y, antes de viajar, ${h.usd(F.immigrantFee.amount)} de ${h.a('uscis-immigrant-fee', 'USCIS Immigrant Fee')}. Si en cambio pide a sus hijos como ciudadano, cada hijo necesita su propia I-130. La declaración de patrocinio (I-864) la firma usted; no tiene tarifa de USCIS, y el NVC cobra ${h.usd(F.dosAffidavitReview.amount)} por revisarla.</p>
<h2>Lo que se paga en el país de su familiar</h2>
<p>El examen médico se hace con un médico autorizado por la embajada (panel physician), que fija su precio. Las actas, las cartas de antecedentes penales y las traducciones se pagan allá. Ninguno tiene tarifa del gobierno estadounidense.</p>
<h2>Si su familiar ya está en Estados Unidos</h2>
<p>Entonces quizá pueda ajustar su estatus con el I-485, que cuesta más en tarifas pero evita salir del país. Cuál vía se puede usar depende de cómo entró y de su historial: para eso, un abogado de inmigración o un ${h.src('legalHelp', 'representante acreditado por el DOJ')}. Vea también la ${h.a('country-mexico', 'página de México')}.</p>`,
  },
});
