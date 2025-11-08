"use client";

import { useState, useRef, ChangeEvent } from "react";
import NavMenu from "@/components/NavMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FileText, Search } from "lucide-react";

interface UploadFile {
  name: string;
  progress: number;
}

interface Model {
  id: string;
  name: string;
  count: number;
}

export default function Uploadpage() {
  const [files, setFiles] = useState<UploadFile[]>([
    { name: "Document.pdf", progress: 100 },
    { name: "Document2.pdf", progress: 60 },
    { name: "Document3.pdf", progress: 37 },
  ]);
  const [selectedModel, setSelectedModel] = useState("finance");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const models: Model[] = [
    { id: "finance", name: "Finance Model", count: 1 },
    { id: "executive", name: "Executive Model", count: 51 },
    { id: "medical", name: "Medical Model", count: 1 },
  ];

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFiles((prev) => [{ name: file.name, progress: 0 }, ...prev]);
    event.target.value = "";
  };

  const handleAddDocument = () => {
    fileInputRef.current?.click();
  };

  const handleClearQuery = () => {
    setFiles([]);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-400";
    return "bg-gray-400";
  };

  const overallProgress = files.length
    ? Math.round(
        files.reduce((total, file) => total + file.progress, 0) / files.length,
      )
    : 0;

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-gray-900">svg here</div>
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

          {/* Empty State / Upload Area */}
          <Card className="mb-8 bg-gray-100 p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <FileText className="h-16 w-16 text-gray-400" />
              <p className="text-lg text-gray-700">
                No documents are listed for this customer.
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

          {/* Progress Bar */}
          {files.length > 0 && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Uploading Files
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {overallProgress}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <Card className="mb-8 p-6">
              <div className="space-y-1">
                <div className="mb-4 grid grid-cols-2 border-b pb-2">
                  <div className="font-semibold text-gray-700">Name</div>
                  <div className="font-semibold text-gray-700">Status</div>
                </div>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 items-center py-3"
                  >
                    <div className="text-gray-600">{file.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="relative h-6 w-48 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full transition-all ${getProgressColor(file.progress)}`}
                          style={{ width: `${file.progress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                          {file.progress}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Model Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Select which Model to use for OCR
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
                    <Badge
                      variant="secondary"
                      className={`${
                        selectedModel === model.id
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {model.count}
                    </Badge>
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-green-500 hover:bg-green-600">OCR</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
