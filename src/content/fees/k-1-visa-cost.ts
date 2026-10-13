import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';
import { feeTotal, DEFAULT_FEES } from '../../lib/engine/fees';

// Montants G-1055 (édition 10/07/26) et visa K du Département d'État, lus dans params-2026.json.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const k1 = feeTotal({ ...DEFAULT_FEES, path: 'k1' }).total;
const k1Bare = feeTotal({ ...DEFAULT_FEES, path: 'k1', ead: false, advanceParole: false }).total;
const spouseVisa = feeTotal({ ...DEFAULT_FEES, path: 'family-consular' }).total;
const beforeArrival = F.i129f.paper + F.dosK.amount;
const gap = k1 - spouseVisa;

export default definePage({
  id: "k-1-visa-cost", group: "fees", order: 609, parent: "fees",
  tool: {"kind": "fees", "path": "k1"},
  data: {"fees": "k1"},
  related: ["fees", "i-129f-processing-time", "consular-processing-cost", "marriage-green-card-cost", "i-751-fee"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees", "i129fForm", "k1Page"],
  en: {
    path: "fees/k-1",
    nav: 'K-1 visa cost', card: 'Fiancé(e) petition, K visa fee and the I-485 after the wedding, compared with a spousal visa.',
    title: 'K-1 Visa Cost 2026: Fiancé Petition to Green Card Fees',
    description: 'K-1 visa cost in 2026: the I-129F, the State Department K visa fee, then the I-485 and permits after the wedding, against a spousal visa after marrying abroad.',
    h1: 'What the K-1 fiancé(e) route costs from petition to green card',
    intro: 'Set the number of K visa applicants and the optional permits to total every fee from the I-129F to the adjustment of status.',
    resume: `The K-1 fiancé(e) route costs ${en(k1)} in government fees for one person who files the work permit and advance parole after the wedding, or ${en(k1Bare)} without them. It starts with Form I-129F, ${en(F.i129f.paper)} on paper under the USCIS fee schedule G-1055 dated ${P.g1055_edition}, which lists no online price for it. After approval, the State Department charges ${en(F.dosK.amount)} for the K visa application at the consulate. Once in the United States, the couple marries and the foreign spouse files Form I-485, at ${en(F.i485.paper)}, plus ${en(F.i765.withPendingI485Since2024)} for a work permit and ${en(F.i131.advanceParolePaper)} for advance parole if wanted. Because the K-1 is a nonimmigrant visa, the ${en(F.immigrantFee.amount)} USCIS Immigrant Fee does not apply. Marrying first and applying for a spousal immigrant visa through a consulate costs ${en(spouseVisa)} in fees, ${en(gap)} less than the K-1 route with its permits, but it means a wedding abroad.`,
    faqs: [
      { q: 'Is the K-1 visa cost higher than a spousal visa after marrying abroad?', a: `In government fees, yes. The K-1 route totals ${en(k1)} with the work permit and travel document, because the green card is finished inside the country through an I-485. Marrying first and processing a spousal immigrant visa at a consulate comes to ${en(spouseVisa)}, and the spouse arrives as a permanent resident. Timelines differ too, and neither agency promises one.` },
      { q: 'Do children of the fiancé(e) pay the K visa fee too?', a: `Yes. An unmarried child under 21 of the K-1 fiancé(e) can travel on a K-2 visa from the same I-129F, without a separate petition fee, but each K-2 applicant pays the ${en(F.dosK.amount)} visa fee at the consulate. After arrival each child files an I-485: ${en(F.i485.under14WithParentPaper)} under 14 with the parent, ${en(F.i485.paper)} at 14 or older.` },
      { q: 'What happens to the K-1 fees if the wedding does not take place in 90 days?', a: `The K-1 visa allows the fiancé(e) to marry the petitioner within 90 days of arrival. If the marriage does not happen, there is no I-485 to file on that basis and the fees already paid for the I-129F and the visa are not returned. Anyone in that situation should talk to a licensed immigration attorney before the 90 days run out.` },
    ],
    body: (h) => `
<h2>Paid before and after the flight</h2>
<p>The K-1 bill splits around the plane ticket. Before arrival, the couple pays ${h.usd(beforeArrival)}: the ${h.src('i129fForm', 'I-129F')} at ${h.usd(F.i129f.paper)} to USCIS and the K visa at ${h.usd(F.dosK.amount)} to the ${h.src('dosFees', 'State Department')}. After the wedding, the bill starts again inside the country with the ${h.a('i-485-fee', 'I-485')} and, for most couples, the work permit and travel document. The I-129F is the only form in this path that the G-1055 lists at a paper price alone.</p>
<h2>Why the fiancé route costs more than a spousal visa</h2>
${h.table(['Route', 'Before arrival', 'After arrival', 'Total'], [
  ['K-1, then I-485 with permits', h.usd(beforeArrival), h.usd(k1 - beforeArrival), h.usd(k1)],
  ['Spousal immigrant visa abroad', h.usd(spouseVisa), h.usd(0), h.usd(spouseVisa)],
], `One person, paper fees. Form G-1055, edition ${P.g1055_edition}; State Department fees for visa services.`, ['l', 'r', 'r', 'r'])}
<p>The K-1 is a nonimmigrant visa, so the fiancé(e) arrives without a green card and pays a full adjustment of status to get one. A spouse who receives an immigrant visa abroad pays the I-130, the immigrant visa fee, the affidavit review and the Immigrant Fee, and enters as a resident. What the ${h.usd(gap)} difference pays for is, in practice, a wedding in the United States.</p>
<h2>The medical exam twice?</h2>
<p>The K visa requires a medical exam with the embassy’s panel physician, and the I-485 has its own medical form, I-693, with no USCIS fee. Neither doctor’s price is official, so neither is in our total; read the I-485 instructions on whether the earlier exam can be reused.</p>
<h2>After the green card</h2>
<p>A couple married less than two years when the green card is approved receives a two-year conditional card, and the ${h.a('i-751-fee', 'I-751 petition')} to remove conditions has its own fee. See the ${h.a('i-129f-processing-time', 'I-129F processing time')} for the first step.</p>`,
  },
});
