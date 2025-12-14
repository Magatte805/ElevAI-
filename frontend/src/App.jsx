import { Routes, Route } from "react-router-dom";
import Splash from "./pages/splash";
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import Logout from "./pages/logout";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/add-entry" element={<AddEntry />} />
      <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}

export default App;