/** Accès typé à params-2026.json : chaque montant et chaque source du site. */
import RAW from '../data/params-2026.json';
export type Params = typeof RAW;
export type SourceKey = keyof typeof RAW.sources;
export const P: Params = RAW;
