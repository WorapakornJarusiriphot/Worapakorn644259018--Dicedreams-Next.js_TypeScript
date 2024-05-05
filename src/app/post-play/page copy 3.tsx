'use client';

import Image from 'next/image';

// import mealIcon from '@/assets/icons/meal.png';
// import communityIcon from '@/assets/icons/community.png';
// import eventsIcon from '@/assets/icons/events.png';
// import classes from './page.module.css';
// import "./styles.css";
import React from 'react';
import { FileUpload, FileUploadProps } from '@/components/FileUpload/FileUpload';
import { DropzoneAreaBase } from 'material-ui-dropzone';

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
        acceptedFiles={['image/*']}
        dropzoneText={"Drag and drop an image here or click"}
        onDrop={(files) => console.log('Files:', files)}
        onAlert={(message, variant) => console.log(`${variant}: ${message}`)} fileObjects={[]}      />
    </>
  );
}
