import { redirectAuthenticatedUser } from "@/features/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  await redirectAuthenticatedUser();

  redirect("/request-access");
}
