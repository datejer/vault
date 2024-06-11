import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main
        className={cn(
          "min-h-dvh bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <style jsx global>{`
          html {
            font-family: ${fontSans.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
        <Toaster position="top-center" richColors />
      </main>
    </ThemeProvider>
  );
}
