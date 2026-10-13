import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "n-400-processing-time", group: "times", order: 501, parent: "processing-times",
  tool: {"kind": "ptime", "form": "n400", "office": "HOU"},
  data: {"form": "n-400"},
  related: ["processing-times", "n-400-fee", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "n400Form"],
  en: {
    path: "processing-times/n-400",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "tiempos-de-proceso/n-400",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
