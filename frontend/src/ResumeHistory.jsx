import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ResumeHistory() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/resumes")
      .then((res) => setResumes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Resume History
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {resumes.map((resume) => (
          <div
            key={resume.resume_id}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <p className="font-semibold mb-2">
              Resume ID: {resume.resume_id}
            </p>
            <p>
              Total Experience: {resume.total_experience_months} months
            </p>

            <Link
              to={`/resume/${resume.resume_id}`}
              className="text-blue-600 mt-3 inline-block"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeHistory;