import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="h-16 bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-semibold">
        MyApp
      </Link>
      <div className="space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button onClick={logout} className="border px-3 py-1 rounded hover:bg-blue-700">
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="border px-4 py-1 rounded hover:bg-blue-700">
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
