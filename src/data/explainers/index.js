const explainerRegistry = {
  'bridging-animal-models-and-humans-neuroimaging-as-intermediate-phenotypes-linking-genetic-or-stress-factors-to-anhedonia':
    () => import('./pub3-bridging.js'),
}

export function hasExplainer(slug) {
  return slug in explainerRegistry
}

export function loadExplainer(slug) {
  const loader = explainerRegistry[slug]
  if (!loader) return null
  return loader().then((m) => m.default)
}
