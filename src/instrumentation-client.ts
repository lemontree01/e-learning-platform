// Next calls this the moment a client navigation starts, before the route has loaded (or, in
// development, compiled). It shows the progress bar; App's NavigationEnd hides it again.
export function onRouterTransitionStart (url: string) {
  const next = new URL(url, location.href);
  if (next.pathname + next.search === location.pathname + location.search) return;
  document.documentElement.dataset.navigating = '';
}
