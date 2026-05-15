try {
  const introSeen = sessionStorage.getItem('introSeen');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add(introSeen || reducedMotion ? 'intro-done' : 'intro-pending');
} catch {
  document.documentElement.classList.add('intro-done');
}
