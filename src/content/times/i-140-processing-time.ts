import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-140-processing-time", group: "times", order: 507, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i140eb2", "office": "HOU"},
  data: {"form": "i-140"},
  related: ["processing-times", "i-140-fee", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i140Form"],
  en: {
    path: "processing-times/i-140",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
