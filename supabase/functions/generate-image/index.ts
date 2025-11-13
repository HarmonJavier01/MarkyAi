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
    const { prompt, temperature } = await req.json();
    
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

    console.log('🎨 Generating image with Google AI Studio Imagen (Nano Banana style)');
    console.log('📝 Prompt:', prompt);

    // ============================================
    // GOOGLE AI STUDIO IMAGEN API CONFIGURATION (Nano Banana style)
    // ============================================
    // Using Google AI Studio Imagen API for high-quality image generation
    // "Nano Banana" refers to lightweight, fast image gen optimized for marketing (custom naming)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('❌ Imagen API key not configured');
      return new Response(
        JSON.stringify({ error: 'Image generation service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Imagen API endpoint for image generation
    const IMAGEN_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`;

    // Prepare request body for Imagen API (Nano Banana optimized)
    // const requestBody = {
    //   prompt: {
    //     text: `Generate a vibrant, professional marketing image using Nano Banana style: ${prompt}. Optimize for social media ads with bright colors, clean composition, and engaging visuals.`
    //   },
    //   sampleCount: 1,
    //   aspectRatio: "1:1",
    //   safetyFilterLevel: "block_only_high",
    //   personGeneration: "allow_adult"
    // };

    console.log('📡 Calling Google AI Studio Imagen API (Nano Banana style)...');

    // Make request to Imagen API
    const response = await fetch(IMAGEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Marky-AI-Studio/1.0 (Google AI Studio Nano Banana Imagen)',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Content-Type:', response.headers.get('content-type'));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Imagen API error:', response.status);
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

    // Parse the Imagen response
    const responseData = await response.json();
    console.log('📦 Response data structure:', Object.keys(responseData));

    // Extract image from Imagen response
    // Imagen returns: { predictions: [{ bytesBase64Encoded: "..." }] }
    let imageUrl;
    if (responseData.predictions && responseData.predictions.length > 0) {
      const prediction = responseData.predictions[0];
      if (prediction && prediction.bytesBase64Encoded) {
        const base64Data = prediction.bytesBase64Encoded;
        imageUrl = `data:image/png;base64,${base64Data}`;
        console.log('🖼️ Image extracted from Imagen response (Nano Banana style)');
      }
    }

    if (!imageUrl) {
      console.error('❌ Could not find image in Imagen response');
      console.error('Response data:', JSON.stringify(responseData, null, 2));
      return new Response(
        JSON.stringify({
          error: 'Could not extract image from Google AI Studio Imagen response',
          responseStructure: Object.keys(responseData),
          prompt: prompt
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // If imageUrl is a URL (not base64), fetch and convert it
    if (imageUrl.startsWith('http')) {
      console.log('🌐 Fetching image from URL (Google AI Studio generated)...');
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch generated image from ${imageUrl}`);
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

    console.log('✅ Image generated successfully with Google AI Studio Imagen (Nano Banana style)!');
    return new Response(
      JSON.stringify({
        imageUrl,
        textContent: prompt,
        prompt,
        model: 'nano-banana-imagen-3.0-generate-001'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error in generate-image function (Google AI Studio Nano Banana Imagen):', error);
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