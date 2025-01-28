import { convertToRaw } from "draft-js";

// Download this file to the DB or S3 bucket so we can reuse this template in future multiple times
export const handleDownloadContentAsJS = async (editorState, filename) => {
  const content = convertToRaw(editorState.getCurrentContent());

  // Stringify content for better usage 
  const contentAsString = `const obj = \`${JSON.stringify(content, null, 2)}\`;\nexport default obj;`;
  
  const blob = new Blob([contentAsString], { type: "text/javascript" });
  const file = new File([blob], `${filename}.js`, { type: "text/javascript" });

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:3000/upload-js", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      console.log("JS file uploaded successfully", data);
    } else {
      console.error("Error uploading JS file", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// export const handleRetrieveJS = async (filename) => {
//   try {
//     const response = await fetch(`http://localhost:3000/get-js/${filename}`);
//     const data = await response.json();

//     if (response.ok) {
//       // Use the content from the JS file (e.g., for template changes)
//       const content = data.content;
//       console.log("JS file retrieved successfully", content);
//     } else {
//       console.error("Error retrieving JS file", data);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// this we download locally for now and will be doing that, since we want to use this for our needs, js file we save because we want to generate pdf from it in future
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
