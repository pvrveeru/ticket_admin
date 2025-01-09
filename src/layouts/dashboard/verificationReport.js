import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isBetween from "dayjs/plugin/isBetween";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import api from "../api";
import "../styles.css"; // Import the CSS file
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// Extend dayjs with required plugins
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

function VerificationReport() {
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "day")); // One day before today
  const [endDate, setEndDate] = useState(dayjs()); // Current date
  const [rdata, setRdata] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    handleRegistrationSearch();
  }, []);

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
  };

  const handleRegistrationSearch = useCallback(async () => {
    if (startDate && endDate && dayjs(endDate).isBefore(startDate)) {
      setError("End date cannot be earlier than start date.");
      return;
    }
    const formattedStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DD") : null;
    const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : null;

    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("User not authenticated. Please log in.");
      navigate("/authentication/sign-in/");
      return;
    }

    const url = `Report/GetVerificationCountForFlightByDate?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`;

    try {
      setLoading(true);
      setError("");

      const response = await api.get(url, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setRdata(response.data || []); // Set rdata directly from response.data
      } else {
        setError("Failed to fetch reports. Please try again.");
      }
    } catch (error) {
      // Error handling remains the same
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, navigate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportregistrationCSV = () => {
    const csv = convertregistrationToCSV(rdata);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "verificationreport.csv");
  };

  const convertregistrationToCSV = (data) => {
    if (data.length === 0) return "";

    // Get dynamic flight numbers from the first row
    const flightNumbers = Object.keys(data[0]).filter((key) => key !== "date1");

    // Create CSV header
    const header = ["Date", ...flightNumbers].join(",");

    // Create CSV rows
    const rows = data.map((row) =>
      [
        row.date1, // Date
        ...flightNumbers.map((flight) => (row[flight] !== null ? row[flight] : "-")), // Flight data
      ].join(",")
    );

    return `${header}\n${rows.join("\n")}`;
  };

  const flightNumbers =
    rdata.length > 0 ? Object.keys(rdata[0]).filter((key) => key !== "date1") : [];

  return (
    <DashboardLayout>
      <div className="hide-on-desktop">
        <DashboardNavbar />
      </div>
      <MDBox pt={3} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card style={{ paddingBottom: "20px" }}>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  <h2>Verification Count Reports</h2>
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <Card style={{ backgroundColor: "#f6f0f0" }}>
                  <MDBox p={3}>
                    <Grid container spacing={2}>
                      <b style={{ lineHeight: "60px", marginLeft: "10px" }}>Search by</b>
                      <Grid item xs={12} sm={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <MDButton
                          variant="gradient"
                          color="info"
                          fullWidth
                          onClick={handleRegistrationSearch}
                        >
                          Search
                        </MDButton>
                      </Grid>
                    </Grid>
                    {error && (
                      <MDTypography color="error" mt={2}>
                        {error}
                      </MDTypography>
                    )}
                  </MDBox>
                </Card>
                {loading ? (
                  <MDBox display="flex" justifyContent="center" mt={3}>
                    <CircularProgress />
                  </MDBox>
                ) : (
                  <MDBox mt={3}>
                    <>
                      {rdata.length > 0 ? (
                        <>
                          <MDBox mt={2} mb={2}>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{
                                color: "#fff",
                                backgroundColor: "#007bff",
                                "&:hover": {
                                  backgroundColor: "#0056b3",
                                },
                              }}
                              onClick={exportregistrationCSV}
                              disabled={loading} // Disable export if still loading data
                            >
                              {loading ? "Loading..." : "Export CSV"}
                            </Button>
                            <FormControl
                              variant="outlined"
                              sx={{ minWidth: 120 }}
                              style={{ float: "right", marginBottom: "10px" }}
                            >
                              <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
                              <Select
                                labelId="rows-per-page-label"
                                value={rowsPerPage}
                                onChange={handleChangeRowsPerPage}
                                label="Rows per page"
                                style={{ height: "36px", fontSize: "16px" }}
                              >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                              </Select>
                            </FormControl>
                          </MDBox>
                          <MDBox mt={2} style={{ display: "inline" }}>
                            <TableContainer
                              component={Paper}
                              style={{ borderRadius: "0px", boxShadow: "none" }}
                            >
                              <table
                                style={{
                                  width: "100%",
                                  borderCollapse: "collapse",
                                  fontSize: "16px",
                                }}
                              >
                                <thead style={{ background: "#efefef", fontSize: "14px" }}>
                                  <tr>
                                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                                      Date
                                    </th>
                                    {flightNumbers.map((flight) => (
                                      <th
                                        style={{ border: "1px solid #ddd", padding: "8px" }}
                                        key={flight}
                                      >
                                        {flight}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody style={{ fontSize: "15px" }}>
                                  {rdata.map((row, index) => (
                                    <tr key={index}>
                                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                        {row.date1}
                                      </td>
                                      {flightNumbers.map((flight) => (
                                        <td
                                          style={{
                                            border: "1px solid #ddd",
                                            padding: "8px",
                                            textAlign: "center",
                                          }}
                                          key={flight}
                                        >
                                          {row[flight] !== null ? row[flight] : "-"}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </TableContainer>
                          </MDBox>
                          <MDBox mt={2} mb={2} display="flex" justifyContent="center">
                            <Pagination
                              count={Math.ceil(rdata.length / rowsPerPage)}
                              page={page + 1}
                              onChange={handleChangePage}
                            />
                          </MDBox>
                        </>
                      ) : (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                          No enrolment report data is available.
                        </div>
                      )}
                    </>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default VerificationReport;
