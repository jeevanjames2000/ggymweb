import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
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
import CircularProgress from "@mui/material/CircularProgress";
import Grid2 from "@mui/material/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState, useEffect, useRef, useCallback } from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import CryptoJS from "crypto-js";

const Gym = () => {
  const [selectedSlot, setSelectedSlot] = useState("Slots Time");
  const [selectedLocation, setSelectedLocation] = useState("GYM");
  const [access, setAccess] = useState(false);
  const [accessmsg, setAccessMsg] = useState([]);
  const [wait, setWait] = useState([]);
  const [waitlist, setWaitList] = useState([]);
  const [present, setPresent] = useState([]);
  const [arrived, setArrived] = useState(0);
  const [qrdata, setQrData] = useState("");
  const [scannedResult, setScannedResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expand, setExpand] = useState({
    waiting: true,
    arrived: false,
  });
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
  const [waitingPage, setWaitingPage] = useState(0);
  const [waitingRowsPerPage, setWaitingRowsPerPage] = useState(10);
  const [arrivedPage, setArrivedPage] = useState(0);
  const [arrivedRowsPerPage, setArrivedRowsPerPage] = useState(10);
  const handleWaitingPageChange = (event, newPage) => {
    setWaitingPage(newPage);
  };
  const handleWaitingRowsPerPageChange = (event) => {
    setWaitingRowsPerPage(parseInt(event.target.value, 10));
    setWaitingPage(0);
  };
  const handleArrivedPageChange = (event, newPage) => {
    setArrivedPage(newPage);
  };
  const handleArrivedRowsPerPageChange = (event) => {
    setArrivedRowsPerPage(parseInt(event.target.value, 10));
    setArrivedPage(0);
  };
  const paginatedWaitingData = waitlist.slice(
    waitingPage * waitingRowsPerPage,
    waitingPage * waitingRowsPerPage + waitingRowsPerPage
  );
  const paginatedArrivedData = present.slice(
    arrivedPage * arrivedRowsPerPage,
    arrivedPage * arrivedRowsPerPage + arrivedRowsPerPage
  );

  const handleAccordionChange = (panel) => {
    setExpand((prev) => ({ ...prev, [panel]: !prev[panel] }));
  };
  const inputRef = useRef(null);
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
          setWait(data.waiting.totalSlots);
          setWaitList(data.waiting.totalWaiting);
          setArrived(data.arrived.presentCount);
          setPresent(data.arrived.totalPresent);
        }
      } catch (error) {
        console.log("Something went wrong", error);
      }
    },
    []
  );
  const [slotstime, setSlotsTime] = useState([]);
  const [location, setLocation] = useState([]);

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
  const UpdateAttendance = async (dataToPost) => {
    setScannedResult(true);
    setTimeout(() => {
      setScannedResult(false);
    }, 2000);
    try {
      const response = await fetch(
        "https://sports1.gitam.edu/api/gym/updateGymSchedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            regdNo: dataToPost.regdNo,
            start_time: dataToPost.start_time,
            start_date: dataToPost.start_date,
            id: dataToPost.id,
            masterID: dataToPost.masterID,
            admin_id: Regdno,
          }),
        }
      );
      const result = await response.json();
      const currentDate = new Date().toISOString().split("T")[0];
      if (response.status === 200) {
        setQrData("");
        fetchGymSchedules(selectedLocation, currentDate, selectedSlot);
        setAccess(true);
        setAccessMsg([
          { auth: "Access Granted" },
          {
            message: `Welcome to Gitam Gym!`,
          },
        ]);
      } else if (response.status === 400 || 404 || 500) {
        setQrData("");
        setAccess(false);
        setAccessMsg([{ auth: "Access Denied" }, { message: result }]);
      }
    } catch (error) {
      setQrData("");
      setAccess(false);
      setAccessMsg([
        { auth: "Access Denied" },
        { message: "Failed to update" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      const decryptedId = decryptTripleDES(id, "Mallikarjun", true);
    }
    const currentDate = new Date().toISOString().split("T")[0];
    fetchGymSchedules(selectedLocation, currentDate, selectedSlot);
    fetchGymSlotsTimes(selectedLocation, currentDate);
  }, [selectedSlot, selectedLocation, fetchGymSchedules, fetchGymSlotsTimes]);
  const delayTimeoutRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        inputRef.current.blur();
        setIsFocused(false);
      }
    };
    const autoRefocus = () => {
      if (!isFocused) {
        setTimeout(() => {
          inputRef.current.focus();
          setIsFocused(true);
        }, 1500);
      }
    };
    document.addEventListener("click", handleClickOutside);
    const refocusInterval = setInterval(autoRefocus, 1500);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      clearInterval(refocusInterval);
    };
  }, [isFocused]);
  const handleFocusedValue = (e) => {
    setLoading(true);
    const newQrData = e.target.value;
    setQrData(newQrData);
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
    }
    delayTimeoutRef.current = setTimeout(async () => {
      try {
        const parsed = JSON.parse(newQrData);
        await UpdateAttendance(parsed);
      } catch (error) {
        setLoading(false);
      }
    }, 1000);
  };
  return (
    <>
      <Grid2 container spacing={2} justifyContent="center" alignItems="center">
        <Grid2
          spacing={2}
          size={{ xs: 12, md: 6, sm: 6, lg: 12 }}
          style={{ margin: "2rem", overflow: "hidden" }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            style={{
              fontWeight: "bold",
              color: "#B20016",
              marginBottom: "1rem",
            }}
          >
            GITAM GYM
          </Typography>
          {/* <Typography
            variant="h4"
            textAlign="center"
            style={{
              fontWeight: "bold",
              color: "#B20016",
              marginBottom: "1rem",
            }}
          >
            <RoomIcon style={{ height: "2rem", width: "2rem" }} />{" "}
            {selectedLocation}
          </Typography> */}
          <Grid2
            container
            justifyContent="center"
            size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
          >
            <>
              {loading && (
                <Grid2
                  container
                  display={"flex"}
                  size={{ xs: 12 }}
                  justifyContent={"center"}
                >
                  <CircularProgress size={30} />
                </Grid2>
              )}
            </>
          </Grid2>
          {scannedResult && (
            <Grid2 container justifyContent="center" gap={4} spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <Card
                  style={{
                    height: "80%",
                    padding: "1rem",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <Grid2 container>
                    <Grid2 size={{ xs: 12 }}>
                      <Typography
                        variant="h6"
                        style={access ? styles.successText : styles.errorText}
                      >
                        {accessmsg[0]?.auth || "Access Message"}
                      </Typography>
                      <Typography
                        variant="h6"
                        style={access ? styles.successText : styles.errorText}
                      >
                        {accessmsg[1]?.message || "Access Message"}
                      </Typography>
                    </Grid2>
                  </Grid2>
                </Card>
              </Grid2>
            </Grid2>
          )}
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
          <Grid2
            container
            spacing={2}
            style={{
              marginBottom: "5px",
              padding: "2rem",
              backgroundColor: "#fff",
            }}
          >
            {}
            <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                style={{
                  height: "auto",
                  width: "100%",
                  border: "1px solid #B20016",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setExpand((prev) => ({ ...prev, waiting: !prev.waiting }));
                }}
              >
                <CardContent>
                  <Grid2
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Grid2>
                      <Typography variant="h6">{wait}</Typography>
                      <Typography variant="body1">Waiting</Typography>
                    </Grid2>
                    <DirectionsRunIcon
                      style={{
                        fontSize: "3rem",
                        color: "#00695c",
                        marginLeft: "3rem",
                      }}
                    />
                  </Grid2>
                </CardContent>
              </Card>
            </Grid2>
            {}
            <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                style={{
                  height: "auto",
                  width: "100%",
                  border: "1px solid #B20016",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setExpand((prev) => ({ ...prev, arrived: !prev.arrived }));
                }}
              >
                <CardContent>
                  <Grid2
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Grid2>
                      <Typography variant="h6">{arrived}</Typography>
                      <Typography variant="body1">Arrived</Typography>
                    </Grid2>
                    <FitnessCenterIcon
                      style={{
                        fontSize: "3rem",
                        color: "#00695c",
                        marginLeft: "3rem",
                      }}
                    />
                  </Grid2>
                </CardContent>
              </Card>
            </Grid2>
            {}
            <Grid2
              item
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <input
                id="barcode"
                type="text"
                ref={inputRef}
                value={qrdata}
                autoFocus
                placeholder="Scanned Data"
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                onChange={handleFocusedValue}
                style={{
                  width: "100%",
                  height: "1rem",
                  padding: "5px",
                  fontSize: "10px",
                  opacity: "0",
                }}
              />
            </Grid2>
          </Grid2>
          <Grid2 spacing={2} size={{ xs: 12 }} style={{ marginBottom: "5px" }}>
            <Accordion
              expanded={expand.waiting}
              onChange={() => handleAccordionChange("waiting")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{ color: "#B20016" }}>Waiting</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer
                  component={Paper}
                  style={{
                    border: "1px solid #B20016",
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
                        ].map((heading) => (
                          <TableCell
                            key={heading}
                            style={{
                              borderBottom: "1px solid #B20016",
                              fontWeight: "bold",
                              color: "#B20016",
                            }}
                          >
                            {heading}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedWaitingData.length > 0 ? (
                        paginatedWaitingData.map((item, id) => (
                          <TableRow key={id}>
                            <TableCell>
                              {id + 1 + waitingPage * waitingRowsPerPage}
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
                    count={waitlist.length}
                    rowsPerPage={waitingRowsPerPage}
                    page={waitingPage}
                    onPageChange={handleWaitingPageChange}
                    onRowsPerPageChange={handleWaitingRowsPerPageChange}
                  />
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Accordion
              expanded={expand.arrived}
              onChange={() => handleAccordionChange("arrived")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography style={{ color: "#B20016" }}>Arrived</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer
                  component={Paper}
                  style={{
                    border: "1px solid #B20016",
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
                              fontWeight: "bold",
                              color: "#B20016",
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
    </>
  );
};
const styles = {
  successText: {
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    margin: 0,
    fontWeight: "600",
    color: "#dc3545",
    textAlign: "center",
  },
};
export default Gym;
