import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-129f-processing-time", group: "times", order: 510, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i129f", "office": "HOU"},
  data: {"form": "i-129f"},
  related: ["processing-times", "k-1-visa-cost", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i129fForm"],
  en: {
    path: "processing-times/i-129f",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "tiempos-de-proceso/i-129f",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
