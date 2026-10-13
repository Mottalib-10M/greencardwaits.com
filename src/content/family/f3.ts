import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f3", group: "family", order: 103,
  tool: {"kind": "greencard", "cat": "F3", "country": "ROW"},
  data: {"cat": "F3", "country": "ROW"},
  related: ["f3-mexico", "i-130-processing-time", "consular-processing-cost", "guide-priority-date"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f3",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "familia/f3",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
