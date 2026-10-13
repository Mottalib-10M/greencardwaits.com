import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "visa-bulletin-2026-06", group: "bulletin", order: 24, parent: "visa-bulletin",
  tool: {"kind": "bulletin", "month": "2026-06", "cat": "EB2", "country": "IN"},
  data: {"month": "2026-06"},
  related: ["visa-bulletin", "visa-bulletin-history", "visa-bulletin-predictions"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "visa-bulletin/2026-06",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
