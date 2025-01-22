import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress, Card, CardMedia, CardActions } from "@mui/material";
import PropTypes from "prop-types";
import api from "../api";

const Gallery = ({ eventId, layoutImageUrl, galleryImages }) => {
  const [selectedFiles, setSelectedFiles] = useState([]); // To store selected files
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(galleryImages || []); // Start with provided gallery images

  const inputStyle = { margin: "10px", width: "100%" };

  useEffect(() => {
    if (galleryImages) {
      setImages([galleryImages]); // Initialize with `thumbUrl` if provided
    }
  }, [galleryImages]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Get all selected files
    setSelectedFiles(files);
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file, file.name); // Append each selected file
    });

    const requestOptions = {
      headers: {
        "Content-Type": "multipart/form-data", // Make sure to set the content type for file upload
      },
    };

    setLoading(true);
    try {
      const response = await api.post(
        `/uploads/event/gallery/${eventId}`,
        formData,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.statusText}`);
      }
      const result = await response.text();
      alert("Images uploaded successfully.");
      console.log(result);
      // Optionally, update the images state here if the response contains the new images
    } catch (error) {
      console.error("Error:", error);
      //alert(`Failed to upload images: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (url) => {
    setLoading(true);
    const fileName = url.split("/").pop(); // This will get the last part of the URL (the file name)

    try {
      await api.delete(`/uploads/event/gallery/${eventId}/${fileName}`);
      alert("Image deleted successfully.");
      setImages((prevImages) => prevImages.filter((image) => image !== url)); // Remove image locally
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* File upload section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ marginTop: "20px" }}>Upload Gallery Images</h3>
        <TextField
          name="thumbnail"
          type="file"
          accept="image/*"
          style={inputStyle}
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: "image/*", multiple: true }} // Enable multiple file selection
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          style={{ backgroundColor: "#25266d", color: "#fff" }}
          onClick={handleFileUpload}
          disabled={loading || selectedFiles.length === 0}
        >
          {loading ? <CircularProgress size={24} style={{ color: "#fff" }} /> : "Upload Images"}
        </Button>
      </div>

      {/* Uploaded images list */}
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {/* Ensure galleryImages is always used */}
          {galleryImages &&
            Array.isArray(galleryImages) &&
            galleryImages.map((url, index) => (
              <Card key={index} style={{ width: "200px", position: "relative" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={url} // Use each URL in the galleryImages array
                  alt={`Image ${index + 1}`}
                />
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteImage(url)} // Pass the URL of the image for deletion
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          {images
            .filter((url) => url !== galleryImages) // Avoid duplicating thumbUrl
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

Gallery.propTypes = {
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  layoutImageUrl: PropTypes.string, // Accept layoutImageUrl as a prop
  galleryImages: PropTypes.arrayOf(PropTypes.string), // Expect an array of strings (URLs)
};

export default Gallery;
