import React from "react";
import "./ComponentSet.css";

const ComponentSet = ({ children }) => {
  return <div className="component-set">{children}</div>;
};

export default ComponentSet;

// I should use this
{/* <ButtonGroup variant="contained" aria-label="Basic button group">
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup> */}