import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDailyData } from "../api";
import Header from "../components/header"

function AddEntry() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    date: "",
    sommeil_h: "",
    pas: "",
    sport_min: "",
    calories: "",
    humeur_0_5: "",
    stress_0_5: "",
    fc_repos: "",
  });

  // Redirection si pas connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Récupération de l'userId
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) navigate("/login");
  }, [navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("Aucun utilisateur trouvé, retourne au profil.");
      return;
    }

    const payload = { ...form, user_id: Number(userId) };

    try {
      await addDailyData(payload);
      setMessage("Données enregistrées ✅");
      setForm({
        date: "",
        sommeil_h: "",
        pas: "",
        sport_min: "",
        calories: "",
        humeur_0_5: "",
        stress_0_5: "",
        fc_repos: "",
      });
    } catch (err) {
      setMessage("Erreur lors de l'enregistrement (backend ?).");
    }
  }

  return (
    <div>
      <Header />

      <h2>Ajouter une journée</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

        <label>
          Sommeil (h)
          <input type="number" step="0.1" name="sommeil_h" value={form.sommeil_h} onChange={handleChange} required />
        </label>

        <label>
          Pas
          <input type="number" name="pas" value={form.pas} onChange={handleChange} required />
        </label>

        <label>
          Sport (min)
          <input type="number" name="sport_min" value={form.sport_min} onChange={handleChange} required />
        </label>

        <label>
          Calories
          <input type="number" name="calories" value={form.calories} onChange={handleChange} required />
        </label>

        <label>
          Humeur (0–5)
          <input type="number" min="0" max="5" name="humeur_0_5" value={form.humeur_0_5} onChange={handleChange} required />
        </label>

        <label>
          Stress (0–5)
          <input type="number" min="0" max="5" name="stress_0_5" value={form.stress_0_5} onChange={handleChange} required />
        </label>

        <label>
          Fréquence cardiaque au repos
          <input type="number" name="fc_repos" value={form.fc_repos} onChange={handleChange} required />
        </label>

        <button type="submit" data-testid="add-entry-btn">
          Enregistrer la journée
        </button>
      </form>

      {message && <p>{message}</p>}

      <button type="button" className="secondary" onClick={() => navigate("/dashboard")}>
        Aller au Dashboard
      </button>
    </div>
  );
}

export default AddEntry;
