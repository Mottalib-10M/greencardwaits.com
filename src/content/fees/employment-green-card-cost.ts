import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "employment-green-card-cost", group: "fees", order: 602, parent: "fees",
  tool: {"kind": "fees", "path": "employment"},
  data: {"fees": "employment"},
  related: ["fees", "uscis-fee-calculator", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator"],
  en: {
    path: "fees/employment-green-card",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
