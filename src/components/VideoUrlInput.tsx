import { useState } from "react";
import { Link2, Loader2, AlertCircle, CheckCircle2, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface VideoUrlInputProps {
  onVideoFetched: (videoData: { base64: string; fileName: string; size: number }) => void;
  disabled?: boolean;
}

const SUPPORTED_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];

const VideoUrlInput = ({ onVideoFetched, disabled }: VideoUrlInputProps) => {
  const [url, setUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedInfo, setFetchedInfo] = useState<{ fileName: string; size: number } | null>(null);

  const validateUrl = (inputUrl: string): { valid: boolean; error?: string } => {
    if (!inputUrl.trim()) {
      return { valid: false, error: "Please enter a URL" };
    }

    try {
      const parsed = new URL(inputUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return { valid: false, error: "URL must use HTTP or HTTPS" };
      }

      // Check if it's a direct video file URL
      const pathname = parsed.pathname.toLowerCase();
      const hasVideoExtension = SUPPORTED_EXTENSIONS.some(ext => pathname.endsWith(ext));
      
      if (!hasVideoExtension) {
        return { 
          valid: false, 
          error: "URL must link directly to a video file (.mp4, .webm, .mov, etc.)" 
        };
      }

      return { valid: true };
    } catch {
      return { valid: false, error: "Invalid URL format" };
    }
  };

  const fetchVideo = async () => {
    setError(null);
    setFetchedInfo(null);

    const validation = validateUrl(url);
    if (!validation.valid) {
      setError(validation.error || "Invalid URL");
      return;
    }

    setIsFetching(true);

    try {
      // Fetch the video directly in the browser
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("video") && !contentType.includes("octet-stream")) {
        throw new Error("URL does not point to a video file");
      }

      const blob = await response.blob();
      
      // Check file size (500MB limit)
      if (blob.size > 500 * 1024 * 1024) {
        throw new Error("Video file exceeds 500MB limit");
      }

      // Extract filename from URL
      const urlPath = new URL(url).pathname;
      const fileName = urlPath.split("/").pop() || "video.mp4";

      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const base64 = await base64Promise;

      setFetchedInfo({ fileName, size: blob.size });
      onVideoFetched({ base64, fileName, size: blob.size });
    } catch (err) {
      console.error("Error fetching video:", err);
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setError("Cannot fetch this video. The server may not allow cross-origin requests.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch video");
      }
    } finally {
      setIsFetching(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const clearFetched = () => {
    setFetchedInfo(null);
    setUrl("");
    setError(null);
  };

  return (
    <div className="w-full space-y-4">
      {!fetchedInfo ? (
        <>
          <div className="border border-border rounded-2xl p-8 bg-card">
            <div className="flex flex-col items-center gap-4 text-center mb-6">
              <div className="p-4 rounded-2xl bg-secondary">
                <Link2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold mb-1">Paste Direct Video URL</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Enter a direct link to a video file (.mp4, .webm, .mov, etc.)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="https://example.com/video.mp4"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                disabled={disabled || isFetching}
                className="flex-1"
              />
              <Button
                onClick={fetchVideo}
                disabled={disabled || isFetching || !url.trim()}
                className="gradient-bg hover:opacity-90 gap-2 px-6"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  "Fetch Video"
                )}
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {["MP4", "WebM", "MOV", "AVI"].map((format) => (
                <span
                  key={format}
                  className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-muted-foreground"
                >
                  {format}
                </span>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Note: Only direct video file URLs are supported. Platform URLs (YouTube, Instagram, etc.) are not available.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </>
      ) : (
        <div className="border border-border rounded-2xl p-6 bg-card">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{fetchedInfo.fileName}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(fetchedInfo.size)} • Ready to transcribe
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFetched}
              disabled={disabled}
            >
              Change
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUrlInput;
