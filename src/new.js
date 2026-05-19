import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "..", "content", "posts");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

function generateSlug(title) {
  // 소문자 변환, 공백을 하이픈으로 변경, 영문/숫자/하이픈 외 문자 제거
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  return slug || `post-${Date.now()}`;
}

async function main() {
  console.log("\n🚀 새 블로그 글 템플릿 생성기 🚀\n");
  
  const title = await question("1. 글 제목을 입력하세요: ");
  const tagsInput = await question("2. 태그를 쉼표(,)로 구분해서 입력하세요 (예: javascript, node): ");
  const excerpt = await question("3. 글의 짧은 요약을 입력하세요: ");
  
  // 기본 Slug 제안
  const defaultSlug = generateSlug(title);
  let slug = await question(`4. 파일명(URL Slug)을 입력하세요 [기본값: ${defaultSlug}]: `);
  
  if (!slug.trim()) {
    slug = defaultSlug;
  }

  const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
  const dateStr = new Date().toISOString().split('T')[0];

  const content = `---
title: "${title}"
date: "${dateStr}"
tags: ${JSON.stringify(tags)}
excerpt: "${excerpt}"
slug: "${slug}"
---

이곳에 마크다운 형식으로 블로그 본문을 작성해 주세요. ✍️
`;

  const filePath = path.join(contentDir, `${slug}.md`);
  
  try {
    await fs.mkdir(contentDir, { recursive: true });
    
    // 파일 중복 체크
    try {
      await fs.access(filePath);
      console.error(`\n❌ 에러: 이미 [${slug}.md] 파일이 존재합니다.`);
      rl.close();
      return;
    } catch {} // 파일이 없으면 정상 진행

    await fs.writeFile(filePath, content, 'utf8');
    console.log(`\n✅ 성공! 뼈대 파일이 완성되었습니다.`);
    console.log(`📂 위치: content/posts/${slug}.md\n`);
    console.log(`이제 VS Code에서 해당 파일을 열고 마음껏 글을 작성하세요!\n`);
  } catch (error) {
    console.error("파일 생성 중 오류 발생:", error);
  }

  rl.close();
}

main();
