import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "visa-bulletin-history", group: "bulletin", order: 12, parent: "visa-bulletin",
  tool: {"kind": "bulletin", "month": "2015-10", "pick": true, "cat": "EB2", "country": "IN"},
  data: {"special": "history"},
  related: ["visa-bulletin", "guide-retrogression", "visa-bulletin-predictions"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "visa-bulletin/history",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "boletin-de-visas/historial",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
