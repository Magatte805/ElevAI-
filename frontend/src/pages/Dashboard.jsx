import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, getAnalysis } from "../api";
import ScoreCard from "../components/ScoreCard.jsx";
import RadarCard from "../components/RadarCard.jsx";
import { predictNext7Days } from "../utils/predictions.js";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Analyse "ready" pour toujours afficher les blocs
  const analysisReady = analysis || {
    score: 0,
    category: "N/A",
    risk_prediction: "",
    recommendations: ["Aucune recommandation"],
    radar: [
      { metric: "Sommeil", value: 50 },
      { metric: "Activité", value: 50 },
      { metric: "Stress", value: 50 },
      { metric: "Humeur", value: 50 },
    ],
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    async function fetchAll() {
      try {
        setLoading(true);
        const [d, a] = await Promise.all([
          getUserData(userId),
          getAnalysis(userId),
        ]);
        setData(d || []);
        setAnalysis(a || null);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [navigate]);

  function getIcon(text) {
    const t = text.toLowerCase();
    if (t.includes("sommeil") || t.includes("dormir") || t.includes("nuit")) return "😴";
    if (t.includes("stress") || t.includes("détente") || t.includes("relax")) return "😌";
    if (t.includes("activité") || t.includes("physique") || t.includes("sport") || t.includes("marche") || t.includes("pas")) return "🏃‍♂️";
    if (t.includes("eau") || t.includes("hydrata")) return "💧";
    if (t.includes("alimentation") || t.includes("manger") || t.includes("calories") || t.includes("repas")) return "🍎";
    if (t.includes("humeur") || t.includes("moral")) return "🙂";
    return "💡";
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
// === Prévision 7 jours (B2) ===

function calculateDailyScore(row) {
  const sommeilScore = (row.sommeil_h / 8) * 25;         // 0-25
  const pasScore = (row.pas / 10000) * 25;               // 0-25
  const stressScore = ((5 - row.stress_0_5) / 5) * 25;   // 0-25
  const humeurScore = (row.humeur_0_5 / 5) * 25;         // 0-25
  return Math.round(sommeilScore + pasScore + stressScore + humeurScore);
}

const historicalScores = data.slice(-3).map(d => calculateDailyScore(d)); // derniers 3 jours
const next3DaysPrediction = predictNext7Days(historicalScores).slice(0, 3); // on prend juste 3 jours


  return (
    <div>
      <h2>Dashboard</h2>

      {/* === Bloc 1 : Score global + recommandations === */}
      <section className="dashboard-block score-card" data-testid="score-card">
        <ScoreCard
          score={analysisReady.score}
          category={analysisReady.category}
          riskPrediction={analysisReady.risk_prediction}
        />
        <ul className="recommendation-list" data-testid="recommendation-list">
          {analysisReady.recommendations.map((r, i) => (
            <li key={i} className="recommendation-item">{r}</li>
          ))}
        </ul>
      </section>
      {/* === Bloc 2  */}
      <section className="dashboard-block radar-chart" data-testid="radar-chart">
        <h3>Profil global</h3>
        <RadarCard data={analysisReady.radar} />
      </section>

      {/* === Bloc 3 : Données brutes === */}
      <section className="dashboard-block">
        <h3>Données brutes</h3>
        {data.length === 0 ? (
          <p>Aucune donnée pour l’instant.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sommeil (h)</th>
                <th>Pas</th>
                <th>Stress</th>
                <th>Humeur</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
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
       {/* === Bloc 4 : Prévision 7 jours === */}
      <section className="dashboard-block">
        <h3>Prévision du score sur 3 jours</h3>
        <ul>
          {next3DaysPrediction.map((score, i) => (
            <li key={i}>Jour {i + 1} : {score}</li>
          ))}
        </ul>
      </section>


    </div>
  );
 

}

export default Dashboard;