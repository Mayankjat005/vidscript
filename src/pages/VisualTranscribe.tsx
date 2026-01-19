import { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoUpload from "@/components/VideoUpload";
import VideoUrlInput from "@/components/VideoUrlInput";
import VisualTranscriptViewer, { VisualSegment } from "@/components/VisualTranscriptViewer";
import VisualProgressSteps from "@/components/VisualProgressSteps";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, RotateCcw, FileVideo, Eye, Sparkles, AlertTriangle, Upload, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AppState = "upload" | "processing" | "result";
type ProcessingStep = "uploading" | "extracting" | "analyzing" | "transcribing" | "aligning" | "complete";
type InputMode = "upload" | "url";

const VisualTranscribe = () => {
  const { toast } = useToast();
  
  const [appState, setAppState] = useState<AppState>("upload");
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlVideoData, setUrlVideoData] = useState<{ base64: string; fileName: string; size: number } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ProcessingStep>("uploading");
  const [progress, setProgress] = useState(0);
  const [segments, setSegments] = useState<VisualSegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setUrlVideoData(null);
    // Create object URL for video preview
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  }, []);

  const handleUrlVideoFetched = useCallback((data: { base64: string; fileName: string; size: number }) => {
    setUrlVideoData(data);
    setSelectedFile(null);
    // Create blob URL for video preview
    const binaryString = atob(data.base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
  }, []);

  const hasVideoReady = selectedFile || urlVideoData;

  const simulateProgress = async (step: ProcessingStep, duration: number) => {
    setCurrentStep(step);
    const steps = 20;
    const interval = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      setProgress((i / steps) * 100);
    }
  };

  const startVisualTranscription = async () => {
    if (!hasVideoReady) return;
    
    setIsProcessing(true);
    setAppState("processing");
    setProgress(0);

    try {
      let base64Video: string;
      let fileName: string;

      if (urlVideoData) {
        // Use already fetched URL video data
        base64Video = urlVideoData.base64;
        fileName = urlVideoData.fileName;
        await simulateProgress("uploading", 500); // Shorter since already fetched
      } else if (selectedFile) {
        // Step 1: Uploading
        await simulateProgress("uploading", 1500);
        
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
        });
        reader.readAsDataURL(selectedFile);
        base64Video = await base64Promise;
        fileName = selectedFile.name;
      } else {
        return;
      }

      // Step 2: Extracting frames
      await simulateProgress("extracting", 2000);

      // Step 3: Analyzing visuals
      await simulateProgress("analyzing", 2500);

      // Step 4: Transcribing
      setCurrentStep("transcribing");
      setProgress(0);

      const { data, error } = await supabase.functions.invoke("visual-transcribe", {
        body: {
          video: base64Video,
          fileName,
        },
      });

      if (error) {
        throw new Error(error.message || "Visual transcription failed");
      }

      // Step 5: Aligning
      await simulateProgress("aligning", 1500);

      // Parse the visual segments
      const visualSegments = data.segments || [];
      setSegments(visualSegments);

      setCurrentStep("complete");
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAppState("result");
      
      toast({
        title: "Visual transcription complete!",
        description: "Your video has been analyzed with visual descriptions.",
      });
    } catch (err) {
      console.error("Visual transcription error:", err);
      toast({
        title: "Transcription failed",
        description: err instanceof Error ? err.message : "An error occurred during transcription.",
        variant: "destructive",
      });
      setAppState("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetApp = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setAppState("upload");
    setSelectedFile(null);
    setUrlVideoData(null);
    setVideoUrl(null);
    setCurrentStep("uploading");
    setProgress(0);
    setSegments([]);
  };

  const getVideoDisplayInfo = () => {
    if (urlVideoData) {
      return { name: urlVideoData.fileName, size: urlVideoData.size };
    }
    if (selectedFile) {
      return { name: selectedFile.name, size: selectedFile.size };
    }
    return null;
  };

  const videoInfo = getVideoDisplayInfo();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Upload State */}
          {appState === "upload" && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
                  <Eye className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Advanced Mode</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  Visual Transcription
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Get AI-powered visual descriptions alongside your transcript. 
                  Perfect for accessibility and detailed content analysis.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Eye, label: "Scene Detection", desc: "Frame-by-frame analysis" },
                  { icon: Sparkles, label: "AI Descriptions", desc: "Visual context for each segment" },
                  { icon: FileVideo, label: "Synced Timeline", desc: "Click to seek video" },
                ].map((feature, i) => (
                  <div key={i} className="p-4 bg-secondary/50 rounded-xl border border-border text-center">
                    <feature.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* Notice */}
              <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    Processing Time Notice
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visual transcription takes longer than standard mode due to frame analysis. 
                    Best for videos under 10 minutes.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as InputMode)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Video
                    </TabsTrigger>
                    <TabsTrigger value="url" className="gap-2">
                      <Link2 className="h-4 w-4" />
                      Paste URL
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload">
                    <VideoUpload
                      onFileSelect={handleFileSelect}
                      disabled={isProcessing}
                    />
                  </TabsContent>
                  
                  <TabsContent value="url">
                    <VideoUrlInput
                      onVideoFetched={handleUrlVideoFetched}
                      disabled={isProcessing}
                    />
                  </TabsContent>
                </Tabs>

                {hasVideoReady && (
                  <div className="p-6 bg-card border border-border rounded-2xl space-y-6 animate-fade-in">
                    <Button
                      size="lg"
                      className="w-full gradient-bg-hero hover:opacity-90 transition-all text-lg py-6 font-semibold gap-2"
                      onClick={startVisualTranscription}
                      disabled={isProcessing}
                    >
                      Start Visual Analysis
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Processing State */}
          {appState === "processing" && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  Analyzing Your Video
                </h1>
                <p className="text-muted-foreground text-lg">
                  Our AI is extracting frames and generating visual descriptions
                </p>
              </div>

              {videoInfo && (
                <div className="flex items-center justify-center gap-4 mb-12 p-4 bg-secondary/50 rounded-xl">
                  <FileVideo className="h-8 w-8 text-accent" />
                  <div className="text-left">
                    <p className="font-medium truncate max-w-xs">{videoInfo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(videoInfo.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              )}

              <VisualProgressSteps
                currentStep={currentStep}
                progress={progress}
              />
            </div>
          )}

          {/* Result State */}
          {appState === "result" && videoUrl && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                    Visual Transcript
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Click any segment to jump to that moment in the video
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={resetApp}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  New Analysis
                </Button>
              </div>

              <VisualTranscriptViewer
                videoUrl={videoUrl}
                segments={segments}
                onSegmentsChange={setSegments}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VisualTranscribe;
