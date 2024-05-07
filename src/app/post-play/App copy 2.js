"use client";

import { Dropzone, FileItem, ImagePreview } from "@dropzone-ui/react";
import { useState } from "react";

export default function App({ onImageUpload }) {
  const [files, setFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(undefined);

  const updateFiles = (incomingFiles) => {
    setFiles(incomingFiles);
    if (incomingFiles.length > 0) {
      // ส่งข้อมูลรูปภาพกลับไปที่ component หลัก
      onImageUpload(incomingFiles[0]);
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

  return (
    <>
      <Dropzone
        style={{
          backgroundColor: "#333",
          color: "#fff",
          borderColor: "#444",
          minWidth: "550px",
        }}
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
      <ImagePreview
        imgSource={imageSrc}
        openImage={imageSrc}
        onClose={() => handleSee(undefined)}
      />
    </>
  );
}
