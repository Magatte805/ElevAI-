import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, getAnalysis } from "../api";
import ScoreCard from "../components/ScoreCard.jsx";
import RadarCard from "../components/RadarCard.jsx";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const radarData = analysis?.radar || [
    { metric: "Sommeil", value: 50 },
    { metric: "Activité", value: 50 },
    { metric: "Stress", value: 50 },
    { metric: "Humeur", value: 50 },
  ];

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

    // Fonction pour choisir l’icône en fonction du texte
  function getIcon(text) {
        const t = text.toLowerCase();

        // Sommeil / fatigue
        if (t.includes("sommeil") || t.includes("dormir") || t.includes("nuit")) {
            return "😴";
        }

        // Stress / détente
        if (t.includes("stress") || t.includes("détente") || t.includes("relax")) {
            return "😌";
        }

        // Activité physique / sport / pas
        if (
            t.includes("activité") ||
            t.includes("physique") ||
            t.includes("sport") ||
            t.includes("marche") ||
            t.includes("pas")
        ) {
            return "🏃‍♂️";
        }

        // Hydratation
        if (t.includes("eau") || t.includes("hydrata")) {
            return "💧";
        }

        // Alimentation / calories
        if (
            t.includes("alimentation") ||
            t.includes("manger") ||
            t.includes("calories") ||
            t.includes("repas")
        ) {
            return "🍎";
        }

        // Humeur
        if (t.includes("humeur") || t.includes("moral")) {
            return "🙂";
        }

        // Par défaut
        return "💡";
        }


  return (
    <div>
      <h2>Dashboard</h2>

      {/* === Bloc 1 : Score global === */}
      <section className="dashboard-block">
        <ScoreCard
          score={analysis?.score}
          category={analysis?.category}
          riskPrediction={analysis?.risk_prediction}
        />
      </section>

      {/* === Bloc 2 : Profil global (Radar) === */}
      <section className="dashboard-block">
        <h3>Profil global</h3>
        <RadarCard data={radarData} />
      </section>

      {/* === Bloc 3 : Recommandations === */}
      <section className="dashboard-block">
        <h3>Recommandations</h3>

        {analysis?.recommendations?.length ? (
            <ul className="recommendation-list">
            {analysis.recommendations.map((r, i) => (
                <li key={i} className="recommendation-item">
                <span className="rec-icon">{getIcon(r)}</span>
                {r}
                </li>
            ))}
            </ul>
        ) : (
            <p>Aucune recommandation pour le moment.</p>
        )}
        </section>


      {/* === Bloc 4 : Données brutes === */}
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
    </div>
  );
}

export default Dashboard;
