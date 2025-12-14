// Moyenne mobile simple sur N derniers jours
export function predictNext7Days(scores, window = 3) {
  if (!scores || scores.length === 0) return Array(7).fill(0);

  const predictions = [];
  let tempScores = [...scores];

  for (let i = 0; i < 7; i++) {
    const lastScores = tempScores.slice(-window);
    const avg = lastScores.reduce((a, b) => a + b, 0) / lastScores.length;
    predictions.push(Math.round(avg));
    tempScores.push(avg); 
  }

  return predictions;
}
