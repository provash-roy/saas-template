import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/api/webhook/register",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isPublicRoute(req)) {
    if (userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const role = user.publicMetadata.role;
        return NextResponse.redirect(
          new URL(
            role === "admin" ? "/admin/dashboard" : "/dashboard",
            req.url,
          ),
        );
      } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.redirect(new URL("/error", req.url));
      }
    }
    return;
  }

  if (isAdminRoute(req)) {
    await auth.protect((has) => has({ role: "admin" }));
    return;
  }

  if (isDashboardRoute(req)) {
    await auth.protect();
    return;
  }

  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
