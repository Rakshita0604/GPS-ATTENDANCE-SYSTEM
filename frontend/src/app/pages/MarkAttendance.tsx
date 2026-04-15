import { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  Navigation,
  Clock,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Camera,
  X,
  RotateCcw
} from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge
} from "../components/UI";

import { format } from "date-fns";
import { motion } from "motion/react";
import { toast } from "sonner";

export function MarkAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState<"loading" | "granted" | "denied">("loading");
  const [coords, setCoords] = useState<any>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    getLocation();

    return () => {
      clearInterval(timer);
      stopCamera();
    };
  }, []);

  // ✅ REAL GPS
  const getLocation = () => {
    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied")
    );
  };

  // ✅ CAMERA
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx?.drawImage(videoRef.current, 0, 0);
      setCapturedPhoto(canvas.toDataURL("image/jpeg"));
      stopCamera();
      toast.success("Photo captured");
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // ✅ BACKEND
  const handleAttendance = async (type: "check-in" | "check-out") => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) return toast.error("Login required");
    if (!capturedPhoto) return toast.error("Capture photo");
    if (!coords) return toast.error("Location required");

    setIsSubmitting(true);

    try {
      const blob = await (await fetch(capturedPhoto)).blob();

      const formData = new FormData();
      formData.append("image", blob);
      formData.append("user_id", user.id);
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("status", type === "check-in" ? "present" : "checkout");

      const res = await fetch("http://localhost:5000/api/attendance/mark", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      toast.success(data.message);

      setCapturedPhoto(null);
    } catch {
      toast.error("Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Mark Attendance</h2>
        <p className="text-slate-500">
          Capture your photo and verify location to check in or out.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* TIME */}
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Clock className="h-5 w-5 text-indigo-600" />
                Current Time
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-4xl font-bold">
                {format(currentTime, "hh:mm:ss a")}
              </p>
              <p className="text-sm text-slate-500">
                {format(currentTime, "EEEE, MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>

          {/* LOCATION */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span className="flex gap-2 items-center">
                  <Navigation className="h-5 w-5 text-indigo-600" />
                  Location Status
                </span>

                <Badge variant={locationStatus === "granted" ? "success" : "destructive"}>
                  {locationStatus === "granted" ? "Verified" : "Denied"}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100 p-3 rounded">
                  <p className="text-xs">Latitude</p>
                  <p className="font-mono">
                    {coords?.lat?.toFixed(4) || "--"}
                  </p>
                </div>

                <div className="bg-slate-100 p-3 rounded">
                  <p className="text-xs">Longitude</p>
                  <p className="font-mono">
                    {coords?.lng?.toFixed(4) || "--"}
                  </p>
                </div>
              </div>

              <Button onClick={getLocation} variant="outline">
                <RefreshCw className="h-4 w-4" />
                Refresh Location
              </Button>
            </CardContent>
          </Card>

          {/* MAP IMAGE (STATIC for now) */}
          <Card>
            <img
              src="https://images.unsplash.com/photo-1620662892011-f5c2d523fae2"
              className="w-full h-40 object-cover"
            />
            <div className="p-3 text-sm text-slate-600">
              Your current location
            </div>
          </Card>

        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* CAMERA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Camera className="h-5 w-5 text-indigo-600" />
                Photo Verification
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="bg-slate-900 h-64 rounded flex items-center justify-center">

                {!cameraActive && !capturedPhoto && (
                  <Button onClick={startCamera}>Start Camera</Button>
                )}

                {cameraActive && (
                  <video ref={videoRef} autoPlay className="h-full" />
                )}

                {capturedPhoto && (
                  <img src={capturedPhoto} className="h-full" />
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-2 mt-4">
                {cameraActive && (
                  <Button onClick={capturePhoto}>Capture</Button>
                )}
                {capturedPhoto && (
                  <Button onClick={retakePhoto}>Retake</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ACTION */}
          <Card>
            <CardHeader>
              <CardTitle>Mark Your Attendance</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleAttendance("check-in")}>
                Check In
              </Button>

              <Button variant="outline" onClick={() => handleAttendance("check-out")}>
                Check Out
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </motion.div>
  );
}