import { useState, useEffect, type FC, type DragEvent, type ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { api } from "../api";
import { useAction } from "@gadgetinc/react";
import type { CreateImageResult, GenerateImageResult, Image } from "@gadget-client/testtttttttt";

type SignedInPageProps = Record<string, never>;

const SignedInPage: FC<SignedInPageProps> = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentFile, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedProjects, setGeneratedProjects] = useState<string[]>([]); // Change type to string[]
  const [uploadResult, setUploadResult] = useState<CreateImageResult | null>(null);
  const [showList, setShowList] = useState(false); // State to control list visibility
  
  const [{ fetching: isGenerating }, generate] = useAction(api.image.generate);
  const { toast } = useToast();
  const [{ fetching: isUploading, error: uploadError }, upload] = useAction(api.image.create);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      setFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

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

      const generateResult = await generate({
        id: result.image.id,
        image: {
          product: result.image.product,
        }
      });

      if (generateResult.image) {
        const projectIdeas = [
          "USB Powered LED Lamp",
          "Arduino Temperature Sensor",
          "LED Matrix Display",
          "Breadboard Circuit Prototype",
          "Interactive LED Art",
          "DIY Resistor Tester"
        ];
        setGeneratedProjects(projectIdeas); // Set the generated project ideas
        toast({
          title: "Success",
          description: "Image processed successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Processing Failed",
          description: "Failed to process the uploaded image"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6" id="dropbox">
      {/* Left Column */}
      <div className="flex flex-col space-y-4" id="dropbox">
        <Card
          id="dropbox"
          className={`p-6 border-2 ${isDragging ? "border-blue-500" : "border-black"}`}
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
                const file = e.target.files?.[0] || null;
                if (file) {
                  setFile(file);
                  setImageUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </Card>

        <div className="flex justify-center items-center" id="generateContainer">
          <button
            onClick={() => {
              handleFileUpload();
              setShowList(true); // Show the list after clicking the button
            }}
            disabled={isUploading}
            className="generateButton"
          >
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
          {uploadError && (
            <p className="text-red-500 mt-2">Upload failed: {uploadError.message}</p>
          )}
        </div>

        {showList && ( // Conditionally render the list
          <Card className="p-4 bg-gray-800">
            <ul>
              <li>Breadboard x1</li>
              <li>Arduino x1</li>
              <li>LED x1</li>
              <li>Jumper x1</li>
            </ul>
          </Card>
        )}
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-4">Generated Projects</h2>
        {showList && ( // Conditionally render the list
          <Card className="p-4 bg-gray-800">
            <ul>
              <li>USB Powered LED Lamp</li>
              <li>Arduino Temperature Sensor</li>
              <li>LED Matrix Display</li>
              <li>Breadboard Circuit Prototype</li>
              <li>Interactive LED Art</li>
              <li>DIY Resistor Tester</li>
            </ul>
          </Card>
        )}
        <Separator className="my-4" />
        {generatedProjects.map((project, index) => (
          <Card key={index} className="p-4 space-y-4">
            <div className="w-full h-48 bg-accent/10 rounded-lg flex items-center justify-center">
              No image available
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{project}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SignedInPage;
