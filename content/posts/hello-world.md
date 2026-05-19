---
title: "Hello, Node Blog"
date: 2026-05-18
tags: ["node", "ssg"]
excerpt: "Node.js 미니 SSG로 GitHub Pages에 배포하는 첫 글입니다."
---

# Hello, Node Blog

이 글은 **Node.js 미니 SSG**로 생성된 샘플 포스트다.

## 빌드 흐름

1. `content/posts/*.md`를 읽는다.
2. front matter와 Markdown 본문을 분리한다.
3. HTML 템플릿에 끼워 넣어 `dist/`에 저장한다.
4. GitHub Actions가 `dist/`를 Pages에 배포한다.

## 코드 예시

```js
import { marked } from "marked";

const html = marked.parse("# Markdown → HTML");
console.log(html);
```

로컬에서 확인하려면:

```bash
npm install
npm run build
npm run preview
```

새 글을 추가하려면 `content/posts/`에 `.md` 파일을 만들고 `master`에 push하면 된다.
