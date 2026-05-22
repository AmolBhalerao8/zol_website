import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { AuthShell } from "@/features/auth/layouts/auth-shell";

export function OnboardingPage() {
  return (
    <AuthShell
      eyebrow="Workspace setup"
      title="Set up your ZOL workspace"
      description="Tell us about your business so ZOL can organize your customer communication and workflows."
      footer={
        <>
          Your workspace keeps customer communication, workflows, and operational intelligence
          organized in one place.
        </>
      }
    >
      <OnboardingForm />
    </AuthShell>
  );
}
