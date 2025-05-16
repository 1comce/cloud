import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/components/fonts";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import ConfigureAmplifyClientSide from "./amplify-cognito";
export const metadata: Metadata = {
  title: "Next.js Cognito Authentication",
  description: "Cognito authenticated Next.js app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <ConfigureAmplifyClientSide />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
