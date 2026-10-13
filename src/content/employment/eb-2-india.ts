import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "eb-2-india", group: "employment", order: 207, parent: "eb-2",
  tool: {"kind": "greencard", "cat": "EB2", "country": "IN"},
  data: {"cat": "EB2", "country": "IN"},
  related: ["eb-2", "country-india", "guide-eb2-to-eb3", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-2/india",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
