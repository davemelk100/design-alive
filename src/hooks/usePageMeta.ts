import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageMeta {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
}

const BASE_URL = "https://themalive.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/themal-og-wide.png`;

export default function usePageMeta({ title, description, canonicalPath, ogImage }: PageMeta) {
  const { pathname } = useLocation();
  const canonical = `${BASE_URL}${canonicalPath ?? pathname}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  useEffect(() => {
    document.title = title;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:url", canonical);
    setMeta("name", "twitter:image", image);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);
  }, [title, description, canonical, image]);
}
