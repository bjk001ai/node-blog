---
title: "GitHub Pages와 Actions로 포트폴리오 무료 호스팅하기"
date: "2026-05-23"
tags: ["github","migration"]
excerpt: "개발자의 필수 포트폴리오를 무료로 호스팅하는 완벽한 DevOps 가이드 아키텍처 설계와 훌륭한 백엔드 코드를 작성했더라도, 이를 세상에 보여줄 멋진 정적 웹사이트(포트폴리오)가 없..."
slug: "github-pages-actions"
---

# 개발자의 필수 포트폴리오를 무료로 호스팅하는 완벽한 DevOps 가이드

아키텍처 설계와 훌륭한 백엔드 코드를 작성했더라도, 이를 세상에 보여줄 멋진 정적 웹사이트(포트폴리오)가 없다면 무용지물입니다. **GitHub Pages**와 자동 배포 빌더인 **GitHub Actions**를 사용하여 단 10분 만에 웹 호스팅을 완성하는 비법입니다.

## 1. GitHub Actions 워크플로우 설정

프로젝트 루트 경로에 `.github/workflows/deploy.yml`을 작성합니다:

```yaml
name: Deploy Portfolio
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: 20
    - name: Install and Build
      run: |
        npm install
        npm run build
    - name: Deploy static assets to Pages
      uses: JamesIves/github-pages-deploy-action@v4
      with:
        folder: build
        branch: gh-pages
```

코드만 `push`하면 자동으로 빌드 검증을 거친 후 무료 호스팅 주소로 배포가 이루어져 지속적 배포(CD)를 완전 무료로 즐길 수 있습니다!
