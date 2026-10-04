import type { Metadata } from "next";
import { Plumbob } from "@/components/plumbob";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(142,228,161,0.10),transparent_55%)]"
      />
      <div className="card relative w-full max-w-sm animate-rise p-8 sm:p-10">
        <Plumbob className="mx-auto h-12 w-auto animate-bob" />
        <h1 className="mt-6 text-center font-display text-4xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-center text-chalk-muted">Sign in to open the family album.</p>
        <div className="mt-8">
          <LoginForm next={typeof next === "string" ? next : "/"} />
        </div>
      </div>
    </main>
  );
}
