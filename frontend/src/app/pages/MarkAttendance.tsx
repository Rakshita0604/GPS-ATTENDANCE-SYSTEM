// import { useEffect, useRef, useState } from "react";
// import { Camera, Clock, MapPin, Navigation, RefreshCw, RotateCcw } from "lucide-react";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "../components/UI";
// import { markAttendance } from "../services/attendanceService";

// type LocationStatus = "loading" | "granted" | "denied";

// export function MarkAttendance() {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [locationStatus, setLocationStatus] = useState<LocationStatus>("loading");
//   const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [videoReady, setVideoReady] = useState(false);

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   useEffect(() => {
//     const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
//     getLocation();

//     return () => {
//       window.clearInterval(timer);
//       stopCamera();
//     };
//   }, []);

//   const getLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationStatus("denied");
//       toast.error("Geolocation is not supported in this browser");
//       return;
//     }

//     setLocationStatus("loading");
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCoords({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//         setLocationStatus("granted");
//       },
//       () => {
//         setLocationStatus("denied");
//         toast.error("Location permission is required");
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
//     );
//   };

//   const startCamera = async () => {
//     try {
//       console.log("[CAMERA] Starting camera...");
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user" },
//         audio: false,
//       });

//       console.log("[CAMERA] Stream obtained:", stream);
//       streamRef.current = stream;
//       setCameraActive(true);
//       setVideoReady(false);

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         console.log("[CAMERA] Stream attached to video element");
//       }
//     } catch (error) {
//       console.error("[CAMERA] Error:", error);
//       toast.error("Unable to open camera");
//     }
//   };

//   const stopCamera = () => {
//     streamRef.current?.getTracks().forEach((track) => track.stop());
//     streamRef.current = null;
//     setCameraActive(false);
//   };

//   const capturePhoto = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     console.log("[CAPTURE] Starting capture...");
//     console.log("[CAPTURE] Video element:", video);
//     console.log("[CAPTURE] Canvas element:", canvas);
//     console.log("[CAPTURE] Video readyState:", video?.readyState, "(2=HAVE_CURRENT_DATA, 4=HAVE_ENOUGH_DATA)");
//     console.log("[CAPTURE] Video dimensions:", video?.videoWidth, "x", video?.videoHeight);

//     if (!video || !canvas) {
//       console.error("[CAPTURE] Missing video or canvas element");
//       toast.error("Video or canvas not available");
//       return;
//     }

//     // Wait for video to be fully ready (readyState 2 = HAVE_CURRENT_DATA, 4 = HAVE_ENOUGH_DATA)
//     if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
//       console.error("[CAPTURE] Video not ready - readyState:", video.readyState, "dimensions:", video.videoWidth, video.videoHeight);
//       toast.error("Camera is initializing. Please wait a moment and try again.");
//       return;
//     }

//     try {
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext("2d");
//       if (!ctx) {
//         throw new Error("Could not get canvas context");
//       }
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       console.log("[CAPTURE] Image drawn to canvas");

//       canvas.toBlob(
//         (blob) => {
//           if (!blob) {
//             console.error("[CAPTURE] Blob conversion failed");
//             toast.error("Could not capture photo");
//             return;
//           }

//           console.log("[CAPTURE] Blob created successfully, size:", blob.size, "bytes");
//           setPhotoBlob(blob);
//           setPhotoPreview(URL.createObjectURL(blob));
//           stopCamera();
//           toast.success("Photo captured successfully");
//         },
//         "image/jpeg",
//         0.9
//       );
//     } catch (error) {
//       console.error("[CAPTURE] Error:", error);
//       toast.error("Failed to capture photo");
//     }
//   };

//   const retakePhoto = () => {
//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }

//     setPhotoPreview(null);
//     setPhotoBlob(null);
//     startCamera();
//   };

//   const submitAttendance = async (type: "check-in" | "check-out") => {
//     console.log("[SUBMIT] Attendance submission started, type:", type);
    
//     if (!coords) {
//       console.error("[SUBMIT] Location not available");
//       toast.error("Location required");
//       return;
//     }

//     if (type === "check-in" && !photoBlob) {
//       console.error("[SUBMIT] Photo not captured for check-in");
//       toast.error("Capture photo first");
//       return;
//     }

//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (!user.id) {
//       console.error("[SUBMIT] User ID not found");
//       toast.error("User session invalid");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("user_id", String(user.id));
//     formData.append("type", type);
//     formData.append("latitude", String(coords.lat));
//     formData.append("longitude", String(coords.lng));

//     if (photoBlob) {
//       formData.append("image", photoBlob, "attendance.jpg");
//       console.log("[SUBMIT] Photo blob appended, size:", photoBlob.size);
//     }

//     console.log("[SUBMIT] FormData prepared, submitting...");
//     setIsSubmitting(true);

//     try {
//       const response = await markAttendance(formData);
//       console.log("[SUBMIT] Success:", response);
//       toast.success(response.message || "Attendance marked successfully");
//       setPhotoBlob(null);
//       setPhotoPreview(null);
//     } catch (error: any) {
//       console.error("[SUBMIT] Error:", error);
//       toast.error(error?.message || "Failed to mark attendance");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-slate-900">Mark Attendance</h2>
//         <p className="text-slate-500">Capture your photo and verify location to check in or out.</p>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-3">
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-indigo-600" />
//                 Current Time
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="text-center">
//               <p className="text-4xl font-bold text-slate-900">{format(currentTime, "hh:mm:ss a")}</p>
//               <p className="text-sm text-slate-500">{format(currentTime, "EEEE, MMMM d, yyyy")}</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span className="flex items-center gap-2">
//                   <Navigation className="h-5 w-5 text-indigo-600" />
//                   Location
//                 </span>
//                 <Badge variant={locationStatus === "granted" ? "success" : locationStatus === "loading" ? "warning" : "destructive"}>
//                   {locationStatus === "granted" ? "Verified" : locationStatus === "loading" ? "Loading" : "Denied"}
//                 </Badge>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="rounded-md bg-slate-100 p-3">
//                   <p className="text-xs text-slate-500">Latitude</p>
//                   <p className="font-mono text-sm">{coords ? coords.lat.toFixed(6) : "--"}</p>
//                 </div>
//                 <div className="rounded-md bg-slate-100 p-3">
//                   <p className="text-xs text-slate-500">Longitude</p>
//                   <p className="font-mono text-sm">{coords ? coords.lng.toFixed(6) : "--"}</p>
//                 </div>
//               </div>
//               <Button type="button" variant="outline" onClick={getLocation} className="w-full gap-2">
//                 <RefreshCw className="h-4 w-4" />
//                 Refresh Location
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="space-y-6 lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Camera className="h-5 w-5 text-indigo-600" />
//                 Photo Verification
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex h-80 items-center justify-center overflow-hidden rounded-md bg-slate-900">
//                 {!cameraActive && !photoPreview && (
//                   <Button type="button" onClick={startCamera} className="gap-2">
//                     <Camera className="h-4 w-4" />
//                     Start Camera
//                   </Button>
//                 )}

//                 {cameraActive && (
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     onLoadedMetadata={() => {
//                       console.log("[VIDEO] onLoadedMetadata triggered");
//                       setVideoReady(true);
//                     }}
//                     onCanPlay={() => {
//                       console.log("[VIDEO] onCanPlay triggered");
//                       setVideoReady(true);
//                     }}
//                     className="h-full w-full object-contain"
//                   />
//                 )}
//                 {photoPreview && <img src={photoPreview} alt="Captured attendance" className="h-full w-full object-contain" />}
//               </div>

//               <canvas ref={canvasRef} className="hidden" />

//               <div className="mt-4 flex flex-wrap gap-2">
//                 {cameraActive && (
//                   <>
//                     <Button type="button" onClick={capturePhoto} disabled={!videoReady}>
//                       {videoReady ? "Capture Photo" : "Camera initializing..."}
//                     </Button>
//                     {!videoReady && <p className="text-xs text-slate-400">Waiting for camera...</p>}
//                   </>
//                 )}
//                 {photoPreview && (
//                   <Button type="button" variant="outline" onClick={retakePhoto} className="gap-2">
//                     <RotateCcw className="h-4 w-4" />
//                     Retake
//                   </Button>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <MapPin className="h-5 w-5 text-indigo-600" />
//                 Submit Attendance
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-3 sm:grid-cols-2">
//               <Button type="button" disabled={isSubmitting} onClick={() => submitAttendance("check-in")}>
//                 Check In
//               </Button>
//               <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => submitAttendance("check-out")}>
//                 Check Out
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { Camera, Clock, MapPin, Navigation, RefreshCw, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "../components/UI";
import { markAttendance } from "../services/attendanceService";

type LocationStatus = "loading" | "granted" | "denied";

export function MarkAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("loading");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    getLocation();

    return () => {
      window.clearInterval(timer);
      stopCamera();
    };
  }, []);

  // ✅ FIX: Assign srcObject AFTER the video element is mounted in the DOM
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error("[CAMERA] Play error:", err);
      });
    }
  }, [cameraActive]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      toast.error("Geolocation is not supported in this browser");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
        toast.error("Location permission is required");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      setVideoReady(false);
      setCameraActive(true); // ✅ useEffect above handles srcObject after render
    } catch (error) {
      console.error("[CAMERA] Error:", error);
      toast.error("Unable to open camera");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
    setVideoReady(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      toast.error("Video or canvas not available");
      return;
    }

    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error("Camera is initializing. Please wait a moment and try again.");
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error("Could not capture photo");
            return;
          }
          setPhotoBlob(blob);
          setPhotoPreview(URL.createObjectURL(blob));
          stopCamera();
          toast.success("Photo captured successfully");
        },
        "image/jpeg",
        0.9
      );
    } catch (error) {
      console.error("[CAPTURE] Error:", error);
      toast.error("Failed to capture photo");
    }
  };

  const retakePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setPhotoBlob(null);
    startCamera();
  };

  const submitAttendance = async (type: "check-in" | "check-out") => {
    if (!coords) {
      toast.error("Location required");
      return;
    }

    if (type === "check-in" && !photoBlob) {
      toast.error("Capture photo first");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      toast.error("User session invalid");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", String(user.id));
    formData.append("type", type);
    formData.append("latitude", String(coords.lat));
    formData.append("longitude", String(coords.lng));

    if (photoBlob) {
      formData.append("image", photoBlob, "attendance.jpg");
    }

    setIsSubmitting(true);

    try {
      const response = await markAttendance(formData);
      toast.success(response.message || "Attendance marked successfully");
      setPhotoBlob(null);
      setPhotoPreview(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to mark attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Mark Attendance</h2>
        <p className="text-slate-500">Capture your photo and verify location to check in or out.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Current Time
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-4xl font-bold text-slate-900">{format(currentTime, "hh:mm:ss a")}</p>
              <p className="text-sm text-slate-500">{format(currentTime, "EEEE, MMMM d, yyyy")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-indigo-600" />
                  Location
                </span>
                <Badge
                  variant={
                    locationStatus === "granted"
                      ? "success"
                      : locationStatus === "loading"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {locationStatus === "granted"
                    ? "Verified"
                    : locationStatus === "loading"
                    ? "Loading"
                    : "Denied"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md bg-slate-100 p-3">
                  <p className="text-xs text-slate-500">Latitude</p>
                  <p className="font-mono text-sm">{coords ? coords.lat.toFixed(6) : "--"}</p>
                </div>
                <div className="rounded-md bg-slate-100 p-3">
                  <p className="text-xs text-slate-500">Longitude</p>
                  <p className="font-mono text-sm">{coords ? coords.lng.toFixed(6) : "--"}</p>
                </div>
              </div>
              <Button type="button" variant="outline" onClick={getLocation} className="w-full gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Location
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-indigo-600" />
                Photo Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 items-center justify-center overflow-hidden rounded-md bg-slate-900">
                {!cameraActive && !photoPreview && (
                  <Button type="button" onClick={startCamera} className="gap-2">
                    <Camera className="h-4 w-4" />
                    Start Camera
                  </Button>
                )}

                {cameraActive && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onCanPlay={() => setVideoReady(true)}  // ✅ single reliable event
                    className="h-full w-full object-contain"
                  />
                )}

                {photoPreview && (
                  <img src={photoPreview} alt="Captured attendance" className="h-full w-full object-contain" />
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="mt-4 flex flex-wrap gap-2">
                {cameraActive && (
                  <>
                    <Button type="button" onClick={capturePhoto} disabled={!videoReady}>
                      {videoReady ? "Capture Photo" : "Camera initializing..."}
                    </Button>
                    {!videoReady && (
                      <p className="text-xs text-slate-400">Waiting for camera...</p>
                    )}
                  </>
                )}
                {photoPreview && (
                  <Button type="button" variant="outline" onClick={retakePhoto} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Retake
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Submit Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Button type="button" disabled={isSubmitting} onClick={() => submitAttendance("check-in")}>
                Check In
              </Button>
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => submitAttendance("check-out")}>
                Check Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}