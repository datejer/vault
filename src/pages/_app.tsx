import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter as FontSans } from "next/font/google";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/contexts/UserContext";
import { instanceName } from "@/lib/instanceName";
import { cn } from "@/lib/utils";

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
        <main className={cn("min-h-dvh bg-background font-sans antialiased", fontSans.variable)}>
          <Head>
            <title>{instanceName}</title>
            <meta
              name="description"
              content="Simple, self-hosted and open-source encrypted data vault."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1 maximum-scale=1, user-scalable=no"
            />
            <link rel="icon" href="https://fav.farm/🔐" />
          </Head>
          {/* eslint-disable-next-line react/no-unknown-property */}
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
