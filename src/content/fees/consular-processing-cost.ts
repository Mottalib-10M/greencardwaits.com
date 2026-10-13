import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "consular-processing-cost", group: "fees", order: 603, parent: "fees",
  tool: {"kind": "fees", "path": "family-consular"},
  data: {"fees": "family-consular"},
  related: ["fees", "uscis-fee-calculator", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees"],
  en: {
    path: "fees/consular-processing",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "costos/proceso-consular",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
