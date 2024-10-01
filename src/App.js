import { useEffect, useState } from "react";
import Gym from "./Gym";
import { Grid2 } from "@mui/material";

const App = () => {
  // const [id, setId] = useState(null);
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const urlId = params.get("id");
  //   setId(urlId);
  //   if (!urlId) {
  //     window.location.href = "https://login.gitam.edu/Login.aspx";
  //   }
  // }, []);

  // if (!id) {
  //   return (
  //     <Grid2
  //       container
  //       justifyContent="center"
  //       alignItems="center"
  //       sx={{ minHeight: "100vh" }}
  //     >
  //       <Grid2
  //         item
  //         xs={12}
  //         sm={8}
  //         md={6}
  //         lg={4}
  //         display="flex"
  //         justifyContent="center"
  //         alignItems="center"
  //       >
  //         <img
  //           src="../GYM-splash.png"
  //           alt="G-Gym"
  //           style={{ height: "50vh", width: "50vh" }}
  //         />
  //       </Grid2>
  //     </Grid2>
  //   );
  // }

  return (
    <Grid2 container>
      <Grid2 size={{ xs: 12, md: 12, sm: 12, lg: 12 }}>
        <Gym />
      </Grid2>
    </Grid2>
  );
};
export default App;
