import React, { useState, useEffect, useRef } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromHTML, ContentState, convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

import ButtonComponent from "../Button/Button";
import InputFileName from "../Input/InputFileName";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

import rawObject from "./rawContent";

const ReactDraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    // EditorState.createWithContent(convertFromRaw(editorStateJSON))
    EditorState.createWithContent(convertFromRaw(JSON.parse(rawObject)))
  );
  const [convertedContentToHTML, setConvertedContentToHTML] = useState("");
  const [filename, setFilename] = useState("document");

  const [convertedContentToJSON, setConvertedContentToJSON] = useState(null);

  useEffect(() => {
    // proceed when state is not null
    if (editorState) {
      // Convert editorState into HTML in order to print data on page
      let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      html = sanitizeHtml(html);

      let rawContent = convertToRaw(editorState.getCurrentContent());
      setConvertedContentToJSON(rawContent);
      console.log(convertedContentToJSON);

      let styledHtml = html;
      // styledHtml = styledHtml.replace(/(<p><\/p>\s*){2,}/g, (match) =>
      //   match.replace(
      //     /<p><\/p>/g,
      //     '<p style=""></p>'
      //   )
      // );
      // Replace each white space character with the HTML entity for a non-breaking space
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

  const handleDownloadPDF = () => {
    const filenameWithExtension = filename.endsWith(".pdf")
      ? filename
      : filename + ".pdf";
    const options = {
      method: "save", // open allows you to see PDF first
      // default is Resolution.MEDIUM = 3, which should be enough, higher values
      // increases the image quality but also the size of the PDF, so be careful
      // using values higher than 10 when having multiple pages generated, it
      // might cause the page to crash or hang.
      resolution: Resolution.HIGH,
      page: {
        // margin is in MM, default is Margin.NONE = 0
        margin: Margin.MEDIUM,
        format: "A4",
        orientation: "portrait",
      },
      canvas: {
        // default is 'image/jpeg' for better size performance
        mimeType: "image/jpeg",
        qualityRatio: 1,
      },
      // Customize any value passed to the jsPDF instance and html2canvas
      // function. You probably will not need this and things can break,
      // so use with caution.
      overrides: {
        // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
        pdf: {
          compress: true,
        },
        // see https://html2canvas.hertzen.com/configuration for more options
        canvas: {
          useCORS: true,
        },
      },
      filename: filenameWithExtension,
    };
    // generatePDF(targetRef, { filename: filenameWithExtension });
    generatePDF(targetRef, options);
  };

  const handleFilenameChange = (newFilename) => {
    setFilename(newFilename);
  };

  const containerStyles = {
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    // margin: "0 auto",
  }

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
        style={containerStyles}
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
