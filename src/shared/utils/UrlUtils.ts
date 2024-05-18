export const updateUrlWithoutReload = (path: string) => {
  window.history.pushState(null, '', path)
}
