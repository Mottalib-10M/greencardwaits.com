import { definePage } from '../../lib/guide-types';
import { cellAt, moveDays, MONTHS, type Cat, type Country } from '../../lib/engine/cases';
import { cellText } from '../../lib/text';

// Bulletin de juin 2026, comparé à celui de mai : tout est lu dans l'archive.
type Q = Exclude<Cat, 'IR'>;
const I = MONTHS.indexOf('2026-06');
const v = (c: Q, k: Country, ch: 'FAD' | 'DFF' = 'FAD', i = I) => cellAt(c, k, ch, i);
const mv = (c: Q, k: Country, ch: 'FAD' | 'DFF' = 'FAD') => moveDays(c, k, ch, I) ?? 0;
const d = (n: number) => Math.round(Math.abs(n));
const t = (x: string) => cellText(x, 'en');
const eb2InMar = v('EB2', 'IN', 'FAD', MONTHS.indexOf('2026-03'));
const eb2InApr = v('EB2', 'IN', 'FAD', MONTHS.indexOf('2026-04'));
const eb2InJul = v('EB2', 'IN', 'FAD', MONTHS.indexOf('2026-07'));
const aprMove = moveDays('EB2', 'IN', 'FAD', MONTHS.indexOf('2026-04')) ?? 0;
const eb2RowApr = v('EB2', 'ROW', 'FAD', MONTHS.indexOf('2026-04'));

export default definePage({
  id: "visa-bulletin-2026-06", group: "bulletin", order: 24, parent: "visa-bulletin",
  tool: {"kind": "bulletin", "month": "2026-06", "cat": "EB2", "country": "IN"},
  data: {"month": "2026-06"},
  related: ["visa-bulletin", "visa-bulletin-history", "visa-bulletin-predictions", "eb-2-india", "visa-bulletin-2026-07"],
  sources: ["vbIndex", "vbMirror", "aosCharts", "visaPriority"],
  en: {
    path: "visa-bulletin/2026-06",
    nav: 'June 2026', card: 'The month EB-2 India gave back its spring gain while F2A and F2B kept walking forward.',
    title: 'June 2026 Visa Bulletin: EB-2 India Steps Back, F2A Gains',
    description: 'June 2026 Visa Bulletin: EB-2 and EB-1 India retrogressed while F2A, F2B and F1 Mexico advanced. Both charts, every box, and what the step back led to.',
    h1: 'June 2026 Visa Bulletin: a correction for India, progress for families',
    intro: 'Pick a category and country to see what the June 2026 bulletin printed, compared with May, on both the Final Action and the filing chart.',
    resume: `The June 2026 Visa Bulletin was a correction for Indian employment applicants and a quiet advance for families. EB-2 India, which had jumped to ${t(eb2InApr)} in April, was pulled back to ${t(v('EB2', 'IN'))}, a loss of ${d(mv('EB2', 'IN'))} days that left it behind even its March date of ${t(eb2InMar)}. EB-1 India also slipped, by ${d(mv('EB1', 'IN'))} days to ${t(v('EB1', 'IN'))}. On the family side, F2A moved ${d(mv('F2A', 'ROW'))} days to ${t(v('F2A', 'ROW'))} for most countries and to ${t(v('F2A', 'MX'))} for Mexico, F2B worldwide gained ${d(mv('F2B', 'ROW'))} days and F1 Mexico ${d(mv('F1', 'MX'))}. EB-2 for the rest of the world stayed current, as it had been since April. In hindsight the Indian step back was a warning: the July bulletin listed EB-2 India as ${t(eb2InJul)}, and it stayed that way until the new fiscal year.`,
    faqs: [
      { q: 'Why did EB-2 India retrogress in the June 2026 Visa Bulletin?', a: `The State Department does not publish its demand figures, so the cause can only be read from the dates. The April 2026 bulletin had advanced EB-2 India by about ${Math.round(aprMove / 30.4375)} months in one step. When a big advance brings in more applicants with early dates than numbers left for the year, the usual response is to move the cutoff back, which is what June shows.` },
      { q: 'Did the June 2026 Visa Bulletin change the EB-2 India filing date?', a: 'No. The Dates for Filing column for EB-2 India stayed where it was in May, so the retrogression touched only the Final Action Date, which governs approval. Which of the two charts USCIS accepted for Form I-485 in a given month is set on the USCIS filing charts page, not in the bulletin.' },
      { q: 'How far did F2A move in the June 2026 Visa Bulletin?', a: 'F2A, spouses and minor children of green card holders, advanced about five months on the Final Action chart for most countries and by the same distance for Mexico, which keeps its own, later date. The F2A Dates for Filing column was current that month, so anyone eligible could prepare the paperwork early.' },
    ],
    body: (h) => `
<h2>India gives back its spring</h2>
<p>The story of this bulletin starts two months earlier. In March, EB-2 India read ${h.cell(eb2InMar)}; in April it leapt to ${h.cell(eb2InApr)}, ${h.num(d(aprMove))} days in a single bulletin, and May left it there. June took it back to ${h.cell(v('EB2', 'IN'))}, a step of ${h.num(d(mv('EB2', 'IN')))} days that undid the whole April gain and a little more. People whose priority dates fell in that window went from approvable to waiting again in one month. EB-1 India followed the same direction on a smaller scale, losing ${h.num(d(mv('EB1', 'IN')))} days to ${h.cell(v('EB1', 'IN'))}. The filing column for EB-2 India, ${h.cell(v('EB2', 'IN', 'DFF'))}, did not move.</p>
<h2>Family lines kept walking</h2>
<p>Families had a better month. F2A gained ${h.num(d(mv('F2A', 'ROW')))} days for most of the world, to ${h.cell(v('F2A', 'ROW'))}, and the same for Mexico, to ${h.cell(v('F2A', 'MX'))}. F2B worldwide moved ${h.num(d(mv('F2B', 'ROW')))} days to ${h.cell(v('F2B', 'ROW'))}. F1 Mexico, unmarried adult children of citizens, advanced ${h.num(d(mv('F1', 'MX')))} days to ${h.cell(v('F1', 'MX'))}, while F2B, F3 and F4 Mexico stood still. F4 for the rest of the world crept ${h.num(d(mv('F4', 'ROW')))} days on the approval chart and ${h.num(d(mv('F4', 'ROW', 'DFF')))} on the filing chart.</p>
<h2>Worldwide employment stayed open</h2>
<p>For applicants born outside India and China, June was calm. EB-1 and EB-2 worldwide read ${h.cell(v('EB2', 'ROW'))}${eb2RowApr === v('EB2', 'ROW') ? ', EB-2 having been listed that way since the April bulletin' : ''}. EB-3 worldwide held at ${h.cell(v('EB3', 'ROW'))}. China edged forward instead: EB-3 China by ${h.num(d(mv('EB3', 'CN')))} days and EB-3 Other Workers China by ${h.num(d(mv('EW', 'CN')))}. The investor line was frozen: EB-5 India stayed at ${h.cell(v('EB5', 'IN'))} and EB-5 China at ${h.cell(v('EB5', 'CN'))}, both unchanged from May.</p>
<h2>What June turned out to announce</h2>
<p>Read from October, June was the first sign of how fiscal year 2026 would end for India. The July bulletin listed EB-2 India as ${h.cell(eb2InJul)}, and the line reopened only with the new fiscal year. That sequence, a large spring advance, a retrogression, then a closed box, appears more than once in the ${h.a('visa-bulletin-history', 'archive since 2001')}. It is also why the ${h.a('eb-2-india', 'EB-2 India page')} usually shows no forecast date: the back-test cannot keep up with swings of this size. Next in the series: the ${h.a('visa-bulletin-2026-07', 'July 2026 bulletin')}.</p>`,
  },
});
