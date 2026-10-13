import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';

// Tarifs I-140 et Asylum Program Fee du G-1055 (édition 10/07/26), lus dans params-2026.json.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const reg = F.i140.paper + F.i140.asylumProgramRegular;
const sml = F.i140.paper + F.i140.asylumProgramSmall;
const npo = F.i140.paper + F.i140.asylumProgramNonprofit;
const regOn = F.i140.online + F.i140.asylumProgramRegular;

export default definePage({
  id: "i-140-fee", group: "fees", order: 613, parent: "fees",
  tool: {"kind": "fees", "path": "employment"},
  data: {"fees": "employment"},
  related: ["fees", "employment-green-card-cost", "i-140-processing-time", "guide-eb2-to-eb3", "eb-2"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "i140Form"],
  en: {
    path: "fees/i-140",
    nav: 'I-140 fee', card: 'The immigrant worker petition fee and the Asylum Program Fee by employer size, paper or online.',
    title: 'I-140 Fee 2026: Petition Fee Plus the Asylum Program Fee',
    description: 'The I-140 fee in 2026 with the Asylum Program Fee that rides on every petition: full rate, small employers of 25 or fewer, nonprofits, and the online discount.',
    h1: 'The I-140 fee and the Asylum Program Fee that comes with it',
    intro: 'Mark whether the petitioner has 25 or fewer employees to see the I-140 cost and the full employment green card total.',
    resume: `Form I-140, the Immigrant Petition for Alien Workers, costs ${en(F.i140.paper)} on paper and ${en(F.i140.online)} online under the USCIS fee schedule G-1055 dated ${P.g1055_edition}. Every I-140 also carries an Asylum Program Fee, which depends on the petitioner: ${en(F.i140.asylumProgramRegular)} for most employers, ${en(F.i140.asylumProgramSmall)} for an employer with 25 or fewer employees, and ${en(F.i140.asylumProgramNonprofit)} for a nonprofit organization. A paper petition from a larger company therefore costs ${en(reg)}, from a small business ${en(sml)}, and from a nonprofit university or hospital ${en(npo)}. Filing online lowers the larger-employer total to ${en(regOn)}. The petition is paid once for the worker; a spouse and children follow as derivatives and pay only their own I-485 or immigrant visa fees. A second I-140, for instance to move from EB-2 to EB-3 with the same priority date, is a new petition with both fees again. Premium processing is a separate request not included here.`,
    faqs: [
      { q: 'Who qualifies for the reduced Asylum Program Fee on an I-140?', a: `The G-1055 dated ${P.g1055_edition} charges ${en(F.i140.asylumProgramSmall)} instead of ${en(F.i140.asylumProgramRegular)} when the petitioner has 25 or fewer employees, and nonprofit petitioners pay ${en(F.i140.asylumProgramNonprofit)}. A company with 26 employees pays the full rate, so one hire can change the bill by ${en(F.i140.asylumProgramRegular - F.i140.asylumProgramSmall)}. Check how employees are counted in the I-140 instructions before choosing the lower amount.` },
      { q: 'Does an EB-2 to EB-3 downgrade mean paying the I-140 fee twice?', a: `Yes. The second petition in the other category is a new I-140, so it carries the ${en(F.i140.paper)} paper fee and the Asylum Program Fee again, ${en(reg)} in all for a larger employer. The worker can usually keep the earlier priority date once the first petition was approved, which is the reason people pay for the second one.` },
      { q: 'Is the I-140 fee the same for EB-1, EB-2 and EB-3 petitions?', a: `Yes. One price covers all three employment preference categories in the schedule, ${en(F.i140.paper)} on paper or ${en(F.i140.online)} online, plus the Asylum Program Fee. What changes between categories is the paperwork before the petition, such as a labor certification for most EB-2 and EB-3 cases, and the queue after it.` },
    ],
    body: (h) => `
<h2>Two lines on every petition</h2>
${h.table(['Petitioner', 'I-140', 'Asylum Program Fee', 'Total, paper'], [
  ['More than 25 employees', h.usd(F.i140.paper), h.usd(F.i140.asylumProgramRegular), h.usd(reg)],
  ['25 employees or fewer', h.usd(F.i140.paper), h.usd(F.i140.asylumProgramSmall), h.usd(sml)],
  ['Nonprofit organization', h.usd(F.i140.paper), h.usd(F.i140.asylumProgramNonprofit), h.usd(npo)],
], `Form G-1055, edition ${P.g1055_edition}. Online filing lowers the I-140 line to ${h.usd(F.i140.online)}.`, ['l', 'r', 'r', 'r'])}
<p>The Asylum Program Fee is what makes the ${h.src('i140Form', 'I-140')} different from every other form in a green card case. It does not depend on the worker, the category or the country of birth, only on the petitioner. The same engineer sponsored by a cloud company and by a research university can have petitions ${h.usd(reg - npo)} apart in cost.</p>
<h2>Paying again for a better queue</h2>
<p>Indian and Chinese workers in long backlogs sometimes file a second petition in a neighbouring category when its cutoff moves ahead. Each new petition is a full fee, ${h.usd(reg)} for a larger employer, and the ${h.a('guide-eb2-to-eb3', 'EB-2 to EB-3 calculator')} shows when the other line is actually ahead before the money is spent. The fee buys a new petition, not a new place in line; the place in line is the earlier priority date that the worker carries over from the approved first petition.</p>
<h2>What follows the petition</h2>
<p>An approved I-140 does not give a green card. The worker and each family member then file an I-485 inside the country when the priority date allows, or go through a consulate, where the employment immigrant visa fee is ${h.usd(F.dosImmigrantEmployment.amount)} per person plus the ${h.usd(F.immigrantFee.amount)} Immigrant Fee. The ${h.a('employment-green-card-cost', 'employment green card cost')} page adds up both routes, and the ${h.a('i-140-processing-time', 'I-140 processing time')} shows how long the petition itself takes.</p>`,
  },
});
