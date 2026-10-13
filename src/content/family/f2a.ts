import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "f2a", group: "family", order: 101,
  tool: {"kind": "greencard", "cat": "F2A", "country": "ROW"},
  data: {"cat": "F2A", "country": "ROW"},
  related: ["f2a-mexico", "i-130-processing-time", "marriage-green-card-cost", "guide-priority-date"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i130Form"],
  en: {
    path: "family/f2a",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "familia/f2a",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
