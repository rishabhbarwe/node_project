// Spinner.jsx
import React from "react";


const Spinner = ({ show }) => {
  if (!show) return null;

  return (
    <div id="overlay" className="d-flex">
      <div className="spinner-border text-light" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
