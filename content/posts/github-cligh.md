---
title: "GitHub CLI(gh) 설치 및 터미널에서 깃허브 정복하기"
date: "2026-05-23"
tags: ["github","migration"]
excerpt: "GitHub CLI를 통한 개발 생산성 극한 극대화 기법 브라우저 마우스 클릭 없이 오직 키보드와 터미널 창 안에서 GitHub Issue를 확인하고, Pull Request(PR..."
slug: "github-cligh"
---

# GitHub CLI를 통한 개발 생산성 극한 극대화 기법

브라우저 마우스 클릭 없이 오직 키보드와 터미널 창 안에서 GitHub Issue를 확인하고, Pull Request(PR)를 날리며, 레포지토리를 생성하는 방법을 소개합니다. 바로 **GitHub CLI (`gh`)**입니다.

## 1. 깃허브 CLI 핵심 명령어

- **레포지토리 즉시 생성**:
  ```bash
  gh repo create my-awesome-project --public
  ```
- **PR 목록 조회 및 검토**:
  ```bash
  gh pr list
  gh pr checkout 42 # 42번 PR 코드로 로컬 브랜치 자동 스위칭!
  ```
- **PR 생성하기**:
  ```bash
  gh pr create --title "feat: 멋진 결제 로직 구현" --body "상세 내역 기재..."
  ```

터미널 작업 속도가 3배 이상 빨라지는 혁신적인 툴셋으로 마우스를 전혀 만질 필요가 없게 됩니다.
