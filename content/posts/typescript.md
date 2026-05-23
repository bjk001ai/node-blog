---
title: "TypeScript 기초부터 실전까지"
date: "2026-05-23"
tags: ["programming","migration"]
excerpt: "TypeScript의 세계로 TypeScript는 JavaScript의 슈퍼셋(Superset)으로, 동적 타입 언어인 JavaScript에 정적 타입 검사(Static Type ..."
slug: "typescript"
---

# TypeScript의 세계로

TypeScript는 JavaScript의 슈퍼셋(Superset)으로, 동적 타입 언어인 JavaScript에 **정적 타입 검사(Static Type Checking)** 기능을 추가한 언어입니다. 마이크로소프트에서 개발 및 유지보수하고 있으며, 현재 대부분의 모던 웹 개발 생태계의 표준으로 자리 잡고 있습니다.

## 왜 TypeScript를 써야 할까?

1. **컴파일 단계의 오류 발견**: 코드를 실행하기 전 에디터에서 오류를 잡아줍니다.
2. **강력한 자동 완성**: 객체의 프로퍼티나 함수 인자에 대한 추론을 통해 생산성을 극대화합니다.
3. **안전한 리팩토링**: 코드를 수정할 때 발생하는 사이드 이펙트를 타입을 통해 사전에 차단합니다.

## 핵심 개념 요약

### 1. 기본 타입 지정
변수 이름 뒤에 `:`를 붙여 타입을 선언합니다.

```typescript
let isDone: boolean = false;
let age: number = 25;
let userName: string = "Bong";
let numbers: number[] = [1, 2, 3];
```

### 2. 인터페이스 (Interface)
객체의 구조를 정의하는 역할을 합니다. 가장 많이 사용되는 기능 중 하나입니다.

```typescript
interface User {
  id: number;
  name: string;
  age?: number; // 선택적 프로퍼티 (?)
  readonly createdAt: Date; // 읽기 전용 프로퍼티
}

const user: User = {
  id: 1,
  name: "Bong Dev",
  createdAt: new Date()
};
```

### 3. 타입 별칭 (Type Alias)
특정 타입에 이름을 붙이는 용도 부릅니다. Union, Intersection 타입 등에 유용합니다.

```typescript
type ID = string | number;
type Status = "Pending" | "Success" | "Failed";

let currentStatus: Status = "Success";
```

### 4. 제네릭 (Generics)
타입을 마치 함수의 인자처럼 받아서, 재사용성 높은 컴포넌트나 함수를 만들 수 있습니다.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);
```

### 5. 유틸리티 타입
이미 정의된 타입을 변환할 때 사용하는 내장 타입들입니다.
- `Partial<T>`: 모든 프로퍼티를 선택적으로 만듭니다.
- `Pick<T, K>`: 특정 프로퍼티만 선택합니다.
- `Omit<T, K>`: 특정 프로퍼티를 제외합니다.

```typescript
interface Post {
  title: string;
  description: string;
  views: number;
}

type PostPreview = Pick<Post, "title" | "description">;
```

TypeScript는 초기 학습 곡선이 있지만, 도입하고 나면 JavaScript로 돌아가기 힘들 정도로 개발 경험(DX)을 크게 향상시킵니다.
