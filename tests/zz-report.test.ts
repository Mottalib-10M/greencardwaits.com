import { it } from 'vitest';
import { appendFileSync, writeFileSync } from 'node:fs';
const OUT = '/private/tmp/claude-501/-Users-mottalib/7bccc98c-ef3e-4a30-80e5-e0d5eaa9394d/scratchpad/report.txt';
import { PAGES } from '../src/lib/guides';
import { helpers } from '../src/lib/helpers';
const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
it('report', () => {
  writeFileSync(OUT, '');
  const only = (process.env.PAGE_FILES ?? '').split(',').filter(Boolean);
  for (const p of PAGES.filter((x) => !only.length || only.includes(x.id))) for (const l of ['en', 'es'] as const) {
    const x = p[l]; if (!x || x.title === 'TODO') continue;
    const b = words(x.body(helpers(l))), r = words(x.resume), f = x.faqs.map((q) => words(q.a));
    const tot = b + r + x.faqs.reduce((a, q) => a + words(q.a) + words(q.q), 0);
    appendFileSync(OUT, '\n' + `${p.id} ${l} T${x.title.length} D${x.description.length} body${b} res${r} faq[${f.join(',')}] tot${tot}`);
  }
});
