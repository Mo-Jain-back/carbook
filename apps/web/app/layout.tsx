import "@/app/globals.css"
import { NavBar } from "@/components/navbar"
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Jain Car Rentals",
  description: "Track your car bookings with ease",
  icons:"/favicon.png"
}

const teratur = localFont({
  src: "./fonts/teratur-bold.ttf",
  variable: "--font-teratur",
  weight: "100 900",
});

const alcova = localFont({
  src: "./fonts/Alcova-Pro.ttf",
  variable: "--font-alcova",
  weight: "100 900",
});

const xova = localFont({
  src: "./fonts/XOVA-ROUNDED.woff",
  variable: "--font-xova",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${teratur.variable} ${alcova.variable} ${xova.variable} antialiased`}>
        <NavBar/>
        {children}
        </body>
    </html>
  )
}

