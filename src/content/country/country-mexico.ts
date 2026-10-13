import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "country-mexico", group: "country", order: 302,
  tool: {"kind": "greencard", "cat": "F2B", "country": "MX"},
  data: {"countryAll": "MX"},
  related: ["visa-bulletin", "guide-chargeability", "guide-per-country"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "pais/mexico",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
