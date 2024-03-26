// import React, { useState, useEffect } from "react";
// import { Editor } from "react-draft-wysiwyg";
// import { EditorState, convertToRaw, convertFromRaw } from "draft-js"; // controlled editor
// import { convertToHTML } from 'draft-convert';
// import DOMPurify from 'dompurify';
// import { PDFViewer, Font, Page, Text, Document, StyleSheet } from '@react-pdf/renderer';
// // import Html from 'react-pdf-html';

// // import FileToSave from '../FileToSave';
// import ToggleButton from "../Button/Button";

// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "./Editor.css";

// import MyCustomFont from '../../fonts/Anton-Regular.ttf';

// Font.register({
//   family: "AntonFamily",
//   src: MyCustomFont,
// });

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
// });

// const ReactDraftEditor = () => {
//   const [editorState, setEditorState] = useState(
//     () => EditorState.createEmpty()
//   );
//   const [convertedContentToHTML, setConvertedContentToHTML] = useState(null);
//   const [isViewerVisible, setIsViewerVisible] = useState(false);
//   const [convertedContentToJSON, setConvertedContentToJSON] = useState(null);
  
//   useEffect(() => {
//     //-------------------------JSON
//     let rawContent = convertToRaw(editorState.getCurrentContent());
//     let json = convertFromRaw(rawContent);
//     setConvertedContentToJSON(json);

//     let html = convertToHTML(editorState.getCurrentContent());
//     setConvertedContentToHTML(html);
//   }, [editorState]);
 
//   // console.log(convertedContentToJSON);

//   function createMarkup(html) {
//     return {
//       __html: DOMPurify.sanitize(html)
//     }
//   }

//   const toggleViewerVisibility = () => {
//     setIsViewerVisible(!isViewerVisible);
//   };

  // const testObj = {
  //   "entityMap": {},
  //   "blockMap": {
  //       "3dgdm": {
  //           "key": "3dgdm",
  //           "type": "unstyled",
  //           "text": "aaaa",
  //           "characterList": [
  //               {
  //                   "style": [],
  //                   "entity": null
  //               },
  //               {
  //                   "style": [],
  //                   "entity": null
  //               },
  //               {
  //                   "style": [],
  //                   "entity": null
  //               },
  //               {
  //                   "style": [
  //                       "BOLD"
  //                   ],
  //                   "entity": null
  //               }
  //           ],
  //           "depth": 0,
  //           "data": {}
  //       }
  //   },
  //   "selectionBefore": {
  //       "anchorKey": "3dgdm",
  //       "anchorOffset": 0,
  //       "focusKey": "3dgdm",
  //       "focusOffset": 0,
  //       "isBackward": false,
  //       "hasFocus": false
  //   },
  //   "selectionAfter": {
  //       "anchorKey": "3dgdm",
  //       "anchorOffset": 0,
  //       "focusKey": "3dgdm",
  //       "focusOffset": 0,
  //       "isBackward": false,
  //       "hasFocus": false
  //   }
  // }
  // const data = JSON.stringify(testObj);
  // const obj = JSON.parse(data);

  // const jsonKey = Object.keys(obj.blockMap)[0];
  // console.log(jsonKey);

  // const block = obj.blockMap[jsonKey];
  // block.characterList.forEach((char, index) => {
  //   console.log(`Character ${index + 1}: ${block.text.charAt(index)}`);
  //   console.log(`Style: ${char.style.join(', ')}`);
  // });

//   const dynamicData = JSON.stringify(convertedContentToJSON);
//   const dynamicObj = JSON.parse(dynamicData);

//   const dynamicJsonKey = Object.keys(dynamicObj.blockMap)[0];
//   console.log(dynamicJsonKey);
  
//   const dynamicBlock = dynamicObj.blockMap[dynamicJsonKey];
//   dynamicBlock.characterList.forEach((char, index) => {
//     console.log(`Character ${index + 1}: ${dynamicBlock.text.charAt(index)}`);
//     console.log(`Style: ${char.style.join(', ')}`);
//   });

//   // const data = JSON.stringify(convertedContentToJSON, null, 4);
//   // const obj = JSON.parse(data);
//   // console.log(obj);
//   // console.log(obj.blockMap[0].characterList[0]);

//   return (
//     <div>
//       <Editor
//         // toolbarOnFocus
//         editorState={editorState}
//         onEditorStateChange={setEditorState}
//         toolbarClassName="toolbar-class"
//         wrapperClassName="wrapper-class"
//         editorClassName="editor-class"
//         toolbar={{
//           options: ['inline', 'blockType']
//         }}
//       />
//       <h4>Preview text:</h4>
//       <div
//         className="preview"
//         dangerouslySetInnerHTML={createMarkup(convertedContentToHTML)}>
//       </div>
//       <textarea
//         disabled
//         value={JSON.stringify(convertedContentToJSON, null, 4)}
//         // value={convertedContentToJSON}
//       />
//       <ToggleButton
//         onClick={toggleViewerVisibility}
//         isViewerVisible={isViewerVisible}
//       />
//       {isViewerVisible && (
//         <PDFViewer style={{ width: "100%", height: "100vh" }}>
//           <Document>
//             {/* <Page style={styles.body}> */}
//             <Page>
//               {/* <Html>{convertedContent}</Html> */}
//               {convertedContentToJSON && Object.values(convertedContentToJSON.blockMap).map(block => (
//                 <Text key={block.key} style={styles.text}>
//                   {block.text}
//                 </Text>
//               ))}
//             </Page>
//           </Document>
//         </PDFViewer>
//       )}
//     </div>
//   );
// };

// export default ReactDraftEditor;

// // # Rendering React Components
// // const html = ReactDOMServer.renderToStaticMarkup(element);

import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js"; 
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';
import { PDFViewer, Font, Page, Text, Document, StyleSheet } from '@react-pdf/renderer';
import ToggleButton from "../Button/Button";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

import MyCustomFont from '../../fonts/Anton-Regular.ttf';

Font.register({
  family: "AntonFamily",
  src: MyCustomFont,
});

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
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});

const ReactDraftEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [convertedContentToHTML, setConvertedContentToHTML] = useState(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [convertedContentToJSON, setConvertedContentToJSON] = useState(null);

  const [jsonObj, setJsonObj] = useState({});
  const [jsonKey, setJsonKey] = useState(null);
  const [jsonBlock, setJsonBlock] = useState(null);
  
  useEffect(() => {
    let rawContent = convertToRaw(editorState.getCurrentContent());
    let json = convertFromRaw(rawContent);
    setConvertedContentToJSON(json);

    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContentToHTML(html);

    const data = JSON.stringify(json);
    const obj = JSON.parse(data);
  
    const jsonKey = Object.keys(obj.blockMap)[0];
    console.log(jsonKey);

    const keys = Object.keys(obj.blockMap); // Collect all keys
  
    const blocks = keys.map(key => obj.blockMap[key]);

    // block.characterList.forEach((char, index) => {
    //   console.log(`Character ${index + 1}: ${block.text.charAt(index)}`);
    //   console.log(`Style: ${char.style.join(', ')}`);
    // });

    setJsonObj(obj);
    //setJsonKey(jsonKey);
    setJsonKey(keys);
    //setJsonBlock(block);
    setJsonBlock(blocks);
  }, [editorState]);

  console.log(jsonBlock);

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }

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
          options: ['inline', 'blockType']
        }}
      />
      <h4>Preview text:</h4>
      <div className="preview" dangerouslySetInnerHTML={createMarkup(convertedContentToHTML)}></div>
      <textarea disabled value={JSON.stringify(convertedContentToJSON, null, 4)} />
      <ToggleButton onClick={toggleViewerVisibility} isViewerVisible={isViewerVisible} />
      {isViewerVisible && convertedContentToJSON && ( // Conditional rendering
  <PDFViewer style={{ width: "100%", height: "100vh" }}>
    <Document>
      <Page>
        {jsonKey.map((key, keyIndex) => (
          <Text key={keyIndex} style={styles.text}>
            {jsonBlock[keyIndex].text.split('').map((char, charIndex) => (
              <Text key={charIndex}>
                {char === ' ' ? '\u00A0' : char}
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
