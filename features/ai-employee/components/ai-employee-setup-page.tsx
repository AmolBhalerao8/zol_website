import { AIEmployeeSetupForm } from "@/features/ai-employee/components/ai-employee-setup-form";
import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { canManageAIEmployee } from "@/features/ai-employee/utils/can-manage-ai-employee";
import { requireWorkspace } from "@/features/workspace";

export async function AIEmployeeSetupPage() {
  const currentWorkspace = await requireWorkspace();
  const settings = await getAIEmployeeSettings(currentWorkspace.workspace.id);
  const canManage = canManageAIEmployee(currentWorkspace.role);
  const isEditing = Boolean(settings);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <div className="mb-3 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
          AI employee setup
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          {isEditing ? "Update your AI employee" : "Teach ZOL about your business"}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          {isEditing
            ? "Update how ZOL introduces itself, what it knows about your business, and when you are open."
            : "Tell ZOL about your business so it can answer customer calls with helpful, specific responses."}
        </p>
      </section>

      <AIEmployeeSetupForm settings={settings} canManage={canManage} />
    </div>
  );
}
