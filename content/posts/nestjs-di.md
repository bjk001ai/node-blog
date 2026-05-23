---
title: "Nest.js 아키텍처와 의존성 주입(DI)"
date: "2026-05-23"
tags: ["programming","migration"]
excerpt: "Node.js 진영의 Spring, Nest.js Nest.js는 효율적이고 확장 가능한 Node.js 서버 측 애플리케이션을 구축하기 위한 프레임워크입니다. Express나 Fa..."
slug: "nestjs-di"
---

# Node.js 진영의 Spring, Nest.js

Nest.js는 효율적이고 확장 가능한 Node.js 서버 측 애플리케이션을 구축하기 위한 프레임워크입니다. Express나 Fastify 위에서 동작하지만, TypeScript를 완벽하게 지원하며 객체 지향 프로그래밍(OOP)과 의존성 주입(DI) 등 체계적인 아키텍처를 제공합니다.

## Nest.js의 핵심 구성 요소

Nest 애플리케이션은 크게 세 가지 주요 요소로 구성됩니다.

### 1. Controller (컨트롤러)
클라이언트로부터 들어오는 HTTP 요청(Request)을 처리하고 응답(Response)을 반환하는 라우팅 역할을 합니다.

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

### 2. Provider / Service (서비스)
비즈니스 로직을 담당합니다. 데이터베이스와 상호작용하거나 외부 API를 호출하는 등의 실제 작업을 수행합니다. `@Injectable()` 데코레이터가 붙습니다.

```typescript
@Injectable()
export class UsersService {
  private users = [];

  findOne(id: string) {
    return this.users.find(user => user.id === id);
  }
}
```

### 3. Module (모듈)
관련된 컨트롤러와 프로바이더를 하나의 단위로 묶어주는 캡슐화 역할을 합니다.
```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

---

## 의존성 주입 (Dependency Injection, DI)

의존성 주입은 Nest.js의 가장 강력한 특징입니다. 클래스 내부에서 직접 사용할 객체(의존성)를 생성(new)하는 것이 아니라, 외부(IoC 컨테이너)에서 생성하여 주입해 주는 방식입니다.

**DI의 장점:**
1. **결합도 감소**: 클래스 간의 의존성이 느슨해져 코드 변경이 쉽습니다.
2. **테스트 용이성**: Service를 Mocking하여 단위 테스트(Unit Test)를 작성하기 매우 쉽습니다.

Nest.js는 Java의 Spring 프레임워크와 유사한 구조를 가지고 있어, 엔터프라이즈급 백엔드 개발에서 폭발적인 인기를 끌고 있습니다.
