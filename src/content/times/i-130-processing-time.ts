import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-130-processing-time", group: "times", order: 504, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i130ir", "office": "HOU"},
  data: {"form": "i-130"},
  related: ["processing-times", "i-130-fee", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i130Form"],
  en: {
    path: "processing-times/i-130",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "tiempos-de-proceso/i-130",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
