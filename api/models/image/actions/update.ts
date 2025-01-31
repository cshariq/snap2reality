import { applyParams, save, ActionOptions } from "gadget-server";
import axios from 'axios';

interface ProductEntry {
  product: string;
  quantity?: number;
  xposition?: number;
  yposition?: number;
  width?: number;
  height?: number;
}

export const params = {
  productEntries: { 
    type: "array",
    items: {
      type: "object",
      properties: {
        product: { type: "string" },
        quantity: { type: "number" },
        xposition: { type: "number" },
        yposition: { type: "number" },
        width: { type: "number" },
        height: { type: "number" }
      }
    }
  }
};

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);

  logger.info("Starting image analysis process");

  if (!record.image?.url) {
    logger.error("No image uploaded");
    throw new Error("No image URL available - please upload an image first");
  }

  // Handle multiple product entries if provided
  if (params.productEntries) {
    logger.info("Processing multiple product entries");
    
    const results = [];
    for (const entry of params.productEntries as ProductEntry[]) {
      const newRecord = await api.image.create({
        image: { 
          image: record.image 
        },
        product: entry.product,
        quantity: entry.quantity,
        xposition: entry.xposition,
        yposition: entry.yposition,
        width: entry.width,
        height: entry.height
      });
      results.push(newRecord);
    }
    return { success: true, records: results };
  }

  const imageUrl = record.image.url as string;

  if (!imageUrl) {
    throw new Error('No image URL provided.');
  }

  const requestData = {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "In the a table list all the objects with their respective name, quantity, position x, position y, width and height. It should be in this format with each object having a new row | 1. Arduino Uno | 10 | 360 | 140 | 240 |. Avoid any other text, and empty columns."
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
    model: "llama-3.2-11b-vision-preview",
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false,
    stop: null
  };

  try {
    logger.info({ imageUrl }, "Sending request to Groq API");
    const response = await axios.post(
      GROQ_API_URL,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        }
      }
    );

    // Log the complete response for debugging
    logger.info({ groqResponse: response.data.choices[0].message.content }, "Received Groq API response");

    // Validate response structure
    if (!response.data || !response.data.choices || !response.data.choices.length) {
      throw new Error("Invalid response structure from Groq API");
    }

    const completion = response.data.choices[0];
    if (!completion.message || !completion.message.content) {
      throw new Error("No content in Groq API response");
    }

    // Store both raw response and extracted content
    const productData = {
      rawResponse: response.data,
      extractedContent: completion.message.content,
      timestamp: new Date().toISOString()
    };

    applyParams({ product: productData }, record);
    applyParams({ quantity: productData }, record);

    await save(record);

    return {
      content: completion.message.content,
      imageUrl,  // Add the image URL here
    };

  } catch (error) {
    logger.error({ error }, "Error processing Groq API request");
    if (axios.isAxiosError(error)) {
      throw new Error(`Groq API error: ${error.response?.data?.error || error.message}`);
    }
    throw new Error(error instanceof Error ? error.message : "Error processing image analysis");
  }
};

export const options: ActionOptions = { actionType: "create" };