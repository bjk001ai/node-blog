---
title: "React 19 Server Actions & Form Status 완벽 활용법"
date: "2026-05-23"
tags: ["react","migration"]
excerpt: "React 19 Server Actions: 클라이언트와 서버의 완벽한 융합 React 19에서는 서버 컴포넌트(RSC) 아키텍처의 강점을 극대화하기 위해 Server Action..."
slug: "react-19-server-actions-form-status"
---

# React 19 Server Actions: 클라이언트와 서버의 완벽한 융합

React 19에서는 서버 컴포넌트(RSC) 아키텍처의 강점을 극대화하기 위해 **Server Actions**가 공식 스펙으로 완벽히 통합되었습니다. 기존의 복잡한 API 엔드포인트 수동 설계와 fetch 기반 상태 관리 대신, 간단한 함수 정의만으로 완벽한 데이터 변형(Mutation)이 가능해졌습니다.

## 1. Server Actions 기본 개념

Server Actions는 비동기 함수 형태로 정의되며, 클라이언트 컴포넌트나 폼 엘리먼트에서 직접 호출할 수 있는 서버 측 로직입니다.

```tsx
// actions.ts (서버 사이드 로직)
'use server';

export async function submitFeedback(formData: FormData) {
  const message = formData.get('message');
  
  // 데이터베이스 저장 로직 수행
  console.log('Server saving message:', message);
  
  return { success: true };
}
```

## 2. useFormStatus와 useActionState 훅

React 19에서는 폼의 로딩 상태나 처리 상태를 관리하기 위해 전용 훅들을 제공합니다.

- **useActionState**: 액션 실행 후의 결과 상태와 펜딩 상태를 한 번에 관리하는 리액트 훅입니다.
- **useFormStatus**: 폼의 부모/자식 관계 하에서 폼 제출 진행 상태를 읽을 수 있게 해줍니다.

```tsx
// FeedbackForm.tsx (클라이언트 사이드 로직)
'use client';

import { useActionState } from 'react';
import { submitFeedback } from './actions';

export default function FeedbackForm() {
  const [state, formAction, isPending] = useActionState(submitFeedback, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <textarea name="message" placeholder="피드백을 작성해 주세요" required className="border p-2 rounded" />
      <button type="submit" disabled={isPending} className="bg-blue-600 text-white p-2 rounded">
        {isPending ? '보내는 중...' : '피드백 제출하기'}
      </button>
      {state?.success && <p className="text-green-600">피드백이 성공적으로 제출되었습니다!</p>}
    </form>
  );
}
```

React 19 Server Actions는 상태 관리 보일러플레이트를 혁신적으로 줄여주며, 코드 안정성과 가독성을 획기적으로 개선합니다.
