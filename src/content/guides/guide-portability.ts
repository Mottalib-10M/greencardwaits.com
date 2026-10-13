import { definePage } from '../../lib/guide-types';
import { cellAt, evaluate, LATEST, CAT_SHORT } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';

// Exemple suivi dans le texte : date de priorité d'une première I-140 approuvée, personne née en Inde.
const PD = '2015-04-01';
const CATS = ['EB1', 'EB2', 'EB3', 'EW'] as const;
const ex = CATS.map((c) => ({ c, r: evaluate(c, 'IN', PD) }));
const exCn = CATS.map((c) => ({ c, r: evaluate(c, 'CN', PD) }));
const eb2In = cellAt('EB2', 'IN', 'FAD');
const eb2Row = cellAt('EB2', 'ROW', 'FAD');
const en = (v: string) => cellText(v, 'en');
const yrs = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (365.25 * 86_400_000);

export default definePage({
  id: "guide-portability", group: "guides", order: 707,
  mini: "portability",
  related: ["priority-date-calculator", "guide-eb2-to-eb3", "guide-priority-date", "i-485-employment-processing-time", "eb-2-india"],
  sources: ["pmPdRetention", "i140Procedures", "pmPortability", "i140Form", "visaPriority"],
  en: {
    path: "guides/eb-priority-date-portability",
    nav: 'Priority date portability', card: 'Keeping your place in line when you change employers or petitions, and what AC21 adds after 180 days.',
    title: 'Priority Date Portability 2026: Keep It With a New I-140',
    description: 'How an approved I-140 lets you keep your priority date on a later petition, the three exceptions, the 180-day withdrawal rule and AC21 job portability.',
    h1: 'Keeping your priority date when the petition or the job changes',
    intro: 'Enter the priority date of your first approved I-140 and a new category to see where that same date stands in this month’s Visa Bulletin.',
    resume: `A worker who is the beneficiary of an approved Form I-140 generally keeps that petition’s priority date for any later employment-based petition filed for them in the first, second or third preference, according to the USCIS Policy Manual. The date is lost only in three situations: USCIS revokes the first approval for fraud or willful misrepresentation, the Department of Labor revokes the labor certification, or USCIS finds that the approval rested on a material error. A second rule protects the date when an employer pulls out: if the petitioner withdraws an I-140 that has been approved for at least 180 days, or the related I-485 has been pending that long, USCIS does not revoke it and the worker keeps the date. A third rule, from AC21, lets an applicant whose I-485 has been pending 180 days or more move to a new job in the same or a similar occupation. For someone born in India, where the EB-2 cutoff is ${en(eb2In)}, the kept date can be worth many years.`,
    faqs: [
      { q: 'Do I lose my priority date if my employer withdraws my approved I-140?', a: 'Not if the petition had been approved for at least 180 days, or your I-485 had been pending for 180 days or more, when the withdrawal request arrives. USCIS says it will not revoke the approval in that case and you keep the priority date. The job offer itself is treated as withdrawn, so a new basis for the green card is still needed.' },
      { q: 'Which I-140 revocations take away a retained priority date?', a: 'The USCIS Policy Manual lists three: a revocation of the earlier approval because of fraud or willful misrepresentation, a revocation of the labor certification by the Department of Labor, and a finding that the approval was based on a material error. Outside those cases, the earlier approval keeps setting your priority date for later EB-1, EB-2 or EB-3 petitions.' },
      { q: 'Does priority date portability let me change jobs before the 180 days?', a: 'The two rules are separate. Keeping a priority date only needs an approved I-140 and a new petition. Moving the pending green card case itself to a new job under AC21 needs an I-485 pending for at least 180 days. If the I-485 has been pending less than that, USCIS says the approved petition does not stay valid for a new job offer.' },
      { q: 'What is Supplement J in AC21 job portability?', a: 'Form I-485 Supplement J confirms the new job offer when an applicant asks to port a pending employment-based I-485. USCIS requires it for portability requests made on or after January 17, 2017. The new position must fall in the same or a similar occupational classification as the job in the petition, which USCIS weighs on all the circumstances.' },
      { q: 'Can a retained priority date move from EB-2 to EB-1?', a: 'Yes, within the first three preferences. The Policy Manual gives the example of a worker who uses the earlier date to file under either EB-1 or EB-2. The new petition must qualify on its own merits; the old one only supplies the date. Where the new category stands for your country this month is shown by the calculator on this page.' },
      { q: 'Does the new employer have to start a fresh labor certification to keep my priority date?', a: 'The kept date does not replace the requirements of the new petition. If the new category and job require a labor certification, the new employer must meet them as for any other worker; the priority date then comes from the earlier approved I-140. An immigration attorney or a DOJ-accredited representative can say what your particular petition needs.' },
      { q: 'Is priority date retention the same as interfiling or transferring my I-485?', a: 'No. Retention keeps a date from one approved petition to another. Asking USCIS to move a pending I-485 to a different petition is a transfer of underlying basis, a discretionary request made in writing while the I-485 is still pending, with a visa immediately available on the date of the request. Both can apply to the same person.' },
    ],
    body: (h) => `
<h2>Three different things people call portability</h2>
<p>The word is used for three rules that sit in different parts of USCIS guidance and protect different things. The first keeps a priority date from one approved petition to another. The second keeps an approved petition alive when the employer withdraws it late. The third, created by the American Competitiveness in the Twenty-First Century Act and known as AC21, lets a pending green card case follow a worker to a new job. A person can rely on one, two or all three over the life of a case, and mixing them up is the most common reason for a wrong assumption.</p>
<h2>Rule one: the date follows the approved petition</h2>
<p>The ${h.src('pmPdRetention', 'USCIS Policy Manual')} says that once a petition is approved, the beneficiary keeps the priority date set when the labor certification was filed, and can use it on later petitions. Its example is a worker who uses the earlier date to apply under EB-1 or EB-2. The new employer, the new job and the new category can all differ; what travels is the place in line. The date stays behind in three cases only:</p>
<ul>
<li>USCIS revokes the earlier approval because of fraud or willful misrepresentation;</li>
<li>the Department of Labor revokes the labor certification;</li>
<li>USCIS finds that the earlier approval was based on a material error.</li>
</ul>
<p>Nothing in that rule requires the first employer’s cooperation, and nothing requires the first job to still exist. That is what makes it valuable: a worker who leaves a company years after the first I-140 was approved does not go back to the end of the queue.</p>
<h2>Rule two: withdrawal after 180 days</h2>
<p>Employers withdraw petitions when a worker leaves or a business changes. The ${h.src('i140Procedures', 'USCIS page on I-140 procedures')} sets the line at 180 days: if the petitioner asks to withdraw an I-140 that has been approved for at least 180 days, or the related Form I-485 has been pending for 180 days or more, USCIS does not revoke the approval and the beneficiary keeps the priority date. The job offer is treated as withdrawn, so the petition no longer supports a green card on its own, but it stays approved for job portability unless USCIS revokes it on other grounds. Before that mark, a withdrawal can cost the approval.</p>
<h2>Rule three: AC21 and a new job while the I-485 is pending</h2>
<p>The ${h.src('pmPortability', 'Policy Manual chapter on job portability')} lets an applicant change employers without a new petition when four conditions meet:</p>
<ul>
<li>the I-485 has been pending with USCIS for 180 days or more when USCIS receives the request to port;</li>
<li>the applicant is the beneficiary of an approved I-140, or of a pending one that is ultimately approved;</li>
<li>the new job is in the same or a similar occupational classification, judged on all the circumstances, with occupation codes as a help but not the answer;</li>
<li>the new offer is documented on Form I-485 Supplement J, required for requests made on or after January 17, 2017.</li>
</ul>
<p>An applicant who ports this way keeps the priority date of the underlying petition. The count of 180 days starts on the filing date of the I-485, which is one more reason the month in which USCIS accepts the Dates for Filing chart matters so much for employment cases.</p>
<h2>A voice in revocation proceedings</h2>
<p>Workers often ask whether they have any say when an approved I-140 is threatened. The same USCIS procedures page gives them one in a defined case: a beneficiary whose I-485, filed on the basis of a valid I-140, has been pending for 180 days or more, and whose request to port to a new job USCIS has approved, can receive the notices in revocation proceedings and can file a motion or an appeal. The 180-day mark therefore does more than open the way to a job change. It also decides whether the person whose priority date is at stake can answer a notice that threatens it.</p>
<h2>Putting the three clocks on one timeline</h2>
<p>Picture a worker whose first I-140 is approved in year one. From that day, rule one protects the priority date on any later EB-1, EB-2 or EB-3 petition, barring fraud, a revoked labor certification or a material error. One hundred and eighty days after the approval, rule two starts to shield the petition against a withdrawal by the employer. If the worker files an I-485 when the filing chart allows it, a third clock starts on the filing date, and 180 days later AC21 opens the door to a move to a similar job with Supplement J. Each clock runs on its own; one being complete says nothing about the others.</p>
<h2>What a kept date is worth, case by case</h2>
<p>The value of portability depends on the queue you are in. The table takes one example, a priority date of ${h.date(PD)} from a first approved I-140, and places it in each employment category for a person born in India and for one born in mainland China, using the ${h.month(LATEST)} Final Action Dates.</p>
${h.table(
  ['Category', 'India cutoff', 'India, date of ' + h.date(PD), 'China cutoff', 'China, date of ' + h.date(PD)],
  CATS.map((c, k) => {
    const st = (r: typeof ex[number]['r']) => (r.status === 'current' ? 'Current' : r.status === 'unavailable' ? 'Unavailable' : `${h.num(Math.round(r.behindMonths))} months behind`);
    return [CAT_SHORT[c], h.cell(ex[k].r.fad), st(ex[k].r), h.cell(exCn[k].r.fad), st(exCn[k].r)];
  }),
  `One kept priority date in four employment categories, ${h.month(LATEST)} Visa Bulletin`,
  ['l', 'l', 'r', 'l', 'r'],
)}
<p>For an Indian applicant the stakes are plain. The Indian EB-2 cutoff, ${h.cell(eb2In)}, is about ${h.num(yrs(eb2In, eb2Row), 1)} years behind the worldwide date of ${h.cell(eb2Row)}. Starting over with a new priority date today would mean joining the end of that line, while a kept date from an approval years ago may already be close to the front. The ${h.src('visaPriority', 'USCIS page on visa availability')} is a reminder of why: the country of chargeability, usually the country of birth, decides which column applies, and the per-country limit is what makes the Indian and Chinese columns long.</p>
<h2>Where people lose the date by mistake</h2>
<p>Most lost dates come from timing rather than law. A first I-140 that was never approved sets no retained date. A petition withdrawn in its first 180 days, with no I-485 pending that long, can lose its approval. A new job outside the same or a similar occupation does not qualify for AC21 even though the priority date itself may still carry over to a fresh petition. Keep every approval notice for ${h.src('i140Form', 'Form I-140')}: the notice is where the priority date is printed, so a copy belongs in your own records and not only in the employer’s files. When the history includes a revocation, a denial or a change of category, an immigration attorney or a DOJ-accredited representative should read the file before anything is filed.</p>`,
  },
});
