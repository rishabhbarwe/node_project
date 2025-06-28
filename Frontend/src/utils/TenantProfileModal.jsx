import React from "react";

const TenantProfileModal = () => {
  return (
    <div className="modal fade" id="tenantProfileModal" tabIndex="-1" aria-labelledby="tenantProfileModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={(e) => e.preventDefault()}>
          <div className="modal-header">
            <h5 className="modal-title" id="tenantProfileModalLabel">Update Tenant Profile</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="tenantName" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="tenantName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="tenantEmail" className="form-label">Email</label>
              <input type="email" className="form-control" id="tenantEmail" required />
            </div>
            <div className="mb-3">
              <label htmlFor="tenantPhone" className="form-label">Phone Number</label>
              <input type="tel" className="form-control" id="tenantPhone" required />
            </div>
            <div className="mb-3">
              <label htmlFor="tenantAddress" className="form-label">Address</label>
              <textarea className="form-control" id="tenantAddress" rows="2" required></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="tenantImage" className="form-label">Profile Image</label>
              <input type="file" className="form-control" id="tenantImage" accept="image/*" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantProfileModal;