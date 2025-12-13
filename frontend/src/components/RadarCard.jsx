import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

function RadarCard({ data }) {
  // data attendu : [{ metric: "Sommeil", value: 70 }, { metric: "Stress", value: 30 }, ...]
  if (!data || data.length === 0) {
    return <p>Aucune donnée pour le radar.</p>;
  }

  return (
    <div className="radar-card">
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <Radar dataKey="value" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadarCard;
