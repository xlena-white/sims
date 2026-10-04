"use client";

import { useActionState } from "react";
import { Field, FormCard, initialFormState, SaveRow } from "@/components/admin/form-bits";
import { PhotoUpload } from "@/components/admin/photo-upload";
import { GEN_ACCENT, type Generation, type SiteSettings } from "@/lib/types";
import { updateGeneration, updateSettings } from "./actions";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(updateSettings, initialFormState);
  return (
    <form action={action}>
      <FormCard title="The site" hint="The title and words on the home page.">
        <Field label="Title">
          <input name="title" defaultValue={settings.title} required className="field text-lg" />
        </Field>
        <Field label="Subtitle" hint="Small line above the title.">
          <input name="subtitle" defaultValue={settings.subtitle ?? ""} className="field" />
        </Field>
        <Field label="Quote" hint="Optional line in italics under the title.">
          <textarea name="epigraph" defaultValue={settings.epigraph ?? ""} rows={2} className="field resize-none" />
        </Field>
        <SaveRow pending={pending} state={state} />
      </FormCard>
    </form>
  );
}

export function GenerationForm({ generation }: { generation: Generation }) {
  const [state, action, pending] = useActionState(updateGeneration, initialFormState);
  return (
    <form action={action}>
      <input type="hidden" name="number" value={generation.number} />
      <FormCard title={`Generation ${generation.number}`}>
        <span aria-hidden className={`-mt-3 block h-1 w-10 rounded-full ${GEN_ACCENT[generation.number].bg}`} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" defaultValue={generation.name} required className="field" />
          </Field>
          <Field label="Tagline">
            <input name="tagline" defaultValue={generation.tagline ?? ""} className="field" />
          </Field>
        </div>
        <Field label="Description">
          <textarea name="description" defaultValue={generation.description ?? ""} rows={3} className="field resize-y" />
        </Field>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Cover image</span>
          <PhotoUpload name="cover_image_url" folder="generations" defaultValue={generation.cover_image_url} />
        </div>
        <SaveRow pending={pending} state={state} />
      </FormCard>
    </form>
  );
}
