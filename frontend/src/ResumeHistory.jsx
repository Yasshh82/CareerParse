import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

function ResumeHistory() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [company, setCompany] = useState(searchParams.get("company") || "");
  const [minExperience, setMinExperience] = useState(
    parseInt(searchParams.get("min")) || 0
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sort") || "desc"
  );

  const [resumes, setResumes] = useState([]);
  const [total, setTotal] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageSize = 6;

  const fetchResumes = () => {
    axios
      .get("http://127.0.0.1:8000/resumes", {
        params: {
          min_experience: minExperience,
          company,
          sort: sortOrder,
          page,
          page_size: pageSize,
        },
      })
      .then((res) => {
        setResumes(res.data.data);
        setTotal(res.data.total);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setSearchParams({
      page,
      company,
      min: minExperience,
      sort: sortOrder,
    });

    fetchResumes();
  }, [page, company, minExperience, sortOrder]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("historyScroll");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll));
    }

    return () => {
      sessionStorage.setItem("historyScroll", window.scrollY);
    };
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  const resetFilters = () => {
    setPage(1);
    setCompany("");
    setMinExperience(0);
    setSortOrder("desc");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white flex">

      {/* Sidebar */}
      <div
        className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64 p-6" : "w-16 items-center py-6"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-6 text-black-600 hover:text-black"
        >
          {sidebarOpen ? "☰" : "☰"}
        </button>

        {sidebarOpen && (
          <>
            <h2 className="text-xl font-bold mb-6">
              Filters
            </h2>

            <div className="space-y-6">

              <div>
                <label className="text-sm font-semibold block mb-2">
                  Minimum Experience
                </label>
                <input
                  type="number"
                  value={minExperience}
                  onChange={(e) => {
                    setPage(1);
                    setMinExperience(e.target.value);
                  }}
                  className="border rounded-lg p-2 w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => {
                    setPage(1);
                    setCompany(e.target.value);
                  }}
                  className="border rounded-lg p-2 w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">
                  Sort By Experience
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setPage(1);
                    setSortOrder(e.target.value);
                  }}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 rounded-lg py-2"
              >
                Reset Filters
              </button>

            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-8">
          Resume History
        </h1>

        {/* Resume Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.resume_id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
            >
              <p className="font-semibold mb-2">
                Resume ID: {resume.resume_id}
              </p>

              <p className="mb-4">
                Total Experience: {resume.total_experience_months} months
              </p>

              <Link
                to={`/resume/${resume.resume_id}`}
                className="text-blue-600"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default ResumeHistory;