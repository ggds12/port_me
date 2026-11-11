import { HomeView } from "@/components/views/home-view";
import { pageMetadata } from "../root-shell";

export const metadata = pageMetadata("pt", "home");

export default function Page() {
  return <HomeView locale="pt" />;
}
