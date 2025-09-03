import { corsHeaders } from '../_shared/cors.ts';

interface OCRRequest {
  imagePath: string;
  formats: {
    docx: boolean;
    pdf: boolean;
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imagePath, formats }: OCRRequest = await req.json();
    
    console.log('Processing OCR for:', imagePath);
    console.log('Output formats:', formats);

    // TODO: Implement actual OCR with GROQ API
    // For now, return a mock response for testing
    const mockResponse = {
      success: true,
      extractedText: 'This is mock extracted text from the image.',
      docxUrl: formats.docx ? 'https://example.com/mock.docx' : null,
      pdfUrl: formats.pdf ? 'https://example.com/mock.pdf' : null,
    };

    return new Response(
      JSON.stringify(mockResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('OCR Error:', error);
    return new Response(
      JSON.stringify({ error: 'OCR processing failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});