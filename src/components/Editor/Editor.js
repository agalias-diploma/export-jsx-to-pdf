import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import {
  PDFViewer,
  Font,
  Page,
  Text,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import ToggleButton from "../Button/Button";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

import MyCustomFont from "../../fonts/Anton-Regular.ttf";

// Should be moved out of here
Font.register({
  family: "AntonFamily",
  src: MyCustomFont,
});

// Should be moved out of here
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  text: {
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "AntonFamily",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
});

const ReactDraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [convertedContentToHTML, setConvertedContentToHTML] = useState(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  // This state should be removed later. It's for testing purposes
  const [convertedContentToJSON, setConvertedContentToJSON] = useState(null);

  const [jsonKeys, setJsonKeys] = useState(null);
  const [jsonBlocks, setJsonBlocks] = useState(null);

  useEffect(() => {
    // Just convert thing to JSON
    let rawContent = convertToRaw(editorState.getCurrentContent());
    let json = convertFromRaw(rawContent);
    setConvertedContentToJSON(json);

    // Convert editorState into HTML in order to print data on page
    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContentToHTML(html);

    // Stringify JSON and grab necessarry data for render PDF properly
    const data = JSON.stringify(json);
    const obj = JSON.parse(data);

    // Collect each key of string
    const keys = Object.keys(obj.blockMap);
    setJsonKeys(keys);

    // Map over each character in string
    const blocks = keys.map((key) => obj.blockMap[key]);
    setJsonBlocks(blocks);
  }, [editorState]);

  // It ensures that HTML is properly rendered in <div> block on a page
  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

  // Guess it should be moved out of here too
  const toggleViewerVisibility = () => {
    setIsViewerVisible(!isViewerVisible);
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
          options: ["inline", "blockType"],
        }}
      />
      <h4>Preview text:</h4>
      <div
        className="preview"
        dangerouslySetInnerHTML={createMarkup(convertedContentToHTML)}
      ></div>
      {/* Textarea for debuging process */}
      <textarea
        disabled
        value={JSON.stringify(convertedContentToJSON, null, 4)}
      />
      <ToggleButton
        onClick={toggleViewerVisibility}
        isViewerVisible={isViewerVisible}
      />
      {/* Logic here is to complicated I guess, I need to think over it. For now it works */}
      {isViewerVisible &&
        convertedContentToJSON && ( // Conditional rendering
          <PDFViewer style={{ width: "100%", height: "100vh" }}>
            <Document>
              <Page>
                {jsonKeys.map((key, keyIndex) => (
                  <Text key={keyIndex} style={styles.text}>
                    {jsonBlocks[keyIndex].text
                      .split("")
                      .map((char, charIndex) => (
                        <Text key={charIndex}>
                          {char === " " ? "\u00A0" : char}
                        </Text>
                      ))}
                  </Text>
                ))}
              </Page>
            </Document>
          </PDFViewer>
        )}
    </div>
  );
};

export default ReactDraftEditor;
