import axios from "axios";
import { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:8000";

const SUGGESTIONS = [
  "Summarize this document",
  "What skills are listed?",
  "Describe the work experience",
];

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const ask = async (text) => {
    const q = text.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { type: "user", text: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, { question: q });

      if (res.data?.error) {
        throw new Error(res.data.error);
      }
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: res.data.answer },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          text: "Couldn't get an answer. Check that the backend is running and a PDF is uploaded, then try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(question);
    }
  };

  return (
    <section className="cht">
      <style>{css}</style>

      <header className="cht-head">
        <h2>Ask your document</h2>
        <p>Answers come from the PDF you uploaded.</p>
      </header>

      <div className="cht-feed" aria-live="polite">
        {messages.length === 0 && !loading && (
          <div className="cht-empty">
            <p>Ask anything about the document, or start with one of these:</p>
            <div className="cht-chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="cht-chip" onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`cht-row ${msg.type === "user" ? "is-user" : "is-bot"}`}>
            <div className={`cht-msg ${msg.type}`}>{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="cht-row is-bot">
            <div className="cht-msg bot cht-typing" aria-label="Claude is typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="cht-compose">
        <textarea
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask a question about the document"
          aria-label="Your question"
        />
        <button
          type="button"
          className="cht-send"
          onClick={() => ask(question)}
          disabled={!question.trim() || loading}
        >
          Send
        </button>
      </div>
    </section>
  );
}

const css = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700&family=Public+Sans:wght@400;500;600&display=swap");

.cht {
  --ink: #16202e;
  --muted: #5d6b7c;
  --line: #d9e0e8;
  --paper: #f6f8fa;
  --surface: #ffffff;
  --accent: #2b4eff;
  --bad: #b83232;
  font-family: "Public Sans", system-ui, sans-serif;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 480px;
  max-height: 100%;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
}
.cht *, .cht *::before, .cht *::after { box-sizing: border-box; }

.cht-head { padding: 20px 24px 16px; border-bottom: 1px solid var(--line); }
.cht-head h2 {
  margin: 0 0 4px;
  font-family: "Bricolage Grotesque", "Public Sans", sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.cht-head p { margin: 0; font-size: 14px; color: var(--muted); }

.cht-feed {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--paper);
}

.cht-empty { margin: auto 0; }
.cht-empty p { margin: 0 0 14px; font-size: 14.5px; color: var(--muted); line-height: 1.5; }
.cht-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.cht-chip {
  font: inherit;
  font-size: 13.5px;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.cht-chip:hover { border-color: var(--accent); color: var(--accent); }
.cht-chip:focus-visible { outline: 3px solid rgba(43, 78, 255, 0.35); outline-offset: 2px; }

.cht-row { display: flex; }
.cht-row.is-user { justify-content: flex-end; }
.cht-row.is-bot { justify-content: flex-start; }

.cht-msg {
  max-width: min(78%, 62ch);
  padding: 11px 15px;
  font-size: 14.5px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.cht-msg.user {
  background: var(--accent);
  color: #fff;
  border-radius: 16px 16px 4px 16px;
}
.cht-msg.bot {
  background: var(--surface);
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: 16px 16px 16px 4px;
}
.cht-msg.error {
  background: #fdf0f0;
  color: var(--bad);
  border: 1px solid #f0c8c8;
  border-radius: 16px 16px 16px 4px;
}

.cht-typing { display: flex; gap: 5px; align-items: center; padding: 14px 16px; }
.cht-typing span {
  width: 7px;
  height: 7px;
  background: #9aa6b5;
  border-radius: 50%;
  animation: cht-bounce 1.1s infinite ease-in-out;
}
.cht-typing span:nth-child(2) { animation-delay: 0.15s; }
.cht-typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes cht-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}

.cht-compose {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid var(--line);
  background: var(--surface);
}
.cht-compose textarea {
  flex: 1;
  resize: none;
  font: inherit;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--ink);
  padding: 11px 14px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 10px;
  max-height: 120px;
}
.cht-compose textarea::placeholder { color: #8895a5; }
.cht-compose textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(43, 78, 255, 0.18); }

.cht-send {
  font: inherit;
  font-size: 14.5px;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  border: none;
  border-radius: 10px;
  padding: 11px 20px;
  cursor: pointer;
  transition: background 0.15s;
}
.cht-send:hover:not(:disabled) { background: #1f3fe0; }
.cht-send:disabled { background: #c3cad4; cursor: not-allowed; }
.cht-send:focus-visible { outline: 3px solid rgba(43, 78, 255, 0.35); outline-offset: 2px; }

@media (max-width: 520px) {
  .cht-head, .cht-feed { padding-left: 16px; padding-right: 16px; }
  .cht-msg { max-width: 88%; }
}
@media (prefers-reduced-motion: reduce) {
  .cht-typing span { animation: none; opacity: 0.8; }
  .cht-chip, .cht-send { transition: none; }
}
`;