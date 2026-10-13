import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "uscis-fee-calculator", group: "tools", order: 403,
  tool: {"kind": "fees", "path": "marriage"},
  related: ["fees", "marriage-green-card-cost", "n-400-fee"],
  sources: ["g1055", "g1055pdf", "dosFees", "feeCalculator"],
  en: {
    path: "tools/uscis-fee-calculator",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "herramientas/calculadora-de-tarifas-uscis",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
