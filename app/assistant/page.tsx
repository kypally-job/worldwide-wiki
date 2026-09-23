import type { Metadata } from "next";
import AssistantWorkspace from "@/components/AssistantWorkspace";

export const metadata: Metadata = {
  title: "Assistant — Worldwide WIKI",
  description:
    "WW Assistant Sakura: country picks, seasons, and Worldwide WIKI knowledge sections.",
};

export default function AssistantPage() {
  return <AssistantWorkspace />;
}
