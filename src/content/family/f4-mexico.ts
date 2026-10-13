import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f4-mexico", group: "family", order: 109, parent: "f4",
  tool: {"kind": "greencard", "cat": "F4", "country": "MX"},
  data: {"cat": "F4", "country": "MX"},
  related: ["f4", "country-mexico", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "family/f4/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "familia/f4/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
