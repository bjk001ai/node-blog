---
title: "GitHub Enterprise & Actions를 이용한 대규모 빌드 격리 및 시크릿 관리"
date: "2026-05-23"
tags: ["github","migration"]
excerpt: "GitHub CI/CD 보안 및 엔터프라이즈 레벨 러너 인프라 구축 글로벌 엔터프라이즈 환경에서 보안은 CI/CD 자동화 파이프라인의 핵심 설계 요건입니다. 본 가이드에서는 Git..."
slug: "github-enterprise-actions"
---

# GitHub CI/CD 보안 및 엔터프라이즈 레벨 러너 인프라 구축

글로벌 엔터프라이즈 환경에서 보안은 CI/CD 자동화 파이프라인의 핵심 설계 요건입니다. 본 가이드에서는 **GitHub Enterprise Server(GHES)** 환경에서 **GitHub Actions**의 셀프 호스팅 러너(Self-hosted Runner)들을 완전히 격리하고, 민감 정보인 시크릿(Secrets)을 강력하게 관리하는 방법을 다룹니다.

## 1. 셀프 호스팅 러너 격리 기법 (Ephemerality)

보안 위협 중 가장 큰 요소는 이전 빌드에 남아 있는 리액션 파일이나 해킹용 코드가 다음 빌드 환경에 유출(Cross-contamination)되는 것입니다.

이를 차단하기 위해 **Ephemeral Runner** 모드를 도입합니다. 빌드가 끝나는 즉시 해당 러너 컨테이너를 영구 삭제하고 새로 복제하는 기법입니다.

```bash
# 셀프 호스팅 러너 설정 시 --ephemeral 플래그 사용
./config.sh --url https://github.com/my-org --token <RUNNER_TOKEN> --ephemeral
```

## 2. HashiCorp Vault와 OpenID Connect(OIDC) 통합

GitHub Actions에 클라우드 제공자의 자격 증명 키(AWS Access Key 등)를 하드코딩하는 방식은 매우 위험합니다. 대신 GitHub와 외부 키 관리 인프라 간 **OIDC 신뢰 연동**을 구현합니다.

```yaml
name: AWS Deploy
on: [push]

permissions:
  id-token: write # OIDC ID 토큰 발급에 권장
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-deploy-role
          aws-region: us-east-1
          audience: sts.amazonaws.com
      - name: Deploy to S3
        run: aws s3 sync ./dist s3://my-prod-bucket
```

위 설정을 도입하면 영구적인 비밀 키가 필요 없으며, 빌드 시점에 발급되는 단기 토큰(JWT)으로 모든 인증 과정이 끝나 보안 위협을 100% 제거할 수 있습니다.
