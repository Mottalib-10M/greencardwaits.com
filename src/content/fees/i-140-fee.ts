import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-140-fee", group: "fees", order: 613, parent: "fees",
  tool: {"kind": "fees", "path": "employment"},
  data: {"fees": "employment"},
  related: ["fees", "uscis-fee-calculator", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator"],
  en: {
    path: "fees/i-140",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
