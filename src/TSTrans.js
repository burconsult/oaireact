import React, { useState, useEffect } from "react";
import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;

const TranslateTsFile = () => {
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
        const translation = await translate(value);
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

  async function translate(value) {
    // Call the OpenAI API to translate the value from English to Norwegian
    console.log(value);
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        prompt: `Translate "${value}" from English to Norwegian.`,
        model: "text-davinci-003",
        max_tokens: 100,
        temperature: 0.5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${apiKey}",
        },
      }
    );

    // Extract the translated value from the API response
    const translation = response.data.choices[0].text.trim();
    translation.replace( /[\r\n]+/gm, "");
    console.log(translation);
    return translation;
    
  }

  return (
    <div>
      <pre>{translatedFile}</pre>
    </div>
  );
};

export default TranslateTsFile;
