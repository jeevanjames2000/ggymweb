import { Grid2 } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Splash() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");
    if (!urlId) {
      window.location.href = "https://login.gitam.edu/Login.aspx";
    } else {
      Navigate("g-gym");
    }
  }, [Navigate]);
  return (
    <>
      <Grid2 container justifyContent="center">
        <Grid2
          item
          xs={12}
          display="flex"
          alignItems="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid2 item style={{ height: "50vh", width: "50vh" }}>
            <img
              src="../GYM-splash.png"
              alt="G-Gym"
              style={{ height: "100%", width: "100%" }}
            />
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  );
}
