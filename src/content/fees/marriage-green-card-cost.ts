import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "marriage-green-card-cost", group: "fees", order: 601, parent: "fees",
  tool: {"kind": "fees", "path": "marriage"},
  data: {"fees": "marriage"},
  related: ["fees", "uscis-fee-calculator", "guide-aos-vs-consular"],
  sources: ["g1055", "g1055pdf", "feeCalculator"],
  en: {
    path: "fees/marriage-green-card",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "costos/matrimonio",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
