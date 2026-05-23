---
title: "Docker 컨테이너와 Docker Compose"
date: "2026-05-23"
tags: ["devops","migration"]
excerpt: "Docker: 내 컴퓨터에서 되는데 왜 서버에선 안 될까? 개발 환경과 운영 환경의 불일치 문제는 개발자들을 오랫동안 괴롭혀왔습니다. Docker는 애플리케이션을 실행하는 데 필요..."
slug: "docker-docker-compose"
---

# Docker: 내 컴퓨터에서 되는데 왜 서버에선 안 될까?

개발 환경과 운영 환경의 불일치 문제는 개발자들을 오랫동안 괴롭혀왔습니다. Docker는 애플리케이션을 실행하는 데 필요한 모든 것을 **컨테이너(Container)** 라는 표준화된 단위로 패키징하여, 어디서든 동일하게 실행될 수 있도록 보장합니다.

## 핵심 개념

- **이미지(Image)**: 컨테이너를 실행하기 위해 필요한 프로그램, 라이브러리, 소스 코드 등을 묶어놓은 읽기 전용 템플릿입니다. (예: 붕어빵 틀)
- **컨테이너(Container)**: 이미지를 실행한 상태로, 격리된 환경에서 돌아가는 프로세스입니다. (예: 구워진 붕어빵)

## 1. Dockerfile 작성하기

나만의 이미지를 만들기 위한 설정 파일입니다.

```dockerfile
# 1. Base 이미지 설정
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 5. 실행 포트 설정
EXPOSE 3000

# 6. 실행 명령어
CMD ["npm", "start"]
```

## 2. 기본 명령어 모음

- `docker build -t my-app .` : Dockerfile을 기반으로 이미지 빌드
- `docker run -p 3000:3000 my-app` : 이미지로 컨테이너 실행
- `docker ps` : 실행 중인 컨테이너 목록 확인
- `docker stop <container_id>` : 컨테이너 중지
- `docker rm <container_id>` : 컨테이너 삭제
- `docker rmi <image_id>` : 이미지 삭제

## 3. Docker Compose 

여러 개의 컨테이너(웹 서버, 데이터베이스, 캐시 서버 등)를 한 번에 띄우고 관리할 수 있게 해주는 도구입니다. `docker-compose.yml` 파일에 설정합니다.

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

터미널에서 `docker-compose up -d` 명령어 한 번이면 웹 서버와 데이터베이스가 서로 연결된 상태로 백그라운드에서 동시에 실행됩니다! 도커는 현대 백엔드 개발과 DevOps의 알파이자 오메가입니다.
