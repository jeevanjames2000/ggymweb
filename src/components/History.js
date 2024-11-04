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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TablePagination,
  TextField,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import React, { useState, useEffect, useCallback } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { stateLocation } from "../store/Slice/locationSlice";

export default function History() {
  const dispatch = useDispatch();
  const storeLocation = useSelector((state) => state.location.selectedLocation);
  const [expand, setExpand] = useState({
    cancel: true,
  });
  const [present, setPresent] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("Slots Time");
  const [selectedLocation, setSelectedLocation] = useState(storeLocation);
  const [slotstime, setSlotsTime] = useState([]);
  const [location, setLocation] = useState([]);
  const [arrivedPage, setArrivedPage] = useState(0);
  const [arrivedRowsPerPage, setArrivedRowsPerPage] = useState(10);
  const [arrived, setArrived] = useState(0);
  const [Regdno, setRegdNo] = useState(null);

  const paginatedArrivedData = present.slice(
    arrivedPage * arrivedRowsPerPage,
    arrivedPage * arrivedRowsPerPage + arrivedRowsPerPage
  );
  const handleArrivedPageChange = (event, newPage) => {
    setArrivedPage(newPage);
  };

  const handleAccordionChange = (panel) => {
    setExpand((prev) => ({ ...prev, [panel]: !prev[panel] }));
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
          `http://localhost:2021/api/gym/getHistory/${Date}/${Location}/${selectedSlot}`,
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

  //   const generateUpcomingDates = () => {
  //     const dates = [];
  //     for (let i = -3; i < 7; i++) {
  //       const date = moment().add(i, "days").format("YYYY-MM-DD");
  //       dates.push(date);
  //     }
  //     setUpcomingDates(dates);
  //   };

  //   const [upcomingDates, setUpcomingDates] = useState([]);

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
            borderBottom: "2px solid #000",
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
                  style: {
                    width: "9rem",
                    height: "2.6rem",
                    color: "#000",
                    border: "1px solid #ddd",
                    padding: "0.4rem",
                  },
                }}
                inputProps={{
                  style: {
                    height: "2.5rem",
                    padding: "0 0.5rem",
                    boxSizing: "border-box",
                  },
                }}
                sx={{
                  //   backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000",
                    },
                    "&:hover fieldset": {
                      borderColor: "#000",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#000",
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
                  color: "#000",
                  border: "1px solid #000",
                }}
              >
                {location?.map((loc) => (
                  <MenuItem
                    key={loc}
                    value={loc}
                    style={{
                      height: "1.5rem",
                      justifyContent: "left",
                      width: "9rem",
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
                  color: "#000",
                  border: "1px solid #000",
                }}
              >
                {slotstime?.map((time, index) => (
                  <MenuItem
                    key={index}
                    value={time}
                    style={{
                      height: "1.5rem",
                      justifyContent: "left",
                      width: "9rem",
                    }}
                  >
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </Grid2>
          </Grid2>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Accordion
            expanded={expand.cancel}
            onChange={() => handleAccordionChange("cancel")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontSize={20} style={{ color: "#00695c" }}>
                History
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer
                component={Paper}
                style={{
                  border: "1px solid #000",
                  marginTop: "0.5rem",
                  backgroundColor: "#fff",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      {[
                        "Sno",
                        "Regd Number",
                        "Start Date",
                        "Start Time",
                        "End Time",
                        "Location",
                        "Status",
                        "Attendance",
                      ].map((heading) => (
                        <TableCell
                          key={heading}
                          style={{
                            borderBottom: "1px solid #000",
                            // fontWeight: "bold",
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
                          <TableCell>
                            {id + 1 + arrivedPage * arrivedRowsPerPage}
                          </TableCell>
                          <TableCell>{item?.regdNo || "N/A"}</TableCell>
                          <TableCell>
                            {item?.start_date
                              ? new Date(item.start_date)
                                  .toISOString()
                                  .split("T")[0]
                              : "N/A"}
                          </TableCell>
                          <TableCell>{item?.start_time || "N/A"}</TableCell>
                          <TableCell>{item?.end_time || "N/A"}</TableCell>
                          <TableCell>{item?.Location || "N/A"}</TableCell>
                          <TableCell>{item?.status || "N/A"}</TableCell>
                          <TableCell>{item?.attendance || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
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
            </AccordionDetails>
          </Accordion>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
