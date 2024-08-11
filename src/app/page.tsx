'use client';

import React, { Suspense } from 'react';
import Home from "@/Page/Home";
// import Image from "next/image";
// import { useState } from "react";
// import "./App.css";
// import Navbar from './components/Navbar'
// import InputFileUpload from './components/FileUpload'
// import RegistrationForm from './Page/SignUp'
// import EbookFormMui from './Page/Add-book page'
// import Join from "@/Page/Join";
// import Header from "@/components/header/Header";
// import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <main>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        </div>
      </main>
    </>
  );
}
