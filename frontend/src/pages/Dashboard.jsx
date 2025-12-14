import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, getAnalysis } from "../api";
import ScoreCard from "../components/ScoreCard";
import RadarCard from "../components/RadarCard";
import Header from "../components/header"; 
import { predictNext7Days } from "../utils/predictions";

// Transforme le nom d'une feature en texte lisible
function describeFeature(feature, type) {
  switch(feature) {
    case "sommeil_h":
      return type === "faible" ? "Durée du sommeil trop faible" : "Durée du sommeil trop longue";
    case "pas":
      return type === "faible" ? "Nombre de pas trop faible" : "Nombre de pas trop élevé";
    case "sport_min":
      return type === "faible" ? "Minutes de sport trop faibles" : "Minutes de sport trop élevées";
    case "calories":
      return type === "faible" ? "Calories brûlées trop faibles" : "Calories brûlées trop élevées";
    case "humeur_0_5":
      return type === "faible" ? "Humeur anormalement basse" : "Humeur anormalement élevée";
    case "stress_0_5":
      return type === "faible" ? "Stress trop faible" : "Stress trop élevé";
    case "fc_repos":
      return type === "faible" ? "Fréquence cardiaque au repos trop basse" : "Fréquence cardiaque au repos trop élevée";
    default:
      return feature;
  }
}



function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Anomalies
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if (!token || !userId) return;

  async function fetchAnomalies() {
    try {
      const res = await fetch(`http://localhost:8000/analyze/anomalies/${userId}`);
      const data = await res.json();
      setAnomalies(data.anomalies || []);
    } catch (err) {
      console.log("Erreur fetch anomalies :", err);
      setAnomalies([]);
    }
  }

  fetchAnomalies();
}, []);



  // 🔐 Protection route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // 📡 Chargement données
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    async function fetchAll() {
      try {
        setLoading(true);
        const d = await getUserData(userId);
        let a = null;
        try {
          a = await getAnalysis(userId);
          console.log("Analyse reçue :", a);   
        } catch (err) {
          console.log("Erreur getAnalysis :", err); 
          a = null; 
        }

        setData(d || []);
        setAnalysis(a);

        setData(d || []);
        setAnalysis(a || null);
      } catch (err) {
        setError("Erreur lors du chargement du dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [navigate]);

  
  if (loading) return <p>Chargement du dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Valeur par défaut si pas encore d’analyse
  const analysisReady = analysis
  ? {
      score: analysis.score,
      category: analysis.category,
      radar: [
        { metric: "Sommeil", value: Math.round(analysis.explanations.sommeil_h * 100) },
        { metric: "Activité", value: Math.round(analysis.explanations.pas * 100) },
        { metric: "Stress", value: Math.round(analysis.explanations.stress_0_5 ?? 50) }, 
        { metric: "Humeur", value: Math.round(analysis.explanations.humeur_0_5 * 100) },
      ],
      recommendations: analysis.recommendations,
    }
  : {
      score: 77,
      category: "Bon",
      radar: [
        { metric: "Sommeil", value: 80 },
        { metric: "Activité", value: 60 },
        { metric: "Stress", value: 30 },
        { metric: "Humeur", value: 75 },
      ],
      recommendations: ["Bien dormir", "Faire du sport", "Relaxer un peu"],
    };

    // Calculer le score quotidien à partir des données
function calculateDailyScore(row) {
  const sommeilScore = (row.sommeil_h / 8) * 25;         
  const pasScore = (row.pas / 10000) * 25;              
  const stressScore = ((5 - row.stress_0_5) / 5) * 25;   
  const humeurScore = (row.humeur_0_5 / 5) * 25;         
  return Math.round(sommeilScore + pasScore + stressScore + humeurScore);
}

// Scores historiques (derniers 7 jours max)
const historicalScores = data.slice(-7).map(d => calculateDailyScore(d));

// Prédiction 7 jours
const next7DaysPrediction = predictNext7Days(historicalScores);


  return (
    <div style={{ padding: "20px" }}>

       {/* Menu / Header */}
      <Header />
      {/* 🟢 SCORE */}
      <section>
        <ScoreCard
          score={analysisReady.score}
          category={analysisReady.category}
        />
      </section>

     {/* Anomalies */}
      <section style={{ marginTop: "30px" }}>
        <h3>Anomalies détectées</h3>
        {anomalies.length === 0 ? (
          <p>Aucune anomalie sur les 14 derniers jours.</p>
        ) : (
          <ul>
            {anomalies.map((a, i) => (
              <li key={i}>
                <strong>{a.date}</strong> : {a.features.map(f => `${f.feature} ${f.type} (${f.value})`).join(", ")}
              </li>
            ))}
          </ul>
        )}
      </section>


      {/* 🟣 RADAR */}
      <section style={{ marginTop: "30px" }}>
        <h3>Profil global</h3>
        <RadarCard data={analysisReady.radar} />
      </section>

      {/* 📊 TABLE */}
      <section style={{ marginTop: "30px" }}>
        <h3>Données récentes</h3>
        {data.length === 0 ? (
          <p>Aucune donnée pour l’instant.</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sommeil</th>
                <th>Pas</th>
                <th>Stress</th>
                <th>Humeur</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>{row.sommeil_h}</td>
                  <td>{row.pas}</td>
                  <td>{row.stress_0_5}</td>
                  <td>{row.humeur_0_5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Prévision 7 jours */}
      <section style={{ marginTop: "30px" }}>
        <h3>Prévision du score sur 7 jours</h3>
        <ul>
          {next7DaysPrediction.map((score, i) => (
            <li key={i}>Jour {i + 1} : {score}%</li>
          ))}
        </ul>
      </section>

    </div>
  );
}

export default Dashboard;