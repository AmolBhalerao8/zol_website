import { DashboardOverview } from "@/features/dashboard";
import { getCurrentWorkspace } from "@/features/workspace";

export default async function DashboardPage() {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    return null;
  }

  return <DashboardOverview workspace={currentWorkspace.workspace} />;
}
