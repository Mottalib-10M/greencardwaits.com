import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "eb-1-china", group: "employment", order: 206, parent: "eb-1",
  tool: {"kind": "greencard", "cat": "EB1", "country": "CN"},
  data: {"cat": "EB1", "country": "CN"},
  related: ["eb-1", "country-china", "guide-portability", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-1/china",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
