import { useNavigate } from "react-router-dom";
import './styles/home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bienvenue sur ElevAI</h1>
      <p className="home-subtitle">
        Suivez vos indicateurs quotidiens et obtenez des recommandations personnalisées.
      </p>
      <div className="home-buttons">
        <button onClick={() => navigate("/login")}>Se connecter</button>
        <button onClick={() => navigate("/signup")}>S’inscrire</button>
      </div>
    </div>
  );
}

export default Home;
