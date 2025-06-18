import { useRef, useState, useEffect } from "react";
import { useGlobalState } from "../Context/StateContext";

export default function useUtils() {
  // global state
  const {
    setRecording,
    setMuted,
    setDuration,
    setReviewVideo,
    setCameraWarning,
    videoOff,
    setOpen,
    setVideoOff,
    setUpdateUI,
    setAudioRecording,
  } = useGlobalState();
  // needed ref
  const audioChunks = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const timerRef = useRef<any | null>(null);
  const recordedFiles = useRef<any[]>([]);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  // video recorder start function
  const startRecording = async () => {
    console.log("start recoding");
    if (videoOff) {
      setCameraWarning(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const fileName = `recording_${Date.now()}`;
        const blobUrl = URL.createObjectURL(blob);
        const thumbnail = await getVideoThumbnail(blobUrl);

        recordedFiles.current.push({
          name: fileName,
          size: blob.size,
          format: blob.type,
          url: blobUrl,
          thumbnail,
          blob,
        });

        stream.getTracks().forEach((track) => track.stop());
        clearInterval(timerRef.current!);
        setUpdateUI((prev: any) => !prev);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setDuration(0);
      videoRef.current!.srcObject = stream;
      timerRef.current = setInterval(
        () => setDuration((prev: any) => prev + 1),
        1000
      );
    } catch (err) {
      console.error("Camera or mic access denied:", err);
    }
  };
  // thumbnail create function
  const getVideoThumbnail = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = url;
      video.crossOrigin = "anonymous";
      video.currentTime = 1;

      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        }
      });
    });
  };
  // video recorder stop function
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setVideoOff(false);
  };
  // togglemute function
  const toggleMute = () => {
    const stream = streamRef.current;
    if (!stream) {
      console.warn("No stream found. Please start recording first.");
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (!audioTracks || audioTracks.length === 0) {
      console.warn("No audio track found in stream.");
      return;
    }

    const audioTrack = audioTracks[0];
    audioTrack.enabled = !audioTrack.enabled;
    setMuted(!audioTrack.enabled);
  };
  // toggleVideo button
  const toggleVideo = () => {
    const stream = streamRef.current;
    if (!stream) {
      console.warn("Stream not available. Start recording first.");
      return;
    }

    const videoTracks = stream.getVideoTracks();
    if (!videoTracks || videoTracks.length === 0) {
      console.warn("No video track found.");
      return;
    }

    const track = videoTracks[0];
    track.enabled = !track.enabled;
    console.log(
      track.enabled,
      "track.enabledtrack.enabledtrack.enabledtrack.enabled"
    );
    setVideoOff(!track.enabled);
  };
  // delete recoding function
  const deleteRecording = (url: string) => {
    recordedFiles.current = recordedFiles.current.filter(
      (file) => file.url !== url
    );
    setUpdateUI((prev: any) => !prev);
  };
  // download recording function
  const downloadRecording = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.webm`;
    a.click();
  };
  //start audio recorder function
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioRecorderRef.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        recordedFiles.current.push({
          name: `audio_${Date.now()}.webm`,
          format: blob.type,
          size: blob.size,
          url: url,
          audio: true,
          blob: blob,
        });
        setUpdateUI((prev: any) => !prev);
      };

      recorder.start();
      setAudioRecording(true);
    } catch (err) {
      console.error("Error accessing audio device:", err);
    }
  };
  // stop audio recorder function
  const stopAudioRecording = () => {
    audioRecorderRef.current?.stop();
    setAudioRecording(false);
  };
  // modal open function
  const handleModalOpen = (data: any) => {
    setOpen(true);
    setReviewVideo(data);
  };
  // time convert function
  const formatAMPM = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };
  //date convert function
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    videoRef,
    startRecording,
    mediaRecorderRef,
    startAudioRecording,
    streamRef,
    stopRecording,
    toggleMute,
    recordedFiles,
    toggleVideo,
    deleteRecording,
    downloadRecording,
    stopAudioRecording,
    handleModalOpen,
    formatAMPM,
    formatDate,
  };
}
