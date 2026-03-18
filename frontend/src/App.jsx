import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import ConfigureDashboard from "./pages/ConfigureDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">

        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            {/* LOGO */}
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-black shadow-md">
                HX
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-50">
                  Halleyx Dashboard
                </p>
                <p className="text-xs text-slate-400">
                  Real-time analytics builder
                </p>
              </div>
            </div>

            {/* NAVIGATION */}
            <nav className="flex items-center gap-6 text-sm font-medium">

              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-400 to-pink-400 text-black shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                Orders
              </NavLink>

              <NavLink
                to="/configure-dashboard"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-400 to-red-400 text-black shadow-lg"
                      : "text-orange-300 hover:bg-orange-500/10 hover:text-orange-200"
                  }`
                }
              >
                Configure
              </NavLink>

            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="mx-auto max-w-7xl px-6 py-8 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/configure-dashboard"
              element={<ConfigureDashboard />}
            />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-800 bg-slate-950">
          <div className="mx-auto max-w-7xl px-6 py-4 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Halleyx Dashboard • Built with React,
            Tailwind & Django
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}

export default App;