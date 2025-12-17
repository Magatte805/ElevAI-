import { PieChart, Pie, Cell } from "recharts";

function ScoreCard({ score, category, riskPrediction }) {
  const safeScore = Math.min(Math.max(score || 0, 0), 100);

  function getColor(score) {
    if (score > 75) return "#16a34a";   
    if (score > 50) return "#f97316";  
    if (score > 25) return "#F91673"
    return "#dc2626";                    
  }

  const data = [
    { name: "Score", value: safeScore },
    { name: "Reste", value: 100 - safeScore },
  ];

  const COLORS = [getColor(safeScore), "#e5e7eb"];

  return (
    <div className="score-card">
      <h3>Votre score santé global</h3>

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

          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="score-number"
          >
            {Math.round(safeScore)}%
          </text>

        </PieChart>

        <div className="score-details">
          <p className="score-category">
            <strong>Évaluation globale:</strong> {category ?? "N/A"}
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