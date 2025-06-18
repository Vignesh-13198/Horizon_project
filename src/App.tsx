import { lazy, Suspense } from "react";
import "./App.css";
import horizon from "./assets/images/horizon.png";
const MediaRecorderApp = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("./Page/MediaRecorder/MediaRecorders"));
    }, 3000);
  });
});
function App() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "100vh",
            width: "100vw",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: "2%",
            background: "linear-gradient(to bottom right, #002f4b, #005f73)",
          }}
        >
          <img src={horizon} />
          <span
            style={{ fontSize: "2rem", fontWeight: "600", color: "#e0f7fa" }}
          >
            WELCOME TO HORIZON...
          </span>
        </div>
      }
    >
      <MediaRecorderApp />
    </Suspense>
  );
}

export default App;
