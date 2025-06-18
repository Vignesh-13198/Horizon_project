import React, { createContext, useState, useContext } from "react";

//context type
type StateContextType = {
  recording: boolean;
  duration: any;
  setDuration: (value: any) => void;
  setRecording: (value: boolean) => void;
  muted: boolean;
  setMuted: (value: boolean) => void;
  videoOff: boolean;
  setVideoOff: (value: boolean) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  updateUI: any;
  setUpdateUI: (value: any) => void;
  reviewVideo: any;
  setReviewVideo: (value: any) => void;
  cameraWarning: boolean;
  setCameraWarning: (value: any) => void;
  audioRecording: boolean;
  setAudioRecording: (value: any) => void;
  showDisplay: boolean;
  setShowDisplay: (value: any) => void;
};

// Create the context
const StateContext = createContext<StateContextType | null>(null);

// Custom hook to consume the context
export const useGlobalState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a StateProvider");
  }
  return context;
};

// Context provider
export const StateProvider: React.FC<{ children: any }> = ({ children }) => {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateUI, setUpdateUI] = useState(false);
  const [reviewVideo, setReviewVideo] = useState(null);
  const [cameraWarning, setCameraWarning] = useState(false);
  const [audioRecording, setAudioRecording] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);

  return (
    <StateContext.Provider
      value={{
        recording,
        setRecording,
        duration,
        setDuration,
        muted,
        setMuted,
        videoOff,
        setVideoOff,
        open,
        setOpen,
        updateUI,
        setUpdateUI,
        reviewVideo,
        setReviewVideo,
        cameraWarning,
        setCameraWarning,
        audioRecording,
        setAudioRecording,
        showDisplay,
        setShowDisplay,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
