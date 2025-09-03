import { corsHeaders } from '../_shared/cors.ts';

interface DocGenRequest {
  prompt: string;
  attachmentPath?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, attachmentPath }: DocGenRequest = await req.json();
    
    console.log('Generating document for prompt:', prompt);
    console.log('Attachment path:', attachmentPath);

    // TODO: Implement actual document generation with GROQ API
    // For now, return a mock response for testing
    const mockResponse = {
      success: true,
      generatedContent: `Mock generated document based on: ${prompt}`,
      docxUrl: 'https://example.com/generated.docx',
      pdfUrl: 'https://example.com/generated.pdf',
    };

    return new Response(
      JSON.stringify(mockResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('DocGen Error:', error);
    return new Response(
      JSON.stringify({ error: 'Document generation failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});