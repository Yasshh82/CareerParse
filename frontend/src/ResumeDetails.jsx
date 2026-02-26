import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ResumeDetails() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/resumes/${id}`)
      .then((res) => setResume(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!resume) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Resume Details
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <p className="font-semibold">
          Total Experience: {resume.total_experience_months} months
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {resume.Companies.map((company, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-600"
          >
            <h3 className="text-lg font-bold mb-2">
              {company["Company Name"]}
            </h3>
            <p><strong>Role:</strong> {company.Role}</p>
            <p><strong>Tenure:</strong> {company.Tenure}</p>
            <p><strong>Duration:</strong> {company["Duration Months"]} months</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeDetails;