import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-131-processing-time", group: "times", order: 506, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i131ap", "office": "HOU"},
  data: {"form": "i-131"},
  related: ["processing-times", "i-131-fee", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i131Form"],
  en: {
    path: "processing-times/i-131",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "tiempos-de-proceso/i-131",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
