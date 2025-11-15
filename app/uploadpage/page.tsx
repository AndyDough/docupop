"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import NavMenu from "@/components/NavMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FileText, Search, Loader } from "lucide-react";

interface UploadFile {
  id: number;
  file_name: string;
  summarized_data?: string;
}

interface Model {
  id: string;
  name: string;
}

export default function Uploadpage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedModel, setSelectedModel] = useState("finance");
  const [searchQuery, setSearchQuery] = useState("");
  const [summarizingFileId, setSummarizingFileId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    };
    fetchFiles();
  }, []);

  const models: Model[] = [
    { id: "finance", name: "Finance" },
    { id: "executive", name: "Executive" },
    { id: "medical", name: "Medical" },
    { id: "general", name: "General" },
  ];

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/documents", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const newFile = await res.json();
      setFiles((prev) => [newFile, ...prev]);
    }

    event.target.value = "";
  };

  const handleAddDocument = () => {
    fileInputRef.current?.click();
  };

  const handleClearQuery = async () => {
    const res = await fetch("/api/documents", {
      method: "DELETE",
    });

    if (res.ok) {
      setFiles([]);
    }
  };

  const handleDelete = async (documentId: number) => {
    const res = await fetch(`/api/documents/${documentId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setFiles((prev) => prev.filter((file) => file.id !== documentId));
    }
  };

  const handleSummarize = async (documentId: number) => {
    setSummarizingFileId(documentId);
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId, model: selectedModel }),
    });

    if (res.ok) {
      const summarizedFile = await res.json();
      setFiles((prev) =>
        prev.map((file) =>
          file.id === documentId ? summarizedFile : file
        )
      );
    }
    setSummarizingFileId(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-gray-900">Docupop</div>
        <NavMenu />
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-1 px-6 pt-24 pb-12">
        <div className="w-full">
          <input
            ref={fileInputRef}
            type="file"
            accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload Area */}
          <Card className="mb-8 bg-gray-100 p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <FileText className="h-16 w-16 text-gray-400" />
              <p className="text-lg text-gray-700">
                Upload documents for this customer.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={handleAddDocument}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Add Document
                </Button>
                <Button
                  onClick={handleClearQuery}
                  variant="outline"
                  className="bg-gray-300 hover:bg-gray-400"
                >
                  Clear Query
                </Button>
              </div>
            </div>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card className="mb-8 p-6">
              <div className="space-y-1">
                                  <div className="mb-4 grid grid-cols-4 border-b pb-2">
                                    <div className="font-semibold text-gray-700">Name</div>
                                    <div className="font-semibold text-gray-700">Status</div>
                                    <div className="font-semibold text-gray-700 col-span-2">Action</div>
                                  </div>
                                  {files.map((file) => (
                                    <div
                                      key={file.id}
                                      className="grid grid-cols-4 items-center py-3"
                                    >
                                      <div className="text-gray-600">{file.file_name}</div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant={file.summarized_data ? "default" : "secondary"}>
                                          {file.summarized_data ? "Summarized" : "Uploaded"}
                                        </Badge>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button onClick={() => handleSummarize(file.id)} disabled={!!file.summarized_data || summarizingFileId === file.id}>
                                          {summarizingFileId === file.id && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                          Summarize
                                        </Button>
                                        <Button onClick={() => handleDelete(file.id)} variant="destructive">
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  ))}              </div>
            </Card>
          )}

          {/* Model Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Select which Model to use for Summarization
            </h2>
            <Card className="p-6">
              <div className="space-y-3">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                      selectedModel === model.id
                        ? "border-cyan-400 bg-cyan-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <span
                      className={`font-medium ${
                        selectedModel === model.id
                          ? "text-cyan-600"
                          : "text-gray-700"
                      }`}
                    >
                      {model.name}
                    </span>
                  </div>
                ))}
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
