"use client";

import { Dropzone, FileItem, ImagePreview } from "@dropzone-ui/react";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

export default function App({ onImageUpload }) {
  const [files, setFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(undefined);

  const updateFiles = (incomingFiles) => {
    setFiles(incomingFiles);
    if (incomingFiles.length > 0 && incomingFiles[0].file instanceof File) {
      onImageUpload(incomingFiles[0].file);
    } else {
      console.error("The uploaded file is not a valid File instance.");
    }
  };

  const onDelete = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  const handleSee = (imageSource) => {
    setImageSrc(imageSource);
  };

  const handleClean = (files) => {
    console.log("list cleaned", files);
  };

  const handleClose = () => {
    setImageSrc(undefined);
  };

  return (
    <>
      <Dropzone
        style={{
          backgroundColor: "#333",
          color: "#fff",
          borderColor: "#444",
          width: "100%", // ทำให้ responsive
          maxWidth: "100%", // จำกัดความกว้างสูงสุดให้ไม่เกิน 100%
        }}
        id="post_activity_image"
        onChange={updateFiles}
        minHeight="195px"
        onClean={handleClean}
        value={files}
        maxFiles={1}
        maxFileSize={29980000}
        accept=".png, .jpg, image/*"
        label="คลิกเพื่ออัพโหลดรูปหรือลากและวางรูปก็ได้"
        uploadingMessage="กำลังอัพโหลด..."
        acceptTypeLabel="ประเภทที่อนุญาต: .png, .jpg, image/*"
        fakeUploading
        disableScroll
      >
        {files.length > 0 &&
          files.map((file) => (
            <FileItem
              {...file}
              key={file.id}
              onDelete={onDelete}
              onSee={handleSee}
              resultOnTooltip
              preview
              info
              hd
            />
          ))}
      </Dropzone>
      <Modal
        open={!!imageSrc}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            maxHeight: "90%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <img
            src={imageSrc}
            alt="Preview"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
            }}
          />
        </Box>
      </Modal>
    </>
  );
}
