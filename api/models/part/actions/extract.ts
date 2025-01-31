import { applyParams, save, ActionOptions } from "gadget-server";
import axios from 'axios';

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  await save(record);
};

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  // Extract image URL from parameters
  const imageUrl = params.imageUrl as string;  // Ensure imageUrl is passed as a parameter
  
  if (!imageUrl) {
    throw new Error('No image URL provided.');
  }

  const GROQ_API_KEY = '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'; 
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  // Prepare data to send to the Groq API
  const requestData = {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract objects from this image."
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ],
    model: "llama-3.2-11b-vision-preview",  // Or another model if you prefer
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false,
    stop: null
  };

  try {
    // Send the image URL to Groq API
    const response = await axios.post(
      GROQ_API_URL,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        }
      }
    );

    // Assuming the response contains a list of detected products in 'objects'
    const detectedProducts = response.data.objects || [];

    // You can store the detected products in your model (e.g., 'Product' model)
    applyParams({ product: detectedProducts }, record);
    await save(record);

    // Log the result and return a success message
    logger.info(`Extracted ${detectedProducts.length} products from the image.`);
    return { detectedProducts };
  } catch (error) {
    logger.error("Error calling Groq API:", error);
    throw new Error("Error extracting products from the image.");
  }
};

// Define the action options
export const options: ActionOptions = {
  actionType: "create",  // Action type is create
  name: "extractProduct",  // Name of the action
  params: [
    { name: "imageUrl", type: "string", required: true },  // Image URL to extract products from
  ],
  availableOn: "image",  // Action applies to a specific model (replace with your model name)
};