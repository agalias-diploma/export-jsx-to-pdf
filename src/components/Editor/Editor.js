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

// const DATA = {
//   student: "Галяс А.В.",
//   group: "341",
//   lecturer: "Кириченко О.О.",
//   subject: "Node.js",
//   lab_num: 7,
//   lab_title: "Авторизація",
//   year: 2024,
// }

// ------------- It's a preDefined HTML content from Editor (it's generated from rawJS) 
// const preDefinedHTML = `
// <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="2ble6-0-0">
//         <div data-offset-key="2ble6-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="2ble6-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-weight: bold; font-size: 20px;"><span
//                     data-text="true">Чернівецький національний універиситет імені Юрія
//                     Федьковича</span></span></div>
//     </div>
//     <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="37vue-0-0">
//         <div data-offset-key="37vue-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="37vue-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-weight: bold; font-size: 20px;"><span
//                     data-text="true">Інститу фізико-технічних та комп'ютерний наук</span></span></div>
//     </div>
//     <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="fb6ot-0-0">
//         <div data-offset-key="fb6ot-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="fb6ot-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true">Відділ комп'ютерних технологій</span></span></div>
//     </div>
//     <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="2fpug-0-0">
//         <div data-offset-key="2fpug-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="2fpug-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true">Кафедра математичних проблем і управління кібернетики</span></span>
//         </div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="c01hd-0-0">
//         <div data-offset-key="c01hd-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="c01hd-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="dibul-0-0">
//         <div data-offset-key="dibul-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="dibul-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="31p3k-0-0">
//         <div data-offset-key="31p3k-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="31p3k-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="dakho-0-0">
//         <div data-offset-key="dakho-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="dakho-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="9fqgn-0-0">
//         <div data-offset-key="9fqgn-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="9fqgn-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="34rlj-0-0">
//         <div data-offset-key="34rlj-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="34rlj-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true">ЗВІТ</span></span></div>
//     </div>
//     <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="6vqr0-0-0">
//         <div data-offset-key="6vqr0-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="6vqr0-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true">про виконання лабораторної роботи №${DATA.lab_num}</span></span></div>
//     </div>
//     <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="670nv-0-0">
//         <div data-offset-key="670nv-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="670nv-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true">"${DATA.lab_title}"</span></span></div>
//     </div>
//     <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="489l5-0-0">
//         <div data-offset-key="489l5-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="489l5-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true">з дисципліни</span></span></div>
//     </div>
//     <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="8qm9s-0-0">
//         <div data-offset-key="8qm9s-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="8qm9s-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true">"${DATA.subject}" </span></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="1o7k7-0-0">
//         <div data-offset-key="1o7k7-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="1o7k7-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="7t32l-0-0">
//         <div data-offset-key="7t32l-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="7t32l-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="3q84j-0-0">
//         <div data-offset-key="3q84j-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="3q84j-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="6t1jc-0-0">
//         <div data-offset-key="6t1jc-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="6t1jc-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="4ftpm-0-0">
//         <div data-offset-key="4ftpm-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="4ftpm-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true"> Виконав: студент ${DATA.group} групи</span></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="9333e-0-0">
//         <div data-offset-key="9333e-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="9333e-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true"> ${DATA.student}</span></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="e8css-0-0">
//         <div data-offset-key="e8css-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="e8css-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true"> Перевірила: ${DATA.lecturer} </span></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="5patm-0-0">
//         <div data-offset-key="5patm-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="5patm-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true"> Оцінка:</span></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="866mh-0-0">
//         <div data-offset-key="866mh-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="866mh-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true"> Дата захисту:</span></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="9i36p-0-0">
//         <div data-offset-key="9i36p-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="9i36p-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="8c9ef-0-0">
//         <div data-offset-key="8c9ef-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="8c9ef-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="3uk39-0-0">
//         <div data-offset-key="3uk39-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="3uk39-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="amvio-0-0">
//         <div data-offset-key="amvio-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="amvio-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="7jgo1-0-0">
//         <div data-offset-key="7jgo1-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="7jgo1-0-0"><br data-text="true"></span></div>
//     </div>
//     <div class="rdw-center-aligned-block" data-block="true" data-editor="2rfk3"
//         data-offset-key="djs6o-0-0">
//         <div data-offset-key="djs6o-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="djs6o-0-0"
//                 style="font-family: &quot;Times New Roman&quot;; font-size: 20px;"><span
//                     data-text="true">Чернівці ${DATA.year}</span></span></div>
//     </div>
//     <div class="" data-block="true" data-editor="2rfk3" data-offset-key="cnik9-0-0">
//         <div data-offset-key="cnik9-0-0"
//             class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span
//                 data-offset-key="cnik9-0-0"><br data-text="true"></span></div>
//     </div>
// `;

// const blocksFromHTML = convertFromHTML(preDefinedHTML);

// const content = ContentState.createFromBlockArray(
//   blocksFromHTML.contentBlocks,
//   blocksFromHTML.entityMap
// );

import editorStateJSON from "./editorState.json"; // it's initial state of Editor with some formatted content

console.log("EDITOR STATE JSON----------------------------")
console.log(editorStateJSON);
console.log("EDITOR STATE JSON----------------------------")


const ReactDraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    // EditorState.createEmpty()
    // EditorState.createWithContent(
    //   ContentState.createFromBlockArray(
    //     convertFromHTML(preDefinedHTML)
    //   )
    // )
    EditorState.createWithContent(convertFromRaw(editorStateJSON))
  );
  console.log(editorState); // get initial editorState
  const [convertedContentToHTML, setConvertedContentToHTML] = useState("");
  const [filename, setFilename] = useState("document");

  useEffect(() => {
    // proceed when state is not null
    if (editorState) {
      // Convert editorState into HTML in order to print data on page
      let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      html = sanitizeHtml(html);

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
