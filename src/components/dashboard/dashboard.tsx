"use client";
import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FileText } from "lucide-react";
import DocumentUpload from "@/components/documents/document-upload";
import DocumentsList, { Document } from "@/components/documents/document-list";
import ChatContainer from "@/components/chat/chat-container";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { list } from "aws-amplify/storage";
import LogoutForm from "./logout-form";
import { fetchMessages } from "@/lib/apiAction";
import { get } from "http";
interface DashboardProps {
  user: { email: string };
}
interface S3Object {
  eTag: string;
  path: string;
  size: number;
  lastModified: Date;
}
export default function Dashboard({ user }: DashboardProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    const getFiles = async () => {
      try {
        const result = await list({
          path: "",
          // Alternatively, path: ({identityId}) => `protected/${identityId}/photos/`
        });
        console.log(result);
        setDocuments(
          (result.items as S3Object[]).map((item) => ({
            id: item.eTag,
            name: item.path,
            type: item.path.split(".")[1],
            size: item.size,
            uploadedAt: item.lastModified,
          }))
        );
        await fetchMessages();
      } catch (error) {
        console.log(error);
      }
    };
    getFiles();
  }, []);
  const handleDocumentUploaded = (doc: Document) => {
    setDocuments((prev) => [...prev, doc]);
    setSelectedDocIds((prev) => new Set(prev).add(doc.id));
  };

  const handleDocumentRemove = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    setSelectedDocIds((prev) => {
      const updated = new Set(prev);
      updated.delete(docId);
      return updated;
    });
  };

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(docId)) {
        updated.delete(docId);
      } else {
        updated.add(docId);
      }
      return updated;
    });
  };
  const selectedDocuments = documents.filter((doc) =>
    selectedDocIds.has(doc.id)
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <div className='h-screen flex w-full'>
        <Sidebar className=''>
          <div className='px-3 py-2 flex items-center justify-between border-b'>
            <div className='flex items-center space-x-2 font-medium'>
              <FileText className='h-5 w-5 text-primary' />
              <span>RAG Chatbot</span>
            </div>
            {/* <SidebarTrigger /> */}
          </div>
          <SidebarContent>
            <div className='p-3 '>
              <div className='flex items-center justify-between pb-3 mb-3 border-b'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground'>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className='text-sm font-medium'>{user.email}</div>
                  </div>
                </div>
                <LogoutForm />
              </div>

              <div className='space-y-4'>
                <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
                <DocumentsList
                  documents={documents}
                  onDocumentRemove={handleDocumentRemove}
                  onDocumentSelect={handleDocumentSelect}
                />
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className='flex-1 p-4 flex flex-col relative'>
          {/* Floating sidebar toggle button that's always visible */}
          <div className='absolute top-4 left-4 z-20'>
            <SidebarTrigger />
          </div>
          <ChatContainer selectedDocuments={selectedDocuments} />
        </main>
      </div>
    </SidebarProvider>
  );
}
