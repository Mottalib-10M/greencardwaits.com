import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f2a-mexico", group: "family", order: 106, parent: "f2a",
  tool: {"kind": "greencard", "cat": "F2A", "country": "MX"},
  data: {"cat": "F2A", "country": "MX"},
  related: ["f2a", "country-mexico", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "family/f2a/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "familia/f2a/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
