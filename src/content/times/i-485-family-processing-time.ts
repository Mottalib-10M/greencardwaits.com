import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-485-family-processing-time", group: "times", order: 502, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i485fam", "office": "HOU"},
  data: {"form": "i-485-family"},
  related: ["processing-times", "i-485-fee", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i485Form"],
  en: {
    path: "processing-times/i-485-family",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "tiempos-de-proceso/i-485-familia",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
