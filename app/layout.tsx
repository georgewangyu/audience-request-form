import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://requests.snackoverflowgeorge.com"),
  title: "Audience Inbox",
  description: "Send George a video idea, feature request, workflow pain, or question.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Audience Inbox",
    description: "Send George a video idea, feature request, workflow pain, or question.",
    url: "https://requests.snackoverflowgeorge.com",
    type: "website",
  },
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
