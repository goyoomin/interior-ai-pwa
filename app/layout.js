import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "react-hot-toast";
import StudentCaptureBadge from "./_components/StudentCaptureBadge";

export const metadata = {
  title: "Interior AI",
  description: "AI-powered interior design app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Interior AI",
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Provider>
            {children}
            <StudentCaptureBadge />
            <Toaster position="top-center" />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}