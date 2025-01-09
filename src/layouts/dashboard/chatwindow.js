import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import api from "../api";
import "./chatwindow.css"; // Assuming styles are handled here
import CircularProgress from "@mui/material/CircularProgress";

const ChatWindow = ({ flightNumber: initialFlightNumber }) => {
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // State to track minimized/maximized state
  const [flightNumber, setFlightNumber] = useState(initialFlightNumber); // State for flight number

  const token = localStorage.getItem("userToken");

  // Debounce function to delay API call until user stops typing
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Fetch passenger details when flight number changes
  const fetchPassengers = useCallback(
    debounce(async () => {
      if (!initialFlightNumber.trim()) {
        setError("Please provide flight number.");
        return;
      }

      const url = `Report/ProcessedRecords?flightNumber=${initialFlightNumber}`;

      console.log("CW:", initialFlightNumber);
      console.log("CW:", url);

      setLoading(true);
      try {
        const response = await api.get(url, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.processRecords) {
          setPassengers(response.data.processRecords);
        } else {
          setPassengers([]); // Set to empty if not found
        }
      } catch (error) {
        console.error("Error fetching passenger data:", error);
        setPassengers([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [token, flightNumber] // Add flightNumber as a dependency
  );

  useEffect(() => {
    fetchPassengers(); // Call on component mount
    const intervalId = setInterval(() => {
      fetchPassengers(); // Call periodically
    }, 8000);

    return () => clearInterval(intervalId);
  }, [fetchPassengers]);

  // Toggle between minimize and maximize
  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: isMinimized ? "242px" : "242px", // Adjust width when minimized
        height: isMinimized ? "50px" : "380px", // Adjust height for collapse/expand
        border: "1px solid #ccc",
        padding: "10px",
        backgroundColor: "white",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        transition: "height 0.3s ease", // Smooth transition between collapse and expand
      }}
      className="chat-window"
    >
      {/* Header with Minimize/Maximize icons */}
      <div
        className="chat-window-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h4 style={{ margin: 0 }}>E-Gate Passenger List ({passengers.length})</h4>
        <button
          className="chat-button"
          onClick={toggleMinimize}
          style={{
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {isMinimized ? "▼" : "▲"}
        </button>
      </div>

      {/* Conditional rendering based on minimized state */}
      {!isMinimized && (
        <div className="chat-window-content" style={{ marginTop: "10px" }}>
          <input
            type="text"
            disabled
            placeholder="Enter Flight Number"
            value={initialFlightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px", display: "none" }}
          />
          <div>
            {loading ? (
              <CircularProgress />
            ) : (
              <ul className="passenger-list">
                {passengers.length > 0 ? (
                  passengers.map((passenger) => (
                    <li key={passenger.sNo}>
                      <p>{passenger.name}</p> <span>{passenger.status}</span>
                    </li>
                  ))
                ) : (
                  <h6>No passengers found</h6>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ChatWindow.propTypes = {
  flightNumber: PropTypes.string.isRequired, // flightNumber should be a string and required
};

export default ChatWindow;
