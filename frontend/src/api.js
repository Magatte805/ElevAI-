/*const BASE_URL = "http://localhost:8000";

async function createUser(data) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur création utilisateur");
  return res.json();
}

async function addDailyData(data) {
  const res = await fetch(`${BASE_URL}/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur ajout données");
  return res.json();
}

async function getUserData(userId) {
  const res = await fetch(`${BASE_URL}/data/${userId}`);
  if (!res.ok) throw new Error("Erreur récupération données");
  return res.json();
}

async function getAnalysis(userId) {
  const res = await fetch(`${BASE_URL}/analyze/${userId}`);
  if (!res.ok) throw new Error("Erreur récupération analyse");
  return res.json();
}

export { createUser, addDailyData, getUserData, getAnalysis };
*/

const BASE_URL = "http://localhost:8000";

/* ----------------------------------------------------------
   Helper : tente un fetch, et si ça plante → retourne fake
---------------------------------------------------------- */
async function tryFetch(url, options, fallback) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Backend error");
    return res.json();
  } catch {
    console.warn("⚠️ Backend OFF → using fake data for", url);
    return fallback;
  }
}

/* ----------------------------------------------------------
   1. CREATE USER
---------------------------------------------------------- */
async function createUser(data) {
  return tryFetch(
    `${BASE_URL}/users`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    // FAKE USER RESPONSE
    { id: 1 }
  );
}

/* ----------------------------------------------------------
   2. ADD DAILY DATA
---------------------------------------------------------- */
async function addDailyData(data) {
  return tryFetch(
    `${BASE_URL}/data`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    // FAKE SUCCESS
    { success: true }
  );
}

/* ----------------------------------------------------------
   3. GET USER DATA
---------------------------------------------------------- */
async function getUserData(userId) {
  return tryFetch(
    `${BASE_URL}/data/${userId}`,
    { method: "GET" },
    // FAKE DATASET
    [
      {
        date: "2025-12-01",
        sommeil_h: 7,
        pas: 8000,
        stress_0_5: 2,
        humeur_0_5: 4,
      },
      {
        date: "2025-12-02",
        sommeil_h: 6.5,
        pas: 6000,
        stress_0_5: 3,
        humeur_0_5: 3,
      },
    ]
  );
}

/* ----------------------------------------------------------
   4. GET ANALYSIS
---------------------------------------------------------- */
async function getAnalysis(userId) {
  return tryFetch(
    `${BASE_URL}/analyze/${userId}`,
    { method: "GET" },
    // FAKE ANALYSIS
    {
      score: 78,
      category: "Équilibre correct",
      risk_prediction: "Risque modéré de fatigue",
      recommendations: [
        "Essayez de dormir 30 minutes de plus.",
        "Augmentez légèrement votre activité physique.",
      ],
      radar: [
        { metric: "Sommeil", value: 70 },
        { metric: "Activité", value: 60 },
        { metric: "Stress", value: 40 },
        { metric: "Humeur", value: 80 },
      ],
    }
  );
}

export { createUser, addDailyData, getUserData, getAnalysis };
