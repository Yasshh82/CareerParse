import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [minExperience, setMinExperience] = useState(0);

  const fetchResumes = () => {
    axios
      .get(`http://127.0.0.1:8000/resumes?min_experience=${minExperience}`)
      .then((res) => setResumes(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/resumes/${id}`);
      fetchResumes(); // Refresh list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Resume History
      </h1>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex gap-4 items-center">
        <label className="font-semibold">
          Minimum Experience (months):
        </label>

        <input
          type="number"
          value={minExperience}
          onChange={(e) => setMinExperience(e.target.value)}
          className="border rounded-lg p-2 w-32"
        />

        <button
          onClick={fetchResumes}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Apply Filter
        </button>
      </div>

      {/* Resume List */}
      <div className="grid md:grid-cols-2 gap-6">
        {resumes.map((resume) => (
          <div
            key={resume.resume_id}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <p className="font-semibold mb-2">
              Resume ID: {resume.resume_id}
            </p>

            <p className="mb-4">
              Total Experience: {resume.total_experience_months} months
            </p>

            <div className="flex justify-between items-center">
              <Link
                to={`/resume/${resume.resume_id}`}
                className="text-blue-600"
              >
                View Details →
              </Link>

              <button
                onClick={() => handleDelete(resume.resume_id)}
                className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeHistory;