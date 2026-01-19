import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, Download, FileText, Check, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
  speaker?: string;
}

interface TranscriptEditorProps {
  segments: TranscriptSegment[];
  onSegmentsChange?: (segments: TranscriptSegment[]) => void;
}

const TranscriptEditor = ({ segments, onSegmentsChange }: TranscriptEditorProps) => {
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getFullText = (): string => {
    if (showTimestamps) {
      return segments
        .map((seg) => `[${formatTime(seg.start)}] ${seg.text}`)
        .join("\n\n");
    }
    return segments.map((seg) => seg.text).join(" ");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFullText());
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Transcript has been copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([getFullText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download started",
      description: "Your TXT file is being downloaded.",
    });
  };

  const handleDownloadDocx = () => {
    // Simple RTF as DOCX alternative (browser-compatible)
    const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}
\\f0\\fs24 ${getFullText().replace(/\n/g, "\\par ")}
}`;
    const blob = new Blob([rtfContent], { type: "application/rtf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.rtf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download started",
      description: "Your document is being downloaded.",
    });
  };

  const handleSegmentEdit = (index: number, newText: string) => {
    if (onSegmentsChange) {
      const newSegments = [...segments];
      newSegments[index] = { ...newSegments[index], text: newText };
      onSegmentsChange(newSegments);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-secondary/50 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <Switch
            id="timestamps"
            checked={showTimestamps}
            onCheckedChange={setShowTimestamps}
          />
          <Label htmlFor="timestamps" className="flex items-center gap-2 cursor-pointer">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Show Timestamps</span>
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadTxt} className="gap-2">
            <Download className="h-4 w-4" />
            TXT
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadDocx} className="gap-2">
            <FileText className="h-4 w-4" />
            DOC
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="min-h-[400px] max-h-[600px] overflow-y-auto p-6 bg-card border border-border rounded-xl"
      >
        {segments.length > 0 ? (
          <div className="space-y-4">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="group flex gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                {showTimestamps && (
                  <span className="shrink-0 text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-md h-fit">
                    {formatTime(segment.start)}
                  </span>
                )}
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleSegmentEdit(index, e.currentTarget.textContent || "")}
                  className="flex-1 text-foreground leading-relaxed outline-none focus:bg-secondary/30 rounded px-2 -mx-2"
                >
                  {segment.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <p>No transcript available yet</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <span>{segments.length} segments</span>
        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
        <span>{segments.reduce((acc, s) => acc + s.text.split(" ").length, 0)} words</span>
        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
        <span>{getFullText().length} characters</span>
      </div>
    </div>
  );
};

export default TranscriptEditor;
