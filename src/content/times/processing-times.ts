import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "processing-times", group: "times", order: 500,
  tool: {"kind": "ptime", "form": "n400", "office": "HOU"},
  data: {"special": "alltimes", "form": "n-400"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "i-130-processing-time"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData"],
  en: {
    path: "processing-times",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "tiempos-de-proceso",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
