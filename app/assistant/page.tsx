import { redirect } from "next/navigation";
import AssistantWorkspace from "@/components/AssistantWorkspace";
import { FEATURES } from "@/lib/features";

export const metadata = {
  title: "Assistant — Worldwide WIKI",
  description:
    "WW Assistant Sakura: country picks, seasons, and Worldwide WIKI knowledge sections.",
};

export default function AssistantPage() {
  if (!FEATURES.assistant) {
    redirect("/countries");
  }

  return <AssistantWorkspace />;
}
