import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../src/layout/Header";
import Splash from "./Splash";
import History from "./components/History";
import { Provider } from "react-redux";
import store from "./store/store";

const App = () => {
  const [id, setId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");

    if (urlId) {
      localStorage.setItem("RegdNo", urlId);
      setId(urlId);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/dashboard" element={<Header />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
