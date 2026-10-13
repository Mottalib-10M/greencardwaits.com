import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "country-el-salvador-guatemala-honduras", group: "country", order: 304,
  tool: {"kind": "greencard", "cat": "F4", "country": "ROW"},
  data: {"countryAll": "ROW"},
  related: ["visa-bulletin", "guide-per-country", "eb-3-other-workers"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "ina203"],
  en: {
    path: "country/el-salvador-guatemala-honduras",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
  es: {
    path: "pais/el-salvador-guatemala-honduras",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
