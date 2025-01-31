'use client'

import { Toaster } from "../components/ui/toaster";
import { Toaster as Sonner } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a client inside the component to ensure it's client-side only
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <head>
        <title>coffee-slider-display</title>
        <meta name="description" content="Lovable Generated Project" />
        <meta name="author" content="Lovable" />
        <meta property="og:image" content="/og-image.png" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}