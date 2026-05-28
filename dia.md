# TechCodeSolution — Complete Data Flow Diagram (DFD)

> **Stack:** Spring Boot · Spring Security (JWT) · JPA/Hibernate · MySQL · JavaMail · WebSocket

---

## Level 0 — Context Diagram (System Overview)

```mermaid
flowchart TD
    USER(["👤 User / Student"])
    ADMIN(["🛡️ Admin"])
    MAIL(["📧 SMTP\nMail Server"])
    DB[("🗄️ MySQL\nDatabase")]

    USER -->|"Register / Login\nSolve Problems\nView Contests"| SYS["🖥️ TechCodeSolution\nBackend System"]
    ADMIN -->|"Manage Questions\nManage Contests\nManage Test Cases\nManage Users"| SYS
    SYS -->|"JWT Token\nVerdict Results\nLeaderboard Data"| USER
    SYS -->|"Admin Responses\nUser Lists"| ADMIN
    SYS -->|"Welcome Email"| MAIL
    MAIL -->|"Delivered"| USER
    SYS <-->|"Read / Write\nAll Entities"| DB
```

---

## Level 1 — Main Processes

```mermaid
flowchart TD
    %% External Entities
    USER(["👤 User"])
    ADMIN(["🛡️ Admin"])
    MAIL(["📧 SMTP"])
    DB[("🗄️ MySQL DB")]

    %% Processes
    P1(["1.0\n🔐 Authentication\n& Registration"])
    P2(["2.0\n📚 Question\nManagement"])
    P3(["3.0\n⚡ Code Execution\n& Submission"])
    P4(["4.0\n🏆 Contest\nManagement"])
    P5(["5.0\n📊 Leaderboard\nComputation"])
    P6(["6.0\n🗺️ Roadmap\nManagement"])
    P7(["7.0\n👥 User\nManagement"])

    %% User flows
    USER -->|"signup/signin\ncredentials"| P1
    P1 -->|"JWT token + role"| USER
    USER -->|"view questions\nsearch/filter"| P2
    P2 -->|"QuestionPublicDTO\n(no hidden data)"| USER
    USER -->|"code + languageId\n+ stdin"| P3
    P3 -->|"VerdictResult\npassed/total count"| USER
    USER -->|"view contest"| P4
    P4 -->|"contest details\n+ questions"| USER
    USER -->|"view leaderboard"| P5
    P5 -->|"ranked entries"| USER

    %% Admin flows
    ADMIN -->|"create/update/delete\nquestion"| P2
    ADMIN -->|"add/delete\ntest cases"| P3
    ADMIN -->|"create/manage\ncontests"| P4
    ADMIN -->|"upload roadmap PDF"| P6
    ADMIN -->|"update user roles"| P7

    %% External service flows
    P1 -->|"welcome email\n(to + username)"| MAIL

    %% DB flows
    P1 <-->|"users table"| DB
    P2 <-->|"questions table"| DB
    P3 <-->|"submissions table\ntest_cases table"| DB
    P4 <-->|"contests table\ncontest_questions"| DB
    P5 <-->|"submissions table\ncontests table"| DB
    P6 <-->|"roadmaps table\nfile system"| DB
    P7 <-->|"users table"| DB
```

---

## Level 2 — Process 3: Code Execution & Submission

```mermaid
flowchart TD
    USER(["👤 Authenticated User"])
    DB_TC[("🗄️ test_cases table")]
    DB_SUB[("🗄️ submissions table")]
    DB_USR[("🗄️ users table")]
    DB_QST[("🗄️ questions table")]

    subgraph P3 ["3.0 Code Execution & Submission"]
        direction TB
        P3_1["3.1\nRun Code\n(Mock Mode)"]
        P3_2["3.2\nFetch Authenticated User\n(SecurityContext → username)"]
        P3_3["3.3\nFetch Question\n(by questionId)"]
        P3_4["3.4\nFetch Public Test Cases\n(hidden=false)"]
        P3_5["3.5\nFetch Hidden Test Cases\n(hidden=true)"]
        P3_6["3.6\nMerge All Test Cases\n(public + hidden)"]
        P3_7["3.7\nEvaluate Against\nAll Test Cases\n(Mock Evaluation)"]
        P3_8["3.8\nBuild Verdict Result\n(ACCEPTED)"]
        P3_9["3.9\nSave Submission\n(verdict, runtime, memory,\npassedCount, totalCount)"]
        P3_10["3.10\nReturn VerdictResult\nto Frontend"]
    end

    %% Run path
    USER -->|"POST /api/submissions/run\n{code, languageId, stdin}"| P3_1
    P3_1 -->|"raw JsonNode result"| USER

    %% Submit path
    USER -->|"POST /api/submissions/submit/{questionId}\n{code, languageId, contestId?}"| P3_2
    P3_2 -->|"findByUsername()"| DB_USR
    DB_USR -->|"User entity"| P3_2
    P3_2 --> P3_3
    P3_3 -->|"findById(questionId)"| DB_QST
    DB_QST -->|"Question entity"| P3_3
    P3_3 --> P3_4
    P3_4 -->|"findByQuestionIdAndHidden(id, false)"| DB_TC
    DB_TC -->|"List~TestCase~ (public)"| P3_4
    P3_4 --> P3_5
    P3_5 -->|"findByQuestionIdAndHidden(id, true)"| DB_TC
    DB_TC -->|"List~TestCase~ (hidden)"| P3_5
    P3_5 --> P3_6
    P3_6 -->|"merged List~TestCase~"| P3_7
    P3_7 --> P3_8
    P3_8 -->|"VerdictResult"| P3_9
    P3_9 -->|"save(Submission)"| DB_SUB
    P3_9 --> P3_10
    P3_10 -->|"VerdictResult\n{verdict, passedCount,\ntotalCount, runtime, memory}"| USER
```

---

## Data Store Summary

| Data Store | Table / Location | Key Fields | Accessed By |
|---|---|---|---|
| **Users** | `users` | id, username, email, password, role, createdAt | AuthController, UserController, AdminController |
| **Questions** | `questions` | id, title, difficulty, type, testCases, hiddenTestCases, boilerplates, link | QuestionController, SubmissionController |
| **Test Cases** | `test_cases` | id, question_id, input, expectedOutput, hidden | TestCaseController, TestCaseService, SubmissionController |
| **Submissions** | `submissions` | id, user_id, question_id, code, language, verdict, runtime, memory, contestId | SubmissionController, LeaderboardService |
| **Contests** | `contests` | id, title, startTime, endTime, durationMinutes, isPublished | ContestController, LeaderboardService |
| **Roadmaps** | `roadmaps` | id, title, description, pdfPath | RoadmapController |
| **PDF Files** | `uploads/` (filesystem) | UUID filename | FileStorageService |

---

## External System Interfaces

| External System | Protocol | Direction | Data Sent | Data Received |
|---|---|---|---|---|
| **SMTP Mail Server** | SMTP | Outbound | `to`, `subject`, `text` (welcome message) | Delivery status |
| **React Frontend** | HTTP/HTTPS REST | Bidirectional | JSON requests with JWT Bearer token | JSON responses |
| **Browser WebSocket** | WS | Bidirectional | Connection events | Live user count integer |
