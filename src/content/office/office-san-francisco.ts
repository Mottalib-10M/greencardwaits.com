import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "office-san-francisco", group: "office", order: 556, parent: "processing-times",
  tool: {"kind": "ptime", "form": "n400", "office": "SFR"},
  data: {"office": "SFR"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData"],
  en: {
    path: "processing-times/office/san-francisco",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
