import { ReactNode } from "react";

import { protectPlatformRoute } from "@/features/auth";
import { DashboardShell } from "@/features/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await protectPlatformRoute();

  return <DashboardShell>{children}</DashboardShell>;
}
