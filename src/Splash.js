import { Grid2 } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./context/MyContext";

export default function Splash() {
  const navigate = useNavigate();
  const { id, setId } = useContext(MyContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");
    setId(urlId);
    if (!urlId) {
      window.location.href = "https://login.gitam.edu/Login.aspx";
    } else {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  }, [navigate]);

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid2 item display="flex" flexDirection="column" alignItems="center">
        <img
          src="../GYM-splash.png"
          alt="G-Gym"
          style={{ height: "50vh", width: "50vh" }}
        />
        <CircularProgress style={{ marginTop: "1rem" }} />
      </Grid2>
    </Grid2>
  );
}
