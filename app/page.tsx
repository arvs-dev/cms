"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { MainNav } from "@/components/main-nav";
import NewsEventsBento from "@/components/content/news-events";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ["/images/slide2.jpg", "/images/slide3.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <main className="w-full bg-primary/10">
      {/* Navigation */}
      <MainNav />
      {/* Hero Slider */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-screen overflow-hidden">
        {/* Slider Navigation */}
        <div className="lg:block hidden">
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 bg-white/20 p-2 sm:p-4 text-white z-10 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 bg-white/20 p-2 sm:p-4 text-white z-10 rounded-full"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Slide Content */}
        <div className="relative w-full h-full ">
          <Image
            src={images[currentIndex]}
            alt="Church Building"
            fill
            className="object-cover brightness-50 grayscale transition-opacity duration-1000"
            priority
          />

          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-24 lg:px-20 text-center sm:text-left bg-gradient-to-t from-primary via-gray-900/50 to-transparent">
            {/* <div className="hidden lg:block">
              <Image
                src={images[currentIndex]}
                alt="Church Building"
                width={500}
                height={500}
                className="lg:pl-16 object-cover rounded-md mb-6 "
                priority
              />
            </div> */}
            <div className="max-w-5xl mx-auto sm:mx-0 lg:mt-96">
              <h1 className="text-white">
                <div className="mt-2 text-4xl py-2 sm:text-5xl md:text-6xl lg:text-6xl font-bold">
                  Northern Luzon Mission
                </div>
                <div className="mt-2 font-sans text-xs sm:text-base md:text-md lg:text-lg">
                  Bringing Hope, Truth, and Inspiration to live by while living
                  and waiting for the second coming of our Lord Jesus Christ.
                </div>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <NewsEventsBento />
    </main>
  );
}
