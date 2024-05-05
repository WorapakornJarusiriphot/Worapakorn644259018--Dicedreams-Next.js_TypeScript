'use client';

import Image from 'next/image';

// import mealIcon from '@/assets/icons/meal.png';
// import communityIcon from '@/assets/icons/community.png';
// import eventsIcon from '@/assets/icons/events.png';
// import classes from './page.module.css';
// import "./styles.css";
import { FileUpload, FileUploadProps } from '@/components/FileUpload/FileUpload';
import React, { useState } from 'react';
import { AttachFile, Description, PictureAsPdf, Theaters } from '@material-ui/icons';
import Audiotrack from '@material-ui/icons/Audiotrack';
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone';

const handlePreviewIcon = (fileObject: { file: { type: any; }; }, classes: { image: any; }) => {
  const { type } = fileObject.file
  const iconProps = {
    className: classes.image,
  }

  if (type.startsWith("video/")) return <Theaters {...iconProps} />
  if (type.startsWith("audio/")) return <Audiotrack {...iconProps} />

  switch (type) {
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <Description {...iconProps} />
    case "application/pdf":
      return <PictureAsPdf {...iconProps} />
    default:
      return <AttachFile {...iconProps} />
  }
}

setFileObjects(([] as FileObject[]).concat(fileObjects, newFileObjs));

const fileUploadProp: FileUploadProps = {
  accept: 'image/*',
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.files !== null &&
      event.target?.files?.length > 0
    ) {
      console.log(`Saving ${event.target.value}`)
    }
  },
  onDrop: (event: React.DragEvent<HTMLElement>) => {
    console.log(`Drop ${event.dataTransfer.files[0].name}`)
  },
}


export default function PostPlay() {
  const [fileObjects, setFileObjects] = useState([]); // Add this line
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <div className="App">
        {/* <FileUpload {...fileUploadProp} imageButton/> */}
        <FileUpload {...fileUploadProp} />
      </div>
      <DropzoneAreaBase
        fileObjects={fileObjects}
        onAdd={newFileObjs => {
          console.log('onAdd', newFileObjs);
          setFileObjects([].concat(fileObjects, newFileObjs));
        }}
        onDelete={deleteFileObj => {
          console.log('onDelete', deleteFileObj);
        }}
        getPreviewIcon={handlePreviewIcon}
      />
    </>
  );
}
function setFileObjects(arg0: FileObject[]) {
  throw new Error('Function not implemented.');
}

