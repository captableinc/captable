import type { Metadata } from "next";
import "@/styles/globals.css";
import logo from "@/assets/logo.svg";
import { PublicEnvScript } from "@/components/public-env-script";
import ScreenSize from "@/components/screen-size";
import { ThemeProvider, ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/utils";
import { ProgressBarProvider } from "@/providers/progress-bar";
import { TRPCProvider } from "@/providers/trpc-provider";
import { robotoMono, satoshi } from "@/styles/fonts";
import { META } from "@captable/utils/constants";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: META.title,
    template: `%s | ${META.title}`,
  },

  description: META.description,
  icons: [
    {
      rel: "icon",
      url: logo.src,
    },
  ],

  openGraph: {
    title: META.title,
    description: META.description,
    images: [logo.src],
  },

  twitter: {
    card: "summary_large_image",
    title: META.title,
    description: META.description,
    images: [logo.src],
  },

  metadataBase: new URL(META.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html
      lang="en"
      className={cn(satoshi.variable, robotoMono.variable)}
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for theme application before render
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = 'captable-theme';
                  var theme = localStorage.getItem(storageKey) || 'system';
                  var root = document.documentElement;
                  
                  root.classList.remove('light', 'dark');
                  
                  if (theme === 'system') {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                    root.style.colorScheme = systemTheme;
                  } else {
                    root.classList.add(theme);
                    root.style.colorScheme = theme;
                  }
                } catch (e) {
                  // Fallback to light theme if anything fails
                  document.documentElement.classList.add('light');
                  document.documentElement.style.colorScheme = 'light';
                }
              })();
            `,
          }}
        />
        <PublicEnvScript />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <TRPCProvider cookies="">
          <ThemeProvider defaultTheme="system" storageKey="captable-theme">
            <main>
              <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
              </div>
              {children}
              <Toaster richColors position="bottom-right" />
              {isDev && <ScreenSize />}
            </main>
          </ThemeProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
