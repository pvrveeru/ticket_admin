import React, { useState, useEffect } from "react";
import { TextField, Button, TableContainer, Paper, CircularProgress } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import api from "../api";

const Seating = ({ eventId }) => {
  const [formData, setFormData] = useState({ zoneName: "", price: 0, seatsAvailable: 0 });
  const [zoneList, setZoneList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState(null);

  const tableCellStyle = { border: "1px solid #ddd", padding: "8px" };

  const handleZoneInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchZoneData = async () => {
    try {
      const response = await api.get(`/seating-options?eventId=${eventId}`);
      setZoneList(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching zone data:", error);
      alert("Failed to fetch zone data");
    }
  };

  const handleZoneSubmit = async () => {
    setLoading(true);
    const eventData = {
      eventId: Number(eventId),
      zoneName: formData.zoneName,
      price: parseFloat(formData.price),
      seatsAvailable: parseInt(formData.seatsAvailable, 10),
    };

    try {
      if (isEditing && editingZoneId) {
        // PUT request for updating
        await api.put(`/seating-options/${editingZoneId}`, eventData);
        alert("Zone updated successfully");
      } else {
        // POST request for creating
        await api.post("/seating-options", eventData);
        alert("Zone created successfully");
      }
      // Refresh the list and reset the form
      await fetchZoneData();
      setFormData({ zoneName: "", price: 0, seatsAvailable: 0 });
      setIsEditing(false);
      setEditingZoneId(null);
    } catch (error) {
      console.error("Error submitting zone:", error);
      alert("Failed to submit zone");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async (seatingId) => {
    try {
      await api.delete(`/seating-options/${seatingId}`);
      alert("Zone deleted successfully");
      fetchZoneData(); // Refresh the zone list
    } catch (error) {
      console.error("Error deleting zone:", error);
      alert("Failed to delete zone");
    }
  };

  const handleEditZone = (seatingId) => {
    const zoneToEdit = zoneList.find((zone) => zone.seatingId === seatingId);
    if (zoneToEdit) {
      setFormData({
        zoneName: zoneToEdit.zoneName,
        price: zoneToEdit.price,
        seatsAvailable: zoneToEdit.seatsAvailable || 0, // Handle null seatsAvailable
      });
      setIsEditing(true);
      setEditingZoneId(seatingId); // Save the ID of the zone being edited
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchZoneData();
    }
  }, [eventId]);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <TextField
          label="Zone Name"
          name="zoneName"
          value={formData.zoneName}
          onChange={handleZoneInputChange}
          style={{ width: "30%", margin: "10px 25px", lineHeight: "44px" }}
        />
        <TextField
          label="Zone Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleZoneInputChange}
          style={{ width: "30%", margin: "10px 25px", lineHeight: "44px" }}
        />
        <TextField
          label="Zone seatsAvailable"
          name="seatsAvailable"
          type="number"
          value={formData.seatsAvailable}
          onChange={handleZoneInputChange}
          style={{ width: "30%", margin: "10px 25px", lineHeight: "44px" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button
          variant="contained"
          style={{ backgroundColor: "#25266d", color: "#fff", margin: "10px" }}
          onClick={handleZoneSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} style={{ color: "#fff" }} />
          ) : isEditing ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Button>
      </div>
      <TableContainer component={Paper} style={{ borderRadius: 0, boxShadow: "none" }}>
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
              <th style={tableCellStyle}>Zone</th>
              <th style={tableCellStyle}>Price</th>
              <th style={tableCellStyle}>Seating</th>
              <th style={tableCellStyle}>Action</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {zoneList.map((zone) => (
              <tr key={zone.seatingId}>
                <td style={tableCellStyle}>{zone.zoneName}</td>
                <td style={tableCellStyle}>{zone.price}</td>
                <td style={tableCellStyle}>{zone.seatsAvailable || "N/A"}</td>
                <td style={tableCellStyle}>
                  <Button
                    style={{ marginRight: "10px" }}
                    variant="contained"
                    color="info"
                    onClick={() => handleEditZone(zone.seatingId)} // Use seatingId here
                  >
                    <CreateIcon />
                  </Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteZone(zone.seatingId)} // Use seatingId here
                  >
                    <DeleteIcon />
                  </Button>
                </td>
              </tr>
            ))}
            {zoneList.length === 0 && (
              <tr>
                <td colSpan="4" style={tableCellStyle}>
                  No zones available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableContainer>
    </div>
  );
};

Seating.propTypes = {
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Seating;
