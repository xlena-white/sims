"use client";

export function DeleteButton({ name, action }: { name: string; action: () => Promise<void> }) {
  return (
    <form action={action}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Delete ${name}? This can't be undone.`)) e.preventDefault();
        }}
        className="btn shrink-0 border border-danger/50 text-danger hover:bg-danger hover:text-ink"
      >
        Delete
      </button>
    </form>
  );
}
