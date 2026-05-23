---
title: "Zustand를 이용한 가볍고 강력한 React 상태 관리 기법"
date: "2026-05-23"
tags: ["react","migration"]
excerpt: "Zustand: Redux와 Context API를 대체하는 최신 상태 관리 라이브러리 리액트 어플리케이션이 커질수록 글로벌 상태 관리는 필수적입니다. Redux의 과도한 보일러플..."
slug: "zustand-react"
---

# Zustand: Redux와 Context API를 대체하는 최신 상태 관리 라이브러리

리액트 어플리케이션이 커질수록 글로벌 상태 관리는 필수적입니다. Redux의 과도한 보일러플레이트 코드에 지쳤거나 Context API의 리렌더링 비효율성에 직면했다면, **Zustand**가 최고의 정답입니다.

## 1. Zustand를 쓰는 이유

- **보일러플레이트 제로**: 간단한 함수 하나로 스토어를 즉시 선언할 수 있습니다.
- **뛰어난 성능**: 상태의 특정 부분만 구독(selector)하여 불필요한 리렌더링을 차단합니다.
- **번들 크기 최소화**: 단 수 킬로바이트(KB) 수준의 초경량 라이브러리입니다.

---

## 2. Zustand 기본 실습 코드

```ts
import { create } from 'zustand';

// 1. 상태 및 액션 타입을 갖는 스토어 생성
interface CounterState {
  count: number;
  increase: () => void;
  decrease: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));

// 2. 컴포넌트에서 손쉽게 사용
export default function CounterComponent() {
  const { count, increase, decrease } = useCounterStore();
  return (
    <div>
      <h1>개수: {count}</h1>
      <button onClick={increase}>증가</button>
      <button onClick={decrease}>감소</button>
    </div>
  );
}
```

단순하면서도 확장성이 높아 현대 React 프로젝트에서 가장 선호되는 상태 관리 라이브러리 중 하나입니다.
