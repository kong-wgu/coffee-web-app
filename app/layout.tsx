import "../index.css"
import ClientProviders from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>coffee-slider-display</title>
        <meta name="description" content="Lovable Generated Project" />
        <meta name="author" content="Lovable" />
        <meta property="og:image" content="/og-image.png" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}