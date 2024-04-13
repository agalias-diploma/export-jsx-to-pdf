import { convertToRaw } from "draft-js";

export const handleDownloadContentAsJS = (editorState, filename) => {
  const content = convertToRaw(editorState.getCurrentContent());

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
    method: "hidden",
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.MEDIUM,
      format: "A4",
      orientation: "portrait",
    },
    canvas: {
      mimeType: "image/jpeg",
      qualityRatio: 1,
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
