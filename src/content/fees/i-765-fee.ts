import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';

// Tarifs I-765 du G-1055 (édition 10/07/26) et note de params-2026.json sur l'I-485 pendant.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const discount = F.i765.paper - F.i765.withPendingI485Since2024;
const fiveRenewals = 5 * F.i765.withPendingI485Since2024;

export default definePage({
  id: "i-765-fee", group: "fees", order: 607, parent: "fees",
  tool: {"kind": "fees", "path": "marriage"},
  data: {"special": "allfees"},
  related: ["fees", "i-765-processing-time", "i-485-fee", "i-131-fee", "guide-portability"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "i765Form"],
  en: {
    path: "fees/i-765",
    nav: 'I-765 fee', card: 'The work permit fee with a pending I-485, the zero fee for older cases and the standalone price.',
    title: 'I-765 Fee 2026: Work Permit Cost With a Pending I-485',
    description: 'The I-765 fee in 2026: the work permit price with a pending I-485 filed since April 2024, the zero fee for older pending cases, and the standalone paper rate.',
    h1: 'The I-765 work permit fee depends on when your I-485 was filed',
    intro: 'Add the work permit to your adjustment package in the calculator to see how it changes the total for each family member.',
    resume: `The fee for Form I-765, the application for a work permit, depends on what else you have pending. An applicant whose Form I-485 was filed with its fee on or after April 1, 2024 and is still pending pays ${en(F.i765.withPendingI485Since2024)}, the same amount on paper or online, under the USCIS fee schedule G-1055 dated ${P.g1055_edition}. An applicant whose I-485 was filed with its fee between July 30, 2007 and March 31, 2024, and is still pending, pays ${en(F.i765.withPendingI485Before2024)} for the initial permit and each renewal. Without a pending adjustment, the general price listed in the schedule is ${en(F.i765.paper)} on paper and ${en(F.i765.online)} online, and some categories carry their own amounts in the G-1055. The adjustment rate is ${en(discount)} below the standalone paper price, and it applies to each family member who files an I-485. There is no separate biometrics fee.`,
    faqs: [
      { q: 'Why is my I-765 fee zero when my spouse pays for the same work permit?', a: `Because the date of each I-485 decides it. If your I-485 was filed with its fee between July 30, 2007 and March 31, 2024 and remains pending, your I-765 costs ${en(F.i765.withPendingI485Before2024)}. If your spouse filed on or after April 1, 2024, the work permit with that pending I-485 costs ${en(F.i765.withPendingI485Since2024)}. Family members can fall on both sides.` },
      { q: 'Does an I-765 renewal cost the same as the first work permit with an I-485?', a: `In the G-1055 dated ${P.g1055_edition}, the ${en(F.i765.withPendingI485Since2024)} rate is tied to the pending I-485, not to a first or a later filing, so an applicant who renews while the same adjustment is still pending pays it again. People waiting on a long employment backlog can renew several times: five renewals come to ${en(fiveRenewals)}.` },
      { q: 'Is the I-765 cheaper online than on paper?', a: `For the general rate, yes: ${en(F.i765.online)} online against ${en(F.i765.paper)} on paper. For the rate tied to a pending I-485 there is no difference, ${en(F.i765.withPendingI485Since2024)} either way. Check on the USCIS I-765 page whether your category can be filed online before choosing, since not every eligibility code is open to online filing.` },
    ],
    body: (h) => `
<h2>Three prices, one form</h2>
${h.table(['Situation', 'Paper', 'Online'], [
  ['I-485 filed with fee on or after April 1, 2024, still pending', h.usd(F.i765.withPendingI485Since2024), h.usd(F.i765.withPendingI485Since2024)],
  ['I-485 filed with fee from July 30, 2007 to March 31, 2024, still pending', h.usd(F.i765.withPendingI485Before2024), h.usd(F.i765.withPendingI485Before2024)],
  ['No pending I-485, general rate', h.usd(F.i765.paper), h.usd(F.i765.online)],
], `Form G-1055, edition ${P.g1055_edition}. Some eligibility categories have their own amounts.`, ['l', 'r', 'r'])}
<p>The April 2024 line is the one that surprises families. Until then, a fee-paid I-485 carried the work permit with it. Cases filed after that date pay for it separately, and the price comes back with every renewal. Two people in the same household, one who filed in 2023 and one who joined the case in 2025, can receive bills of ${h.usd(F.i765.withPendingI485Before2024)} and ${h.usd(F.i765.withPendingI485Since2024)} for the same card.</p>
<h2>Who needs it</h2>
<p>The permit is optional. A spouse already working on a valid H-1B or L-1 status may not need it during the case; a spouse who entered on a visitor visa has no other way to work while the ${h.a('i-485-fee', 'I-485')} is pending. Employment applicants who plan to change jobs after 180 days under AC21 often keep a work permit as a second safety net; the ${h.a('guide-portability', 'portability guide')} explains the rule.</p>
<h2>Renewals during a long wait</h2>
<p>Where the I-485 was filed on the Dates for Filing chart, the adjustment can stay pending for years before the Final Action Date arrives. Each renewal at the post-2024 rate is another ${h.usd(F.i765.withPendingI485Since2024)}. Plan for it alongside the ${h.a('i-131-fee', 'advance parole renewal')}, which runs on the same clock.</p>
<h2>Timing</h2>
<p>A fee does not set a decision date. See the ${h.a('i-765-processing-time', 'I-765 processing time')} published by USCIS, and file the renewal within the window the ${h.src('i765Form', 'form page')} allows.</p>`,
  },
});
