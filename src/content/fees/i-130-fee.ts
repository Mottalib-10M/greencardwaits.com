import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';

// Tarifs I-130 du G-1055 (édition 10/07/26), lus dans params-2026.json.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const save = F.i130.paper - F.i130.online;
const threeKids = 3 * F.i130.paper;

export default definePage({
  id: "i-130-fee", group: "fees", order: 606, parent: "fees",
  tool: {"kind": "fees", "path": "family-consular"},
  data: {"special": "allfees"},
  related: ["fees", "i-130-processing-time", "consular-processing-cost", "marriage-green-card-cost", "guide-priority-date"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees", "i130Form", "cfr204_2", "cfr204_1", "vbOct2026"],
  en: {
    path: "fees/i-130",
    nav: 'I-130 fee', card: 'The petition for a relative on paper or online, and how many petitions a family really needs.',
    title: 'I-130 Fee 2026: Petition for Alien Relative Paper or Online',
    description: 'The I-130 fee in 2026 is set by the G-1055 of 10/07/26, paper or online. When one petition covers a family, when each child needs one, and what comes next.',
    h1: 'The I-130 fee and how many petitions to pay for',
    intro: 'Pick the family path to see the I-130 next to every fee that follows it, at a consulate or inside the United States.',
    resume: `Form I-130, the Petition for Alien Relative, costs ${en(F.i130.paper)} on paper and ${en(F.i130.online)} when filed online, under the USCIS fee schedule G-1055 dated ${P.g1055_edition}. It is the first fee in almost every family green card case and the one that fixes the priority date: the day USCIS receives the petition becomes the place in line for the preference categories F1 to F4. The fee is paid by the petitioner, the U.S. citizen or permanent resident, once per beneficiary. In the preference categories, the beneficiary’s spouse and unmarried children under 21 can follow on the same petition, so a sibling with a family of four needs one I-130. In immediate relative cases each person needs a separate petition, so a citizen bringing three stepchildren pays ${en(threeKids)} on paper. The I-130 does not give a green card on its own: an I-485 or a consular visa still follows.`,
    faqs: [
      { q: 'Does each child need a separate I-130 fee?', a: `It depends on the category. A U.S. citizen petitioning for a spouse and stepchildren files one I-130 per person, each at ${en(F.i130.paper)} on paper, because immediate relatives cannot be derivatives. A citizen petitioning for a married son, or a sibling, pays once and the beneficiary’s spouse and minor children follow on that petition.` },
      { q: 'Is the I-130 fee refunded if the petition is denied or withdrawn?', a: `USCIS fees pay for adjudication, so a denied or withdrawn I-130 does not bring the ${en(F.i130.paper)} back. A petition filed with the wrong fee or an unsigned form can be rejected and returned instead, which keeps the money but loses the filing date. That date is the priority date, so it is worth getting right.` },
      { q: 'Can a permanent resident file an I-130 online for the same fee as a citizen?', a: `The fee does not depend on who files: ${en(F.i130.paper)} on paper and ${en(F.i130.online)} online for citizens and permanent residents alike. What changes is who can be petitioned. A green card holder can only file for a spouse and unmarried children, in categories F2A and F2B, while a citizen can also file for parents, married children and siblings.` },
    ],
    body: (h) => `
<h2>The fee that buys a place in line</h2>
<p>For most family cases, ${h.usd(F.i130.paper)} paid on paper, or ${h.usd(F.i130.online)} online, is what starts the clock. The receipt notice for the ${h.src('i130Form', 'I-130')} carries the priority date, and in the four family preference categories that date is compared every month with the ${h.a('visa-bulletin', 'Visa Bulletin')}. Two families who file a year apart in the same category and country pay the same fee and stand a year apart in the queue. Filing online saves ${h.usd(save)}, but the date is fixed the same way either way.</p>
<h2>One petition or several</h2>
<p>The number of petitions matters more than the price of each. Immediate relatives of a citizen, meaning a spouse, parents and unmarried children under 21, each need their own I-130. Preference beneficiaries can bring a spouse and minor children as derivatives on one petition. A citizen in Phoenix sponsoring her married brother in Manila, his wife and two children files one petition; the same citizen sponsoring her husband and his two children from an earlier marriage files three. The ${h.a('guide-priority-date', 'priority date guide')} explains why derivatives share the beneficiary’s date.</p>
<h2>What comes after the I-130</h2>
<p>Approval is not a green card. Inside the United States the next step is an I-485, at ${h.usd(F.i485.paper)} per person on paper. From abroad, the case moves to the National Visa Center, which collects ${h.usd(F.dosImmigrantFamily.amount)} per immigrant for the visa and ${h.usd(F.dosAffidavitReview.amount)} to review the affidavit of support, and then the ${h.usd(F.immigrantFee.amount)} Immigrant Fee before travel. The ${h.a('consular-processing-cost', 'consular cost page')} adds them up.</p>
<h2>Before you mail it</h2>
<p>The current G-1055 lists no separate biometrics fee with the I-130. Check the amount in the ${h.src('feeCalculator', 'USCIS fee calculator')} the week you file, and see the ${h.a('i-130-processing-time', 'I-130 processing time')} for the wait that follows.</p>`,
  },
});
