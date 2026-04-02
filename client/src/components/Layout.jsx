import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { HouseHeart, Plus, NotebookText, ChartArea, LogOut } from "lucide-react"

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <HouseHeart /> },
  { label: "Nytt pass", path: "/workout/new", icon: <Plus /> },
  { label: "Träningslogg", path: "/workouts", icon: <NotebookText /> },
  { label: "Progress", path: "/progress", icon: <ChartArea /> },
];

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

 const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 group ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400"
        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100" 
    }`;

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* sidebar på pc */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-60 bg-zinc-950 border-r border-white/10 p-4">
        <div className="mb-8 px-2">
          <h1 className="font-['Oswald'] text-xl font-bold text-white">
            Pides<span className="text-emerald-400">Gym</span>
          </h1>
          <p className="text-xs text-white mt-0.5">Logga Pass</p>
        </div>

        {/* nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={navLinkClass}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* user/logout */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <p className="text-sm text-emerald-400 px-2 mb-3 truncate">
            {user?.name}
          </p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/10 hover:text-red-400 hover:cursor-pointer transition-colors"
          >
            <span><LogOut /></span>
            <span>Logga ut</span>
          </button>
        </div>
      </aside>

      {/* mobil navbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-800 border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">
          Pides<span className="text-emerald-400">Gym</span>
        </h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-400 hover:text-white text-2xl"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* dropdown mobil */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-zinc-800 border-b border-white/10 p-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-white/10 pt-3 mt-3">
            <p className="text-sm text-emerald-400 px-2 mb-2">{user?.name}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white w-full transition-colors hover:cursor-pointer"
            >
              <span><LogOut /></span>
              <span>Logga ut</span>
            </button>
          </div>
        </div>
      )}

      <main className="lg:ml-60 pt-16 lg:pt-0">{children}</main>
    </div>
  );
};

export default Layout;
