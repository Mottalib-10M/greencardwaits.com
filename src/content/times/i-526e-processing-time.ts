import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-526e-processing-time", group: "times", order: 511, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i526e", "office": "HOU"},
  data: {"form": "i-526e"},
  related: ["processing-times", "fees", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i526eForm"],
  en: {
    path: "processing-times/i-526e",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
