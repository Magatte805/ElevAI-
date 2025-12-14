import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Bienvenue sur ElevAI</h1>

      <button onClick={() => navigate("/Login")} style={{ margin: "10px" }}>
        Se connecter
      </button>

      <button onClick={() => navigate("/signup")} style={{ margin: "10px" }}>
        S’inscrire
      </button>
    </div>
  );
}

export default Home;
