---
title: "Next.js App Router 아키텍처 핵심"
date: "2026-05-23"
tags: ["programming","migration"]
excerpt: "Next.js App Router의 패러다임 전환 Next.js 13부터 도입된 App Router ( app 디렉토리) 는 기존 Pages Router의 아키텍처를 완전히 뒤엎는..."
slug: "nextjs-app-router"
---

# Next.js App Router의 패러다임 전환

Next.js 13부터 도입된 **App Router (`app` 디렉토리)** 는 기존 Pages Router의 아키텍처를 완전히 뒤엎는 혁신적인 변화를 가져왔습니다. 핵심은 바로 React Server Components(RSC)의 도입입니다.

## 1. Server Components vs Client Components

App Router에서는 기본적으로 모든 컴포넌트가 **서버 컴포넌트(Server Component)** 로 동작합니다. 

### Server Components (기본값)
- 서버에서 렌더링되며 자바스크립트 번들이 클라이언트로 전송되지 않아 로딩이 매우 빠릅니다.
- 직접 데이터베이스(DB)에 접근하거나 민감한 환경 변수(API 키 등)를 안전하게 사용할 수 있습니다.
- `useState`, `useEffect`, `onClick` 등 클라이언트 상호작용은 불가능합니다.

```tsx
// 기본적으로 Server Component 입니다. async/await를 직접 쓸 수 있습니다.
export default async function Page() {
  const data = await fetch('https://api.example.com/data').then(res => res.json());
  return <main>{data.title}</main>;
}
```

### Client Components
- 상단에 `"use client"` 지시어를 선언하여 사용합니다.
- 브라우저 환경에서 동작하며, 상태 관리 및 이벤트 핸들러 사용이 필요할 때만 제한적으로 사용합니다.

```tsx
"use client";

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## 2. 파일 기반 라우팅

`app` 폴더 내의 디렉토리 이름이 라우트 경로가 되며, 특별한 파일 이름들이 각자의 고유한 역할을 가집니다.

- `page.tsx`: 해당 경로의 실제 UI를 렌더링합니다. (예: `app/about/page.tsx` -> `/about`)
- `layout.tsx`: 여러 페이지 간에 공유되는 레이아웃(헤더, 사이드바 등)입니다. 리렌더링되지 않고 상태를 유지합니다.
- `loading.tsx`: 데이터 패칭 중에 표시될 Suspense fallback UI입니다.
- `error.tsx`: 런타임 에러를 잡아내고 복구 UI를 렌더링하는 Error Boundary 역할을 합니다.
- `not-found.tsx`: 404 에러 페이지를 커스텀합니다.

Next.js의 App Router는 성능, SEO, 개발자 경험(DX)을 모두 잡은 모던 웹 풀스택 프레임워크의 완성형입니다.
