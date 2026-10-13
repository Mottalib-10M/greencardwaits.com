import { definePage } from '../../lib/guide-types';

export default definePage({
  id: "eb-3-philippines", group: "employment", order: 211, parent: "eb-3",
  tool: {"kind": "greencard", "cat": "EB3", "country": "PH"},
  data: {"cat": "EB3", "country": "PH"},
  related: ["eb-3", "country-philippines", "guide-eb2-to-eb3", "i-485-employment-processing-time"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority", "i140Form"],
  en: {
    path: "employment/eb-3/philippines",
    nav: 'TODO', card: 'TODO',
    title: 'TODO', description: 'TODO',
    h1: 'TODO', intro: 'TODO',
    resume: 'TODO',
    faqs: [],
    body: () => `<p>TODO</p>`,
  },
});
