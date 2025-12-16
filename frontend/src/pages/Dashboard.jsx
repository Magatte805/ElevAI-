import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, getAnalysis } from "../api";
import ScoreCard from "../components/ScoreCard";
import RadarCard from "../components/RadarCard";
import Header from "../components/header"; 
import { predictNext7Days } from "../utils/predictions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import './styles/dashboard.css';

function describeFeature(feature, type) {
  switch(feature) {
    case "sommeil_h": return type === "faible" ? "Durée du sommeil trop faible" : "Durée du sommeil trop longue";
    case "pas": return type === "faible" ? "Nombre de pas trop faible" : "Nombre de pas trop élevé";
    case "sport_min": return type === "faible" ? "Minutes de sport trop faibles" : "Minutes de sport trop élevées";
    case "calories": return type === "faible" ? "Calories brûlées trop faibles" : "Calories brûlées trop élevées";
    case "humeur_0_5": return type === "faible" ? "Humeur anormalement basse" : "Humeur anormalement élevée";
    case "stress_0_5": return type === "faible" ? "Stress trop faible" : "Stress trop élevé";
    case "fc_repos": return type === "faible" ? "Fréquence cardiaque au repos trop basse" : "Fréquence cardiaque au repos trop élevée";
    default: return feature;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

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
        try { a = await getAnalysis(userId); } catch {}
        setData(d || []);
        setAnalysis(a || null);
      } catch (err) {
        setError("Erreur lors du chargement du dashboard.");
      } finally { setLoading(false); }
    }
    fetchAll();
  }, [navigate]);

  if (loading) return <p>Chargement du dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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

  function calculateDailyScore(row) {
    const sommeil = Math.min(row.sommeil_h || 0, 12);
    const pas = Math.min(row.pas || 0, 30000);
    const sport = Math.min(row.sport_min || 0, 180);
    const humeur = Math.min(Math.max(row.humeur_0_5 || 0, 0), 5);
    const stress = Math.min(Math.max(row.stress_0_5 || 0, 0), 5);

    const sommeilScore = (sommeil / 8) * 25;         
    const pasScore = (pas / 10000) * 25;              
    const stressScore = ((5 - stress) / 5) * 25;   
    const humeurScore = (humeur / 5) * 25;         

    return Math.round(sommeilScore + pasScore + stressScore + humeurScore);
  }

  const historicalScores = data.slice(-7).map(d => calculateDailyScore(d));
  const next7DaysPrediction = predictNext7Days(historicalScores);

  return (
    <div className="dashboard-container">
      <Header />
      <h1 className="dashboard-title">Bienvenue sur ton Dashboard</h1>

      {/* SCORE */}
      <div className="dashboard-card">
        <ScoreCard score={analysisReady.score} category={analysisReady.category} />
      </div>

      {/* 💡 Recommandations */}
      <div className="dashboard-card recommendations-card">
        <h2 className="card-title">Recommandations personnalisées</h2>

        {analysisReady.recommendations && analysisReady.recommendations.length > 0 ? (
          <ul className="recommendations-list">
            {analysisReady.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        ) : (
          <p>Aucune recommandation disponible pour le moment.</p>
        )}
      </div>

      {/* Radar & 5 derniers scores côte à côte */}
      <div className="card-row">
        {/* RADAR */}
        <div className="dashboard-card card-half">
          <h2 className="card-title">Répartition de vos indicateurs clés</h2>
          <RadarCard data={analysisReady.radar} />
        </div>
        {/* Évolution des scores */}
        <div className="dashboard-card card-half">
          <h2 className="card-title">Évolution des scores récents</h2>

          {historicalScores.length === 0 ? (
            <p>Aucune donnée pour l’instant.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={historicalScores.map((score, idx) => ({
                  jour: `Jour ${idx + 1}`,
                  score,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jour" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6F42C1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      {/* Détection des Anomalies */}
      <div className="dashboard-card">
        <h2 className="card-title">Anomalies détectées</h2>
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
      </div>

      {/* Prévision 7 jours */}
      <div className="dashboard-card">
        <h2 className="card-title">Prévision de vos scores des 7 prochians jours</h2>
        <ul>
          {next7DaysPrediction.map((score, i) => (
            <li key={i}>Jour {i + 1} : {score}%</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;