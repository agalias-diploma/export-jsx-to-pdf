import React from "react";
import { Page, Text, Document, StyleSheet } from "@react-pdf/renderer";
import {Font} from '@react-pdf/renderer';
import MyCustomFont from '../fonts/Anton-Regular.ttf';

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
    // margin: 0,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "AntonFamily",
  },
});

const FileToSave = ({ editorContent }) => (
  <Document>
    <Page style={styles.body}>
      {editorContent &&
        editorContent.blocks.map((block, index) => (
          <Text key={index} style={styles.text}>
            {block.text}
          </Text>
        ))}
    </Page>
  </Document>
);

export default FileToSave;