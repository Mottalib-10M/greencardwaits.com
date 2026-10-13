import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "eb-1-india", group: "employment", order: 205, parent: "eb-1",
  tool: {"kind": "greencard", "cat": "EB1", "country": "IN"},
  data: {"cat": "EB1", "country": "IN"},
  related: ["eb-1", "country-india", "guide-portability", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-1/india",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
