---

# 📂 Explorer Web

A full-stack web application mimicking Windows Explorer.

## 🏗 Tech Stack

- **Backend:** Bun, ElysiaJS, Drizzle ORM, PostgreSQL
- **Frontend:** Vue 3, TypeScript

---

## 🚀 1. Prerequisites

Ensure you have the following installed on your machine:

- [Bun](https://bun.sh/) (v1.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)

---

## 🛠 2. Installation

Since this is a monorepo, you only need to run commands from the root folder.

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd explorer-web
    ```

2.  **Install dependencies:**
    This command installs dependencies for both the frontend and backend simultaneously (hoisted to the root).

    ```bash
    bun install
    ```

---

## 🗄 3. Database Setup

### A. Environment Variables

Create a `.env` file in **`backend/.env`**.

```env
# backend/.env
# Note: Ensure the database name ('explorer') matches what you create in Step B
DATABASE_URL=postgres://postgres:postgres@localhost:5432/explorer
PORT=3000
```

### B. Database Initialization

Before running migrations, ensure your PostgreSQL database exists and has the required extensions.

1.  Open your database manager or terminal.
2.  Create a database named `explorer`.
3.  Run this SQL inside that database:
    ```sql
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    ```

### C. Run Migrations

Use the following commands from the **root** folder to apply the schema.

```bash
# 1. Generate SQL migration files
bun backend:generate

# 2. Apply changes to the database
bun backend:migrate

# 3. Data seeding (optional - adds dummy folders/files)
bun backend:seed
```

> **Tip:** You can perform other CRUD operations manually using the **Swagger Docs** at `http://localhost:3000/swagger`.

---

## 🖥 4. Running the Application

You can run both apps simultaneously in separate terminals.

### Start Backend

Runs the Elysia API server.

```bash
bun dev:backend
```

- **API URL:** `http://localhost:3000`
- **Swagger Docs:** `http://localhost:3000/swagger`

### Start Frontend

Runs the Vue 3 development server.

```bash
bun dev:frontend
```

- **UI URL:** `http://localhost:5173` (Check terminal for exact port)

---

## 🧪 5. Backend Testing Guide

The backend uses **Bun's native test runner** for both unit and integration tests.

### 1\. Unit Tests

These tests run in isolation and verify business logic (Services) using mocks. No database connection is required.

**Run from Root:**

```bash
bun backend:unit-test
bun frontend:unit-test
```

### 2\. Integration Tests

These tests require a real database. We use Docker to spin up a clean test instance separate from your development data.

```bash
# Run this once before testing
# ⚠️ Note the path: packages/backend/...
docker-compose -f backend/docker-compose.test.yml up -d
```

- **Port:** `5433`
- **User/Pass:** `test_user` / `test_password`

This command uses the inline test environment variables and automatically applies schema migrations to the test database before running.

```bash
bun backend:integration-test
```
