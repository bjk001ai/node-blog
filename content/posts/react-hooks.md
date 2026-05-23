---
title: "React 훅(Hooks)과 최적화 기법"
date: "2026-05-23"
tags: ["programming","migration"]
excerpt: "React Hooks 완벽 마스터 React 16.8에 도입된 훅(Hooks)은 함수형 컴포넌트에서 상태(State)와 생명주기(Lifecycle) 기능을 사용할 수 있게 해주는 ..."
slug: "react-hooks"
---

# React Hooks 완벽 마스터

React 16.8에 도입된 훅(Hooks)은 함수형 컴포넌트에서 상태(State)와 생명주기(Lifecycle) 기능을 사용할 수 있게 해주는 혁신적인 기능입니다.

## 핵심 Hooks 3대장

### 1. useState
가장 기본적인 훅으로, 상태 변수와 이를 업데이트하는 함수를 반환합니다.

```jsx
const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(count + 1)}>
    클릭 횟수: {count}
  </button>
);
```

### 2. useEffect
컴포넌트가 렌더링될 때(Mount), 업데이트될 때(Update), 사라질 때(Unmount) 특정 부수 효과(Side Effect)를 처리합니다. 데이터 패칭에 주로 사용됩니다.

```jsx
useEffect(() => {
  // Mount 및 업데이트 시 실행
  fetchData();
  
  return () => {
    // Unmount 시 실행 (Cleanup 함수)
    cleanup();
  };
}, [dependency]); // 의존성 배열 값이 바뀔 때만 재실행
```

### 3. useRef
렌더링에 영향을 주지 않는 변수를 저장하거나, DOM 요소에 직접 접근할 때 사용합니다.

```jsx
const inputRef = useRef(null);

const focusInput = () => {
  inputRef.current.focus();
};

return <input ref={inputRef} />;
```

---

## 렌더링 최적화 기법 (Memoization)

리액트는 부모 컴포넌트가 리렌더링되면 자식 컴포넌트도 모두 리렌더링됩니다. 불필요한 렌더링을 막기 위한 3가지 도구가 있습니다.

### 1. React.memo
컴포넌트 자체를 메모이제이션합니다. 전달받는 Props가 변하지 않으면 리렌더링을 건너뜁니다.
```jsx
const ChildComponent = React.memo(({ name }) => {
  return <div>{name}</div>;
});
```

### 2. useMemo
비용이 큰 **연산의 결과값**을 기억합니다.
```jsx
// items가 변경되지 않으면 정렬 연산을 다시 하지 않음
const sortedItems = useMemo(() => expensiveSort(items), [items]);
```

### 3. useCallback
생성된 **함수 자체**를 기억합니다. 자식 컴포넌트에 콜백 함수를 Props로 넘길 때 유용합니다.
```jsx
const handleClick = useCallback(() => {
  console.log(userId);
}, [userId]);
```

올바른 훅의 사용과 렌더링 최적화는 쾌적한 UX를 제공하는 리액트 앱의 핵심입니다!
