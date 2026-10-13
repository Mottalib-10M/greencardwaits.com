import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-765-processing-time", group: "times", order: 505, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i765c9", "office": "HOU"},
  data: {"form": "i-765"},
  related: ["processing-times", "i-765-fee", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i765Form"],
  en: {
    path: "processing-times/i-765",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "tiempos-de-proceso/i-765",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
