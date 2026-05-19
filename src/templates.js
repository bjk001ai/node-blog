import { asset, postUrl, site } from "./config.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function layout({ title, description, content, path = "" }) {
  const pageTitle = title ? `${title} | ${site.title}` : site.title;
  const metaDescription = description ?? site.description;
  const canonical = `${site.url}${asset(path)}`;

  return `<!DOCTYPE html>
<html lang="${site.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <title>${escapeHtml(pageTitle)}</title>
  <link rel="stylesheet" href="${asset("css/style.css")}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <link rel="canonical" href="${escapeHtml(canonical)}">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="site-title" href="${asset("")}">${escapeHtml(site.title)}</a>
    </div>
  </header>
  <main class="container">
    ${content}
  </main>
  <footer class="site-footer">
    <div class="container">
      <p>Built with Node.js SSG · Deployed on GitHub Pages</p>
    </div>
  </footer>
</body>
</html>`;
}

export function renderIndex(posts, pagination = null, urlPath = "") {
  const list = posts
    .map(
      (post) => `<article class="post-card">
  <h2><a href="${postUrl(post.slug)}">${escapeHtml(post.title)}</a></h2>
  <div class="post-meta">
    <time datetime="${escapeHtml(post.dateIso)}">${escapeHtml(formatDate(post.date))}</time>
  </div>
  ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ""}
  ${
    post.tags.length
      ? `<ul class="tag-list">${post.tags
          .map((tag) => `<li><a href="${asset(`tags/${tag}/`)}" class="tag">#${escapeHtml(tag)}</a></li>`)
          .join("")}</ul>`
      : ""
  }
</article>`
    )
    .join("\n");

  let paginationHtml = "";
  if (pagination && pagination.totalPages > 1) {
    paginationHtml = `<nav class="pagination">
      ${pagination.prevUrl !== null ? `<a href="${asset(pagination.prevUrl)}" class="btn-page">← 이전 페이지</a>` : `<span class="btn-page disabled">← 이전 페이지</span>`}
      <span class="page-info">${pagination.currentPage} / ${pagination.totalPages}</span>
      ${pagination.nextUrl !== null ? `<a href="${asset(pagination.nextUrl)}" class="btn-page">다음 페이지 →</a>` : `<span class="btn-page disabled">다음 페이지 →</span>`}
    </nav>`;
  }

  const content = `<section class="hero">
  <h1>${escapeHtml(site.title)}</h1>
  <p>${escapeHtml(site.description)}</p>
</section>
<section class="post-list">
  ${list || "<p>아직 작성된 글이 없습니다.</p>"}
</section>
${paginationHtml}`;

  const titleStr = pagination && pagination.currentPage > 1 ? `페이지 ${pagination.currentPage}` : "";

  return layout({ title: titleStr, description: site.description, content, path: urlPath });
}

export function renderPost(post, prevPost, nextPost) {
  const content = `<article class="post">
  <header class="post-header">
    <h1>${escapeHtml(post.title)}</h1>
    <div class="post-meta" style="justify-content: center;">
      <time datetime="${escapeHtml(post.dateIso)}">${escapeHtml(formatDate(post.date))}</time>
    </div>
    ${
      post.tags.length
        ? `<ul class="tag-list">${post.tags
            .map((tag) => `<li><a href="${asset(`tags/${tag}/`)}" class="tag">#${escapeHtml(tag)}</a></li>`)
            .join("")}</ul>`
        : ""
    }
  </header>
  <div class="post-content">
    ${post.html}
  </div>
  
  <nav class="post-navigation">
    ${prevPost ? `<a href="${postUrl(prevPost.slug)}" class="nav-link prev">
      <span class="nav-label">← 이전 글</span>
      <span class="nav-title">${escapeHtml(prevPost.title)}</span>
    </a>` : `<div></div>`}
    ${nextPost ? `<a href="${postUrl(nextPost.slug)}" class="nav-link next">
      <span class="nav-label">다음 글 →</span>
      <span class="nav-title">${escapeHtml(nextPost.title)}</span>
    </a>` : `<div></div>`}
  </nav>

  <section class="comments" style="margin-top: 4rem;">
    <script src="https://utteranc.es/client.js"
            repo="bjk001ai/node-blog"
            issue-term="pathname"
            theme="preferred-color-scheme"
            crossorigin="anonymous"
            async>
    </script>
  </section>
</article>`;

  return layout({
    title: post.title,
    description: post.excerpt ?? site.description,
    content,
    path: `posts/${post.slug}/`,
  });
}

export function renderTag(tag, posts) {
  const list = posts
    .map(
      (post) => `<article class="post-card">
  <h2><a href="${postUrl(post.slug)}">${escapeHtml(post.title)}</a></h2>
  <div class="post-meta">
    <time datetime="${escapeHtml(post.dateIso)}">${escapeHtml(formatDate(post.date))}</time>
  </div>
  ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ""}
</article>`
    )
    .join("\n");

  const content = `<section class="hero">
  <h1>#${escapeHtml(tag)}</h1>
  <p>${posts.length}개의 글이 있습니다.</p>
</section>
<section class="post-list">
  ${list}
</section>`;

  return layout({ title: `태그: ${tag}`, description: `태그 ${tag}에 관한 글 모음`, content, path: `tags/${tag}/` });
}

export function generateRss(posts) {
  const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${site.url}${postUrl(post.slug)}</link>
      <guid>${site.url}${postUrl(post.slug)}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
    </item>
  `).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${site.title}]]></title>
    <link>${site.url}${asset("")}</link>
    <description><![CDATA[${site.description}]]></description>
    <language>${site.language}</language>
    ${items}
  </channel>
</rss>`;
}

export function generateSitemap(posts) {
  const urls = posts.map(post => `
  <url>
    <loc>${site.url}${postUrl(post.slug)}</loc>
    <lastmod>${post.dateIso}</lastmod>
  </url>
  `).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.url}${asset("")}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;
}
