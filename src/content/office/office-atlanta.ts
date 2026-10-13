import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "office-atlanta", group: "office", order: 557, parent: "processing-times",
  tool: {"kind": "ptime", "form": "n400", "office": "ATL"},
  data: {"office": "ATL"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData"],
  en: {
    path: "processing-times/office/atlanta",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
