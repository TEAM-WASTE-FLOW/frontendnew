import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2, RotateCcw, Scan } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";

export interface ClassificationData {
  wasteType: string;
  confidence: number;
  visualEstimateKg: number;
  suggestedPrice: {
    calculatedValue: number;
    suggestedAskPrice: number;
    suggestedBidPrice: number;
    currency: string;
    marketRate: number;
  };
}

interface WasteScannerProps {
  onClassified: (data: ClassificationData) => void;
  onImageCaptured?: (imageUrl: string) => void;
}

const wasteTypeLabels: Record<string, string> = {
  plastic: "Plastic",
  paper: "Paper & Cardboard",
  metal: "Metal & Alloys",
  electronics: "E-Waste",
  organic: "Organic",
  textile: "Textile",
  glass: "Glass",
  rubber: "Rubber",
  wood: "Wood",
  other: "Other",
};

const WasteScanner = ({ onClassified, onImageCaptured }: WasteScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<ClassificationData | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Camera Stream Management */
  const startCamera = useCallback(async () => {
    try {
      setIsOpen(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Could not access camera. Please check permissions.");
      setIsOpen(false);
    }
  }, []);

  // Attach stream to video element whenever stream/modal changes
  useEffect(() => {
    if (isOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isOpen, stream]); // videoRef.current is stable

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsOpen(false);
    setCapturedImage(null);
    setClassificationResult(null);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImage(imageData);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  }, [stream]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setClassificationResult(null);
    startCamera();
  }, [startCamera]);

  const classifyWaste = useCallback(async () => {
    if (!capturedImage) return;

    setIsClassifying(true);
    try {
      // Create blob from base64
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append('image', blob, 'scan.jpg');

      // Call Local Backend AI Service
      const response = await api.post('http://localhost:3000/api/ai/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('AI Service connection failed')
      }

      const data = await response.json();

      const result: ClassificationData = {
        wasteType: data.scan.detectedMaterial.toLowerCase(),
        confidence: data.scan.confidence,
        visualEstimateKg: data.scan.visualEstimateKg,
        suggestedPrice: data.pricing
      };

      setClassificationResult(result);
      toast.success(`AI Detected: ${result.wasteType}`);
    } catch (error) {
      console.error("Classification error:", error);
      toast.error("Failed to classify. Is the backend running on port 3000?");
    } finally {
      setIsClassifying(false);
    }
  }, [capturedImage]);

  const confirmClassification = useCallback(() => {
    if (classificationResult) {
      onClassified(classificationResult);
      if (onImageCaptured && capturedImage) {
        onImageCaptured(capturedImage);
      }
      stopCamera();
    }
  }, [classificationResult, onClassified, onImageCaptured, capturedImage, stopCamera]);

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={startCamera}
        className="gap-2"
      >
        <Camera className="w-4 h-4" />
        Scan Waste (AI)
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between p-4 text-white">
        <h2 className="text-lg font-semibold">AI Waste Scanner</h2>
        <Button variant="ghost" size="icon" onClick={stopCamera} className="text-white hover:bg-white/20">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured waste"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="max-w-full max-h-full object-contain"
          />
        )}

        {!capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
              <Scan className="w-full h-full text-white/20 p-12 animate-pulse" />
            </div>
          </div>
        )}

        {classificationResult && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 animate-in slide-in-from-bottom-10 fade-in">
            <div className="text-center text-white space-y-2">
              <div>
                <p className="text-sm text-white/70">Detected Material</p>
                <p className="text-3xl font-bold capitalize text-primary-foreground">
                  {classificationResult.wasteType}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-4">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-md">
                  <p className="text-xs text-white/60 uppercase tracking-wider">Estimated Weight</p>
                  <p className="text-xl font-bold">{classificationResult.visualEstimateKg} kg</p>
                </div>
                <div className="bg-emerald-500/20 rounded-xl p-3 backdrop-blur-md border border-emerald-500/30">
                  <p className="text-xs text-emerald-300 uppercase tracking-wider">Suggested Ask</p>
                  <p className="text-xl font-bold text-emerald-400">
                    ${classificationResult.suggestedPrice?.suggestedAskPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="p-6 bg-black/80 backdrop-blur-md">
        {!capturedImage ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-transform active:scale-95"
            >
              <div className="w-16 h-16 rounded-full border-4 border-zinc-200" />
            </button>
          </div>
        ) : !classificationResult ? (
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={retakePhoto} className="min-w-[120px] bg-white/10 text-white border-white/20 hover:bg-white/20">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button
              variant="default"
              onClick={classifyWaste}
              disabled={isClassifying}
              className="min-w-[160px] bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-500/20"
            >
              {isClassifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={retakePhoto} className="min-w-[120px] bg-white/10 text-white border-white/20 hover:bg-white/20">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button variant="default" onClick={confirmClassification} className="min-w-[160px] bg-primary text-primary-foreground">
              Accept & Auto-Fill
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteScanner;
