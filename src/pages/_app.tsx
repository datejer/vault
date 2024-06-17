import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";
import { UserProvider } from "@/contexts/UserContext";

const fontSans = FontSans({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  const user = pageProps.user || null;

  return (
    <UserProvider initialUser={user}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <main
          className={cn(
            "min-h-dvh bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Head>
            <title>vault.dudek.sh</title>
            <meta
              name="description"
              content="Simple, self-hosted and open-source encrypted data vault."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="https://fav.farm/🔐" />
          </Head>
          <style jsx global>{`
            html {
              font-family: ${fontSans.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
          <Toaster position="top-center" richColors />
        </main>
      </ThemeProvider>
    </UserProvider>
  );
}
