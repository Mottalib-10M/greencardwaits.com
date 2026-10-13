import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';

// Tarifs I-131 du G-1055 (édition 10/07/26), lus dans params-2026.json.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const both = F.i131.advanceParolePaper + F.i765.withPendingI485Since2024;
const save = F.i131.advanceParolePaper - F.i131.advanceParoleOnline;

export default definePage({
  id: "i-131-fee", group: "fees", order: 608, parent: "fees",
  tool: {"kind": "fees", "path": "marriage"},
  data: {"special": "allfees"},
  related: ["fees", "i-131-processing-time", "i-765-fee", "i-485-fee", "guide-n400-residence"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "i131Form", "legalHelp", "n400Residence"],
  en: {
    path: "fees/i-131",
    nav: 'I-131 fee', card: 'Advance parole with a pending I-485, the reentry permit for green card holders, paper and online.',
    title: 'I-131 Fee 2026: Advance Parole and Reentry Permit Cost',
    description: 'The I-131 fee in 2026: advance parole with a pending I-485 on paper or online, the zero fee for cases filed before April 2024, and the reentry permit cost.',
    h1: 'The I-131 fee for advance parole and the reentry permit',
    intro: 'Switch advance parole on or off in the calculator to see what the travel document adds to an adjustment of status.',
    resume: `Form I-131 covers several travel documents, and the two that green card applicants and holders use most have their own prices in the USCIS fee schedule G-1055 dated ${P.g1055_edition}. Advance parole requested while an I-485 is pending costs ${en(F.i131.advanceParolePaper)} on paper or ${en(F.i131.advanceParoleOnline)} online. Applicants whose I-485 was filed with its fee before April 1, 2024, and is still pending, pay ${en(F.i131.withPendingI485Before2024)}. A reentry permit, which a permanent resident requests before a long trip abroad, costs ${en(F.i131.reentryPermitPaper)} on paper. Advance parole matters because leaving the United States while an I-485 is pending, without it, can lead USCIS to treat the application as abandoned, with some exceptions for certain work visa holders. Together with the work permit at ${en(F.i765.withPendingI485Since2024)}, the two interim documents add ${en(both)} per person to an adjustment filed on paper. The schedule lists no separate biometrics fee.`,
    faqs: [
      { q: 'Is advance parole on Form I-131 required to travel with a pending I-485?', a: `For most applicants, leaving without advance parole can lead USCIS to treat the I-485 as abandoned. Holders of certain work statuses, such as H-1B or L-1, who keep that status and return on it are an exception described in the form instructions. Advance parole costs ${en(F.i131.advanceParolePaper)} on paper. If your past includes unlawful presence, ask an attorney before any trip.` },
      { q: 'How much is the I-131 reentry permit for a green card holder?', a: `${en(F.i131.reentryPermitPaper)} on paper, under the G-1055 dated ${P.g1055_edition}. A permanent resident files it from inside the United States before a long trip. It does not change the naturalization rules: an absence of more than six months still raises the presumption of a break in continuous residence for the N-400, and one year or more breaks it.` },
      { q: 'Why does the I-131 advance parole fee repeat for each family member?', a: `Each person who wants to travel needs their own document, so a couple with two children who all hold pending I-485 cases files four I-131 forms at ${en(F.i131.advanceParolePaper)} each on paper. Filing online, where it is open, saves ${en(save)} per form. Cases with a fee-paid I-485 from before April 1, 2024 pay ${en(F.i131.withPendingI485Before2024)}.` },
    ],
    body: (h) => `
<h2>A form with several jobs</h2>
<p>The ${h.src('i131Form', 'I-131')} is the travel form for very different people: someone waiting on a green card who needs to visit a sick parent, a green card holder taking a two-year assignment abroad, a refugee. The G-1055 prices each use separately. This page covers the two that sit inside green card cases.</p>
${h.table(['Document', 'Paper', 'Online'], [
  ['Advance parole, I-485 filed with fee since April 1, 2024', h.usd(F.i131.advanceParolePaper), h.usd(F.i131.advanceParoleOnline)],
  ['Advance parole, fee-paid I-485 filed before April 1, 2024', h.usd(F.i131.withPendingI485Before2024), h.usd(F.i131.withPendingI485Before2024)],
  ['Reentry permit for a permanent resident', h.usd(F.i131.reentryPermitPaper), 'Not listed'],
], `Form G-1055, edition ${P.g1055_edition}.`, ['l', 'r', 'r'])}
<h2>Advance parole as insurance</h2>
<p>Many applicants file the I-131 with the ${h.a('i-485-fee', 'I-485')} even with no trip planned, because a family emergency abroad does not wait for a processing queue. That choice costs ${h.usd(F.i131.advanceParolePaper)} per person on paper. The document does not guarantee readmission; an officer at the port of entry still decides. Anyone with a record of unlawful presence or a prior removal should speak to a licensed attorney or a ${h.src('legalHelp', 'DOJ-accredited representative')} first, because leaving can trigger bars that a fee cannot fix.</p>
<h2>The reentry permit and citizenship</h2>
<p>A reentry permit helps a resident show that a long absence was not meant to give up the green card. It is a separate question from naturalization: for the N-400, an absence over six months is presumed to break continuous residence and one of a year or more breaks it, reentry permit or not. The ${h.a('guide-n400-residence', 'continuous residence guide')} covers the exceptions.</p>
<h2>Renewing</h2>
<p>Advance parole is issued for a limited period, so long pending cases renew it, often together with the ${h.a('i-765-fee', 'work permit')}. See the ${h.a('i-131-processing-time', 'I-131 processing time')} before booking travel.</p>`,
  },
});
