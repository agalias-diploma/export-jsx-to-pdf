import { convertToRaw } from "draft-js";

// Download this file to the DB or S3 bucket so we can reuse this template in future multiple times
export const handleDownloadContentAsJS = (editorState, filename) => {
  const content = convertToRaw(editorState.getCurrentContent());

  // Stringify content for better usage 
  const contentAsString = `const obj = \`${JSON.stringify(content, null, 2)}\`;\nexport default obj;`;
  
  const blob = new Blob([contentAsString], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.js`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handleDownloadPDF = (
  targetRef,
  filename,
  Resolution,
  Margin,
  generatePDF
) => {
  const filenameWithExtension = filename.endsWith(".pdf")
    ? filename
    : filename + ".pdf";
  const options = {
    method: "save", // `open` - preview of PDF
    resolution: Resolution = 2, // could be LOW/MEDIUM/HIGH 
    page: {
      margin: Margin.MEDIUM, // can be setted in px/pt too
      format: "A4", // A1-A6
      orientation: "portrait", // `landscape`
    },
    canvas: {
      mimeType: "image/jpeg", 
      qualityRatio: 1, // quality of images
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
    filename: filenameWithExtension,
  };
  generatePDF(targetRef, options);
};
