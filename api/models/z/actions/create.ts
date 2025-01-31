import { applyParams, save, ActionOptions, assert } from "gadget-server";

import axios from 'axios';

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {

  // Apply initial parameters and wait for file processing
  await applyParams(params, record);

  logger.info("Starting image analysis process");

  // Ensure image was uploaded
  assert(record.image?.url, "No image URL available - please upload an image first");

  const imageUrl = record.image.url as string;
  logger.info({ imageUrl }, "Processing image URL");

  const requestData = {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "In a table list all the objects with their respective name, quantity, position x, position y, width and height. Format each row as: | Product Name | Quantity | X | Y | Width | Height |"
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

  logger.info("Sending request to Groq API");

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

    assert(response.data?.choices?.[0]?.message?.content, "Invalid response from Groq API");

    const content = response.data.choices[0].message.content;
    logger.info({ content }, "Parsed Groq response");

    // Extract the first row of data (assuming single product for now)
    const rows = content.split('\n').filter(row => row.includes('|'));
    assert(rows.length > 0, "No product data found in response");

    const firstRow = rows[0];
    const columns = firstRow.split('|').map(col => col.trim()).filter(Boolean);
    assert(columns.length >= 6, "Invalid data format in response");

    // Extract values and convert to numbers where needed
    const [productName, quantity, x, y, width, height] = columns;

    await save(record);

    // Update record with parsed values
    applyParams({
      product: productName,
      quantity: parseFloat(quantity) || 0,
      xposition: parseFloat(x) || 0,
      yposition: parseFloat(y) || 0,
      width: parseFloat(width) || 0,
      height: parseFloat(height) || 0
    }, record);

  } catch (error) {
    logger.error({ error }, "Error processing Groq API request");
    if (axios.isAxiosError(error)) {
      throw new Error(`Groq API error: ${error.response?.data?.error || error.message}`);
    }
    throw error;
  }
};

export const options: ActionOptions = {
 
  actionType: "create"
};
