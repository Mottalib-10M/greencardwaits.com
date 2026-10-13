import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatMoney } from '../../lib/format';
import { feeTotal, DEFAULT_FEES } from '../../lib/engine/fees';

// USCIS Immigrant Fee (G-1055 du 10/07/26) et frais du Département d'État, lus dans params-2026.json.
const F = P.fees;
const en = (n: number) => formatMoney(n, 0, 'en');
const fam = feeTotal({ ...DEFAULT_FEES, path: 'family-consular' });
const four = 4 * F.immigrantFee.amount;
const share = Math.round((F.immigrantFee.amount / fam.total) * 100);

export default definePage({
  id: "uscis-immigrant-fee", group: "fees", order: 612, parent: "fees",
  tool: {"kind": "fees", "path": "family-consular"},
  data: {"fees": "family-consular"},
  related: ["fees", "consular-processing-cost", "k-1-visa-cost", "guide-aos-vs-consular", "employment-green-card-cost"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees", "immigrantFee", "consular", "avoidScams"],
  en: {
    path: "fees/uscis-immigrant-fee",
    nav: 'USCIS Immigrant Fee', card: 'The card production fee every new immigrant pays online after the visa is issued and before the flight.',
    title: 'USCIS Immigrant Fee 2026: Who Pays It and When Before Travel',
    description: 'The USCIS Immigrant Fee in 2026: the per-person charge paid after an immigrant visa is issued and before travel, so the green card is printed and mailed to you.',
    h1: 'The USCIS Immigrant Fee: the last payment before the flight',
    intro: 'Set how many relatives receive immigrant visas to see the Immigrant Fee alongside the State Department charges.',
    resume: `The USCIS Immigrant Fee is ${en(F.immigrantFee.amount)} per person under the USCIS fee schedule G-1055 dated ${P.g1055_edition}. Every person who receives an immigrant visa at a U.S. embassy or consulate pays it, family and employment cases alike, so a parent arriving with three children pays ${en(four)}. It is paid online to USCIS, not to the State Department, after the visa is issued, and USCIS asks that it be paid before travel. The fee covers the processing of the immigrant visa packet once the traveler is admitted and the production of the physical green card, which is mailed to the U.S. address given in the case. It is a separate charge from the ${en(F.dosImmigrantFamily.amount)} family or ${en(F.dosImmigrantEmployment.amount)} employment visa fee paid earlier. A fiancé(e) on a K-1 visa does not pay it, because the K-1 is a nonimmigrant visa and the green card comes later through an I-485. In a family consular case it is about ${share}% of the government total.`,
    faqs: [
      { q: 'What happens if the USCIS Immigrant Fee is not paid before the flight?', a: `The immigrant can still travel on the visa and be admitted, but USCIS does not produce and mail the green card until the ${en(F.immigrantFee.amount)} is paid. The stamp in the passport serves as temporary proof of residence for a limited time, so a late payment mostly delays the card, which employers and travel later require.` },
      { q: 'Does each child pay the USCIS Immigrant Fee separately?', a: `Yes. The ${en(F.immigrantFee.amount)} is charged per immigrant, not per case, so each child who receives an immigrant visa has a payment of their own, paid with that child’s own case and A-number. A family of four arriving together therefore pays ${en(four)}, on top of each person’s State Department visa fee.` },
      { q: 'Is the USCIS Immigrant Fee charged to people adjusting status with an I-485?', a: `No. It belongs to the consular route: it pays for turning an immigrant visa packet into a green card after admission. Someone who becomes a resident through Form I-485 inside the United States pays the I-485 fee of ${en(F.i485.paper)} on paper instead, and the card is produced from that application.` },
    ],
    body: (h) => `
<h2>Paid to USCIS, at the very end</h2>
<p>The ${h.src('immigrantFee', 'USCIS Immigrant Fee')} is the odd one out in a consular case. Everything else after the petition is paid to the ${h.src('dosFees', 'State Department')}: the immigrant visa application and, for family cases, the review of the affidavit of support. This last charge goes back to USCIS, because USCIS, not the consulate, makes the card. The visa interview is done and the visa is in the passport; what remains is the trip, then the card in the mailbox at the U.S. address in the case.</p>
<h2>Where it sits in the total</h2>
${h.table(['Line', 'Paid to', 'Amount'], fam.lines.map((l) => [l.form, l.payer === 'dos' ? 'State Department' : 'USCIS', h.usd(l.amount * l.count)]).concat([['<strong>Total</strong>', '', `<strong>${h.usd(fam.total)}</strong>`]]), `One person, family case, I-130 on paper. Form G-1055, edition ${P.g1055_edition}.`, ['l', 'l', 'r'])}
<p>The Immigrant Fee is the same ${h.usd(F.immigrantFee.amount)} in an employment case, where it follows the I-140, the Asylum Program Fee and the ${h.usd(F.dosImmigrantEmployment.amount)} visa fee.</p>
<h2>Paying it right</h2>
<p>The payment is made online with the case details printed on the immigrant visa packet. Each person in the family has a separate payment. Pay only through the official USCIS site; nobody else collects this fee, and a message asking for it by wire transfer or gift card is a scam, as the ${h.src('avoidScams', 'USCIS scam warnings')} explain. Check the address in the case before paying, since the card goes there.</p>
<h2>Who does not pay</h2>
<p>A fiancé(e) on a ${h.a('k-1-visa-cost', 'K-1 visa')} is admitted as a nonimmigrant and gets the green card through an I-485, so no Immigrant Fee. Neither does anyone who adjusts status inside the country. The ${h.a('consular-processing-cost', 'consular processing cost')} page has the full family bill, and the ${h.a('guide-aos-vs-consular', 'two routes compared')} explains who goes which way.</p>`,
  },
});
