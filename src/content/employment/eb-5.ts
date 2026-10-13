import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "eb-5", group: "employment", order: 204,
  tool: {"kind": "greencard", "cat": "EB5", "country": "ROW"},
  data: {"cat": "EB5", "country": "ROW"},
  related: ["i-140-processing-time", "employment-green-card-cost", "guide-eb2-to-eb3", "guide-portability"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-5",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
