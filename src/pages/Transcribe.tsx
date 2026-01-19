import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoUpload from "@/components/VideoUpload";
import VideoUrlInput from "@/components/VideoUrlInput";
import LanguageSelect from "@/components/LanguageSelect";
import TranscriptionProgress, { TranscriptionStep } from "@/components/TranscriptionProgress";
import TranscriptEditor, { TranscriptSegment } from "@/components/TranscriptEditor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, RotateCcw, FileVideo, Upload, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AppState = "upload" | "processing" | "result";
type InputMode = "upload" | "url";

const Transcribe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [appState, setAppState] = useState<AppState>("upload");
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlVideoData, setUrlVideoData] = useState<{ base64: string; fileName: string; size: number } | null>(null);
  const [language, setLanguage] = useState("auto");
  const [currentStep, setCurrentStep] = useState<TranscriptionStep>("uploading");
  const [progress, setProgress] = useState(0);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setUrlVideoData(null);
  }, []);

  const handleUrlVideoFetched = useCallback((data: { base64: string; fileName: string; size: number }) => {
    setUrlVideoData(data);
    setSelectedFile(null);
  }, []);

  const hasVideoReady = selectedFile || urlVideoData;

  const simulateProgress = async (step: TranscriptionStep, duration: number) => {
    setCurrentStep(step);
    const steps = 20;
    const interval = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      setProgress((i / steps) * 100);
    }
  };

  const startTranscription = async () => {
    if (!hasVideoReady) return;
    
    setIsProcessing(true);
    setAppState("processing");
    setProgress(0);

    try {
      let base64Audio: string;
      let fileName: string;

      if (urlVideoData) {
        // Use already fetched URL video data
        base64Audio = urlVideoData.base64;
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
        base64Audio = await base64Promise;
        fileName = selectedFile.name;
      } else {
        return;
      }

      // Step 2: Extracting audio
      await simulateProgress("extracting", 2000);

      // Step 3: Transcribing
      setCurrentStep("transcribing");
      setProgress(0);

      const { data, error } = await supabase.functions.invoke("transcribe-video", {
        body: {
          audio: base64Audio,
          language: language === "auto" ? null : language,
          fileName,
        },
      });

      if (error) {
        throw new Error(error.message || "Transcription failed");
      }

      // Step 4: Formatting
      await simulateProgress("formatting", 1000);

      // Parse transcript into segments
      const transcriptText = data.transcript || data.text || "";
      const parsedSegments = parseTranscriptToSegments(transcriptText);
      setSegments(parsedSegments);

      setCurrentStep("complete");
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAppState("result");
      
      toast({
        title: "Transcription complete!",
        description: "Your video has been successfully transcribed.",
      });
    } catch (err) {
      console.error("Transcription error:", err);
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

  const parseTranscriptToSegments = (text: string): TranscriptSegment[] => {
    // Split by sentences and create segments with estimated timestamps
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let currentTime = 0;
    const avgDuration = 5; // Average 5 seconds per segment
    
    return sentences.map((sentence, index) => {
      const segment: TranscriptSegment = {
        text: sentence.trim(),
        start: currentTime,
        end: currentTime + avgDuration,
      };
      currentTime += avgDuration;
      return segment;
    });
  };

  const resetApp = () => {
    setAppState("upload");
    setSelectedFile(null);
    setUrlVideoData(null);
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
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  Transcribe Your Video
                </h1>
                <p className="text-muted-foreground text-lg">
                  Upload a video file and we'll convert it to text
                </p>
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
                    <LanguageSelect
                      value={language}
                      onValueChange={setLanguage}
                      disabled={isProcessing}
                    />

                    <Button
                      size="lg"
                      className="w-full gradient-bg hover:opacity-90 transition-all text-lg py-6 font-semibold gap-2"
                      onClick={startTranscription}
                      disabled={isProcessing}
                    >
                      Start Transcription
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
                  Processing Your Video
                </h1>
                <p className="text-muted-foreground text-lg">
                  Please wait while our AI transcribes your content
                </p>
              </div>

              {videoInfo && (
                <div className="flex items-center justify-center gap-4 mb-12 p-4 bg-secondary/50 rounded-xl">
                  <FileVideo className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium truncate max-w-xs">{videoInfo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(videoInfo.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              )}

              <TranscriptionProgress
                currentStep={currentStep}
                progress={progress}
              />
            </div>
          )}

          {/* Result State */}
          {appState === "result" && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                    Your Transcript
                  </h1>
                  <p className="text-muted-foreground">
                    Edit and download your transcription
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={resetApp}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  New Transcription
                </Button>
              </div>

              <TranscriptEditor
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

export default Transcribe;
