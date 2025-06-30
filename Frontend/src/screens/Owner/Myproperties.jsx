import { useLocation } from "react-router-dom";
const Myproperties = ()=>{
   let location  = useLocation();
   let properties = location.state.data;
   //console.log("Properties : ",properties);
   const facilityNameMap = {
  facility0: "RO",
  facility1: "Furnished",
  facility2: "Laundry",
  facility3: "WiFi",
  // add other mappings if needed
};

return (
  <>
    <div
      className="container-fluid"
      style={{
        minHeight: "100%", // full screen height
        backgroundColor: "#264653", // light gray background
        paddingBottom : 100,
        marginTop : -10
      }}
    >
      <p className="h1 mx-3 my-2 text-white">Properties</p>

      {properties.map((property) => (
        <div
          key={property.id}
          className="card mb-5 mx-3"
          style={{ backgroundColor: "#eee4e1" }}
        >
          <div className="row g-0">
            {/* LEFT SIDE - Property Info */}
            <div className="col-md-6 p-3">
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#14213d" }}>
                  {property.building_name}
                </h5>
                <em className="card-text my-1 text-secondary">
                  {property.address}, {property.city}, {property.state} -{" "}
                  {property.pincode}
                </em>
                <p>
                  <strong>Rent:</strong> ₹{property.rent_from} - ₹
                  {property.rent_to}
                </p>

                <div className="row">
                  <div className="col-sm-6">
                    <p>
                      <strong>Room Types:</strong>
                    </p>
                    <ul>
                      {property.room_types.map((room, idx) => (
                        <li key={idx}>{room.type}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-sm-6">
                    <p>
                      <strong>Facilities:</strong>
                    </p>
                    <ul>
                      {Object.entries(property.facilities)
                        .filter(([facilityKey, isAvailable]) => isAvailable)
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
                style={{
                  width: "300px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "4px solid white",
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

}
export default Myproperties;