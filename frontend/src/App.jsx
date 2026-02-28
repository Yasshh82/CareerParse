import { Routes, Route, NavLink } from "react-router-dom";
import UploadPage from "./UploadPage";
import ResumeHistory from "./ResumeHistory";
import ResumeDetails from "./ResumeDetails";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import Login from "./Login";

function App() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <Login />;
  }

  const baseStyle =
    "font-semibold px-3 py-2 rounded-md transition-all duration-200";

  const activeStyle =
    "bg-blue-600 text-white shadow";

  const inactiveStyle =
    "text-blue-600 hover:bg-blue-100";

  return (
    <div>
      <div className="flex items-center gap-6">

        <span className="font-semibold">
          {user.name}
        </span>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>
      <nav className="bg-white shadow-md p-4 flex gap-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
          }
        >
          Upload
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
          }
        >
          History
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/history" element={<ResumeHistory />} />
        <Route path="/resume/:id" element={<ResumeDetails />} />
      </Routes>
    </div>
  );
}

export default App;