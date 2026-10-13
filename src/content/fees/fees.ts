import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "fees", group: "fees", order: 600,
  tool: {"kind": "fees", "path": "marriage"},
  data: {"special": "allfees"},
  related: ["uscis-fee-calculator", "marriage-green-card-cost", "n-400-fee"],
  sources: ["g1055", "g1055pdf", "feeCalculator", "dosFees"],
  en: {
    path: "fees",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "costos",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
