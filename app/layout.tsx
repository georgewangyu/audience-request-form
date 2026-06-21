import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audience Inbox",
  description: "Send George a video idea, feature request, workflow pain, or question.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
