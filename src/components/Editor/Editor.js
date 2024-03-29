import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import Html from 'react-pdf-html';
import {
  PDFViewer,
  Font,
  Page,
  Text,
  Document,
  StyleSheet,
  View,
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

const html = `                <div aria-label="rdw-editor" class="notranslate public-DraftEditor-content" contenteditable="true" role="textbox" spellcheck="false" style="outline: none; user-select: text; white-space: pre-wrap; overflow-wrap: break-word;"><div data-contents="true"><div class="" data-block="true" data-editor="3gnam" data-offset-key="dfss3-0-0"><div data-offset-key="dfss3-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="dfss3-0-0" style="text-decoration: underline line-through; font-size: 11px; position: relative; top: -8px; display: inline-flex;"><span data-text="true">ab</span></span><span data-offset-key="dfss3-0-1" style="font-style: italic; font-weight: bold;"><span data-text="true">cde   </span></span></div></div><div class="" data-block="true" data-editor="3gnam" data-offset-key="ah152-0-0"><div data-offset-key="ah152-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="ah152-0-0" style="font-weight: bold; text-decoration: underline line-through;"><span data-text="true">atqt  r4wy</span></span><span data-offset-key="ah152-0-1" style="text-decoration: line-through; font-style: italic;"><span data-text="true">  eqwtqt</span></span></div></div></div></div>`;

// Should be moved out of here
// const styles = StyleSheet.create({
//   body: {
//     paddingTop: 35,
//     paddingBottom: 65,
//     paddingHorizontal: 35,
//   },
//   text: {
//     fontSize: 14,
//     textAlign: "justify",
//     fontFamily: "AntonFamily",
//   },
//   bold: {
//     fontWeight: "bold",
//   },
//   italic: {
//     fontStyle: "italic",
//   },
// });

// font-weight !

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
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
    
    console.log(editorState.getCurrentContent());
    console.log(convertToRaw(editorState.getCurrentContent()))
    
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

  // if (jsonBlocks !== null) {
  //   jsonBlocks.forEach(block => {
  //     // Splitting the text of the block into characters
  //     const characters = block.text.split("");
      
  //     characters.forEach((char, charIndex) => {
  //       // Getting the character's styles
  //       const charStyles = block.characterList[charIndex].style;
        
  //       console.log(`Character: ${char}, Styles: ${charStyles.join(", ")}`);
  //     });
  //   });  }
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
      <Html>{html}</Html>
    </Page>
  </Document>
            {/* <Document>
              <Page >
                
                {jsonKeys.map((key, keyIndex) => {
                  const block = jsonBlocks[keyIndex];
                  return (
                    <Text key={keyIndex} style={styles.text}>
                      {block.text.split("").map((char, charIndex) => {
                        // Get styles for the current character
                        const charStyle = block.characterList[charIndex].style;
                        // Merge the character's styles with the base text style
                        const mergedStyles = { ...styles.text, ...charStyle };
                        return (
                          <Text key={charIndex} style={mergedStyles}>
                            {char === " " ? "\u00A0" : char}
                          </Text>
                        );
                      })}
                    </Text>
                  );
                })}
              </Page>
            </Document> */}
          </PDFViewer>
        )}
    </div>
  );
};

export default ReactDraftEditor;
