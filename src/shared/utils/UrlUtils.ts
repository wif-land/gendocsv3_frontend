/**
 * Update URL without reloading the page
 * @param path - Path to update
 */
export const updateUrlWithoutReload = (path: string) => {
  window.history.pushState(null, '', path)
}

export const getUpdatedUrlWithQueryParams = (
  queryParams: Record<string, string>,
) => {
  const url = new URL(window.location.href)
  const searchParams = new URLSearchParams(url.search)
  for (const key in queryParams) {
    searchParams.set(key, queryParams[key])
  }

  return `${url.pathname}?${searchParams.toString()}`
}
