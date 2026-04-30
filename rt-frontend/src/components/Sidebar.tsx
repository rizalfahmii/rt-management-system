import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 text-white p-5 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">RT Admin</h1>

      <nav className="space-y-2">
        <Link className="block p-2 rounded hover:bg-slate-700" to="/dashboard">
          Dashboard
        </Link>

        <Link className="block p-2 rounded hover:bg-slate-700" to="/residents">
          Residents
        </Link>

        <Link className="block p-2 rounded hover:bg-slate-700" to="/houses">
          Houses
        </Link>

        <Link className="block p-2 rounded hover:bg-slate-700" to="/payments">
          Payments
        </Link>

        <Link className="block p-2 rounded hover:bg-slate-700" to="/expenses">
          Expenses
        </Link>

        <Link className="block p-2 rounded hover:bg-slate-700" to="/reports">
          Reports
        </Link>

        <button
          onClick={logout}
          className="w-full mt-6 bg-red-500 hover:bg-red-600 p-2 rounded"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}