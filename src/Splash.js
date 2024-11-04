import { Grid2 } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

export default function Splash() {
  const navigate = useNavigate();
  const [Regdno, setRegdNo] = useState(null);
  const decryptTripleDES = (cipherText, key, useHashing = false) => {
    let keyHex;
    if (useHashing) {
      keyHex = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(key));
    } else {
      keyHex = CryptoJS.enc.Utf8.parse(key);
    }
    const decrypted = CryptoJS.TripleDES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(cipherText.replace(" ", "+")),
      },
      keyHex,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    setRegdNo(decryptedText);
    return decryptedText;
  };

  useEffect(() => {
    const Sessionparams = localStorage.getItem("userID");
    if (!Sessionparams) {
      // window.location.href = "https://login.gitam.edu/Login.aspx";
      console.log("please login");
      // const decryptedId = decryptTripleDES(Sessionparams, "Mallikarjun", true);
      // localStorage.setItem("RegdNo", decryptedId);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
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
