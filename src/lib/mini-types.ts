/** Types des mini-simulateurs (RECETTE §9.3) : un fichier par sujet dans `lib/minis/<kind>.ts`. Valeurs en texte. */
export interface MiniInput { id: string; label: string; def: string; type: 'select' | 'date' | 'number'; options?: Array<{ value: string; label: string }>; max?: number; unit?: string }
export interface MiniOut { head: [string, string]; rows: Array<[string, string]>; note?: string }
export interface MiniSpec { title: string; cta: string; inputs: MiniInput[]; run: (v: Record<string, string>) => MiniOut }
