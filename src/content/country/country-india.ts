import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "country-india", group: "country", order: 300,
  tool: {"kind": "greencard", "cat": "EB2", "country": "IN"},
  data: {"countryAll": "IN"},
  related: ["visa-bulletin", "guide-chargeability", "guide-per-country"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/india",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
