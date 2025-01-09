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
import api from "../api";
import { debounce } from "lodash";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import "../styles.css"; // Import the CSS file
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { EventRepeat } from "@mui/icons-material";
// Extend dayjs with required plugins
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

function Registration() {
  const [startDate, setStartDate] = useState(dayjs());
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

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
                  <h2>Registration Reports</h2>
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
                            renderInput={(params) => <TextField fullWidth {...params} />}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <MDButton variant="gradient" color="info" fullWidth>
                          Search
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
                <MDBox mt={3}>
                  <>
                    <>
                      <MDBox mt={2} mb={2}>
                        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
                          <Select
                            labelId="rows-per-page-label"
                            value={rowsPerPage}
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
                      <MDBox mt={2} display="flex" justifyContent="center">
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
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  First Name
                                </th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  Last Name
                                </th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  Phone Number
                                </th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  Email Id
                                </th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  Registration Date
                                </th>
                              </tr>
                            </thead>
                            <tbody style={{ fontSize: "15px" }}>
                              <tr>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>#11</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  Veerraju
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  Pippalla
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  9949220002
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  pvrveeru@gmail.com
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  20-12-2024
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </TableContainer>
                      </MDBox>
                      <MDBox mt={2} mb={2} display="flex" justifyContent="center">
                        <Pagination count={Math.ceil(rows.length / rowsPerPage)} page={page + 1} />
                      </MDBox>
                    </>
                  </>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Registration;
