# ER Diagram

Below is the ER diagram (Mermaid) representing the main database tables and relationships inferred from the backend models.

```mermaid
erDiagram
    USERS {
        LONG id PK
        VARCHAR username
        VARCHAR email
        VARCHAR password
        VARCHAR role
        VARCHAR resetToken
        DATETIME resetTokenExpiry
        DATETIME createdAt
    }

    QUESTIONS {
        LONG id PK
        VARCHAR title
        TEXT description
        VARCHAR difficulty
        VARCHAR type
        TEXT testCases
        LONGTEXT hiddenTestCases
        TEXT constraints
        TEXT inputFormat
        TEXT outputFormat
        INT timeLimit
        INT memoryLimit
        VARCHAR tags
        LONGTEXT boilerplates
        LONGTEXT driverCode
        VARCHAR link
    }

    TEST_CASES {
        LONG id PK
        LONG question_id FK
        LONGTEXT input
        LONGTEXT expectedOutput
        BOOLEAN hidden
        TEXT explanation
    }

    SUBMISSIONS {
        LONG id PK
        LONG user_id FK
        LONG question_id FK
        TEXT code
        VARCHAR language
        VARCHAR status
        VARCHAR verdict
        VARCHAR runtime
        INT memory
        INT passedCount
        INT totalCount
        LONG contestId
        DATETIME submittedAt
    }

    CONTESTS {
        LONG id PK
        VARCHAR title
        TEXT description
        DATETIME startTime
        DATETIME endTime
        INT durationMinutes
        BOOLEAN isPublished
    }

    ROADMAPS {
        LONG id PK
        VARCHAR title
        TEXT description
        VARCHAR pdfPath
    }

    -- Relationships
    USERS ||--o{ SUBMISSIONS : "makes"
    QUESTIONS ||--o{ TEST_CASES : "has"
    QUESTIONS ||--o{ SUBMISSIONS : "receives"
    CONTESTS }|--|{ QUESTIONS : "contains"
    SUBMISSIONS }o--|| CONTESTS : "optional link (contestId)"
```

Notes:
- `contestId` in `submissions` is stored as a Long and may be null (standalone submissions).
- `contest_questions` join table implements the many-to-many between `contests` and `questions`.
- Some fields (e.g., `testCases`, `hiddenTestCases`, `boilerplates`) are stored as JSON/LONGTEXT in the DB.
