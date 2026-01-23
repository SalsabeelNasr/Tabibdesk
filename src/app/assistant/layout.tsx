import { AppShell } from "@/components/shell/AppShell"

export default function AssistantLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppShell role="assistant">{children}</AppShell>
}
