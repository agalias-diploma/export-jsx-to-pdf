import React from "react";

const containerStyles = {
    whiteSpace: "normal",
    overflowWrap: "break-word",
    margin: "0 auto",
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