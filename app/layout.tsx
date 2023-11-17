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
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          <Toaster position="top-center" />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
