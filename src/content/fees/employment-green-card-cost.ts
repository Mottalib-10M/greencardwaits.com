import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';
import { feeTotal, DEFAULT_FEES } from '../../lib/engine/fees';

// Montants G-1055 (édition 10/07/26) et Département d'État, lus dans params-2026.json ; totaux par le moteur.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const base = { ...DEFAULT_FEES, path: 'employment' as const };
const big = feeTotal(base).total;
const small = feeTotal({ ...base, smallEmployer: true }).total;
const bigOn = feeTotal({ ...base, online: true }).total;
const fam4 = feeTotal({ ...base, extraAdults: 1, kidsUnder14: 2 }).total;
const abroad = feeTotal({ ...base, path: 'employment-consular' }).total;
const petition = F.i140.paper + F.i140.asylumProgramRegular;
const worker = F.i485.paper + F.i765.withPendingI485Since2024 + F.i131.advanceParolePaper;

export default definePage({
  id: "employment-green-card-cost", group: "fees", order: 602, parent: "fees",
  tool: {"kind": "fees", "path": "employment"},
  data: {"fees": "employment"},
  related: ["fees", "i-140-fee", "i-485-fee", "eb-2", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "i140Form", "dosFees", "i526eForm"],
  en: {
    path: "fees/employment-green-card",
    nav: 'Employment green card cost', card: 'I-140, Asylum Program Fee and the I-485 package for a worker and family, by employer size.',
    title: 'Employment Green Card Cost 2026: I-140 to I-485 Fees',
    description: 'Employment green card cost in 2026: the I-140 and its Asylum Program Fee by employer size, then the I-485, work permit and travel document for each relative.',
    h1: 'The government cost of an employment-based green card',
    intro: 'Choose the employer size and the family members who will adjust status to total the USCIS fees from I-140 to green card.',
    resume: `An employment-based green card filed inside the United States costs ${en(big)} in USCIS fees for one worker when the employer has more than 25 employees and everything goes on paper: ${en(F.i140.paper)} for the I-140 petition, a ${en(F.i140.asylumProgramRegular)} Asylum Program Fee, ${en(F.i485.paper)} for the I-485, ${en(F.i765.withPendingI485Since2024)} for the work permit and ${en(F.i131.advanceParolePaper)} for advance parole, under Form G-1055 dated ${P.g1055_edition}. A petitioner with 25 or fewer employees pays a ${en(F.i140.asylumProgramSmall)} Asylum Program Fee, which brings the same case to ${en(small)}, and a nonprofit pays ${en(F.i140.asylumProgramNonprofit)}. Online filing where allowed lowers the larger-employer total to ${en(bigOn)}. A spouse and two children under 14 adjusting with the worker take the family to ${en(fam4)}, because each person files an I-485 but the petition is paid once. A worker who takes the visa at a consulate abroad pays ${en(abroad)} instead.`,
    faqs: [
      { q: 'How much is the Asylum Program Fee in an employment green card case?', a: `It depends on the petitioner. The G-1055 dated ${P.g1055_edition} charges ${en(F.i140.asylumProgramRegular)} to most employers, ${en(F.i140.asylumProgramSmall)} to an employer with 25 or fewer employees, and ${en(F.i140.asylumProgramNonprofit)} to a nonprofit organization. It is paid with Form I-140, on top of the petition fee, and only once per petition.` },
      { q: 'Do my spouse and children each pay for the employment green card?', a: `Not for the petition: one I-140 covers the worker, and the family follows as derivatives. Each family member does file an I-485, at ${en(F.i485.paper)} from age 14 and ${en(F.i485.under14WithParentPaper)} for a younger child filing with a parent, and each may add a work permit and travel document of their own.` },
      { q: 'Is an employment green card cheaper through a consulate abroad?', a: `In fees, yes: ${en(abroad)} for one person, made of the I-140 and Asylum Program Fee, the ${en(F.dosImmigrantEmployment.amount)} employment immigrant visa fee and the ${en(F.immigrantFee.amount)} USCIS Immigrant Fee. There is no I-485, no work permit and no advance parole. The worker must travel for the interview and cannot wait inside the country on a pending application.` },
    ],
    body: (h) => `
<h2>Two halves of one bill</h2>
<p>An employment case is really two filings. The first, the ${h.a('i-140-fee', 'Form I-140')}, proves the job and the worker qualify; it costs ${h.usd(petition)} with the Asylum Program Fee for a larger employer. The second, the adjustment package, turns the approved petition into a green card for each person; a single adult filing the ${h.a('i-485-fee', 'I-485')}, the work permit and the travel document spends ${h.usd(worker)}. The two halves are often years apart, because in a backlogged category such as ${h.a('eb-2-india', 'EB-2 India')} the I-485 can only go in when the priority date allows, while the I-140 can be filed once the labor certification, where one is required, is approved.</p>
<h2>Employer size changes the total</h2>
${h.table(['Petitioner', 'Asylum Program Fee', 'Total for one worker, paper'], [
  ['More than 25 employees', h.usd(F.i140.asylumProgramRegular), h.usd(big)],
  ['25 employees or fewer', h.usd(F.i140.asylumProgramSmall), h.usd(small)],
  ['Nonprofit organization', h.usd(F.i140.asylumProgramNonprofit), h.usd(big - F.i140.asylumProgramRegular)],
], `Form G-1055, edition ${P.g1055_edition}. I-140, I-485, I-765 and I-131 included.`, ['l', 'r', 'r'])}
<p>The fee follows the petitioner, not the worker. A start-up of twelve people and a university hospital may file the same EB-2 petition and pay ${h.usd(F.i140.asylumProgramRegular - F.i140.asylumProgramNonprofit)} apart.</p>
<h2>Waiting years after paying</h2>
<p>Workers who file an I-485 on the Dates for Filing chart can hold a pending case for years. Their work permit and travel document renewals then cost ${h.usd(F.i765.withPendingI485Since2024)} and ${h.usd(F.i131.advanceParolePaper)} each time on paper, unless the I-485 was filed with its fee before April 1, 2024, in which case they cost nothing. Over a long wait these renewals can add up to more than the original petition.</p>
<h2>Investors are priced apart</h2>
<p>The EB-5 investor petition, Form I-526E, has its own fee of ${h.usd(F.i526e.amount)} in the same schedule, before any adjustment. See ${h.a('eb-5', 'EB-5')} for the queue.</p>`,
  },
});
