# TechCodeSolution - User Manual & Installation Guide

## 1. Introduction
Welcome to TechCodeSolution, a comprehensive competitive programming platform. This guide provides step-by-step instructions on how to set up the environment, install the necessary dependencies, and run both the frontend and backend applications locally.

## 2. Prerequisites
Before you begin, ensure you have the following installed on your system:
- **Java Development Kit (JDK):** JDK 21 (or latest compatible version)
- **Node.js & npm:** v18.x or higher
- **Maven:** For building the Spring Boot backend
- **Database:** MySQL or PostgreSQL (depending on your backend configuration)

## 3. Architecture Overview
- **Frontend:** React-based user interface (Vite/CRA)
- **Backend:** Spring Boot RESTful API
- **Database:** Relational database for storing user data, problems, and test cases.

---

## 4. Installation & Setup Guide

### 4.1. Backend Setup (Spring Boot)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure the Database:
   - Create a new database for the application.
   - Update the database credentials (URL, username, password) in `src/main/resources/application.properties` or `application.yml`.
3. Build the project using Maven:
   ```bash
   mvn clean install -DskipTests
   ```
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend server will typically start on `http://localhost:8082`.

### 4.2. Frontend Setup (React)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary NPM dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend application should now be accessible in your browser (usually at `http://localhost:5173`).

---

## 5. User Manual

### 5.1. Registration and Login
- Navigate to the platform's homepage.
- Click on **Register** to create a new account.
- After registering, log in using your credentials.

### 5.2. Exploring Problems
- Go to the **Problems** section to view the list of available coding challenges.

### 5.3. Coding Workspace
- Select your preferred programming language from the dropdown in the editor.
- Write your solution in the editor.

### 5.4. Running and Submitting Code
- **Run Code:** Click the "Run" button to execute your code against the public test cases. The backend will evaluate the submission (Mock Mode enabled).
- **Submit:** Click "Submit" to evaluate your code against all hidden test cases.

### 5.5. Administrator Features
- Admins can create new coding questions and define test cases.

## 6. Troubleshooting
- **Backend Build Failures:** Ensure JDK 21 is properly set in your environment variables.
- **Frontend Blank Screen:** Check the browser console for errors. Ensure the backend API is running and CORS is properly configured.
