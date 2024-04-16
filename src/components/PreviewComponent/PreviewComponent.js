import React from "react";
import "./PreviewComponent.css";

const containerStyles = {
    whiteSpace: "normal",
    overflowWrap: "break-word",
    margin: "2rem auto",
};

const PreviewComponent = ({ convertedContentToHTML, targetRef }) => {
  return (
    <div
      style={containerStyles}
      className="preview"
      ref={targetRef}
      dangerouslySetInnerHTML={{ __html: convertedContentToHTML }}
    ></div>
  );
};

export default PreviewComponent;