import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f4-philippines", group: "family", order: 113, parent: "f4",
  tool: {"kind": "greencard", "cat": "F4", "country": "PH"},
  data: {"cat": "F4", "country": "PH"},
  related: ["f4", "country-philippines", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "family/f4/philippines",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
