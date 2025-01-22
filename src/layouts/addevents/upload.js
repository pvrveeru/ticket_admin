import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress, Card, CardMedia, CardActions } from "@mui/material";
import PropTypes from "prop-types";
import api from "../api";
import LayoutImage from "./layoutImage";
import Gallery from "./gallery";

const Upload = ({ eventId, thumbUrl, layoutImageUrl, galleryImages }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // Store all uploaded image URLs

  const inputStyle = { margin: "10px", width: "100%" };

  // Sync `thumbUrl` with `images` state when the component mounts or `thumbUrl` changes
  useEffect(() => {
    console.log("Received eventId222upload:", galleryImages);
    console.log("Received eventId222:", thumbUrl);

    if (thumbUrl) {
      setImages([thumbUrl]); // Initialize with `thumbUrl` if provided
    }
  }, [thumbUrl]);

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
      const response = await api.post(
        `/uploads/event/thumbnail/${eventId}`,
        formData,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.statusText}`);
      }
      const result = await response.text();
      alert("Image uploaded successfully.");
      console.log(result);
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
      await api.delete(`/uploads/event/thumbnail/${eventId}/${fileName}`);
      alert("Image deleted successfully.");
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
        <h3>Upload thumbnail</h3>
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
          {thumbUrl && (
            <Card key="thumbUrl" style={{ width: "200px", position: "relative" }}>
              <CardMedia
                component="img"
                height="140"
                image={thumbUrl} // Use thumbUrl as the primary image
                alt="Thumbnail"
              />
              <CardActions style={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteImage(thumbUrl)} // Use thumbUrl for deletion
                  disabled={loading}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          )}
          {images
            .filter((url) => url !== thumbUrl) // Avoid duplicating thumbUrl
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
        {images.length === 0 && !thumbUrl && <p>No images uploaded yet.</p>}
      </div>
      <LayoutImage eventId={eventId} thumbUrl={thumbUrl} layoutImageUrl={layoutImageUrl} />
      <Gallery
        eventId={eventId}
        thumbUrl={thumbUrl}
        layoutImageUrl={layoutImageUrl}
        galleryImages={galleryImages}
      />
    </div>
  );
};

Upload.propTypes = {
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  thumbUrl: PropTypes.string, // Accept thumbUrl as a prop
  layoutImageUrl: PropTypes.string, // Accept thumbUrl as a prop
  galleryImages: PropTypes.arrayOf(PropTypes.string), // Expect an array of strings (URLs)
};

export default Upload;
