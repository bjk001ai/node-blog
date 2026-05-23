---
title: "React Server Components(RSC)의 동작 원리 완벽 가이드"
date: "2026-05-23"
tags: ["react","migration"]
excerpt: "React Server Components (RSC)의 개념과 동작 메커니즘 전통적인 클라이언트 사이드 렌더링(CSR)과 서버 사이드 렌더링(SSR)의 단점들을 보완하기 위해 리액..."
slug: "react-server-componentsrsc"
---

# React Server Components (RSC)의 개념과 동작 메커니즘

전통적인 클라이언트 사이드 렌더링(CSR)과 서버 사이드 렌더링(SSR)의 단점들을 보완하기 위해 리액트는 **서버 컴포넌트(Server Components)**라는 새로운 렌더링 모델을 창안했습니다.

## 1. SSR과 RSC의 결정적 차이점

- **SSR (Server Side Rendering)**: 서버에서 전체 React 트리를 HTML 문자열로 변환하여 브라우저에 내려보내고, 브라우저에서 JavaScript 코드가 다운로드되면 **Hydration**을 진행합니다.
- **RSC (React Server Components)**: 서버에서만 실행되며 브라우저용 JavaScript 번들 크기를 전혀 증가시키지 않는 컴포넌트입니다. 빌드되거나 서버에서 실행된 컴포넌트는 특수 직렬화 형식(JSON과 유사한 데이터)으로 변환되어 브라우저로 점진적 전송(Streaming)됩니다.

---

## 2. RSC의 핵심 장점

1. **제로 번들 사이즈**: 서버 컴포넌트에 쓰인 라이브러리(e.g., `marked`, `date-fns`)는 브라우저 번들에 절대 포함되지 않아 페이지 로딩이 엄청나게 빨라집니다.
2. **다이렉트 백엔드 액세스**: 데이터베이스, 파일 시스템, 서버 자원에 API 엔드포인트 없이 직접 연결하여 쿼리를 수행할 수 있습니다.
3. **클라이언트 상태 유지**: 페이지 일부를 서버에서 다시 렌더링해 가져오더라도 브라우저의 입력 폼 내용이나 포커스, CSS 애니메이션 상태가 완벽하게 유지됩니다!
