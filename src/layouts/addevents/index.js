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
import { useLocation, useNavigate } from "react-router-dom";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axios from "axios";
import "../styles.css"; // Custom styles
import api from "../api";
import { useParams } from "react-router-dom";
import { boolean } from "yup";
import { CheckOutlined } from "@mui/icons-material";

const AddEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = location.state?.eventId || null;
  //const { eventId } = useParams();

  const [formData, setFormData] = useState({
    type: "",
    title: "",
    startDate: "",
    endDate: "",
    eventDate: "",
    duration: "",
    ageLimit: "",
    location: "",
    city: "",
    state: "",
    artistName: "",
    language: "",
    description: "",
    brief: "",
    noOfTickets: "",
    status: "",
    thumbUrl: null,
    isPopular: false,
    isFeatured: false,
    isManual: false,
  });

  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(name, checked, Boolean(checked)); // Logs the name, checked value, and its boolean conversion
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
    Object.entries(formData).forEach(([key, value]) => {
      eventData.append(key, value);
    });

    try {
      const response = await api.post("/events", eventData);
      alert("Event created successfully");
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (eventId) {
      const fetchEventData = async () => {
        try {
          const response = await api.get(`/events/${eventId}`);
          const data = response.data.data;
          console.log(data);
          setFormData({
            type: data.type || "",
            title: data.title || "",
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            eventDate: data.eventDate || "",
            duration: data.duration || "",
            ageLimit: data.ageLimit || "",
            location: data.location || "",
            city: data.city || "",
            state: data.state || "",
            artistName: data.artistName || "",
            language: data.language || "",
            description: data.description || "",
            brief: data.brief || "",
            noOfTickets: data.noOfTickets || "",
            status: data.status || "",
            isPopular: data.isPopular || false,
            isFeatured: data.isFeatured || false,
            isManual: data.isManual || false,
          });
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };

      fetchEventData();
    }
  }, [eventId]);

  const updateEvent = async () => {
    setLoading(true);

    try {
      await api.put(`/events/${eventId}`, formData);
      alert("Event updated successfully");
      navigate("/events");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

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
                <MDBox style={{ display: "flex" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isPopular}
                        onChange={handleCheckboxChange}
                        name="isPopular"
                      />
                    }
                    label="Popular Event"
                    style={inputStyle}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isFeatured}
                        onChange={handleCheckboxChange}
                        name="isFeatured"
                      />
                    }
                    label="Featured Event"
                    style={inputStyle}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isManual}
                        onChange={handleCheckboxChange}
                        name="isManual"
                      />
                    }
                    label="Manual Ticket"
                    style={inputStyle}
                  />
                </MDBox>
                <Select
                  name="type"
                  style={inputStyle}
                  value={formData.type || ""} // Ensure it defaults to an empty string
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Event Type
                  </MenuItem>
                  {eventTypes && Array.isArray(eventTypes) && eventTypes.length > 0 ? (
                    eventTypes.map((type) => (
                      <MenuItem key={type.categoryId} value={type.name}>
                        {type.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Event Types Available</MenuItem>
                  )}
                </Select>
                <TextField
                  name="title"
                  label="Event Name"
                  style={inputStyle}
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <TextField
                  name="startDate"
                  label="Event Start Date"
                  type="datetime-local"
                  style={inputStyle}
                  value={formData.startDate ? formData.startDate.slice(0, 16) : ""}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="endDate"
                  label="Event End Date"
                  type="datetime-local"
                  style={inputStyle}
                  value={formData.endDate ? formData.endDate.slice(0, 16) : ""}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="eventDate"
                  label="Event Date"
                  type="date"
                  style={inputStyle}
                  value={formData.eventDate ? formData.eventDate.slice(0, 10) : ""}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
                <Select
                  name="duration"
                  style={selectStyle}
                  value={formData.duration || ""} // Default to empty string
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
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
                  style={selectStyle}
                  value={formData.ageLimit || ""} // Default to empty string
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Age Limit
                  </MenuItem>
                  <MenuItem value="All Ages">All Ages</MenuItem>
                  <MenuItem value="18+">18+</MenuItem>
                  <MenuItem value="21+">21+</MenuItem>
                  <MenuItem value="No Limit">No Limit</MenuItem>
                </Select>

                <TextField
                  name="location"
                  label="Event Venue"
                  style={inputStyle}
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <TextField
                  name="city"
                  label="Event City"
                  style={inputStyle}
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <TextField
                  name="state"
                  label="Event State"
                  style={inputStyle}
                  value={formData.state}
                  onChange={handleInputChange}
                />
                <TextField
                  name="artistName"
                  label="Artist Name"
                  style={inputStyle}
                  value={formData.artistName}
                  onChange={handleInputChange}
                />
                <Select
                  name="language"
                  style={selectStyle}
                  value={formData.language}
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Language
                  </MenuItem>
                  <MenuItem value="Telugu">Telugu</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                </Select>
                <TextField
                  name="description"
                  label="Event Full Info"
                  style={fullWidthInputStyle}
                  value={formData.description}
                  multiline
                  rows={4}
                  onChange={handleInputChange}
                />
                <TextField
                  name="brief"
                  label="Event Short Info"
                  style={fullWidthInputStyle}
                  value={formData.brief}
                  multiline
                  rows={3}
                  onChange={handleInputChange}
                />
                <TextField
                  name="noOfTickets"
                  label="No Tickets"
                  style={inputStyle}
                  value={formData.noOfTickets}
                  onChange={handleInputChange}
                />
                <Select
                  name="status"
                  style={selectStyle}
                  value={formData.status}
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
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
                <MDBox style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <Button
                    variant="contained"
                    style={cancelButton}
                    onClick={() => navigate("/events")}
                  >
                    Cancel
                  </Button>
                  {eventId ? (
                    <Button
                      variant="contained"
                      style={submitButton}
                      onClick={updateEvent}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      style={submitButton}
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  )}
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
