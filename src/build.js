import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { renderIndex, renderPost } from "./templates.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const contentDir = path.join(rootDir, "content", "posts");
const publicDir = path.join(rootDir, "public");
const distDir = path.join(rootDir, "dist");

marked.setOptions({
  gfm: true,
  breaks: false,
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
  await writeFileEnsuringDir(path.join(distDir, "index.html"), renderIndex(posts));

  for (const post of posts) {
    const postDir = path.join(distDir, "posts", post.slug);
    await writeFileEnsuringDir(path.join(postDir, "index.html"), renderPost(post));
  }

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
