import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Card,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axios from "axios";
import "../styles.css"; // Custom styles
import { LineWeight } from "@mui/icons-material";
import api from "../api";

const AddEvents = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventType: "",
    eventName: "",
    eventStartDate: "",
    eventEndDate: "",
    eventDate: "",
    eventDuration: "",
    ageLimit: "",
    eventVenue: "",
    eventCity: "",
    eventState: "",
    artistName: "",
    eventLanguage: "",
    eventFullInfo: "",
    eventShortInfo: "",
    noTickets: "",
    eventStatus: "",
    thubImage: null,
    multiIMages: [],
    popularEvent: false,
    featuredEvent: false,
    manualTicket: false,
  });

  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "thubImage") {
      setFormData({ ...formData, thubImage: files[0] });
    } else if (name === "multiIMages") {
      setFormData({ ...formData, multiIMages: Array.from(files) });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const eventData = new FormData();

    // Ensure all required fields are appended correctly
    eventData.append("type", formData.eventType);
    eventData.append("title", formData.eventName);
    eventData.append("startDate", new Date(formData.eventStartDate).toISOString()); // Ensure valid date format
    eventData.append("endDate", new Date(formData.eventEndDate).toISOString()); // Ensure valid date format
    eventData.append("eventDate", new Date(formData.eventDate).toISOString()); // Ensure valid date format
    eventData.append("duration", 30);
    eventData.append("ageLimit", 18);
    eventData.append("location", formData.eventVenue);
    eventData.append("city", formData.eventCity);
    eventData.append("state", formData.eventState);
    eventData.append("artistName", formData.artistName);
    eventData.append("language", formData.eventLanguage);
    eventData.append("description", formData.eventFullInfo);
    eventData.append("brief", formData.eventShortInfo);
    eventData.append("noOfTickets", formData.noTickets); // Ensure this field is correct
    eventData.append("status", formData.eventStatus);
    eventData.append("isPopular", formData.popularEvent);
    eventData.append("isFeatured", formData.featuredEvent);
    eventData.append("isManual", formData.manualTicket);

    // Thumbnail (if exists)
    // if (formData.thubImage) {
    //   eventData.append("thumbnail", formData.thubImage);
    // }

    // Multiple images (if exists)
    // if (formData.multiIMages.length > 0) {
    //   formData.multiIMages.forEach((image) => eventData.append("images", image));
    // }

    // Log the data for debugging
    console.log("Event Data to Submit:", eventData);

    try {
      const response = await api.post("/events", eventData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Event created successfully");
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error.response || error);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  // Fetch event types from API
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await api.get("/event-category");
        console.log("Event types data:", response.data); // Check the format of the response

        // Ensure the data is an array before setting it
        if (Array.isArray(response.data)) {
          setEventTypes(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setEventTypes(response.data.data); // Assuming the event types are inside a `data` field
        } else {
          console.error("Event types data is not an array:", response.data);
          setEventTypes([]); // Fallback to empty array if the data is not valid
        }
      } catch (error) {
        console.error("Error fetching event types:", error);
        setEventTypes([]); // Fallback to an empty array on error
      }
    };

    fetchEventTypes();
  }, []);

  const inputStyle = { width: "45%", margin: "10px 25px", lineHeight: "44px" };
  const selectStyle = { width: "45%", margin: "10px 25px", padding: "10px", height: "45px" };
  const fullWidthInputStyle = { width: "94%", margin: "10px 25px" };
  const cancelButton = { backgroundColor: "#ef3f2c", color: "#fff", margin: "10px" };
  const submitButton = { backgroundColor: "#25266d", color: "#fff", margin: "10px" };

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
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <h2>Add Events</h2>
                    </Grid>
                  </Grid>
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                {/* Checkboxes */}
                <MDBox style={{ display: "flex" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.popularEvent}
                        onChange={handleCheckboxChange}
                        name="popularEvent"
                      />
                    }
                    label="Popular Event"
                    style={inputStyle}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.featuredEvent}
                        onChange={handleCheckboxChange}
                        name="featuredEvent"
                      />
                    }
                    label="Featured Event"
                    style={inputStyle}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.manualTicket}
                        onChange={handleCheckboxChange}
                        name="manualTicket"
                      />
                    }
                    label="Manual Ticket"
                    style={inputStyle}
                  />
                </MDBox>
                {/* Form Fields */}
                <Select
                  name="eventType"
                  label="Event Type"
                  style={inputStyle}
                  value={formData.eventType}
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Event Type
                  </MenuItem>
                  {Array.isArray(eventTypes) &&
                    eventTypes.map((type) => (
                      <MenuItem key={type.categoryId} value={type.name}>
                        {type.name}
                      </MenuItem>
                    ))}
                </Select>
                <TextField
                  name="eventName"
                  label="Event Name"
                  style={inputStyle}
                  value={formData.eventName}
                  onChange={handleInputChange}
                />
                <TextField
                  name="eventStartDate"
                  label="Event Start Date"
                  type="datetime-local"
                  style={inputStyle}
                  margin="normal"
                  value={formData.eventStartDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="eventEndDate"
                  label="Event End Date"
                  type="datetime-local"
                  style={inputStyle}
                  margin="normal"
                  onChange={handleInputChange}
                  value={formData.eventEndDate}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="eventDate"
                  label="Event Date"
                  type="date"
                  style={inputStyle}
                  margin="normal"
                  onChange={handleInputChange}
                  value={formData.eventDate}
                  InputLabelProps={{ shrink: true }}
                />
                <Select
                  name="eventDuration"
                  label="Event Duration"
                  style={selectStyle}
                  value={formData.eventDuration}
                  onChange={(e) => setFormData({ ...formData, eventDuration: e.target.value })}
                  displayEmpty
                >
                  <MenuItem value="Select" disabled>
                    Select Duration
                  </MenuItem>
                  <MenuItem value="1 hour">1 hour</MenuItem>
                  <MenuItem value="2 hours">2 hours</MenuItem>
                  <MenuItem value="3 hours">3 hours</MenuItem>
                  <MenuItem value="Half day">Half day</MenuItem>
                  <MenuItem value="Full day">Full day</MenuItem>
                </Select>
                <Select
                  name="ageLimit"
                  label="Age Limit"
                  style={selectStyle}
                  value={formData.ageLimit}
                  onChange={(e) => setFormData({ ...formData, ageLimit: e.target.value })}
                  displayEmpty
                >
                  <MenuItem value="Select" disabled>
                    Select Age Limit
                  </MenuItem>
                  <MenuItem value="All Ages">All Ages</MenuItem>
                  <MenuItem value="18+">18+</MenuItem>
                  <MenuItem value="21+">21+</MenuItem>
                  <MenuItem value="No Limit">No Limit</MenuItem>
                </Select>
                <TextField
                  name="eventVenue"
                  label="Event Venue"
                  style={inputStyle}
                  margin="normal"
                  onChange={handleInputChange}
                  value={formData.eventVenue}
                />
                <TextField
                  name="eventCity"
                  label="Event City"
                  style={inputStyle}
                  margin="normal"
                  onChange={handleInputChange}
                  value={formData.eventCity}
                />
                <TextField
                  name="eventState"
                  label="Event State"
                  style={inputStyle}
                  margin="normal"
                  onChange={handleInputChange}
                  value={formData.eventState}
                />
                <TextField
                  name="artistName"
                  label="Artist Name"
                  style={inputStyle}
                  margin="normal"
                  onChange={handleInputChange}
                  value={formData.artistName}
                />
                <Select
                  name="eventLanguage"
                  label="Event Language"
                  style={selectStyle}
                  onChange={handleInputChange}
                  value={formData.eventLanguage}
                  displayEmpty
                >
                  <MenuItem value="Select" disabled>
                    Select Language
                  </MenuItem>
                  <MenuItem value="Telugu">Telugu</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                </Select>
                <TextField
                  name="eventFullInfo"
                  label="Event Full Info"
                  style={fullWidthInputStyle}
                  margin="normal"
                  value={formData.eventFullInfo}
                  multiline
                  rows={4}
                  onChange={(e) => setFormData({ ...formData, eventFullInfo: e.target.value })}
                />
                <TextField
                  name="eventShortInfo"
                  label="Event Short Info"
                  style={fullWidthInputStyle}
                  margin="normal"
                  value={formData.eventShortInfo}
                  multiline
                  rows={3}
                  onChange={(e) => setFormData({ ...formData, eventShortInfo: e.target.value })}
                />
                <TextField
                  name="noTickets"
                  label="No Tickets"
                  style={inputStyle}
                  margin="normal"
                  onChange={handleInputChange}
                  value={formData.noTickets}
                />
                <Select
                  labelId="event-status-label"
                  name="eventStatus"
                  style={selectStyle}
                  value={formData.eventStatus}
                  onChange={(e) => setFormData({ ...formData, eventStatus: e.target.value })}
                  displayEmpty
                >
                  <MenuItem value="Select" disabled>
                    Event Status
                  </MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Published">Published</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
                <TextField
                  name="thubImage"
                  type="file"
                  style={inputStyle}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleFileChange}
                  inputProps={{ accept: "image/*" }}
                />
                <TextField
                  name="multiIMages"
                  type="file"
                  style={inputStyle}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ multiple: true, accept: "image/*" }}
                  onChange={handleFileChange}
                />
                <MDBox
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    style={cancelButton}
                    onClick={() => navigate("/events")} // Navigate back to events listing page
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    style={submitButton}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default AddEvents;
