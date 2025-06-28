import React, { useEffect, useState } from "react";
import axios from "axios";

const TenantRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this with actual token from login state
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("https://room-finder-1ayo.onrender.com/api/tenant/requests/", {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tenant requests:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading requests...</p>;

  return (
    <div className="container mt-4">
      <h2>Your Sent Requests</h2>
      {requests.length === 0 ? (
        <p>No requests sent yet.</p>
      ) : (
        <div className="row">
          {requests.map((req) => (
            <div key={req.id} className="card mb-3 p-3">
              <h5>Property: {req.property_name}</h5>
              <p>Status: <strong>{req.status}</strong></p>
              <p>Message: {req.message || "No message"}</p>
              <p>Sent on: {new Date(req.timestamp).toLocaleString()}</p>

              {/* Show owner contact if accepted */}
              {req.status === "accepted" && (
                <div className="mt-2 p-2 bg-light rounded">
                  <p>Owner Name: {req.owner_name}</p>
                  <p>Email: {req.owner_email}</p>
                  <p>Mobile: {req.owner_mobile}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantRequests;
