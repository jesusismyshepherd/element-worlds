// Who discovered an element and where, in the visitor's language. elements.json keeps both in English
// (from PubChem and the fixes in scripts/build-elements.mjs); names stay as they are, the places and the
// words between names are translated here (2026-10-28, when Polish and German came: the halls showed
// "Pierre and Marie Curie" and "England" in every language). A string not listed shows as it is.

const PLACES = {
  England: { 'pt-pt': 'Inglaterra', pl: 'Anglia', de: 'England' },
  'India, England': { 'pt-pt': 'Índia, Inglaterra', pl: 'Indie, Anglia', de: 'Indien, England' },
  Sweden: { 'pt-pt': 'Suécia', pl: 'Szwecja', de: 'Schweden' },
  France: { 'pt-pt': 'França', pl: 'Francja', de: 'Frankreich' },
  'England/France': { 'pt-pt': 'Inglaterra/França', pl: 'Anglia/Francja', de: 'England/Frankreich' },
  Scotland: { 'pt-pt': 'Escócia', pl: 'Szkocja', de: 'Schottland' },
  'England/Sweden': { 'pt-pt': 'Inglaterra/Suécia', pl: 'Anglia/Szwecja', de: 'England/Schweden' },
  Denmark: { 'pt-pt': 'Dinamarca', pl: 'Dania', de: 'Dänemark' },
  Germany: { 'pt-pt': 'Alemanha', pl: 'Niemcy', de: 'Deutschland' },
  'Mexico (1801), Sweden (1830)': { 'pt-pt': 'México (1801), Suécia (1830)', pl: 'Meksyk (1801), Szwecja (1830)', de: 'Mexiko (1801), Schweden (1830)' },
  Finland: { 'pt-pt': 'Finlândia', pl: 'Finlandia', de: 'Finnland' },
  Italy: { 'pt-pt': 'Itália', pl: 'Włochy', de: 'Italien' },
  Russia: { 'pt-pt': 'Rússia', pl: 'Rosja', de: 'Russland' },
  Romania: { 'pt-pt': 'Roménia', pl: 'Rumunia', de: 'Rumänien' },
  'Sweden/Germany': { 'pt-pt': 'Suécia/Alemanha', pl: 'Szwecja/Niemcy', de: 'Schweden/Deutschland' },
  Austria: { 'pt-pt': 'Áustria', pl: 'Austria', de: 'Österreich' },
  'United States': { 'pt-pt': 'Estados Unidos', pl: 'Stany Zjednoczone', de: 'USA' },
  Switzerland: { 'pt-pt': 'Suíça', pl: 'Szwajcaria', de: 'Schweiz' },
  Spain: { 'pt-pt': 'Espanha', pl: 'Hiszpania', de: 'Spanien' },
  Colombia: { 'pt-pt': 'Colômbia', pl: 'Kolumbia', de: 'Kolumbien' },
  'Soviet Union (Dubna)': { 'pt-pt': 'União Soviética (Dubna)', pl: 'Związek Radziecki (Dubna)', de: 'Sowjetunion (Dubna)' },
  'Soviet Union (Dubna), United States (Berkeley)': {
    'pt-pt': 'União Soviética (Dubna), Estados Unidos (Berkeley)', pl: 'Związek Radziecki (Dubna), Stany Zjednoczone (Berkeley)', de: 'Sowjetunion (Dubna), USA (Berkeley)',
  },
  'United States (Berkeley, Livermore)': { 'pt-pt': 'Estados Unidos (Berkeley, Livermore)', pl: 'Stany Zjednoczone (Berkeley, Livermore)', de: 'USA (Berkeley, Livermore)' },
  'Germany (Darmstadt)': { 'pt-pt': 'Alemanha (Darmstadt)', pl: 'Niemcy (Darmstadt)', de: 'Deutschland (Darmstadt)' },
  Japan: { 'pt-pt': 'Japão', pl: 'Japonia', de: 'Japan' },
  'Russia (Dubna), with the United States (Livermore)': {
    'pt-pt': 'Rússia (Dubna), com os Estados Unidos (Livermore)', pl: 'Rosja (Dubna), wspólnie ze Stanami Zjednoczonymi (Livermore)', de: 'Russland (Dubna), mit den USA (Livermore)',
  },
  'Russia/United States': { 'pt-pt': 'Rússia/Estados Unidos', pl: 'Rosja/Stany Zjednoczone', de: 'Russland/USA' },
}

// discoverers whose English has words besides names (Polish keeps foreign names in the nominative:
// "X i jego zespół", X and his team)
const WHO = {
  'Pierre and Marie Curie': { 'pt-pt': 'Pierre e Marie Curie', pl: 'Maria Skłodowska-Curie i Piotr Curie', de: 'Pierre und Marie Curie' },
  'Fausto and Juan José de Elhuyar': { 'pt-pt': 'Fausto e Juan José de Elhuyar', pl: 'Fausto i Juan José de Elhuyar', de: 'Fausto und Juan José de Elhuyar' },
  'Argonne, Los Alamos, U of Calif': {
    'pt-pt': 'Argonne, Los Alamos, Universidade da Califórnia', pl: 'Argonne, Los Alamos, Uniwersytet Kalifornijski', de: 'Argonne, Los Alamos, University of California',
  },
  "Georgy Flerov's team (JINR, Dubna)": {
    'pt-pt': 'Georgy Flerov e a sua equipa (JINR, Dubna)', pl: 'Georgy Flerov i jego zespół (ZIBJ, Dubna)', de: 'Georgy Flerov und sein Team (VIK, Dubna)',
  },
  "Georgy Flerov's team (Dubna, 1964) and Albert Ghiorso's team (Berkeley, 1969), credit shared": {
    'pt-pt': 'Georgy Flerov e a sua equipa (Dubna, 1964) e Albert Ghiorso e a sua equipa (Berkeley, 1969), com o mérito partilhado',
    pl: 'Georgy Flerov i jego zespół (Dubna, 1964) oraz Albert Ghiorso i jego zespół (Berkeley, 1969), z uznaniem dla obu',
    de: 'Georgy Flerov und sein Team (Dubna, 1964) sowie Albert Ghiorso und sein Team (Berkeley, 1969), Verdienst geteilt',
  },
  "Georgy Flerov's team (Dubna, 1968) and Albert Ghiorso's team (Berkeley, 1970), credit shared": {
    'pt-pt': 'Georgy Flerov e a sua equipa (Dubna, 1968) e Albert Ghiorso e a sua equipa (Berkeley, 1970), com o mérito partilhado',
    pl: 'Georgy Flerov i jego zespół (Dubna, 1968) oraz Albert Ghiorso i jego zespół (Berkeley, 1970), z uznaniem dla obu',
    de: 'Georgy Flerov und sein Team (Dubna, 1968) sowie Albert Ghiorso und sein Team (Berkeley, 1970), Verdienst geteilt',
  },
  'Albert Ghiorso, J. Michael Nitschke, Kenneth Hulet and team (Berkeley and Livermore)': {
    'pt-pt': 'Albert Ghiorso, J. Michael Nitschke, Kenneth Hulet e equipa (Berkeley e Livermore)',
    pl: 'Albert Ghiorso, J. Michael Nitschke, Kenneth Hulet i zespół (Berkeley i Livermore)',
    de: 'Albert Ghiorso, J. Michael Nitschke, Kenneth Hulet und Team (Berkeley und Livermore)',
  },
  "Peter Armbruster and Gottfried Münzenberg's team (GSI)": {
    'pt-pt': 'Peter Armbruster, Gottfried Münzenberg e a sua equipa (GSI)', pl: 'Peter Armbruster, Gottfried Münzenberg i ich zespół (GSI)', de: 'Peter Armbruster, Gottfried Münzenberg und ihr Team (GSI)',
  },
  "Yuri Oganessian's team (JINR, Dubna) with Lawrence Livermore National Laboratory": {
    'pt-pt': 'Yuri Oganessian e a sua equipa (JINR, Dubna), com o Lawrence Livermore National Laboratory',
    pl: 'Yuri Oganessian i jego zespół (ZIBJ, Dubna) wraz z Lawrence Livermore National Laboratory',
    de: 'Yuri Oganessian und sein Team (VIK, Dubna) mit dem Lawrence Livermore National Laboratory',
  },
}

/** Who discovered it, in the language (null when unknown). */
export const discoverersOf = (el, lang) => (el.discoverers ? WHO[el.discoverers]?.[lang] ?? el.discoverers : null)

/** Where it was discovered, in the language (null when unknown). */
export const discoveryPlaceOf = (el, lang) => (el.discoveryPlace ? PLACES[el.discoveryPlace]?.[lang] ?? el.discoveryPlace : null)

export const DISCOVERY_TABLES = { PLACES, WHO }
