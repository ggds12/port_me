import { RootShell } from "../root-shell";

export { viewport } from "../root-shell";

export default function PtLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="pt">{children}</RootShell>;
}
