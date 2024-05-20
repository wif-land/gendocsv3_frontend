/**
 * Update URL without reloading the page
 * @param path - Path to update
 */
export const updateUrlWithoutReload = (path: string) => {
  window.history.pushState(null, '', path)
}
