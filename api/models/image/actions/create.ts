import { applyParams, save, ActionOptions, assert } from "gadget-server"; 
import axios, { AxiosError } from "axios";

export const params = {
  isChildCreation: { type: "boolean" }
};

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface ParsedImageData {
  product: string;
  quantity: number;
  xposition: number;
  yposition: number;
  width: number;
  height: number;
}

function parseRow(row: string, rowIndex: number): ParsedImageData | null {
  const columns = row.split('|').map(col => col.trim()).filter(Boolean);
  if (columns.length < 6) return null;

  const [product, quantity, x, y, width, height] = columns;
  
  const cleanProduct = product.replace(/\^\d+\.\s+/, '').trim();
 
  if (!cleanProduct || !quantity || !x || !y || !width || !height) return null;

  return {
    product: cleanProduct,
    quantity: parseFloat(quantity) || 0,
    xposition: parseFloat(x) || 0,
    yposition: parseFloat(y) || 0,
    width: parseFloat(width) || 0,
    height: parseFloat(height) || 0,
  };
}

export const run: ActionRun = async ({ params, record, logger, api }) => {
  logger.info("Starting image create action");

  await applyParams(params, record);
  assert(params.image?.image, "No image file provided in params");
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api }) => {
  assert(record.image?.url, "Image URL not available after save");
  
  // Skip Groq processing for child records
  if (params.isChildCreation === true) {
    logger.info({ recordId: record.id }, "Skipping Groq processing for child record");
    return [record];
  }

  const imageUrl = record.image.url as string;
  try {
    logger.info({ imageUrl }, "Sending request to Groq API");
    const response = await axios.post(
      GROQ_API_URL,
      {
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "List all objects in a table with their name, quantity, position x, position y, width and height. Format each row as: | 1. Object Name | quantity | position x | position y | width | height |. Do not provide anything other than the table exclude a table heading."
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
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        }
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    assert(content, "No content received from Groq API");
    logger.info({ content }, "Received Groq response");

    const rows = content.split('\n').filter(row => row.trim() && row.includes('|')); 
    assert(rows.length > 0, "No valid data rows found in response");

    const createdRecords = [];
    
    const firstRowData = parseRow(rows[0], 0);
    if (firstRowData) {
      logger.info({ firstRowData }, "Updating initial record with parsed data");
      Object.assign(record, firstRowData);
      await save(record);
      createdRecords.push(record);
    }

    for (let i = 1; i < rows.length; i++) {
      const rowData = parseRow(rows[i], i);
      if (!rowData) {
        logger.warn({ row: rows[i] }, `Skipping invalid row ${i + 1}`);
        continue;
      }

      logger.info({ rowData, index: i }, "Creating new record from parsed data");
      const newRecord = await api.image.create({
        image: { 
          image: { copyURL: record.image.url },
          ...rowData
        }, 
        isChildCreation: true 
      });
      createdRecords.push(newRecord);
    }

    logger.info({ recordCount: createdRecords.length }, "Successfully processed image records");
    return createdRecords;
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      throw new Error("Unknown error occurred");
    }
    
    logger.error({ error: error.message }, "Error in image processing");
    logger.error({ error }, "Error in Groq API processing");
    if (error instanceof AxiosError && error.response?.data) {
      throw new Error(`Groq API error: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true
};
