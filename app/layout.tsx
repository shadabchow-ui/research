import { Navbar } from "components/layout/navbar";
import Footer from "components/layout/footer";
import { ThemeProvider } from "components/theme-provider";
import { WelcomeToast } from "components/welcome-toast";
import { geistSans, inter } from "lib/fonts";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME || "Upcube Avatar Cloud",
    template: `%s | ${SITE_NAME || "Upcube Avatar Cloud"}`,
  },
  description:
    "Live AI avatars and studio avatar videos for websites, training, sales, education, support, and creators.",
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("upcube-theme");if(t==="light")document.documentElement.classList.remove("dark");else if(!t&&window.matchMedia("(prefers-color-scheme:light)").matches)document.documentElement.classList.remove("dark");else document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>
            {children}
            <Toaster closeButton />
            <WelcomeToast />
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
