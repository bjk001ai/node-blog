import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import hljs from "highlight.js";
import { renderIndex, renderPost, renderTag, generateRss, generateSitemap } from "./templates.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const contentDir = path.join(rootDir, "content", "posts");
const publicDir = path.join(rootDir, "public");
const distDir = path.join(rootDir, "dist");

marked.setOptions({
  gfm: true,
  breaks: false,
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

async function emptyDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function copyDir(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDir(from, to);
      continue;
    }

    await fs.copyFile(from, to);
  }
}

function toSlug(filename) {
  return path.basename(filename, path.extname(filename));
}

function normalizeTags(tags) {
  if (!tags) return [];
  return Array.isArray(tags) ? tags : [tags];
}

async function loadPosts() {
  let files = [];

  try {
    files = (await fs.readdir(contentDir)).filter((name) => name.endsWith(".md"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const posts = [];

  for (const filename of files) {
    const filePath = path.join(contentDir, filename);
    const source = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(source);
    const slug = data.slug ?? toSlug(filename);
    const date = data.date ? new Date(data.date) : new Date();

    posts.push({
      slug,
      title: data.title ?? slug,
      date,
      dateIso: date.toISOString(),
      tags: normalizeTags(data.tags),
      excerpt: data.excerpt ?? "",
      html: marked.parse(content),
    });
  }

  return posts.sort((a, b) => b.date - a.date);
}

async function writeFileEnsuringDir(filePath, contents) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents, "utf8");
}

async function build() {
  const posts = await loadPosts();

  await emptyDir(distDir);
  
  // Generate paginated index pages
  const POSTS_PER_PAGE = 5;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE) || 1;

  for (let i = 0; i < totalPages; i++) {
    const pagePosts = posts.slice(i * POSTS_PER_PAGE, (i + 1) * POSTS_PER_PAGE);
    const currentPage = i + 1;
    
    const htmlPath = currentPage === 1 
      ? path.join(distDir, "index.html")
      : path.join(distDir, "page", currentPage.toString(), "index.html");
      
    const urlPath = currentPage === 1 ? "" : `page/${currentPage}/`;
    
    const pagination = {
      currentPage,
      totalPages,
      prevUrl: currentPage > 1 ? (currentPage === 2 ? "" : `page/${currentPage - 1}/`) : null,
      nextUrl: currentPage < totalPages ? `page/${currentPage + 1}/` : null
    };
    
    await writeFileEnsuringDir(htmlPath, renderIndex(pagePosts, pagination, urlPath));
  }

  // Generate posts
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    // Since posts are sorted descending (newest first):
    // "prev" means older post (index + 1)
    // "next" means newer post (index - 1)
    const prevPost = posts[i + 1] || null; 
    const nextPost = posts[i - 1] || null;
    
    const postDir = path.join(distDir, "posts", post.slug);
    await writeFileEnsuringDir(path.join(postDir, "index.html"), renderPost(post, prevPost, nextPost));
  }

  // Generate tag pages
  const tagsMap = new Map();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagsMap.has(tag)) tagsMap.set(tag, []);
      tagsMap.get(tag).push(post);
    }
  }
  for (const [tag, tagPosts] of tagsMap) {
    const tagDir = path.join(distDir, "tags", tag);
    await writeFileEnsuringDir(path.join(tagDir, "index.html"), renderTag(tag, tagPosts));
  }

  // Generate RSS and Sitemap
  await writeFileEnsuringDir(path.join(distDir, "rss.xml"), generateRss(posts));
  await writeFileEnsuringDir(path.join(distDir, "sitemap.xml"), generateSitemap(posts));

  try {
    await copyDir(publicDir, distDir);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  console.log(`Built ${posts.length} post(s) → ${distDir}`);
}

async function watch() {
  const watchTargets = [
    path.join(rootDir, "content"),
    path.join(rootDir, "public"),
    path.join(rootDir, "src"),
  ];

  let timer;

  const scheduleBuild = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        await build();
      } catch (error) {
        console.error(error);
      }
    }, 100);
  };

  await build();

  for (const target of watchTargets) {
    fs.watch(target, { recursive: true }, scheduleBuild);
  }

  console.log("Watching for changes...");
}

const isWatchMode = process.argv.includes("--watch");

if (isWatchMode) {
  await watch();
} else {
  await build();
}
