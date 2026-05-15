// src/app/layout.tsx
// Root layout - required by Next.js. Locale-specific layout is in [locale]/layout.tsx.
// This file only renders children to avoid duplicate <html> tags.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
