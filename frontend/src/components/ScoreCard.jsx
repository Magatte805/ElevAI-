import { PieChart, Pie, Cell } from "recharts";

function ScoreCard({ score, category, riskPrediction }) {
  const safeScore = typeof score === "number" ? score : 0;

  // Fonction couleur dynamique
  function getColor(score) {
    if (score >= 80) return "#16a34a";      // vert foncé (excellent)
    if (score >= 60) return "#22c55e";      // vert clair (bon)
    if (score >= 40) return "#eab308";      // jaune (moyen)
    if (score >= 20) return "#f97316";      // orange (faible)
    return "#dc2626";                       // rouge (mauvais)
  }

  const data = [
    { name: "Score", value: safeScore },
    { name: "Reste", value: Math.max(0, 100 - safeScore) },
  ];

  // Couleurs : 1 = partie remplie, 2 = arrière-plan
  const COLORS = [getColor(safeScore), "#e5e7eb"];

  return (
    <div className="score-card">
      <h3>Score global</h3>

      <div className="score-content">
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>

          {/* Affichage central sur une seule ligne */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="score-number"
          >
            {safeScore} / 100
          </text>
        </PieChart>

        <div className="score-details">
          <p className="score-category">
            <strong>Catégorie :</strong> {category ?? "N/A"}
          </p>
          {riskPrediction && (
            <p className="score-risk">
              <strong>Risque :</strong> {riskPrediction}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;
