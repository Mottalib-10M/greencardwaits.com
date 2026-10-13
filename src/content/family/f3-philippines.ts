import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f3-philippines", group: "family", order: 112, parent: "f3",
  tool: {"kind": "greencard", "cat": "F3", "country": "PH"},
  data: {"cat": "F3", "country": "PH"},
  related: ["f3", "country-philippines", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "family/f3/philippines",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
