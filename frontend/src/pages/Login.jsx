import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

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
    }catch (err) {
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
    <form onSubmit={handleLogin}>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {error.includes("inscrire") && (
        <button
          type="button"
          onClick={() => navigate("/signup")}
          style={{ marginBottom: "10px" }}
        >
          S’inscrire
        </button>
      )}

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Connexion</button>
    </form>
  );
}

export default Login;