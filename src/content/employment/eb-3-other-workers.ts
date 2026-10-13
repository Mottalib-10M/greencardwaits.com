import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "eb-3-other-workers", group: "employment", order: 214, parent: "eb-3",
  tool: {"kind": "greencard", "cat": "EW", "country": "ROW"},
  data: {"cat": "EW", "country": "ROW"},
  related: ["eb-3", "i-140-processing-time", "employment-green-card-cost"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-3/other-workers",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
