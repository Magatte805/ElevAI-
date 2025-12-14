import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
  navigate("/logout");
};

  return (
    <header style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      padding: "10px 20px", 
      background: "#eee", 
      alignItems: "center" 
    }}>
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>ElevAI</div>

      <nav style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link to="/add-entry">Ajouter sa journée</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} style={{ cursor: "pointer" }}>Déconnexion</button>
      </nav>
    </header>
  );
}