import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/conversations(.*)",
  "/customers(.*)",
  "/integrations(.*)",
  "/onboarding",
  "/auth/continue",
  "/setup/ai-employee",
  "/setup/voice-channel",
]);

const hasClerkKeys =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

function localAuthFallback(request: NextRequest) {
  if (isProtectedRoute(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export default hasClerkKeys
  ? clerkMiddleware(async (auth, request) => {
      if (isProtectedRoute(request)) {
        const { userId, redirectToSignIn } = await auth();

        if (!userId) {
          return redirectToSignIn({ returnBackUrl: request.url });
        }
      }
    })
  : localAuthFallback;

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/conversations(.*)",
    "/customers(.*)",
    "/integrations(.*)",
    "/onboarding",
    "/auth/continue",
    "/setup/ai-employee",
    "/setup/voice-channel",
    "/(api|trpc)(.*)",
  ],
};
