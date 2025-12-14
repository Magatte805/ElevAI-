// pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprimer le token et l'userId à la déconnexion
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  }, []);

  const handleReconnect = () => {
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Au revoir et à bientôt ! 👋</h2>
      <button 
        onClick={handleReconnect} 
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Se reconnecter
      </button>
    </div>
  );
}