import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f2b", group: "family", order: 102,
  tool: {"kind": "greencard", "cat": "F2B", "country": "ROW"},
  data: {"cat": "F2B", "country": "ROW"},
  related: ["f2b-mexico", "i-130-processing-time", "consular-processing-cost", "guide-priority-date"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f2b",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "familia/f2b",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
