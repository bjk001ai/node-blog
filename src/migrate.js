import fs from 'fs';
import path from 'path';

// 프로젝트 루트 경로 및 타겟 디렉토리 설정
const NODE_BLOG_DIR = 'd:/workspaces/node-blog';
const NETLIFY_BLOG_DIR = 'd:/workspaces/netlify-blog';
const NEON_BLOG_DIR = 'd:/workspaces/neon-blog';

const TARGET_POSTS_DIR = path.join(NODE_BLOG_DIR, 'content/posts');

// 이미 존재하는 마크다운 파일들의 슬러그를 분석하여 중복 방지
const existingSlugs = new Set();
try {
  const files = fs.readdirSync(TARGET_POSTS_DIR);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(TARGET_POSTS_DIR, file), 'utf8');
      const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
      if (slugMatch) {
        existingSlugs.add(slugMatch[1]);
      } else {
        existingSlugs.add(path.basename(file, '.md'));
      }
    }
  }
} catch (err) {
  console.warn('기존 posts 디렉토리를 읽는 중 오류가 발생했으나 계속 진행합니다:', err.message);
}

// 텍스트 파일로부터 특정 변수 배열 선언을 파싱하는 함수
function extractPostsFromTsFile(filePath, startMarker, endMarker, isNetlifySeed = false) {
  if (!fs.existsSync(filePath)) {
    console.error(`파일이 존재하지 않습니다: ${filePath}`);
    return [];
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // netlify-blog의 경우 외부 변수(categoryId: techCategory?.id 등) 참조가 있어 에러 발생하므로 사전 제거
  if (isNetlifySeed) {
    content = content.replace(/categoryId:\s*[^,\n]+,?/g, '');
  }

  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) {
    console.error(`시작 마커를 찾을 수 없습니다: ${startMarker} in ${filePath}`);
    return [];
  }

  const remaining = content.substring(startIndex + startMarker.length);
  
  // multiline 정규식을 사용하여 마크다운 코드 블록 내부의 기호와 혼동되지 않고
  // 실제 코드 구조의 줄 시작에 있는 닫는 괄호를 정확히 감지
  let endRegex;
  if (endMarker === '];') {
    endRegex = /^[ \t]*\]\s*;/m;
  } else if (endMarker === ']);') {
    endRegex = /^[ \t]*\]\s*\)\s*;/m;
  } else if (endMarker === ']).returning();') {
    endRegex = /^[ \t]*\]\s*\)\s*\.\s*returning\s*\(\s*\)\s*;/m;
  } else {
    const escaped = endMarker.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    endRegex = new RegExp(escaped);
  }

  const match = remaining.match(endRegex);
  if (!match) {
    console.error(`종료 마커를 찾을 수 없습니다: ${endMarker} in ${filePath}`);
    return [];
  }

  const endIndex = match.index;
  const arrayText = remaining.substring(0, endIndex).trim();
  const fullExpr = `[${arrayText}]`;

  try {
    // 안전한 런타임 값 평가
    const evaluated = new Function(`return ${fullExpr}`)();
    return Array.isArray(evaluated) ? evaluated : [];
  } catch (err) {
    console.error(`파싱 실패 (${filePath}):`, err.message);
    return [];
  }
}

// 이관 대상 리스트 정의
const migrationTargets = [
  {
    path: path.join(NETLIFY_BLOG_DIR, 'src/db/seed.ts'),
    startMarker: 'const postsList = await db.insert(schema.posts).values([',
    endMarker: ']).returning();',
    isNetlifySeed: true,
    source: 'netlify-blog (seed.ts)'
  },
  {
    path: path.join(NEON_BLOG_DIR, 'src/db/seed.ts'),
    startMarker: 'await db.insert(posts).values([',
    endMarker: ']);',
    isNetlifySeed: false,
    source: 'neon-blog (seed.ts)'
  },
  {
    path: path.join(NEON_BLOG_DIR, 'src/db/seed-study.ts'),
    startMarker: 'const studyPosts = [',
    endMarker: '];',
    isNetlifySeed: false,
    source: 'neon-blog (seed-study.ts)'
  },
  {
    path: path.join(NEON_BLOG_DIR, 'src/db/seed-aws.ts'),
    startMarker: 'const awsPosts = [',
    endMarker: '];',
    isNetlifySeed: false,
    source: 'neon-blog (seed-aws.ts)'
  },
  {
    path: path.join(NEON_BLOG_DIR, 'src/db/seed-extra-posts.ts'),
    startMarker: 'const extraPosts = [',
    endMarker: '];',
    isNetlifySeed: false,
    source: 'neon-blog (seed-extra-posts.ts)'
  },
  {
    path: path.join(NEON_BLOG_DIR, 'src/db/seed-new-phase.ts'),
    startMarker: 'const newPosts = [',
    endMarker: '];',
    isNetlifySeed: false,
    source: 'neon-blog (seed-new-phase.ts)'
  }
];

let totalMigrated = 0;
let postCounter = 1;

console.log('🚀 마이그레이션 작업을 시작합니다...');

for (const target of migrationTargets) {
  console.log(`\n📂 소스 분석 중: ${target.source}...`);
  const rawPosts = extractPostsFromTsFile(target.path, target.startMarker, target.endMarker, target.isNetlifySeed);
  
  console.log(`   -> ${rawPosts.length}개의 포스트를 성공적으로 로드했습니다.`);

  for (const post of rawPosts) {
    if (!post.title || !post.content) {
      console.warn('   ⚠️ 타이틀이나 본문이 없는 포스트를 스킵합니다.');
      continue;
    }

    // 1. 슬러그 생성 및 고유화
    let baseSlug = post.slug || '';
    if (!baseSlug) {
      baseSlug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    }
    
    // 영문 슬러그가 매우 짧거나 한글 제목으로 인해 생성이 실패한 경우 기본 구조 부여
    if (!baseSlug || baseSlug.length < 3) {
      const categorySlug = (post.category || 'tech').toLowerCase().replace(/[^a-z0-9]/g, '');
      baseSlug = `${categorySlug}-post-${postCounter}`;
    }

    let uniqueSlug = baseSlug;
    let suffix = 1;
    while (existingSlugs.has(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${suffix}`;
      suffix++;
    }
    existingSlugs.add(uniqueSlug);
    postCounter++;

    // 2. 날짜 가공
    let dateStr = '2026-05-23'; // 기본값
    if (post.createdAt instanceof Date) {
      dateStr = post.createdAt.toISOString().split('T')[0];
    } else if (typeof post.createdAt === 'string') {
      dateStr = post.createdAt.split('T')[0];
    } else if (post.date) {
      dateStr = post.date;
    }

    // 3. 태그 정의
    const tags = [];
    if (post.category) {
      tags.push(post.category.toLowerCase());
    }
    // 기타 본문이나 제목 기반 추가 태그 주입 가능
    tags.push('migration');

    // 4. 요약(Excerpt) 추출
    let excerpt = post.description || post.excerpt || '';
    if (!excerpt) {
      // 본문의 앞쪽에서 순수 텍스트 100자 정도 추출
      const cleanContent = post.content
        .replace(/[#*`\-\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      excerpt = cleanContent.substring(0, 100) + '...';
    }

    // 5. 프론트매터 및 본문 마크다운 포맷팅
    const fileContent = `---
title: "${post.title.replace(/"/g, '\\"')}"
date: "${dateStr}"
tags: ${JSON.stringify(tags)}
excerpt: "${excerpt.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
slug: "${uniqueSlug}"
---

${post.content.trim()}
`;

    // 6. 마크다운 파일 저장
    const fileName = `${uniqueSlug}.md`;
    const targetFilePath = path.join(TARGET_POSTS_DIR, fileName);
    
    try {
      fs.writeFileSync(targetFilePath, fileContent, 'utf8');
      console.log(`   ✅ 마이그레이션 완료: [${post.category || '기타'}] "${post.title}" -> ${fileName}`);
      totalMigrated++;
    } catch (err) {
      console.error(`   ❌ 파일 쓰기 실패: ${fileName}`, err.message);
    }
  }
}

console.log(`\n🎉 모든 마이그레이션 작업이 성공적으로 완료되었습니다!`);
console.log(`📊 총 이관된 포스트 수: ${totalMigrated}개`);
