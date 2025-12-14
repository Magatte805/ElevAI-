import { Link, useNavigate } from "react-router-dom";
import './styles/header.css';

export default function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate("/home")}>
        ElevAI
      </div>

      <nav className="header-nav">
        <Link to="/add-entry">Ajouter sa journée</Link>
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={handleLogout}>Déconnexion</button>
      </nav>
    </header>
  );
}