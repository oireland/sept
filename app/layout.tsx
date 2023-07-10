import Header from "./Header";
import "./globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SEPT",
  description: "Sports Event Performance Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          <Toaster toastOptions={{ duration: 1000 }} />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
