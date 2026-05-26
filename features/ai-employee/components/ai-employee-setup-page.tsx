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
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          {isEditing ? "Update ZOL setup" : "Tell ZOL about your shop"}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          {isEditing
            ? "Change how ZOL introduces itself, what it knows about your business, and when you are open."
            : "Add your business name, greeting, and hours so ZOL can answer customer calls helpfully."}
        </p>
      </section>

      <AIEmployeeSetupForm settings={settings} canManage={canManage} />
    </div>
  );
}
