import React, { useState, useEffect, useRef } from "react";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

import ButtonComponent from "../Button/Button";
import InputFileName from "../Input/InputFileName";
import ComponentSet from "../ComponentSet/ComponentSet";
import EditorComponent from "./EditorComponent/EditorComponent";
import PreviewComponent from "../PreviewComponent/PreviewComponent";
import {
  handleDownloadContentAsJS,
  handleDownloadPDF,
} from "../DownloadFunctions";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

const ReactDraftEditor = ({ rawContent }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(convertFromRaw(JSON.parse(rawContent)))
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
      styledHtml = html.replace(
        /<p>/g,
        '<p style="overflow-wrap: break-word; white-space: pre-wrap;">'
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

  const handleFilenameChange = (newFilename) => {
    setFilename(newFilename);
  };

  return (
    <div>
      <EditorComponent
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
      />
      <h3>Preview text</h3>
      <PreviewComponent
        convertedContentToHTML={convertedContentToHTML}
        targetRef={targetRef}
      />
      <div>
        <ComponentSet>
          <ButtonComponent
            onClick={() => handleDownloadContentAsJS(editorState, filename)}
            text="Download as JS"
          />
          <ButtonComponent
            onClick={() => handleDownloadPDF(targetRef, filename, Resolution, Margin, generatePDF)} 
            text="Download PDF"
          />
        </ComponentSet>
        <InputFileName
          filename={filename}
          onFilenameChange={handleFilenameChange}
        />
      </div>
    </div>
  );
};

export default ReactDraftEditor;
