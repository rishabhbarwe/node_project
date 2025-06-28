import React,{useEffect, useState} from "react";
import Spinner from "../../utils/Spinner";
import ValidatePropertyDetails from "../../utils/ValidatePropertyDetails";
import { Link, useNavigate } from "react-router-dom";
import profile from '../../assets/dummyProfile.jpeg'
import logo1 from '../../assets/logo.png'
import OwnerProfileModal from "../../utils/OwnerProfileModal";


import axios from "axios";

const OwnerDashboard = () => {

const [gettingOwnersProperty, setgettingOwnersProperty] = useState([]);
const [loadingProperty, setLoadingProperty] = useState(true);  // initially true
const [requests, setRequests] = useState([]);
//const [loadingRequest, setLoadingRequest] = useState(true);

useEffect(() => {
    
    const fetchRequests = async () => {
      try {
        const response = await axios.get("https://room-finder-1ayo.onrender.com/api/owner/requests/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("owner_token")}`
          }
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching owner requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

    const handleAction = async (requestId, action) => {
    try {
      await axios.patch(
        `https://room-finder-1ayo.onrender.com/api/request/update/${requestId}/`,
        { status: action },
        { headers: { Authorization: `Token ${localStorage.getItem("owner_token")}` } }
      );
      // Refresh list after update
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: action } : req
        )
      );
    } catch (error) {
      console.error(`Error updating request status:`, error);
    }
  };
  
useEffect(() => {
  const fetchMyProperties = async () => {
  const token = localStorage.getItem('owner_token');  // get saved token
  console.log("Token : ",token);
  if (!token) {
    console.log("User not logged in");
    return;
  }

  try {
    const response = await axios.get('https://room-finder-1ayo.onrender.com/api/my-properties/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log("Properties:", response.data);
   
    setgettingOwnersProperty(response.data);
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }
  finally {
      setLoadingProperty(false);  // done loading
    }
};
    fetchMyProperties();
}, []);

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowmodal] = useState(false);


  const initialFormData = {
  buildingName: "",
  ownerName: "",
  buildingImage: null,
  address: "",
  city: "",
  state: "",
  pincode: "",
  mobile: "",
  altMobile: "",
  email: "",
  altEmail: "",
  rentFrom: "",
  rentTo: "",
  facilities: {
    WiFi: false,
    RO: false,
    Furnished: false,
    Laundry: false,
  },
  roomTypes: [],
  roomImages: [],
};

const [formData, setFormData] = useState(initialFormData);


const facilityNameMap = {
  facility0: "RO",
  facility1: "Furnished",
  facility2: "Laundry",
  facility3: "WiFi",
  // add other mappings if needed
};




    

  function showToast() {
    const container = document.getElementById("modalToastContainer");
    if (!container) return;

    const alert = document.createElement("div");
    alert.className =
      "alert alert-success text-center p-2 m-2 shadow-sm ";
    alert.innerText = "Property added successfully!";

    container.appendChild(alert);

    setTimeout(() => alert.remove(), 1000);
  }

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    // for checkboxes (like facilities)
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        facilities: {
          ...prev.facilities,
          [id]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;

    // For Building Image
    if (id === "buildingImage") {
      setFormData((prev) => ({
        ...prev,
        buildingImage: files[0],
      }));
    }

    // For Room Size image (e.g., id="image_Room")
    else if (id.startsWith("roomImage_")) {
      const index = id.split("_")[1]; // Getting index from roomImage_1, roomImage_2 etc.
      const updatedRoomImages = [...formData.roomImages];
      updatedRoomImages[index] = files[0];

      setFormData((prev) => ({
        ...prev,
        roomImages: updatedRoomImages,
      }));
    }
  };

  const handleRoomTypeChange = (label, checked) => {
    setFormData((prev) => {
      let updatedTypes = checked
        ? [...prev.roomTypes, label]
        : prev.roomTypes.filter((type) => type !== label);

      return { ...prev, roomTypes: updatedTypes };
    });
  };

  const handleRoomImageUpload = (e, label) => {
    const file = e.target.files[0];

    setFormData((prev) => {
      const updatedImages = [...prev.roomImages];

      // either replace or push
      const index = prev.roomTypes.indexOf(label);
      if (index >= 0) {
        updatedImages[index] = file;
      } else {
        updatedImages.push(file);
      }

      return { ...prev, roomImages: updatedImages };
    });
  };

  const handleSubmit = async () => {
    console.log("Property form submitted!")
    // e.preventDefault();
    const isValid = ValidatePropertyDetails(formData, setAlertMsg, setShowAlert);
    console.log("isValid : ",isValid)
    if (!isValid) return;
    console.log("isValid : ",isValid)
    const data = new FormData();

    // Basic fields
    data.append("building_name", formData.buildingName);
    data.append("building_image", formData.buildingImage);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("pincode", formData.pincode);
    data.append("mobile", formData.mobile);
    data.append("alt_mobile", formData.altMobile);
    data.append("email", formData.email);
    data.append("alt_email", formData.altEmail);
    data.append("rent_from", formData.rentFrom);
    data.append("rent_to", formData.rentTo);
    data.append("owner_name",formData.ownerName);

    // Facilities - convert object to JSON string
    data.append("facilities", JSON.stringify(formData.facilities));

   formData.roomTypes.forEach((roomType, i) => {
    const roomData = {
      type: roomType,
      image: formData.roomImages[i] || null, // Handle cases where an image might be missing
    };
    data.append("room_data[]", JSON.stringify(roomData)); // Send as JSON string
  });
    


    setLoading(true);

    // Submit form to backend API
    const token = localStorage.getItem('owner_token');
    console.log("Token : ",token)
    try {
      const response = await axios.post("https://room-finder-1ayo.onrender.com/api/upload-property/", data, {
           headers: {
            'Authorization': `Token ${token}`,  // ✅ Correct placement
            'Content-Type': 'multipart/form-data'
            },
         });
      console.log("Property uploaded:", response.data);
    } catch (error) {
      console.error("Error uploading property:", error);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    setTimeout(() => {
      showToast();
    }, 1200);
  };
   
  const handleLogout = ()=>{
    localStorage.clear();
    navigate('/login')
  }









  return (
    //  Property Modal form
    <>

    <Spinner show={loading} />
    <OwnerProfileModal isOpen={showModal}  onClose={() => setShowmodal(false)}/>
   

     <div 
  className="modal fade"
  id="propertyModal"
  tabIndex="-1"
  role="dialog"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
    <div className="modal-content">
      
      <div className="modal-header d-flex justify-content-center align-items-center">
      <div id="modalToastContainer" className="position-absolute top-0 end-0 px-3 py-3 mt-0" style={{ zIndex: 1100 }}></div>
        <h5 className="modal-title" id="exampleModalLabel">
          Property Details
        </h5>
      </div>
      <div className="modal-body">
      {showAlert && (
  <div className="alert alert-danger alert-dismissible fade show z-3" role="alert">
    {alertMsg}
    <button
      type="button"
      className="btn-close"
      onClick={() => setShowAlert(false)}
    ></button>
  </div>
)}
        <form onSubmit={handleSubmit}>
        
          {/* Building Name */}
          
           <div className="row mt-2">
    <div className="col-md-6">
      <label htmlFor="buildingName" className="h6 text-primary">Building Name</label>
      <input
        type="text"
        className="form-control"
        id="buildingName"
       placeholder="e.g., Rituraj Apartment"
        value={formData.buildingName}
  onChange={handleChange}
  required
      />
    </div>
    <div className="col-md-6">
      <label htmlFor="ownerName" className="h6 text-primary">Owners's Name</label>
      <input
        type="text"
        className="form-control"
        id="ownerName"
        placeholder="enter your name"
        value={formData.ownerName}
  onChange={handleChange}
      />
    </div>
  </div>

          {/* Building Image */}
          <div className="mb-3 mt-2">
            <label htmlFor="buildingImage" className="h6 text-primary">Building Image</label>
            <input
              type="file"
              className="form-control"
              id="buildingImage"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <label htmlFor="address" className="h6 text-primary">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="e.g., House no.23, Bholaram"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please provide a valid address.</div>
          </div>

          {/* City, State, Pincode */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="city" className="h6 text-primary">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                placeholder="City"
                value={formData.city}
  onChange={handleChange}
  required
              />
              <div className="invalid-feedback">Please provide a valid city.</div>
            </div>
            <div className="col-md-3">
              <label htmlFor="state" className="h6 text-primary">State</label>
              <select className="form-select" id="state"
                       value={formData.state}
                       onChange={handleChange}
              >
                <option value="">--State--</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="pincode"  className="h6 text-primary">Pin Code</label>
              <input
                type="text"
                id="pincode"
                className="form-control"
                value={formData.pincode}
  onChange={handleChange}
  required
              />
              <div className="invalid-feedback">Please provide a valid pin code.</div>
            </div>
          </div>

           {/* Mobile No. and Alternate Mobile No. */}
  <div className="row mt-2">
    <div className="col-md-6">
      <label htmlFor="mobile" className="h6 text-primary">Mobile No.</label>
      <input
        type="tel"
        className="form-control"
        id="mobile"
        placeholder="Enter mobile no."
        value={formData.mobile}
  onChange={handleChange}
  required
      />
    </div>
    <div className="col-md-6">
      <label htmlFor="altMobile" className="h6 text-primary">Alternate Mobile No.</label>
      <input
        type="tel"
        className="form-control"
        id="altMobile"
        placeholder="Enter alternate mobile no."
        value={formData.altMobile}
  onChange={handleChange}
      />
    </div>
  </div>

  {/* Email and Alternate Email */}
  <div className="row mt-2">
    <div className="col-md-6">
      <label htmlFor="email" className="h6 text-primary">Email</label>
      <input
        type="email"
        className="form-control"
        id="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-6">
      <label htmlFor="altEmail" className="h6 text-primary">Alternate Email</label>
      <input
        type="email"
        className="form-control"
        id="altEmail"
        placeholder="Enter alternate email"
        value={formData.altEmail}
  onChange={handleChange}
      />
    </div>
  </div>


          {/* Sizes */}
          <div className="mb-3">
  <label className="h6 text-primary">Select Sizes</label>
  {["1RK", "1BHK", "2BHK"].map((label) => (
    <div className="form-check mt-1 d-flex align-items-center" key={label}>
      <input
        className="form-check-input me-2"
        type="checkbox"
        id={`size_${label}`}
        checked={formData.roomTypes.includes(label)}
        onChange={(e) => handleRoomTypeChange(label, e.target.checked)}
      />
      <label className="form-check-label me-3" htmlFor={`size_${label}`}>
        {label}
      </label>
      <input
        type="file"
        name="room_images[]"
        className="form-control form-control-sm ms-3"
        id={`roomImage_${label}`}
        accept=".jpg,.jpeg,.png"
         onChange={(e) => handleRoomImageUpload(e, label)}
        disabled={!formData.roomTypes.includes(label)}
      />
    </div>
  ))}
</div>


          {/* Facilities */}
          <div className="mb-3">
  <label className="h6 text-primary">Facilities</label>
  <div className="d-flex flex-wrap">
    {["WiFi", "RO", "Furnished", "Laundary"].map((facility, index) => (
      <div className="form-check form-check-inline me-3" key={index}>
        <input
          className="form-check-input"
          type="checkbox"
          id={`facility-${facility}`}
          checked={formData.facilities[facility]}
          onChange={(e) =>
            setFormData({
              ...formData,
              facilities: {
                ...formData.facilities,
                [facility]: e.target.checked,
              },
            })
          }
        />
        <label className="form-check-label" htmlFor={`facility-${facility}`}>
          {facility}
        </label>
      </div>
    ))}
  </div>
</div>


          {/* Rent */}
          <div className="mb-3 row">
            <label className="h6 text-primary">Rent Varies</label>
            <div className="col-md-6">
              <label htmlFor="rentFrom">From</label>
              <input type="text" className="form-control" id="rentFrom" placeholder="Minimum rent" value={formData.rentFrom}
  onChange={handleChange}/>
            </div>
            <div className="col-md-6">
              <label htmlFor="rentTo">To</label>
              <input type="text" className="form-control" id="rentTo" placeholder="Maximum rent"  value={formData.rentTo}
  onChange={handleChange}/>
            </div>
          </div>
         
        </form>
      </div>
      <div className="modal-footer">
     
      <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={()=>{setFormData(initialFormData)}}>
          Close
        </button>
      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
          Save Changes
        </button>
      
       
      </div>
    </div>
  </div>
</div>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 d-none d-md-block vh-100 p-3 position-fixed top-0 start-0"
           style={{
            backgroundImage: 'linear-gradient(to right,rgb(237, 232, 232),rgb(23, 234, 234))'

           }}
          >
            <div className="d-flex align-items-center flex-row justify-content-start align-items-center">
              <img src={profile} alt=""
              style={{
                width : 42,
                height : 42,
                borderRadius : '50%'
              }}/>
              <p className="h5 ms-2 text-dark">{localStorage.getItem("Name")}</p>
            </div>
            <hr className="text-dark"/>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a href="#" className="nav-link fw-bold" onClick={(e)=>{e.preventDefault(); navigate('/propertiesowner',{state:{"data" : gettingOwnersProperty}})}}>
                  My Properties
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link fw-bold" onClick={(e)=>{e.preventDefault(); navigate('/rentoverviewowner')}}>
                  Rent Overview
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link fw-bold" onClick={(e)=>{e.preventDefault(); navigate('/teantdetailsowner')}}>
                  Tenant details
                </a>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link fw-bold" data-target="#ownerProfileModal" 
                  onClick={(e)=>{ console.log("Hello") ;e.preventDefault();setShowmodal(true)}}
                >
                  Profile Settings
                </a>
              </li>
             
             
              
            </ul>
            <div className="box h-75 d-flex flex-column justify-content-end align-items-start">
            <button className="btn btn-danger px-4 mx-2 fw-bold" onClick={handleLogout}
             style={{
              marginBottom : 70
             }}
            >logout</button>
            </div>
            
          </div>

          {/* Main Content */}
          <div className="col-md-10 p-4 offset-md-2 vh-100" 
          style={{
            // backgroundImage: 'linear-gradient(to right,rgb(76, 144, 217),rgb(237, 231, 215))'
          }}>
            <div className="row d-md-none position-sticky top-0 z-3">
              <nav class="navbar  navbar-expand-lg navbar-dark rounded-4 px-3" 
                style={{
                  backgroundColor : '#1d3557'
                }}>
                <img src={logo1} alt="" width={50} style={{
                  borderRadius : '50%'
                }}/>
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
                        My properties 
                      </a>
                    </li>
                    <li class="nav-item my-1">
                      <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                        Rent overview
                      </a>
                    </li>
                    <li class="nav-item my-1">
                      <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                        Tenant details
                      </a>
                    </li>
                    <li class="nav-item my-1">
                      <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                        Profile setting
                      </a>
                    </li>
                    <li class="nav-item my-1">
                     <Link to="/login" onClick={handleLogout} style={{
                      textDecoration : "none",
                     
                      
                     }} className="fw-bold text-danger">Logout</Link>
                    </li>
                  </ul>
                </div>
               
              </nav>
              
            </div>

            {/* Second row */}
            <div className="row">
              <h3>Welcome, Home Owner</h3>

              {/* Summary Cards */}
              <div className="row my-4">
                <div className="col-md-4 px-4 my-3 ">
                  <div className="row text-center py-2" style={{
                    backgroundColor : '#0096c7',
                    borderTopRightRadius : 10,
                    borderTopLeftRadius : 10
                  }}>
                  <h5 className="card-title">Total Properties</h5>
                 
                  </div>
                  <div className="row text-center py-2" 
                  style={{
                    backgroundColor : '#00b4d8',
                    borderBottomLeftRadius : 10,
                    borderBottomRightRadius : 10
                  }}> 
                  <p className="card-text display-6">{gettingOwnersProperty.length}</p>
                  </div>
                </div>
                <div className="col-md-4  px-4 my-3">
                  <div className="row text-center py-2" style={{
                    backgroundColor : '#4f772d',
                    borderTopRightRadius : 10,
                    borderTopLeftRadius : 10
                  }}>
                  <h5 className="card-title">Pending rent</h5>
                 
                  </div>
                  <div className="row text-center py-2" 
                  style={{
                    backgroundColor : '#90a955',
                    borderBottomLeftRadius : 10,
                    borderBottomRightRadius : 10
                  }}> 
                  <p className="card-text display-6">1</p>
                  </div>
                </div>
                <div className="col-md-4  px-4 my-3">
                  <div className="row text-center py-2" style={{
                    backgroundColor : '#ff8fab',
                    borderTopRightRadius : 10,
                    borderTopLeftRadius : 10
                  }}>
                  <h5 className="card-title">New Tenant Request</h5>
                 
                  </div>
                  <div className="row text-center py-2" 
                  style={{
                    backgroundColor : '#ffb3c6',
                    borderBottomLeftRadius : 10,
                    borderBottomRightRadius : 10
                  }}> 
                  <p className="card-text display-6">2</p>
                  </div>
                </div>
               
              </div>

              {/* Property List */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>My Properties</h5>
                <button
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#propertyModal"
                >
                  + Add Property
                </button>
              </div>
             {loadingProperty ? (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
    <span className="text-primary fw-bold  me-2"><span className="text-danger">Wait</span> getting properties</span>
    <div className="spinner-grow text-danger" role="status">
      
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
): (gettingOwnersProperty.slice(-2).map((property) => (
  <div key={property.id} className="card my-3" style={{ backgroundColor: "#eee4e1" }}>
    <div className="row g-0"> {/* Bootstrap row with no gutters */}
      
      {/* LEFT SIDE - Property Info */}
      <div className="col-md-6 p-3">
        <div className="card-body">
          <h5 className="card-title" style={{
            color : "#14213d"
          }}>{property.building_name}</h5>
          <em className="card-text my-1 text-secondary">
            {property.address}, {property.city}, {property.state} - {property.pincode}
          </em>
          <p><strong>Rent:</strong> ₹{property.rent_from} - ₹{property.rent_to}</p>

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

  <div className="col-sm-2 mb-4" style={{
    marginTop : -10
  }}>
    <button className="btn btn-success fw-bold" onClick={()=>navigate('/propertiesowner',{state:{"data" : gettingOwnersProperty}})}>see more properties...</button>
  </div>



             
             
            
            </div>
            {/* Tenant Requests Table */}
<h5>Tenant Requests</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Tenant</th>
              <th>Property</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="4">No requests found.</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.tenant_name}</td>
                  <td>{req.property_name}</td>
                  <td>
                    <span
                      className={`badge ${
                        req.status === "pending"
                          ? "bg-warning text-dark"
                          : req.status === "accepted"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === "pending" ? (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleAction(req.id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleAction(req.id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-muted">Action taken</span>
                    )}
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
    </>
  );
};

export default OwnerDashboard;
