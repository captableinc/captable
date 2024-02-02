import { Instrument_Sans, Roboto_Mono } from "next/font/google";

export const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  adjustFontFallback: false,
});
