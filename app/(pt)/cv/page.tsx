import { CvView } from "@/components/views/cv-view";
import { pageMetadata } from "../../root-shell";

export const metadata = pageMetadata("pt", "cv");

export default function Page() {
  return <CvView locale="pt" />;
}
