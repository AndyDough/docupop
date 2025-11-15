"use client";

import { useState, useEffect } from "react";
import NavMenu from "@/components/NavMenu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DocumentRecord {
  id: number;
  file_name: string;
  summarized_data: string;
}

export default function Datapage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

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

  const handleDelete = async (documentId: number) => {
    const res = await fetch(`/api/documents/${documentId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-gray-900">Docupop</div>
        <NavMenu />
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="w-full">
          <Card className="overflow-hidden border bg-white shadow-sm">
            <Table className="w-full">
              <TableHeader className="bg-gray-100">
                <TableRow className="hover:bg-gray-100">
                  <TableHead className="text-gray-600">Document Name</TableHead>
                  <TableHead className="text-gray-600">Summary Status</TableHead>
                  <TableHead className="text-gray-600">Summary Actions</TableHead>
                  <TableHead className="text-gray-600">Download Original</TableHead>
                  <TableHead className="text-gray-600">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow
                    key={document.id}
                    className="bg-white hover:bg-transparent"
                  >
                    <TableCell className="text-sm text-gray-700">
                      {document.file_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={document.summarized_data ? "default" : "secondary"}>
                        {document.summarized_data ? "Summarized" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {document.summarized_data && (
                        <Button asChild>
                          <a
                            href={`/api/summaries/${document.id}`}
                            download={`${document.file_name}-summary.txt`}
                          >
                            Download Summary
                          </a>
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button asChild>
                        <a href={`/api/documents/${document.id}`} download={document.file_name}>
                          Download Original
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleDelete(document.id)} variant="destructive">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
}
