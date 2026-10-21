import Upload from "./components/Upload";
import Chat from "./components/Chat";

function App() {
  return (
    <div style={styles.container}>
      {/* LEFT PANEL */}
      <div style={styles.left}>
        <h1 style={styles.heading}>📄 AI Document Analyzer</h1>
        <Upload />
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.right}>
        <Chat />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "97vh",
    width: "100%",
    fontFamily: "Inter, sans-serif",
    background: "#f3f4f6",
  },
  left: {
    width: "75%",
    padding: "30px",
    overflowY: "auto",
  },
  right: {
    width: "25%",
    borderLeft: "1px solid #e5e7eb",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    marginBottom: "20px",
  },
};

export default App;