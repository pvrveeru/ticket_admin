import React, { useState, useEffect } from "react";
import {
  TableContainer,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CreateIcon from "@mui/icons-material/Create";
import axios from "axios";
import "../styles.css";
import api from "../api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState(0); // To store the total count of events

  // Fetch data from API
  const fetchEvents = async () => {
    try {
      const offset = page * rowsPerPage; // Calculate offset for pagination
      const response = await api.get(
        `/events?sortBy=createdAt&sortOrder=asc&limit=${rowsPerPage}&offset=${offset}`
      );

      setEvents(response.data.data);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Fetch events on page load and whenever page/rowsPerPage changes
  useEffect(() => {
    fetchEvents();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const tableCellStyle = { border: "1px solid #ddd", padding: "8px" };

  return (
    <DashboardLayout>
      <div className="hide-on-desktop">
        <DashboardNavbar />
      </div>
      <MDBox pt={3} pb={3}>
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
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <h2>Events</h2>
                <MDButton variant="gradient" color="success" onClick={() => navigate("/addevents")}>
                  Add Event
                </MDButton>
              </div>
            </MDTypography>
          </MDBox>
          <MDBox pt={3} px={2}>
            <TableContainer component={Paper}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "16px",
                  marginBottom: "20px",
                }}
              >
                <thead style={{ background: "#efefef", fontSize: "15px" }}>
                  <tr>
                    <th style={tableCellStyle}>ID</th>
                    <th style={tableCellStyle}>Create Date</th>
                    <th style={tableCellStyle}>Event Type</th>
                    <th style={tableCellStyle}>Event</th>
                    <th style={tableCellStyle}>Event Date</th>
                    <th style={tableCellStyle}>Location</th>
                    <th style={tableCellStyle}>Tickets</th>
                    <th style={tableCellStyle}>Action</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {events.map((event) => (
                    <tr key={event.eventId}>
                      <td style={tableCellStyle}>{event.uniqueeventId}</td>
                      <td style={tableCellStyle}>
                        {new Date(event.createdAt).toLocaleDateString()}
                      </td>
                      <td style={tableCellStyle}>{event.categoryId?.name || "N/A"}</td>
                      <td style={tableCellStyle}>{event.title}</td>
                      <td style={tableCellStyle}>
                        {new Date(event.eventDate).toLocaleDateString()}
                      </td>
                      <td style={tableCellStyle}>{event.location}</td>
                      <td style={tableCellStyle}>{event.noOfTickets}</td>
                      <td style={tableCellStyle}>
                        <MDButton
                          style={{ marginRight: "10px" }}
                          variant="gradient"
                          color="info"
                          onClick={() =>
                            navigate("/addevents", { state: { eventId: event.eventId } })
                          }
                        >
                          <CreateIcon />
                        </MDButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage || 10} // Ensure rowsPerPage is valid
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
};

export default Events;
