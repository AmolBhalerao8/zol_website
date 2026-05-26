import { SignInPage, redirectAuthenticatedUser } from "@/features/auth";

export default async function Page() {
  await redirectAuthenticatedUser();

  return <SignInPage />;
}
