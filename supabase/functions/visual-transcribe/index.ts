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
    const { video, fileName } = await req.json();

    if (!video) {
      throw new Error("No video data provided");
    }

    console.log(`Processing visual transcription for file: ${fileName || "unknown"}`);

    // Get the LOVABLE_API_KEY for AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Determine file type from filename
    const extension = fileName?.split(".").pop()?.toLowerCase() || "mp4";
    const mimeType = getMimeType(extension);
    const base64VideoWithPrefix = `data:${mimeType};base64,${video}`;

    console.log("Sending request to Lovable AI Gateway for visual analysis...");

    // Use vision model for combined audio + visual analysis
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are an expert video analyst that provides both transcription and visual descriptions.

Your task is to analyze the video and provide a structured output with:
1. Transcribed speech from the audio
2. Visual descriptions of what's happening on screen

Output your analysis as a JSON array of segments. Each segment should have:
- "timestamp": number (seconds from start)
- "endTime": number (seconds when segment ends)
- "text": string (transcribed speech, or empty if no speech)
- "visualDescription": string (description of what's visible on screen)

Create segments every 3-5 seconds, or when there's a significant scene change.
Keep visual descriptions concise but informative (1-2 sentences).
Format speech naturally without filler words.

Example output format:
[
  {"timestamp": 0, "endTime": 4, "text": "Hello and welcome to this tutorial.", "visualDescription": "A person sits at a desk with a computer, facing the camera in a well-lit office."},
  {"timestamp": 4, "endTime": 8, "text": "Today we'll learn about video editing.", "visualDescription": "The speaker gestures toward the screen where editing software is visible."}
]

IMPORTANT: Return ONLY the JSON array, no other text.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this video. Transcribe all speech and describe the visual content for each segment. Return the result as a JSON array."
              },
              {
                type: "image_url",
                image_url: {
                  url: base64VideoWithPrefix,
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
    const content = data.choices?.[0]?.message?.content || "[]";

    console.log("Raw AI response:", content.substring(0, 500));

    // Parse the JSON response
    let segments = [];
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        segments = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create a single segment with the content
        segments = [{
          timestamp: 0,
          endTime: 30,
          text: content,
          visualDescription: "Video content analyzed"
        }];
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Create fallback segment
      segments = [{
        timestamp: 0,
        endTime: 30,
        text: content.replace(/```json|```/g, "").trim(),
        visualDescription: "Video content analyzed"
      }];
    }

    // Add unique IDs to segments
    const segmentsWithIds = segments.map((seg: any, index: number) => ({
      id: `seg-${index}-${Date.now()}`,
      timestamp: seg.timestamp || index * 5,
      endTime: seg.endTime || (index + 1) * 5,
      text: seg.text || "",
      visualDescription: seg.visualDescription || "",
      thumbnailUrl: null, // Would need frame extraction service for actual thumbnails
    }));

    console.log(`Visual transcription complete. ${segmentsWithIds.length} segments generated.`);

    return new Response(
      JSON.stringify({
        segments: segmentsWithIds,
        success: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Visual transcription error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
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
  };
  return mimeTypes[extension] || "video/mp4";
}
