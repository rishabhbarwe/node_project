import React from "react";




const OwnerProfileModal = ({isOpen,onClose}) => {

  // console.log("Is open : ",isOpen)
  if(isOpen === false){
    return null;
  }
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={(e) => e.preventDefault()}>
          <div className="modal-header">
            <h5 className="modal-title" id="ownerProfileModalLabel">Update Owner Profile</h5>
           
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="ownerName" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="ownerName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="ownerEmail" className="form-label">Email</label>
              <input type="email" className="form-control" id="ownerEmail" required />
            </div>
            <div className="mb-3">
              <label htmlFor="ownerPhone" className="form-label">Phone Number</label>
              <input type="tel" className="form-control" id="ownerPhone" required />
            </div>
            <div className="mb-3">
              <label htmlFor="ownerAddress" className="form-label">Address</label>
              <textarea className="form-control" id="ownerAddress" rows="2" required></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="ownerImage" className="form-label">Profile Image</label>
              <input type="file" className="form-control" id="ownerImage" accept="image/*" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">Update Profile</button>
            <button type="button" className="btn btn-danger" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerProfileModal;