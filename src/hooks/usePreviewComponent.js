import { useState, useEffect } from 'react';
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import DOMPurify from "dompurify";

const usePreview = (editorState) => {
  const [convertedContentToHTML, setConvertedContentToHTML] = useState("");

  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html);
  };

  useEffect(() => {
    if (editorState) {
      let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      html = sanitizeHtml(html);

      let styledHtml = html.replace(
        /<p>/g,
        '<p style="overflow-wrap: break-word; white-space: pre-wrap;">'
      );

      setConvertedContentToHTML(styledHtml);
    }
  }, [editorState]);

  return { convertedContentToHTML };
};

export default usePreview;
