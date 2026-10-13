import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f4-india", group: "family", order: 114, parent: "f4",
  tool: {"kind": "greencard", "cat": "F4", "country": "IN"},
  data: {"cat": "F4", "country": "IN"},
  related: ["f4", "country-india", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "family/f4/india",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
