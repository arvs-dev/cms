"use client";

import React from "react";
import { MainNav } from "@/components/main-nav";
import NewsEventsBento from "@/components/content/news-events";

const page = () => {
  return (
    <>
      <MainNav />
      <NewsEventsBento />
    </>
  );
};

export default page;
