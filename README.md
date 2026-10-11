# CareerTrack — Smart Job Application & Placement Tracker

A full-stack starter project for students and freshers to manage job applications, interviews, and placement preparation.

## Stack
- Frontend: React + Vite
- Backend: Java 17+, Spring Boot 3, Spring Data JPA, Spring Web
- Database: MySQL
- Authentication: starter currently uses a demo frontend session; backend security/JWT is the next implementation step.

## Project structure
```
CareerTrack/
  frontend/
  backend/
  database/
```

## 1. Database setup
Open MySQL Workbench and run:
```sql
CREATE DATABASE careertrack;
```
Then update `backend/src/main/resources/application.properties` with your MySQL username and password.

## 2. Start the backend
Install JDK 17+ and Maven.
```bash
cd backend
mvn spring-boot:run
```
Backend URL: `http://localhost:8080`
API health check: `http://localhost:8080/api/health`

## 3. Start the frontend
Install Node.js LTS.
```bash
cd frontend
npm install
npm run dev
```
Open the local URL Vite prints (usually `http://localhost:5173`).

## Included features
- Dashboard overview
- Create, edit, and delete job applications
- Track company, role, package, applied date, status, and next interview date
- Placement preparation checklist
- Responsive layout
- Spring Boot REST API backed by MySQL

## Important
This is a working starter, not yet a production-ready deployment. The initial frontend stores data in localStorage so the interface works immediately. The Spring Boot backend includes persistent CRUD endpoints. The next step is connecting the frontend to the backend and implementing real JWT authentication before public deployment.
