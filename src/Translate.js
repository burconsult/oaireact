import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;

async function OAITranslate(value, sourceLang, targetLang, xprompt) {
  // Call the OpenAI API to translate the value from sourceLang to targetLang
  console.log(value);
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    {
      prompt: `Translate "${value}" from ${sourceLang} to ${targetLang}.${xprompt} `,
      model: "text-davinci-003",
      max_tokens: 100,
      temperature: 0.5,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ".apiKey,
      },
    }
  );
  
  // Extract the translated value from the API response
  const translation = response.data.choices[0].text;
  console.log(translation);
  return translation;
}

export default OAITranslate;