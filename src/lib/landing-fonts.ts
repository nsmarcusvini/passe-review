import { Frank_Ruhl_Libre, Source_Sans_3, Courier_Prime } from "next/font/google";

export const display = Frank_Ruhl_Libre({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  variable: "--font-display",
});

export const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-label",
});
