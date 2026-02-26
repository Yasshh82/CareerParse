import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if(!file){
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try{
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
    } catch (error) {
      alert("Upload failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding: "40px", fontFamily: "Arial" }}>
      <h1>CareerParse - Resume Analyser</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} style={{ marginLeft: "10px"}}>
        Upload
      </button> 

      {loading && <p>Processing resume...</p>}

      {result && (
        <div style={{ marginTop: "30px"}}>
          <h2>Total Experience: {result.total_experience_months} months</h2>

          {result.Companies.map((company, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
              >
                <h3>{company.company_name}</h3>
                <p><strong>Role:</strong> {company.role}</p>
                <p><strong>Tenure:</strong> {company.tenure_raw}</p>
                <p><strong>Duration:</strong> {company.duration_months} months</p>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;