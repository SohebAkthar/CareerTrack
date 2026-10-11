# API testing with Thunder Client / Postman

Start the backend after configuring MySQL.

## Health check
GET `http://localhost:8080/api/health`

Expected response:
```json
{"status":"UP","application":"CareerTrack API"}
```

## Create an application
POST `http://localhost:8080/api/applications`
Content-Type: `application/json`
```json
{
  "company": "Infosys",
  "role": "Systems Engineer",
  "location": "Bengaluru",
  "packageLpa": 3.6,
  "status": "APPLIED",
  "appliedDate": "2026-10-10",
  "interviewDate": "2026-10-18",
  "jobUrl": "https://example.com/jobs/123",
  "notes": "Prepare Java and aptitude"
}
```

## List applications
GET `http://localhost:8080/api/applications`

## Filter by status
GET `http://localhost:8080/api/applications?status=APPLIED`

## Get one application
GET `http://localhost:8080/api/applications/1`

## Update
PUT `http://localhost:8080/api/applications/1`
Use the same JSON structure as Create.

## Delete
DELETE `http://localhost:8080/api/applications/1`

Note: This starter API does not yet include authentication. Do not expose it publicly until authentication, authorization, and production configuration are implemented.
