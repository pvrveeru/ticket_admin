import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardActions,
  CircularProgress,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import api from "../api";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const HomeBanners = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [type, setType] = useState("stype");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const inputStyle = { margin: "10px", width: "98%" };

  // Fetch gallery images when the component mounts
  const fetchImages = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("User not authenticated. Please log in.");
      navigate("/authentication/sign-in/");
      return;
    }

    const url = `/uploads/bannerImages`;
    setLoading(true);
    try {
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && Array.isArray(response.data.images)) {
        setImages(response.data.images);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0 || !type || !url) {
      alert("Please select files, type, and URL.");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("User not authenticated. Please log in.");
      navigate("/authentication/sign-in/");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file, file.name);
    });
    formData.append("type", type);
    formData.append("url", url);

    const requestOptions = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    setLoading(true);
    try {
      const response = await api.post(`/uploads/bannerImages`, formData, requestOptions);
      if (response.status === 200) {
        alert("Images uploaded successfully.");
        setSelectedFiles([]);
        setType("");
        setUrl("");
        await fetchImages();
      } else {
        console.error("Failed to upload images", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (url) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("User not authenticated. Please log in.");
      navigate("/authentication/sign-in/");
      return;
    }

    setLoading(true);
    const fileName = url.split("/").pop();

    try {
      const response = await api.delete(`/uploads/bannerImages/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Image deleted successfully.");
        setImages((prevImages) => prevImages.filter((image) => image.url !== url));
      } else {
        console.error("Failed to delete image", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <DashboardLayout>
      <div className="hide-on-desktop">
        <DashboardNavbar />
      </div>
      <MDBox pt={3} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                  Home Banners
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                {/* Form Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* File Upload */}
                  <TextField
                    type="file"
                    accept="image/*"
                    style={inputStyle}
                    inputProps={{ accept: "image/*", multiple: true }}
                    onChange={handleFileChange}
                  />
                  {/* Type */}
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    variant="outlined"
                    style={inputStyle}
                  >
                    <MenuItem value="stype" disabled style={{ lineHeight: "25px" }}>
                      Select Type
                    </MenuItem>
                    <MenuItem value="external">External</MenuItem>
                    <MenuItem value="internal">Internal</MenuItem>
                  </Select>
                  {/* URL */}
                  <TextField
                    label="URL"
                    variant="outlined"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={inputStyle}
                  />
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#25266d", color: "#fff" }}
                    onClick={handleFileUpload}
                    disabled={loading || selectedFiles.length === 0}
                  >
                    {loading ? (
                      <CircularProgress size={24} style={{ color: "#fff" }} />
                    ) : (
                      "Upload Images"
                    )}
                  </Button>
                </div>

                {/* Uploaded Images */}
                <div style={{ marginTop: "20px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                    {images.length > 0 ? (
                      images.map((item, index) => (
                        <Card
                          key={index}
                          style={{ width: "200px", position: "relative", marginBottom: "20px" }}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={item.imageUrl} // Use the image URL
                          />
                          <CardActions style={{ justifyContent: "center" }}>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDeleteImage(item.url)}
                              disabled={loading}
                            >
                              Delete
                            </Button>
                          </CardActions>
                          <div style={{ padding: "8px", textAlign: "center" }}>
                            <strong>Type:</strong> {item.type}
                            <br />
                            <strong>URL:</strong> {item.url}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p>No images uploaded yet.</p>
                    )}
                  </div>
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default HomeBanners;
