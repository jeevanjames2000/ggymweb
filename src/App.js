import { useState } from "react";

import Header from "../src/layout/Header";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Splash from "./Splash";
import History from "./components/History";
import { MyContext } from "./context/MyContext";

const App = () => {
  const [contextValue, setContextValue] = useState("GYM");
  const [id, setId] = useState("");

  const ProtectedRoute = ({ id, children }) => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");
    return id ? children : <Navigate to="/" replace />;
  };
  return (
    <MyContext.Provider value={{ contextValue, setContextValue, id, setId }}>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute id={id}>
                <Header />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute id={id}>
                <History />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/cancelled" element={ />} /> */}
        </Routes>
      </Router>
    </MyContext.Provider>
  );
};

export default App;
