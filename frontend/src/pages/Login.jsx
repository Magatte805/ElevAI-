import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import './styles/login.css'; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!username || !password) {
      setError("Veuillez saisir votre nom d'utilisateur et mot de passe.");
      return;
    }

    try {
      const res = await login(username, password);
      if (res?.token && res?.userId) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        navigate("/add-entry");
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect.");
      }
    } catch (err) {
      if (err.message.includes("Utilisateur inexistant")) {
        setError("Pas encore de compte ? Veuillez vous inscrire.");
      } else if (err.message.includes("Mot de passe incorrect")) {
        setError("Mot de passe incorrect.");
      } else {
        setError("Erreur serveur ou réseau.");
      }
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Connexion</h2>
        {error && <p className="error-message">{error}</p>}

        {error.includes("inscrire") && (
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="signup-btn"
          >
            S’inscrire
          </button>
        )}

        <input
          placeholder="Nom d'utilisateur"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn">Connexion</button>
      </form>
    </div>
  );
}

export default Login;