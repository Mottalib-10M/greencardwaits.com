import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "i-485-employment-processing-time", group: "times", order: 503, parent: "processing-times",
  tool: {"kind": "ptime", "form": "i485emp", "office": "HOU"},
  data: {"form": "i-485-employment"},
  related: ["processing-times", "i-485-fee", "uscis-fee-calculator"],
  sources: ["uscisTimes", "itData", "uscisReport", "uscisData", "i485Form"],
  en: {
    path: "processing-times/i-485-employment",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
