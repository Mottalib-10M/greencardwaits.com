import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-751-processing-time", group: "times", order: 508, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i751", "office": "HOU"},
  data: {"form": "i-751"},
  related: ["processing-times", "i-751-fee", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i751Form"],
  en: {
    path: "processing-times/i-751",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "tiempos-de-proceso/i-751",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
