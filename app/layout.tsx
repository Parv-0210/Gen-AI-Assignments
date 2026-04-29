import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scaler Persona Chat — Talk to Anshuman, Abhimanyu & Kshitij",
  description:
    "Have real AI-powered conversations with Scaler Academy's founders and top instructors. Built for Scaler's Prompt Engineering assignment.",
  keywords: [
    "Scaler Academy",
    "InterviewBit",
    "Anshuman Singh",
    "Abhimanyu Saxena",
    "Kshitij Mishra",
    "AI Chatbot",
    "Prompt Engineering",
  ],
  openGraph: {
    title: "Scaler Persona Chat",
    description: "AI conversations with Scaler's founders and instructors",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
