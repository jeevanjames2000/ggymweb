import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import GridViewIcon from "@mui/icons-material/GridView";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Gym from "../../Gym";
import Arrived from "../../components/Arrived";
import Cancelled from "../../components/Cancelled";
import History from "../../components/History";
import "./header.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function Index() {
  const navigate = useNavigate();
  const storeLocation = useSelector((state) => state.location.selectedLocation);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState("Gym");
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const renderComponent = () => {
    switch (selectedComponent) {
      case "G-Gym":
        return <Gym />;
      case "Arrived":
        return <Arrived />;
      case "Cancelled":
        return <Cancelled />;
      case "History":
        return <History />;
      default:
        return <Gym />;
    }
  };

  const handleLogout = () => {
    console.log("logged out");
    window.location.href = "https://login.gitam.edu/Login.aspx";
    localStorage.removeItem("userID");
    localStorage.removeItem("RegdNo");
  };

  const sessionRegdNo = localStorage.getItem("userID");

  useEffect(() => {
    if (!sessionRegdNo) {
      setTimeout(() => {
        window.location.href = "https://login.gitam.edu/Login.aspx";
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [navigate, sessionRegdNo]);

  if (loading) {
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

  return (
    <Grid2 container>
      {/* Top Navbar */}
      <Grid2
        item
        container
        display={"flex"}
        justifyContent={"space-between"}
        size={{ xs: 12 }}
        sx={{ padding: "0.8rem", backgroundColor: "#007367" }}
      >
        <Grid2 item container size={{ xs: 4 }} gap={2} alignItems="center">
          <Grid2 item onClick={() => setSelectedComponent("G-Gym")}>
            <img
              src="https://cdn.gitam.edu/images/logo/gitamlogo-ivory.png"
              width={"135px"}
              alt="Logo"
            />
          </Grid2>
          <Grid2 item>
            <MenuIcon
              fontSize="medium"
              sx={{ color: "#fff", cursor: "pointer" }}
              onClick={toggleSidebar}
            />
          </Grid2>
          <Grid2
            container
            size={{ xs: 4 }}
            justifyContent={"left"}
            alignItems="left"
            gap={2}
          >
            <Typography
              variant="h6"
              fontSize={23}
              sx={{ fontWeight: "bold", color: "#fff" }}
            >
              {storeLocation}
            </Typography>
          </Grid2>
        </Grid2>

        <Grid2
          item
          container
          size={{ xs: 4 }}
          justifyContent={"flex-end"}
          alignItems="center"
          gap={2}
          sx={{ paddingRight: "0.2rem" }}
        >
          <Grid2 item>
            <AccountCircleIcon
              fontSize="large"
              sx={{ color: "#fff", cursor: "pointer" }}
              onClick={handleOpenMenu}
            />
          </Grid2>
        </Grid2>
      </Grid2>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>
          <Typography>{sessionRegdNo}</Typography>
        </MenuItem>
      </Menu>

      <Grid2 container size={{ xs: 12 }}>
        {/* Sidebar */}
        <Grid2 item size={{ xs: isSidebarOpen ? 1 : 0.5 }}>
          <Box
            sx={{
              width: isSidebarOpen ? "150px" : "60px",
              overflow: "hidden",
              transition: "width 0.3s ease",
              backgroundColor: "#fff",
              height: "100vh",
              padding: "1rem",
              boxSizing: "border-box",
              alignItems: "center",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              sx={{
                cursor: "pointer",
                mt: 1,
                color: selectedComponent === "G-Gym" ? "#007367" : "inherit",
                borderRadius: "4px",
                padding: "8px",
              }}
              onClick={() => setSelectedComponent("G-Gym")}
            >
              <GridViewIcon fontSize="small" />
              {isSidebarOpen && (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Dashboard
                </Typography>
              )}
            </Box>

            <Box
              display="flex"
              alignItems="center"
              sx={{
                cursor: "pointer",
                mt: 1,

                color: selectedComponent === "History" ? "#007367" : "inherit",
                borderRadius: "4px",
                padding: "8px",
              }}
              onClick={() => setSelectedComponent("History")}
            >
              <HistoryIcon fontSize="small" />
              {isSidebarOpen && (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  History
                </Typography>
              )}
            </Box>

            <Box
              display="flex"
              alignItems="center"
              sx={{
                cursor: "pointer",
                mt: 1,
                color:
                  selectedComponent === "Cancelled" ? "#007367" : "inherit",
                borderRadius: "4px",
                padding: "8px",
              }}
              onClick={() => setSelectedComponent("Cancelled")}
            >
              <CancelOutlinedIcon fontSize="small" />
              {isSidebarOpen && (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Canceled
                </Typography>
              )}
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                cursor: "pointer",
                mt: 1,
                color: selectedComponent === "Logout" ? "#007367" : "inherit",
                borderRadius: "4px",
                padding: "8px",
              }}
              onClick={handleLogout}
            >
              <LogoutIcon fontSize="small" />
              {isSidebarOpen && (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Logout
                </Typography>
              )}
            </Box>
          </Box>
        </Grid2>

        {/* Main Content */}
        <Grid2 item size={{ xs: isSidebarOpen ? 11 : 11.5 }}>
          <Box
            sx={{
              flexGrow: 1,
              //   padding: "0.5rem",
              transition: "margin-left 0.3s ease",
              marginLeft: isSidebarOpen ? "0px" : "0px",
            }}
          >
            {renderComponent()}
          </Box>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
