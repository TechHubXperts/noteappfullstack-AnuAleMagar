# Note App

A full-stack note-taking application with React frontend and Node.js backend.

## Project Structure

```
note-app/
├── frontend/          # React + Vite frontend application
│   ├── src/          # Frontend source code
│   ├── tests/        # Frontend unit tests (task-level)
│   └── package.json  # Frontend dependencies
├── backend/          # Node.js backend API
│   ├── src/          # Backend source code
│   ├── tests/        # Backend tests
│   └── package.json  # Backend dependencies
└── .github/workflows/# CI/CD workflows
    └── ci.yml        # GitHub Actions CI configuration
```

## Getting Started

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:3000`

## Milestone 1: FRONTEND ONLY

Build a complete frontend-only notes application using React, Vite, and Tailwind CSS. All data will be stored in localStorage.

### Tasks

#### Task 1: Setup and Sidebar Component
**Objective:** Create the basic application structure with a sidebar containing logo, search functionality, and add note button.

**Requirements:**
- Set up React + Vite project with Tailwind CSS
- Create Sidebar component with:
  - App logo and name
  - Search input field
  - "Add Note" button
- Implement basic layout structure

**Test File:** `frontend/tests/task1-sidebar.test.jsx`

#### Task 2: Note List Display
**Objective:** Display a list of notes in the sidebar with selection functionality.

**Requirements:**
- Create NoteList component
- Display notes with title and content preview
- Implement note selection (highlight selected note)
- Show filtered notes based on search query
- Notes should be read-only in the list

**Test File:** `frontend/tests/task2-note-list.test.jsx`

#### Task 3: Note Viewer (Read-Only)
**Objective:** Create a read-only note viewer that displays the full note content.

**Requirements:**
- Create NoteEditor component (read-only)
- Display note title, content, creation date, and last updated date
- Implement delete note functionality
- Handle empty state when no note is selected

**Test File:** `frontend/tests/task3-note-viewer.test.jsx`

#### Task 4: Add Note Modal
**Objective:** Implement a modal form to create new notes with validation.

**Requirements:**
- Create AddNoteModal component
- Form fields: Title (required), Body (500 char limit), Tags, Attachments
- Character counter for body field
- Modal open/close functionality
- Form validation and submission
- Save notes to localStorage

**Test File:** `frontend/tests/task4-add-note-modal.test.jsx`

### Testing Milestone 1

**Frontend Unit Tests:**
```bash
cd frontend
npm test
```

Run tests for specific task:
```bash
# Work on Task 1 → Run:
npm test -- task1-sidebar --run

# Work on Task 2 → Run:
npm test -- task2-note-list --run

# Work on Task 3 → Run:
npm test -- task3-note-viewer --run

# Work on Task 4 → Run:
npm test -- task4-add-note-modal --run
```

**Note:** The `--run` flag runs tests once and exits. Remove it to run in watch mode (auto-reruns on file changes).

## Milestone 2: BACKEND ONLY

Build a RESTful API backend for the notes application using Node.js. All data will be stored in-memory (no database).

### Tasks

#### Task 1: Get All Notes
**Objective:** Implement an API endpoint to retrieve all notes.

**Requirements:**
- Create GET endpoint `/api/Notes`
- Return all notes as JSON array
- Handle empty state (return empty array)

**API Endpoint:** `GET /api/Notes`

**Test File:** `backend/tests/task1-get-notes.test.js`

#### Task 2: Get Individual Note
**Objective:** Implement an API endpoint to retrieve a single note by ID.

**Requirements:**
- Create GET endpoint `/api/Notes/:id`
- Return note object if found
- Return 404 error if note not found
- Validate ID parameter

**API Endpoint:** `GET /api/Notes/:id`

**Test File:** `backend/tests/task2-get-individual-note.test.js`

#### Task 3: Delete Note
**Objective:** Implement an API endpoint to delete a note by ID.

**Requirements:**
- Create DELETE endpoint `/api/Notes/:id`
- Delete note if found
- Return success message
- Return 404 error if note not found
- Validate ID parameter

**API Endpoint:** `DELETE /api/Notes/:id`

**Test File:** `backend/tests/task3-delete-note.test.js`

#### Task 4: Add New Note
**Objective:** Implement an API endpoint to create a new note.

**Requirements:**
- Create POST endpoint `/api/Notes`
- Accept JSON body with: title, content, tags (array), attachments (array)
- Generate unique ID and timestamps (createdAt, updatedAt)
- Return created note object
- Validate required fields (title is required)
- Handle validation errors

**API Endpoint:** `POST /api/Notes`

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content",
  "tags": ["tag1", "tag2"],
  "attachments": ["attachment1"]
}
```

**Test File:** `backend/tests/task4-add-new-note.test.js`

### Testing Milestone 2

**Backend Unit Tests:**
```bash
cd backend
npm test
```

Run tests for specific task (single test file only):
```bash
# Work on Task 1 (GET /api/Notes) → Run:
npm run test:single tests/task1-get-notes.test.js

# Work on Task 2 (GET /api/Notes/:id) → Run:
npm run test:single tests/task2-get-individual-note.test.js

# Work on Task 3 (DELETE /api/Notes/:id) → Run:
npm run test:single tests/task3-delete-note.test.js

# Work on Task 4 (POST /api/Notes) → Run:
npm run test:single tests/task4-add-new-note.test.js
```

**Important:** 
- Use `npm run test:single` for individual test files (runs only that file)
- Do NOT use `npm test --` as it runs ALL test files
- Each test file only tests its specific endpoint as indicated by the filename
- Make sure the backend server is running (`npm run dev`) before running the tests, as they make HTTP requests to `http://localhost:3000`

**Alternative:** You can also use the direct node command:
```bash
node --test tests/task1-get-notes.test.js
```

## Milestone 3: BACKEND + DATABASE

Connect MongoDB Atlas to the backend and migrate from in-memory storage to persistent database storage.

### MongoDB Atlas Setup

Before starting Milestone 3, you need to set up MongoDB Atlas:

1. **Create a MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier is sufficient)

2. **Get Your Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `note-app`)

3. **Set Up Environment Variable:**
   
   **For Local Development:**
   - Create a `.env` file in the `backend/` directory
   - Add: `MONGODB_URI=your_connection_string_here`
   - Make sure `.env` is in `.gitignore` (never commit your connection string!)
   
   **For CI/CD (GitHub Actions):**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Click "Add secret"
   
   This allows GitHub Actions to run database tests in CI.

### Tasks

#### Task 1: MongoDB Connection Setup
**Objective:** Set up connection to MongoDB Atlas.

**Requirements:**
- Install MongoDB driver (mongoose)
- Create database configuration
- Connect to MongoDB Atlas using connection string from environment variable (MONGODB_URI)
- Handle connection errors

**Test File:** `backend/tests/dbTest/task1-mongodb-connection.test.js`

#### Task 2: Note Model/Schema
**Objective:** Create MongoDB schema for notes.

**Requirements:**
- Define Note schema with: title, content, tags (array), attachments (array), createdAt, updatedAt
- Use MongoDB ObjectId for _id
- Add validation (title required)
- Export Note model

**Test File:** `backend/tests/dbTest/task2-note-model.test.js`

#### Task 3: Database CRUD Operations
**Objective:** Update service layer to use MongoDB.

**Requirements:**
- Update `getAllNotes()` to fetch from MongoDB
- Update `getNoteById()` to query MongoDB by _id
- Update `createNote()` to save to MongoDB
- Update `deleteNote()` to delete from MongoDB
- Handle ObjectId conversion
- Maintain same API contract as Milestone 2

**Test File:** `backend/tests/dbTest/task3-database-crud.test.js`

**Note:** API endpoints remain the same as Milestone 2 (`GET /api/Notes`, `GET /api/Notes/:id`, `POST /api/Notes`, `DELETE /api/Notes/:id`). Use environment variable `MONGODB_URI` for connection string.

### Testing Milestone 3

**Backend Database Tests:**
```bash
cd backend
npm test
```

Run tests for specific database task:
```bash
# Work on Task 1 (MongoDB Connection) → Run:
npm run test:single tests/dbTest/task1-mongodb-connection.test.js

# Work on Task 2 (Note Model) → Run:
npm run test:single tests/dbTest/task2-note-model.test.js

# Work on Task 3 (Database CRUD) → Run:
npm run test:single tests/dbTest/task3-database-crud.test.js
```

**Important:** 
- Ensure MongoDB Atlas connection is configured via `MONGODB_URI` environment variable
- Make sure the backend server is running (`npm run dev`) before running the tests
- Milestone 3 tests are in `tests/dbTest/` folder (separate from Milestone 2 tests)

## Milestone 4: FRONTEND + BACKEND INTEGRATION

Integrate the React frontend with the Node.js backend API. Replace localStorage with API calls to the backend, ensuring the UI works with the database-backed API.

### Tasks

#### Task 1: API Service Layer
**Objective:** Create an API service layer in the frontend to communicate with the backend.

**Requirements:**
- Create API service utilities to replace localStorage functions
- Implement functions: `getNotes()`, `getNoteById()`, `createNote()`, `deleteNote()`
- Use `fetch` to make HTTP requests to `http://localhost:3000/api/Notes`
- Handle API errors (network errors, 404, 500, etc.)

**Test File:** `frontend/tests/integrationTest/task1-api-service.test.jsx`

#### Task 2: Update Components to Use API
**Objective:** Update frontend components to use the API service instead of localStorage.

**Requirements:**
- Update `App.jsx` to fetch notes from API on mount
- Update `AddNoteModal` to save notes via API
- Update `NoteEditor` to delete notes via API
- Update `NoteList` to work with API-fetched notes
- Remove localStorage usage

**Test File:** `frontend/tests/integrationTest/task2-components-api.test.jsx`

**Note:** API endpoints: `GET /api/Notes`, `GET /api/Notes/:id`, `POST /api/Notes`, `DELETE /api/Notes/:id`. Frontend should work seamlessly with backend (no localStorage).

### Testing Milestone 4

**Frontend Integration Tests:**
```bash
cd frontend
npm test
```

Run tests for specific integration task:
```bash
# Work on Task 1 (API Service) → Run:
npm test -- task1-api-service --run

# Work on Task 2 (Components API) → Run:
npm test -- task2-components-api --run
```

**Important:** 
- Both frontend and backend servers must be running for Milestone 4 tests
- Make sure MongoDB Atlas connection is configured via `MONGODB_URI` environment variable (for backend)
- Frontend should work seamlessly with backend (no localStorage)

## Running All Tests

### All Frontend Tests
```bash
cd frontend
npm test
```

### All Backend Tests
```bash
cd backend
npm test
```

