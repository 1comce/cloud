import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { remove } from "aws-amplify/storage";

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

interface DocumentsListProps {
  documents: Document[];
  onDocumentRemove: (docId: string) => void;
  onDocumentSelect: (docId: string) => void;
}

export default function DocumentsList({
  documents,
  onDocumentRemove,
  onDocumentSelect,
}: DocumentsListProps) {
  const { toast } = useToast();
  const handleRemove = async (docId: string, docName: string) => {
    try {
      await remove({
        path: docName,
        // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
      });
      toast({
        title: "Document removed",
        description: `${docName} has been removed from your knowledge base`,
      });
      onDocumentRemove(docId);
    } catch (error) {
      console.log("Error ", error);
      toast({
        title: "Document remove failed",
        description: `failed to remove ${docName}`,
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getDocumentTypeIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("docx")) return "📝";
    if (type.includes("text")) return "📃";
    return "📜";
  };

  return (
    <Card className='w-full h-full'>
      <CardHeader>
        <CardTitle className='text-xl'>Your Documents</CardTitle>
        <CardDescription>
          {documents.length === 0
            ? "Upload documents to start chatting with your data"
            : `${documents.length} document${
                documents.length === 1 ? "" : "s"
              } in your knowledge base`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px] pr-4'>
          {documents.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-32 text-center'>
              <FileIcon className='h-12 w-12 text-muted-foreground/50 mb-2' />
              <p className='text-sm text-muted-foreground'>
                No documents uploaded yet
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className='p-1 rounded-lg border bg-card flex items-center justify-between hover:bg-accent/10 transition-colors cursor-pointer'
                  onClick={() => onDocumentSelect(doc.id)}
                >
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>
                      {getDocumentTypeIcon(doc.type)}
                    </span>
                    <div>
                      <h4 className='text-sm font-medium line-clamp-1'>
                        {doc.name}
                      </h4>
                      <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        {/* <span>{formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}</span> */}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='opacity-50 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(doc.id, doc.name);
                    }}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
