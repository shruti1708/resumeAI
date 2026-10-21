import axios from "axios";
import { useRef, useState } from "react";

const API_URL = "http://localhost:8000";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Upload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const pickFile = (picked) => {
    if (!picked) return;
    const isPdf =
      picked.type === "application/pdf" ||
      picked.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setFile(null);
      setStatus("error");
      setMessage("Only PDF files are supported. Choose a .pdf file.");
      return;
    }
    setFile(picked);
    setStatus("idle");
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file || status === "uploading") return;
    setStatus("uploading");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API_URL}/upload`, formData);

      if (res.data?.error) {
        throw new Error(res.data.error);
      }
      setStatus("done");
      setMessage("Uploaded. You can ask questions about it now.");
      if (onUploaded) onUploaded(res.data);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(
        err.response?.data?.detail ||
          err.message ||
          "Upload failed. Check that the backend is running on port 8000."
      );
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setStatus("idle");
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <section className="upl">
      <style>{css}</style>

      <header className="upl-head">
        <h2>Your document</h2>
        <p>Upload a PDF, then ask questions about what's inside.</p>
      </header>

      <div
        className={`upl-drop ${dragging ? "is-drag" : ""} ${file ? "has-file" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Choose a PDF file"
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pickFile(e.dataTransfer.files?.[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(e) => pickFile(e.target.files?.[0])}
        />

        {file ? (
          <div className="upl-file">
            <div className="upl-badge" aria-hidden="true">PDF</div>
            <div className="upl-meta">
              <span className="upl-name" title={file.name}>{file.name}</span>
              <span className="upl-size">{formatSize(file.size)}</span>
            </div>
            <button
              type="button"
              className="upl-remove"
              onClick={clearFile}
              aria-label="Remove file"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="upl-empty">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <strong>Drop a PDF here</strong>
            <span>or click to browse</span>
          </div>
        )}
      </div>

      <button
        type="button"
        className="upl-btn"
        onClick={handleUpload}
        disabled={!file || status === "uploading"}
      >
        {status === "uploading" && <span className="upl-spinner" aria-hidden="true" />}
        {status === "uploading" ? "Uploading" : status === "done" ? "Upload again" : "Upload PDF"}
      </button>

      <p className={`upl-note ${status}`} role="status" aria-live="polite">
        {message}
      </p>
    </section>
  );
}

const css = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700&family=Public+Sans:wght@400;500;600&display=swap");

.upl {
  --ink: #16202e;
  --muted: #5d6b7c;
  --line: #d9e0e8;
  --paper: #f6f8fa;
  --surface: #ffffff;
  --accent: #2b4eff;
  --ok: #1b7f55;
  --bad: #b83232;
  font-family: "Public Sans", system-ui, sans-serif;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 24px;
  max-width: 420px;
  width: 100%;
  box-sizing: border-box;
}
.upl *, .upl *::before, .upl *::after { box-sizing: border-box; }

.upl-head h2 {
  margin: 0 0 6px;
  font-family: "Bricolage Grotesque", "Public Sans", sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.upl-head p {
  margin: 0 0 18px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
}

.upl-drop {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 18px;
  background: var(--paper);
  border: 1.5px dashed #b6c1ce;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.upl-drop:hover { border-color: var(--accent); }
.upl-drop.is-drag { border-color: var(--accent); background: #eaeeff; }
.upl-drop.has-file { border-style: solid; border-color: var(--line); background: var(--surface); cursor: default; }
.upl-drop:focus-visible { outline: 3px solid rgba(43, 78, 255, 0.35); outline-offset: 2px; }

.upl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--muted);
  font-size: 13px;
}
.upl-empty svg { color: var(--accent); margin-bottom: 8px; }
.upl-empty strong { color: var(--ink); font-size: 15px; font-weight: 600; }

.upl-file { display: flex; align-items: center; gap: 14px; width: 100%; }
.upl-badge {
  flex: none;
  width: 44px;
  height: 52px;
  display: grid;
  place-items: center;
  background: var(--ink);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-radius: 6px;
}
.upl-meta { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.upl-name {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upl-size { font-size: 12.5px; color: var(--muted); margin-top: 2px; }
.upl-remove {
  flex: none;
  background: none;
  border: none;
  font: inherit;
  font-size: 13px;
  color: var(--muted);
  text-decoration: underline;
  cursor: pointer;
  padding: 4px;
}
.upl-remove:hover { color: var(--bad); }
.upl-remove:focus-visible { outline: 3px solid rgba(43, 78, 255, 0.35); border-radius: 4px; }

.upl-btn {
  margin-top: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  font: inherit;
  font-size: 14.5px;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  border: none;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.upl-btn:hover:not(:disabled) { background: #1f3fe0; }
.upl-btn:active:not(:disabled) { transform: translateY(1px); }
.upl-btn:disabled { background: #c3cad4; cursor: not-allowed; }
.upl-btn:focus-visible { outline: 3px solid rgba(43, 78, 255, 0.35); outline-offset: 2px; }

.upl-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: upl-spin 0.7s linear infinite;
}
@keyframes upl-spin { to { transform: rotate(360deg); } }

.upl-note { min-height: 20px; margin: 12px 0 0; font-size: 13.5px; line-height: 1.45; }
.upl-note.done { color: var(--ok); }
.upl-note.error { color: var(--bad); }

@media (prefers-reduced-motion: reduce) {
  .upl-spinner { animation-duration: 1.6s; }
  .upl-drop, .upl-btn { transition: none; }
}
`;