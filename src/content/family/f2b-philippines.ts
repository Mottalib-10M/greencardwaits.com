import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f2b-philippines", group: "family", order: 111, parent: "f2b",
  tool: {"kind": "greencard", "cat": "F2B", "country": "PH"},
  data: {"cat": "F2B", "country": "PH"},
  related: ["f2b", "country-philippines", "guide-chargeability", "consular-processing-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "family/f2b/philippines",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
