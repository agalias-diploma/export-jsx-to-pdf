import React from "react";
import "../../App.css";

// // Bootstrap CSS
// import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Button from '@mui/material/Button';

const ButtonComponent = ({ onClick, children, text }) => {
  return (
    <Button variant="contained" onClick={onClick}>
      {text || children}
    </Button>
    // <button className="btn btn-primary" onClick={onClick}>
    //   {text || children}
    // </button>
  );
};

export default ButtonComponent;