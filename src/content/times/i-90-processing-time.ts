import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-90-processing-time", group: "times", order: 509, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i90renew", "office": "HOU"},
  data: {"form": "i-90"},
  related: ["processing-times", "i-90-fee", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i90Form"],
  en: {
    path: "processing-times/i-90",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "tiempos-de-proceso/i-90",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
