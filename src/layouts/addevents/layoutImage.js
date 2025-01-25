import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress, Card, CardMedia, CardActions } from "@mui/material";
import PropTypes from "prop-types";
import api from "../api";

const LayoutImage = ({ eventId, thumbUrl, layoutImageUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // Store all uploaded image URLs

  const inputStyle = { margin: "10px", width: "100%" };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/uploads/event/layout/${eventId}`);
      console.log("API Response:", response.data); // Log the full response to debug
      if (response.status === 200) {
        // Check if 'images' exists and is an array
        if (Array.isArray(response.data.images)) {
          setImages(response.data.images); // Set the fetched images
        } else {
          console.warn("Images data is not an array or is missing.");
          setImages([]); // Fallback to an empty array
        }
      } else {
        console.error("Failed to fetch images", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile, selectedFile.name);

    const requestOptions = {
      headers: {
        "Content-Type": "multipart/form-data", // Make sure to set the content type for file upload
      },
    };

    setLoading(true);
    try {
      const response = await api.post(`/uploads/event/layout/${eventId}`, formData, requestOptions);
      if (response.status === 200) {
        alert("Images uploaded successfully.");
        await fetchImages();
        // Append newly uploaded images to the existing ones
        setImages((prevImages) => [
          ...prevImages,
          ...(Array.isArray(response.data.images) ? response.data.images : []),
        ]);
      } else {
        console.error("Failed to upload images", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
      //alert(`Failed to upload image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (url) => {
    setLoading(true);
    const fileName = url.split("/").pop(); // This will get the last part of the URL (the file name)
    try {
      const response = await api.delete(`/uploads/event/layout/${eventId}`);
      if (response.status === 200) {
        alert("Image deleted successfully.");
        await fetchImages();
        setImages((prevImages) => prevImages.filter((image) => image !== url)); // Remove deleted image locally
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
    if (eventId) {
      fetchImages();
    }
  }, [eventId]);

  return (
    <div>
      {/* File upload section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ marginTop: "20px" }}>Upload Layout Image</h3>
        <TextField
          name="thumbnail"
          type="file"
          accept="image/*"
          style={inputStyle}
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: "image/*" }}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          style={{ backgroundColor: "#25266d", color: "#fff" }}
          onClick={handleFileUpload}
          disabled={loading || !selectedFile}
        >
          {loading ? <CircularProgress size={24} style={{ color: "#fff" }} /> : "Upload Image"}
        </Button>
      </div>

      {/* Uploaded images list */}
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {/* Ensure thumbUrl is always used */}
          {layoutImageUrl && (
            <Card key="layoutImageUrl" style={{ width: "200px", position: "relative" }}>
              <CardMedia
                component="img"
                height="140"
                image={layoutImageUrl} // Use thumbUrl as the primary image
                alt="Thumbnail"
              />
              <CardActions style={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteImage(layoutImageUrl)} // Use thumbUrl for deletion
                  disabled={loading}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          )}
          {images
            .filter((url) => url !== layoutImageUrl) // Avoid duplicating thumbUrl
            .map((url, index) => (
              <Card key={index} style={{ width: "200px", position: "relative" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={url} // Use the full URL from the API response
                  alt={`Image ${index + 1}`}
                />
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteImage(url)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
        </div>
        {images.length === 0 && !layoutImageUrl && <p>No images uploaded yet.</p>}
      </div>
    </div>
  );
};

LayoutImage.propTypes = {
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  thumbUrl: PropTypes.string, // Accept thumbUrl as a prop
  layoutImageUrl: PropTypes.string, // Accept layoutImageUrl as a prop
};

export default LayoutImage;
