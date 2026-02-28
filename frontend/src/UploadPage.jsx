import { useState } from "react";
import axios from "axios";

function UploadPage() {
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          CareerParse Dashboard
        </h1>
        <p className="text-gray-500">
          AI-Powered Resume Experience Extraction
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Upload Resume
        </h2>

        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded-lg w-full"
          />

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </div>

        {loading && (
          <p className="mt-4 text-blue-600 animate-pulse">
            Processing resume...
          </p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div>
          <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Summary
            </h2>
            <p className="text-gray-700">
              Total Experience:{" "}
              <span className="font-bold">
                {result.total_experience_months} months
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {result.Companies.map((company, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-600"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {company.company_name}
                </h3>

                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Role:</span> {company.role}
                </p>

                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Tenure:</span>{" "}
                  {company.tenure_raw}
                </p>

                <p className="text-gray-600">
                  <span className="font-semibold">Duration:</span>{" "}
                  {company.duration_months} months
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;