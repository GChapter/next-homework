import Header from "@/components/header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [role, setRole] = useState("Admin");
  return (
    <>
      <Header role={role} setRole={setRole} />
      <Component {...pageProps} role={role} />
    </>
  );
}
