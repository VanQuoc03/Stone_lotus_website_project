import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ChatBot from "@/components/common/ChatBot";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ChatBot />
    </>
  );
}
