import Link from "next/link";
import { Plumbob } from "@/components/plumbob";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <Plumbob className="h-14 w-auto animate-bob" color="var(--color-danger)" />
      <h1 className="mt-8 font-display text-4xl font-semibold sm:text-5xl">Nobody lives here</h1>
      <p className="mt-3 text-chalk-muted">This page doesn&apos;t exist, or it was moved out.</p>
      <Link href="/" className="btn btn-primary mt-10">
        Back home
      </Link>
    </main>
  );
}
