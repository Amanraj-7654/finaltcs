# TechCodeSolution — Backend UML Class Diagram

> **Stack:** Spring Boot · Spring Security (JWT) · JPA/Hibernate · MySQL
>
> **Package root:** `com.cfs.TechCodesolution`

---

## Full Class Diagram

```mermaid
classDiagram

    %% ─────────────────────────────────────────────
    %% ENUMS
    %% ─────────────────────────────────────────────

    class Role {
        <<enumeration>>
        ROLE_USER
        ROLE_ADMIN
    }

    %% ─────────────────────────────────────────────
    %% MODELS  (JPA Entities)
    %% ─────────────────────────────────────────────

    class User {
        <<Entity>>
        -Long id
        -String username
        -String email
        -String password
        -Role role
        -LocalDateTime createdAt
    }

    class Question {
        <<Entity>>
        -Long id
        -String title
        -String description
        -String difficulty
        -String type
        -String testCases
        -String hiddenTestCases
    }

    class TestCase {
        <<Entity>>
        -Long id
        -Question question
        -String input
        -String expectedOutput
        -boolean hidden
    }

    class Submission {
        <<Entity>>
        -Long id
        -User user
        -Question question
        -String code
        -String language
        -String status
        -String verdict
        -String runtime
        -Integer memory
        -Integer passedCount
        -Integer totalCount
    }

    class Contest {
        <<Entity>>
        -Long id
        -String title
        -LocalDateTime startTime
        -LocalDateTime endTime
        -List~Question~ questions
    }

    class Roadmap {
        <<Entity>>
        -Long id
        -String title
        -String description
        -String pdfPath
    }

    %% ─────────────────────────────────────────────
    %% SERVICES
    %% ─────────────────────────────────────────────

    class CodeExecutionService {
        <<Service>>
        -ObjectMapper objectMapper
        +execute(String,int,String) JsonNode
        +evaluateAgainstTestCases(String,int,List~TestCase~) VerdictResult
        -getMockJsonResponse() JsonNode
    }

    class TestCaseService {
        <<Service>>
        +addTestCase(Long,TestCaseDTO) TestCase
        +getPublicTestCases(Long) List~TestCase~
        +getHiddenTestCases(Long) List~TestCase~
    }

    %% ─────────────────────────────────────────────
    %% RELATIONSHIPS
    %% ─────────────────────────────────────────────

    User "1" --> "1" Role : has
    Submission "many" --> "1" User : submitted by
    Submission "many" --> "1" Question : evaluates
    TestCase "many" --> "1" Question : belongs to
    Contest "many" ..> "many" Question : contest_questions

    SubmissionController --> CodeExecutionService : executes code
    CodeExecutionService ..> VerdictResult : produces
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signin` | Public | Login, returns JWT |
| `POST` | `/api/auth/signup` | Public | Register new user |
| `GET` | `/api/questions` | Public | List all questions |
| `POST` | `/api/submissions/run` | Auth | Run code (Mock) |
| `POST` | `/api/submissions/submit/{qId}` | Auth | Submit & Evaluate (Mock) |
| `GET` | `/api/roadmaps` | Auth | List roadmaps |
| `GET` | `/api/admin/users` | ADMIN | List all users |
