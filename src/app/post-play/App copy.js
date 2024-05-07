"use client";

// import "./styles.css";
import { Dropzone, FileItem, ImagePreview } from "@dropzone-ui/react";
import { useState } from "react";
export default function App() {
  const [files, setFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(undefined);
  const updateFiles = (incommingFiles) => {
    console.log("incomming files", incommingFiles);
    setFiles(incommingFiles);
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
        //view={"list"}
        onChange={updateFiles}
        minHeight="195px"
        onClean={handleClean}
        value={files}
        maxFiles={1}
        //header={false}
        // footer={false}
        maxFileSize={29980000}
        //label="Drag'n drop files here or click to browse"
        //label="Suleta tus archivos aquí"
        accept=".png, .jpg, image/*"
        // uploadingMessage={"Uploading..."}
        label="คลิกเพื่ออัพโหลดรูปหรือลากและวางรูปก็ได้" // ตั้งค่าข้อความเป็นภาษาไทย
        uploadingMessage="กำลังอัพโหลด..." // ข้อความสำหรับการอัพโหลด
        acceptTypeLabel="ประเภทที่อนุญาต: .png, .jpg, image/*" // Set custom label
        // localization="th" // ระบุให้เป็นภาษาไทย
        url="https://my-awsome-server/upload-my-file"
        //of course this url doens´t work, is only to make upload button visible
        //uploadOnDrop
        //clickable={false}
        fakeUploading
        //localization={"FR-fr"}
        disableScroll
      >
        {files.length > 0 &&
          files.map((file) => (
            <FileItem
              {...file}
              key={file.id}
              onDelete={onDelete}
              onSee={handleSee}
              //localization={"ES-es"}
              resultOnTooltip
              preview
              info
              hd
            />
          ))}
      </Dropzone>
      {/* <div style={{ color: '#fff', marginTop: '10px' }}>
        ประเภทที่อนุญาต: .png, .jpg, image/*
      </div> */}
      <ImagePreview
        imgSource={imageSrc}
        openImage={imageSrc}
        onClose={(e) => handleSee(undefined)}
      />
    </>
  );
}
