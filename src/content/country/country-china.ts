import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "country-china", group: "country", order: 301,
  tool: {"kind": "greencard", "cat": "EB2", "country": "CN"},
  data: {"countryAll": "CN"},
  related: ["visa-bulletin", "guide-chargeability", "guide-per-country"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/china",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
