// Enhanced GoogleMeetRecorder.tsx with added improvements
import { useEffect } from "react";
import "./mediaRecorder.scss";
import { Box, IconButton, Tooltip, Typography, Snackbar } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import Modals from "../../Components/Modals/Modals";
import MicNoneIcon from "@mui/icons-material/MicNone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useGlobalState } from "../../Context/StateContext";
import useUtils from "../../Utils/Utils";
const MediaRecorders = () => {
  // usecontext
  const {
    recording,
    duration,
    setDuration,
    muted,
    videoOff,
    open,
    setOpen,
    cameraWarning,
    setCameraWarning,
    audioRecording,
    reviewVideo,
  } = useGlobalState();
  // utils import function
  const {
    startRecording,
    stopRecording,
    videoRef,
    toggleVideo,
    toggleMute,
    deleteRecording,
    recordedFiles,
    downloadRecording,
    startAudioRecording,
    stopAudioRecording,
    handleModalOpen,
    formatAMPM,
    formatDate,
  } = useUtils();

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    let interval: any;

    if (audioRecording) {
      interval = setInterval(() => {
        setDuration((prev: any) => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => clearInterval(interval);
  }, [audioRecording]);

  return (
    <>
      {/* view recorder */}
      <Modals open={open} close={() => setOpen(false)} data={reviewVideo} />
      {/* camer check snack bar */}
      <Snackbar
        open={cameraWarning}
        autoHideDuration={4000}
        onClose={() => setCameraWarning(false)}
        message="Camera is turned off. Please turn it on before recording."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { backgroundColor: "#f44336", color: "#fff" },
        }}
      />
      <div className="fullcontainer">
        <div className="videorecoderContainer">
          <div
            className={
              recordedFiles.current?.length > 0
                ? "recordearycontainer"
                : "recordecontainer"
            }
          >
            {videoOff ? (
              <div
                style={{
                  color: "red",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <VideocamOffIcon
                  style={{ color: "#e0f2f1", height: "20%", width: "20%" }}
                />
              </div>
            ) : muted ? (
              <div
                style={{
                  color: "red",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <MicOffIcon
                  style={{ color: "#e0f2f1", height: "20%", width: "20%" }}
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="recoderstyle"
              />
            )}
          </div>
          {/* previous audio and video container */}
          {recordedFiles.current.length > 0 && (
            <div className="arraycontainer">
              {recordedFiles.current.map((item, idx) => (
                <div className="videoBox" key={idx}>
                  <div className="vidodumnailbox">
                    {item.format === "audio/webm" ? (
                      <MicNoneIcon style={{ color: "#31473a" }} />
                    ) : (
                      <img
                        src={item.thumbnail || ""}
                        alt="thumbnail"
                        className="dumnailvideobox"
                      />
                    )}
                  </div>

                  <div className="nameandformattextbox">
                    <Typography variant="body2" className="alltextstyle">
                      File Name: {item.name}
                    </Typography>
                    <Typography variant="body2" className="alltextstyle">
                      File Size: {(item.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                    <Typography variant="body2" className="alltextstyle">
                      File Format: {item.format}
                    </Typography>
                  </div>
                  <div className="iconbox">
                    <Tooltip title="view">
                      <VisibilityIcon
                        style={{ cursor: "Pointer", color: "#e0f7fa" }}
                        onClick={() => handleModalOpen(item)}
                      />
                    </Tooltip>
                    <Tooltip title="Download">
                      <DownloadIcon
                        style={{ cursor: "Pointer", color: "#e0f7fa" }}
                        onClick={() => downloadRecording(item.url, item.name)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <DeleteIcon
                        style={{ cursor: "Pointer", color: "#e0f7fa" }}
                        onClick={() => deleteRecording(item.url)}
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* end */}
        </div>
        {/* bootom button container */}
        <div className="buttoncontainer">
          <div className="buttoncenterbox">
            <div className="timeanddateContainer">
              <span className="timeanddatetextstyle">
                Current Time : {formatAMPM(new Date())}
              </span>
            </div>
            <div className="allbuttoncontainer">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {/* audio toggle button*/}
                <Tooltip title={muted ? "Turn on mic" : "Turn off mic"}>
                  <IconButton
                    onClick={toggleMute}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "10px",
                      backgroundColor: muted ? "#ff4d4f" : "#e0f7fa",
                      color: muted ? "#fff" : "#00796b",
                      boxShadow: muted
                        ? "0 3px 6px rgba(255, 77, 79, 0.4)"
                        : "0 3px 6px rgba(0, 121, 107, 0.2)",
                      "&:hover": {
                        backgroundColor: muted ? "#f5222d" : "#b2dfdb",
                      },
                    }}
                  >
                    {muted ? <MicOffIcon /> : <MicIcon />}
                  </IconButton>
                </Tooltip>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {/* camera toggle button*/}
                <Tooltip
                  title={videoOff ? "Turn on camera" : "Turn off camera"}
                >
                  <IconButton
                    onClick={toggleVideo}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "10px",
                      backgroundColor: videoOff ? "#ff4d4f" : "#e0f7fa",
                      color: videoOff ? "#fff" : "#00796b",
                      boxShadow: videoOff
                        ? "0 3px 6px rgba(255, 77, 79, 0.4)"
                        : "0 3px 6px rgba(0, 121, 107, 0.2)",
                      "&:hover": {
                        backgroundColor: videoOff ? "#f5222d" : "#b2dfdb",
                      },
                    }}
                  >
                    {videoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
              {/*  video recorder button */}
              <Tooltip title={recording ? "Stop Recording" : "Start Recording"}>
                <IconButton
                  onClick={recording ? stopRecording : startRecording}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "10px",
                    backgroundColor: recording ? "#ff4d4f" : "#e0f7fa",
                    color: "#fff",
                    boxShadow: recording
                      ? "0 4px 8px rgba(255, 77, 79, 0.4)"
                      : "0 4px 8px rgba(76, 175, 80, 0.4)",
                    "&:hover": {
                      backgroundColor: recording ? "#f5222d" : "#e0f7fa",
                    },
                  }}
                >
                  {recording ? (
                    <StopIcon />
                  ) : (
                    <PlayArrowIcon style={{ color: "#31473a" }} />
                  )}
                </IconButton>
              </Tooltip>
              {/* start audio recorder button */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Tooltip title="Start Audio Recording">
                  <IconButton
                    onClick={startAudioRecording}
                    disabled={audioRecording}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "10px",
                      backgroundColor: "#e0f7fa",
                      color: "#31473a",
                      boxShadow: "0 4px 8px rgba(76, 175, 80, 0.4)",
                      "&:hover": {
                        backgroundColor: "#e0f7fa",
                      },
                      "&:disabled": {
                        backgroundColor: "#c8e6c9",
                        color: "#9e9e9e",
                      },
                    }}
                  >
                    🎙
                  </IconButton>
                </Tooltip>
                {/* stop audio recorder button */}
                <Tooltip title="Stop Audio Recording">
                  <IconButton
                    onClick={stopAudioRecording}
                    disabled={!audioRecording}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "10px",
                      backgroundColor: "#f44336",
                      color: "#fff",
                      boxShadow: "0 4px 8px rgba(244, 67, 54, 0.4)",
                      "&:hover": {
                        backgroundColor: "#e53935",
                      },
                      "&:disabled": {
                        backgroundColor: "#ffcdd2",
                        color: "#9e9e9e",
                      },
                    }}
                  >
                    ⏹
                  </IconButton>
                </Tooltip>
              </Box>
              {/* video recorder timer */}
              {recording && (
                <Typography
                  sx={{
                    position: "absolute",
                    top: "5%",
                    left: "5%",
                    color: "red",
                    fontWeight: 600,
                  }}
                >
                  🔴 {formatTime(duration)}
                </Typography>
              )}
              {/* audio recorder timer */}
              {audioRecording && (
                <Typography
                  sx={{
                    position: "absolute",
                    top: "5%",
                    left: "5%",
                    color: "red",
                    fontWeight: 600,
                  }}
                >
                  🔴 {formatTime(duration)}
                </Typography>
              )}
              {/* end */}
            </div>
            {/* today date  */}
            <div className="timeanddateContainer">
              <span className="timeanddatetextstyle">
                Today Date : {formatDate(new Date())}
              </span>
            </div>
          </div>
        </div>
        {/* end */}
      </div>
    </>
  );
};

export default MediaRecorders;
