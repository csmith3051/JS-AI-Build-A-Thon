// sample.js
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

export async function main() {
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set.");
  }

  // Example: Read an image file (optional, update path if needed)
  // const imagePath = "./contoso_layout_sketch.jpg";
  // const imageBuffer = fs.readFileSync(imagePath);
  // const imageBase64 = imageBuffer.toString("base64");

  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Write HTML and CSS code for a web page based on the following hand-drawn sketch."
            }
            // Uncomment below to send an image as part of the message
            // ,
            // {
            //   type: "image_url",
            //   image_url: {
            //     url: `data:image/jpeg;base64,${imageBase64}`
            //   }
            // }
          ]
        }
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
