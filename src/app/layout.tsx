import type { Metadata } from "next";
import { Bai_Jamjuree, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin']
})

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: "--font-bai-jamjuree",
});

export const metadata: Metadata = {
  title: "Gallery",
  description: "Uma galeria de fotos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}, ${baiJamjuree.variable} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  );
}
