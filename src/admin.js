import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "..", "content", "posts");

const app = express();
const port = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function generateSlug(title) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return slug || `post-${Date.now()}`;
}

// 1. 관리자 폼 페이지 렌더링
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>블로그 관리자 페이지</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');
        body {
          font-family: 'Outfit', sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
          margin: 0;
          padding: 2rem;
          display: flex;
          justify-content: center;
        }
        .container {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 800px;
        }
        h1 {
          margin-top: 0;
          color: #3b82f6;
          text-align: center;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        input[type="text"], textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 1rem;
          box-sizing: border-box;
          font-family: inherit;
        }
        textarea {
          resize: vertical;
          min-height: 300px;
        }
        button {
          background-color: #3b82f6;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #2563eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✨ 새 블로그 글 쓰기 ✨</h1>
        <form action="/api/save" method="POST">
          <div class="form-group">
            <label for="title">글 제목</label>
            <input type="text" id="title" name="title" required placeholder="예: Node.js로 블로그 만들기">
          </div>
          <div class="form-group">
            <label for="tags">태그 (쉼표로 구분)</label>
            <input type="text" id="tags" name="tags" placeholder="예: nodejs, blog, dev">
          </div>
          <div class="form-group">
            <label for="excerpt">짧은 요약</label>
            <input type="text" id="excerpt" name="excerpt" placeholder="메인 화면에 노출될 요약문을 적어주세요">
          </div>
          <div class="form-group">
            <label for="content">본문 내용 (Markdown)</label>
            <textarea id="content" name="content" required placeholder="이곳에 마크다운 형식으로 글을 작성하세요..."></textarea>
          </div>
          <button type="submit">📝 새 글 저장하고 빌드하기</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// 2. 글 저장 API
app.post('/api/save', async (req, res) => {
  const { title, tags, excerpt, content } = req.body;
  
  const slug = generateSlug(title);
  const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const dateStr = new Date().toISOString().split('T')[0];

  const markdownContent = `---
title: "${title}"
date: "${dateStr}"
tags: ${JSON.stringify(tagList)}
excerpt: "${excerpt}"
slug: "${slug}"
---

${content}
`;

  const filePath = path.join(contentDir, `${slug}.md`);

  try {
    await fs.mkdir(contentDir, { recursive: true });
    
    // 파일 중복 체크 방지 로직 (간단하게 뒤에 타임스탬프 추가)
    let finalPath = filePath;
    try {
      await fs.access(filePath);
      finalPath = path.join(contentDir, `${slug}-${Date.now()}.md`);
    } catch {}

    await fs.writeFile(finalPath, markdownContent, 'utf8');
    console.log(`✅ 새 글 저장 완료: ${finalPath}`);

    // 로컬 Live Server 환경(dist)에 맞춰 자동 빌드 실행
    // Windows와 Bash/Zsh 등 환경에 무관하게 작동하도록 env 전달
    exec('npm run build', {
      env: { ...process.env, BASE_URL: '/dist/' }
    }, (error, stdout, stderr) => {
      if (error) {
        console.error("빌드 에러:", error);
        return res.send(`<h1>❌ 글은 저장되었으나 빌드 중 오류가 발생했습니다.</h1><pre>${error.message}</pre>`);
      }
      console.log(stdout);
      res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h1 style="color: #10b981;">🎉 글 작성 및 빌드가 완료되었습니다! 🎉</h1>
          <p>Live Server가 켜져있는 브라우저로 가서 새로고침 해보세요.</p>
          <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">새로운 글 또 쓰기</a>
        </div>
      `);
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("글 저장 중 서버 오류 발생");
  }
});

app.listen(port, () => {
  console.log(`
=========================================
🚀 로컬 관리자 서버가 켜졌습니다! 🚀
브라우저에서 아래 주소로 접속하세요:
👉 http://localhost:${port}
=========================================
`);
});
