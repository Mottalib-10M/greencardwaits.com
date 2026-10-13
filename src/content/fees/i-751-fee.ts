import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-751-fee", group: "fees", order: 610, parent: "fees",
  tool: {"kind": "fees", "path": "i751"},
  data: {"fees": "i751"},
  related: ["fees", "uscis-fee-calculator", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator"],
  en: {
    path: "fees/i-751",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
