import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768): Uint8Array {
  const chunks: Uint8Array[] = [];
  let position = 0;

  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);

    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }

    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, language, fileName } = await req.json();

    if (!audio) {
      throw new Error("No audio data provided");
    }

    console.log(`Processing transcription request for file: ${fileName || "unknown"}`);
    console.log(`Language preference: ${language || "auto-detect"}`);

    // Get the LOVABLE_API_KEY for AI transcription
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Process the base64 audio
    const binaryAudio = processBase64Chunks(audio);
    console.log(`Audio data size: ${binaryAudio.length} bytes`);

    // Determine file type from filename
    const extension = fileName?.split(".").pop()?.toLowerCase() || "mp4";
    const mimeType = getMimeType(extension);

    // Use Lovable AI Gateway for transcription with audio support
    // We'll send the audio as a data URL and use the multimodal capabilities
    const base64AudioWithPrefix = `data:${mimeType};base64,${audio}`;

    // Build the transcription prompt
    const languageInstruction = language && language !== "auto" 
      ? `The audio is in ${getLanguageName(language)}. ` 
      : "";

    const systemPrompt = `You are an expert audio transcriber. Your task is to transcribe speech from audio/video files with high accuracy. 
${languageInstruction}
Transcribe all spoken words exactly as they are said. Include natural speech patterns, but clean up filler words like "um" and "uh" unless they are significant.
Format the transcription as natural sentences and paragraphs.
If there are multiple speakers, try to indicate speaker changes.
Do not add any commentary, just provide the transcription.`;

    console.log("Sending request to Lovable AI Gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please transcribe all the speech in this audio/video file. Provide a clean, accurate transcription.",
              },
              {
                type: "image_url",
                image_url: {
                  url: base64AudioWithPrefix,
                },
              },
            ],
          },
        ],
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const transcript = data.choices?.[0]?.message?.content || "";

    console.log(`Transcription complete. Length: ${transcript.length} characters`);

    return new Response(
      JSON.stringify({ 
        transcript,
        success: true,
        language: language || "auto",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Transcription error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    webm: "video/webm",
    m4v: "video/x-m4v",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
  };
  return mimeTypes[extension] || "video/mp4";
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    pt: "Portuguese",
    ru: "Russian",
    ar: "Arabic",
  };
  return languages[code] || code;
}
