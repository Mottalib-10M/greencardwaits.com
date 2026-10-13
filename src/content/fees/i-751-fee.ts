import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';
import { feeTotal, DEFAULT_FEES } from '../../lib/engine/fees';

// Tarifs I-751 du G-1055 (édition 10/07/26), lus dans params-2026.json.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const save = F.i751.paper - F.i751.online;
const marriage = feeTotal({ ...DEFAULT_FEES, path: 'marriage' }).total;
const whole = marriage + F.i751.paper;

export default definePage({
  id: "i-751-fee", group: "fees", order: 610, parent: "fees",
  tool: {"kind": "fees", "path": "i751"},
  data: {"fees": "i751"},
  related: ["fees", "i-751-processing-time", "marriage-green-card-cost", "n-400-fee", "k-1-visa-cost"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "i751Form"],
  en: {
    path: "fees/i-751",
    nav: 'I-751 fee', card: 'The fee to remove conditions on a two-year green card, joint filing or waiver, paper or online.',
    title: 'I-751 Fee 2026: Removing Conditions on a Green Card',
    description: 'The I-751 fee in 2026 to remove conditions on a two-year marriage green card: paper or online, one fee for joint filing or a waiver, and what comes after it.',
    h1: 'The I-751 fee to turn a conditional green card into a ten-year card',
    intro: 'Choose paper or online to see the I-751 fee, the last USCIS bill of a marriage case before citizenship.',
    resume: `Form I-751, the Petition to Remove Conditions on Residence, costs ${en(F.i751.paper)} on paper and ${en(F.i751.online)} online under the USCIS fee schedule G-1055 dated ${P.g1055_edition}. It is filed by a resident who received a two-year conditional green card because the marriage was less than two years old when the green card was approved. Couples who are still married file it together during the 90 days before the card expires; a spouse who is divorced, widowed or a victim of abuse can ask for a waiver of the joint filing, and the schedule lists the same fee for that petition. Children who received conditional residence through the same marriage can be included in the parent’s petition when the form instructions allow it. The current schedule shows no separate biometrics charge. Added to a marriage case filed inside the country with both permits, the I-751 brings the government total for the green card to ${en(whole)}.`,
    faqs: [
      { q: 'Is the I-751 fee the same for a joint petition and a waiver?', a: `Yes, the G-1055 dated ${P.g1055_edition} lists one fee for Form I-751: ${en(F.i751.paper)} on paper or ${en(F.i751.online)} online. A couple filing together and a divorced spouse asking for a waiver pay the same amount. The evidence differs much more than the price, and a waiver case is a good moment to speak with a licensed immigration attorney.` },
      { q: 'What happens if the I-751 fee is paid after the conditional card expires?', a: `Conditional residence ends when the two-year card expires unless the I-751 has been filed. A late petition can be accepted only with a written explanation of good cause for the delay, and USCIS decides whether to accept it. Paying the fee late is not the problem; filing late is, so the 90-day window is the date to keep.` },
      { q: 'Can I skip the I-751 fee by applying for citizenship instead?', a: `No. A conditional resident still has to remove the conditions; filing the N-400 does not replace the I-751. Spouses of U.S. citizens can apply for citizenship after three years of residence, and a pending I-751 is reviewed along the way, so both fees, ${en(F.i751.paper)} and ${en(F.n400.paper)} on paper, are usually part of the budget.` },
    ],
    body: (h) => `
<h2>The fee that closes the marriage case</h2>
<p>A green card based on a marriage that was under two years old at approval is conditional and valid for two years. To keep residence, the couple pays once more: ${h.usd(F.i751.paper)} on paper or ${h.usd(F.i751.online)} online for the ${h.src('i751Form', 'I-751')}. It is the last USCIS fee of the marriage path before citizenship, and in a joint filing the only one that both spouses sign together.</p>
<h2>A marriage green card from start to finish</h2>
${h.table(['Step', 'Paper fee'], [
  [h.a('marriage-green-card-cost', 'I-130, I-485, work permit and advance parole'), h.usd(marriage)],
  ['I-751, two years later', h.usd(F.i751.paper)],
  ['<strong>Total</strong>', `<strong>${h.usd(whole)}</strong>`],
], `Form G-1055, edition ${P.g1055_edition}. One spouse, no children.`, ['l', 'r'])}
<p>Couples who reached the two-year anniversary before the green card was approved skip this line: their card is a ten-year card from the start.</p>
<h2>Timing the payment</h2>
<p>The petition is filed during the 90 days before the conditional card expires. A petition sent before that window can be returned; one sent after it risks the end of conditional residence. Online filing saves ${h.usd(save)} where it is open to your case. A waiver petition, when the marriage has ended or there was abuse, can be filed outside that window and carries the same fee.</p>
<h2>What the receipt does</h2>
<p>The I-751 receipt notice extends the expiring card for a period printed on the notice, and that letter plus the old card is what a resident shows an employer or at the border while the case is pending. For the wait, see the ${h.a('i-751-processing-time', 'I-751 processing time')}. A resident married to a citizen can reach the ${h.a('n-400-fee', 'N-400')} stage before the I-751 is decided.</p>`,
  },
});
