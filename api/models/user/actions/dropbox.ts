import { ActionOptions, save } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  const { fileName, fileContent } = params;

  if (!fileName || !fileContent) {
    throw new Error("File name and content are required.");
  }

  // Decode base64 file content
  const buffer = Buffer.from(fileContent, "base64");

  // Save the file to storage (adjust for your Gadget storage provider if needed)
  const uploadedFile = await api.storage.upload({
    path: `uploads/${fileName}`,
    content: buffer,
    contentType: "application/octet-stream",
  });

  // Save file metadata in the database
  record.fileName = fileName;
  record.uploadedAt = new Date();
  record.fileUrl = uploadedFile.url;

  await save(record);

  return {
    result: "ok",
    fileUrl: uploadedFile.url,
  };
};

export const params = {
  fileName: { type: "string" },
  fileContent: { type: "string" }, // Base64-encoded content
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
};
