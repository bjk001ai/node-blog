---
title: "Sass (SCSS) 핵심 문법 및 활용법"
date: "2026-05-23"
tags: ["programming","migration"]
excerpt: "Sass (Syntactically Awesome Style Sheets) Sass는 CSS의 확장 언어로, 변수, 중첩(Nesting), 믹스인(Mixin), 상속 등의 강력한 ..."
slug: "sass-scss"
---

# Sass (Syntactically Awesome Style Sheets)

Sass는 CSS의 확장 언어로, 변수, 중첩(Nesting), 믹스인(Mixin), 상속 등의 강력한 기능을 제공하여 CSS 코드를 훨씬 간결하고 유지보수하기 쉽게 만들어주는 전처리기(Preprocessor)입니다. SCSS는 Sass의 3버전에서 등장한 문법으로, 기존 CSS와 완벽하게 호환되어 가장 널리 사용됩니다.

## 1. 변수 (Variables)

자주 사용하는 색상이나 폰트 크기 등을 변수로 선언하여 재사용할 수 있습니다. `$` 기호를 사용합니다.

```scss
$primary-color: #3498db;
$font-stack: Helvetica, sans-serif;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

## 2. 중첩 (Nesting)

HTML의 구조와 동일하게 CSS 선택자를 중첩하여 작성할 수 있어 코드의 가독성이 크게 향상됩니다.

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
    
    // &는 부모 선택자(a)를 참조합니다.
    &:hover {
      color: red;
    }
  }
}
```

## 3. 믹스인 (Mixins)

반복되는 CSS 패턴을 함수처럼 정의해두고 필요할 때 불러와서 사용할 수 있습니다. 인자를 전달받을 수도 있어 매우 유용합니다.

```scss
@mixin transform($property) {
  -webkit-transform: $property;
  -ms-transform: $property;
  transform: $property;
}

.box {
  @include transform(rotate(30deg));
}
```

## 4. 확장/상속 (Extend/Inheritance)

특정 선택자의 모든 스타일 속성을 다른 선택자가 상속받도록 할 수 있습니다.

```scss
.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  @extend .message;
  border-color: green;
}

.error {
  @extend .message;
  border-color: red;
}
```

## 5. 연산자 (Operators)

CSS 내에서 기본 수학 연산(+, -, *, /, %)을 수행할 수 있습니다.

```scss
.container {
  width: 100%;
}

article[role="main"] {
  float: left;
  width: 600px / 960px * 100%; // 너비 비율 계산
}
```

Sass를 도입하면 방대한 양의 CSS 코드도 모듈화하고 체계적으로 관리할 수 있어 프론트엔드 개발의 생산성이 비약적으로 상승합니다.
