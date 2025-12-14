"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { apiService, ProcessingJob, Document, DataTable } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { FileText, X, Play, CheckSquare } from "lucide-react";
import { toast } from "@/components/ui/toast";

function statusVariant(status: string) {
  switch (status) {
    case "completed":
      return "default";
    case "running":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

export default function ProcessingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<ProcessingJob | null>(null);

  // Queue jobs state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tables, setTables] = useState<DataTable[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [ocrEngine, setOcrEngine] = useState<string>("tesseract-standard");
  const [queuing, setQueuing] = useState(false);

  const loadJobs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiService.listProcessingJobs();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadDocuments = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiService.listDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  }, [user]);

  const loadTables = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiService.listDataTables();
      setTables(data);
      if (!selectedTableId && data.length > 0) {
        setSelectedTableId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load tables:", error);
    }
  }, [user, selectedTableId]);

  const handleQueueJobs = async () => {
    if (selectedDocIds.length === 0) {
      toast.error("Please select at least one document");
      return;
    }
    if (!selectedTableId) {
      toast.error("Please select a target table");
      return;
    }

    setQueuing(true);
    try {
      await apiService.queueProcessingJobs(selectedDocIds, ocrEngine, selectedTableId);
      toast.success(`${selectedDocIds.length} job(s) queued successfully`);
      setSelectedDocIds([]);
      await loadJobs();
    } catch (error) {
      console.error("Failed to queue jobs:", error);
      toast.error("Failed to queue jobs. Please try again.");
    } finally {
      setQueuing(false);
    }
  };

  const toggleDocSelection = (docId: number) => {
    setSelectedDocIds(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map(d => d.id));
    }
  };

  useEffect(() => {
    if (!user) return;
    loadJobs();
    loadDocuments();
    loadTables();
    const interval = setInterval(loadJobs, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [user, loadJobs, loadDocuments, loadTables]);

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-600 text-lg">Please sign in to access processing features.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Processing Center</h1>
        <p className="text-gray-600 mt-2">
          Queue OCR jobs and monitor their progress
        </p>
      </div>

      {/* Queue Jobs Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Queue New Jobs</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Document Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Select Documents ({selectedDocIds.length} selected)
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={toggleSelectAll}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                {selectedDocIds.length === documents.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 p-4">
                  No documents available. Upload documents first.
                </p>
              ) : (
                <div className="divide-y">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition ${
                        selectedDocIds.includes(doc.id) ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => toggleDocSelection(doc.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDocIds.includes(doc.id)}
                        onChange={() => {}}
                        className="h-4 w-4"
                      />
                      <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.filename}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.file_size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            {/* Target Table */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Target Table *
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
              >
                <option value="">Select table...</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
              </select>
              {tables.length === 0 && (
                <p className="text-xs text-red-600 mt-1">
                  No tables available. Create a table in the Data Hub first.
                </p>
              )}
            </div>

            {/* OCR Engine */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                OCR Engine
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={ocrEngine}
                onChange={(e) => setOcrEngine(e.target.value)}
              >
                <optgroup label="Local (Tesseract)">
                  <option value="tesseract-standard">Standard - Balanced speed & accuracy</option>
                  <option value="tesseract-fast">Fast - Quick processing, lower accuracy</option>
                  <option value="tesseract-accurate">Accurate - Slower, highest accuracy</option>
                </optgroup>
                <optgroup label="AWS Textract (Placeholder - Not Implemented)">
                  <option value="textract-detect">Textract: Document Text Detection</option>
                  <option value="textract-analyze">Textract: Document Analysis</option>
                  <option value="textract-forms">Textract: Forms Extraction</option>
                  <option value="textract-tables">Textract: Tables Extraction</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {ocrEngine.startsWith('textract')
                  ? '⚠️ AWS Textract integration coming soon. Currently uses local Tesseract.'
                  : 'Using local Tesseract OCR engine'}
              </p>
            </div>

            {/* Queue Button */}
            <Button
              className="w-full"
              onClick={handleQueueJobs}
              disabled={queuing || selectedDocIds.length === 0 || !selectedTableId}
            >
              <Play className="h-4 w-4 mr-2" />
              {queuing ? 'Queuing...' : `Queue ${selectedDocIds.length || ''} Job${selectedDocIds.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Jobs</h2>
          <Button variant="outline" size="sm" onClick={loadJobs} disabled={loading}>
            Refresh
          </Button>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No jobs yet. Queue OCR from the Documents page.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="rounded border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Document #{job.document_id}</p>
                    <p className="font-medium text-gray-900">{job.engine}</p>
                    {job.target_table?.name && (
                      <p className="text-xs text-gray-500">
                        Target table: {job.target_table.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === "completed" && job.result && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedJob(job)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Raw Data
                      </Button>
                    )}
                    <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
                  </div>
                </div>
                {job.result && job.result.text ? (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{job.result.text}</p>
                ) : null}
                {typeof job.confidence === "number" && (
                  <p className="mt-2 text-xs text-gray-500">
                    Confidence: {(job.confidence * 100).toFixed(1)}%
                  </p>
                )}
                {job.error ? (
                  <p className="mt-2 text-sm text-red-600">{job.error}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Raw Data Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Raw OCR Data</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Document #{selectedJob.document_id} • {selectedJob.engine}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedJob(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Metadata</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge variant={statusVariant(selectedJob.status)} className="mt-1">
                      {selectedJob.status}
                    </Badge>
                  </div>
                  {typeof selectedJob.confidence === "number" && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overall Confidence</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {(selectedJob.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {selectedJob.target_table?.name && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Target Table</p>
                      <p className="text-sm text-gray-900 mt-1">{selectedJob.target_table.name}</p>
                    </div>
                  )}
                  {selectedJob.result?.metadata?.field_count && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fields Extracted</p>
                      <p className="text-sm text-gray-900 mt-1">{selectedJob.result.metadata.field_count}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Extracted Fields */}
              {selectedJob.result?.fields && Object.keys(selectedJob.result.fields).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Extracted Fields</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {Object.entries(selectedJob.result.fields).map(([key, value]: [string, any]) => (
                      <div key={key} className="border-b border-gray-200 pb-3 last:border-0">
                        <p className="text-sm font-medium text-gray-700">{key}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm text-gray-900">
                            {value?.value || (typeof value === 'string' ? value : JSON.stringify(value))}
                          </p>
                          {typeof value?.confidence === 'number' && (
                            <Badge variant="outline" className="ml-2">
                              {(value.confidence * 100).toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Extracted Text */}
              {selectedJob.result?.text && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Raw Extracted Text</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-auto">
                    {selectedJob.result.text}
                  </div>
                </div>
              )}

              {/* Full Result JSON */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Full Result (JSON)</h3>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs whitespace-pre-wrap max-h-96 overflow-auto">
                  {JSON.stringify(selectedJob.result, null, 2)}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end">
              <Button onClick={() => setSelectedJob(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

