# Kanban Board

A full-stack, Trello-style Kanban board.

- **Frontend:** React 18 + Vite, plain CSS (no UI framework), HTML5 drag-and-drop for moving cards between columns.
- **Backend:** Laravel 11 REST API, SQLite database.
- **Features:** create / rename / delete columns, create / edit / delete tasks (cards), drag cards between columns, responsive layout (columns stack on mobile).

```
kanban-board/
├── backend/    Laravel API (SQLite)
├── frontend/   React + Vite SPA
└── README.md
```

## 1. Prerequisites

- PHP >= 8.2 with the `sqlite3` and `pdo_sqlite` extensions enabled
- Composer 2.x
- Node.js >= 18 and npm

## 2. Backend setup (Laravel API)

```bash
cd backend

# Install PHP dependencies
composer install

# Copy the environment file and generate an app key
cp .env.example .env
php artisan key:generate

# Create the SQLite database file (already present as an empty file,
# but this is here in case it's missing or you start from a fresh clone)
touch database/database.sqlite

# Run migrations and seed a starter board (3 columns, a few sample cards)
php artisan migrate --seed

# Start the API server
php artisan serve
```

The API will be available at `http://localhost:8000`, with all endpoints under `/api`.

> By default `config/database.php` points at `database/database.sqlite`. If you'd
> rather use an absolute path, set `DB_DATABASE=/absolute/path/to/database.sqlite`
> in `.env`.

### CORS

`FRONTEND_URL` in `.env` controls which origin(s) are allowed to call the API
(comma-separated). It defaults to `http://localhost:5173`, matching Vite's
default dev server port.

### API endpoints

| Method | Endpoint                      | Description                              |
|--------|--------------------------------|-------------------------------------------|
| GET    | `/api/board`                  | All columns with their tasks, in order    |
| GET    | `/api/columns`                | List columns                              |
| POST   | `/api/columns`                | Create a column `{ title }`               |
| PUT    | `/api/columns/{id}`           | Update a column `{ title?, position? }`   |
| DELETE | `/api/columns/{id}`           | Delete a column (cascades to its tasks)   |
| PATCH  | `/api/columns/{id}/reorder`   | Move a column `{ position }`              |
| GET    | `/api/tasks`                  | List tasks (optional `?column_id=`)       |
| POST   | `/api/tasks`                  | Create a task `{ column_id, title, description? }` |
| PUT    | `/api/tasks/{id}`             | Update a task `{ title?, description?, position? }` |
| DELETE | `/api/tasks/{id}`             | Delete a task                             |
| PATCH  | `/api/tasks/{id}/move`        | Move a task `{ column_id, position }`     |

## 3. Frontend setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`. It reads the API base
URL from `frontend/.env`:

```
VITE_API_URL=http://localhost:8000/api
```

Update this if your backend runs on a different host or port.

### Build for production

```bash
npm run build
```

Output goes to `frontend/dist`, which you can serve with any static file
host (or point Laravel at it if you want a single-server deployment).

## 4. Using the app

- **Add a column:** click "+ Add another column" at the end of the board.
- **Rename a column:** click its title, edit inline, press Enter or click away.
- **Delete a column:** click the ✕ in the column header (this also deletes its cards).
- **Add a card:** click "+ Add a card" inside a column.
- **Edit a card:** click a card to open the edit modal (title + description).
- **Delete a card:** click the ✕ on the card.
- **Move a card:** drag and drop it into another column (or reorder within a column).

## 5. Notes

- The `database/database.sqlite` file is included as an empty placeholder;
  running `migrate --seed` will create the schema and starter data in it.
- No authentication is implemented — this is a single shared board, matching
  the scope of the request. Adding per-user boards would mean introducing a
  `users` table, Sanctum auth, and scoping columns/tasks to a `user_id`.
- Task/column ordering is persisted via a `position` integer column and
  re-sequenced on every move so the order survives a page refresh.
