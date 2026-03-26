import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  const cookieStore = await cookies();

  const invite = type === "invite";
  const destination = invite ? "/auth/set-password" : "/dashboard";
  const response = NextResponse.redirect(new URL(destination, request.url));

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("exchangeCodeForSession", error);
      return NextResponse.redirect(
        new URL("/login?error=session", request.url),
      );
    }

    const invitedEmail = data.session?.user?.email;
    if (invite && invitedEmail) {
      const dest = new URL("/auth/set-password", request.url);
      dest.searchParams.set("for", invitedEmail);
      const finalResponse = NextResponse.redirect(dest);
      for (const c of response.cookies.getAll()) {
        finalResponse.cookies.set(c.name, c.value, c);
      }
      return finalResponse;
    }
  }

  return response;
}
