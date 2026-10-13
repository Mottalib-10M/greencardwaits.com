import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f3-mexico", group: "family", order: 108, parent: "f3",
  tool: {"kind": "greencard", "cat": "F3", "country": "MX"},
  data: {"cat": "F3", "country": "MX"},
  related: ["f3", "country-mexico", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "family/f3/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "familia/f3/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
