import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardLink = { farmer: "/farmer", owner: "/owner", admin: "/admin" };

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-green-700 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold">Kissan Rent</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/">Machinery</Link>
          {user ? (
            <>
              <Link to={dashboardLink[user.role]}>Dashboard</Link>
              <span className="opacity-80">{user.name}</span>
              <button onClick={() => { logout(); navigate("/"); }} className="rounded bg-white/20 px-3 py-1">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="rounded bg-white px-3 py-1 text-green-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
