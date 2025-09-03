import React, { useState } from 'react';
import { Upload, FileImage, Download, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function OCRPage() {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormats, setOutputFormats] = useState({ docx: true, pdf: false });
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (!outputFormats.docx && !outputFormats.pdf) {
      toast.error('Please select at least one output format');
      return;
    }

    setProcessing(true);
    const newResults = [];

    try {
      for (const file of selectedFiles) {
        // Upload file to Supabase Storage
        const fileName = `${user!.id}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Create document record
        const { data: document, error: dbError } = await supabase
          .from('documents')
          .insert({
            user_id: user!.id,
            action: 'OCR',
            ocr_image_path: uploadData.path,
            status: 'processing',
          })
          .select()
          .single();

        if (dbError) throw dbError;

        // For now, simulate OCR processing
        // TODO: Call actual OCR edge function
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update document with results
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            status: 'completed',
            docx_path: outputFormats.docx ? `documents/${user!.id}/${document.id}.docx` : null,
            pdf_path: outputFormats.pdf ? `documents/${user!.id}/${document.id}.pdf` : null,
          })
          .eq('id', document.id);

        if (updateError) throw updateError;

        newResults.push({
          fileName: file.name,
          documentId: document.id,
          docxUrl: outputFormats.docx ? '#' : null, // TODO: Generate signed URLs
          pdfUrl: outputFormats.pdf ? '#' : null,
        });
      }

      setResults(newResults);
      toast.success('OCR processing completed!');
    } catch (error: any) {
      toast.error(error.message || 'Processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">OCR Conversion</h1>
        
        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Images for OCR
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
          />

          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium text-gray-900">Selected Files:</h3>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  <FileImage className="w-4 h-4" />
                  <span>{file.name}</span>
                  <span className="text-gray-400">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Output Format Selection */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Output Formats:</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={outputFormats.docx}
                onChange={(e) => setOutputFormats(prev => ({ ...prev, docx: e.target.checked }))}
                className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              />
              <span className="ml-2 text-sm text-gray-700">Word Document (.docx)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={outputFormats.pdf}
                onChange={(e) => setOutputFormats(prev => ({ ...prev, pdf: e.target.checked }))}
                className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              />
              <span className="ml-2 text-sm text-gray-700">PDF Document (.pdf)</span>
            </label>
          </div>
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcess}
          disabled={processing || selectedFiles.length === 0 || (!outputFormats.docx && !outputFormats.pdf)}
          className="w-full bg-yellow-400 text-yellow-900 py-3 px-4 rounded-lg font-medium hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {processing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Processing OCR...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Start OCR Conversion</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conversion Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{result.fileName}</h3>
                <div className="flex space-x-3">
                  {result.docxUrl && (
                    <a
                      href={result.docxUrl}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download DOCX</span>
                    </a>
                  )}
                  {result.pdfUrl && (
                    <a
                      href={result.pdfUrl}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}