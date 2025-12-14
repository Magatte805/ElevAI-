import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";
import './styles/signup.css'; 

function Signup() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateForm() {
    if (!form.username || form.username.length < 4) {
      setError("Le nom d'utilisateur est obligatoire et doit avoir au moins 4 caractères.");
      return false;
    }

    if (!form.password || form.password.length < 4) {
      setError("Le mot de passe est obligatoire et doit avoir au moins 4 caractères.");
      return false;
    }

    setError("");
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      username: form.username,
      password: form.password,
      age: form.age,
      poids_kg: form.weight,
      taille_cm: form.height,
      genre: form.gender,
      objectif: form.objective
    };

    try {
      const res = await signup(payload);
      if (res?.token && res?.userId) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        navigate("/add-entry");
      } else if (res?.detail) {
        setError(res.detail);
      } else {
        setError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Erreur serveur ou réseau. Veuillez réessayer.");
      }
    }
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Inscription</h2>
        {error && <p className="error-message">{error}</p>}

        <label>
          Username <span className="required">*</span>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mot de passe <span className="required">*</span>
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Âge
          <input name="age" placeholder="Âge" onChange={handleChange} />
        </label>

        <label>
          Poids (kg)
          <input name="weight" placeholder="Poids" onChange={handleChange} />
        </label>

        <label>
          Taille (cm)
          <input name="height" placeholder="Taille" onChange={handleChange} />
        </label>

        <label>
          Genre
          <input name="gender" placeholder="Genre" onChange={handleChange} />
        </label>

        <label>
          Objectif
          <input name="objective" placeholder="Objectif" onChange={handleChange} />
        </label>

        <button type="submit" className="submit-btn">S’inscrire</button>
      </form>
    </div>
  );
}

export default Signup;