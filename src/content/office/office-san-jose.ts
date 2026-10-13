import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "office-san-jose", group: "office", order: 565, parent: "processing-times",
  tool: {"kind": "ptime", "form": "n400", "office": "SNJ"},
  data: {"office": "SNJ"},
  related: ["n-400-processing-time", "i-485-family-processing-time", "n-400-early-filing-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData"],
  en: {
    path: "processing-times/office/san-jose",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
