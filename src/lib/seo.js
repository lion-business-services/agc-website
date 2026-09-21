import { useEffect } from "react";
import { business } from "../config/business";

/** Sets <title>, meta description and canonical for the current page. */
export function useSeo({ title, description, path = "/" }) {
  useEffect(() => {
    document.title = title.includes(business.shortName) ? title : `${title} | ${business.shortName}`;
    const set = (sel, attr, val, make) => {
      let el = document.head.querySelector(sel);
      if (!el) { el = make(); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    if (description) {
      set('meta[name="description"]', "content", description, () => Object.assign(document.createElement("meta"), { name: "description" }));
      set('meta[property="og:description"]', "content", description, () => { const m = document.createElement("meta"); m.setAttribute("property", "og:description"); return m; });
    }
    set('meta[property="og:title"]', "content", document.title, () => { const m = document.createElement("meta"); m.setAttribute("property", "og:title"); return m; });
    set('link[rel="canonical"]', "href", `${business.url}${path}`, () => Object.assign(document.createElement("link"), { rel: "canonical" }));
  }, [title, description, path]);
}
