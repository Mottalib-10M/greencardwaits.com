import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "visa-bulletin-predictions", group: "bulletin", order: 11, parent: "visa-bulletin",
  tool: {"kind": "greencard", "cat": "EB3", "country": "ROW", "pd": "2025-02-01"},
  data: {"special": "predictions"},
  related: ["visa-bulletin", "priority-date-calculator", "guide-retrogression", "visa-bulletin-history"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "visa-bulletin/predictions",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "boletin-de-visas/predicciones",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
