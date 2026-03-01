import { Routes, Route, Link } from "react-router-dom";
import UploadPage from "./UploadPage";
import ResumeHistory from "./ResumeHistory";
import ResumeDetails from "./ResumeDetails";
import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "./ThemeContext";
import { AuthContext } from "./AuthContext";
import Login from "./Login";

function App() {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex items-center justify-between relative">

        {/* Left Navigation */}
        <div className="flex gap-6">
          <Link to="/" className="font-semibold text-blue-600 dark:text-blue-400">
            Upload
          </Link>
          <Link to="/history" className="font-semibold text-blue-600 dark:text-blue-400">
            History
          </Link>
        </div>

        {/* Center Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold">
            CareerParse
          </h1>
        </div>

        {/* Right Profile Section */}
        <div className="flex items-center gap-6 relative" ref={dropdownRef}>

          <button
            onClick={toggleDarkMode}
            className="relative inline-flex items-center h-6 w-14 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none"
            aria-label="Toggle theme"
          >
            <span
              className={`absolute left-1 text-sm transition-colors duration-200 ${darkMode ? "text-gray-500" : "text-yellow-400"
                }`}
            >
              ☀
            </span>
            <span
              className={`absolute right-1 text-sm transition-colors duration-200 ${darkMode ? "text-yellow-400" : "text-gray-500"
                }`}
            >
              🌙
            </span>
            <span
              className={
                "inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 " +
                (darkMode ? "translate-x-8" : "translate-x-1")
              }
            />
          </button>

          {/* Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
            >
              {user.name.charAt(0)}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2">

                <div className="px-4 py-2 border-b dark:border-gray-600">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Page Content */}
      <div>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/history" element={<ResumeHistory />} />
          <Route path="/resume/:id" element={<ResumeDetails />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;