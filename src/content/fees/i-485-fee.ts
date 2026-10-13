import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';

// Tarifs I-485, I-765 et I-131 du G-1055 (édition 10/07/26), lus dans params-2026.json.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const es = (n: number) => formatMoney(n, 0, 'es');
const kidGap = F.i485.paper - F.i485.under14WithParentPaper;
const perPersonFull = F.i485.paper + F.i765.withPendingI485Since2024 + F.i131.advanceParolePaper;
const perKidFull = F.i485.under14WithParentPaper + F.i765.withPendingI485Since2024 + F.i131.advanceParolePaper;
// Famille type de la page espagnole : un adulte, un adolescent de 16 ans, une enfant de 10 ans.
const family = 2 * F.i485.paper + F.i485.under14WithParentPaper;
const familyPermits = 2 * perPersonFull + perKidFull;

export default definePage({
  id: "i-485-fee", group: "fees", order: 605, parent: "fees",
  tool: {"kind": "fees", "path": "marriage"},
  data: {"special": "allfees"},
  related: ["fees", "marriage-green-card-cost", "i-765-fee", "i-131-fee", "i-485-family-processing-time"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "i485Form", "i765Form", "i131Form", "legalHelp", "cfr245"],
  en: {
    path: "fees/i-485",
    nav: 'I-485 fee', card: 'The adjustment of status fee for adults and for children under 14, and what the work permit and travel document add.',
    title: 'I-485 Fee 2026: Adjustment of Status Cost by Age and Filing',
    description: 'The I-485 fee in 2026: the adult price, the reduced fee for a child under 14 filing with a parent, online and paper, plus the I-765 and I-131 filed alongside.',
    h1: 'The I-485 fee for each person in the family',
    intro: 'Add the applicants by age and choose the optional work permit and travel document to see what the adjustment filing costs.',
    resume: `Form I-485, the application to adjust status to permanent resident from inside the United States, costs ${en(F.i485.paper)} on paper and ${en(F.i485.online)} online for anyone aged 14 or older, under the USCIS fee schedule G-1055 dated ${P.g1055_edition}. A child under 14 who files together with a parent’s I-485 pays ${en(F.i485.under14WithParentPaper)} on paper or ${en(F.i485.under14WithParentOnline)} online, ${en(kidGap)} less. The fee is the same in family and employment cases. The work permit and travel document are no longer included: a Form I-765 filed with a pending I-485 costs ${en(F.i765.withPendingI485Since2024)} and advance parole on Form I-131 ${en(F.i131.advanceParolePaper)} on paper, which brings one adult to ${en(perPersonFull)}. Applicants whose I-485 was filed with its fee before April 1, 2024 pay ${en(F.i765.withPendingI485Before2024)} for those renewals. The medical exam on Form I-693 has no USCIS fee; the civil surgeon charges separately.`,
    faqs: [
      { q: 'Does a 13-year-old pay the reduced I-485 fee if the parent filed earlier?', a: `The reduced I-485 fee of ${en(F.i485.under14WithParentPaper)} is for a child under 14 who files with a parent’s I-485, as the G-1055 describes it. A child of 14 or older on the filing date, or one filing alone, pays the full ${en(F.i485.paper)}. If the parent’s case is already pending, read the form instructions or ask an accredited representative before you pay the lower amount.` },
      { q: 'Are the I-765 and I-131 still free with an I-485 filed in 2026?', a: `No. For an I-485 filed on or after April 1, 2024, the work permit with a pending I-485 costs ${en(F.i765.withPendingI485Since2024)} and advance parole ${en(F.i131.advanceParolePaper)} on paper. Only applicants who filed an I-485 with its fee between July 30, 2007 and March 31, 2024, and whose case is still pending, file those two forms at ${en(F.i765.withPendingI485Before2024)}.` },
      { q: 'Is the I-485 fee different for an employment-based green card?', a: `No, the adjustment fee itself is the same ${en(F.i485.paper)} on paper. What changes is everything before it: an employment case starts with Form I-140 and the Asylum Program Fee, while a family case starts with Form I-130. Both paths then add the same I-485, work permit and travel document prices.` },
    ],
    body: (h) => `
<h2>Priced by age, not by category</h2>
<p>The I-485 is the most expensive single form in a green card case filed inside the country, and it is priced per person. Whether the case comes from a marriage, a parent, an employer or the diversity lottery, the ${h.src('g1055', 'G-1055')} charges ${h.usd(F.i485.paper)} on paper to every applicant aged 14 or older and ${h.usd(F.i485.under14WithParentPaper)} to a younger child who files with a parent. A child who turns 14 before the family files is billed as an adult, a difference of ${h.usd(kidGap)}.</p>
<h2>The two optional forms that follow</h2>
<p>Since April 1, 2024 the I-485 no longer carries the work permit and travel document inside its price. They are separate lines: the ${h.a('i-765-fee', 'I-765')} at ${h.usd(F.i765.withPendingI485Since2024)} and the ${h.a('i-131-fee', 'I-131 advance parole')} at ${h.usd(F.i131.advanceParolePaper)} on paper. One adult filing all three spends ${h.usd(perPersonFull)}; a child under 14 filing all three, ${h.usd(perKidFull)}. Applicants whose fee-paid I-485 dates from before that change keep filing both at no cost while the case stays pending.</p>
<h2>Paper against online</h2>
<p>The online price is ${h.usd(F.i485.paper - F.i485.online)} lower for adults and the same amount lower for a child. Check on the ${h.src('i485Form', 'USCIS I-485 page')} whether your situation can be filed online; the calculator above lets you switch both ways.</p>
<h2>What the I-485 fee does not buy</h2>
<p>It does not buy a decision date. The wait depends on the field office and on the visa bulletin in preference cases; see the ${h.a('i-485-family-processing-time', 'family I-485 times')} and the ${h.a('i-485-employment-processing-time', 'employment I-485 times')}. It also leaves out the medical exam, which a civil surgeon prices freely, and any petition fee that comes first.</p>`,
  },
  es: {
    path: "costos/i-485",
    nav: 'Tarifa del I-485', card: 'El costo del ajuste de estatus para cada persona de la familia, de adultos a niños de menos de 14 años.',
    title: 'Tarifa del I-485 2026: ajuste de estatus para la familia',
    description: 'La tarifa del I-485 en 2026 por persona: adultos y jóvenes de 14 años o más, niños menores de 14 con su padre o madre, y los permisos de trabajo y viaje aparte.',
    h1: 'Cuánto cuesta el ajuste de estatus para cada miembro de la familia',
    intro: 'Sume a cada persona de su familia según su edad para ver la tarifa del I-485 y de los permisos que quiera pedir.',
    resume: `El ajuste de estatus (Form I-485) es el trámite para recibir la residencia sin salir de Estados Unidos, y cada persona de la familia paga el suyo. Según la tabla G-1055 de USCIS del ${P.g1055_edition}, cuesta ${es(F.i485.paper)} en papel o ${es(F.i485.online)} en línea para quien tiene 14 años o más, y ${es(F.i485.under14WithParentPaper)} en papel para un niño menor de 14 que presenta junto con su padre o su madre. Una mamá con un hijo de 16 años y una hija de 10 paga ${es(family)} solo de I-485. El permiso de trabajo (I-765) cuesta ${es(F.i765.withPendingI485Since2024)} por persona y el permiso de viaje (advance parole, I-131) ${es(F.i131.advanceParolePaper)}; con ambos para los tres, el total sube a ${es(familyPermits)}. La tarifa es la misma si el caso viene de un familiar o de un empleador. El examen médico se paga al médico autorizado (civil surgeon) y no está incluido.`,
    faqs: [
      { q: '¿Mi hijo de 15 años paga la tarifa completa del I-485?', a: `Sí. La tarifa reducida de ${es(F.i485.under14WithParentPaper)} es solo para niños menores de 14 años que presentan junto con el I-485 de uno de sus padres. Desde los 14 años se paga la tarifa de adulto, ${es(F.i485.paper)} en papel. Si un hijo está por cumplir 14 años, revise su edad en la fecha de presentación.` },
      { q: '¿El permiso de trabajo viene incluido en la tarifa del I-485?', a: `Ya no, si su I-485 se presentó desde el 1 de abril de 2024. El permiso de trabajo cuesta ${es(F.i765.withPendingI485Since2024)} y el permiso de viaje ${es(F.i131.advanceParolePaper)} en papel, por persona. Solo quien presentó su I-485 con tarifa entre el 30 de julio de 2007 y el 31 de marzo de 2024, y sigue pendiente, los presenta sin costo.` },
      { q: '¿Se puede pagar el I-485 de toda la familia en un solo cheque?', a: `Las instrucciones de USCIS sobre la forma de pago cambian y conviene leerlas en la página oficial del I-485 antes de enviar. Lo que no cambia es el monto: cada persona tiene su tarifa según su edad, y un pago por una cantidad equivocada puede hacer que USCIS rechace el paquete completo. Revise el total con la calculadora oficial.` },
    ],
    body: (h) => `
<h2>Una tarifa por persona, según su edad</h2>
<p>En el ajuste de estatus no hay precio por familia. Cada persona llena su propio I-485 y paga su tarifa: ${h.usd(F.i485.paper)} desde los 14 años, ${h.usd(F.i485.under14WithParentPaper)} antes de esa edad si presenta junto con su padre o madre. Para una familia de Houston o de Los Ángeles con hijos de varias edades, eso puede significar una diferencia de ${h.usd(kidGap)} por cada niño según cumpla años antes o después de la fecha de envío. En línea, cuando USCIS lo permite, cada I-485 cuesta ${h.usd(F.i485.paper - F.i485.online)} menos: ${h.usd(F.i485.online)} para un adulto y ${h.usd(F.i485.under14WithParentOnline)} para un menor de 14.</p>
${h.table(['Persona', 'I-485', 'Con permisos de trabajo y de viaje'], [
  ['Mamá', h.usd(F.i485.paper), h.usd(perPersonFull)],
  ['Hijo de 16 años', h.usd(F.i485.paper), h.usd(perPersonFull)],
  ['Hija de 10 años', h.usd(F.i485.under14WithParentPaper), h.usd(perKidFull)],
  ['<strong>Total</strong>', `<strong>${h.usd(family)}</strong>`, `<strong>${h.usd(familyPermits)}</strong>`],
], `Ejemplo en papel, tabla G-1055 del ${P.g1055_edition}. No incluye la petición I-130 ni el examen médico.`, ['l', 'r', 'r'])}
<h2>Los permisos ya no vienen incluidos</h2>
<p>Desde el 1 de abril de 2024, el ${h.a('i-765-fee', 'permiso de trabajo')} y el permiso de viaje se pagan aparte. Son opcionales, pero para quien no tiene otro permiso para trabajar, el I-765 es lo que le deja trabajar mientras espera. El permiso de viaje evita que un viaje fuera del país se considere abandono del caso.</p>
<h2>Antes de este paso</h2>
<p>El I-485 casi nunca viene solo. En un caso familiar va con la petición I-130 o después de ella; en el ${h.a('marriage-green-card-cost', 'caso por matrimonio')} se presentan juntas. Si su familiar entró sin inspección, puede que no califique para ajustar: pregunte a un ${h.src('legalHelp', 'representante acreditado por el DOJ')} o a un abogado de inmigración antes de pagar ${h.usd(F.i485.paper)}.</p>`,
  },
});
