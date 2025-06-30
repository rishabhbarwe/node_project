import React, { useEffect, useState } from "react";
import axios from "axios";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("tenant_token"); // assuming you're storing token

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/requests/tenant/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;

        // Generate readable messages
        const formattedMessages = data.map((req) => {
          if (req.status === "accepted") {
            return {
              id: req.id,
              text: `✅ Your request for "${req.property_name}" was accepted.\nContact Owner: ${req.owner_name}, ${req.owner_email}, ${req.owner_mobile}`,
            };
          } else if (req.status === "rejected") {
            return {
              id: req.id,
              text: `❌ Your request for "${req.property_name}" was rejected.`,
            };
          } else {
            return {
              id: req.id,
              text: `⌛ Your request for "${req.property_name}" is still pending.`,
            };
          }
        });

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch tenant messages:", error);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Your Messages</h4>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="list-group">
          {messages.map((msg) => (
            <li key={msg.id} className="list-group-item">
              {msg.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
