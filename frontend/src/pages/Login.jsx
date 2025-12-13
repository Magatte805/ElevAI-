import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api";

function Login() {
  const [form, setForm] = useState({
    age: "",
    genre: "",
    taille_cm: "",
    poids_kg: "",
    objectif: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await createUser(form);
      const userId = res.id || res.user_id || res.userId;
      localStorage.setItem("userId", userId);
      navigate("/add-entry");
    } catch (err) {
      setError("Impossible de créer le profil (backend ?).");
    }
  }

  return (
    <div>
      <h2>Créer / Modifier mon profil</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Âge
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Genre
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            required
          >
            <option value="">Choisir...</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Autre">Autre</option>
          </select>
        </label>

        <label>
          Taille (cm)
          <input
            type="number"
            name="taille_cm"
            value={form.taille_cm}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Poids (kg)
          <input
            type="number"
            name="poids_kg"
            value={form.poids_kg}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Objectif
          <input
            type="text"
            name="objectif"
            value={form.objectif}
            onChange={handleChange}
            placeholder="Ex: Perdre du poids, mieux dormir..."
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" data-testid="create-profile-btn">
          Enregistrer le profil
        </button>
      </form>
    </div>
  );
}

export default Login;
