const baseUrl = process.env.BASE_URL ?? "/node-blog/";

export const site = {
  title: "Node Blog",
  description: "Node.js로 만든 정적 블로그",
  author: "bjk001ai",
  language: "ko",
  baseUrl: baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
  url: process.env.SITE_URL ?? "https://bjk001ai.github.io",
};

export function asset(path) {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${site.baseUrl}${normalized}`;
}

export function postUrl(slug) {
  return asset(`posts/${slug}/`);
}
