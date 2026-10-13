import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-130-fee", group: "fees", order: 606, parent: "fees",
  tool: {"kind": "fees", "path": "family-consular"},
  data: {"special": "allfees"},
  related: ["fees", "uscis-fee-calculator", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees"],
  en: {
    path: "fees/i-130",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
