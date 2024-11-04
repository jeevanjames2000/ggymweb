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
import { Provider } from "react-redux";
import store from "./store/store";

const App = () => {
  const [id, setId] = useState("");

  const ProtectedRoute = ({ id, children }) => {
    const params = new URLSearchParams(window.location.search);
    const Sessionparams = localStorage.getItem("userID");
    const urlId = params.get("id");
    if (urlId) {
      localStorage.setItem("userID", urlId);
    }
    return params || Sessionparams ? children : <Navigate to="/" replace />;
  };
  return (
    <Provider store={store}>
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
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
