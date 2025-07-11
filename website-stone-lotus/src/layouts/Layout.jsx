import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import AIChatBox from "@/pages/chat/AIChatBox";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <AIChatBox />
    </>
  );
}
