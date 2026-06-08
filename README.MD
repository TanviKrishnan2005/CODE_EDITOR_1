# CodeCollab

CodeCollab is a real-time collaborative code editor built with React, Monaco Editor, Express, and Socket.IO. Users can join a shared room, write code together, chat in real time, view active collaborators, and generate beginner-friendly explanations for the current code.

## Live Demo

Frontend: https://code-editor-sigma-orpin.vercel.app  
Backend: https://code-editor-1-4o1v.onrender.com

## Highlights

- Real-time collaborative editing with room-based sessions
- Monaco-powered editor experience with syntax highlighting
- Built-in chat for every room
- Active user list that updates as users join and leave
- Language selector for JavaScript, Python, C++, and Java
- Local code and language persistence with `localStorage`
- Code Explanation Assistant with summaries, detected concepts, and improvement ideas
- Express API with health and code explanation endpoints
- Socket.IO backend for low-latency collaboration events
- Deployment-ready client and server configuration

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, Monaco Editor |
| Backend | Node.js, Express.js |
| Real-time | Socket.IO, WebSockets |
| Storage | Browser `localStorage`, in-memory room state |
| Deployment | Vercel frontend, Render backend |

## Project Structure

```text
code_editor-main/
+-- client/
|   +-- src/
|   |   +-- components/
|   |   |   +-- Chat.jsx
|   |   |   +-- CodeEditor.jsx
|   |   |   +-- Users.jsx
|   |   +-- pages/
|   |   |   +-- EditorPage.jsx
|   |   |   +-- Home.jsx
|   |   +-- socket.js
|   |   +-- App.jsx
|   |   +-- main.jsx
|   +-- .env.example
|   +-- package.json
|   +-- vite.config.js
+-- server/
|   +-- .env.example
|   +-- package.json
|   +-- server.js
+-- README.MD
```

## How It Works

1. A user enters a username and room ID on the home page.
2. The client connects to the backend through Socket.IO.
3. The backend places users with the same room ID into the same Socket.IO room.
4. Code changes are emitted to other users in that room.
5. Chat messages are broadcast to everyone in the room.
6. Active users are tracked by the backend and pushed to connected clients.
7. When the user clicks `Explain Code`, the frontend sends the current code and language to the Express API.
8. The backend returns a readable summary, detected programming concepts, and improvement suggestions.

## Features

### Collaborative Editor

CodeCollab uses Monaco Editor, the same editor engine behind VS Code, to provide a familiar coding interface. Edits are synchronized live across users in the same room.

### Room-Based Sessions

Each room is isolated by its room ID. Users who join the same room can collaborate together without affecting other rooms.

### Real-Time Chat

Every room includes a chat panel so collaborators can discuss code while editing.

### Active Users

The backend keeps track of connected users per room and updates the UI whenever someone joins or disconnects.

### Code Explanation Assistant

The Explain Code feature analyzes the current editor content and returns:

- A short summary of the snippet
- Concepts used in the code
- Practical improvement suggestions

This currently uses backend rule-based analysis, which keeps the feature fast and API-key-free.

## Local Setup

### Prerequisites

- Node.js 18 or newer
- npm

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd code_editor-main
```

### 2. Start the Backend

```bash
cd server
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Environment Variables

### Client

Create `client/.env` when you need to point the frontend to a different backend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

If this value is not set, the app uses `http://localhost:5000` in development and the deployed Render backend in production.

### Server

Create `server/.env` if you need to customize the backend:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

`CLIENT_ORIGIN` should match the deployed frontend URL when hosting the project.

## Available Scripts

### Client

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production frontend |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Server

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Express and Socket.IO server |
| `npm start` | Start the production server |

## API Reference

### Health Check

```http
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

### Explain Code

```http
POST /api/explain-code
Content-Type: application/json
```

Request body:

```json
{
  "code": "const total = prices.reduce((sum, price) => sum + price, 0);",
  "language": "javascript"
}
```

Response:

```json
{
  "summary": "This javascript snippet has 1 line and mainly uses array methods.",
  "concepts": ["array methods"],
  "suggestions": ["The code is readable. Next, test it with edge cases and add clear variable names."]
}
```

## Socket Events

| Event | Direction | Purpose |
| --- | --- | --- |
| `join_room` | Client to server | Join a room with a room ID and username |
| `room_users` | Server to client | Send the current active user list |
| `code_change` | Client to server | Send editor changes to the room |
| `receive_code` | Server to client | Receive code changes from another user |
| `send_message` | Client to server | Send a chat message |
| `receive_message` | Server to client | Receive a chat message |

## Deployment Notes

### Frontend on Vercel

Set the client root to `client` and add:

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

### Backend on Render

Set the server root to `server` and use:

```bash
npm start
```

Add:

```env
CLIENT_ORIGIN=https://your-vercel-frontend-url.vercel.app
```

This is required so browser requests and Socket.IO connections are allowed by CORS.

## Current Limitations

- Room data is stored in memory, so it resets when the backend restarts.
- Code persistence is stored in each user's browser through `localStorage`.
- The Code Explanation Assistant is rule-based, not connected to a full AI model yet.
- There is no authentication, so usernames are lightweight session labels.

## Roadmap

- Add authentication and user profiles
- Store rooms, messages, and code snapshots in a database
- Add AI-powered code explanation and debugging
- Add code execution support
- Add file tabs for multi-file collaboration
- Add stronger conflict handling for simultaneous edits
- Add shareable room links

## What I Learned

- Building real-time applications with Socket.IO
- Managing room-based collaboration state
- Synchronizing UI state across multiple users
- Integrating Monaco Editor into a React app
- Designing frontend and backend communication with REST and WebSockets
- Handling deployment and CORS issues across Vercel and Render

## Author

Tanvi Lekshmi RM
