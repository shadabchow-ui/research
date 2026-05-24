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
