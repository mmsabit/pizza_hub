import type { Metadata } from "next";
import { Epilogue, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PizzaHub — Hot & Fresh Wood-Fired Pizza Delivered",
  description:
    "Handcrafted artisan dough, San Marzano tomato sauce and 100% whole-milk mozzarella, stone-baked at 450°C and delivered to your door in under 30 minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        {/* Icon font for the Material Symbols used across the page. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-dough-canvas font-body-md text-body-md text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
