# CodeCollab - Real-Time Collaborative Code Editor

CodeCollab is a real-time collaborative coding platform where users can join a room, write code together, chat, and see active users live.

## Live Demo

Frontend: https://code-editor-sigma-orpin.vercel.app

## Key Features

- Room-based collaborative code editor
- Real-time code synchronization using Socket.io
- Built-in chat with usernames
- Active users list for each room
- Multi-language editor support: JavaScript, Python, C++, Java
- Code and chat persistence using localStorage
- Code Explanation Assistant for beginner-friendly code summaries and improvement suggestions
- Deployed frontend and backend

## Tech Stack

- Frontend: React, Vite, Monaco Editor
- Backend: Node.js, Express.js
- Real-time: Socket.io, WebSockets
- Deployment: Vercel frontend, Render backend

## How It Works

1. User enters a room ID and username.
2. Frontend connects to the backend using Socket.io.
3. Users in the same room receive live code updates.
4. Chat messages and active user lists update in real time.
5. The code explanation endpoint analyses the current editor code and returns a simple explanation, concepts used, and improvement ideas.

## Local Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Create `client/.env` if the backend URL is different:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

## What I Learned

- Building real-time applications with Socket.io
- Designing room-based collaboration
- Managing frontend state for live updates
- Handling deployment issues on Vercel and Render
- Adding a simple code-assistant feature to improve the learning experience

## Future Improvements

- Connect the code explanation feature to a real AI API
- Add user authentication
- Add cloud database storage for rooms
- Add code execution support
- Add stronger conflict handling for simultaneous edits

## Author

Tanvi Lekshmi RM
