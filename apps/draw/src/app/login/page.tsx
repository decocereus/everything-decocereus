import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, createSession, SESSION_COOKIE } from "@/lib/auth.ts";

async function login(formData: FormData) {
  "use server";
  const next = String(formData.get("next") || "/");
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }
  const session = await createSession();
  (await cookies()).set(SESSION_COOKIE, session.value, {
    expires: session.expires,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  return (
    <main className="login">
      <form action={login}>
        <input name="next" type="hidden" value={next ?? "/"} />
        <input
          aria-label="Password"
          autoFocus
          className="input"
          name="password"
          placeholder="Password"
          required
          type="password"
        />
        <button className="btn" type="submit">
          Sign in
        </button>
        {error ? <p className="error">Wrong password.</p> : null}
      </form>
    </main>
  );
}
