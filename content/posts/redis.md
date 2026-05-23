---
title: "Redis: 인메모리 캐시 시스템 완벽 이해"
date: "2026-05-23"
tags: ["devops","migration"]
excerpt: "속도의 한계를 넘다: Redis Redis(Remote Dictionary Server)는 메모리 기반(In Memory)의 초고속 Key Value 데이터 스토어입니다. 데이터베..."
slug: "redis"
---

# 속도의 한계를 넘다: Redis

Redis(Remote Dictionary Server)는 메모리 기반(In-Memory)의 초고속 Key-Value 데이터 스토어입니다. 데이터베이스, 캐시, 메시지 브로커 등으로 널리 사용되며, 디스크가 아닌 램(RAM)에 데이터를 저장하기 때문에 RDBMS(MySQL, Oracle)와는 비교할 수 없을 정도로 읽기/쓰기 속도가 빠릅니다.

## Redis의 핵심 특징

1. **In-Memory 아키텍처**: RAM에 데이터를 저장하여 밀리초(ms) 단위 이하의 응답 속도를 자랑합니다.
2. **다양한 자료구조 지원**: 단순한 String뿐만 아니라 List, Set, Hash, Sorted Set(ZSet), Bitmap 등 복잡한 데이터 구조를 제공합니다.
3. **싱글 스레드 (Single Thread)**: 한 번에 하나의 명령만 처리하므로 Race Condition(동시성 문제)을 피할 수 있고 Atomic한 연산을 보장합니다.

## 주로 어디에 쓸까? 활용 패턴

### 1. Caching (캐싱)
DB 쿼리가 무겁거나 자주 변경되지 않는 데이터를 Redis에 미리 저장해 두고 빠르게 응답합니다. (Look-aside 캐시 패턴)
- 세션(Session) 저장소: 사용자의 로그인 세션을 중앙 집중식으로 관리
- API 응답 데이터 캐싱: 실시간 랭킹 시스템, 메인 페이지 데이터 등

### 2. Rate Limiter (API 호출 횟수 제한)
특정 사용자가 짧은 시간 내에 API를 무한정 호출하는 것을 방지하기 위해 Redis의  만료 시간(TTL)과 증감 명령어(INCR)를 사용하여 트래픽을 제어합니다.

### 3. Message Queue (메시지 큐)
Redis의 Pub/Sub 기능을 활용하여 채팅 시스템이나 알림 서버에서 실시간 메시지 브로커 역할을 수행합니다. 실시간 통신 및 웹소켓 연결 관리에 탁월합니다.

### 4. Leaderboard (실시간 랭킹 시스템)
`Sorted Set` 자료구조를 사용하면 데이터와 점수(Score)를 함께 저장하여 자동으로 점수순 정렬을 해주므로, 게임 순위나 실시간 인기 검색어 구현이 매우 쉽습니다.

## 주의할 점
메모리는 디스크보다 용량이 작고 비쌉니다. 서버가 다운되면 데이터가 날아갈 수 있으므로(RDB, AOF 백업 방식이 있긴 하지만), **사라져도 치명적이지 않거나 언제든 DB에서 다시 복구할 수 있는 데이터**를 위주로 Redis에 보관하는 것이 핵심 설계 원칙입니다.
