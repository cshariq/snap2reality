import { ActionOptions, assert } from "gadget-server";
import axios from "axios";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
 
  logger.info("Validating required image file and API key");
  
  assert(record.image?.url, "An image file is required to run object detection");
  
  if (!process.env.GROQ_API_KEY) {
    logger.error("Missing required GROQ_API_KEY environment variable");
    throw new Error("GROQ API key not configured. Please contact your administrator to set up the GROQ_API_KEY environment variable.");
  }
 

  logger.info({ imageUrl: record.image.url }, "Starting generate action");

  const client = axios.create({
    baseURL: "https://api.groq.com/openai/v1",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
  });
  
  const requestPayload = {
    model: "llama-3.2-11b-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text", 
            text: "Analyze this image and detect any objects."
          },
          {
            type: "image_url",
            url: record.image.url
          }
        ]
      }
    ],
    max_tokens: 1024
  };

  logger.info({ request: requestPayload }, "Sending request to Groq API");

  try {
    const response = await client.post("/chat/completions", requestPayload);
    
    logger.info({
      responseData: response.data,
      status: response.status,
      headers: response.headers
    }, "Received raw Groq API response");

    return { success: true };
  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : "Unknown error",
      response: error?.response?.data,
      status: error?.response?.status
    }, "Error calling Groq API");
    throw error;
  }
};
 
export const options: ActionOptions = {
  actionType: "update",
};
