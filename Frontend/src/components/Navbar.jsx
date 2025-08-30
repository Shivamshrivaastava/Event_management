import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg">
            EventMgmt
          </Link>
          <Link to="/events" className="text-sm">
            Events
          </Link>
          {user?.role === "organizer" && (
            <Link to="/my-events" className="text-sm">
              My Events
            </Link>
          )}
          {user?.role === "attendee" && (
            <Link to="/my-registrations" className="text-sm">
              My Registrations
            </Link>
          )}
        </div>
        <div>
          {!user ? (
            <div className="flex gap-2">
              <Link to="/login" className="px-3 py-1 border rounded">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Signup
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm">{user.name}</span>
              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="px-3 py-1 border rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
