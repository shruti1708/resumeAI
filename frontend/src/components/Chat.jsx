import axios from "axios";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    const newMessages = [...messages, { type: "user", text: question }];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        question,
      });

      setMessages([
        ...newMessages,
        { type: "bot", text: res.data.answer },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { type: "bot", text: "❌ Error getting response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf:
                msg.type === "user" ? "flex-end" : "flex-start",
              background:
                msg.type === "user" ? "#2563eb" : "#e5e7eb",
              color: msg.type === "user" ? "#fff" : "#000",
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && <p>Typing...</p>}
      </div>

      <div style={styles.inputArea}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
          style={styles.input}
        />
        <button onClick={askQuestion} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  chatBox: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
  },
  button: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
// import axios from "axios";
// import { useState } from "react";

// export default function Chat() {
//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState([]);

//   const askQuestion = async () => {
//     const res = await axios.post("http://localhost:8000/chat", {
//       question,
//     });

//     setMessages([
//       ...messages,
//       { q: question, a: res.data.answer },
//     ]);

//     setQuestion("");
//   };

//   return (
//     <div>
//       <input
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//       />
//       <button onClick={askQuestion}>Ask</button>

//       {messages.map((m, i) => (
//         <div key={i}>
//           <p><b>Q:</b> {m.q}</p>
//           <p><b>A:</b> {m.a}</p>
//         </div>
//       ))}
//     </div>
//   );
// }