# TechCodeSolution — System Diagrams

This document contains the Use Case Diagram, Sequence Diagram, and Activity Diagram for the TechCodeSolution platform.

---

## 1. Use Case Diagram

```mermaid
flowchart LR
    %% Actors
    USER(["👤 User / Student"])
    ADMIN(["🛡️ Admin"])
    
    %% System Boundary
    subgraph TechCodeSolution ["🖥️ TechCodeSolution System"]
        %% User Use Cases
        UC1(["🔐 Register & Login"])
        UC2(["📚 Browse & Search Questions"])
        UC3(["⚡ Run Code (Custom Input)"])
        UC4(["🚀 Submit Code for Evaluation"])
        UC5(["🏆 View & Participate in Contests"])
        UC6(["📊 View Leaderboard"])
        UC7(["🗺️ Download Roadmaps"])
        
        %% Admin Use Cases
        UC8(["📝 Manage Questions (CRUD)"])
        UC9(["🧪 Manage Test Cases"])
        UC10(["📅 Manage Contests"])
        UC11(["📂 Upload Roadmaps"])
        UC12(["👥 Manage Users & Roles"])
    end
    
    %% User Relationships
    USER --> UC1
    USER --> UC2
    USER --> UC3
    USER --> UC4
    USER --> UC5
    USER --> UC6
    USER --> UC7
    
    %% Admin Relationships
    ADMIN --> UC1
    ADMIN --> UC8
    ADMIN --> UC9
    ADMIN --> UC10
    ADMIN --> UC11
    ADMIN --> UC12
```

---

## 2. Sequence Diagram (Code Submission Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 User
    participant React as 🖥️ Frontend (React)
    participant Spring as ⚙️ Backend (Spring Boot)
    participant DB as 🗄️ MySQL Database

    User->>React: Clicks "Submit Code"
    React->>Spring: POST /api/submissions/submit/{questionId}<br/>(JWT Token, code, languageId)
    
    activate Spring
    Spring->>Spring: Validate JWT & Extract Username
    Spring->>DB: Fetch User Entity
    DB-->>Spring: User Details
    
    Spring->>DB: Fetch Question & Test Cases (Public + Hidden)
    DB-->>Spring: List of Test Cases
    
    loop For Each Test Case
        Spring->>Spring: Evaluate Test Case (Mock Mode)
    end
    
    Spring->>Spring: Calculate Final Verdict (ACCEPTED)
    Spring->>DB: Save Submission Result
    DB-->>Spring: Saved Confirmation
    
    Spring-->>React: VerdictResult JSON<br/>(verdict, runtime, passedCount)
    deactivate Spring
    
    React-->>User: Display Verdict & Metrics
```

---

## 3. Activity Diagram (Problem Solving Workflow)

```mermaid
stateDiagram-v2
    direction TB
    
    [*] --> BrowseQuestions : Login & Navigate to Problems
    
    BrowseQuestions --> ReadProblem : Select a Question
    ReadProblem --> WriteCode : Understand Requirements & Constraints
    
    state WriteCode {
        [*] --> EditCode
        EditCode --> RunCustomInput : Click "Run Code"
        RunCustomInput --> EditCode : Review Sample Output
    }
    
    WriteCode --> SubmitCode : Click "Submit Code"
    SubmitCode --> EvaluatePipeline : Send to Backend
    
    state EvaluatePipeline {
        [*] --> FetchTestCases : Load Public & Hidden
        FetchTestCases --> ExecuteTestCases : Mock Evaluation
        ExecuteTestCases --> CheckResult
        
        CheckResult --> FailedEarly : Test Case Failed (Mock Failure)
        CheckResult --> PassedAll : All Test Cases Accepted (AC)
        
        FailedEarly --> [*]
        PassedAll --> [*]
    }
    
    EvaluatePipeline --> DisplayVerdict : Return Execution Result
    
    state DisplayVerdict {
        [*] --> ShowSuccess : Verdict == ACCEPTED
        [*] --> ShowFailure : Verdict != ACCEPTED
    }
    
    ShowFailure --> EditCode : Refine Code & Retry
    ShowSuccess --> BrowseQuestions : Proceed to Next Problem
    
    BrowseQuestions --> [*] : Logout / Exit
```
