import axios from "axios";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    try {
      if (!file) {
        alert("Please select a file first");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${API_URL}/upload`,
        formData
      );

      alert("✅ File uploaded successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>Upload PDF</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: "15px" }}
      />

      <button onClick={handleUpload} style={styles.button}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {file && <p style={{ marginTop: "10px" }}>📄 {file.name}</p>}
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    maxWidth: "400px",
  },
  button: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

// import axios from "axios";
// import { useState } from "react";

// export default function Upload() {
//   const [file, setFile] = useState(null);

//   const handleUpload = async () => {
//     try {
//       if (!file) {
//         alert("Please select a file first");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await axios.post(
//         "http://localhost:8000/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log(res.data);
//       alert("Uploaded!");
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         onChange={(e) => setFile(e.target.files[0])}
//       />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// }