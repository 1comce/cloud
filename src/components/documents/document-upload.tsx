import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadData } from "aws-amplify/storage";

interface DocumentUploadProps {
  onDocumentUploaded: (document: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }) => void;
}

export default function DocumentUpload({
  onDocumentUploaded,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a document to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Mock upload delay - would be replaced with actual API call
    try {
      const uploadedDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      };

      const result = await uploadData({
        path: `${file.name}`,
        data: file,
        options: {
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              console.log(
                `Upload progress ${Math.round(
                  (transferredBytes / totalBytes) * 100
                )} %`
              );
            }
          },
        },
      }).result;
      if (!result) {
        throw new Error();
      }
      console.log(result);
      setFile(null);

      toast({
        title: "Document uploaded",
        description: `${file.name} has been successfully uploaded and processed`,
      });

      onDocumentUploaded(uploadedDocument);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Try again later",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-xl'>Upload Document</CardTitle>
        <CardDescription>
          Upload PDFs, Word documents, or text files to enable AI conversations
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-6 hover:border-primary/50 transition-colors'>
          <UploadCloud className='h-10 w-10 text-primary/60 mb-2' />
          <div className='space-y-1 text-center'>
            <p className='text-sm text-muted-foreground'>
              {file ? file.name : "Drag & drop your files or click to browse"}
            </p>
            <p className='text-xs text-muted-foreground'>
              PDF, DOCX, TXT up to 10MB
            </p>
          </div>
          <Input
            id='document-upload'
            type='file'
            className='hidden'
            accept='.pdf,.docx,.txt'
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Label
            htmlFor='document-upload'
            className='mt-4 cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md'
          >
            Select File
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className='w-full'
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </Button>
      </CardFooter>
    </Card>
  );
}
