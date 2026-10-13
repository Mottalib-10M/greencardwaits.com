import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "priority-date-calculator", group: "tools", order: 400,
  tool: {"kind": "greencard", "cat": "EB2", "country": "IN", "pd": "2014-06-01"},
  related: ["visa-bulletin-predictions", "guide-priority-date", "uscis-fee-calculator"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "tools/priority-date-calculator",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "herramientas/calculadora-fecha-de-prioridad",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
