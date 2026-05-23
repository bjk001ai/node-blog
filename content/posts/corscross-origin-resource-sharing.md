---
title: "CORS(Cross-Origin Resource Sharing) 에러 원인과 완벽 해결법"
date: "2026-05-23"
tags: ["cs 지식","migration"]
excerpt: "프론트엔드 개발자들을 떨게 만드는 빨간색 CORS 에러 격파하기 로컬 환경에서 프론트엔드( localhost:3000 )를 개발하며 백엔드 API 서버( localhost:8080..."
slug: "corscross-origin-resource-sharing"
---

# 프론트엔드 개발자들을 떨게 만드는 빨간색 CORS 에러 격파하기

로컬 환경에서 프론트엔드(`localhost:3000`)를 개발하며 백엔드 API 서버(`localhost:8080`)에 데이터를 요청하면 십중팔구 브라우저 콘솔창에 빨간색 CORS 차단 에러를 맞닥뜨리게 됩니다. 이 현상이 왜 일어나고, 어떻게 해결하는지 알아봅니다.

## 1. CORS는 에러가 아닌 보안막이다

브라우저의 핵심 정책인 **SOP (Same-Origin Policy)**에 따라, 출처(프로토콜 + 도메인 + 포트)가 다른 리소스 자원 간의 안전하지 않은 접근을 원천 차단합니다. 이는 해킹 사이트에서 내 원래 은행 사이트로 나 몰래 불법 API를 쏘는 크로스 사이트 스크립팅 공격을 방지하기 위함입니다.

---

## 2. 해결 방안 2가지

1. **백엔드 CORS 허용 헤더 설정 (가장 추천)**: 백엔드 서버 응답 헤더에 프론트엔드의 오리진 주소를 명확하게 추가해 줍니다.
   - `Access-Control-Allow-Origin: http://localhost:3000`
2. **리버스 프록시(Reverse Proxy) 설정**: Next.js나 Vite 개발 서버의 `proxy` 설정을 켜서 브라우저에는 같은 도메인으로 들어오는 것처럼 눈속임 처리를 해줍니다.
