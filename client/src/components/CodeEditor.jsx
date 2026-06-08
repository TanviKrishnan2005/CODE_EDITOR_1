import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { API_BASE_URL, socket } from "../socket";

function CodeEditor({ roomId }) {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [explanation, setExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainError, setExplainError] = useState("");

  useEffect(() => {
    const savedCode = localStorage.getItem(roomId);
    const savedLang = localStorage.getItem(roomId + "_lang");

    if (savedCode) setCode(savedCode);
    if (savedLang) setLanguage(savedLang);
  }, [roomId]);

  useEffect(() => {
    socket.on("receive_code", (newCode) => {
      setCode(newCode);
    });

    return () => socket.off("receive_code");
  }, []);

  const handleChange = (value = "") => {
    setCode(value);
    localStorage.setItem(roomId, value);
    socket.emit("code_change", { roomId, code: value });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem(roomId + "_lang", e.target.value);
  };

  const handleExplainCode = async () => {
    setIsExplaining(true);
    setExplainError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/explain-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error("Could not explain this code right now.");
      }

      const data = await response.json();
      setExplanation(data);
    } catch (error) {
      setExplainError(error.message || "Something went wrong.");
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div style={{
      flex: 1,
      padding: "10px",
      background: "#020617",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        minHeight: "34px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "8px"
      }}>
        <select
          value={language}
          onChange={handleLanguageChange}
          style={{
            padding: "4px",
            fontSize: "12px"
          }}
        >
          <option value="javascript">JS</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <button
          onClick={handleExplainCode}
          disabled={isExplaining}
          style={{
            padding: "6px 10px",
            border: "1px solid #38bdf8",
            background: isExplaining ? "#0f172a" : "#0369a1",
            color: "#e0f2fe",
            borderRadius: "6px",
            cursor: isExplaining ? "not-allowed" : "pointer",
            fontSize: "12px"
          }}
        >
          {isExplaining ? "Explaining..." : "Explain Code"}
        </button>
      </div>

      <div style={{
        flex: 1,
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #1e293b"
      }}>
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleChange}
        />
      </div>

      {(explanation || explainError) && (
        <div style={{
          marginTop: "10px",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #1e293b",
          background: "#0f172a",
          color: "#e2e8f0",
          fontSize: "13px",
          lineHeight: "1.5"
        }}>
          <strong>Code Explanation Assistant</strong>

          {explainError && (
            <p style={{ color: "#fca5a5", marginBottom: 0 }}>
              {explainError}
            </p>
          )}

          {explanation && (
            <>
              <p>{explanation.summary}</p>

              <div>
                <strong>Concepts used:</strong>
                <ul>
                  {explanation.concepts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Improvement ideas:</strong>
                <ul>
                  {explanation.suggestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
