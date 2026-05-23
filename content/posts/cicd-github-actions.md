---
title: "CI/CD 기초와 GitHub Actions 파이프라인"
date: "2026-05-23"
tags: ["devops","migration"]
excerpt: "개발자의 삶의 질을 높이는 마법: CI/CD 개발자가 코드를 작성하고 서버에 접속해 git pull , npm install , npm build , pm2 restart 를 수동..."
slug: "cicd-github-actions"
---

# 개발자의 삶의 질을 높이는 마법: CI/CD

개발자가 코드를 작성하고 서버에 접속해 `git pull`, `npm install`, `npm build`, `pm2 restart`를 수동으로 매번 치고 있다면, 심각한 리소스 낭비입니다. 이를 자동화하는 것이 바로 CI/CD입니다.

## CI/CD란?

- **CI (Continuous Integration, 지속적 통합)**: 여러 개발자가 작성한 코드를 중앙 저장소에 주기적으로 합치고, 이 코드가 멀쩡한지 자동으로 빌드하고 테스트하는 과정입니다.
- **CD (Continuous Deployment, 지속적 배포)**: CI를 통과한 정상적인 코드를 프로덕션(실제 서비스) 서버에 자동으로 배포하는 과정입니다.

## GitHub Actions로 배포 파이프라인 만들기

GitHub이 자체적으로 제공하는 자동화 도구입니다. `.github/workflows/deploy.yml` 파일을 만들어 설정합니다.

```yaml
name: CI/CD Pipeline

# main 브랜치에 push가 발생할 때 트리거됨
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest # 실행될 가상 환경 OS

    steps:
    - name: 소스 코드 체크아웃
      uses: actions/checkout@v3

    - name: Node.js 세팅
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: 패키지 설치
      run: npm ci

    - name: 프로젝트 빌드
      run: npm run build

    - name: 서버로 파일 전송 및 배포 실행 (SSH)
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/my-app
          git pull origin main
          npm install
          npm run build
          pm2 reload app
```

## 주요 개념
- **Workflow**: 자동화 프로세스의 최상위 단위 (yml 파일 하나)
- **Event**: 워크플로우를 실행시키는 트리거 (Push, Pull Request, Cron 등)
- **Job**: 하나의 러너(가상머신)에서 실행되는 단계의 집합
- **Step**: 스크립트 실행(`run`) 또는 미리 만들어진 액션(`uses`)을 호출하는 최소 단위
- **Secrets**: 비밀번호, 서버 IP, SSH 키 등 코드에 노출되면 안 되는 보안 정보를 저장하는 GitHub의 설정 기능

CI/CD를 구축해두면 개발자는 오직 **"코드 작성"** 에만 집중할 수 있게 됩니다!
