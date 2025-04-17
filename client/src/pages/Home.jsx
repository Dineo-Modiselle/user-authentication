import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("assets/..assets2/bg_img.png")] bg-cover bg-center'>
      <Navbar />
      <Header/>
    </div>
  );
}

export default Home;
