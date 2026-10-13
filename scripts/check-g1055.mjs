#!/usr/bin/env node
/**
 * Contrôle de l'édition du barème G-1055 (CONTRIBUTING-PAGES.md) : la page uscis.gov/g-1055 affiche « Edition Date
 * MM/DD/YY ». Si elle diffère de params-2026.json > g1055_edition, le contrôle échoue : un frais ne s'automatise pas,
 * une personne relit le PDF et met à jour les paramètres. Code 2 si la page est injoignable (à revérifier).
 */
import { readFileSync } from 'node:fs';
const P = JSON.parse(readFileSync(new URL('../src/data/params-2026.json', import.meta.url), 'utf8'));
let html = '';
try { html = await (await fetch('https://www.uscis.gov/g-1055', { headers: { 'user-agent': 'Mozilla/5.0 (greencardwaits fee check)' } })).text(); }
catch (e) { console.error('g-1055 injoignable :', e.message); process.exit(2); }
const m = /Edition Date\s*(?:<[^>]+>\s*)*(\d{2}\/\d{2}\/\d{2})/i.exec(html);
if (!m) { console.error('Édition introuvable sur uscis.gov/g-1055 : relire la page à la main.'); process.exit(2); }
if (m[1] !== P.g1055_edition) { console.error(`G-1055 : nouvelle édition ${m[1]} (paramètres : ${P.g1055_edition}). Relire le PDF et mettre à jour params-2026.json.`); process.exit(1); }
console.log(`G-1055 : édition ${m[1]}, identique aux paramètres.`);
