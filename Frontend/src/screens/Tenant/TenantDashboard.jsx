import React from "react";
import { Link } from "react-router-dom";
import { useState,useEffect} from "react";
import profile from '../../assets/dummyProfile.jpeg'
import axios from "axios";
import phone from '../../assets/phone.png'
import email from '../../assets/email.png'
import RequestSendModal from "../../utils/RequestSendModal";

const TenantDashboard = () => {

  const [selectedFilters, setSelectedFilters] = useState([]);
//  const [sendrequest, setSendrequest] = useState(false);
  const [activity, setActivity] = useState([]); //to show data in activity table

  const [gettingOwnersProperty, setgettingOwnersProperty] = useState([]);
  const [loadingProperty, setLoadingProperty] = useState(true);  // initially true
  const [requestedProperties, setRequestedProperties] = useState({});
  const [loadingRequest, setLoadingRequest] = useState({});
  
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");


  const facilityNameMap = {
  facility0: "RO",
  facility1: "Furnished",
  facility2: "Laundry",
  facility3: "WiFi",
  // add other mappings if needed
};

 const handleSendRequest = async (propertyId) => {
  const token = localStorage.getItem('tenant_token');
  console.log("Token:", token);

  if (!token) {
    alert("You need to log in first!");
    return;
  }
  
  // Set loading for this property
  setLoadingRequest((prev) => ({ ...prev, [propertyId]: true }));
  const isRequested = requestedProperties[propertyId];

  try {
    if (isRequested) {
      // ❌ UNSEND REQUEST - DELETE
      const response = await axios.delete(
        `http://localhost:8000/api/requests/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     setModalMessage("Request deleted successfully!");
     setShowModal(true);
      console.log("Delete Response:", response.data);
    } else {
      // ✅ SEND REQUEST - POST
      const response = await axios.post(
      "http://localhost:8000/api/requests/",
      { property_id: propertyId },  // ✅ Body
       
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

     setModalMessage("Request sent successfully!");
     setShowModal(true);
      console.log("Send Response:", response.data);
    }

    // Toggle request state after success
    setRequestedProperties((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  } catch (error) {
    console.error("Error during send/unsend request:", error);

    if (error.response) {
      const msg = error.response.data.detail || error.response.data.message || "Something went wrong";
      alert("Error: " + msg);
    } else {
      alert("Network error or server is down.");
    }
  }finally {
    // Stop spinner
    setLoadingRequest((prev) => ({ ...prev, [propertyId]: false }));
  }
};

// useEffect(() => {
//   if (showModal) {
//     const timer = setTimeout(() => setShowModal(false), 3000);
//     return () => clearTimeout(timer);
//   }
// }, [showModal]);


useEffect(() => {
  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem("tenant_token");
      const res = await axios.get("http://localhost:8000/api/requests/tenant", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActivity(res.data);
    } catch (error) {
      console.error("Failed to fetch tenant requests:", error);
    }
  };

  fetchActivity();
}, []);



 useEffect(() => {
  const fetchRequestedProperties = async () => {
    const token = localStorage.getItem("tenant_token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/requests/requested-ids/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const requestedIds = response.data.requested_property_ids;
      const mapping = {};
      requestedIds.forEach(id => {
        mapping[id] = true;
      });

      setRequestedProperties(mapping);
    } catch (error) {
      console.error("Failed to fetch requested properties:", error);
    }
  };

  fetchRequestedProperties();
}, []);




  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedFilters((prev) => [...prev, value]);
    } else {
      setSelectedFilters((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleSearch = async () => {
  const selected = [...selectedFilters]; // your state array
  const { roomTypes, locations, rent } = parseFilters(selected);
  console.log("Filters : ",selected)

  try {
    const response = await axios.get("http://localhost:8000/api/properties/", {
      params: {
        room_types: roomTypes.join(","),
        locations: locations.join(","),
        min_rent: rent || "",
      },
      
    });

    console.log(response.data); // filtered properties
    setgettingOwnersProperty(response.data); // update state
  } catch (error) {
    console.error("Error fetching filtered properties:", error);
  }
};



  const roomTypes = ['1RK', '1BHK', '2BHK', '3BHK'];
  const locations = ['Bholaram', 'Bhawarkua', 'Vishnupuri', 'Khandwa Naka'];
  const rents = ['4000', '5000', '6000'];


  const parseFilters = (filtersArray) => {
  const roomTypes = [];
  const locations = [];
  let rent = null;

  filtersArray.forEach((item) => {
    if (item.startsWith("rent-")) {
      rent = item.split("-")[1]; // 4000
    } else if (["1bhk", "2bhk", "3bhk", "1rk"].includes(item)) {
      roomTypes.push(item);
    } else {
      locations.push(item);
    }
  });

  return { roomTypes, locations, rent };
};


  useEffect(() => {
  const fetchAllProperties = async () => {
    const token = localStorage.getItem('tenant_token');  // get saved token
  console.log("Token : ",token);
  if (!token) {
    console.log("User not logged in");
    return;
  }
    try {
      const response = await axios.get("http://localhost:8000/api/properties/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      console.log("Response : ",response.data)
      setgettingOwnersProperty(response.data);
    } catch (error) {
      console.error("Error fetching tenant properties:", error);
    } finally {
      setLoadingProperty(false);
    }
  };

  fetchAllProperties();
}, []);

 
  return (
    
    <div className="container-fluid">
      <RequestSendModal
  show={showModal}
  message={modalMessage}
  onClose={() => setShowModal(false)}
/>

  <div className="row min-vh-100">
    {/* Sidebar for md and above */}
    <div className="col-md-2 d-none d-md-block bg-dark text-white p-3 min-vh-100  position-fixed top-0 start-0">
                  <div className="d-flex align-items-center flex-row justify-content-start align-items-center">
                    <img src={profile} alt=""
                    style={{
                      width : 40,
                      height : 40,
                      borderRadius : '50%'
                    }}/>
                    <p className="h6 ms-2 fs-5 text-primary">{localStorage.getItem("Name")}</p>
                  </div>
      <hr />
      <ul className="nav flex-column">
        <li className="nav-item">
          <a href="#" className="nav-link text-white fs-5 fw-bold">My property</a>
        </li>
        <li className="nav-item">
          <Link to='/tenantrequest' className="nav-link text-white fs-5 fw-bold">My requests</Link>
        </li>
        <li className="nav-item">
          <Link to='/messages' className="nav-link text-white fs-5 fw-bold">Messages</Link>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white fs-5 fw-bold">Payment details</a>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link text-danger fs-5 fw-bold"><u>Logout</u></Link>
        </li>
      </ul>
    </div>

    {/* Navbar for small screens */}
    <nav className="navbar navbar-dark  navbar-expand-lg  bg-dark d-md-none position-sticky top-0 z-3 rounded-4 px-3">
      <div className="container-fluid">
       <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" ></span>
                </button>
         <div
                          class="collapse navbar-collapse"
                          id="navbarSupportedContent"
                        >
                          <ul class="navbar-nav mr-auto">
                            <li class="nav-item active my-1">
                              <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                                My property
                              </a>
                            </li>
                            <li class="nav-item my-1">
                              <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                                My profile
                              </a>
                            </li>
                            <li class="nav-item my-1">
                              <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                                Messages
                              </a>
                            </li>
                            <li class="nav-item my-1">
                              <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                                Payment details
                              </a>
                            </li>
                            <li class="nav-item my-1">
                             <Link to="/login" style={{
                              textDecoration : "none",
                             
                              
                             }} className="fw-bold text-danger">Logout</Link>
                            </li>
                          </ul>
                        </div>
        
      </div>
      
    </nav>

    {/* Collapsible sidebar for small screens
    <div className="collapse bg-dark text-white d-md-none p-3" id="tenantSidebar">
      <ul className="nav flex-column">
        <li className="nav-item">
          <a href="#" className="nav-link text-white">Dashboard</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">My Rent</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">Property Details</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">Messages</a>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link text-white">Logout</Link>
        </li>
      </ul>
    </div> */}

    {/* Main content */}
    <div className="col-md-10 offset-md-2">
      {/* Top Navbar */}
      <nav className="navbar navbar-light px-4 my-2" style={{
         backgroundColor : '#669bbc',
  padding : 10,
  borderRadius : 10
      }}>
        <span className="navbar-brand mb-0 h1">Welcome, Tenant</span>
      </nav>
    

      {/* Dashboard Content */}
      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Rent Status</h5>
                <p className="card-text">Next Rent Due: 15th May 2025</p>
                <p className="card-text">Status: <strong>Paid</strong></p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Property Info</h5>
                <p className="card-text">Flat No: A-203</p>
                <p className="card-text">Owner: Mr. Sharma</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h5 className="card-title">Messages</h5>
                <p className="card-text">2 new messages from Owner</p>
                <a href="#" className="btn btn-light btn-sm">View Messages</a>
              </div>
            </div>
          </div>
        </div>



 <div className="row align-items-center my-3" style={{
  backgroundColor : '#e5e5e5',
  padding : 10,
  borderRadius : 10
 }}>
      <div className="col-md-9">
  <div className="dropdown">
    <button
      className="btn btn-dark dropdown-toggle py-2 px-4"
      type="button"
      data-bs-toggle="dropdown"
      style={{ fontSize: '1.1rem', minWidth: '100%' }}
    >
      Filter by Room Type, Location, Rent
    </button>
    <div
      className="dropdown-menu p-3"
      style={{ width: '100%', maxWidth: '100%', fontSize: '1rem' }}
    >
      <div className="d-flex justify-content-between flex-wrap gap-4">

        {/* Room Type */}
        <div>
          <strong>Room Type</strong>
          {roomTypes.map((type) => (
            <div className="form-check" key={type}>
              <input
                className="form-check-input room-filter"
                type="checkbox"
                value={type.toLowerCase()}
                id={`filter-${type}`}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor={`filter-${type}`}>
                {type}
              </label>
            </div>
          ))}
        </div>

        {/* Location */}
        <div>
          <strong>Location</strong>
          {locations.map((loc) => (
            <div className="form-check" key={loc}>
              <input
                className="form-check-input room-filter"
                type="checkbox"
                value={loc.toLowerCase()}
                id={`filter-${loc}`}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor={`filter-${loc}`}>
                {loc}
              </label>
            </div>
          ))}
        </div>

        {/* Rent */}
        <div>
          <strong>Rent From</strong>
          {rents.map((rent) => (
            <div className="form-check" key={rent}>
              <input
                className="form-check-input room-filter"
                type="checkbox"
                value={`rent-${rent}`}
                id={`filter-rent-${rent}`}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor={`filter-rent-${rent}`}>
                ₹{rent}+
              </label>
            </div>
          ))}
        </div>

      </div>
    </div>
  </div>
</div>

      <div className="col-md-3 text-end mt-3 mt-md-0">
        <button
          className="btn btn-primary px-4 py-2"
          style={{ fontSize: '1.1rem' }}
          onClick={()=>handleSearch()}
        >
          Search
        </button>
      </div>
    </div>
     {loadingProperty ? (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
    <span className="text-primary fw-bold  me-2"><span className="text-danger">Wait</span> getting properties</span>
    <div className="spinner-grow text-danger" role="status">
      
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
): (gettingOwnersProperty.slice().map((property) => (
  <div key={property._id} className="card my-3" style={{ backgroundColor: "#eee4e1" }}>
    <div className="row g-0"> {/* Bootstrap row with no gutters */}
      
      {/* LEFT SIDE - Property Info */}
      <div className="col-md-6 p-3">
        <div className="card-body">
          <h5 className="card-title" style={{
            color : "#14213d"
          }}>{property.building_name} | {property.owner_name}</h5>
          <em className="card-text my-1 text-secondary">
            {property.address}, {property.city}, {property.state} - {property.pincode}
          </em>
          <p><strong>Contact:</strong> <img src={email} alt="" width={20}/> {property.email} | <img src={phone} alt="" width={20} /> {property.mobile}</p>
          <p style={{marginTop : -5}}><strong>Rent:</strong> ₹{property.rent_from} - ₹{property.rent_to}</p>

          <div className="row">
            <div className="col-sm-6">
              <p><strong>Room Types:</strong></p>
              <ul>
                {property.room_types.map((room, idx) => (
                  <li key={idx}>{room.type}</li>
                ))}
              </ul>
            </div>

            <div className="col-sm-6">
              <p><strong>Facilities:</strong></p>
              <ul>
                {Object.entries(property.facilities)
                  .filter(([, isAvailable]) => isAvailable)
                  .map(([facilityKey]) => (
                    <li key={facilityKey}>
                      {facilityNameMap[facilityKey] || facilityKey}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
         <button
  className="btn btn-primary"
  onClick={() => handleSendRequest(property._id)}
  disabled={loadingRequest[property._id]}  // Optional: disable while loading
>
  {loadingRequest[property._id] ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Loading...
    </>
  ) : (
    requestedProperties[property._id] ? "Unsend Request" : "Send Request"
  )}
</button>

            <div> {requestedProperties[property._id] && (
              <em className="blink-text">You requested this property, check messages for owner response</em>

            )}</div>
        </div>
      </div>

      {/* RIGHT SIDE - Image */}
      <div className="col-md-6 d-flex justify-content-end align-items-center pe-5">
  <img
    src={`${property.building_image}`}
    
    alt={property.building_name}
    style={{ width: "300px", height: "250px", objectFit: "cover", borderRadius: "8px",border : "4px solid white" }}
  />
</div>
    </div>
  </div>
)))}


<div className="mt-5">
  <h4>Recent Activity</h4>
  <table className="table table-bordered table-striped mt-3">
    <thead className="table-dark">
      <tr>
        <th>Date</th>
        <th>Activity</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {activity.length === 0 ? (
        <tr>
          <td colSpan="3" className="text-center text-muted">No activity yet.</td>
        </tr>
      ) : (
        activity.map((item) => (
          <tr key={item.id}>
            <td>{new Date(item.timestamp).toLocaleDateString()}</td>
            <td>Requested {item.property_name}</td>
            <td>
              <span className={`badge ${
                item.status === "accepted" ? "bg-success" :
                item.status === "pending" ? "bg-warning text-dark" : 
                "bg-danger"
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

      </div>
    </div>
  </div>
</div>

  );
};

export default TenantDashboard;