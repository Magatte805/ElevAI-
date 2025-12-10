import { Link, useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-logo">ElevAI</h1>
          <nav className="app-nav">
            <Link
              to="/login"
              className={
                location.pathname === "/login" ? "nav-link active" : "nav-link"
              }
            >
              Profil
            </Link>
            <Link
              to="/add-entry"
              className={
                location.pathname === "/add-entry"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Saisie
            </Link>
            <Link
              to="/dashboard"
              className={
                location.pathname === "/dashboard"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
