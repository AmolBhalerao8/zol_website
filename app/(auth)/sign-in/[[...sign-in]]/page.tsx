import { SignInPage, redirectAuthenticatedUser } from "@/features/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  await redirectAuthenticatedUser();

  return <SignInPage />;
}
