# Task API Solution

## Overview
Design a minimal Node.js + Express REST API that manages tasks entirely in memory. No database or ORM is used; a process-level array holds all task records, and every endpoint enforces ownership through the `X-User-Id` request header.

## Data Model
- `id` (string, uuid v4): generated per task to uniquely identify it.
- `title` (string): short summary, trimmed, 1–200 chars.
- `description` (string | optional): free-form details, may be omitted.
- `status` (string enum): one of `todo`, `in_progress`, `done`.
- `due_date` (string): ISO 8601 timestamp retained as provided but validated.
- `userId` (string): copied from `X-User-Id`, used for scoping every operation.

## API Design

### POST /tasks
- **Purpose**: Create a task owned by the caller.
- **Method & Path**: `POST /tasks`
- **Headers**: `Content-Type: application/json`, `X-User-Id: <user>`
- **Request Body** (JSON):
  - Required: `title`, `status`, `due_date`
  - Optional: `description`
```json
{
  "title": "Plan sprint backlog",
  "description": "List next sprint stories",
  "status": "todo",
  "due_date": "2024-09-01T12:00:00.000Z"
}
```
- **Success Response**: `201 Created`
```json
{
  "id": "f849653a-0a5a-4f77-9d2c-42d81060df12",
  "title": "Plan sprint backlog",
  "description": "List next sprint stories",
  "status": "todo",
  "due_date": "2024-09-01T12:00:00.000Z",
  "userId": "user_a"
}
```
- **Errors**:
  - `400` missing `X-User-Id` → `{"error":{"code":"MISSING_HEADER","message":"X-User-Id header required"}}`
  - `400` invalid fields → `{"error":{"code":"VALIDATION_ERROR","message":"title, status, and due_date are required"}}`

### GET /tasks
- **Purpose**: List all tasks belonging to the caller.
- **Method & Path**: `GET /tasks`
- **Headers**: `X-User-Id: <user>`
- **Response**: `200 OK`
```json
[
  {
    "id": "f849653a-0a5a-4f77-9d2c-42d81060df12",
    "title": "Plan sprint backlog",
    "description": "List next sprint stories",
    "status": "todo",
    "due_date": "2024-09-01T12:00:00.000Z",
    "userId": "user_a"
  }
]
```
- **Errors**:
  - `400` missing header → `{"error":{"code":"MISSING_HEADER","message":"X-User-Id header required"}}`

### GET /tasks/:id
- **Purpose**: Fetch a single task owned by the caller.
- **Method & Path**: `GET /tasks/:id`
- **Headers**: `X-User-Id: <user>`
- **Params**: `id` path parameter (uuid).
- **Response**: `200 OK` with task JSON (same shape as POST response).
- **Errors**:
  - `400` missing header.
  - `404` not found or owned by different user → `{"error":{"code":"NOT_FOUND","message":"Task not found"}}`.

### PATCH /tasks/:id
- **Purpose**: Partially update a task owned by the caller.
- **Method & Path**: `PATCH /tasks/:id`
- **Headers**: `Content-Type: application/json`, `X-User-Id: <user>`
- **Request Body**: Any subset of `title`, `description`, `status`, `due_date`.
```json
{
  "status": "in_progress",
  "due_date": "2024-09-05T16:30:00.000Z"
}
```
- **Success Response**: `200 OK` with updated task JSON.
- **Errors**:
  - `400` missing header.
  - `400` invalid field values (e.g., non-ISO `due_date`, bad status enum).
  - `404` task not found or owned by another user.

### DELETE /tasks/:id
- **Purpose**: Remove a task owned by the caller.
- **Method & Path**: `DELETE /tasks/:id`
- **Headers**: `X-User-Id: <user>`
- **Response**: `200 OK`
```json
{
  "id": "f849653a-0a5a-4f77-9d2c-42d81060df12",
  "deleted": true
}
```
- **Errors**:
  - `400` missing header.
  - `404` task missing or belongs to another user.

## Validation Rules
- `X-User-Id` header must be present and non-empty on every endpoint.
- `title` is required on create, trimmed, 1–200 chars when present.
- `status` must be `todo`, `in_progress`, or `done`.
- `due_date` must parse as a valid ISO 8601 date string.
- `description`, when provided, must be a string (trim but allow empty).
- Patch requests validate only supplied fields but apply same constraints as create.

## Error Model
All failures return `application/json` shaped as:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable detail"
  }
}
```
Codes include `MISSING_HEADER`, `VALIDATION_ERROR`, `NOT_FOUND`, and `INTERNAL_ERROR` for unexpected faults.

## In-Memory Storage Strategy
- Maintain a module-level array of task objects; each entry follows the Task model.
- Filter tasks by `userId` whenever listing or locating by id to enforce scoping.
- Generate ids via `crypto.randomUUID()` (built-in Node) when creating tasks.
- Updates mutate the stored object in place; deletes remove the entry by array index.
- Since storage is per-process, restarting the server clears all tasks.

## Request Flow
- **POST /tasks**: Read header → validate body/enum/date → create task with generated uuid & header userId → push to array → return 201 JSON.
- **GET /tasks**: Read header → filter array by userId → return list JSON.
- **GET /tasks/:id**: Read header → locate task by id + userId → return JSON or 404.
- **PATCH /tasks/:id**: Read header → find scoped task → validate supplied fields → merge into task → return JSON.
- **DELETE /tasks/:id**: Read header → find scoped task → remove from array → return confirmation JSON.

## curl Examples
```bash
# Create
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user_a" \
  -d '{"title":"Plan sprint","status":"todo","due_date":"2024-09-01T12:00:00.000Z"}'

# List
curl http://localhost:3000/tasks -H "X-User-Id: user_a"

# Get single
curl http://localhost:3000/tasks/f849653a-0a5a-4f77-9d2c-42d81060df12 -H "X-User-Id: user_a"

# Patch
curl -X PATCH http://localhost:3000/tasks/f849653a-0a5a-4f77-9d2c-42d81060df12 \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user_a" \
  -d '{"status":"done"}'

# Delete
curl -X DELETE http://localhost:3000/tasks/f849653a-0a5a-4f77-9d2c-42d81060df12 -H "X-User-Id: user_a"
```

## Minimal File Structure
```
tasks-api/
  server.js          # Express app entry
  routes/
    tasksRouter.js   # Defines CRUD routes and validation helpers
  lib/
    storage.js       # In-memory array helpers (find, list, mutate)
    errors.js        # Error factory/utilities for consistent responses
```

## Run Instructions
- `npm install` within `tasks-api` to pull dependencies (express, uuid/crypto polyfills if needed).
- `npm run dev` (nodemon) for auto-reload during development, or `node server.js` for production-like run.
- Use the curl samples above or REST client to interact locally at `http://localhost:3000`.

## Limitations & Next Steps
- Data resides only in RAM, so restarts lose tasks and there is no horizontal scalability.
- No authentication/authorization beyond trusting `X-User-Id`.
- No pagination, rate limiting, or advanced validation (e.g., max tasks per user).
- Next steps: persist to a database, secure user identity (JWT or session), add structured logging/metrics, implement pagination & filtering, and introduce automated tests for validation and error handling.
