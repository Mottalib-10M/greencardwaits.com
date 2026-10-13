import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f1", group: "family", order: 100,
  tool: {"kind": "greencard", "cat": "F1", "country": "ROW"},
  data: {"cat": "F1", "country": "ROW"},
  related: ["f1-mexico", "i-130-processing-time", "consular-processing-cost", "guide-priority-date"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f1",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "familia/f1",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
