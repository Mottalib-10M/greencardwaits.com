import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f1-philippines", group: "family", order: 110, parent: "f1",
  tool: {"kind": "greencard", "cat": "F1", "country": "PH"},
  data: {"cat": "F1", "country": "PH"},
  related: ["f1", "country-philippines", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "family/f1/philippines",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
