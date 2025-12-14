import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "3rem",
      fontWeight: "bold"
    }}>
      <span className="logo-animate">ElevAI</span>
    </div>
  );
}

export default Splash;