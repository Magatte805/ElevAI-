import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './styles/splash.css';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <span className="logo-animate">ElevAI</span>
      <p className="splash-subtitle">Bienvenue chez ElevAI</p>
    </div>
  );
}

export default Splash;