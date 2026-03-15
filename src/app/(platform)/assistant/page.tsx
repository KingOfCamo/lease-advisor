import { PageHeader } from "@/components/layout/page-header";
import { ChatInterface } from "@/components/assistant/chat-interface";

export const dynamic = "force-dynamic";

export default function AssistantPage() {
  return (
    <div>
      <PageHeader
        title="Assistant"
        description="Ask questions about your clients, leases, analyses, and portfolio"
      />
      <ChatInterface />
    </div>
  );
}
