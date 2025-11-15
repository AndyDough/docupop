"use client";

import { useState, useEffect } from "react";
import NavMenu from "@/components/NavMenu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DocumentRecord {
  id: number;
  file_name: string;
  summarized_data: string;
}

export default function Reviewpage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRecord | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    };
    fetchDocuments();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-gray-900">Docupop</div>
        <NavMenu />
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="w-1/3 pr-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Documents</h2>
          <Card className="overflow-hidden border bg-white shadow-sm">
            <ul>
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className={`cursor-pointer p-4 hover:bg-gray-100 ${
                    selectedDocument?.id === doc.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  {doc.file_name}
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="w-2/3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary</h2>
          <Card className="overflow-hidden border bg-white shadow-sm p-6">
            {selectedDocument ? (
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedDocument.file_name}</h3>
                <p>{selectedDocument.summarized_data}</p>
              </div>
            ) : (
              <p>Select a document to see the summary.</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
