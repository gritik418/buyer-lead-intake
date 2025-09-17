import Wrapper from "@/components/Wrapper/Wrapper";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ReduxProvider from "./providers/ReduxProvider/ReduxProvider";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BLI - Buyer Lead Intake",
  description:
    "This app helps real estate agents and property consultants efficiently capture and manage buyer leads. Users can record detailed buyer information, including contact details, property preferences, budget, timeline, and purpose. Tags and categories make it easy to organize leads for quick follow-up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <Wrapper>
            <ErrorBoundary>{children}</ErrorBoundary>
          </Wrapper>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
