import { useEffect } from "react";

import { DEFAULT_OG_IMAGE, SITE_NAME } from "../utils/seo";

type MetaInput = {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  siteName?: string;
  type?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const ensureMetaTag = (
  selector: string,
  attributes: Record<string, string>
) => {
  let tag = document.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag?.setAttribute(key, value);
  });

  return tag;
};

const ensureLinkTag = (rel: string) => {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }

  return link;
};

const STRUCTURED_DATA_ID = "structured-data";

const upsertStructuredData = (
  data?: Record<string, unknown> | Array<Record<string, unknown>>
) => {
  const existing = document.getElementById(STRUCTURED_DATA_ID);

  if (!data) {
    existing?.remove();
    return;
  }

  const script =
    existing ?? document.createElement("script");

  if (!existing) {
    script.type = "application/ld+json";
    script.id = STRUCTURED_DATA_ID;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
};

const useMetaTags = ({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  canonical,
  type = "website",
  siteName = SITE_NAME,
  structuredData,
}: MetaInput) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const resolvedCanonical =
      canonical || window.location.href || window.location.origin;

    document.title = title;
    ensureMetaTag('meta[name="description"]', { name: "description" }).setAttribute(
      "content",
      description
    );

    const canonicalLink = ensureLinkTag("canonical");
    canonicalLink.setAttribute("href", resolvedCanonical);

    ensureMetaTag('meta[property="og:title"]', {
      property: "og:title",
    }).setAttribute("content", title);

    ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
    }).setAttribute("content", description);

    ensureMetaTag('meta[property="og:image"]', {
      property: "og:image",
    }).setAttribute("content", image);

    ensureMetaTag('meta[property="og:url"]', {
      property: "og:url",
    }).setAttribute("content", resolvedCanonical);

    ensureMetaTag('meta[property="og:type"]', {
      property: "og:type",
    }).setAttribute("content", type);

    ensureMetaTag('meta[property="og:site_name"]', {
      property: "og:site_name",
    }).setAttribute("content", siteName);

    ensureMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
    }).setAttribute("content", "summary_large_image");

    ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
    }).setAttribute("content", title);

    ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
    }).setAttribute("content", description);

    ensureMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
    }).setAttribute("content", image);

    upsertStructuredData(structuredData);
  }, [canonical, description, image, siteName, structuredData, title, type]);
};

export default useMetaTags;
