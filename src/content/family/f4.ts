import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f4", group: "family", order: 104,
  tool: {"kind": "greencard", "cat": "F4", "country": "ROW"},
  data: {"cat": "F4", "country": "ROW"},
  related: ["f4-mexico", "i-130-processing-time", "consular-processing-cost", "guide-priority-date"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f4",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "familia/f4",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
