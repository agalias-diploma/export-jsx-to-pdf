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
  canvas: {
    mimeType: "image/png",
    qualityRatio: 1,
  },
  page: {
    format: "A4",
    margin: {
      top: 10,
      bottom: 10,
      left: 20,
      right: 20,
    },
  },
  overrides: {
    pdf: {
      compress: true,
    },
    canvas: {
      useCORS: true,
    },
  },
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
        '<p style="white-space: pre-wrap; font-family: Times New Roman, serif; font-size: 16pt;"><br></p>'
      )
    );
    // Replace each white space character with the HTML entity for a non-breaking space
    styledHtml = html.replace(
      /<p>/g,
      '<p style="white-space: pre-wrap; font-family: Times New Roman, serif; font-size: 16pt;">'
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
      padding: "40px",
      whiteSpace: "pre-wrap",
      fontFamily: "'Times New Roman', serif",
      fontSize: "16pt",
    };

    const targetRef = useRef();

    return (
      <div>
        <button onClick={() => generatePDF(targetRef.current, { filename })}>
          Download PDF
        </button>
        <input
          type="text"
          placeholder="Enter file name"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        ></input>
        <div
          style={containerStyles}
          ref={targetRef}
          dangerouslySetInnerHTML={createMarkup(convertedContentToHTML)}
        />
      </div>
    );
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
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
