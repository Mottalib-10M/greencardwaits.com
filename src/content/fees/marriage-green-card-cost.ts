import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';
import { feeTotal, DEFAULT_FEES } from '../../lib/engine/fees';

// Montants G-1055 (édition 10/07/26) lus dans params-2026.json et additionnés par le moteur de frais.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const es = (n: number) => formatMoney(n, 0, 'es');
const full = feeTotal({ ...DEFAULT_FEES, path: 'marriage' }).total;
const fullOn = feeTotal({ ...DEFAULT_FEES, path: 'marriage', online: true }).total;
const bare = feeTotal({ ...DEFAULT_FEES, path: 'marriage', ead: false, advanceParole: false }).total;
const extras = full - bare;
const kid = feeTotal({ ...DEFAULT_FEES, path: 'marriage', kidsUnder14: 1 }).total;
const teen = feeTotal({ ...DEFAULT_FEES, path: 'marriage', extraAdults: 1 }).total;
const perKid = kid - full, perTeen = teen - full;
const permits = F.i765.withPendingI485Since2024 + F.i131.advanceParolePaper;

export default definePage({
  id: "marriage-green-card-cost", group: "fees", order: 601, parent: "fees",
  tool: {"kind": "fees", "path": "marriage"},
  data: {"fees": "marriage"},
  related: ["fees", "uscis-fee-calculator", "i-485-fee", "i-751-fee", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "i130Form", "i485Form", "dosFees", "legalHelp", "travelDocs", "cfr204_2"],
  en: {
    path: "fees/marriage-green-card",
    nav: 'Marriage green card cost', card: 'I-130 and I-485 filed together for a spouse in the U.S., with or without work permit and travel document.',
    title: 'Marriage Green Card Cost 2026: I-130 and I-485 Fees',
    description: 'Marriage green card cost in 2026 for a spouse already in the U.S.: I-130 plus I-485, work permit and advance parole, with stepchildren, paper and online.',
    h1: 'What a marriage green card costs when your spouse is already here',
    intro: 'Choose paper or online and add any children to total the USCIS fees for a concurrent I-130 and I-485 filing.',
    resume: `A U.S. citizen who files Form I-130 and Form I-485 together for a spouse living in the United States pays ${en(F.i130.paper)} for the petition and ${en(F.i485.paper)} for the adjustment on paper, under Form G-1055 dated ${P.g1055_edition}. Adding the work permit (${en(F.i765.withPendingI485Since2024)} with a pending I-485) and advance parole for travel (${en(F.i131.advanceParolePaper)}) brings the total to ${en(full)}. Where online filing is open, the same set costs ${en(fullOn)}. Couples who skip both interim documents pay ${en(bare)}. A stepchild under 14 filing with the parent adds ${en(perKid)} once the permits are included, and one aged 14 or older adds ${en(perTeen)}. The affidavit of support, Form I-864, has no USCIS fee. Two years later, a marriage under two years old at approval leads to the I-751 to remove conditions, a separate fee not counted here.`,
    faqs: [
      { q: 'Is the marriage green card cost lower if I skip the work permit and travel document?', a: `Yes, by ${en(extras)} on paper. The I-130 and I-485 alone come to ${en(bare)}. Without the I-765, your spouse cannot work on the pending case; without advance parole, leaving the country while the I-485 is pending can be treated as abandoning it. Both can still be filed later, but then at the price in force at that time.` },
      { q: 'Does my spouse need a separate I-130 fee for each child in a marriage green card case?', a: `A U.S. citizen files one I-130 for the spouse and a separate I-130 for each stepchild who qualifies, each at ${en(F.i130.paper)} on paper. Each child also files an I-485: ${en(F.i485.under14WithParentPaper)} under 14 with a parent, ${en(F.i485.paper)} at 14 or older. A stepchild qualifies only if the marriage took place before the child turned 18, under 8 CFR 204.2.` },
      { q: 'Is there a biometrics fee on top of the marriage green card filing fees?', a: `Not in the current schedule. The G-1055 dated ${P.g1055_edition} lists no separate biometric services fee for the I-130, I-485, I-765 or I-131, so the appointment at the Application Support Center is covered by the form prices. Your spouse still has to attend it when USCIS mails the notice.` },
    ],
    body: (h) => `
<h2>The four forms in one envelope</h2>
<p>Filing the petition and the adjustment together, called concurrent filing, is possible when the sponsor is a U.S. citizen, because a spouse of a citizen is an immediate relative and never waits for a visa number. The bill is then ${h.usd(F.i130.paper)} for the ${h.a('i-130-fee', 'I-130')}, ${h.usd(F.i485.paper)} for the ${h.a('i-485-fee', 'I-485')}, and two optional forms: the ${h.a('i-765-fee', 'I-765 work permit')} at ${h.usd(F.i765.withPendingI485Since2024)} and the ${h.a('i-131-fee', 'I-131 advance parole')} at ${h.usd(F.i131.advanceParolePaper)}. The affidavit of support and the medical exam form carry no USCIS fee, but the civil surgeon bills for the exam separately at a price nobody regulates.</p>
<h2>The optional ${h.usd(permits)}</h2>
<p>The work permit and travel document are where couples have a real choice. Without them the paper total stays at ${h.usd(bare)}. With them it reaches ${h.usd(full)}. For a spouse who already holds a valid work visa, the I-765 may matter less; for one who has no work authorization, it is the only way to work during the months the case is pending. The ${h.a('i-485-family-processing-time', 'family I-485 wait')} at your field office is the number to weigh against the cost.</p>
<h2>When stepchildren file too</h2>
<p>Each child is a separate applicant. A stepchild under 14 who files with the parent pays the reduced I-485 of ${h.usd(F.i485.under14WithParentPaper)}, which with a work permit and travel document adds ${h.usd(perKid)} to the family total. A teenager of 14 or older pays the full adjustment fee, for ${h.usd(perTeen)} more. Add each child’s own I-130 on top, and the calculator above does it line by line.</p>
<h2>A green card sponsored by a permanent resident</h2>
<p>If the sponsor holds a green card rather than citizenship, the spouse falls in category F2A and can only file the I-485 when the ${h.a('f2a', 'F2A cutoff')} allows. The fees are the same; what differs is the wait before the second envelope. Spouses abroad follow the ${h.a('consular-processing-cost', 'consular route')} instead.</p>`,
  },
  es: {
    path: "costos/matrimonio",
    nav: 'Residencia por matrimonio', card: 'Lo que paga un ciudadano por la petición y el ajuste de su cónyuge que ya vive en Estados Unidos.',
    title: 'Residencia por matrimonio 2026: cuánto cuesta en USCIS',
    description: 'Cuánto cuesta la residencia por matrimonio en 2026 si su cónyuge ya vive aquí: I-130, I-485, permiso de trabajo y de viaje, hijos menores, en papel o en línea.',
    h1: 'Cuánto cuesta la residencia por matrimonio con un ciudadano',
    intro: 'Indique si presenta en papel o en línea y cuántos hijos incluye para sumar las tarifas oficiales del caso.',
    resume: `Cuando un ciudadano estadounidense se casa con una persona que ya vive en Estados Unidos y que puede ajustar su estatus, ambos formularios se presentan juntos: la petición de familiar (I-130) cuesta ${es(F.i130.paper)} en papel y el ajuste de estatus (I-485) ${es(F.i485.paper)}, según la tabla G-1055 del ${P.g1055_edition}. Con el permiso de trabajo (${es(F.i765.withPendingI485Since2024)}) y el permiso de viaje o advance parole (${es(F.i131.advanceParolePaper)}), el total llega a ${es(full)}; en línea, donde se permite, a ${es(fullOn)}. Sin esos dos permisos, el caso cuesta ${es(bare)}. Si el cónyuge tiene un hijo menor de 14 años que presenta con él, se suman ${es(perKid)} por ese niño con sus permisos, más su propia I-130. La declaración de patrocinio (I-864) no tiene tarifa. El examen médico se paga al médico autorizado y no está incluido.`,
    faqs: [
      { q: '¿Cuánto cuesta la residencia por matrimonio sin permiso de trabajo?', a: `En papel, ${es(bare)}: ${es(F.i130.paper)} de la I-130 y ${es(F.i485.paper)} del I-485. Sin el permiso de trabajo, su cónyuge no puede trabajar con base en el caso pendiente, y sin advance parole un viaje fuera del país puede hacer que USCIS dé por abandonado el ajuste. Se pueden pedir después, pero con la tarifa vigente en ese momento.` },
      { q: '¿La residencia por matrimonio cuesta lo mismo si mi cónyuge vive en Guatemala?', a: `No. Si su cónyuge vive fuera y hace el proceso consular, no paga el I-485 ni los permisos: paga la I-130, la visa familiar de ${es(F.dosImmigrantFamily.amount)}, la revisión de la declaración de patrocinio de ${es(F.dosAffidavitReview.amount)} y el USCIS Immigrant Fee de ${es(F.immigrantFee.amount)} antes de viajar. El total oficial es menor, pero hay viajes y espera fuera del país.` },
      { q: '¿Hay que pagar biometría aparte en el caso de residencia por matrimonio?', a: `No en la tabla actual. El G-1055 del ${P.g1055_edition} no cobra una tarifa de biometría separada para la I-130, el I-485, el I-765 ni el I-131: la cita para huellas y foto está incluida en el precio de cada formulario. Su cónyuge debe ir a la cita cuando llegue la carta.` },
      { q: '¿Mi esposo puede quedarse con la residencia por matrimonio si yo solo tengo green card?', a: `Puede pedirla, pero no de inmediato. Un residente permanente pide a su cónyuge en la categoría F2A, y el I-485 solo se presenta cuando la fecha de prioridad lo permite según el boletín de visas. Las tarifas son las mismas que para un ciudadano; lo que cambia es la espera antes de presentar el ajuste.` },
    ],
    body: (h) => `
<h2>Un solo paquete para la pareja</h2>
<p>Muchas parejas se casan cuando uno de los dos ya vive aquí con una visa de estudiante, de trabajo o de turista. Si el ciudadano es el que pide, su cónyuge es familiar inmediato (immediate relative), no espera fecha en el boletín y el ajuste se presenta junto con la petición. Eso se llama presentación simultánea (concurrent filing). El paquete lleva la ${h.a('i-485-fee', 'I-485')} de ${h.usd(F.i485.paper)}, la I-130 de ${h.usd(F.i130.paper)} y, si la pareja quiere, el permiso de trabajo (I-765) y el permiso de viaje (I-131).</p>
<h2>¿Valen la pena los ${h.usd(permits)} de los permisos?</h2>
<p>No es una pregunta de dinero solamente. El caso puede tardar meses; sin permiso de trabajo, la persona que espera la residencia no puede trabajar con base en el caso. Sin advance parole, una visita a la familia en Michoacán o en Santa Ana puede costar el caso entero. Con los dos permisos, el total en papel es ${h.usd(full)}; sin ellos, ${h.usd(bare)}. Revise el ${h.a('i-485-family-processing-time', 'tiempo del I-485 familiar')} en su oficina antes de decidir.</p>
<h2>Si su cónyuge tiene hijos</h2>
<p>Cada hijo hace su propio trámite y necesita su propia I-130 como hijastro, si el matrimonio se celebró antes de que el niño cumpliera 18 años. Un menor de 14 años que presenta con su padre o madre paga ${h.usd(F.i485.under14WithParentPaper)} de I-485; desde los 14 años paga la tarifa completa.</p>
<h2>Después de la residencia</h2>
<p>Si llevaban menos de dos años casados cuando se aprobó la residencia, la tarjeta es condicional y dura dos años. Para quitar las condiciones se presenta la I-751, con su propia tarifa. Para orientación sobre su caso, consulte a un abogado de inmigración o a un ${h.src('legalHelp', 'representante acreditado por el Departamento de Justicia')}.</p>`,
  },
});
