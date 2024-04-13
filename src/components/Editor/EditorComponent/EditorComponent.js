// EditorComponent.js
import React from "react";
import { Editor } from "react-draft-wysiwyg";

const EditorComponent = ({ editorState, onEditorStateChange }) => {
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
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
          options: [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 80, 88, 92]
        },
      }}
    />
  );
};

export default EditorComponent;
