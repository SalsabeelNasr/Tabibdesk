export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // AppShell handles padding, so we just pass through children
  return <>{children}</>
}

