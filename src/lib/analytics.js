/** Safe no-op until Google Tag Manager is added to index.html. */
export function track(event, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
