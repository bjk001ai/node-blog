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
  <link rel="canonical" href="${escapeHtml(canonical)}">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="site-title" href="${asset("")}">${escapeHtml(site.title)}</a>
      <p class="site-description">${escapeHtml(site.description)}</p>
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

export function renderIndex(posts) {
  const list = posts
    .map(
      (post) => `<article class="post-card">
  <h2><a href="${postUrl(post.slug)}">${escapeHtml(post.title)}</a></h2>
  <time datetime="${escapeHtml(post.dateIso)}">${escapeHtml(formatDate(post.date))}</time>
  ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ""}
  ${
    post.tags.length
      ? `<ul class="tag-list">${post.tags
          .map((tag) => `<li>${escapeHtml(tag)}</li>`)
          .join("")}</ul>`
      : ""
  }
</article>`
    )
    .join("\n");

  const content = `<section class="hero">
  <h1>${escapeHtml(site.title)}</h1>
  <p>${escapeHtml(site.description)}</p>
</section>
<section class="post-list">
  ${list || "<p>아직 작성된 글이 없습니다.</p>"}
</section>`;

  return layout({ title: "", description: site.description, content, path: "" });
}

export function renderPost(post) {
  const content = `<article class="post">
  <header class="post-header">
    <h1>${escapeHtml(post.title)}</h1>
    <time datetime="${escapeHtml(post.dateIso)}">${escapeHtml(formatDate(post.date))}</time>
    ${
      post.tags.length
        ? `<ul class="tag-list">${post.tags
            .map((tag) => `<li>${escapeHtml(tag)}</li>`)
            .join("")}</ul>`
        : ""
    }
  </header>
  <div class="post-content">
    ${post.html}
  </div>
  <p class="back-link"><a href="${asset("")}">← 목록으로</a></p>
</article>`;

  return layout({
    title: post.title,
    description: post.excerpt ?? site.description,
    content,
    path: `posts/${post.slug}/`,
  });
}
