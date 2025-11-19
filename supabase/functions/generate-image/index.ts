import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, ApiKey, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Cloudinary configuration
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
const CLOUDINARY_API_KEY = '727999818853392';
const CLOUDINARY_API_SECRET = 'WfK4SplbLf_c1QTngBpzSJ7dPT8';

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
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate image with Google AI Studio Imagen API (High-quality model)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const IMAGEN_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`;

    // const requestBody = {
    //   prompt: {
    //     text: `Create an ultra-high-resolution, crystal-clear, professionally detailed marketing image with perfectly readable text based on this description: ${prompt}. Generate exceptional quality image with ultra-sharp details, completely legible text, vibrant colors, and photorealistic precision optimized for high-resolution display and professional marketing use. Ensure all text is perfectly readable, details are crisp and clear, and the image quality is suitable for large-scale printing and digital marketing.`
    //   },
    //   sampleCount: 1,
    //   aspectRatio: "1:1",
    //   safetyFilterLevel: "block_only_high",
    //   personGeneration: "allow_adult",
    //   outputOptions: {
    //     mimeType: "image/png"
    //   }
    // };

    const response = await fetch(IMAGEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    let imageUrl;

    // Handle Imagen API response format
    if (responseData.predictions && responseData.predictions.length > 0) {
      const prediction = responseData.predictions[0];
      if (prediction.bytesBase64Encoded) {
        imageUrl = `data:image/png;base64,${prediction.bytesBase64Encoded}`;
      }
    }

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Could not extract image from response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Now upload to Cloudinary
    const formData = new FormData();
    formData.append('file', imageUrl); // This is your base64 image data
    formData.append('upload_preset', 'YOUR_UPLOAD_PRESET');  // Set your upload preset (found in your Cloudinary settings)

    const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(CLOUDINARY_API_KEY + ':' + CLOUDINARY_API_SECRET)}`,
      },
      body: formData,
    });

    const cloudinaryData = await cloudinaryResponse.json();
    if (cloudinaryResponse.ok) {
      return new Response(
        JSON.stringify({
          imageUrl: cloudinaryData.secure_url,  // Cloudinary URL for the uploaded image
          prompt,
          message: 'Image successfully uploaded to Cloudinary!',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to upload image to Cloudinary', details: cloudinaryData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('❌ Error generating or uploading image:', error);
    return new Response(
      JSON.stringify({ error: 'Server error occurred while generating/uploading image', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
