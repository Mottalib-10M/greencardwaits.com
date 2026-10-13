import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "eb-5-india", group: "employment", order: 212, parent: "eb-5",
  tool: {"kind": "greencard", "cat": "EB5", "country": "IN"},
  data: {"cat": "EB5", "country": "IN"},
  related: ["eb-5", "country-india", "guide-portability", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-5/india",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
