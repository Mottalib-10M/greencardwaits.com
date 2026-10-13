import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { feeTotal, DEFAULT_FEES } from '../../lib/engine/fees';
import { formatMoney } from '../../lib/format';

// Montants : G-1055 édition 10/07/26 et frais du Département d'État (params-2026.json), jamais tapés.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const es = (n: number) => formatMoney(n, 0, 'es');
// Exemple anglais : famille de quatre, emploi, ajustement de statut, papier, permis de travail et de voyage pour tous.
const fam4 = feeTotal({ ...DEFAULT_FEES, path: 'employment', extraAdults: 2, kidsUnder14: 1 });
const fam4On = feeTotal({ ...DEFAULT_FEES, path: 'employment', extraAdults: 2, kidsUnder14: 1, online: true });
const i140Part = fam4.lines.filter((l) => l.form === 'I-140').reduce((a, l) => a + l.amount * l.count, 0);
const solo = feeTotal({ ...DEFAULT_FEES, path: 'marriage' });
// Exemple espagnol : un résident pétitionne épouse et deux enfants restés au pays, procédure consulaire.
const cons3 = feeTotal({ ...DEFAULT_FEES, path: 'family-consular', consularApplicants: 3 });
const cons1 = feeTotal({ ...DEFAULT_FEES, path: 'family-consular' });

export default definePage({
  id: "uscis-fee-calculator", group: "tools", order: 403,
  tool: {"kind": "fees", "path": "marriage"},
  related: ["fees", "marriage-green-card-cost", "n-400-fee", "employment-green-card-cost", "consular-processing-cost"],
  sources: ["g1055", "g1055pdf", "dosFees", "feeCalculator", "immigrantFee"],
  en: {
    path: "tools/uscis-fee-calculator",
    nav: 'USCIS fee calculator', card: 'Every form in your case, every family member, USCIS and State Department fees in one total.',
    title: 'USCIS Fee Calculator 2026: Total for the Whole Family',
    description: `USCIS fee calculator for the G-1055 of ${P.g1055_edition}: adds every form and family member, paper or online, plus State Department visa fees, shown line by line.`,
    h1: 'USCIS fee calculator: the whole case, not one form',
    intro: 'Choose the path, the number of family members and the options; the total adds every form USCIS and the State Department will charge, each line priced from Form G-1055.',
    resume: `The official USCIS fee calculator looks up the fee for one form at a time. A green card case is rarely one form: a worker sponsored by an employer, a spouse, a 16-year-old and a 9-year-old adjusting status together pay for an I-140, four I-485s at two different prices, four work permits and four travel documents. This calculator adds all of it from the USCIS fee schedule, Form G-1055, edition ${P.g1055_edition}. For that family of four filing on paper the government total is ${en(fam4.total)}, of which ${en(i140Part)} is the I-140 and its Asylum Program Fee, usually paid by the employer; online, where USCIS allows it, the total falls to ${en(fam4On.total)}. The calculator also prices the State Department side of a consular case, which no USCIS tool covers, and applies the reduced I-485 fee for children under 14 filing with a parent, the ${en(F.i765.withPendingI485Since2024)} work permit with a pending I-485, and the paper-only ${en(F.n400.reduced)} N-400 rate.`,
    faqs: [
      { q: 'What does this USCIS fee calculator add that the official one does not?', a: 'The USCIS tool asks you to select one form and returns its fee. This one starts from the path, then multiplies each line by the number of people filing, applies the child rate for the I-485, adds the State Department visa fees and the USCIS Immigrant Fee for consular cases, and separates what goes to each agency. Both read the same G-1055 schedule.' },
      { q: 'Does the USCIS fee calculator total change when I switch to online filing?', a: `Yes, for the forms USCIS sells online at a lower price, such as the I-130, I-485, I-131 and I-140, usually ${en(F.i485.paper - F.i485.online)} less per form. Some lines do not move: the ${en(F.i765.withPendingI485Since2024)} work permit with a pending I-485, the fiancé petition I-129F, which has only a paper price, and the State Department fees. The reduced N-400 fee switches the toggle back to paper.` },
      { q: 'How do I pay the fees from the USCIS fee calculator on a paper filing?', a: 'According to the USCIS fee calculator page, USCIS no longer accepts personal or business checks, money orders or cashier’s checks for paper filings unless an exemption applies. You pay by credit or debit card with Form G-1450 or by bank transfer with Form G-1650 placed in the package. Online filings are paid through Pay.gov.' },
      { q: 'Which costs are missing from the USCIS fee calculator total?', a: 'Anything with no official price: the civil surgeon or panel physician who does the medical exam, certified translations, photos, postage and any attorney. Form I-693 and Form I-864 appear in the list at zero because USCIS charges nothing for them when filed with the I-485. A second I-130 for another relative is also not added; count it yourself.' },
    ],
    body: (h) => `
<h2>From one form to the whole case</h2>
<p>Pick what you are filing from eight paths: a family or employment green card inside the country, the same through a consulate, a fiancé visa followed by adjustment, citizenship, removal of conditions, or a card renewal. The form then shows only the questions that change the bill: how many other family members aged 14 or older file, how many children under 14 file with a parent, whether you want the work permit and the travel document, whether the employer has 25 or fewer staff, and whether household income is within the reduced N-400 limit. The result lists each form with its count, then the USCIS subtotal, the State Department subtotal and the total.</p>
<h2>A family of four, priced line by line</h2>
${h.table(['Form', 'Count', 'Each', 'Line'], fam4.lines.map((l) => [l.form, l.count, h.usd(l.amount), h.usd(l.amount * l.count)]), `Employment green card, adjustment of status, paper filing, G-1055 edition ${h.P.g1055_edition}.`, ['l', 'r', 'r', 'r'])}
<p>The largest single block is not the I-485 but the four optional travel documents. Advance parole costs ${h.usd(F.i131.advanceParolePaper)} per person on paper even with a pending I-485, while the work permit is ${h.usd(F.i765.withPendingI485Since2024)}. A couple adjusting through marriage, with both permits, comes to ${h.usd(solo.total)} for comparison.</p>
<h2>Why the edition matters</h2>
<p>USCIS rejects a package with the wrong fee, and older articles still quote prices from earlier schedules. Every amount here comes from the ${h.src('g1055', 'G-1055 of')} ${h.P.g1055_edition}; the 60-page PDF was read in full for the forms on this site, and when USCIS publishes a new edition the site stops updating until each line is read again. Check your final number against the ${h.src('feeCalculator', 'official calculator')} form by form before you pay.</p>`,
  },
  es: {
    path: "herramientas/calculadora-de-tarifas-uscis",
    nav: 'Calculadora de tarifas USCIS', card: 'Todas las tarifas de su caso, por cada familiar, de USCIS y del consulado, sumadas en un solo total.',
    title: 'Tarifas USCIS 2026: calculadora para toda la familia',
    description: 'Sume lo que cobran USCIS y el consulado por la residencia de su esposa e hijos: cada formulario y cada persona, en papel o en línea, con la tabla G-1055.',
    h1: 'Calculadora de tarifas de USCIS para toda la familia',
    intro: 'Elija el trámite y cuántas personas van a inmigrar; la calculadora suma lo que cobra USCIS y lo que cobra el Departamento de Estado, formulario por formulario.',
    resume: `Cuando un residente o un ciudadano pide a su esposa y a sus hijos, el costo no es el de un formulario sino el de toda la familia. La calculadora oficial de USCIS da la tarifa de un formulario a la vez y no incluye lo que cobra el Departamento de Estado en el consulado. Esta calculadora suma todo con la tabla de tarifas G-1055 del ${P.g1055_edition} y la página de tarifas de visa del Departamento de Estado. Ejemplo: un residente que vive en Chicago pide a su esposa y a sus dos hijos que siguen en Guatemala. Con proceso consular (consular processing), la petición I-130 en papel, tres visas de inmigrante, la revisión de la declaración de patrocinio y tres USCIS Immigrant Fee suman ${es(cons3.total)}. Para una sola persona serían ${es(cons1.total)}. El examen médico con el médico autorizado por la embajada no está incluido porque su precio no lo fija el gobierno.`,
    faqs: [
      { q: '¿La calculadora de tarifas de USCIS cobra la visa por cada hijo?', a: `Sí. En el proceso consular, cada persona que inmigra paga su propia solicitud de visa de inmigrante, ${es(F.dosImmigrantFamily.amount)} en casos familiares, y su USCIS Immigrant Fee de ${es(F.immigrantFee.amount)} antes de viajar. La revisión de la declaración de patrocinio, ${es(F.dosAffidavitReview.amount)}, se cobra una vez por caso. La calculadora multiplica cada línea por el número de personas que usted indica.` },
      { q: '¿Puedo pagar con money order las tarifas que da la calculadora de USCIS?', a: 'Para los formularios en papel, la página de la calculadora oficial de USCIS dice que ya no acepta cheques personales o de negocio, money orders ni cheques de caja, salvo excepciones. Se paga con tarjeta de crédito o débito usando el formulario G-1450, o con transferencia bancaria usando el G-1650, dentro del paquete. En línea se paga por Pay.gov.' },
      { q: '¿Cuánto más cuesta si mi hijo menor de 14 años hace el ajuste aquí?', a: `Si el niño presenta su I-485 junto con uno de sus padres, paga ${es(F.i485.under14WithParentPaper)} en papel en lugar de ${es(F.i485.paper)}. Si presenta solo, paga la tarifa completa. A eso se suman, si los pide, el permiso de trabajo de ${es(F.i765.withPendingI485Since2024)} y el permiso de viaje de ${es(F.i131.advanceParolePaper)} en papel. La calculadora aplica estas tarifas cuando indica cuántos menores de 14 años presentan.` },
    ],
    body: (h) => `
<h2>Una familia, dos agencias</h2>
<p>En un caso familiar por consulado, el dinero va a dos lugares. USCIS cobra la petición I-130, ${h.usd(F.i130.paper)} en papel o ${h.usd(F.i130.online)} en línea, y después la ${h.src('immigrantFee', 'USCIS Immigrant Fee')} por cada persona, que paga la producción de la tarjeta. El Departamento de Estado cobra la visa de inmigrante y la revisión de la declaración de patrocinio en el Centro Nacional de Visas (National Visa Center), según su ${h.src('dosFees', 'página de tarifas')}. La calculadora separa las dos sumas para que sepa cuánto pagar en cada etapa.</p>
<h2>El ejemplo de Chicago, línea por línea</h2>
${h.table(['Formulario', 'Personas', 'Cada uno', 'Total'], cons3.lines.map((l) => [l.form, l.count, h.usd(l.amount), h.usd(l.amount * l.count)]), 'Petición familiar por consulado, esposa y dos hijos, I-130 en papel.', ['l', 'r', 'r', 'r'])}
<p>La calculadora cuenta una sola petición I-130 por caso. Si su abogado le recomienda presentar una petición aparte para cada hijo, sume ${h.usd(F.i130.paper)} por cada una.</p>
<h2>Si su familia ya está en Estados Unidos</h2>
<p>Elija la opción del trámite dentro del país. Ahí cambian las líneas: en vez de la visa, cada persona paga su I-485, con tarifa reducida para los menores de 14 que presentan con un padre, y puede añadir el permiso de trabajo y el de viaje. Si alguien entró sin inspección o tuvo problemas migratorios, puede que no le toque esta vía; consulte primero a un abogado de inmigración con licencia o a un representante acreditado por el Departamento de Justicia.</p>
<h2>Antes de pagar</h2>
<p>Compare cada formulario con la ${h.src('feeCalculator', 'calculadora oficial de USCIS')}, que usa la misma tabla G-1055, y pague solo a USCIS o al Departamento de Estado. Un paquete con la tarifa equivocada puede ser rechazado y devuelto, y la familia pierde semanas.</p>`,
  },
});
