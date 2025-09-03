import React, { useState } from 'react';
import { FileText, Upload, Download, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function DocGenPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachedFile(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setProcessing(true);
    try {
      // Create document record first
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user!.id,
          action: 'DOCGEN',
          prompt,
          status: 'processing',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // For now, simulate document generation
      // TODO: Implement actual edge function call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update document status
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          status: 'completed',
          docx_path: `documents/${user!.id}/${document.id}.docx`,
          pdf_path: `documents/${user!.id}/${document.id}.pdf`,
        })
        .eq('id', document.id);

      if (updateError) throw updateError;

      setResult({
        id: document.id,
        docxUrl: '#', // TODO: Generate actual signed URLs
        pdfUrl: '#',
      });

      toast.success('Document generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Document Generation</h1>

        {/* Prompt Input */}
        <div className="mb-6">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Document Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
            placeholder="Describe the document you want to generate..."
          />
        </div>

        {/* File Attachment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attach Reference File (Optional)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
          />
          {attachedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {attachedFile.name}
            </p>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={processing || !prompt.trim()}
          className="w-full bg-yellow-400 text-yellow-900 py-3 px-4 rounded-lg font-medium hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {processing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Generate Document</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Document</h2>
          <div className="flex space-x-3">
            <a
              href={result.docxUrl}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download DOCX</span>
            </a>
            <a
              href={result.pdfUrl}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}