# Écrire ou étoffer une page de Green Card Waits (us-greencard)

Notice pour les agents qui écrivent ou prolongent le site. À lire en entier, avec `~/Documents/GitHub/RECETTE-SITE.md`
(§0, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26).

Le site : file d'attente de la carte verte américaine. Visa Bulletin (294 bulletins depuis décembre 2001), prévision en
fourchette avec son erreur passée publiée, délais USCIS par bureau, frais G-1055 du 07/10/2026. **Anglais** (108 pages,
`/en/`) et **espagnol** (40 pages, `/es/`, familles mexicaines et centraméricaines vivant aux États-Unis). Plafond : 150 pages
indexables au total. Éditeur : **Radif Partners**, jamais une personne. Aucun lien vers un autre site du portefeuille
(`_trame/domaines-ovh.txt`, immigrationpoints.com compris). Aucune collecte de coordonnées. Avertissement partout :
**not legal advice, not affiliated with USCIS or the Department of State**.

## D'où viennent les chiffres

| Donnée | Source | Script | Fichier |
|---|---|---|---|
| Dates limites, 294 bulletins | Visa Bulletin, lu sur adoptions.state.gov (même département ; travel.state.gov refuse les robots, on ne contourne pas) | `node scripts/build-bulletins.ts` | `src/data/visa-bulletin.json` |
| Séries par case et rétro-test | calculés | `node scripts/build-forecast.ts` | `src/data/series.json`, `src/data/backtest.json` |
| Délais par bureau et formulaire | publiés par USCIS, republiés en données ouvertes par ImmigrationTimes.org, **CC BY 4.0** (attribution affichée sur chaque page de délais) | `node scripts/build-ptimes.ts` | `src/data/ptimes.json`, `src/data/ptimes-latest.json` |
| Délai moyen national | USCIS, rapport mensuel au Congrès (CSV, domaine public) | idem | idem |
| Frais, règles CSPA et N-400, tableau imposé par USCIS | G-1055 (PDF lu), Policy Manual, page « Adjustment of Status Filing Charts » | à la main, testé | `src/data/params-2026.json` |

Conditions de réutilisation : le Visa Bulletin, les pages et formulaires USCIS et le CSV au Congrès sont des œuvres du
gouvernement fédéral (domaine public, 17 U.S.C. § 105) ; on cite la source et la date, on ne reprend ni sceau ni logo.
ImmigrationTimes.org : CC BY 4.0 (https://immigrationtimes.org/data/, DOI 10.5281/zenodo.21311840), usage commercial
permis, attribution « Processing-time data: ImmigrationTimes.org (CC BY 4.0), from USCIS; selected and reformatted ».
L'API officielle egov.uscis.gov est derrière Cloudflare : jamais de contournement. Le dépôt `jzebedee/uscis` (sans
licence, collecte par contournement) est écarté.

Mise à jour mensuelle : `node scripts/build-bulletins.ts --refresh && node scripts/build-forecast.ts && node scripts/build-ptimes.ts --refresh`,
puis relire `aosChart` (tableau imposé par USCIS) dans `params-2026.json`, ajouter la page du nouveau mois
(`src/content/bulletin/visa-bulletin-AAAA-MM.ts`), retirer la plus ancienne des cinq (redirection 301 vers l'historique),
et relancer `npx vitest run`.

## Les fichiers d'une page

Une page = un fichier `src/content/<groupe>/<id>.ts` (`definePage`). Le nom du fichier est l'`id`. Groupes :
`bulletin`, `family`, `employment`, `country`, `tools`, `times`, `office`, `fees`, `guides`. L'accueil est
`src/content/home.ts`. Métadonnées déjà posées (ne pas changer `id`, `path`, `tool`, `data`, `mini`, `parent` sans
raison) ; à écrire : les blocs `en` et `es` (quand il existe).

| Champ | Règle |
|---|---|
| `nav` | libellé court du menu (≤ 30 car.) |
| `card` | une phrase de carte (≤ 110 car.) |
| `title` | **50 à 60 caractères**, terme-clé en tête (« F2B Mexico Visa Bulletin… »), jamais un pays, « How », « What », « When », « ¿ », « Calculator » en tête ; 2026 si possible ; unique sur le site |
| `description` | **150 à 160 caractères** |
| `h1`, `intro` | intro = une phrase (≤ 35 mots) |
| `resume` | **un seul paragraphe d'au moins 120 mots**, sans balise, citable seul (§21) : la réponse, avec ses chiffres |
| `faqs` | pages ordinaires **3 à 5**, guides **6 à 8** ; réponses **40 à 90 mots** ; question unique sur tout le site, nom du sujet dedans |
| `body(h)` | HTML : `<h2>` propres à la page, `<p>`, `<ul>`, tableaux via `h.table` ; **pages à outil ≥ 260 mots (viser 350 à 450), guides ≥ 900 mots (viser 1 100)** |

Le composant (`ContentPage.astro`) affiche seul : H1, intro, l'outil (ou le mini du guide), le paragraphe citable replié,
le corps, puis les **blocs de données générés** (`DataBlocks.astro` : tableaux du mois, graphique depuis 2001, chaque
octobre depuis 2002, rétro-test de la case, classement des bureaux, frais ligne par ligne), la FAQ, les pages liées,
les sources. Le corps ne répète pas ces tableaux : il les commente.

### Outils du corps (`h`)

`h.a(id, texte)` lien interne par id de page ; `h.usd(n)` ; `h.num(n, déc)` ; `h.pct(x)` ; `h.date(iso)` ;
`h.month('2026-10')` ; `h.cell('C' | 'U' | iso)` ; `h.table(entêtes, lignes, légende?, align?)` ; `h.src(clé, texte?)`
(clé de `params-2026.json > sources`) ; `h.mini('kind')` insère un second mini-simulateur ; `h.P` = paramètres
(`h.P.fees.i485.paper`…).

### Chiffres des données : jamais tapés

Une date limite, un rang de bureau, un délai, un frais se lit dans les données, en tête du fichier :

```ts
import { cellAt, moveDays, backtestCell, evaluate, LATEST } from '../../lib/engine/cases';
import { OFFICES, NATIONAL } from '../../lib/engine/ptimes';
import { feeTotal, DEFAULT_FEES } from '../../lib/engine/fees';
const fad = cellAt('EB2', 'IN', 'FAD');            // '2013-11-01' en octobre 2026
const bt = backtestCell('EB2', 'IN', 12);          // { medianError, coverage, reliable, naiveError, naiveReliable … }
```

puis `${h.cell(fad)}`, `${h.num(bt.medianError)}` dans le texte. Dans `title`, `description` et `faqs`, pas de chiffre qui
change chaque mois (la longueur doit rester dans les bornes) ; l'année 2026 et les frais G-1055 (`P.fees`) sont permis.
Les chiffres historiques figés (« October 2015 », « 294 bulletins ») sont permis s'ils sont vrais.

## La règle de vérité (non négociable)

- **Pas un mot de conseil juridique** : on décrit la règle et le calcul, jamais « vous devriez déposer ». Renvoyer vers un
  avocat d'immigration agréé ou un représentant accrédité par le DOJ quand le sujet s'y prête. Jamais « notario ».
- **Règles vérifiées seulement** (sources lues, dans `params-2026.json`) : FAD gouverne l'approbation, USCIS désigne chaque
  mois le tableau pour déposer l'I-485 (octobre 2026 : Dates for Filing, famille et emploi) ; CSPA = âge à la disponibilité
  (FAD, ou approbation si plus tard) − durée d'instruction, protégé sous 21 ans, « sought to acquire » sous un an ;
  N-400 : 90 jours avant 5 ans (3 ans conjoint de citoyen), présence 913 jours (548), absence > 6 mois = présomption de
  rupture, ≥ 1 an = rupture ; plafond par pays 7 % (25 620), dépendances 2 %. Un point non lu dans une source citée ne
  s'écrit pas.
- Le modèle : temps de passage observés sur 10 ans (Kaplan-Meier), fourchette 20 % – 80 %, rétro-test d'octobre 2012 à
  octobre 2025 ; publié seulement si couverture ≥ 40 %, erreur médiane ≤ max(4 mois, moitié du délai réel), ≥ 12 issues ;
  sinon, rythme des 12 derniers mois avec sa bande si lui passe ; sinon « no reliable forecast ». Ne jamais promettre une date.

## Ton

Anglais américain, voix humaine, le chiffre d'abord, phrases de longueur variable. Espagnol neutre d'Amérique (usted),
pour une famille qui vit aux États-Unis ou y a un pétitionnaire : termes officiels en anglais entre parenthèses à la
première occurrence (« fecha de acción final (Final Action Date) »), montants toujours par `h.usd()` (format es-US :
« $1,440 »). Interdits : tiret cadratin, « it's important to note », « dive into », « delve », « whether you're »,
« moreover », « furthermore », « in conclusion », « unlock », « seamless », « robust », « embark », émojis,
conclusions-résumés. Unicité (§6) : chaque page parle de **sa** case avec son vocabulaire (son histoire, ses reculs, son
pays, ses chiffres) ; aucune tournure reprise d'une autre page (≤ 30 % de similarité, `check-unique.py`).

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-greencard
export NODE_PATH=$(npm root -g):$PWD/node_modules
PAGE_FILES=eb-2-india npx vitest run tests/pages.test.ts   # une page (id), plusieurs séparées par des virgules
npx vitest run                                              # tout
npm run build
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py dist
python3 scripts/check-simulateurs.py . ; python3 scripts/check-hreflang.py . ; python3 scripts/check-anglais.py .
python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py . ; python3 scripts/check-cookies.py . ; python3 scripts/check-snippets.py .
node scripts/check-legal.mjs . ; node scripts/check-sources.mjs . ; node scripts/check-contraste.mjs dist ; node scripts/check-saisie.mjs dist --max=60
node scripts/check-nombres.mjs dist ; node scripts/typo-nbsp.mjs dist --check ; node scripts/check-url-propre.mjs dist ; node scripts/check-premier-ecran.mjs .
python3 scripts/check-liens.py dist ; node scripts/check-layout.mjs dist
```

Serveur local : port **4561** (`npm run preview`). Arrêt : `lsof -ti tcp:4561 | xargs kill`.

## Ce qu'on ne fait pas

Pas de dépôt GitHub, pas de push, pas de DNS. Ne toucher ni à `_trame` ni à la RECETTE. `CLARITY_ID` reste vide jusqu'à
l'achat du domaine. Les données brutes (`scripts/.cache-raw/`) restent hors du dépôt.
