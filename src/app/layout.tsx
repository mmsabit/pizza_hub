import type { Metadata } from "next";
import { Epilogue, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ToastContainer } from "react-toastify";

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
      suppressHydrationWarning
      className={`${epilogue.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <Script
          dangerouslySetInnerHTML={{
            __html:
              'const theme = document.cookie.match(/(?:^|; )pizzahub-theme=(dark|light)(?:;|$)/); document.documentElement.dataset.theme = theme?.[1] ?? "light";',
          }}
          id="theme-preference"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full bg-dough-canvas font-body-md text-body-md text-on-surface antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
