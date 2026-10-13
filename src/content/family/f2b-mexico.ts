import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f2b-mexico", group: "family", order: 107, parent: "f2b",
  tool: {"kind": "greencard", "cat": "F2B", "country": "MX"},
  data: {"cat": "F2B", "country": "MX"},
  related: ["f2b", "country-mexico", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "family/f2b/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "familia/f2b/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
