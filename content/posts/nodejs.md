---
title: "Node.js 이벤트 루프와 비동기 처리"
date: "2026-05-23"
tags: ["programming","migration"]
excerpt: "Node.js의 심장: 이벤트 루프(Event Loop) Node.js는 싱글 스레드(Single Thread) 논블로킹 I/O (Non blocking I/O) 모델을 기반으로 ..."
slug: "nodejs"
---

# Node.js의 심장: 이벤트 루프(Event Loop)

Node.js는 **싱글 스레드(Single-Thread) 논블로킹 I/O (Non-blocking I/O)** 모델을 기반으로 합니다. 스레드가 하나뿐인데 어떻게 수천 개의 요청을 동시에 처리할 수 있을까요? 그 비밀이 바로 '이벤트 루프'에 있습니다.

## 비동기 처리의 원리

Node.js 환경에서 자바스크립트 코드는 메인 스레드인 V8 엔진(Call Stack)에서 순차적으로 실행됩니다. 하지만 파일 읽기, 네트워크 요청, DB 쿼리처럼 오래 걸리는 작업(I/O 작업)을 만나면, 메인 스레드는 기다리지 않고 백그라운드(libuv)로 작업을 넘깁니다. 

작업이 완료되면 콜백 함수가 Task Queue로 이동하고, Event Loop는 Call Stack이 비어있을 때 Queue에 있는 콜백을 Stack으로 끌어올려 실행합니다.

## 이벤트 루프의 6단계 (Phases)

Node.js의 이벤트 루프는 내부적으로 여러 개의 큐를 관리하며 틱(Tick)마다 다음 단계를 순환합니다.

1. **Timers**: `setTimeout()`, `setInterval()` 등의 콜백 실행
2. **Pending Callbacks**: 지연된 I/O 콜백 실행
3. **Idle, Prepare**: 내부용 로직 처리
4. **Poll**: 새로운 I/O 이벤트를 대기하고 관련된 콜백 실행 (대부분의 시간 소요)
5. **Check**: `setImmediate()` 콜백 실행
6. **Close Callbacks**: `socket.on('close', ...)` 등 닫기 콜백 실행

> **Microtask Queue** (`Promise`, `process.nextTick`)는 각 Phase 사이마다 우선적으로 실행되어 Call Stack을 점유합니다.

## Promise와 Async/Await

현대 Node.js에서는 콜백 지옥(Callback Hell)을 피하기 위해 Promise 객체와 이를 감싼 `async/await` 구문을 사용합니다.

```javascript
const fs = require('fs/promises');

async function readFileContent() {
  try {
    // 파일을 읽을 때까지 기다리지 않고 제어권을 넘김(Non-blocking)
    const data = await fs.readFile('./data.txt', 'utf8');
    console.log(data);
  } catch (error) {
    console.error("파일 읽기 에러:", error);
  }
}

console.log("시작");
readFileContent();
console.log("종료");

// 출력 순서: "시작" -> "종료" -> "(파일 내용)"
```

Node.js의 동작 원리를 이해하면 병목 현상이 발생하는 코드를 피하고 성능이 뛰어난 백엔드 서버를 구축할 수 있습니다.
