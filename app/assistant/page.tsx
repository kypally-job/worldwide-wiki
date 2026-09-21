import type { Metadata } from "next";
import AssistantWorkspace from "@/components/AssistantWorkspace";

export const metadata: Metadata = {
  title: "Ассистент — Worldwide WIKI",
  description:
    "WW Ассистент Сакура: подбор стран, сезонов и разделов базы Worldwide WIKI.",
};

export default function AssistantPage() {
  return <AssistantWorkspace />;
}
