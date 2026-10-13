import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-131-fee", group: "fees", order: 608, parent: "fees",
  tool: {"kind": "fees", "path": "marriage"},
  data: {"special": "allfees"},
  related: ["fees", "uscis-fee-calculator", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator"],
  en: {
    path: "fees/i-131",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
