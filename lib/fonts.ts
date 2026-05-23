import localFont from "next/font/local";

export const inter = localFont({
  src: "../public/fonts/inter/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
  display: "swap",
});

export const interItalic = localFont({
  src: "../public/fonts/inter/Inter-Italic-VariableFont_opsz,wght.ttf",
  variable: "--font-inter-italic",
  display: "swap",
});

export const geistSans = localFont({
  src: "../public/fonts/geist/Geist-VariableFont_wght.ttf",
  variable: "--font-geist-sans",
  display: "swap",
});

export const geistItalic = localFont({
  src: "../public/fonts/geist/Geist-Italic-VariableFont_wght.ttf",
  variable: "--font-geist-italic",
  display: "swap",
});
