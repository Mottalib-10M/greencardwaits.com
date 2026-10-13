import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "country-philippines", group: "country", order: 303,
  tool: {"kind": "greencard", "cat": "F2B", "country": "PH"},
  data: {"countryAll": "PH"},
  related: ["visa-bulletin", "guide-chargeability", "guide-per-country"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/philippines",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
