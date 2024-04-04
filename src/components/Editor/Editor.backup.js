// // v1
// import React, { useState, useEffect } from "react";
// import { Editor } from "react-draft-wysiwyg";
// import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
// import { convertToHTML } from "draft-convert";
// import DOMPurify from "dompurify";
// import {
//   PDFViewer,
//   Font,
//   Page,
//   Text,
//   Document,
//   StyleSheet,
// } from "@react-pdf/renderer";

// import ToggleButton from "../Button/Button";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "./Editor.css";
// import MyCustomFont from "../../fonts/Anton-Regular.ttf";

// // font-weight !

// Font.register({
//   family: "AntonFamily",
//   src: MyCustomFont,
// });

// // Should be moved out of here
// const styles = StyleSheet.create({
//   body: {
//     paddingTop: 35,
//     fontFamily: "AntonFamily",
//   },
//   bold: {
//     fontWeight: "bold",
//   },
//   italic: {
//     fontStyle: "italic",
//   },
// });

// const ReactDraftEditor = () => {
//   const [editorState, setEditorState] = useState(() =>
//     EditorState.createEmpty()
//   );
//   const [convertedContentToHTML, setConvertedContentToHTML] = useState(null);
//   const [convertedContentToJSON, setConvertedContentToJSON] = useState(null);
//   const [isViewerVisible, setIsViewerVisible] = useState(false);

//   const [jsonKeys, setJsonKeys] = useState(null);
//   const [jsonBlocks, setJsonBlocks] = useState(null);

//   useEffect(() => {
//     // Just convert thing to JSON
//     let rawContent = convertToRaw(editorState.getCurrentContent());
//     let json = convertFromRaw(rawContent);
//     setConvertedContentToJSON(json);

//     // Convert editorState into HTML in order to print data on page
//     let html = convertToHTML(editorState.getCurrentContent());
//     setConvertedContentToHTML(html);

//     // Stringify JSON and grab necessarry data for render PDF properly
//     const data = JSON.stringify(json);
//     const obj = JSON.parse(data);

//     // Collect each key of string
//     const keys = Object.keys(obj.blockMap);
//     setJsonKeys(keys);

//     // Map over each character in string
//     const blocks = keys.map((key) => obj.blockMap[key]);
//     setJsonBlocks(blocks);
//   }, [editorState]);

//   // It ensures that HTML is properly rendered in <div> block on a page
//   function createMarkup(html) {
//     return {
//       __html: DOMPurify.sanitize(html),
//     };
//   }

//   const toggleViewerVisibility = () => {
//     setIsViewerVisible(!isViewerVisible);
//   };

//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         onEditorStateChange={setEditorState}
//         toolbarClassName="toolbar-class"
//         wrapperClassName="wrapper-class"
//         editorClassName="editor-class"
//         toolbar={{
//           options: ["inline", "blockType"],
//         }}
//       />
//       <h4>Preview text:</h4>
//       <div
//         className="preview"
//         dangerouslySetInnerHTML={createMarkup(convertedContentToHTML)}
//       ></div>
//       {/* Textarea for debuging process */}
//       <textarea
//         disabled
//         value={JSON.stringify(convertedContentToJSON, null, 4)}
//       />
//       <ToggleButton
//         onClick={toggleViewerVisibility}
//         isViewerVisible={isViewerVisible}
//       />
//       {isViewerVisible &&
//         convertedContentToJSON && ( // Conditional rendering
//           <PDFViewer style={{ width: "100%", height: "100vh" }}>
//             <Document>
//               <Page>
//                 {jsonKeys.map((key, keyIndex) => (
//                   <Text key={keyIndex} style={styles.text}>
//                     {jsonBlocks[keyIndex].text
//                       .split("")
//                       .map((char, charIndex) => (
//                         <Text key={charIndex}>
//                           {char === " " ? "\u00A0" : char}
//                         </Text>
//                       ))}
//                   </Text>
//                 ))}
//               </Page>
//             </Document>
//           </PDFViewer>
//         )}
//     </div>
//   );
// };

// export default ReactDraftEditor;

// v2 unexpected empty line appears
import React, { useState, useEffect } from "react";
import { Editor, fontSize } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import { useRef } from "react";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

const options = {
  method: "open",
  resolution: Resolution.HIGH,
};

const ReactDraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [convertedContentToHTML, setConvertedContentToHTML] = useState(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [filename, setFilename] = useState("document.pdf");

  useEffect(() => {
    // proceed when state is not null
    if (editorState) {
      // Convert editorState into HTML in order to print data on page
      let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      setConvertedContentToHTML(html);
    }
  }, [editorState]);

  // It ensures that HTML is properly rendered in <div> block on a page
  function createMarkup(html) {
    if (!html) {
      return { __html: "" };
    }
    let styledHtml = html;

    styledHtml = styledHtml.replace(/(<p><\/p>\s*){2,}/g, (match) =>
      match.replace(
        /<p><\/p>/g,
        '<p style="white-space: pre-wrap; font-family: Times New Roman, serif; font-size: 16pt;"></p>'
      )
    );
    // Replace each white space character with the HTML entity for a non-breaking space
    styledHtml = html.replace(
      /<p>/g,
      '<p style="white-space: pre-wrap; overflow-wrap: break-word; font-family: Times New Roman, serif; font-size: 16pt;">'
    );
    return {
      __html: DOMPurify.sanitize(styledHtml),
    };
  }

  console.log(createMarkup(convertedContentToHTML));

  // Guess it should be moved out of here too
  const toggleViewerVisibility = () => {
    setIsViewerVisible(!isViewerVisible);
  };

  const DownloadPDF = () => {
    // Try default CSS styles and call via className
    const containerStyles = {
      // padding: "40px",
      padding: "0px",
      whiteSpace: "pre-wrap",
      fontFamily: "'Times New Roman', serif",
      fontSize: "16pt",
    };

    const targetRef = useRef();

    return (
      <div>
        <button
          onClick={() => generatePDF(targetRef, { filename: "document.pdf" })}
        >
          Download PDF
        </button>
        <input
          type="text"
          placeholder="Enter file name"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        ></input>
        {/* <textarea
        rows={10}
        style={{ width: "100%", marginTop: "10px" }} 
        value={convertedContentToHTML} 
        readOnly 
      ></textarea> */}
        <div
          style={containerStyles}
          ref={targetRef}
          dangerouslySetInnerHTML={createMarkup(convertedContentToHTML)}
        />
      </div>
    );
  };

  // Log every click in the editor
  const logClick = (event) => {
    if (event.target) {
      console.log("Clicked:", event.target.textContent);
    } else {
      console.log("Clicked:", event); // Log the event itself for debugging purposes
    }
  };

  // Handle editor state change
  const handleEditorStateChange = (newState) => {
    // Compare the current editor state with the new state
    if (editorState !== newState) {
      setEditorState(newState);
      logClick(newState); // Log every change in the editor state
    }
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        // onEditorStateChange={setEditorState}
        onEditorStateChange={handleEditorStateChange}
        // onEditorStateChange={(newState) => {
        //   setEditorState(newState);
        //   logClick(newState); // Log every change in the editor state
        // }}
        toolbarClassName="toolbar-class"
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "emoji",
            "image",
            "remove",
            "history",
          ],
          blockType: {
            inDropdown: true,
            options: [
              "Normal",
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "Blockquote",
            ],
          },
          fontSize: {
            options: [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
          },
        }}
      />
      <h4>Preview text:</h4>
      <div
        className="preview"
        dangerouslySetInnerHTML={createMarkup(convertedContentToHTML)}
      ></div>
      <DownloadPDF />
    </div>
  );
};

export default ReactDraftEditor;