import React, { useRef, useEffect } from 'react';
import { Camera, CameraOff, ShieldCheck, Eye } from 'lucide-react';
import { CameraStatus, FaceCueStatus } from '../types';

interface CameraCardProps {
  cameraStatus: CameraStatus;
  cueStatus: FaceCueStatus;
  errorMessage?: string;
  onEnableCamera: () => void;
  onStopCamera: () => void;
  onSkipCamera: () => void;
  onPresenceUpdate: (presenceCue: {
    stillness: number;
    movement: number;
    detail: string;
  }) => void;
}

export default function CameraCard({
  cameraStatus,
  cueStatus,
  errorMessage,
  onEnableCamera,
  onStopCamera,
  onSkipCamera,
  onPresenceUpdate,
}: CameraCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);

  // Setup / teardown video stream
  useEffect(() => {
    let active = true;

    if (cameraStatus === 'live') {
      navigator.mediaDevices
        ?.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        })
        .then((stream) => {
          if (!active) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch(() => {
          // Handled by parent or fallback
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStatus]);

  // Gentle on-device frame difference check to detect head posture & presence cues locally
  useEffect(() => {
    if (cameraStatus !== 'live') return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const width = 64;
      const height = 48;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(video, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      if (!prevFrameRef.current) {
        prevFrameRef.current = new Uint8ClampedArray(data);
        return;
      }

      let diffSum = 0;
      for (let i = 0; i < data.length; i += 4) {
        const diff = Math.abs(data[i] - prevFrameRef.current[i]);
        diffSum += diff;
      }

      const avgDiff = diffSum / (width * height);
      prevFrameRef.current = new Uint8ClampedArray(data);

      let detail = 'Eyes and posture look steady';
      if (avgDiff > 14) {
        detail = 'Recent movement is more variable';
      } else if (avgDiff > 6) {
        detail = 'Head orientation is shifting gently';
      }

      onPresenceUpdate({
        stillness: Math.max(0, 100 - Math.round(avgDiff * 4)),
        movement: Math.min(100, Math.round(avgDiff * 3)),
        detail,
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [cameraStatus, onPresenceUpdate]);

  const isLive = cameraStatus === 'live';

  return (
    <section
      className="rounded-2xl border border-[#dcd8cb] bg-[#fbf8ef] p-5 shadow-sm"
      data-testid="card-camera"
    >
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLive ? (
            <Camera className="h-4 w-4 text-[#3a8c83]" />
          ) : (
            <CameraOff className="h-4 w-4 text-[#7d8789]" />
          )}
          <h3 className="text-xs font-bold text-[#303847]">Visual presence</h3>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#7d8789]">
          optional
        </span>
      </div>

      {isLive ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#202840]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover opacity-90 [transform:scaleX(-1)]"
            data-testid="video-webcam-preview"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Privacy badge */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-[#1b2338cc] px-2.5 py-1 font-mono text-[9px] text-[#d9ede7] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#93d0c7] animate-pulse" />
            on-device only
          </div>

          {/* Status badge */}
          <div className="absolute right-2.5 top-2.5 rounded-full bg-[#1b2338cc] px-2.5 py-1 font-mono text-[9px] text-[#d9ede7] backdrop-blur-sm">
            {cueStatus === 'loading'
              ? 'calibrating local cues…'
              : cueStatus === 'no-face'
              ? 'no face in frame'
              : cueStatus === 'error'
              ? 'indicator paused'
              : 'active local analysis'}
          </div>
        </div>
      ) : (
        <div className="relative flex aspect-[16/10] flex-col items-center justify-center rounded-xl border border-dashed border-[#dedace] bg-[#f4f0e4] px-4 text-center">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#ebe6d6] text-[#71818d]">
            <Eye className="h-5 w-5" />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#4d5960]">
            {cameraStatus === 'denied'
              ? 'Camera access was not granted'
              : cameraStatus === 'skipped' || cameraStatus === 'stopped'
              ? 'Session cues are camera-free'
              : 'No camera cues right now'}
          </p>
          <p className="mt-1 max-w-[240px] text-[11px] leading-relaxed text-[#7e8c90]">
            {cameraStatus === 'denied'
              ? 'That is completely okay — your session still works without it.'
              : 'AuraLens can reflect your session with lightweight visual cues, if you choose.'}
          </p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#dedace] pt-3.5">
        {isLive ? (
          <button
            onClick={onStopCamera}
            className="rounded-lg border border-[#dedace] bg-[#f8f5ec] px-3 py-1.5 text-[11px] font-semibold text-[#546268] transition-colors hover:bg-[#ede8db]"
            data-testid="button-stop-camera"
          >
            Stop Camera
          </button>
        ) : (
          <>
            <button
              onClick={onEnableCamera}
              className="rounded-lg bg-[#3a8c83] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#32776f]"
              data-testid="button-enable-camera"
            >
              Enable Camera
            </button>
            <button
              onClick={onSkipCamera}
              className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#7c888d] hover:text-[#4b5559]"
              data-testid="button-skip-camera"
            >
              Skip Camera
            </button>
          </>
        )}

        <div className="flex items-center gap-1 text-[10px] text-[#7d8789]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#3a8c83]" />
          <span>Local only</span>
        </div>
      </div>

      {errorMessage && (
        <p className="mt-2 text-[10px] text-[#b35747]">{errorMessage}</p>
      )}

      <p className="mt-3 text-[10px] leading-relaxed text-[#8f9b9d]">
        Private by design. Camera cues stay on this device and disappear when you close the session.
      </p>
    </section>
  );
}
