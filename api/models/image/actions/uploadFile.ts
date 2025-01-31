import { ActionRun, ActionOptions } from "gadget-server";
import { S3 } from "aws-sdk";  // Or any other file storage service you're using

const s3 = new S3();

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  const { fileName, fileContent } = params;

  if (!fileName || !fileContent) {
    throw new Error("File name or content missing.");
  }

  const buffer = Buffer.from(fileContent, "base64");

  try {
    // Upload file to S3
    const uploadResponse = await s3
      .upload({
        Bucket: process.env.S3_BUCKET_NAME,  // Your S3 bucket name
        Key: fileName,
        Body: buffer,
        ContentType: "image/jpeg",  // Adjust depending on the file type
      })
      .promise();

    // Return the file URL
    const fileUrl = uploadResponse.Location;
    return { fileUrl };
  } catch (error) {
    logger.error("Error uploading file to S3:", error);
    throw new Error("File upload failed.");
  }
};

export const options: ActionOptions = {
  actionType: "create",
  name: "uploadFile",
  params: [
    { name: "fileName", type: "string", required: true },
    { name: "fileContent", type: "string", required: true },
  ],
};
