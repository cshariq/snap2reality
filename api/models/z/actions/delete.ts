import { useState, useEffect, type FC, type DragEvent, type ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from "../api";
import { useAction } from "@gadgetinc/react";
import type { CreateImageResult } from "@gadget-client/testtttttttt";

type SignedInPageProps = Record<string, never>;

const SignedInPage: FC<SignedInPageProps> = () => {  
  const [isDragging, setIsDragging] = useState(false);
  const [currentFile, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<CreateImageResult | null>(null);
  
  const { toast } = useToast();
  const [{ fetching: isUploading, error: uploadError }, upload] = useAction(api.image.create);
  
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  
    const file = event.dataTransfer?.files[0];
    if (file) {
      setFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };
  
  // Cleanup object URL when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);
  
  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return false;
    }
    return true;
  };
  
  const handleFileUpload = async () => {
    if (!currentFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No file selected",
      });
      return;
    }
    
    if (!validateFile(currentFile)) {
      return;
    }
 
    try {
      const result = await upload({
        image: {
          image: { file: currentFile },
          product: currentFile.name,
        },
      });
      
      setUploadResult(result);
      setFile(null);
      setImageUrl(null);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="flex flex-col space-y-4">
        <Card
          className={`p-6 border-2 ${isDragging ? "border-blue-500" : "border-dashed border-gray-300"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && document.getElementById("fileInput")?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-md"
              />
            ) : (
              <p className="text-base text-gray-500">
                {currentFile ? `File selected: ${currentFile.name}` : "Drop a file here or click to browse"}
              </p>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              disabled={isUploading}
              style={{ display: "none" }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (imageUrl) {
                  URL.revokeObjectURL(imageUrl);
                }
                const file = e.target.files?.[0] || null;
                setFile(file);
                if (file) {
                  setImageUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </Card>

        <div className="flex justify-center items-center">
          <button
            onClick={handleFileUpload}
            disabled={isUploading}
            className="bg-orange-500 text-white hover:bg-orange-600 rounded-full px-6 py-2 text-lg tracking-wider transition-all duration-300 hover:opacity-90"
          >
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
          {uploadError && (
            <p className="text-red-500 mt-2">Upload failed: {uploadError.message}</p>
          )}
        </div>

        <h1 className="text-3xl font-semibold text-white tracking-tight mb-6">Upload Results</h1>
        {uploadResult?.image ? (
          <div className="flex flex-col space-y-4">
            <Card className="p-4 bg-gray-800">
              <h3 className="text-lg font-semibold mb-2">Image Details</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-300">File name: {uploadResult.image.product}</p>
                <p className="text-sm text-gray-300">Upload time: {new Date(uploadResult.image.createdAt).toLocaleString()}</p>
              </div>
            </Card>
            {uploadResult.image.image?.url && (
              <img 
                src={uploadResult.image.image.url} 
                alt="Uploaded image"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            )}
          </div>
        ) : (
          <Card className="p-4 bg-gray-800">
            <p className="text-gray-500">Upload an image to see results</p>
          </Card>
        )}
      </div>

      {/* Right Column */}
      <div className="space-y-4">
      </div>
    </div>
  );
};

export default SignedInPage;