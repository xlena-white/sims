export interface FormState {
  ok: boolean;
  message: string | null;
}

export const initialFormState: FormState = { ok: false, message: null };

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-chalk-muted">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-chalk-faint">{hint}</span>}
    </label>
  );
}

export function SaveRow({ pending, state, label = "Save" }: { pending: boolean; state: FormState; label?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-1">
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Saving…" : label}
      </button>
      {state.message && (
        <span role="status" className={`text-sm ${state.ok ? "text-mint" : "text-danger"}`}>
          {state.message}
        </span>
      )}
    </div>
  );
}

export function FormCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="card space-y-5 p-6 sm:p-7">
      <legend className="sr-only">{title}</legend>
      <div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        {hint && <p className="mt-1 text-sm text-chalk-faint">{hint}</p>}
      </div>
      {children}
    </fieldset>
  );
}
