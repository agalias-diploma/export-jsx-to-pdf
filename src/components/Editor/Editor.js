import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import { useRef } from "react";
import generatePDF, { Resolution } from "react-to-pdf";

import ButtonComponent from "../Button/Button";
import InputFileName from "../Input/InputFileName";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

// Maybe it will helpful in future
const options = {
  method: "open",
  resolution: Resolution.HIGH,
};

const ReactDraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [convertedContentToHTML, setConvertedContentToHTML] = useState("");
  const [filename, setFilename] = useState("document");

  useEffect(() => {
    // proceed when state is not null
    if (editorState) {
      // Convert editorState into HTML in order to print data on page
      let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      html = sanitizeHtml(html);

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

      setConvertedContentToHTML(styledHtml);
    }
  }, [editorState]);

  const targetRef = useRef();

  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html);
  };

  const handleEditorStateChange = (newState) => {
    // Compare the current editor state with the new state
    if (editorState !== newState) {
      setEditorState(newState);
    }
  };

  const handleDownloadPDF = () => {
    const filenameWithExtension = filename.endsWith(".pdf")
      ? filename
      : filename + ".pdf";
    generatePDF(targetRef, { filename: filenameWithExtension });
  };

  const handleFilenameChange = (newFilename) => {
    setFilename(newFilename);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
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
      {/* PREVIEW COMPONENT */}
      <h4>Preview text:</h4>
      <div
        className="preview"
        ref={targetRef}
        dangerouslySetInnerHTML={{ __html: convertedContentToHTML }}
      ></div>
      <div>
        <ButtonComponent onClick={handleDownloadPDF} text="Download PDF" />
        <InputFileName
          filename={filename}
          onFilenameChange={handleFilenameChange}
        />
      </div>
    </div>
  );
};

export default ReactDraftEditor;
