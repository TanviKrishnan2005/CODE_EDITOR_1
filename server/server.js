const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://code-editor-1-theta.vercel.app",
  "https://code-editor-sigma-orpin.vercel.app",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const rooms = {};

function detectConcepts(code, language) {
  const concepts = [];

  if (
    /function\s+\w+/.test(code) ||          // JavaScript functions
    /=>/.test(code) ||                      // Arrow functions
    /\b\w+\s+\w+\s*\([^)]*\)\s*\{/.test(code) // C++/Java functions
  ) {
    concepts.push("functions");
  }
  if (/\b(for|while)\b/.test(code)) concepts.push("loops");
  if (/\bif\b|\belse\b|switch\s*\(/.test(code)) concepts.push("conditional logic");
  if (/\bclass\s+\w+/.test(code)) concepts.push("classes / object-oriented programming");
  if (/\basync\b|await\s+|Promise/.test(code)) concepts.push("asynchronous programming");
  if (/fetch\s*\(|axios\./.test(code)) concepts.push("API calls");
  if (/\bmap\s*\(|\bfilter\s*\(|\breduce\s*\(/.test(code)) concepts.push("array methods");
  if (language === "python" && /\bdef\s+\w+/.test(code)) concepts.push("Python functions");
  if (language === "python" && /\bimport\s+/.test(code)) concepts.push("Python modules");
  if (language === "java" && /\bpublic\s+class\b/.test(code)) concepts.push("Java class structure");

  return concepts.length ? concepts : ["basic syntax and program flow"];
}

function buildSuggestions(code, language) {
  const suggestions = [];

  if (!code.includes("//") && !code.includes("#")) {
    suggestions.push("Add 1-2 short comments near important logic so another user can understand it quickly.");
  }
  if (code.length > 600 && !/function\s+\w+|=>|\bdef\s+\w+/.test(code)) {
    suggestions.push("Break long logic into smaller functions to improve readability.");
  }
  if (/console\.log|print\s*\(/.test(code)) {
    suggestions.push("Remove or reduce debug print statements before submitting production code.");
  }
  if (language === "javascript" && /\bvar\b/.test(code)) {
    suggestions.push("Use let or const instead of var for modern JavaScript.");
  }
  if (!/try\s*{|catch\s*\(|except\s+/.test(code) && /fetch\s*\(|axios\.|await\s+|open\s*\(/.test(code)) {
    suggestions.push("Add error handling for API/file operations so failures are handled gracefully.");
  }

  return suggestions.length ? suggestions : ["The code is readable. Next, test it with edge cases and add clear variable names."];
}

function explainCode(code, language) {
  const trimmed = code.trim();
  const lineCount = trimmed ? trimmed.split(/\r?\n/).length : 0;
  const concepts = detectConcepts(trimmed, language);
  const suggestions = buildSuggestions(trimmed, language);

  if (!trimmed) {
    return {
      summary: "No code was provided to explain.",
      concepts: [],
      suggestions: ["Write or paste some code in the editor, then click Explain Code again."],
    };
  }

  return {
    summary: `This ${language} snippet has ${lineCount} line${lineCount === 1 ? "" : "s"} and mainly uses ${concepts.join(", ")}.`,
    concepts,
    suggestions,
  };
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/explain-code", (req, res) => {
  const { code = "", language = "javascript" } = req.body || {};

  if (typeof code !== "string" || typeof language !== "string") {
    return res.status(400).json({ error: "Code and language must be text values." });
  }

  return res.json(explainCode(code, language));
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];

    const exists = rooms[roomId].some(user => user.id === socket.id);

    if (!exists) {
      rooms[roomId].push({ id: socket.id, username });
    }

    io.to(roomId).emit("room_users", rooms[roomId]);
  });

  socket.on("code_change", ({ roomId, code }) => {
    socket.to(roomId).emit("receive_code", code);
  });

  socket.on("send_message", ({ roomId, message, username }) => {
    io.to(roomId).emit("receive_message", { message, username });
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(
        user => user.id !== socket.id
      );

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit("room_users", rooms[roomId]);
      }
    }

    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
