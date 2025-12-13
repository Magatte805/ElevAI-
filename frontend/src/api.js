const BASE_URL = "http://localhost:8000";

/* Helper : effectue un fetch vers le backend et gère les erreurs*/

async function fetchBackend(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur backend: ${res.status} ${text}`);
    }
    return res.json();
}
/* 1. Créer un utilisateur */
async function createUser(data) {
    return fetchBackend(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

/* 2.  AJOUTER DES DONNÉES QUOTIDIENNES */
async function addDailyData(data) {
    return fetchBackend(`${BASE_URL}/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

 /* 3. RÉCUPÉRER LES DONNÉES D'UN UTILISATEUR */
async function getUserData(userId) {
    return fetchBackend(`${BASE_URL}/data/${userId}`, {
        method: "GET",
    });
}

/*  4. RÉCUPÉRER L'ANALYSE D'UN UTILISATEUR */
async function getAnalysis(userId) {
    return fetchBackend(`${BASE_URL}/analyze/${userId}`, {
        method: "GET",
    });
}

export { createUser, addDailyData, getUserData, getAnalysis };