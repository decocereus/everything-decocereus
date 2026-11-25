import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { checkPassword, createSession, SESSION_COOKIE } from "@/lib/auth";

async function login(formData: FormData) {
  "use server";
  const next = String(formData.get("next") || "/");
  if (!checkPassword(String(formData.get("password") ?? ""))) redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  const session = await createSession();
  (await cookies()).set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expires,
  });
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next } = await searchParams;
  return (
    <main className="login">
      <form action={login}>
        <input type="hidden" name="next" value={next ?? "/"} />
        <input className="input" type="password" name="password" placeholder="Password" autoFocus required aria-label="Password" />
        <button className="btn" type="submit">Sign in</button>
        {error ? <p className="error">Wrong password.</p> : null}
      </form>
    </main>
  );
}
