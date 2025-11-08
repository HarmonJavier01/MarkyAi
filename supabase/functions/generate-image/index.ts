import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, ApiKey, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  let binary = '';
  
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      console.error('❌ No prompt provided');
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🎨 Generating image with Google Gemini 2.5 Flash');
    console.log('📝 Prompt:', prompt);

    // ============================================
    // GOOGLE GEMINI 2.5 FLASH API CONFIGURATION
    // ============================================

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('❌ Gemini API key not configured');
      return new Response(
        JSON.stringify({ error: 'Image generation service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

    // Prepare request body for Gemini 2.5 Flash
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        responseModalities: ["text", "image"]
      }
    };

    console.log('📡 Calling Google Gemini 2.5 Flash API...');

    // Make request to Gemini API
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Marky-AI-Studio/1.0',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Content-Type:', response.headers.get('content-type'));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', response.status);
      console.error('Error details:', errorText);

      return new Response(
        JSON.stringify({
          error: `Image generation failed with status ${response.status}`,
          details: errorText,
          prompt: prompt
        }),
        {
          status: response.status === 429 ? 429 : 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse the Gemini response
    const responseData = await response.json();

    console.log('📦 Response data structure:', Object.keys(responseData));

    // Extract image from Gemini response
    // Gemini returns: { candidates: [{ content: { parts: [{ text: "...", inlineData: { mimeType: "...", data: "..." } }] } }] }
    let imageUrl;
    if (responseData.candidates && responseData.candidates.length > 0) {
      const content = responseData.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        const part = content.parts.find(p => p.inlineData);
        if (part && part.inlineData) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          const base64Data = part.inlineData.data;
          imageUrl = `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    if (!imageUrl) {
      console.error('❌ Could not find image in Gemini response');
      console.error('Response data:', JSON.stringify(responseData, null, 2));
      return new Response(
        JSON.stringify({
          error: 'Could not extract image from Gemini API response',
          responseStructure: Object.keys(responseData)
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // If imageUrl is a URL (not base64), fetch and convert it
    if (imageUrl.startsWith('http')) {
      console.log('🌐 Fetching image from URL...');
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch generated image');
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      const sizeInMB = (arrayBuffer.byteLength / 1024 / 1024).toFixed(2);
      console.log(`📦 Image size: ${sizeInMB} MB`);

      if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
        console.error('❌ Image too large:', sizeInMB, 'MB');
        return new Response(
          JSON.stringify({
            error: 'Generated image is too large.',
            size: `${sizeInMB} MB`
          }),
          {
            status: 413,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const base64 = arrayBufferToBase64(arrayBuffer);
      const contentType = imageResponse.headers.get('content-type') || 'image/png';
      imageUrl = `data:${contentType};base64,${base64}`;
    }

    console.log('✅ Image generated successfully!');

    return new Response(
      JSON.stringify({ 
        imageUrl,
        textContent: prompt,
        prompt,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in generate-image function:', error);
    console.error('Stack trace:', error.stack);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        type: 'server_error',
        details: errorStack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});