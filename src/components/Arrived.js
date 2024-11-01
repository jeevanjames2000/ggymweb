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
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import React, { useState, useEffect, useRef, useCallback } from "react";
import CryptoJS from "crypto-js";

export default function Arrived() {
  const [expand, setExpand] = useState({
    waiting: true,
    arrived: false,
  });
  const [present, setPresent] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("Slots Time");
  const [selectedLocation, setSelectedLocation] = useState("GYM");
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
  };
  const fetchGymSchedules = useCallback(
    async (Location, Date, selectedSlot) => {
      try {
        const response = await fetch(
          `https://sports1.gitam.edu/slot/gym/getAdminslotsCountByTimeAndDate/${Location}/${selectedSlot}/${Date}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setPresent(data.arrived.totalPresent);
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
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      const decryptedId = decryptTripleDES(id, "Mallikarjun", true);
    }
    const currentDate = new Date().toISOString().split("T")[0];
    fetchGymSchedules(selectedLocation, currentDate, selectedSlot);
    fetchGymSlotsTimes(selectedLocation, currentDate, selectedSlot);
  }, [selectedSlot, selectedLocation, fetchGymSchedules]);

  return (
    <Grid2 container spacing={2} justifyContent="center" alignItems="center">
      <Grid2
        spacing={2}
        size={{ xs: 12, md: 6, sm: 6, lg: 12 }}
        style={{ margin: "2rem", overflow: "hidden" }}
      >
        <Grid2
          container
          justifyContent="space-between"
          alignItems="center"
          size={{ xs: 12, sm: 6, md: 6 }}
          style={{
            borderBottom: "2px solid #B20016",
            paddingBottom: "0.5rem",
          }}
        >
          <Grid2>
            <Typography
              variant="h5"
              style={{ color: "#B20016", fontWeight: "bold" }}
            >
              {selectedLocation} - {selectedSlot}
            </Typography>
          </Grid2>
          <Grid2
            size={{ xs: 12, sm: 12, md: 12 }}
            container
            spacing={2}
            alignItems="center"
          >
            <Grid2>
              <Select
                value={selectedLocation}
                onChange={handleLocChange}
                displayEmpty
                style={{
                  width: "9rem",
                  height: "2.5rem",
                  backgroundColor: "#00695c",
                  color: "white",
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
                  width: "9rem",
                  height: "2.5rem",
                  backgroundColor: "#00695c",
                  color: "white",
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
          <TableContainer
            component={Paper}
            style={{
              //   border: "1px solid #B20016",
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
                    "Attendance",
                    "Admin ID",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      style={{
                        borderBottom: "1px solid #B20016",
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
                      <TableCell>{item?.attendance || "N/A"}</TableCell>
                      <TableCell>{item?.admin_id || "N/A"}</TableCell>
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
