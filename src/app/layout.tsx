import { Roboto, Space_Grotesk } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Add this script to detect Declarative Shadow DOM support
const dsdScript = `
  if (
    HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode') ||
    HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')
  )
    document.documentElement.setAttribute('data-supports-dsd', '')
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: dsdScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
