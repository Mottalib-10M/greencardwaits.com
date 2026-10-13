import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';

// Tarifs I-90 et N-400 du G-1055 (édition 10/07/26), lus dans params-2026.json.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const save = F.i90.paper - F.i90.online;
const thirty = 3 * F.i90.paper;
const toCitizen = F.n400.paper - F.i90.paper;

export default definePage({
  id: "i-90-fee", group: "fees", order: 611, parent: "fees",
  tool: {"kind": "fees", "path": "i90"},
  data: {"fees": "i90"},
  related: ["fees", "i-90-processing-time", "n-400-fee", "i-751-fee", "guide-n400-residence"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "i90Form"],
  en: {
    path: "fees/i-90",
    nav: 'I-90 fee', card: 'Renewing or replacing a ten-year green card on Form I-90, paper or online, and when it is the wrong form.',
    title: 'I-90 Fee 2026: Green Card Renewal and Replacement Cost',
    description: 'The I-90 fee in 2026 to renew an expiring green card or replace a lost or damaged one, on paper or online, and how it compares with applying for citizenship.',
    h1: 'The I-90 fee to renew or replace a green card',
    intro: 'Choose paper or online to see what Form I-90 costs before you renew an expiring card or replace a missing one.',
    resume: `Form I-90, the Application to Replace Permanent Resident Card, costs ${en(F.i90.paper)} on paper and ${en(F.i90.online)} online under the USCIS fee schedule G-1055 dated ${P.g1055_edition}, a difference of ${en(save)}. The same fee applies whether the ten-year card is expiring, has been lost, stolen or damaged, or needs a new name after a marriage. The form is only for permanent residents with a ten-year card or an older card without an expiration date; a conditional resident with a two-year card files Form I-751 instead, at its own price. The current schedule lists no separate biometrics charge, although USCIS usually schedules a photo and fingerprint appointment. Renewing every decade costs ${en(thirty)} on paper over thirty years. Naturalization on Form N-400 costs ${en(F.n400.paper)} on paper once, ${en(toCitizen)} more than one renewal. A green card that expires does not end permanent residence, but the card is the usual proof for work and travel.`,
    faqs: [
      { q: 'When should I pay the I-90 fee to renew a green card?', a: `USCIS accepts a renewal on Form I-90 when the ten-year card will expire within six months or has already expired. Filing earlier risks a rejected application. The fee is ${en(F.i90.paper)} on paper or ${en(F.i90.online)} online, and the receipt notice extends the old card’s validity for a period printed on it.` },
      { q: 'Is there any case where Form I-90 has no fee?', a: `The I-90 instructions list situations with no fee, for example a card that USCIS issued with an error it made itself, such as a misspelled name taken correctly from your documents. Read the instructions for your exact reason before you pay ${en(F.i90.paper)}, because the fee rule follows the reason you select on the form.` },
      { q: 'Does an expired green card mean I lost my status before I pay the I-90?', a: `No. Permanent residence does not expire with the card, so a resident with an expired ten-year card is still a resident. What changes is practical: employers, airlines and border officers ask for an unexpired card. Long absences abroad are a separate question that the I-90 fee does not settle.` },
    ],
    body: (h) => `
<h2>One price for five different reasons</h2>
<p>The ${h.src('i90Form', 'I-90')} does many jobs: renewing a card that expires within six months, replacing a lost or stolen card, fixing a card with a wrong name or date of birth, recording a legal name change, or replacing a card that was damaged. The ${h.src('g1055', 'G-1055')} charges ${h.usd(F.i90.paper)} on paper or ${h.usd(F.i90.online)} online for all of them, with a short list of no-fee cases in the instructions. Filing online costs ${h.usd(save)} less, and the receipt notice then appears in the online account as soon as the case is accepted, which helps when the old card is already gone.</p>
<h2>Wrong form for a two-year card</h2>
<p>Holders of a conditional two-year card from a recent marriage do not renew with an I-90. They remove conditions with the ${h.a('i-751-fee', 'I-751')}, which costs ${h.usd(F.i751.paper)} on paper. Sending an I-90 for a conditional card spends a fee on a form that cannot do what is needed.</p>
<h2>Renew, or naturalize?</h2>
${h.table(['Choice', 'Paper fee', 'How often'], [
  ['Renew the ten-year card (I-90)', h.usd(F.i90.paper), 'Every ten years'],
  ['Apply for citizenship (N-400)', h.usd(F.n400.paper), 'Once'],
  ['Citizenship, reduced fee', h.usd(F.n400.reduced), 'Once'],
], `Form G-1055, edition ${P.g1055_edition}.`, ['l', 'r', 'l'])}
<p>A resident with a low household income who qualifies for the ${h.a('n-400-fee', 'reduced N-400 fee')} pays ${h.usd(F.i90.paper - F.n400.reduced)} less to apply for citizenship than to renew the card. Eligibility depends on years of residence and time inside the country, which the ${h.a('n-400-early-filing-calculator', 'early filing calculator')} checks.</p>
<h2>While you wait</h2>
<p>See the ${h.a('i-90-processing-time', 'I-90 processing time')}. Keep the receipt notice with the old card when you travel abroad or start a new job.</p>`,
  },
});
