/**
 * Prévision sur 7 jours avec moyenne mobile
 * @param {number[]} scores 
 * @param {number} window 
 * @returns {number[]} 
 */
export function predictNext7Days(scores, window = 3) {
  const predictions = [];
  const len = scores.length;

  if (len === 0) {
    return Array(7).fill(50); 
  }

  for (let i = 0; i < 7; i++) {
    const start = Math.max(0, len - window + i);
    const end = len + i;
    const slice = scores.slice(start, end);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    predictions.push(Number(avg.toFixed(1)));
  }

  return predictions;
}
