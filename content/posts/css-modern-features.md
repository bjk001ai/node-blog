---
title: "현대적인 CSS 테마 시스템 만들기"
date: "2026-05-18"
tags: ["css", "frontend", "design"]
excerpt: "CSS 변수(Custom Properties)를 활용하여 다크모드를 손쉽게 구현하는 방법을 소개합니다."
slug: "modern-css-themes"
---

블로그나 웹사이트에 다크모드를 추가하는 것은 이제 선택이 아닌 필수가 되었습니다. 예전에는 자바스크립트로 클래스를 일일이 교체해야 했지만, 이제는 **CSS 변수(CSS Custom Properties)**와 미디어 쿼리를 사용하면 아주 쉽게 구현할 수 있습니다.

## CSS 변수 정의하기

`:root` 가상 클래스에 색상 변수를 정의합니다. 이것이 기본값(Light Mode)이 됩니다.

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --accent-color: #2563eb;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## 다크모드 미디어 쿼리 적용

OS나 브라우저의 테마 설정을 감지하는 `@media (prefers-color-scheme: dark)`를 활용하여 다크모드일 때 변수 값만 바꿔주면 끝입니다!

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #f5f5f5;
    --accent-color: #60a5fa;
  }
}
```

이제 방문자가 시스템을 다크모드로 전환하면 배경색이 부드럽게 어두운 색으로 바뀌는 것을 볼 수 있습니다. 이 기법은 현재 여러분이 보고 계신 이 블로그에도 완벽하게 적용되어 있답니다! ✨
