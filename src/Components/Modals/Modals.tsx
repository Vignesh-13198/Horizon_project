import { Modal } from "@mui/material";
import React from "react";
import "./modals.scss";
import ClearIcon from "@mui/icons-material/Clear";
interface modalProps {
  open: boolean;
  close: any;
  data: any;
}
const Modals: React.FC<modalProps> = ({ open, close, data }) => {
  //   console.log(data.url, "dataaaa");
  return (
    <>
      <Modal
        open={open}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="fullmodalbox"
      >
        <div
          className={
            data?.format === "video/webm" ? "vidoeshowbox" : "audioeshowbox"
          }
        >
          <div className="showheaderbox">
            <span className="headerlabelText">
              Recorded Video : {data?.name}
            </span>
            <ClearIcon
              style={{
                color: "#e0f2f1",
                paddingRight: "3%",
                cursor: "pointer",
              }}
              onClick={close}
            />
          </div>
          <div className="showvideobox">
            {data?.format === "video/webm" ? (
              <video controls src={data?.url} className="videodisplaysize" />
            ) : (
              <audio controls src={data?.url}></audio>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Modals;
