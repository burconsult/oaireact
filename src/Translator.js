import React, { useState, useEffect } from "react";
import axios from "axios";
import OAITranslate from "./Translate";

const Translator = () => {
  const [fileContent, setFileContent] = useState("");
  const [translatedFile, setTranslatedFile] = useState("");

  useEffect(() => {
    async function translateFile() {
      // Read the .ts file and set the content in the state
      const response = await axios.get("original.ts");
      console.log("File loaded!");
      setFileContent(response.data);
      //console.log(fileContent);

      // Use a regular expression to extract each <message> block
      const messageBlocks = fileContent.match(/<message>(.*?)<\/message>/gs);
      if (!messageBlocks) {
        return;
      }

      console.log(messageBlocks.length);
      
      // Translate the text inside <source> and replace the value inside <translation>
      let translatedContent = fileContent;
      for (const messageBlock of messageBlocks) {
        //console.log(messageBlock);

        const sourceValue = messageBlock.match(/<source>(.*?)<\/source>/);
        if (!sourceValue) {
          continue;
        }  
        const value = sourceValue[1];
        //console.log(value);
        const translation = await OAITranslate(value);
        const translationTag = messageBlock.match(/<translation.*?>(.*?)<\/translation>/);
        let translatedTranslationTag;
        if (translationTag) {
          const attrs = translationTag[0].match(/\w+=".*?"/g) || "";
          translatedTranslationTag = `<translation${
            attrs.length ? " " + attrs.join(" ") : ""
          }>${translation}</translation>`;
        } else {
          translatedTranslationTag = `<translation>${translation}</translation>`;
        }
  
        translatedContent = translatedContent.replace(
          messageBlock,
          messageBlock.replace(/<translation.*?>(.*?)<\/translation>/g, translatedTranslationTag)
        );
        setTranslatedFile(translatedContent);
      }
  
      // Update the state with the translated content
      setTranslatedFile(translatedContent);
    }

    translateFile();
  }, [fileContent]);

  return (
    <div>
      <pre>{translatedFile}</pre>
    </div>
  );
};

export default Translator;
