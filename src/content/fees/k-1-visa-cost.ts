import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "k-1-visa-cost", group: "fees", order: 609, parent: "fees",
  tool: {"kind": "fees", "path": "k1"},
  data: {"fees": "k1"},
  related: ["fees", "uscis-fee-calculator", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees"],
  en: {
    path: "fees/k-1",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
