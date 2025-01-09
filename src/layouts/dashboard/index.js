import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { saveAs } from "file-saver";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDButton from "components/MDButton";
import { format } from "date-fns"; // Import date-fns
import api from "../api";
import "../styles.css"; // Import the CSS file
import ChatWindow from "./chatwindow";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function Dashboard() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rows, setRows] = useState([]);
  const [rdata, setRdata] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [encodedFlightNumber, setEncodedFlightNumber] = useState(""); // New state for encoded flight number

  const [time, setTime] = useState(Date.now());

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError("Please provide flight number.");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("User not authenticated. Please log in.");
      navigate("/authentication/sign-in/");
      return;
    }

    const formattedFlightNumber = searchQuery.trim().replace(/\s+/g, " ");
    const encodedFlightNumber = encodeURIComponent(formattedFlightNumber);
    const url = `Report/NUCPassengerClearedReport?flightNumber=${encodedFlightNumber}`;
    setEncodedFlightNumber(encodedFlightNumber);

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
        const { flightNumber, origin, destination, departureDate, arrivalDate, passengerCleared } =
          response.data;

        setRdata({
          flightNumber,
          origin,
          destination,
          etd: new Date(departureDate).toLocaleString(),
          eta: new Date(arrivalDate).toLocaleString(),
          clearedCount: passengerCleared.length,
          notClearedCount: 0, // Set this to an appropriate value if available
        });

        setRows(passengerCleared || []);
      } else {
        setError("Failed to fetch reports. Please try again.");
      }
    } catch (error) {
      console.log("Error caught in catch block:", error);

      if (error.response) {
        console.error("Error Response:", error.response.data);
        if (error.response.status === 401) {
          setError("Unauthorized access. Please log in again.");
          navigate("/authentication/sign-in/");
          navigate("/login"); // Navigate to login if unauthorized
        } else if (error.response.status === 400) {
          setError("Bad request. Please check your inputs.");
        } else if (error.response.status === 420) {
          setError("No Data For Flight Entered");
        } else {
          setError("An error occurred while fetching reports.");
        }
      } else if (error.request) {
        console.error("Error Request:", error.request);
        setError("No response from the server. Please try again later.");
      } else {
        console.error("Error:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, navigate]);

  useEffect(() => {
    handleSearch();
    const intervalId = setInterval(() => {
      handleSearch(); // Call periodically
    }, 8000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [handleSearch]);

  const convertToCSV = (data) => {
    if (!data.length) return ""; // Return empty string if data is empty

    const header = [
      "ID Card Type",
      "ID Number",
      "Nationality",
      "Surname",
      "First Name",
      "Middle Name",
      "DOB",
      "Gender",
      "Flight Type",
      "Passenger Type",
      "Purpose Of Visit",
    ].join(",");
    const rows = data
      .map((row) =>
        [
          row.idCardType,
          row.idNumber,
          row.nationality,
          row.surName,
          row.firstName,
          row.middleName || "", // Handle null values
          row.dob,
          row.gender,
          row.flightType,
          row.passengerType,
          row.purposeOfVisit,
        ].join(",")
      )
      .join("\n");
    return `${header}\n${rows}`;
  };

  const exportCSV = () => {
    const csv = convertToCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Dashboard.csv");
  };

  return (
    <DashboardLayout>
      <div className="hide-on-desktop">
        <DashboardNavbar />
      </div>
      <MDBox pt={3} pb={3}>
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
                <h2>Dashboard Reports</h2>
              </MDTypography>
            </MDBox>
            <MDBox pt={3} px={2}>
              <Card style={{ backgroundColor: "#f6f0f0" }}>
                <MDBox p={3}>
                  <Grid container spacing={2}>
                    <b style={{ lineHeight: "60px", marginLeft: "10px" }}>Search by</b>
                    <Grid item xs={12} sm={2}>
                      <Select
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        displayEmpty
                        variant="outlined"
                        style={{
                          border: "1px solid #ccc",
                          lineHeight: "40px",
                          boxShadow: "none",
                        }}
                      >
                        <MenuItem value="">
                          <em>Select Event</em>
                        </MenuItem>
                      </Select>
                    </Grid>
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
                      <MDButton variant="gradient" color="info" fullWidth onClick={handleSearch}>
                        Search
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            </MDBox>
          </Card>
        </Grid>
        <Grid item xs={12} py={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Bookings"
                  count={281}
                  percentage={{
                    color: "success",
                    amount: "+55%",
                    label: "than lask week",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Today's Users"
                  count="2,300"
                  percentage={{
                    color: "success",
                    amount: "+3%",
                    label: "than last month",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Revenue"
                  count="34k"
                  percentage={{
                    color: "success",
                    amount: "+1%",
                    label: "than yesterday",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
