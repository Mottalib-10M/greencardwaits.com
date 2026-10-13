import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "office-seattle", group: "office", order: 559, parent: "processing-times",
  tool: {"kind": "ptime", "form": "n400", "office": "SEA"},
  data: {"office": "SEA"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData"],
  en: {
    path: "processing-times/office/seattle",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
