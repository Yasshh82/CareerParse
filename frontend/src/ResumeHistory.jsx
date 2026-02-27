import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [minExperience, setMinExperience] = useState(0);
  const [company, setCompany] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchResumes = () => {
    axios
      .get("http://127.0.0.1:8000/resumes", {
        params: {
          min_experience: minExperience,
          company: company,
          sort: sortOrder
        }
      })
      .then((res) => setResumes(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/resumes/${selectedId}`);
      setShowModal(false);
      fetchResumes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">
        Resume History
      </h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 grid md:grid-cols-4 gap-4">

        <div>
          <label className="text-sm font-semibold">
            Min Experience (months)
          </label>
          <input
            type="number"
            value={minExperience}
            onChange={(e) => setMinExperience(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">
            Company Name
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">
            Sort By Experience
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-lg p-2 w-full"
          >
            <option value="desc">Highest First</option>
            <option value="asc">Lowest First</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchResumes}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Apply Filters
          </button>
        </div>

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
                onClick={() => confirmDelete(resume.resume_id)}
                className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl shadow-lg w-96">

            <h2 className="text-xl font-bold mb-4">
              Confirm Delete
            </h2>

            <p className="mb-6">
              Are you sure you want to delete this resume?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ResumeHistory;