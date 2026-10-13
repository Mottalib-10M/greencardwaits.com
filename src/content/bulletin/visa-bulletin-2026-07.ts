import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "visa-bulletin-2026-07", group: "bulletin", order: 23, parent: "visa-bulletin",
  tool: {"kind": "bulletin", "month": "2026-07", "cat": "EB2", "country": "IN"},
  data: {"month": "2026-07"},
  related: ["visa-bulletin", "visa-bulletin-history", "visa-bulletin-predictions"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "visa-bulletin/2026-07",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
