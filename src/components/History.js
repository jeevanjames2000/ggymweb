import {
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TablePagination,
  TextField,
  CircularProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { stateLocation } from "../store/Slice/locationSlice";
import { useNavigate } from "react-router-dom";
export default function History() {
  const dispatch = useDispatch();
  const storeLocation = useSelector((state) => state.location.selectedLocation);
  const [present, setPresent] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("Slots Time");
  const [selectedLocation, setSelectedLocation] = useState(storeLocation);
  const [slotstime, setSlotsTime] = useState([]);
  const [location, setLocation] = useState([]);
  const [arrivedPage, setArrivedPage] = useState(0);
  const [arrivedRowsPerPage, setArrivedRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const paginatedArrivedData = present.slice(
    arrivedPage * arrivedRowsPerPage,
    arrivedPage * arrivedRowsPerPage + arrivedRowsPerPage
  );
  const handleArrivedPageChange = (event, newPage) => {
    setArrivedPage(newPage);
  };
  const handleArrivedRowsPerPageChange = (event) => {
    setArrivedRowsPerPage(parseInt(event.target.value, 10));
    setArrivedPage(0);
  };
  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };
  const handleLocChange = (event) => {
    setSelectedSlot("Slots Time");
    setSelectedLocation(event.target.value);
    dispatch(stateLocation(event.target.value));
  };
  const fetchGymSchedules = useCallback(
    async (Location, Date, selectedSlot) => {
      try {
        const response = await fetch(
          `https://sports1.gitam.edu/api/gym/getHistory/${Date}/${Location}/${selectedSlot}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setPresent(data);
        } else {
          setPresent([]);
        }
      } catch (error) {
        console.log("Something went wrong", error);
      }
    },
    []
  );
  const fetchGymSlotsTimes = useCallback(async (Location, Date) => {
    try {
      const response = await fetch(
        `https://sports1.gitam.edu/api/gym/getStarttimeByLoc/${Location}/${Date}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response2 = await fetch(
        `https://sports1.gitam.edu/api/gym/getLocations/${Date}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data2 = await response2.json();
      if (response2.ok) {
        setLocation(data2);
      }
      const data = await response.json();
      if (response.ok) {
        setSlotsTime(["Slots Time", ...data]);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }, []);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  useEffect(() => {
    if (selectedDate && selectedLocation) {
      fetchGymSchedules(selectedLocation, selectedDate, selectedSlot);
      fetchGymSlotsTimes(selectedLocation, selectedDate);
    }
  }, [
    selectedDate,
    selectedSlot,
    selectedLocation,
    fetchGymSchedules,
    fetchGymSlotsTimes,
  ]);
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setSelectedDate(currentDate);
  }, []);
  const navigate = useNavigate();
  const sessionRegdNo = localStorage.getItem("RegdNo");
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
    <Grid2 container spacing={2} justifyContent="center" alignItems="center">
      <Grid2
        spacing={2}
        size={{ xs: 12, md: 12, sm: 12, lg: 12 }}
        style={{ margin: "2rem", overflow: "hidden" }}
      >
        <Grid2
          container
          justifyContent="space-between"
          alignItems="center"
          size={{ xs: 12, sm: 12, md: 12 }}
          style={{
            paddingBottom: "0.5rem",
          }}
        >
          <Grid2 item size={{ xs: 6, sm: 6, md: 6 }}>
            <Typography
              variant="h5"
              style={{ color: "#00695c", fontWeight: "bold" }}
            >
              {selectedLocation} - {selectedSlot}
            </Typography>
          </Grid2>
          <Grid2
            size={{ xs: 6, sm: 6, md: 6 }}
            container
            spacing={2}
            alignItems="center"
            justifyContent={"flex-end"}
          >
            <Grid2>
              <TextField
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputProps={{
                  sx: {
                    width: "9rem",
                    height: "2.6rem",
                    color: "#fff",
                    padding: "0.4rem",
                    backgroundColor: "#007367",
                    border: "1px solid #007367",
                  },
                }}
                inputProps={{
                  sx: {
                    height: "2.5rem",
                    padding: "0 0.5rem",
                    boxSizing: "border-box",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#007367",
                    },
                    "&:hover fieldset": {
                      borderColor: "#007367",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#007367",
                    },
                  },
                }}
              />
            </Grid2>
            <Grid2>
              <Select
                value={selectedLocation}
                onChange={handleLocChange}
                displayEmpty
                style={{
                  width: "8rem",
                  height: "2.5rem",
                  color: "#fff",
                  backgroundColor: "#007367",
                  border: "1px solid #007367",
                }}
              >
                {location?.map((loc) => (
                  <MenuItem
                    key={loc}
                    value={loc}
                    sx={{
                      height: "1.5rem",
                      justifyContent: "left",
                      width: "9rem",
                      "&.Mui-selected": {
                        backgroundColor: "rgb(0, 115, 103) !important",
                        color: "#fff !important",
                        height: "2rem !important",
                      },
                    }}
                  >
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </Grid2>
            <Grid2>
              <Select
                value={selectedSlot}
                onChange={handleSlotChange}
                displayEmpty
                style={{
                  width: "8rem",
                  height: "2.5rem",
                  backgroundColor: "#007367",
                  color: "#fff",
                  border: "1px solid #007367",
                }}
              >
                {slotstime?.map((time, index) => (
                  <MenuItem
                    key={index}
                    value={time}
                    sx={{
                      height: "1.5rem",
                      justifyContent: "left",
                      width: "9rem",
                      "&.Mui-selected": {
                        backgroundColor: "rgb(0, 115, 103) !important",
                        color: "#fff !important",
                        height: "2rem !important",
                      },
                    }}
                  >
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </Grid2>
          </Grid2>
        </Grid2>
        <Grid2
          size={{ xs: 12 }}
          style={{
            marginBottom: "35px",
            border: "1px solid #e8e2e2",
            borderTop: "2px solid #007367",
            padding: "20px",
            background: "#fff",
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          }}
        >
          <Typography fontSize={20} style={{ color: "#00695c" }}>
            History
          </Typography>
          <TableContainer
            component={Paper}
            style={{
              border: "1px solid #ccc",
              backgroundColor: "#fff",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "#",
                    "Regd. number",
                    "Start date",
                    "Start time",
                    "End time",
                    "Location",
                    "Status",
                    "Attendance",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      style={{
                        borderBottom: "1px solid #ccc",
                        borderRight: "1px solid #ccc",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedArrivedData.length > 0 ? (
                  paginatedArrivedData.map((item, id) => (
                    <TableRow key={id}>
                      <TableCell
                        style={{
                          fontSize: 13,
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                        }}
                      >
                        {id + 1 + arrivedPage * arrivedRowsPerPage}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: 13,
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                        }}
                      >
                        {item?.regdNo || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: 13,
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                        }}
                      >
                        {item?.start_date
                          ? new Date(item.start_date)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: 13,
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                        }}
                      >
                        {item?.start_time || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: 13,
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                        }}
                      >
                        {item?.end_time || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: 13,
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                        }}
                      >
                        {item?.Location || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: 13,
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                        }}
                      >
                        {item?.status || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: 13,
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                        }}
                      >
                        {item?.attendance || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20]}
              component="div"
              count={present.length}
              rowsPerPage={arrivedRowsPerPage}
              page={arrivedPage}
              onPageChange={handleArrivedPageChange}
              onRowsPerPageChange={handleArrivedRowsPerPageChange}
            />
          </TableContainer>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
