"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { MainNav } from "@/components/main-nav";
import { ContentSubmissionForm } from "@/components/content-submission-form";
import { ContentForm } from "@/components/content/content-form";
import { Footer } from "@/components/footer";

const images = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t3VTka6vIA6pyoXAPNaKBlhEjKTOy7.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3.png",
];

export default function Home() {
  const dateYear = new Date().getFullYear();
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const images = [
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide3.jpg",
  ];

  return (
    <main className="w-full">
      {/* Navigation */}
      <MainNav />

      {/* Hero Slider */}
      <div className="relative w-full h-[50vh] md:h-[75vh] lg:h-screen overflow-hidden">
        {/* Slider Navigation */}
        <div>
          <button
            onClick={prevSlide}
            className="absolute left-10 top-1/2 -translate-y-1/2 bg-[#FCA311]/20 p-2 sm:p-4 text-white z-10 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-10 top-1/2 -translate-y-1/2 bg-white/20 p-2 sm:p-4 text-white z-10 rounded-full"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Slide Content */}
        <div className="relative w-full h-screen ">
          <Image
            src={images[currentIndex]}
            alt="Church Building"
            fill
            className="object-cover brightness-50 transition-opacity duration-1000"
            priority
          />
          {/* mt-96 pt-48 */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-24 lg:px-36 text-center sm:text-left bg-gradient-to-t from-primary via-stone-500/50 to-transparent">
            <Image
              src={images[currentIndex]}
              alt="Church Building"
              width={900}
              height={900}
              className="lg:pl-16 object-cover rounded-md mb-6"
              priority
            />
            <div className="max-w-5xl mx-auto sm:mx-0">
              <h1 className="text-white lg:pl-16 mb-4">
                <div className="mt-2 text-7xl font-bold">
                  Northern Luzon Mission
                </div>
                <div className="mt-2 font-sans">
                  Bringing Hope, Truth and Inspiration to live by while living
                  and waiting for the second coming of our Lord Jesus Christ.
                </div>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <section className="h-screen bg-gray-100">
        <div>
          <p>dasd</p>
        </div>
      </section>
    </main>
  );
}
