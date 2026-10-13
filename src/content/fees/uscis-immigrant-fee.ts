import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "uscis-immigrant-fee", group: "fees", order: 612, parent: "fees",
  tool: {"kind": "fees", "path": "family-consular"},
  data: {"fees": "family-consular"},
  related: ["fees", "uscis-fee-calculator", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees", "immigrantFee"],
  en: {
    path: "fees/uscis-immigrant-fee",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
