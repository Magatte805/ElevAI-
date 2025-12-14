import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function RadarCard({ data }) {
  if (!data || data.length === 0) {
    return <p>Aucune donnée pour le radar.</p>;
  }

  // On ajoute la couleur selon la valeur
  const coloredData = data.map(item => {
    let color = "#FF0000"; 
    if (item.value >= 70) color = "#00C853";
    else if (item.value >= 40) color = "#FFAB00"; 
    return { ...item, color };
  });

  return (
    <div className="radar-card">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={coloredData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <Radar
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
        {coloredData.map((d, i) => (
          <li key={i} style={{ color: d.color }}>
            {d.metric}: {d.value}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RadarCard;