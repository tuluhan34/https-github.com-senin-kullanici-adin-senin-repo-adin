import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/analytics", label: "Analytics" },
  { to: "/users", label: "Users" },
  { to: "/data", label: "Data" },
  { to: "/settings", label: "Settings" },
  { to: "/logs", label: "Logs" }
];

export default function AppLayout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>Control Panel</h1>
        <p className="muted">{user?.name}</p>
        <nav>
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "") }>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="danger" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <header>
          <h2>{title}</h2>
        </header>
        {children}
      </main>
    </div>
  );
}
